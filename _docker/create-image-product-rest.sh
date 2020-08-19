#!/usr/bin/env sh

source ./constants.sh .

imageName='icommerce-product-rest'
versionTag=''

if [[ -z $VERSION ]]; then
	echo 'WARNING: $VERSION not specified. Output image will be tagged as "latest".'
else
	versionTag="-t $imageNamespace/$imageName:$VERSION"
fi

docker build ${versionTag} -t ${imageNamespace}/${imageName}:latest -f ./Dockerfile-product-rest ..