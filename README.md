# iCommerce product query demo

---
## OVERVIEW

* _Architecture_: Microservice
* _Tech stacks_:
   - TypeScript opensource microservice framework [Micro Fleet](https://github.com/gennovative/micro-fleet) (**Disclaimer**: I develop it)
   - AWS ElasticSearch
   - Redis cache / AWS ElasticCache
   - Postgresql database / AWS RDS
   - Docker Swarm / AWS EC2
   - RabbitMQ
* _Diagrams_: In folder `/packages/docs/images`
   - [ERD Diagram](./packages/docs/images/icommerce-entity-relationship-diagram.png)
   - [Component Diagram](./packages/docs/images/icommerce-component-diagram.png)

## HOW TO USE

### Running

The quickest way is to spin up a group of Docker Swarm services that I already configured:

- Download [this file `constants.sh`](https://drive.google.com/file/d/1tI6t6mOhdQaXAyf2bDQHjTANux5EIcXT/view?usp=sharing) and replace the one in folder `_/docker/`. It includes my **public** AWS ElasticSearch and AWS RDS Postgresql **credentials** for your convenience. I will disable it soon.
- `cd _docker`
- `docker swarm init`
- `bash ./deploy.sh` to spin up Swarm services
- Later, `bash ./undeploy.sh` to destroy it

### Calling APIs

- Import [Postman collection](./packages/docs/source/NAB-iCommerce.postman_collection.json) in folder `packages/docs/source`
- Import [Postman environment](./packages/docs/source/NAB-Challenge-Container.postman_environment.json) in folder `packages/docs/source`
- Only the two APIs "Filter products" and "Advanced search product" in Postman folder "Product" are public.
- The others require access token in Authentication header (I already configured it for your convenience).

## Available APIs
- Branch CRUD (POST, PATCH, GET, DELETE)
- Category CRUD
- Product CRUD
   - Creating, editing and deleting operations will update ElasticSearch indices also.
   - Getting by ID, filtering and searching will write audit logs to database table `nab_request_logs`.
- Product filter and advanced search

---

## HOW TO DEVELOP

If you prefer doing everything manually, please follow these instructions:

### Compiling source code

- Standing at monorepo root
- `yarn`: To install dependencies.
- Service settings can be customized each service package in `packages/{SERVICE NAME}/src/app/configs.ts`
- Run `yarn build` to transpile ALL services.
- Run `yarn dev` to run ALL services and watch for changes.
- Run `yarn start` to run ALL services.
- Run `yarn test` to run unit tests.


### Database migration
This demo uses PostgreSQL, you can change database credentials in `_database/knexfile.js`. If you don't already have PostgreSQL installed, the quickest way is run a Docker image:

  ```bash
  docker run -d -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:11-alpine
  ```

We use database migration file for more fine-grained control of table creation:

- `cd _database`
- `npx knex migrate:latest` to create tables.
- `npx knex seed:run` to insert seed data.

- To re-run migration, go to database then truncate table `knex_migrations.`

### Setup RabbitMQ

- If you don't already have RabbitMQ installed, the quickest way is run a Docker image, including the management board:

  ```bash
  docker run -d -p 15672:15672 -p 5672:5672 rabbitmq:3.7-management-alpine
  ```

- Open webpage at URL `http://localhost:15672` and login with username/password `guest/guest`.
