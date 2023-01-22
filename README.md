# kodiak-ha

Locate the nearest Kodiak snow removal service's tractor and publish information about it to Home Assistant via its HTTP sensor API.

Node process running in Docker.

## Configuration

- Ensure Docker is installed.
- Clone the repo
- Copy `config.example.json` to `config.json`
- Set `config.json` values per your setup:
  - Latitude and longitude to calculate distance from (ie. your house)
  - `postUrl` to point to your HA server. HA will automatically create the `sensor.kodiak` entity. You can change the entity name in the URL if you wish.
  - Go to Home Assistant Settings -> your name -> Long Lived Tokens, create a token, and add it to `config.json`
  - Change polling `interval` if needed, in seconds. Tractors update every 10 seconds but that's a bit excessive. Wouldn't want to get noticed or throttled.

## CLI Usage

- `scripts/start.sh` - Build the Docker container and start it running in the background
- `scripts/stop.sh` - Stop and remove the container
- `scripts/logs.sh` - Tail the logs

## Ubuntu installation

You can create an init.d service that runs on startup with `sudo ubuntu/install.sh`.

It assumes you cloned to `/home/ubuntu/kodiak-ha`, if not change `dir` in `ubuntu/kodiak-ha` accordingly.

`sudo service kodiak-ha start` to start the service.

`scripts/logs.sh` to ensure it's running.

## Home Assistant Usage

If everything worked you should see the `kodiak` entity in Settings -> Devices -> Entities.

The base state of the entity is the distance to the closest tractor in meters. Attributes contains some other stuff. Timstamps are standard UNIX timestamps (in millseconds) which should be easy enough to use in templates.

Create an automation with a numeric state trigger on the entity with a `below` value to do something when a tractor is nearby.

You can also copy the GPS coordinates to a device tracker and see the tractor on the map! Just create the following automation and the tracker will be created automatically:

```
alias: Kodiak update tracker
description: ""
trigger:
  - platform: state
    entity_id:
      - sensor.kodiak
condition: []
action:
  - service: device_tracker.see
    data:
      dev_id: kodiak_closest
      gps:
        - "{{ state_attr('sensor.kodiak','lat') }}"
        - "{{ state_attr('sensor.kodiak','lon') }}"
mode: single
```

---
---
Thanks for checking out my work :)

- Graham