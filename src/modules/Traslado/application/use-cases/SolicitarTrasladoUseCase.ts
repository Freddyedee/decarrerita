import { SolicitarTrasladoDTO } from "../dto/SolicitarTrasladoDTO";
import { Traslado } from "../../domain/entities/Traslado";
import { EstadoTraslado } from "../../domain/Enum/EstadoTraslado";
import { AsignacionChofer } from "../../domain/entities/AsignacionChofer";
import { EstadoRespuesta } from "../../domain/Enum/EstadoRespuesta";

import { ITrasladoRepository } from "../../domain/repositories/ITrasladoRepository";
import { IAsignacionRepository } from "../../domain/repositories/IAsignacionRepository";
import { IHistorialTrasladoRepository } from "../../domain/repositories/IHistorialTrasladoRepository";

//Puertos o repositorios de otros modulos, solo se utilizan las interfaces, la implementacion no debe de utilizarse.

import { IVehicleRepository } from "@/modules/vehicles/domain/repositories/IVehicleRepository";
import { ITarifaRepository } from "@/modules/Tarifa/domain/repositories/ITarifaRepository";
import { IClientRepository } from "@/modules/user/application/ports/IClientRepository";
import { IDriverRepository } from "@/modules/user/application/ports/IDriverRepository";
import { IWalletService } from "@/modules/wallet/domain/ports/IWalletServices";


export class SolicitarTrasladoUseCase{ 


    constructor(

        private readonly trasladoRepository: ITrasladoRepository,
        private readonly asignacionRepository: IAsignacionRepository, 
        private readonly historialRepository: IHistorialTrasladoRepository,
        private readonly vehicleRepository: IVehicleRepository,
        private readonly tarifaRepository: ITarifaRepository,
        private readonly clientRepository: IClientRepository,
        private readonly driverRepository: IDriverRepository, 
        private readonly walletServices: IWalletService
    ){}


    async execute (input: SolicitarTrasladoDTO): Promise<{traslado: Traslado; ofertas: AsignacionChofer[]}>{

        //1. Validacion: El cliente debe existir realmente, esto incluye rol correcto no cualquier tipo de usuario. 

        const cliente = await this.clientRepository.findByUserId(input.clienteId); 

        if(!cliente){
            throw  new Error(`Client with id ${input.clienteId} not found`); 
        }
        
        //1.5 RN-025: un cliente con saldo negativo (deuda por penalizacion pendiente) no puede solicitar nuevos viajes hasta regularizar. 

        const canOperateClient = await this.walletServices.puedeOperar(input.clienteId); 

        if(!canOperateClient) { 
            throw new Error("Client has a negative balance and cannot request new trips until it is regularized")
        }

        //2. Validacion: debe existir una tarifa previa en el sistema, lo cual significa que debe estar vigente para calcular el costo. 

        const tarifa = await this.tarifaRepository.findVigente(); 

        if(!tarifa){
            throw  new Error('No active tarifa found'); 
        }

        const costoEstimado = tarifa.calcularCosto(input.distanciaEstimadaKm); 


        // 3. CANDIDATOS: todos los vehículos actualmente ACTIVE
        //    (chofer con vehículo seleccionado y apto para circular).

        const vehiculosActivos = await this.vehicleRepository.findAllActive();

        if(vehiculosActivos.length == 0){ 
            throw new Error('No available drivers at this moment');
        }

        // 4. PRIORIDAD: se ordenan los candidatos por el puntaje , promedio de cada chofer (mayor puntaje, mayor prioridad).
        //    Un chofer con mejor historial recibe la oferta primero.

        const candidatoConPuntaje = await Promise.all(
            vehiculosActivos.map(async (vehiculo) => {
                const puntaje = await this.driverRepository.findPuntajeByChoferId(vehiculo.driverId); 
                return { choferId: vehiculo.driverId, vehiculoId: vehiculo.id, puntaje: puntaje ?? 0}; 
            })
        )

        candidatoConPuntaje.sort((a,b) => Number(b.puntaje) - Number(a.puntaje)); //verificar

        // 5. CREACIÓN DEL TRASLADO en estado SOLICITADO.
        //    Aún no se cobra a nadie — eso ocurre recién
        //    cuando un chofer acepta (ver IniciarTrasladoUseCase).
        //    Se usa el vehículo y chofer de mayor prioridad como
        //    referencia inicial; la cola de ofertas define quién
        //    realmente termina asignado.

        const primero = candidatoConPuntaje[0]; 

        const traslado = new Traslado(

            0,
            input.clienteId, 
            primero.choferId, 
            primero.vehiculoId, 
            tarifa.id, 
            input.origenlat, 
            input.origenlng,
            input.destinolat, 
            input.destinolng,
            input.distanciaEstimadaKm,
            costoEstimado, 
            EstadoTraslado.SOLICITADO, 
            new Date() 

        ); 

        traslado.buscarChofer();

        const savedTraslado = await this.trasladoRepository.create(traslado); 

        await this.historialRepository.registrarCambio(
            savedTraslado.id, 
            "NINGUNO", 
            EstadoTraslado.SOLICITADO, 
            "Traslado solicitado, generando cola de ofertas"
        ); 


        // 6. COLA DE OFERTAS: se crea una AsignacionChofer por
        //    cada candidato, en el orden de prioridad calculado.
        //    Todas comienzan PENDIENTE — el primero en aceptar
        //    se queda con el viaje (ver ResponderAsignacionUseCase).

        const ofertasPendientes = candidatoConPuntaje.map((candidato, index) => 
        new AsignacionChofer(
            0, 
            savedTraslado.id, 
            candidato.choferId,
            index + 1, // prioridad; 1 = primero en la cola.
            EstadoRespuesta.PENDIENTE
        )
    ); 

    const ofertas = await this.asignacionRepository.createBatch(ofertasPendientes); 

    return { traslado: savedTraslado, ofertas}; 

    }

}