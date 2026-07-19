// src/app/api/bancos/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { BancoRepository } from '@/modules/banco/infrastructure/prisma/BancoRepository';

import { CreateBancoUseCase } from '@/modules/banco/application/use-cases/CreateBancoUseCase';
import { GetAllBancosUseCase } from '@/modules/banco/application/use-cases/GetAllBancosUseCase';
import { CreateBancoDTO } from '@/modules/banco/application/DTO/CreateBancoDto';

/**
 * Endpoint GET: /api/bancos
 * Objetivo: Devuelve la lista de todos los bancos registrados.
 */
export async function GET() {
  try {
    // 1. Instanciar dependencias (Composición)
    const bancoRepository = new BancoRepository();
    const getAllBancosUseCase = new GetAllBancosUseCase(bancoRepository);

    // 2. Ejecutar el caso de uso
    const bancos = await getAllBancosUseCase.execute();

    // 3. Retornar respuesta al cliente (Status 200 OK)
    return NextResponse.json({
      success: true,
      data: bancos
    }, { status: 200 });

  } catch (error: unknown) {

    const errorMessage = error instanceof Error ? error.message : "Error desconocido al obtener bancos";

    return NextResponse.json({
      success: false,
      message: "Ocurrió un error al intentar obtener los bancos.",
      error: errorMessage
    }, { status: 500 });
  }
}

/**
 * Endpoint POST: /api/bancos
 * Objetivo: Registra un nuevo banco en el sistema.
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Extraer y parsear el cuerpo de la petición (Payload)
    const body = await request.json();

    // 2. Mapear al DTO (Data Transfer Object)
    // Esto asegura que pasamos a la Capa de Aplicación exactamente lo que espera
    const dto: CreateBancoDTO = {
      codigo_banco: body.codigo_banco,
      nombre_banco: body.nombre_banco,
      activo: body.activo, // Será undefined si no se envía, y el Caso de Uso aplicará 'activo'
    };

    // 3. Instanciar dependencias
    /* 
     * Inyección de Dependencias manual: 
     * Le pasamos el Adaptador de Infraestructura (BancoRepository) 
     * al Caso de Uso (CreateBancoUseCase). 
     * El Caso de Uso no sabe que es Prisma, solo ve la interfaz IBancoRepository.
     */
    const bancoRepository = new BancoRepository();
    const createBancoUseCase = new CreateBancoUseCase(bancoRepository);

    // 4. Ejecutar el caso de uso
    const nuevoBanco = await createBancoUseCase.execute(dto);

    // 5. Retornar respuesta exitosa (Status 201 Created)
    return NextResponse.json({
      success: true,
      message: "Banco registrado exitosamente.",
      data: nuevoBanco
    }, { status: 201 });

  } catch (error: unknown) {

    const errorMessage = error instanceof Error ? error.message : "Error de validación desconocido";
    // Manejo de errores de reglas de negocio (ej. Código duplicado)
    // Devolvemos 400 Bad Request porque el error viene de un dato inválido del cliente.
    return NextResponse.json({
      success: false,
      message: errorMessage
    }, { status: 400 });
}
}