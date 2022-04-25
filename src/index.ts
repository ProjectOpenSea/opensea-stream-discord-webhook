import { MessageEmbed, WebhookClient } from "discord.js";
import * as express from 'express';
import * as dotenv from "dotenv";
import * as path from 'path';
import { OpenSeaStreamClient, EventType, LogLevel } from '../local-dependencies/opensea-stream-js-sdk/src/index';
import { WebSocket } from 'ws';
import { getMessage, getTitle, getUrl } from './helpers';
import { getBotEnabled, setBotEnabled } from './redis';


// Environment variables
dotenv.config();
const port = parseInt(process.env.PORT || '8080');
const webhookId = process.env.WEBHOOK_ID || "";
const webhookToken = process.env.WEBHOOK_TOKEN || "";
const openseaApiToken = process.env.OPENSEA_API_TOKEN || "";
const openseaApiUrl = process.env.OPENSEA_API_URL || "";
// Discord Webhook Client
let webhookClient: WebhookClient;

// OpenSea Stream API Client
let openseaClient: OpenSeaStreamClient;

const app: express.Express = express();
app.use(express.static("public"));
app.get("/toggleBot", async (req: express.Request, res: express.Response) => {
	console.log("Toggling bot...");
	const enabled = await getBotEnabled();
	if (enabled) {
		console.log("Bot enabled... disabling now...");
		const success = await disableBot();
		if (success) {
			console.log("Disabled bot");
			res.send({message: "Bot disabled", botEnabled: false});
			return;
		}
		console.log("Failed while disabling bot");
		res.send({message: "Failed while disabling bot", botEnabled: true});
	} else {
		console.log("Bot disabled... enabling now...");
		const success = await enableBot();
		if (success) {
			console.log("Enabled bot");
			res.send({message: "Bot enabled", botEnabled: true});
			return;
		}
		console.log("Failed while enabling bot");
		res.send({message: "Failed while enabling bot", botEnabled: false});
	}
});

app.get("/botState", async (req: express.Request, res: express.Response) => {
	console.log("Fetching bot state...");
	const botEnabled = await getBotEnabled();
	if (botEnabled) {
		res.send({message: "Bot enabled", botEnabled: true});
	} else{
		// Set the value to disabled if the value was never found in cache
		await setBotEnabled(false);
		res.send({message: "Bot disabled", botEnabled: false});
	}
});


app.get("/", (req: express.Request, res: express.Response) => {
	res.render(path.join(__dirname, 'index.html'), {message: 'Bot is disabled'});
});

app.listen( port, async () => {
	console.log("Server is running...");
	
	// fetch redis key for whether bot is enabled or not
	const enabled = await getBotEnabled();
	if (!enabled) {
		console.log("Bot is disabled");
		return;
	}

	const success = await enableBot();
	if (!success) {
		console.log("Bot was not enabled properly.");
	}
});

const enableBot = async () => {

	if (openseaClient == null) {
		console.log("OpenSea client not properly set up");
		openseaClient = new OpenSeaStreamClient({
			token: openseaApiToken,
			apiUrl: openseaApiUrl,
			connectOptions: {
			transport: WebSocket
			},
			logLevel: LogLevel.DEBUG
		});
	}

	if (webhookClient == null) {
		console.log("Discord client not properly set up");
		webhookClient = new WebhookClient({ id: webhookId, token: webhookToken });
	}

	const allEvents = Object.values(EventType);
	openseaClient.onEvents('doodles-official', allEvents, (event: any) => {
		console.log(event);
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

	openseaClient.onEvents('aurory', allEvents, (event: any) => {
		console.log(event);
		const embed = new MessageEmbed()
			.setTitle(getTitle("Aurory", event.item))
			.setDescription(getMessage(event.item, "Neon District", event.event_type, event.timestamp, event.payload))
			.setURL(getUrl(event.item))
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

	openseaClient.onEvents('decentraland-polygon-wearables', allEvents, (event: any) => {
		console.log(event);
		const embed = new MessageEmbed()
			.setTitle(getTitle("decentraland-polygon-wearables", event.item))
			.setDescription(getMessage(event.item, "decentraland-polygon-wearables", event.event_type, event.timestamp, event.payload))
			.setURL(getUrl(event.item))
			.setColor('#EF972C');
		webhookClient.send({
			username: 'BoredApeBot',
			avatarURL: 'https://lh3.googleusercontent.com/Ju9CkWtV-1Okvf45wo8UctR-M9He2PjILP0oOvxE89AyiPPGtrR3gysu1Zgy0hjd2xKIgjJJtWIc0ybj4Vd7wv8t3pxDGHoJBzDB=s130',
			embeds: [embed],
		});
	});

	setBotEnabled(true);
	return true;
};

const disableBot = async () => {
	const enabled = await getBotEnabled();
	if (!enabled) {
		console.log("Bot is already disabled");
		return true;
	}
	if (openseaClient == null) {
		return false;
	}

	openseaClient.disconnect();
	setBotEnabled(false);
	return true;
};

const startUp = async () => {
	const enabled = await getBotEnabled();
	if (!enabled) {
		await disableBot();
	} else {
		await enableBot();
	}
}

startUp();
