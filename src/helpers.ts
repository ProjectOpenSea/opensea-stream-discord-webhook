import { EmbedAuthorData, MessageEmbed } from "discord.js";
import {
  EventType,
  BaseItemType,
  ItemListedEventPayload,
  ItemCancelledEventPayload,
  ItemMetadataUpdatePayload,
  ItemSoldEventPayload,
  ItemTransferredEventPayload,
  ItemReceivedBidEventPayload,
  ItemReceivedOfferEventPayload,
  BaseStreamMessage,
  ItemListedEvent,
  Payload,
  ItemReceivedOfferEvent,
  ItemReceivedBidEvent,
  ItemSoldEvent,
} from "@opensea/stream-js";

export function getMessageEmbed(
  event: BaseStreamMessage<any>,
  collection_name: string
): MessageEmbed {
  const embed = new MessageEmbed();
  switch (event.event_type) {
    case EventType.ITEM_LISTED.valueOf():
      return setListingMessageEmbed(embed, event, collection_name);
    case EventType.ITEM_RECEIVED_OFFER:
      return setReceivedOfferMessageEmbed(embed, event, collection_name);
    case EventType.ITEM_RECEIVED_BID:
      return setReceivedBidMessageEmbed(embed, event, collection_name);
    case EventType.ITEM_SOLD:
      return setReceivedBidMessageEmbed(embed, event, collection_name);
    // case EventType.ITEM_TRANSFERRED:
    // 	return setReceivedBidMessageEmbed(embed, event, collection_name);
    default:
      return setBaseEmbed(embed, event);
    // case EventType.ITEM_CANCELLED:
    // 	createCancellationMessageEmbed(embed, event);
    // 	break;
    // case EventType.ITEM_METADATA_UPDATED:
    // 	createMetadataUpdateMessageEmbed(embed, event);
    // 	break;
    // case EventType.ITEM_RECEIVED_BID:
    // 	createReceivedBidMessageEmbed(embed, event);
    // 	break;
  }
}

function setBaseEmbed(
  embed: MessageEmbed,
  event: BaseStreamMessage<Payload>
): MessageEmbed {
  embed.setURL(event.payload.item.permalink);
  embed.setThumbnail(getThumbnailUrl(event.payload));
  return embed;
}

export function setListingMessageEmbed(
  embed: MessageEmbed,
  event: ItemListedEvent,
  collection_name: string
): MessageEmbed {
  embed = setBaseEmbed(embed, event);
  embed.setAuthor(getListingTitle(event, collection_name));
  embed.setDescription(
    getNameLine(event.payload, collection_name) +
      getOwnerLine(event.payload) +
      getWinnerLine(event.payload)
  );
  embed = setListingPrice(embed, event.payload);
  embed.setColor("GREEN");
  return embed;
}

export function setReceivedOfferMessageEmbed(
  embed: MessageEmbed,
  event: ItemReceivedOfferEvent,
  collection_name: string
): MessageEmbed {
  embed = setBaseEmbed(embed, event);
  embed.setAuthor(getOfferTitle(event, collection_name));
  embed.setDescription(
    getNameLine(event.payload, collection_name) +
      getOwnerLine(event.payload) +
      getWinnerLine(event.payload)
  );
  embed = setOfferPrice(embed, event.payload);
  embed.setColor("LUMINOUS_VIVID_PINK");
  return embed;
}

export function setReceivedBidMessageEmbed(
  embed: MessageEmbed,
  event: ItemReceivedBidEvent,
  collection_name: string
): MessageEmbed {
  embed = setBaseEmbed(embed, event);
  embed.setAuthor(getBidTitle(event, collection_name));
  embed.setDescription(
    getNameLine(event.payload, collection_name) +
      getOwnerLine(event.payload) +
      getWinnerLine(event.payload)
  );
  embed = setOfferPrice(embed, event.payload);
  embed.setColor("YELLOW");
  return embed;
}

export function setSaleMessageEmbed(
  embed: MessageEmbed,
  event: ItemSoldEvent,
  collection_name: string
): MessageEmbed {
  embed = setBaseEmbed(embed, event);
  embed.setAuthor(getSaleTitle(event, collection_name));
  embed.setDescription(
    getNameLine(event.payload, collection_name) +
      getOwnerLine(event.payload) +
      getWinnerLine(event.payload)
  );
  embed = setSalePrice(embed, event.payload);
  embed.setColor("NAVY");
  return embed;
}

function setListingPrice(
  embed: MessageEmbed,
  payload: ItemListedEventPayload
): MessageEmbed {
  // TODO: expand for different listing types (dutch, english)
  embed.addField(
    "Listed for",
    `${getTokenPrice(payload)} ${payload.payment_token.symbol} / ${getUSDPrice(
      payload
    )} USD`
  );
  return embed;
}

function setOfferPrice(
  embed: MessageEmbed,
  payload: ItemReceivedOfferEventPayload
): MessageEmbed {
  // TODO: expand for different listing types (dutch, english)
  embed.addField(
    "Offer Amount",
    `${getTokenPrice(payload)} ${payload.payment_token.symbol} / ${getUSDPrice(
      payload
    )} USD`
  );
  return embed;
}

function getOfferTitle(
  event: ItemReceivedOfferEvent,
  collection_name: string
): EmbedAuthorData {
  return {
    name: `Offer: ${getItemName(event.payload, collection_name)}`,
    url: getUrl(event.payload.item),
  };
}

function getBidTitle(
  event: ItemReceivedBidEvent,
  collection_name: string
): EmbedAuthorData {
  return {
    name: `Bid: ${getItemName(event.payload, collection_name)}`,
    url: getUrl(event.payload.item),
  };
}

function getSaleTitle(
  event: ItemSoldEvent,
  collection_name: string
): EmbedAuthorData {
  return {
    name: `Sold: ${getItemName(event.payload, collection_name)}`,
    url: getUrl(event.payload.item),
  };
}

function setSalePrice(
  embed: MessageEmbed,
  payload: ItemSoldEventPayload
): MessageEmbed {
  // TODO: expand for different listing types (dutch, english)
  embed.addField(
    "Sold Amount",
    `${getTokenPrice(payload)} ${payload.payment_token.symbol} / ${getUSDPrice(
      payload
    )} USD`
  );
  return embed;
}

function getListingTitle(
  event: ItemListedEvent,
  collection_name: string
): EmbedAuthorData {
  let prefix = event.payload.is_private ? "Private " : "";
  if (event.payload.listing_type === "dutch") {
    prefix = "Dutch Auction ";
  } else if (event.payload.listing_type === "english") {
    prefix = "English Auction ";
  }
  return {
    name: `${prefix}Listing: ${getItemName(event.payload, collection_name)}`,
    url: getUrl(event.payload.item),
  };
}

function getNameLine(payload: Payload, collection_name: string): string {
  return `[**Name:** ${getItemName(payload, collection_name)}](${getUrl(
    payload.item
  )})\n`;
}

function getOwnerLine(
  payload:
    | ItemListedEventPayload
    | ItemSoldEventPayload
    | ItemReceivedBidEventPayload
    | ItemReceivedOfferEventPayload
): string {
  return `**Owner:** ${
    payload.maker == null ? "None" : payload.maker.address
  }\n`;
}

function getWinnerLine(
  payload:
    | ItemListedEventPayload
    | ItemSoldEventPayload
    | ItemReceivedBidEventPayload
    | ItemReceivedOfferEventPayload
): string {
  return payload.taker == null ? "" : `**Winner:** ${payload.taker.address}\n`;
}

function getDescription(payload: ItemMetadataUpdatePayload): string {
  return payload.description;
}

function getItemName(payload: Payload, collection_name: string): string {
  const nft_id_arr = payload.item.nft_id.split("/");
  return (
    payload.item.metadata.name ||
    `${collection_name} #${nft_id_arr[nft_id_arr.length - 1]}`
  );
}

function isInstanceOfItemSoldPayload(
  payload: Payload
): payload is ItemSoldEventPayload {
  return "sale_price" in payload;
}

function getTokenPrice(
  payload:
    | ItemListedEventPayload
    | ItemReceivedOfferEventPayload
    | ItemSoldEventPayload
): number {
  let price;
  if (isInstanceOfItemSoldPayload(payload)) {
    price = payload.sale_price;
  } else {
    price = payload.base_price;
  }
  return parseInt(price) / Math.pow(10, payload.payment_token.decimals);
}

function getUSDPrice(
  payload:
    | ItemListedEventPayload
    | ItemReceivedOfferEventPayload
    | ItemSoldEventPayload
): string {
  return (
    getTokenPrice(payload) * parseFloat(payload.payment_token.usd_price)
  ).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

function getThumbnailUrl(payload: Payload): string {
  return payload.item.metadata.image_url;
}

function getUrl(item: BaseItemType): string {
  return item.permalink;
}

export function getMessage(
  item: BaseItemType,
  collection: string,
  event_type: string,
  timestamp: string,
  payload: any
): string {
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

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function priceCalc(
  base_price: string,
  decimals: number,
  usd_price: string
): string {
  return formatter.format(
    (parseInt(base_price) / Math.pow(10, decimals)) * parseFloat(usd_price)
  );
}

function buildMessageItemListed(
  item: BaseItemType,
  payload: ItemListedEventPayload
): string {
  const price = priceCalc(
    payload.base_price,
    payload.payment_token.decimals,
    payload.payment_token.usd_price
  );
  const quantity_extension =
    payload.quantity > 1 ? ` for ${payload.quantity} items` : "";
  return `Token #${item.nft_id} listed for ${price} by Owner ${payload.maker.address} ${quantity_extension}`;
}

function buildMessageItemCancelled(
  item: BaseItemType,
  payload: ItemCancelledEventPayload
): string {
  return `Order for Token #${item.nft_id} cancelled.`;
}

function buildMessageItemMetadataUpdated(
  item: BaseItemType,
  payload: ItemMetadataUpdatePayload
): string {
  return `Metadata updated for Token #${item.nft_id}`;
}

function buildMessageItemSold(
  item: BaseItemType,
  payload: ItemSoldEventPayload
): string {
  const price = priceCalc(
    payload.sale_price,
    payload.payment_token.decimals,
    payload.payment_token.usd_price
  );
  const quantity_extension =
    payload.quantity > 1 ? `${payload.quantity} items of` : "";
  const private_extension = payload.is_private ? "in a private sale" : "";
  return `${quantity_extension} Token #${item.nft_id} sold to ${payload.taker.address} for ${price} ${private_extension}`;
}

function buildMessageItemTransferred(
  item: BaseItemType,
  payload: ItemTransferredEventPayload
): string {
  const quantity_extension =
    payload.quantity > 1 ? `${payload.quantity} items of` : "";
  return `${quantity_extension} Token #${item.nft_id} transferred from ${payload.from_account.address} to ${payload.to_account.address}`;
}

function buildMessageItemReceivedOffer(
  item: BaseItemType,
  payload: ItemReceivedOfferEventPayload
): string {
  const price = priceCalc(
    payload.base_price,
    payload.payment_token.decimals,
    payload.payment_token.usd_price
  );
  const quantity_extension =
    payload.quantity > 1 ? ` for ${payload.quantity} items` : "";
  return `Token #${item.nft_id} received an offer for ${price} from ${payload.maker.address} ${quantity_extension}`;
}

function buildMessageItemReceivedBid(
  item: BaseItemType,
  payload: ItemReceivedBidEventPayload
): string {
  const price = priceCalc(
    payload.base_price,
    payload.payment_token.decimals,
    payload.payment_token.usd_price
  );
  const quantity_extension =
    payload.quantity > 1 ? ` for ${payload.quantity} items` : "";
  return `Token #${item.nft_id} received a bid for ${price} from ${payload.maker.address} ${quantity_extension}`;
}
