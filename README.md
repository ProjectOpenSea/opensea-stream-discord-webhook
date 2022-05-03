# opensea-stream-discord-webhook
A sample repo showing how a developer using the OpenSea Stream API might be able to connect a Discord webhook to send messages whenever new events occur for a collection.

This particular codebase tracks all event types for 4 collections: Bored Ape Yacht Club, Aurory, Doodles, and Decentraland Wearables.

## Setup
```bash
$ npm install
```

Fill out the `.env` file with:
- your OpenSea Stream API URL and API key
- the Discord webhook ID and token for the Discord you would like to send messages to. TODO: Add instructions for how to get this.

## Running locally
Assuming your set up above was completed successfully, run the following command to start the server:
```bash
$ npm run dev
```

To start a local dev server that tracks your local codebase and updates as you save changes. You can also run the server statically with `npm run build && npm run start`.

## Deploying
```bash
$ heroku create
Creating app... done, ⬢ pure-coast-44807
https://pure-coast-44807.herokuapp.com/ | https://git.heroku.com/pure-coast-44807.git

$ git push heroku main
```
