import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> } 
) {
    try {
        const resolvedParams = await params;
        
        // LOG PARA DIAGNÓSTICO: Verifique isso nos logs da Vercel!
        console.log("CONTEÚDO DO PARAMS:", resolvedParams);

        const idRaw = resolvedParams.id;
        
        // Se idRaw for undefined, o Next.js não encontrou a pasta [id]
        if (!idRaw) {
             return NextResponse.json({ 
                 error: "ID não encontrado nos parâmetros", 
                 debug: resolvedParams 
             }, { status: 400 });
        }

        const id = parseInt(idRaw);

        if (isNaN(id)) {
            return NextResponse.json({ error: "ID inválido", recebido: idRaw }, { status: 400 });
        }

        await prisma.transaction.delete({
            where: { id: id },
        });

        return NextResponse.json({ message: "Deletado!" }, { status: 200 });

    } catch (error: any) {
        console.error("Erro no servidor:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}