// src/shared/container/WalletContainer.ts

// 1. Repositorios reales de tu carpeta infrastructure/prisma/
import { WalletRepository } from "@/modules/wallet/infrastructure/prisma/wallet.repository";
import { RecargaRepository } from "@/modules/wallet/infrastructure/prisma/recarga.repository";
import { BancoRepository } from "@/modules/wallet/infrastructure/prisma/banco.repository";

// 2. Casos de Uso
import { GetWalletBalanceUseCase } from "@/modules/wallet/application/use-cases/GetWalletBalanceUseCase";
import { GetBancosActivosUseCase } from "@/modules/wallet/application/use-cases/GetBancosActivosUseCase";
import { SolicitarRecargaUseCase } from "@/modules/wallet/application/use-cases/SolicitarRecargaUseCase";
import { GetHistorialRecargasUseCase } from "@/modules/wallet/application/use-cases/GetHistorialRecargasUseCase";
import { AprobarRecargaUseCase } from "@/modules/wallet/application/use-cases/AprobarRecargaUseCase";
import { RechazarRecargaUseCase } from "@/modules/wallet/application/use-cases/RechazarRecargaUseCase";

export class WalletContainer {
    // Repositorios de infraestructura
    private static readonly walletRepository = new WalletRepository();
    private static readonly recargaRepository = new RecargaRepository();
    private static readonly bancoRepository = new BancoRepository();

    // Casos de Uso PÚBLICOS
    public static readonly getWalletBalanceUseCase = new GetWalletBalanceUseCase(
        this.walletRepository
    );

    public static readonly getBancosActivosUseCase = new GetBancosActivosUseCase(
        this.bancoRepository
    );

    public static readonly solicitarRecargaUseCase = new SolicitarRecargaUseCase(
        this.walletRepository,
        this.recargaRepository,
        this.bancoRepository
    );

    public static readonly getHistorialRecargasUseCase = new GetHistorialRecargasUseCase(
        this.walletRepository,
        this.recargaRepository
    );

    public static readonly aprobarRecargaUseCase = new AprobarRecargaUseCase(
        this.walletRepository,
        this.recargaRepository
    );

    public static readonly rechazarRecargaUseCase = new RechazarRecargaUseCase(
        this.recargaRepository
    );
}