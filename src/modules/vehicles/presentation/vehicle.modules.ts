/**
 * ============================================================
 * VEHICLE MODULE
 * ============================================================
 *
 * Este archivo constituye el Composition Root del módulo Vehicle.
 *
 * Responsabilidad:
 *
 * - Crear todas las dependencias.
 * - Inyectarlas correctamente.
 * - Exponer un único Controller listo para utilizar.
 *
 * Ninguna otra parte del sistema debería instanciar
 * repositorios o casos de uso manualmente.
 */

import { VehicleRepository } from "../infrastructure/prisma/vehicle.repository";

import { CreateVehicleUseCase } from "../application/use-cases/createVehicleUseCase";
import { GetAllVehiclesUseCase } from "../application/use-cases/GetAllVehiclesUseCase";

import { VehicleController } from "./vehicle.controller";

/* ============================================================
 * REPOSITORIES
 * ============================================================
 *
 * El repositorio representa el acceso a la base de datos.
 *
 * En este momento utilizamos Prisma, pero el Controller y
 * los Use Cases nunca conocerán esa implementación.
 */

const vehicleRepository = new VehicleRepository();

/* ============================================================
 * USE CASES
 * ============================================================
 *
 * Cada caso de uso recibe únicamente las dependencias
 * que realmente necesita.
 */

const createVehicleUseCase =
    new CreateVehicleUseCase(vehicleRepository);

const getAllVehiclesUseCase =
    new GetAllVehiclesUseCase(vehicleRepository);

/* ============================================================
 * CONTROLLER
 * ============================================================
 *
 * El Controller recibe todos los casos de uso del módulo.
 *
 * Cuando el módulo crezca simplemente iremos agregando
 * nuevos casos de uso aquí.
 */

export const vehicleController =
    new VehicleController(

        createVehicleUseCase,

        getAllVehiclesUseCase

    );