#!/bin/bash

source ./constants.sh .

imageName='icommerce-search-biz'
versionTag=''

if [[ -z $VERSION ]]; then
	echo 'WARNING: $VERSION not specified. Output image will be tagged as "latest".'
else
	versionTag="-t $imageNamespace/$imageName:$VERSION"
fi

docker build ${versionTag} -t ${imageNamespace}/${imageName}:latest -f ./Dockerfile-search-biz ..