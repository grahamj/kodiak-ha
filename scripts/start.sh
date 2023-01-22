#!/bin/bash

scripts/build.sh
docker run \
    -d \
    -t \
    --name kodiak-ha \
    kodiak-ha
