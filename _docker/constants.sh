imageNamespace='hirikarate'
stackname='icommerce'

export VERSION=1.0.0

export DEBUG='nab:*,mcft:*'

export CACHE_HOST="${stackname}_redis"

export MB_HOST="${stackname}_rabbitmq"
export MB_USER='guest'
export MB_PASS='guest'
export MB_EXCH='amq.topic'
export RPC_HANDLER_ADDRESS="${stackname}_product-biz:8181"

export DB_HOST='localhost'
export DB_USER='postgres'
export DB_PASS='postgres'
export DB_NAME='nab_challenge'

export AWS_REGION_CODE='ap-southeast-1'
export AWS_ACCESS_KEY='AWS_ACCESS_KEY'
export AWS_SECRET_KEY='AWS_SECRET_KEY'
export AWS_ES_HOST='https://es.amazonaws.com/'
