// presentation/calificacion.modules.ts
import { prisma } from "@/shared/lib/prisma";
import { CalificacionRepository } from "../infrastructure/prisma/calificacion.repository";
import { CalificarTrasladoUseCase } from "../application/use-cases/CalificarTrasladoUseCase";
import { CalificacionController } from "./calificacion.controller";
import { trasladoRepository } from "@/modules/Traslado/presentation/traslado.modules"; // ajusta si no lo exportas aún
import { PrismaDriverRepository } from "@/modules/user/infrastructure/repositories/PrismaDriverRepository";
import { PrismaClientRepository } from "@/modules/user/infrastructure/repositories/PrismaClientRepository";

const calificacionRepository = new CalificacionRepository();

const clientRepository = new PrismaClientRepository(prisma); 

const driverRepository = new PrismaDriverRepository(prisma); 

const calificarTrasladoUseCase = new CalificarTrasladoUseCase(calificacionRepository, trasladoRepository, driverRepository, clientRepository);

export const calificacionController = new CalificacionController(calificarTrasladoUseCase);