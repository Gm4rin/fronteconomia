import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Adicione este import!
// import { api } from '@/lib/api' <-- Você pode remover esta linha, não usamos Axios aqui dentro

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    let where = {};
    if (month && year) {
        const startDate = new Date(Number(year), Number(month) - 1, 1);
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
    try {
        const body = await request.json();
        const transaction = await prisma.transaction.create({
            data: {
                description: body.description,
                amount: Number(body.amount),
                category: body.category,
                // Adicionei a data atual caso o body não envie
                date: new Date(), 
            }
        });
        return NextResponse.json(transaction, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Erro ao criar transação' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;

        await prisma.transaction.delete({
            where: {
                id: Number(id),
            },
        });

        return NextResponse.json({ message: 'Transação removida!' }, { status: 200 });
    } catch (error) {
        console.error("Erro no Delete:", error);
        return NextResponse.json(
            { error: 'Erro ao deletar transação' },
            { status: 500 }
        );
    }
}