import { Router } from "express";
import { VehicleController } from "./vehicle.controller";
import { CreateVehicleUseCase } from "../application/create-vehicle";
import { VehicleRepository } from "../infrastructure/prisma/vehicle.repository";


const vehicleRepository = new VehicleRepository();
const createVehicleUseCase = new CreateVehicleUseCase(vehicleRepository);
const vehicleController = new VehicleController(createVehicleUseCase);


const router = Router();


router.post("/vehicle", (req, res) =>
  vehicleController.create(req, res)
);

export default router;

