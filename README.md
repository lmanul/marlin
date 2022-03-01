# marlin

## How to use

* This server uses a Google authentication method. For that purpose, you will
  need a Google OAuth "client ID" and "client secret". To avoid storing those
  in source code, you will need to set the following environment variables
  before starting the server: `MARLIN_GOOGLE_CLIENT_ID` and
  `MARLIN_GOOGLE_CLIENT_SECRET`.

* Optional: if you only want to allow logged in users for a certain domain, set
  this environment variable: `MARLIN_DOMAIN`.

* Run the script `./run` (or, for development mode, `./dev`).

## Development

Necessary packages (on a Debian-based Linux distribution):

    sudo apt install npm
