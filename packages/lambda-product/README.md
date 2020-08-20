# Salon Manager API - Salon

This is backend API of Salon Manager app. It is built with Serverless architecture.

## Technical Stack

- Node.js 12.x
- Serverless framework
- AWS Lambda
- AWS API Gateway
- AWS S3 (packages deployed)
- AWS CloudWatch (Logs storage)
- AWS RDS (PostgreSQL database)
- AWS System Manager (Parameters, System Config)
- AWS Secrets Manager
- AWS ElasticCache

## Repository structure

First, let's start by quickly looking at the common terms used when talking Serverless Framework:

- Service: A service what you might call a Serverless project. It has a single `serverless.yml` file driving it insides.

- Application: An application or app is a collection of multiple service

In our case, the repository is structured follow to `Micro-services + Monorepo` pattern.

### Folders explanation

```YML
- bin
  - ci-build.sh                     # Build services script
  - ci-decommission.sh              # Remove services deployed
  - ci-deploy.sh                    # Deploy services script
- layers                            # Lambda layers for sharing run-time functions
- mocks                             # Mocks JSON for testing and invoke functions locally
- src
  - _database                       # Database as Serverless API
  - _gateway                        # API Gateway as Serverless API
  - _shared
    - configs                       # Shared configurations
    - constants                     # Constants ?
    - resources                     # Shared Serverless resources
    - services                      # Shared business logics
    - utils                         # Shared utilities
  - [serverless-services-monorepo]
  - ...
- tests                             # Unit tests
```

## Setup Development

- Install serverless framework

```Shell
  $npm i -g serverless
```

- Install dependencies

```Shell
  $npm install
```

### Deploy DEV AWS Serverless micro-services

```Shell
  $npm run deploy
```

In directories `sls/serverless --stage dev --profile dev`

### Deploy PROD AWS Serverless micro-services

```Shell
  $npm run deploy:prod
```

In directories `sls/serverless --stage prod --profile prod`

### Runing unit tests

- All tests: `npm run test:unit`
- A specific service tests: `cd src/{service-name}` then `npm run test:unit`
- A specific file only: `npx mocha --spec "path/or/glob/file.spec.js"`, don't forget the double quotes.

#### Babel configuration

The file `babel.config.json` is the root Babel configuration whose plugins and presets are copied from serverless-bundle's [Babel configurations](https://github.com/AnomalyInnovations/serverless-bundle/blob/master/scripts/config/babelJestTransform.js). The goal is for `mocha` to run in same Babel configuration as production code.

#### Mocha configuration

In `package.json` file of each service folder, we define a test script to invoke test in root `package.json` with overriden file path. So that we can `cd` into a specific service folder and execute tests for that service only.
