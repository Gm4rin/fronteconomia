import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    let where = {};
    if  (month && year) {
        const startDate = new Date(Number(year), Number(month) -1, 1);
        const endDate = new Date(Number(year), Number(month), 0, 23, 59, 59);
        where = { date: { gte: startDate, lte: endDate } };
    }

    const transactions = await prisma.transaction.findMany({ where });

    const summary = transactions.reduce((acc, t) => {
        const amount = Number(t.amount);
        if (amount > 0) acc.incomes - acc.expenses;
        return acc;
    }, { incomes: 0, expenses: 0, total: 0 });

    return NextResponse.json(summary);
}