#!/bin/bash

scripts/stop.sh

echo Building...
docker build --rm -t kodiak-ha ./
