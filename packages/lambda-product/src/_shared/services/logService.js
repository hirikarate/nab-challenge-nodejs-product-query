import * as Sentry from '@sentry/node';
import winston from 'winston';


import commonKeys from '../constants/dependencyKeys/common';
import awsKeys from '../constants/dependencyKeys/aws';
import dependencyContainer from '../utils/dependencyContainer';
import {
  assertIsTruthy,
} from '../utils/validationHelpers';


Sentry.init({
  attachStacktrace: true,
  debug: !process.env.SLS_ENV,
  environment: process.env.SLS_ENV === 'prod' ? 'PRODUCTION' : 'DEV',
  dsn: process.env.SLS_SENTRY
});

// For back-compatibility
// Prevents errorHandler from calling Sentry.init() again.
global.__isSentryInited__ = true;


const assertIsString = (target, targetName, suffixMessage='') =>
  assertIsTruthy(
    typeof target === 'string',
    `"${targetName}" must be a string! ${suffixMessage}`,
  );


/**
 * Provides logging features.
 * All logged messages are written to AWS CloudWatch.
 * Messages with level 'error', 'crit' and 'emerg' are also pushed to Sentry.
 */
class LoggingService {
  #displayedContext = 'logService';

  #logger = null;

  #fullContext = '';

  /**
   * @param {string} currentContext The file name or scope name to appear at the beginning of log entry.
   */
  constructor(currentContext, parentLogger, parentContext) {
    assertIsString(currentContext, 'currentContext', 'It should be the file name or scope name.');

    currentContext = currentContext || 'logService';
    const lastSegment = currentContext.split(':')[0];
    this.#displayedContext = lastSegment;

    this.#fullContext = (parentContext
      ? `${parentContext}:${currentContext}`
      : currentContext);
    this._createLogger(parentLogger);
  }

  /**
   * Logs a brief message regardless the environment is DEV or PROD.
   * So use it wisely.
   *
   * @param {string} message The message to log.
   */
  info(message) {
    this.logAsync('info', message);
  }

  /**
   * Logs a debugging message only when the environment is DEV.
   *
   * @param {string} message The message to log.
   * @param {...any[]} meta Will be serialized and written to log.
   */
  debug(message, ...meta) {
    this.logAsync('debug', message, ...meta);
  }

  /**
   * Logs an error to console and pushes it to Sentry
   * regardless the environment is DEV or PROD.
   * This method can be called without `init()` being called first.
   *
   * @param {object} error The error or exception object.
   * @param {...any[]} meta Will be serialized and written to log.
   */
  async errorAsync(error, ...meta) {
    const lambdaEvent = dependencyContainer.tryResolve(commonKeys.LAMBDA_EVENT, {});
    const errorMessage = error.message || '';
    if (errorMessage) {
      // Avoid duplicate message in log
      // because Winston appends `meta.message` to message
      delete error.message;
    }
    const errorMeta = [error, ...meta, {
      requestContext: lambdaEvent.requestContext,
    }];
    await this.logAsync('error', errorMessage, ...errorMeta);
  }

  /**
   * Logs a message with given `level`.
   *
   * @param {string} message The message to log.
   * @param {...any[]} meta Will be serialized and written to log.
   */
  async logAsync(level, message, ...meta) {
    // Emergency calls need no assertions.
    if (level === 'error') {
      const exception = meta[0] || {};
      exception.__CONTEXT = this.#fullContext;
      this.#logger.error(message, ...meta);
      Sentry.captureException(exception);
      /*
       * Forces writing to Sentry but makes sure it's not longer than 2 seconds.
       * Source: https://github.com/getsentry/sentry-javascript/issues/1449#issuecomment-507298606
       */
      await Sentry.flush(2000);

    } else {
      assertIsString(message, 'message');
      this.#logger.log(level, message, ...meta);
    }
  }

  /**
   * Creates new child logger instanse with `contextName`
   * included in log entries.
   *
   * @param {string} contextName The name to appear in logged messages.
   * @param {string?} parentContextName The optional name to appear in logged error messages.
   *
   * @example
   * let logger = createLogger('lambdas:webhooks');
   * await logger.init();
   * logger = logger.newContext('webHookHandler:processEvent');
   * logger.info(`Received event ${event.type}`);
   *
   * @example
   * const logger = dependencyContainer
   *    .resolve(dependencyKeys.LOGGER);
   *    .newContext('getEmployeeById');
   * logger.debug('Before call', params);
   * const result = employeeService.getEmployeeById(params);
   * logger.debug('After call', result);
   */
  newContext(contextName, parentContextName) {
    return new LoggingService(contextName, this.#logger, parentContextName || this.#fullContext);
  }


  //#region Private methods

  _createLogger(parentLogger) {
    if (parentLogger) {
      this.#logger = parentLogger.child({
        __CONTEXT: this.#displayedContext,
      });

    } else {
      /* Reference lambda event object */
      const lambdaEvent = dependencyContainer.tryResolve(commonKeys.LAMBDA_EVENT, {
        requestContext: {
          identity: {
            userAgent: 'logService'
          }
        }
      });

      this.#logger = winston.createLogger({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.splat(),
          winston.format.printf(
            info => `__${info.level.toUpperCase()}__ `
              + `[Messages] ${JSON.stringify(info.message)} —— [Meta] ${rest(info)}`
          ),
        ),
        exitOnError: false,
        defaultMeta: {
          __CONTEXT: this.#displayedContext,
        },
        transports: [
          new winston.transports.Console({
            handleExceptions: true,
            level: 'debug',
          }),
        ],
      });
    }
  }

  //#endregion Private methods

}


/*
 * Simple helper for stringifying all remaining
 * properties.
 */
function rest(info) {
  return JSON.stringify(Object.assign({}, info, {
    level: undefined,
    message: undefined,
    splat: undefined,
    label: undefined,
    timestamp: undefined,
  }));
}


/**
 * Create Logger class
 * @param context
 * @param debug
 * @param label
 * @param level
 *
 * Usages:
 *  In internal functions:
 *     Logger({
 *       level:   'info',
 *       context: [file.name],
 *       label:   [function.name],
 *       debug:   process.env.SLS_DEBUG
 *     }).debug(response, { name: [Action] });
 *
 *  Or in handler functions:
 *    Logger(logParams).info(event, [meta]);
 **/
export const createLegacyLogger = (params) => {
  /* Reference lambda event object */
  const lambdaEvent = dependencyContainer.tryResolve(commonKeys.LAMBDA_EVENT, {
    requestContext: {
      identity: {
        userAgent: 'logService'
      }
    }
  });

  const level = params.level || 'debug';
  const meta = {
    __CONTEXT: params.context,
    __FUNCTION: params.label
  };

  /**
   * Create logger object
   * If we are in debug mode,
   * then log to the `console` with combined format from debug level and below
   */
  const logger = winston.createLogger({
    level: level,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.splat(),
      winston.format.printf(info => `__${info.level.toUpperCase()}__ ${lambdaEvent.requestContext.identity.userAgent}: [Meta] ${params.requestId} ${rest(info)} -- [Messages] ${JSON.stringify(info.message)}`)
    ),
    defaultMeta: meta,
    exitOnError: false,
    silent: !params.debug,
    transports: [
      new winston.transports.Console({
        handleExceptions: true
      })
    ]
  });

  return logger;
};



/**
 * Creates an instance of logging service and registers it to dependency container.
 *
 * @param {string?} logContext The file name or scope name to appear at the beginning of log entry.
 * @returns {LoggingService}
 *
 * @example
 * const logger = createLogger('lambdas:webhooks');
 * await logger.init();
 * logger.newContext('webHookHandler:processEvent').info(`Received event ${event.type}`);
 * // Output:
 * // __INFO__ 2020-08-01T07:44:41.110Z: [webHookHandler.processEvent] — Message: Received event payment.created

 * @example
 * const logger = dependencyContainer
 *    .resolve(dependencyKeys.LOGGER);
 *    .newContext('getEmployeeById');
 * logger.debug('Before call', params);
 * const result = employeeService.getEmployeeById(params);
 * logger.debug('After call', result);
 * // Output:
 * // __DEBUG__ 2020-08-01T07:44:41.110Z: [employeeService.getEmployeeById] — Message: Before call — Meta: {.....}
 * // __DEBUG__ 2020-08-01T07:44:41.220Z: [employeeService.getEmployeeById] — Message: After call — Meta: {.....}
 */
export default function createLoggingService(logContext = '') {
  return new LoggingService(logContext);
}

/**
 * Attempts to resolve a logger instance from dependencyContainer,
 * if failed, create new one with provided `contextName`.
 *
 * @returns {LoggingService}
 */
export const useLogger = (contextName) => {
  const logger = dependencyContainer.tryResolve(commonKeys.LOGGING_SERVICE, null);
  if (!logger) {
    return createLoggingService(contextName);
  }
  return contextName ? logger.newContext(contextName) : logger;
};

export const withLogger = (contextName) =>
  /**
   * @param {(logger, args) => args} callback
   */
  (callback) => (args) => {
    const logger = useLogger(contextName);
    callback(logger, args);
    return args;
  };
