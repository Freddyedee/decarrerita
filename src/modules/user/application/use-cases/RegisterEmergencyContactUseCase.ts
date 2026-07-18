import { RegisterEmergencyContactRequest } from "../dto/RegisterEmergencyContactRequest";
import { EmergencyContactResponse } from "../dto/EmergencyContactResponse";

import { EmergencyContact } from "../../domain/entitites/EmergencyContact";
import { PersonName } from "../../domain/value-objects/PersonName";
import { Phone } from "../../domain/value-objects/Phone";

import { IEmergencyContactRepository } from "../ports/IEmergencyContactRepository";
import { IDriverRepository } from "../ports/IDriverRepository";

/**
 * ============================================================
 * RegisterEmergencyContactUseCase
 * ============================================================
 *
 * Agrega un contacto de emergencia a un chofer YA existente.
 * No hay límite máximo de contactos (el enunciado solo exige un
 * mínimo de 2, ver RN-028) — un chofer puede registrar todos
 * los que quiera; el mínimo se hace cumplir en el otro extremo
 * del flujo, cuando se intenta APROBAR al chofer (ver
 * UpdateDriverStatusUseCase), no acá.
 *
 * ============================================================
 */
export class RegisterEmergencyContactUseCase {

    constructor(
        private readonly emergencyContactRepository: IEmergencyContactRepository,
        private readonly driverRepository: IDriverRepository
    ) {}

    async execute(
        request: RegisterEmergencyContactRequest
    ): Promise<EmergencyContactResponse> {

        // 1. El contacto debe pertenecer a un chofer real — esto
        //    también evita que se registren contactos "huérfanos"
        //    para un id_usuario que ni siquiera es chofer.
        const driver = await this.driverRepository.findByUserId(
            request.driverUserId
        );

        if (!driver) {
            throw new Error("Driver not found.");
        }

        const contact = new EmergencyContact(
            null,
            request.driverUserId,
            PersonName.create(request.contactName),
            request.relationship,
            Phone.create(request.phone),
            true // todo contacto nuevo nace activo
        );

        const saved = await this.emergencyContactRepository.create(contact);

        return {

            id: saved.id!,

            driverUserId: saved.driverUserId,

            contactName: saved.getContactName().getValue(),

            relationship: saved.getRelationship(),

            phone: saved.getPhone().getValue(),

            active: saved.estaActivo()

        };

    }

}