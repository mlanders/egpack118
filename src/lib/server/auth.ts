import type { RequestEvent } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';

const SESSION_TIMEOUT = 15 * 60 * 1000; // 15 minutes

export function validateSession(event: RequestEvent): void {
	const authTimestamp = event.cookies.get('finance_auth_timestamp');

	if (!authTimestamp) {
		throw error(401, { message: 'Unauthorized - Please log in' });
	}

	const timestamp = parseInt(authTimestamp);
	const now = Date.now();

	if (now - timestamp >= SESSION_TIMEOUT) {
		event.cookies.delete('finance_auth_timestamp', { path: '/finances' });
		throw error(401, { message: 'Session expired - Please log in again' });
	}
}
