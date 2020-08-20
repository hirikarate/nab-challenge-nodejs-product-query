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
- Pick a request sample to execute
- Response format:
  * **Operation completes with successful result:** Status: `200`. Body: `{ hasData: true, otherFields: ... }`
  * **Operation completes with business rule violations:** Status: `200`. Body: `{ hasData: false, error: ... }`
  * **Operation completes with input validation error:** Status: `422`. Body: Error details.
  * **Operation fails due to server fault:** Status: `500`.

### Security

- Only the two APIs "Filter products" and "Advanced search product" in Postman folder "Product" are public.
- The others require access token in Authentication header (I already configured it for your convenience). Besides, there are other tokens for testing:
  * Expired: `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJkaXNwbGF5TmFtZSI6Ik5BQiBDaGFsbGVuZ2UiLCJpYXQiOjE1OTc3ODU2NjMsImV4cCI6MTU5Nzc4NTY5MywianRpIjoiMTU5Nzc4NTY2MzE3NyJ9.hRPjOeQtMBRZGjjEnbeeIPpeRSRu7X7yxPLxcbG5k-J0MzliyySlU0RwkdiaJq863kITHAIvHzDVDr_n6kD6ow`
  * Not expired but blacklisted (e.g: User logged out): `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJkaXNwbGF5TmFtZSI6Ik5BQiBDaGFsbGVuZ2UiLCJpYXQiOjE1OTc3ODU1MTQsImV4cCI6MTYwMDM3NzUxNCwianRpIjoiMTU5Nzc4NTUxNDQ2NyJ9.fI-eW_1BmOylNbvx2rlbFrkvkKHOYaqY-w02P9RkdgfhaE299kuqfndEK2_3o452IBJdKYpDWIo41SlsaTLq8Q`
  * Working: `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJkaXNwbGF5TmFtZSI6Ik5BQiBDaGFsbGVuZ2UiLCJpYXQiOjE1OTc3ODU2MTIsImV4cCI6MTYwMDM3NzYxMiwianRpIjoiMTU5Nzc4NTYxMjY4NSJ9.DKVTLrhoQBz3H-BkJNM7Q3YMPxIY-CwRyusA2HzHmAcpmQi5l9RRR-rpymsUQniz-NH161G8TGGkempEvGBRHw`

## Available APIs
- Branch CRUD (POST, PATCH, GET, DELETE)
- Category CRUD
- Product CRUD
   - Creating, editing and deleting operations will update ElasticSearch indices also.
   - Getting by ID, filtering and searching will write audit logs to database table `nab_request_logs`.
- Product filter and advanced search, including pagination and sorting.
  * **Filter:** Can filter with name, color, price range, category, branch(es)
  * **Searching:** Can search with keywords (name + color, e.g: "Rosy honda"), including filtering with price range, category, branch(es)

## Unit tests

The product creating flow is covered with unit test, please refer to folders: `packages/micro-product-rest/src/test` and `packages/micro-product-biz/src/test`

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
