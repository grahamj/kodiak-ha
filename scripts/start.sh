#!/bin/bash

scripts/build.sh

echo Starting...
docker run \
    -d \
    -t \
    --name kodiak-ha \
    kodiak-ha
