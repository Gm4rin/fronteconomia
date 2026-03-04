import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';

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