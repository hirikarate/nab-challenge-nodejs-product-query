#!/bin/bash

stage=${2}
profile=${4}

echo "===== Salon Manager Serverless CI Decommission ====="

if [ -z "$stage" ]; then
  echo "Error: Argument is invalid."
  echo "Hint: $$(pwd)/ci-decomission.sh --stage [dev|prod] [--profile] [default]"
  exit 1
fi

if [ -z "$profile"]; then
  echo "Warning: you are using AWS default profile!"
fi

export NODE_OPTIONS=--max_old_space_size=8192
currentPath=$(pwd)
echo "Current path: $(pwd)"

cd "$currentPath/src/product-search"
serverless remove --stage $stage --profile $profile
rm -rf .serverless
sleep 5s
cd $currentPath
echo "product-search succesfully undeployed!"

cd "$currentPath/src/gateway"
serverless remove --stage $stage --profile $profile
rm -rf .serverless
sleep 5s
cd $currentPath
echo "gateway succesfully undeployed!"

echo "Decomission completed! Press any key to continue"
read
