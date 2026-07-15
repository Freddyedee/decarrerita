import { IConfiguracionRepository } from "@/modules/configuracion/domain/repositories/IConfiguracionRepository";
import { IWalletRepository } from "../../domain/ports/IWalletRepository";

export class GetGananciasEmpresaUseCase{

    constructor(
        private readonly walletRepository: IWalletRepository, 
        private readonly configRepository: IConfiguracionRepository
    ){}

    async execute(from : Date, until: Date): Promise<{ ganancias: number}>{ 
        
        const valor = await this.configRepository.findByNombre ("id_usuario_empresa");
        if(!valor){ 
            throw new Error("id_usuario_empresa not configured"); 
        }

        const empresaId = Number(valor); 

         // La empresa recibe el pago completo del cliente (PAGO_TRASLADO
        // como cobro) y luego paga al chofer (PAGO_TRASLADO como salida).
        // La diferencia entre lo que recibió y lo que entregó ES la ganancia real.

        const ganancias = await this.walletRepository.calcularCambioNetoSaldo(empresaId, from, until);


        return {ganancias}; 
    }
}