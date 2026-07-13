import { TrasladoRepository } from "../infrastructure/prisma/traslado.repository";
import { AsignacionRepository } from "../infrastructure/prisma/asignacion.repository";
import { HistorialTrasladoRepository } from "../infrastructure/prisma/historial-traslado-repository";

import { SolicitarTrasladoUseCase } from "../application/use-cases/SolicitarTrasladoUseCase";
import { ResponderAsignacionUseCase } from "../application/use-cases/ResponderAsignacionUseCase";
import { IniciarTrasladoUseCase } from "../application/use-cases/IniciarTrasladoUseCase";
import { CompletarTrasladoUseCase } from "../application/use-cases/CompletarTrasladoUseCase";
import { CancelarTrasladoUseCase } from "../application/use-cases/CancelarTrasladoUseCase";

import { prisma } from "@/infra/prisma/client";

import { TrasladoController } from "./traslado.controller";



// Piezas propias del módulo
const trasladoRepository = new TrasladoRepository();
const asignacionRepository = new AsignacionRepository();
const historialRepository = new HistorialTrasladoRepository();

// Piezas de otros módulos — solo los puertos ya ensamblados
import { vehicleRepository } from "@/modules/vehicles/presentation/vehicle.modules";
import { tarifaRepository } from "@/modules/Tarifa/presentation/tarifa.modules";
import { walletService } from "@/modules/wallet/presentation/wallet.modules";
import { transactionManager } from "@/shared/infrastructure/shared.modules";

// Estas dependen de cómo tu compañero exporte sus repositorios
// concretos — ajusta el import si el nombre real difiere.
import { PrismaClientRepository } from "@/modules/user/infrastructure/repositories/PrismaClientRepository";
import { PrismaDriverRepository } from "@/modules/user/infrastructure/repositories/PrismaDriverRepository";


const clientRepository = new PrismaClientRepository(prisma);
const driverRepository = new PrismaDriverRepository(prisma);

import { VehicleRepository } from "@/modules/vehicles/infrastructure/prisma/vehicle.repository";
const vehicleRepositoryForAsignacion = new VehicleRepository();

const solicitarTrasladoUseCase = new SolicitarTrasladoUseCase(
    trasladoRepository, asignacionRepository, historialRepository,
    vehicleRepository, tarifaRepository, clientRepository, driverRepository, walletService
);

const responderAsignacionUseCase = new ResponderAsignacionUseCase(
    trasladoRepository, asignacionRepository, historialRepository,
    walletService, vehicleRepositoryForAsignacion
);

const iniciarTrasladoUseCase = new IniciarTrasladoUseCase(
    trasladoRepository, historialRepository, walletService, transactionManager
);

const completarTrasladoUseCase = new CompletarTrasladoUseCase(
    trasladoRepository, historialRepository, tarifaRepository, walletService, transactionManager
);

const cancelarTrasladoUseCase = new CancelarTrasladoUseCase(
    trasladoRepository, historialRepository, tarifaRepository, walletService, transactionManager
);

export const trasladoController = new TrasladoController(
    solicitarTrasladoUseCase, responderAsignacionUseCase,
    iniciarTrasladoUseCase, completarTrasladoUseCase, cancelarTrasladoUseCase,
    trasladoRepository
);