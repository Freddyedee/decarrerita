// presentation/wallet.modules.ts

import { WalletRepository } from "../infrastructure/prisma/wallet.repository";
import { WalletService } from "../application/services/WalletService";
import { configuracionRepository } from "@/modules/configuracion/presentation/configuracion.modules";
import { GetGananciasEmpresaUseCase } from "../application/use-cases/GetGananciasEmpresaUseCase";
import { ReportesController } from "./reportes.controller";
import { GetPagadoAChoferUseCase } from "../application/use-cases/GetPagadoAChoferUseCase";

export const walletRepository = new WalletRepository();

export const walletService = new WalletService(walletRepository, configuracionRepository);

 const getGananciasEmpresaUseCase = new GetGananciasEmpresaUseCase(walletRepository, configuracionRepository);

 const getPagadoAChoferUseCase = new GetPagadoAChoferUseCase(walletRepository); 

export const reportesController = new ReportesController(getGananciasEmpresaUseCase, getPagadoAChoferUseCase );