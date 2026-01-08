import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';
import { validateSession } from '$lib/server/auth';

// GET /finances/api/scouts/[id]/dues-summary
export const GET: RequestHandler = async (event) => {
	validateSession(event);

	const scoutId = parseInt(event.params.id);

	if (isNaN(scoutId)) {
		return json({ error: 'Invalid scout ID' }, { status: 400 });
	}

	try {
		// Get the scout
		const scout = await prisma.scout.findUnique({
			where: { id: scoutId }
		});

		if (!scout) {
			return json({ error: 'Scout not found' }, { status: 404 });
		}

		// Get or create fiscal year config
		let config = await prisma.fiscalYearConfig.findUnique({
			where: { fiscalYear: scout.fiscalYear }
		});

		if (!config) {
			config = await prisma.fiscalYearConfig.create({
				data: {
					fiscalYear: scout.fiscalYear,
					packDuesAmount: 100
				}
			});
		}

		// Get all pack dues payments for this scout
		const payments = await prisma.packDuesPayment.findMany({
			where: {
				scoutId: scoutId,
				fiscalYear: scout.fiscalYear
			},
			orderBy: { date: 'desc' }
		});

		// Calculate totals
		const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
		const remaining = Math.max(0, config.packDuesAmount - totalPaid);

		// Build the response
		const summary = {
			scoutId: scout.id,
			scoutName: scout.name,
			fiscalYear: scout.fiscalYear,
			packDuesAmount: config.packDuesAmount,
			totalPaid,
			remaining,
			payments: payments.map((p) => ({
				...p,
				date: p.date.toISOString(),
				createdAt: p.createdAt.toISOString()
			})),
			duesOverrideReason: scout.duesOverrideReason
		};

		return json(summary);
	} catch (error) {
		console.error('Error fetching dues summary:', error);
		return json({ error: 'Failed to fetch dues summary' }, { status: 500 });
	}
};
