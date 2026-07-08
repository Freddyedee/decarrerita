import { ConfiguracionRepository } from "../infrastructure/prisma/configuracion.repository";
import { SetConfiguracionUseCase } from "../application/use-cases/SetConfiguracionUseCase";
import { ConfiguracionController } from "./configuracion.controller";

const configuracionRepository = new ConfiguracionRepository();

const setConfiguracionUseCase = new SetConfiguracionUseCase(configuracionRepository);

export const configuracionController = new ConfiguracionController(
    setConfiguracionUseCase,
    configuracionRepository
);

export { configuracionRepository };