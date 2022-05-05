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
import { getMessageEmbed, setListingMessageEmbed } from "./helpers";

// Environment variables
dotenv.config();
const port = parseInt(process.env.PORT || "8080");
const enabled = process.env.BOT_ENABLED || true;
const webhookId = process.env.WEBHOOK_ID || "";
const webhookToken = process.env.WEBHOOK_TOKEN || "";
const openseaApiToken = process.env.OPENSEA_API_TOKEN || "";

// Discord Webhook Client
const webhookClient = new WebhookClient({ id: webhookId, token: webhookToken });

// OpenSea Stream API Client
const openseaClient = new OpenSeaStreamClient({
  token: openseaApiToken,
  network: Network.MAINNET,
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
    EventType.ITEM_SOLD,
    EventType.ITEM_LISTED,
    EventType.ITEM_RECEIVED_BID,
    EventType.ITEM_RECEIVED_OFFER,
  ];
  const allEventsOther = [
    EventType.ITEM_SOLD,
    EventType.ITEM_LISTED,
    EventType.ITEM_RECEIVED_BID,
  ];

  // openseaClient.onEvents('known-origin', allEvents, (event: BaseStreamMessage<unknown>) => {
  // 	console.log(event);
  // 	const embed = new MessageEmbed()
  // 		.setTitle(getTitle("Aurory", event.payload.item))
  // 		.setDescription(getMessage(event.payload.item, "Neon District", event.event_type, event.timestamp, event.payload))
  // 		.setURL(getUrl(event.payload.item))
  // 		.setColor('#61C7D7');
  // 	webhookClient.send({
  // 		username: 'AuroryBots',
  // 		avatarURL: 'https://lh3.googleusercontent.com/Qzl6u460tNyzWFrlaLQIa2VMBc1HBX5X7IDfEYBbKV3q1p_BDVkqC-A7-DS5RA-IKagzD0m7J-LDpmr_XnY2ocsTcXGM01DXM7lqUg=s130',
  // 		embeds: [embed],
  // 	});
  // });
  openseaClient.onEvents("boredapeyachtclub", allEvents, (event: any) => {
    console.log(event);
    console.log(event.payload.item.metadata);
    const embed = getMessageEmbed(event, "Bored Ape Yacht Club");
    webhookClient.send({
      username: "OpenSeaBot",
      embeds: [embed],
    });
  });

  openseaClient.onEvents(
    "mutant-ape-yacht-club",
    allEventsOther,
    (event: any) => {
      console.log(event);
      console.log(event.payload.item.metadata);
      const embed = getMessageEmbed(event, "Mutant Ape Yacht Club");
      webhookClient.send({
        username: "OpenSeaBot",
        embeds: [embed],
      });
    }
  );

  openseaClient.onEvents("otherdeed", allEventsOther, (event: any) => {
    console.log(event);
    console.log(event.payload.item.metadata);
    const embed = getMessageEmbed(event, "Otherdeed");
    webhookClient.send({
      username: "OpenSeaBot",
      embeds: [embed],
    });
  });

  openseaClient.onEvents("bored-ape-kennel-club", allEvents, (event: any) => {
    console.log(event);
    console.log(event.payload.item.metadata);
    const embed = getMessageEmbed(event, "Bored Ape Kennel Club");
    webhookClient.send({
      username: "OpenSeaBot",
      embeds: [embed],
    });
  });
});

app.listen(port, () => {
  console.log("Server is running...");
});

app.use(express.static("public"));
