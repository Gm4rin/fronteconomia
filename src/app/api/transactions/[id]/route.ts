import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const  id  = parseInt(params.id);

        if (isNaN(id)) {
            return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
        }

        await prisma.transaction.delete({
            where: {
                id: id,
            },
        });

        return NextResponse.json({ message: 'Transação removida!' }, { status: 200 });       
    } catch (error: any) {
        console.error("Erro no Prisma:", error);

        if (error.code === 'P2025') {
            return NextResponse.json({ error: 'Transação não encontrada'}, { status: 404 });
        }

        return NextResponse.json(
            { error: 'Erro ao deletar transação' },
            { status: 500 }
        );
    }
}