import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';
import { validateSession } from '$lib/server/auth';

// DELETE /finances/api/pack-dues-payments/[id]
export const DELETE: RequestHandler = async (event) => {
	validateSession(event);

	const id = parseInt(event.params.id);

	if (isNaN(id)) {
		return json({ error: 'Invalid payment ID' }, { status: 400 });
	}

	try {
		// Get the payment to check if it's a Scout Account payment
		const payment = await prisma.packDuesPayment.findUnique({
			where: { id }
		});

		if (!payment) {
			return json({ error: 'Payment not found' }, { status: 404 });
		}

		// If it was a Scout Account payment, also delete the linked Transaction
		if (payment.paymentMethod === 'ScoutAccount') {
			await prisma.$transaction(async (tx) => {
				// Delete the pack dues payment
				await tx.packDuesPayment.delete({
					where: { id }
				});

				// Find and delete the corresponding transaction
				// Match by scout name, date, amount, and description
				await tx.transaction.deleteMany({
					where: {
						scoutName: payment.scoutName,
						description: 'Pack Dues',
						type: 'Withdrawal',
						amount: payment.amount,
						date: payment.date,
						fiscalYear: payment.fiscalYear
					}
				});
			});
		} else {
			// Just delete the pack dues payment
			await prisma.packDuesPayment.delete({
				where: { id }
			});
		}

		return json({ success: true });
	} catch (error) {
		console.error('Error deleting pack dues payment:', error);
		return json({ error: 'Failed to delete pack dues payment' }, { status: 500 });
	}
};
