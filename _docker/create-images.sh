#!/bin/bash

for file in ./create-image-*.sh
do
	echo "[--- Executing $file ---]"
	bash $file
done

echo "[--- Creating images done ---]"
docker images
