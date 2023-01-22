#!/bin/bash

scripts/stop.sh
docker build --rm -t kodiak-ha ./
