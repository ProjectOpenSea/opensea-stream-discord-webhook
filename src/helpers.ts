import {EventType} from '../local-dependencies/pushed-updates-sdk/src/index';

export function getTitle(collection: string, event_type: string): string {
  return `Collection: ${collection} Event: ${event_type}`;
}

export function getMessage(item: {token_id: string, contract_address: string}, collection: string, event_type: string, timestamp: string, payload: any): string {
	console.log(payload);
	return `${collection} #${item.token_id} Event: ${event_type} at time: ${timestamp}`;
}