import { NextResponse } from 'next/server';
import { api } from '@/lib/api'
import { z } from 'zod';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    let where = {};
    if (month && year) {
        const startDate = new Date(Number(year), Number(month) -1, 1);
        const endDate = new Date(Number(year), Number(month), 0, 23, 59, 59);
        where = { date: { gte: startDate, lte: endDate } };
    }

    const transactions = await prisma.transaction.findMany({
        where,
        orderBy: { date: 'desc' }
    });

    return NextResponse.json(transactions);
}

export async function POST(request: Request) {
    const body = await request.json();
    const transaction = await prisma.transaction.create({
        data: {
            description: body.description,
            amount: Number(body.amount),
            category: body.category,
        }
    });
    return NextResponse.json(transaction, { status: 201 });
}