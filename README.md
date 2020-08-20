# iCommerce product query demo

---
## OVERVIEW

"iCommerce" is a small start-up who wants to get to the market quickly, so I have developed 2 options for them:
  * **Serverless AWS Lambda**: Fast to develop, pay as they go, and no worries about maintaining servers.
  * **Cloud provider-independent micro services**: Enterprise-grade system when they grow bigger and don't want provider lock-in.

## Micro-service implementation

**Disclaimer**: I am the author of the framework [Micro Fleet](https://github.com/gennovative/micro-fleet), if you want to know how I code, organize and document things, that is where you may want to have a look.

* _Architecture_: Microservice
* _Tech stacks_:
   - TypeScript opensource microservice framework [Micro Fleet](https://github.com/gennovative/micro-fleet)
   - AWS ElasticSearch
   - Redis cache / AWS ElasticCache
   - Postgresql database / AWS RDS
   - Docker Swarm / AWS EC2
   - RabbitMQ
* _Diagrams and user guide_: Refer to [/packages/docs/microservice.md](/packages/docs/microservice.md)

## Serverless implementation

**Note**: This one only have 2 APIs, while the microservice one has more things implemented.

* _Architecture_: AWS Lambda
* _Tech stacks_:
   - ES2020 JavaScript with Babel and Webpack to optimize "cold start" speed.
   - AWS ElasticSearch
   - AWS ElasticCache Redis
   - AWS RDS Postgresql
   - AWS SNS as message broker
   - AWS Secret Manager
   - AWS System Manager
   - AWS CloudWatch
   - AWS Gateway API
* _Diagrams and user guide_: Refer to [/packages/docs/serverless.md](/packages/docs/serverless.md)


### Calling APIs

- Import Postman environment for [microservice](./packages/docs/source/NAB-Challenge-Container.postman_environment.json) and [Lambda](./packages/docs/source/NAB-Challenge-Lambda.postman_environment.json) in folder `packages/docs/source`
- Import [Postman collection](./packages/docs/source/NAB-iCommerce.postman_collection.json) in folder `packages/docs/source`
- Select environment **"NAB Challenge - Lambda"**
- Only two APIs `Product > Filter products` and `Product > Advanced search product` are working now. Other APIs require spinning up the microservice implementation.


Notes:
- Only the two APIs "Filter products" and "Advanced search product" in Postman folder "Product" are public.
- The others require access token in Authentication header (I already configured it for your convenience).
