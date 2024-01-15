#!/bin/bash

cp ubuntu/kodiak-ha /etc/init.d
sudo chmod 755 /etc/init.d/kodiak-ha
sudo systemctl daemon-reload
update-rc.d kodiak-ha defaults
