import { MessageEmbed, WebhookClient } from "discord.js";
import * as express from "express";
import * as dotenv from "dotenv";
import {
  OpenSeaStreamClient,
  EventType,
  LogLevel,
  Network,
} from "@opensea/stream-js";
import { WebSocket } from "ws";
import { getMessageEmbed } from "./helpers";

// Environment variables
dotenv.config();
const port = parseInt(process.env.PORT || "8080");
const enabled = process.env.BOT_ENABLED || true;
const webhookId = process.env.WEBHOOK_ID || "";
const webhookToken = process.env.WEBHOOK_TOKEN || "";
const openseaApiToken = process.env.OPENSEA_API_TOKEN || "";

const openseaNetwork =
  process.env.NETWORK &&
  Object.values(Network).some((v) => v === process.env.NETWORK)
    ? (process.env.NETWORK as Network)
    : Network.MAINNET;

// Discord Webhook Client
const webhookClient = new WebhookClient({ id: webhookId, token: webhookToken });

// OpenSea Stream API Client
const openseaClient = new OpenSeaStreamClient({
  token: openseaApiToken,
  network: openseaNetwork,
  connectOptions: {
    transport: WebSocket,
  },
  logLevel: LogLevel.DEBUG,
});

const app: express.Express = express();

app.get("/", (req: express.Request, res: express.Response) => {
  res.send("Hello OpenSea Webhsooks!");
  if (!enabled) {
    res.send("Bot is disabled");
    return;
  }
  const allEvents = [
    EventType.ITEM_CANCELLED,
    EventType.ITEM_LISTED,
    EventType.ITEM_RECEIVED_BID,
    EventType.ITEM_RECEIVED_OFFER,
    EventType.ITEM_SOLD,
    EventType.ITEM_TRANSFERRED,
  ];

  const collection_slugs = process.env.COLLECTION_SLUGS?.split(" ") || [];
  collection_slugs.forEach((slug) => {
    openseaClient.onEvents(slug, allEvents, (event: any) => {
      console.log(event);
      console.log(event.payload.item.metadata);
      const embed = getMessageEmbed(
        event,
        slug.replace("-", " ").replace("_", " ")
      );
      webhookClient.send({
        username: "OpenSeaBot",
        embeds: [embed],
      });
    });
  });
});

app.listen(port, () => {
  console.log("Server is running...");
});

app.use(express.static("public"));
