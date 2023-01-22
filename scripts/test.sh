#!/bin/bash

scripts/build.sh

echo Testing...
docker run \
    -d \
    -t \
    -e NODE_ENV=dev \
    --name kodiak-ha \
    kodiak-ha
    npm test
