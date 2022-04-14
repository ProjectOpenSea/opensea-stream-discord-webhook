import { MessageEmbed, WebhookClient } from "discord.js";
import * as express from 'express';
import config from "./config";
import { OpenSeaPushClient } from '../local-dependencies/pushed-updates-sdk/src/index';
import { WebSocket } from 'ws';


const app: express.Express = express();
const port = 8080;

const webhookClient = new WebhookClient({ id: config.webhookId, token: config.webhookToken });
const client = new OpenSeaPushClient({
    token: 'fake-key',
    apiUrl: 'fake-url',
    connectOptions: {
      transport: WebSocket
    }
  });


app.get("/", (req: express.Request, res: express.Response) => {
	res.send("Hello OpenSea Webhooks!");
});

app.listen( port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
	client.onItemSold('doodles-official', (event) => {
		console.log(event);
		const embed = new MessageEmbed()
			.setTitle('doodles-official Title')
			.setColor('#0099ff');
		webhookClient.send({
			content: 'doodles-official',
			username: 'DoodleBot',
			avatarURL: 'https://i.imgur.com/AfFp7pu.png',
			embeds: [embed],
		});
	});

	client.onItemSold('neon-district-season-one-item', (event) => {
		console.log(event);
		const embed = new MessageEmbed()
			.setTitle('neon-district-season-one-item Title')
			.setColor('#0099ff');
		webhookClient.send({
			content: 'neon-district-season-one-item',
			username: 'NeonDistrictBot',
			avatarURL: 'https://i.imgur.com/AfFp7pu.png',
			embeds: [embed],
		});
	});
	client.onItemSold('boredapeyachtclub', (event) => {
		console.log(event);
		const embed = new MessageEmbed()
			.setTitle('boredapeyachtclub Title')
			.setColor('#0099ff');
		webhookClient.send({
			content: 'BoredApeBot',
			username: 'michael.cohen#0035',
			avatarURL: 'https://i.imgur.com/AfFp7pu.png',
			embeds: [embed],
		});
	});
})