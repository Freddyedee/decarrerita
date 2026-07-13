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
import { RevisionRepository } from "../infrastructure/prisma/revision.repository";

import { CreateVehicleUseCase } from "../application/use-cases/createVehicleUseCase";
import { GetAllVehiclesUseCase } from "../application/use-cases/GetAllVehiclesUseCase";
import { GetVehicleByIdUseCase } from "../application/use-cases/GetVehicleByIdUseCase";
import { UpdateVehicleStatusUseCase } from "../application/use-cases/UpdateVehicleStatusUseCase";
import { GetVehiclesByDriverUseCase } from "../application/use-cases/GetVehiclesByDriverUseCase";

import { SelectVehicleUseCase } from "../application/use-cases/SelectVehicleUseCase";
import { RegisterVehicleInspectionsUseCase } from "../application/use-cases/RegisterVehicleInspectionUseCase";
import { GetInspectionHistoryUseCase } from "../application/use-cases/GetInspectionHistoryUseCase";

import { RevisionController } from "./revision.controller";
import { VehicleController } from "./vehicle.controller";
import { MarcaRepository } from "../infrastructure/prisma/marca.repository";
import { GetAllMarcasUseCase } from "../application/use-cases/GetAllMarcasUseCase";
import { MarcaController } from "./marca.controller";
import { CreateMarcaUseCase } from "../application/use-cases/CreateMarcaUseCase";


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
const revisionRepository = new RevisionRepository(); 
const marcaRepository = new MarcaRepository(); 

/* ============================================================
 * USE CASES
 * ============================================================
 *
 * Cada caso de uso recibe únicamente las dependencias
 * que realmente necesita.
 */

const createVehicleUseCase          = new CreateVehicleUseCase(vehicleRepository, marcaRepository);
const getAllVehiclesUseCase         = new GetAllVehiclesUseCase(vehicleRepository);
const getVehicleByIdUseCase         = new GetVehicleByIdUseCase(vehicleRepository);
const updateVehicleStatusUseCase    = new UpdateVehicleStatusUseCase(vehicleRepository);
const getVehiclesByDriverUseCase    = new GetVehiclesByDriverUseCase(vehicleRepository);
const selectVehiclesUseCase         = new SelectVehicleUseCase(vehicleRepository, revisionRepository); 


//Use cases de Revision 

const registerInspectionUseCase = new RegisterVehicleInspectionsUseCase(revisionRepository, vehicleRepository); 
const getInspectionHistoryUseCase = new GetInspectionHistoryUseCase(revisionRepository); 

// Use case de Marca

const createMarcaUseCase = new CreateMarcaUseCase(marcaRepository);
const getAllMarcasUseCase = new GetAllMarcasUseCase(marcaRepository); 



/* ============================================================
 * CONTROLLER
 * ============================================================
 *
 * El Controller recibe todos los casos de uso del módulo.
 *
 * Cuando el módulo crezca simplemente iremos agregando
 * nuevos casos de uso aquí.
 */

export const vehicleController = new VehicleController(

        createVehicleUseCase,
        getAllVehiclesUseCase,
        getVehicleByIdUseCase, 
        updateVehicleStatusUseCase,
        getVehiclesByDriverUseCase, 
        selectVehiclesUseCase
    );

export const revisionController = new RevisionController(
    registerInspectionUseCase, 
    getInspectionHistoryUseCase
); 

export const marcaController = new MarcaController(createMarcaUseCase, getAllMarcasUseCase);

export { vehicleRepository }
