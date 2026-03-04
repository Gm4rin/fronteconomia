import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> } 
) {
    try {
        // Aguarda o params ser resolvido
        const { id: idRaw } = await params;

        const id = parseInt(idRaw);

        if (isNaN(id)) {
            console.error("ID recebido não é um número válido:", idRaw);
            return NextResponse.json({ error: "ID inválido" }, { status: 400 });
        }

        await prisma.transaction.delete({
            where: { id: id },
        });

        return NextResponse.json({ message: "Transação removida!" }, { status: 200 });

    } catch (error: any) {
        console.error("Erro ao deletar:", error);

        if (error.code === 'P2025') {
            return NextResponse.json({ error: "Transação não encontrada" }, { status: 400 });
        }

        return NextResponse.json({ error: "Erro interno no servidor" }, {status: 500} )
    }
}