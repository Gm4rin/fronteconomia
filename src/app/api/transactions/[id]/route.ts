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
                // Se seu ID for auto-increment (1, 2, 3...), use Number(id)
                // Se for String/UUID, use apenas id
                id: Number(id), 
            },
        });
        return NextResponse.json({ message: 'Deletado!' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao deletar' }, { status: 500 });
    }
}