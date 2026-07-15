import { IWalletRepository } from "../../domain/ports/IWalletRepository";


export class GetPagadoAChoferUseCase{ 

      constructor(
            private readonly walletRepository: IWalletRepository, 
        ){}

        async execute(choferId: number, desde: Date, hasta: Date): Promise<{ totalPagado: number }> {
            
            const totalPagado = await this.walletRepository.calcularCambioNetoSaldo(choferId, desde, hasta);
        
            return { totalPagado };
        }
    

}