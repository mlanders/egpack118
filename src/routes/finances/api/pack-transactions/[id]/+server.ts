import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';
import { validateSession } from '$lib/server/auth';

// DELETE /finances/api/pack-transactions/[id]
export const DELETE: RequestHandler = async (event) => {
	validateSession(event);

	const id = parseInt(event.params.id);

	try {
		await prisma.packTransaction.delete({
			where: { id }
		});

		return json({ success: true });
	} catch (error) {
		console.error('Error deleting pack transaction:', error);
		return json({ error: 'Failed to delete pack transaction' }, { status: 500 });
	}
};
