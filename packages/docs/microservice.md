# Microservice documentation

## ERD diagram

![ERD Diagram](./images/icommerce-entity-relationship-diagram.png "Entity Relationship Diagram")

## Component diagram

![ERD Diagram](./images/icommerce-microservice-component-diagram.png "Entity Relationship Diagram")

## How to use

### Running

The quickest way is to spin up a group of Docker Swarm services that I already configured:

- Download [this file `constants.sh`](https://drive.google.com/file/d/1tI6t6mOhdQaXAyf2bDQHjTANux5EIcXT/view?usp=sharing) and replace the one in folder `_/docker/`. It includes my public AWS ElasticSearch and AWS RDS Postgresql **credentials (Access key and Secrets)** for your convenience. I will disable it soon.
- `cd _docker`
- `docker swarm init`
- `bash ./deploy.sh` to spin up Swarm services
- Later, `bash ./undeploy.sh` to destroy it

### Calling APIs

- Import Postman environment for [microservice](./source/NAB-Challenge-Container.postman_environment.json) and [Lambda](./source/NAB-Challenge-Lambda.postman_environment.json) in folder `packages/docs/source`
- Import [Postman collection](./packages/docs/source/NAB-iCommerce.postman_collection.json) in folder `packages/docs/source`
- Select environment **"NAB Challenge - Container"**
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

## Code Structure

```
[Workspace root]
 |- _database (DB migrations scripts)
 |- _docker (Docker build and deployment scripts)
 |- packages
 |- docs (Documentation and diagrams)
 |- micro-product-rest (Public-facing RESTful API service)
 |- micro-product-biz (Internal business service for Branch, Category, Product CRUD)
 |- micro-search-biz (Internal business service for Product searching)
 |- micro-statistics-biz (Internal business service for statistics and audit logs)
 |- lambda-product (Serverless Lambda implementation - This folder isn't related to the others)
```

## A microservice's basic structure

```
[Package root]
 |- dist (JS distributable files, transpiled from "src")
 |- src (TypeScript source files)
   |- app (Application files)
     |- contracts (Enums, models and interfaces exposed to other services to call)
     |- controllers (HTTP controller classes or RPC handler classes to accept incoming requests)
     |- models
       |- domain (Domain models)
       |- orm (Models mapped from database schema)
     |- repositories (Repository classes to operate the database)
     |- config.ts (These settings can be overriden by environment variables or settings fetched from remote configuration service)
     |- server.ts (The application instance)
   |- test (Unit tests)
```
---

## How to develop

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
