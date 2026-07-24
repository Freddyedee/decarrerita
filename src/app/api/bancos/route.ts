import { NextResponse } from "next/server";
import { BancoRepository } from "@/modules/banco/infrastructure/prisma/BancoRepository";
import { GetAllBancosUseCase } from "@/modules/banco/application/use-cases/GetAllBancosUseCase";
import { CreateBancoUseCase } from "@/modules/banco/application/use-cases/CreateBancoUseCase";
import { UpdateBancoStatusUseCase } from "@/modules/banco/application/use-cases/UpdateBancoStatusUseCase";
import { BancoMapper } from "@/modules/banco/infrastructure/mappers/banco.mapper";
import { prisma } from "@/shared/lib/prisma";

const bancoRepository = new BancoRepository(prisma);

export async function GET() {
  try {
    const getAllBancosUseCase = new GetAllBancosUseCase(bancoRepository);
    const bancosDominio = await getAllBancosUseCase.execute();
    
    // Usamos el Mapper para cumplir con la Clean Architecture
    const bancosDto = BancoMapper.toDtoList(bancosDominio);
    
    return NextResponse.json(bancosDto, { status: 200 });
  } catch (error: any) {
    console.error("Error en GET /api/bancos:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 🕵️‍♂️ TRAMPA 1: Imprimimos exactamente lo que envió el frontend
    console.log("📥 Payload recibido desde el frontend:", body); 
    
    if (!body.codigo) {
      // 🕵️‍♂️ TRAMPA 2: Avisamos si la validación falló
      console.log("❌ Error: El frontend no envió el campo 'codigo'"); 
      return NextResponse.json({ error: "Falta el código del banco desde el frontend" }, { status: 400 });
    }

    const createBancoUseCase = new CreateBancoUseCase(bancoRepository);
    
    const nuevoBancoDominio = await createBancoUseCase.execute({
      codigo_banco: body.codigo, 
      nombre_banco: body.nombre,
      activo: body.activo ?? true
    });

    const bancoDto = BancoMapper.toDto(nuevoBancoDominio);
    return NextResponse.json(bancoDto, { status: 201 });

  } catch (error: any) {
    console.error("Error en POST /api/bancos:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}



export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, activo } = body;

    if (id === undefined || activo === undefined) {
      return NextResponse.json({ error: "ID y activo son requeridos" }, { status: 400 });
    }

    const updateStatusUseCase = new UpdateBancoStatusUseCase(bancoRepository);
    const bancoActualizadoDominio = await updateStatusUseCase.execute(id, activo);

    const bancoDto = BancoMapper.toDto(bancoActualizadoDominio);

    return NextResponse.json(bancoDto, { status: 200 });
  } catch (error: any) {
    console.error("Error en PATCH /api/bancos:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}