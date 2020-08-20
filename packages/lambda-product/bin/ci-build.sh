#!/bin/bash

stage=${2}
profile=${4}

echo "===== Salon Manager Serverless CI Packing ====="

if [ -z "$stage" ]; then
  echo "Error: Argument is invalid."
  echo "Hint: $$(pwd)/ci-build.sh --stage [dev|prod] [--profile] [default]"
  exit 1
fi

if [ -z "$profile"]; then
  echo "Warning: you are using AWS default profile!"
fi

export NODE_OPTIONS=--max_old_space_size=8192
currentPath=$(pwd)
echo "Current path: $(pwd)"

echo "Packaging gateway..."
cd "$currentPath/src/gateway"
serverless package --stage $stage --profile $profile
sleep 5s
cd $currentPath
echo "gateway succesfully packaged!"

echo "Packaging product-search..."
cd "$currentPath/src/product-search"
serverless package --stage $stage --profile $profile
sleep 5s
cd $currentPath
echo "product-search succesfully packaged!"

echo "Build completed! Press any key to continue"
read
