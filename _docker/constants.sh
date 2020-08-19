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

export DB_HOST='icommerce.c5v7mikvmbjb.ap-southeast-1.rds.amazonaws.com'
export DB_USER='icommerce_root'
export DB_PASS='rL5LC8hlUYijYw5M5wDK'
export DB_NAME='nab_challenge'

export AWS_REGION_CODE='ap-southeast-1'
export AWS_ACCESS_KEY='AKIAWCNSVEYMSWGV3NM6'
export AWS_SECRET_KEY='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'
export AWS_ES_HOST='https://search-icommerce-7htb7n5ittiwrpm5iwcdomp6l4.ap-southeast-1.es.amazonaws.com/'
