import { MessageEmbed, WebhookClient } from "discord.js";
import * as express from 'express';
import * as dotenv from "dotenv";
import { OpenSeaStreamClient, EventType, LogLevel, Network } from '../local-dependencies/opensea-stream-js-sdk/src/index';
import { WebSocket } from 'ws';
import { getMessage, getTitle, getUrl } from './helpers';

// Environment variables
dotenv.config();
const port = parseInt(process.env.PORT || '8080');
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
      transport: WebSocket
    },
	logLevel: LogLevel.DEBUG
  });


const app: express.Express = express();

app.get("/", (req: express.Request, res: express.Response) => {
	res.send("Hello OpenSea Webhooks!");
	if (!enabled) {
		res.send("Bot is disabled");
		return;
	}
	const allEvents = Object.values(EventType);

	openseaClient.onEvents('aurory', allEvents, (event: any) => {
		console.log(event);
		const embed = new MessageEmbed()
			.setTitle(getTitle("Aurory", event.payload.item))
			.setDescription(getMessage(event.payload.item, "Neon District", event.event_type, event.timestamp, event.payload))
			.setURL(getUrl(event.payload.item))
			.setColor('#61C7D7');
		webhookClient.send({
			username: 'AuroryBots',
			avatarURL: 'https://lh3.googleusercontent.com/Qzl6u460tNyzWFrlaLQIa2VMBc1HBX5X7IDfEYBbKV3q1p_BDVkqC-A7-DS5RA-IKagzD0m7J-LDpmr_XnY2ocsTcXGM01DXM7lqUg=s130',
			embeds: [embed],
		});
	});

	openseaClient.onEvents('boredapeyachtclub', allEvents, (event: any) => {
		console.log(event);
		const embed = new MessageEmbed()
			.setTitle(getTitle("Bored Ape Yacht Club", event.payload.item))
			.setDescription(getMessage(event.payload.item, "Bored Ape Yacht Club", event.event_type, event.timestamp, event.payload))
			.setURL(getUrl(event.payload.item))
			.setColor('#EF972C');
		webhookClient.send({
			username: 'BoredApeBot',
			avatarURL: 'https://lh3.googleusercontent.com/Ju9CkWtV-1Okvf45wo8UctR-M9He2PjILP0oOvxE89AyiPPGtrR3gysu1Zgy0hjd2xKIgjJJtWIc0ybj4Vd7wv8t3pxDGHoJBzDB=s130',
			embeds: [embed],
		});
	});

	openseaClient.onEvents('decentraland-polygon-wearables', allEvents, (event: any) => {
		console.log(event);
		const embed = new MessageEmbed()
			.setTitle(getTitle("decentraland-polygon-wearables", event.payload.item))
			.setDescription(getMessage(event.payload.item, "decentraland-polygon-wearables", event.event_type, event.timestamp, event.payload))
			.setURL(getUrl(event.payload.item))
			.setColor('#EF972C');
		webhookClient.send({
			username: 'Decentraland',
			avatarURL: 'https://lh3.googleusercontent.com/Ju9CkWtV-1Okvf45wo8UctR-M9He2PjILP0oOvxE89AyiPPGtrR3gysu1Zgy0hjd2xKIgjJJtWIc0ybj4Vd7wv8t3pxDGHoJBzDB=s130',
			embeds: [embed],
		});
	});
});


app.listen( port, () => {
	console.log("Server is running...");
});

app.use(express.static("public"))