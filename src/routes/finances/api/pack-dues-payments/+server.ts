import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { prisma } from "$lib/server/prisma";
import { validateSession } from "$lib/server/auth";
import { packDuesPaymentSchema } from "$lib/server/validation";
import { z } from "zod";

// GET /finances/api/pack-dues-payments?fiscalYear=2024-2025&scoutId=5
export const GET: RequestHandler = async (event) => {
  validateSession(event);

  const fiscalYear = event.url.searchParams.get("fiscalYear");
  const scoutIdParam = event.url.searchParams.get("scoutId");
  const scoutName = event.url.searchParams.get("scoutName");

  const where: any = {};

  if (fiscalYear) {
    where.fiscalYear = fiscalYear;
  }

  if (scoutIdParam) {
    where.scoutId = parseInt(scoutIdParam);
  }

  if (scoutName) {
    where.scoutName = scoutName;
  }

  try {
    const payments = await prisma.packDuesPayment.findMany({
      where,
      orderBy: { date: "desc" },
    });

    const paymentsResponse = payments.map((payment) => ({
      ...payment,
      date: payment.date.toISOString(),
      createdAt: payment.createdAt.toISOString(),
    }));

    return json(paymentsResponse);
  } catch (error) {
    console.error("Error fetching pack dues payments:", error);
    return json(
      { error: "Failed to fetch pack dues payments" },
      { status: 500 },
    );
  }
};

// POST /finances/api/pack-dues-payments
export const POST: RequestHandler = async (event) => {
  validateSession(event);

  try {
    const body = await event.request.json();
    console.log("Received pack dues payment request:", body);
    const validated = packDuesPaymentSchema.parse(body);
    console.log("Validated data:", validated);

    // Convert payment method to database enum format
    const paymentMethodMap: Record<string, string> = {
      Cash: "Cash",
      Check: "Check",
      "Scout Account": "ScoutAccount",
    };
    const dbPaymentMethod =
      paymentMethodMap[validated.paymentMethod] || validated.paymentMethod;

    // Get fiscal year config to check pack dues amount
    let config = await prisma.fiscalYearConfig.findUnique({
      where: { fiscalYear: validated.fiscalYear },
    });

    // If no config exists, create default
    if (!config) {
      config = await prisma.fiscalYearConfig.create({
        data: {
          fiscalYear: validated.fiscalYear,
          packDuesAmount: 100,
        },
      });
    }

    const packDuesAmount = config.packDuesAmount;

    // Get existing payments for this scout and fiscal year
    const existingPayments = await prisma.packDuesPayment.findMany({
      where: {
        scoutId: validated.scoutId,
        fiscalYear: validated.fiscalYear,
      },
    });

    // Calculate total paid so far
    const totalPaid = existingPayments.reduce((sum, p) => sum + p.amount, 0);
    const remaining = packDuesAmount - totalPaid;

    // Validate amount doesn't exceed remaining (unless override)
    if (!validated.isOverride && validated.amount > remaining) {
      return json(
        {
          error: `Amount exceeds remaining balance of $${remaining.toFixed(2)}. Total dues: $${packDuesAmount}, already paid: $${totalPaid.toFixed(2)}`,
        },
        { status: 400 },
      );
    }

    // If payment method is Scout Account, also create a Transaction
    if (validated.paymentMethod === "Scout Account") {
      // Create both records in a transaction
      const result = await prisma.$transaction(async (tx) => {
        // Create the pack dues payment
        const payment = await tx.packDuesPayment.create({
          data: {
            ...validated,
            paymentMethod: dbPaymentMethod as any,
          },
        });

        // Create the corresponding transaction
        await tx.transaction.create({
          data: {
            date: new Date(validated.date),
            scoutName: validated.scoutName,
            description: "Pack Dues",
            type: "Withdrawal",
            amount: validated.amount,
            notes: `Pack dues payment (ID: ${payment.id})${validated.notes ? " - " + validated.notes : ""}`,
            fiscalYear: validated.fiscalYear,
          },
        });

        return payment;
      });

      return json(
        {
          ...result,
          date: result.date.toISOString(),
          createdAt: result.createdAt.toISOString(),
        },
        { status: 201 },
      );
    } else {
      // Just create the pack dues payment
      const payment = await prisma.packDuesPayment.create({
        data: {
          ...validated,
          paymentMethod: dbPaymentMethod as any,
        },
      });

      return json(
        {
          ...payment,
          date: payment.date.toISOString(),
          createdAt: payment.createdAt.toISOString(),
        },
        { status: 201 },
      );
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation error:", error.issues);
      return json(
        { error: "Validation failed", details: error.issues },
        { status: 400 },
      );
    }
    console.error("Error creating pack dues payment:", error);
    return json(
      { error: "Failed to create pack dues payment" },
      { status: 500 },
    );
  }
};
