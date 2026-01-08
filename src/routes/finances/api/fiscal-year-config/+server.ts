import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';
import { validateSession } from '$lib/server/auth';
import { fiscalYearConfigSchema } from '$lib/server/validation';
import { z } from 'zod';

// GET /finances/api/fiscal-year-config?fiscalYear=2024-2025
export const GET: RequestHandler = async (event) => {
	validateSession(event);

	const fiscalYear = event.url.searchParams.get('fiscalYear');

	if (!fiscalYear) {
		return json({ error: 'fiscalYear parameter is required' }, { status: 400 });
	}

	try {
		const config = await prisma.fiscalYearConfig.findUnique({
			where: { fiscalYear }
		});

		if (!config) {
			// Return default config if not found
			return json({
				fiscalYear,
				packDuesAmount: 100,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			});
		}

		return json({
			...config,
			createdAt: config.createdAt.toISOString(),
			updatedAt: config.updatedAt.toISOString()
		});
	} catch (error) {
		console.error('Error fetching fiscal year config:', error);
		return json({ error: 'Failed to fetch fiscal year config' }, { status: 500 });
	}
};

// POST /finances/api/fiscal-year-config (upsert)
export const POST: RequestHandler = async (event) => {
	validateSession(event);

	try {
		const body = await event.request.json();
		const validated = fiscalYearConfigSchema.parse(body);

		const config = await prisma.fiscalYearConfig.upsert({
			where: { fiscalYear: validated.fiscalYear },
			update: { packDuesAmount: validated.packDuesAmount },
			create: validated
		});

		return json(
			{
				...config,
				createdAt: config.createdAt.toISOString(),
				updatedAt: config.updatedAt.toISOString()
			},
			{ status: 201 }
		);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return json({ error: 'Validation failed', details: error.issues }, { status: 400 });
		}
		console.error('Error creating/updating fiscal year config:', error);
		return json({ error: 'Failed to save fiscal year config' }, { status: 500 });
	}
};
