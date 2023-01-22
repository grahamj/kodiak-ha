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

## Usage

- `scripts/start.sh` - Build the Docker container and start it running in the background
- `scripts/stop.sh` - Stop and remove the container
- `scripts/logs.sh` - Tail the logs
