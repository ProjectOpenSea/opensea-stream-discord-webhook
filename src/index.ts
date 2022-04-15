import { MessageEmbed, WebhookClient } from "discord.js";
import * as express from 'express';
import * as dotenv from "dotenv";
import { OpenSeaPushClient, EventType } from '../local-dependencies/pushed-updates-sdk/src/index';
import { WebSocket } from 'ws';
import { getMessage, getTitle } from './helpers';

// Environment variables
dotenv.config({ path: __dirname+'/.env' });
const port = parseInt(process.env.PORT || '8080');
const webhookId = process.env.WEBHOOK_ID || "";
const webhookToken = process.env.WEBHOOK_TOKEN || "";
const openseaApiKey = process.env.OPENSEA_API_KEY || "";
const openseaApiUrl = process.env.OPENSEA_API_URL || "";

// Discord Webhook Client
const webhookClient = new WebhookClient({ id: webhookId, token: webhookToken });

// OpenSea Push Client
const openseaClient = new OpenSeaPushClient({
    token: openseaApiKey,
    apiUrl: openseaApiUrl,
    connectOptions: {
      transport: WebSocket
    }
  });


const app: express.Express = express();

app.get("/", (req: express.Request, res: express.Response) => {
	res.send("Hello OpenSea Webhooks!");
});

app.listen( port, () => {
	openseaClient.onEvents('doodles-official', [EventType.ITEM_LISTED, EventType.ITEM_CANCELLED, EventType.ITEM_SOLD, EventType.ITEM_TRANSFERRED], (event) => {
		console.log(event);
		const embed = new MessageEmbed()
			.setTitle(getTitle("Doodles", event.event_type))
			.setDescription(getMessage(event.item, "Doodles", event.event_type, event.timestamp, event.payload))
			.setColor('#FE9FDD');
		webhookClient.send({
			username: 'DoodleBot',
			avatarURL: 'https://lh3.googleusercontent.com/7B0qai02OdHA8P_EOVK672qUliyjQdQDGNrACxs7WnTgZAkJa_wWURnIFKeOh5VTf8cfTqW3wQpozGedaC9mteKphEOtztls02RlWQ=s130',
			embeds: [embed],
		});
	});

	openseaClient.onEvents('neon-district-season-one-item', [EventType.ITEM_RECEIVED_BID, EventType.ITEM_RECEIVED_OFFER], (event) => {
		console.log(event);
		const embed = new MessageEmbed()
			.setTitle(getTitle("Neon District", event.event_type))
			.setDescription(getMessage(event.item, "Neon District", event.event_type, event.timestamp, event.payload))
			.setColor('#C433F4');
		webhookClient.send({
			content: 'Message from Neon District',
			username: 'NeonDistrictBot',
			avatarURL: 'https://lh3.googleusercontent.com/xttZf6L3I16h7HSgcfKFWhR7OhCdSO5UW_asXbRfGmQ7-a0QwJRNoPsmh_RlOpw-AFEngLqGYLD77cmjdBv4LCfVc5BxFG2PS1UU=s130',
			embeds: [embed],
		});
	});
	openseaClient.onEvents('boredapeyachtclub', [EventType.ITEM_METADATA_UPDATED], (event) => {
		console.log(event);
		const embed = new MessageEmbed()
			.setTitle(getTitle("Bored Ape Yacht Club", event.event_type))
			.setDescription(getMessage(event.item, "Bored Ape Yacht Club", event.event_type, event.timestamp, event.payload))
			.setColor('#EF972C');
		webhookClient.send({
			content: 'Message from BoredApe',
			username: 'BoredApeBot',
			avatarURL: 'https://lh3.googleusercontent.com/Ju9CkWtV-1Okvf45wo8UctR-M9He2PjILP0oOvxE89AyiPPGtrR3gysu1Zgy0hjd2xKIgjJJtWIc0ybj4Vd7wv8t3pxDGHoJBzDB=s130',
			embeds: [embed],
		});
	});
})