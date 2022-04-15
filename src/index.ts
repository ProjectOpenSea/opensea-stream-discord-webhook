import { MessageEmbed, WebhookClient } from "discord.js";
import * as express from 'express';
import * as dotenv from "dotenv";
import { OpenSeaPushClient, EventType } from '../local-dependencies/pushed-updates-sdk/src/index';
import { WebSocket } from 'ws';
import { getMessage, getTitle, getUrl } from './helpers';

// Environment variables
dotenv.config();
const port = parseInt(process.env.PORT || '8080');
const webhookId = process.env.WEBHOOK_ID || "";
const webhookToken = process.env.WEBHOOK_TOKEN || "";
const openseaApiKey = process.env.OPENSEA_API_TOKEN || "";
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

const allEvents = Object.values(EventType);
app.listen( port, () => {
	openseaClient.onEvents('doodles-official', allEvents, (event) => {
		const embed = new MessageEmbed()
			.setTitle(getTitle("Doodles", event.item))
			.setDescription(getMessage(event.item, "Doodles", event.event_type, event.timestamp, event.payload))
			.setURL(getUrl(event.item))
			.setColor('#FE9FDD');
		webhookClient.send({
			username: 'DoodleBot',
			avatarURL: 'https://lh3.googleusercontent.com/7B0qai02OdHA8P_EOVK672qUliyjQdQDGNrACxs7WnTgZAkJa_wWURnIFKeOh5VTf8cfTqW3wQpozGedaC9mteKphEOtztls02RlWQ=s130',
			embeds: [embed],
		});
	});

	openseaClient.onEvents('neon-district-season-one-item', allEvents, (event) => {
		const embed = new MessageEmbed()
			.setTitle(getTitle("Neon District", event.item))
			.setDescription(getMessage(event.item, "Neon District", event.event_type, event.timestamp, event.payload))
			.setURL(getUrl(event.item))
			.setColor('#C433F4');
		webhookClient.send({
			username: 'NeonDistrictBot',
			avatarURL: 'https://lh3.googleusercontent.com/xttZf6L3I16h7HSgcfKFWhR7OhCdSO5UW_asXbRfGmQ7-a0QwJRNoPsmh_RlOpw-AFEngLqGYLD77cmjdBv4LCfVc5BxFG2PS1UU=s130',
			embeds: [embed],
		});
	});
	openseaClient.onEvents('boredapeyachtclub', allEvents, (event) => {
		const embed = new MessageEmbed()
			.setTitle(getTitle("Bored Ape Yacht Club", event.item))
			.setDescription(getMessage(event.item, "Bored Ape Yacht Club", event.event_type, event.timestamp, event.payload))
			.setURL(getUrl(event.item))
			.setColor('#EF972C');
		webhookClient.send({
			username: 'BoredApeBot',
			avatarURL: 'https://lh3.googleusercontent.com/Ju9CkWtV-1Okvf45wo8UctR-M9He2PjILP0oOvxE89AyiPPGtrR3gysu1Zgy0hjd2xKIgjJJtWIc0ybj4Vd7wv8t3pxDGHoJBzDB=s130',
			embeds: [embed],
		});
	});
})