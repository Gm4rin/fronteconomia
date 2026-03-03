import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        await prisma.transaction.delete({
            where: { id: Number(id) }
        });
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao deletar" }, { status: 400 });
    }
}