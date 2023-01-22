# kodiak-ha

Locate the nearest Kodiak snow removal service's tractor and publish information about it to Home Assistant via its HTTP sensor API.

Node process running in Docker.

## Instalation

- Ensure Docker is installed and operative
- Clone or [download](https://github.com/grahamj/kodiak-ha/archive/refs/heads/main.zip) the files into a new folder

## Configuration

From the root of the new folder, copy `config.example.json` to `config.json` then edit the latter per your setup:

| Key | Description |
|-|-|
| `lat`, `lon` | Location to calculate distance from (ie. your house) |
| `postUrl` | URL of your HA server's HTTP API |
| `token` | HA Long Lived Token |
| `interval` | Polling interval in seconds |

To create a token go to Home Assistant Settings -> your name -> Long Lived Tokens.

Note the entity name at the end of `postUrl`. HA will automatically create this entity. You can change it if you wish but it must start with `sensor.`

Tractors update every 10 seconds but that's a bit excessive so I recommend keeping `interval` at 60 or higher. In the future I may make it dynamic based on distance or something.

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

```yaml
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