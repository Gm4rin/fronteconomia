import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ transactionId: string }> } // Mudou aqui
) {
    try {
        const resolvedParams = await params;
        
        // Agora buscamos explicitamente pelo novo nome da pasta
        const idRaw = resolvedParams.transactionId; 

        console.log("ID Bruto recebido:", idRaw);

        const id = parseInt(idRaw);

        if (isNaN(id)) {
            return NextResponse.json({ 
                error: "ID inválido", 
                recebido: idRaw,
                tipo: typeof idRaw 
            }, { status: 400 });
        }

        await prisma.transaction.delete({
            where: { id: id },
        });

        return NextResponse.json({ message: "Sucesso!" }, { status: 200 });

    } catch (error: any) {
        console.error("Erro no delete:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}