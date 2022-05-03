import {EventType, BaseItemType, ItemListedEventPayload, ItemCancelledEventPayload, ItemMetadataUpdatePayload, ItemSoldEventPayload, ItemTransferredEventPayload, ItemReceivedBidEventPayload, ItemReceivedOfferEventPayload} from '../local-dependencies/opensea-stream-js-sdk/src/index';

export function getTitle(collection: string, item: BaseItemType): string {
  return `${collection} #${item.nft_id}`;
}

export function getUrl(item: BaseItemType): string {
	return item.permalink
}

export function getMessage(item: BaseItemType, collection: string, event_type: string, timestamp: string, payload: any): string {
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

function buildMessageItemListed(item: BaseItemType, payload: ItemListedEventPayload): string {
	const price = priceCalc(payload.base_price, payload.payment_token.decimals, payload.payment_token.usd_price);
	const quantity_extension = payload.quantity > 1 ? ` for ${payload.quantity} items` : '';
	return `Token #${item.nft_id} listed for ${price} by Owner ${payload.maker.address} ${quantity_extension}`;
}

function buildMessageItemCancelled(item: BaseItemType, payload: ItemCancelledEventPayload): string {
	return `Order for Token #${item.nft_id} cancelled.`;	
}

function buildMessageItemMetadataUpdated(item: BaseItemType, payload: ItemMetadataUpdatePayload): string {
	return `Metadata updated for Token #${item.nft_id}`
}

function buildMessageItemSold(item: BaseItemType, payload: ItemSoldEventPayload): string {
	const price = priceCalc(payload.sale_price, payload.payment_token.decimals, payload.payment_token.usd_price);
	const quantity_extension = payload.quantity > 1 ? `${payload.quantity} items of` : '';
	const private_extension = payload.is_private ? 'in a private sale' : '';
	return `${quantity_extension} Token #${item.nft_id} sold to ${payload.taker.address} for ${price} ${private_extension}`;
}

function buildMessageItemTransferred(item: BaseItemType, payload: ItemTransferredEventPayload): string {
	const quantity_extension = payload.quantity > 1 ? `${payload.quantity} items of` : '';
	return `${quantity_extension} Token #${item.nft_id} transferred from ${payload.from_account.address} to ${payload.to_account.address}`;
}

function buildMessageItemReceivedOffer(item: BaseItemType, payload: ItemReceivedOfferEventPayload): string {
	const price = priceCalc(payload.base_price, payload.payment_token.decimals, payload.payment_token.usd_price);
	const quantity_extension = payload.quantity > 1 ? ` for ${payload.quantity} items` : '';
	return `Token #${item.nft_id} received an offer for ${price} from ${payload.maker.address} ${quantity_extension}`;
}

function buildMessageItemReceivedBid(item: BaseItemType, payload: ItemReceivedBidEventPayload): string {
	const price = priceCalc(payload.base_price, payload.payment_token.decimals, payload.payment_token.usd_price);
	const quantity_extension = payload.quantity > 1 ? ` for ${payload.quantity} items` : '';
	return `Token #${item.nft_id} received a bid for ${price} from ${payload.maker.address} ${quantity_extension}`;
}