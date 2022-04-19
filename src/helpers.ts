import {EventType, ItemListedEventPayload, ItemCancelledEventPayload, ItemMetadataUpdatePayload, ItemSoldEventPayload, ItemTransferredEventPayload, ItemReceivedBidEventPayload, ItemReceivedOfferEventPayload} from '../local-dependencies/opensea-stream-js-sdk/src/index';

type Item = {
	token_id: string;
	contract_address: string;
}

export function getTitle(collection: string, item: Item): string {
  return `${collection} #${item.token_id}`;
}

export function getUrl(item: Item): string {
	return `https://opensea.io/assets/${item.contract_address}/${item.token_id}`;
}

export function getMessage(item: Item, collection: string, event_type: string, timestamp: string, payload: any): string {
	let message = `${collection} ${event_type}`;
	switch (event_type) {
		case EventType.ITEM_LISTED.valueOf():
			message = buildMessageItemListed(item, payload);
			break;
		case EventType.ITEM_CANCELLED.valueOf():
			message = buildMessageItemCancelled(item, payload);
			break;
		case EventType.ITEM_METADATA_UPDATED.valueOf():
			message = buildMessageItemMetadataUpdated(item, payload);
			break;
		case EventType.ITEM_SOLD.valueOf():
			message = buildMessageItemSold(item, payload);
			break;
		case EventType.ITEM_TRANSFERRED.valueOf():
			message = buildMessageItemTransferred(item, payload);
			break;
		case EventType.ITEM_RECEIVED_OFFER.valueOf():
			message = buildMessageItemReceivedOffer(item, payload);
			break;
		case EventType.ITEM_RECEIVED_BID.valueOf():
			message = buildMessageItemReceivedBid(item, payload);
			break;
		default:
			message = `${collection} ${event_type}`;
			break;
	}
	return message;
}

const formatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
  });
  
function priceCalc(base_price: number, decimals: number, usd_price: string): string {
	return formatter.format((base_price / Math.pow(10, decimals)) * parseFloat(usd_price));
}

function buildMessageItemListed(item: Item, payload: ItemListedEventPayload): string {
	const price = priceCalc(payload.base_price, payload.payment_token.decimals, payload.payment_token.usd_price);
	const quantity_extension = payload.quantity > 1 ? ` for ${payload.quantity} items` : '';
	return `Token #${item.token_id} listed for ${price} by Owner ${payload.maker.address} ${quantity_extension}`;
}

function buildMessageItemCancelled(item: Item, payload: ItemCancelledEventPayload): string {
	return `Order for Token #${item.token_id} cancelled.`;	
}

function buildMessageItemMetadataUpdated(item: Item, payload: ItemMetadataUpdatePayload): string {
	return `Metadata updated for Token #${item.token_id}`
}

function buildMessageItemSold(item: Item, payload: ItemSoldEventPayload): string {
	const price = priceCalc(payload.sale_price, payload.payment_token.decimals, payload.payment_token.usd_price);
	const quantity_extension = payload.quantity > 1 ? `${payload.quantity} items of` : '';
	const private_extension = payload.is_private ? 'in a private sale' : '';
	return `${quantity_extension} Token #${item.token_id} sold to ${payload.taker.address} for ${price} ${private_extension}`;
}

function buildMessageItemTransferred(item: Item, payload: ItemTransferredEventPayload): string {
	const quantity_extension = payload.quantity > 1 ? `${payload.quantity} items of` : '';
	return `${quantity_extension} Token #${item.token_id} transferred from ${payload.from_account.address} to ${payload.to_account.address}`;
}

function buildMessageItemReceivedOffer(item: Item, payload: ItemReceivedOfferEventPayload): string {
	const price = priceCalc(payload.base_price, payload.payment_token.decimals, payload.payment_token.usd_price);
	const quantity_extension = payload.quantity > 1 ? ` for ${payload.quantity} items` : '';
	return `Token #${item.token_id} received an offer for ${price} from ${payload.maker.address} ${quantity_extension}`;
}

function buildMessageItemReceivedBid(item: Item, payload: ItemReceivedBidEventPayload): string {
	const price = priceCalc(payload.base_price, payload.payment_token.decimals, payload.payment_token.usd_price);
	const quantity_extension = payload.quantity > 1 ? ` for ${payload.quantity} items` : '';
	return `Token #${item.token_id} received a bid for ${price} from ${payload.maker.address} ${quantity_extension}`;
}