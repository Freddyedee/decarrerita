// presentation/wallet.modules.ts

import { WalletRepository } from "../infrastructure/prisma/wallet.repository";
import { WalletService } from "../application/services/WalletService";
import { configuracionRepository } from "@/modules/configuracion/presentation/configuracion.modules";

export const walletRepository = new WalletRepository();

export const walletService = new WalletService(walletRepository, configuracionRepository);