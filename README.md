# opensea-stream-discord-webhook

A sample repo showing how a developer using the OpenSea Stream API might be able to connect a Discord webhook to send messages whenever new events occur for a collection.

This particular codebase tracks all event types for the collections in the Yuga Labs world of NFTs: Bored Ape Yacht Club, Bored Ape Kennel Club, Mutant Ape Yacht Club, and Otherdeed.

## Setup

```bash
$ npm install
```

Fill out the `.env` file with:

- The network you would like to use (`mainnet` or `testnet`)
- The Discord webhook ID and token for the Discord you would like to send messages to.
- To get a Discord webhook for your server, go to the channel you would like to add a webhook to and click the 'Edit Channel' button.
- Click on the Integrations tab and then Webhooks
- Click 'New Webhook' and give it a cool name + photo.
- Click on 'Copy Webhook URL'. This will give a URL of the format `https://discord.com/api/webhooks/{WEBHOOK_ID}/{WEBHOOK_TOKEN}`, which you can now use in your `.env` file.
- A list of collection slugs you would like to track events for, split with a space. To track all collections, use '\*'.
- e.g. `COLLECTION_SLUGS="boredapeyachtclub mutant-ape-yacht-club otherdeed bored-ape-kennel-club"`

## Running locally

Assuming your set up above was completed successfully, run the following command to start the server:

```bash
$ npm run dev
```

To start a local dev server that tracks your local codebase and updates as you save changes. You can also run the server statically with `npm run build && npm run start`.

After the server starts running, go to `localhost:PORT` in your browser to start the bot.

## Deploying

```bash
$ heroku create
Creating app... done, ⬢ pure-coast-44807
https://pure-coast-44807.herokuapp.com/ | https://git.heroku.com/pure-coast-44807.git

$ git push heroku main
```
