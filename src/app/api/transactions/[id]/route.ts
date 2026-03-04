import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';

export async function DELETE(
    request: Request,
    // No Next.js 16, params é uma Promise
    { params }: { params: Promise<{ id: string }> } 
) {
    try {
        // 1. Você PRECISA dar await no params primeiro
        const resolvedParams = await params;
        const idRaw = resolvedParams.id;
        
        // 2. Agora sim, converte o texto para número
        const id = parseInt(idRaw);

        if (isNaN(id)) {
            console.error("O ID chegou como:", idRaw);
            return NextResponse.json({ error: "ID inválido" }, { status: 400 });
        }

        // 3. Deleta no banco usando o ID numérico
        await prisma.transaction.delete({
            where: { id: id },
        });

        return NextResponse.json({ message: "Transação removida!" }, { status: 200 });

    } catch (error: any) {
        console.error("Erro ao deletar:", error);
        
        // P2025 é o erro de "registro não encontrado" do Prisma
        if (error.code === 'P2025') {
            return NextResponse.json({ error: "Transação não encontrada" }, { status: 404 });
        }

        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}