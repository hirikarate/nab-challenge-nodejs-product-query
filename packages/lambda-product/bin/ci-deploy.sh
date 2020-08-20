#!/bin/bash

stage=${2}
profile=${4}

echo "===== Salon Manager Serverless CI Deployment ====="

if [ -z "$stage" ]; then
  echo "Error: Argument is invalid."
  echo "Hint: $$(pwd)/ci-deploy.sh --stage [dev|prod] [--profile] [default]"
  exit 1
fi

if [ -z "$profile"]; then
  echo "Warning: you are using AWS default profile!"
fi

export NODE_OPTIONS=--max_old_space_size=8192
currentPath=$(pwd)
echo "Current path: $(pwd)"

echo "Deploying gateway..."
cd "$currentPath/src/gateway"
serverless deploy --stage $stage --profile $profile
sleep 5s
cd $currentPath
echo "gateway succesfully deployed!"

echo "Deploying product-search..."
cd "$currentPath/src/product-search"
serverless deploy --stage $stage --profile $profile
sleep 5s
cd $currentPath
echo "product-search succesfully deployed!"

echo "Deploy completed! Press any key to continue"
read
