import { PrismaClient, contacto_emergencia } from "@prisma/client";

import { EmergencyContact } from "../../domain/entitites/EmergencyContact";
import { PersonName } from "../../domain/value-objects/PersonName";
import { Phone } from "../../domain/value-objects/Phone";

import { IEmergencyContactRepository } from "../../application/ports/IEmergencyContactRepository";

export class PrismaEmergencyContactRepository implements IEmergencyContactRepository {

    constructor(
        private readonly prisma: PrismaClient
    ) {}

    async create(contact: EmergencyContact): Promise<EmergencyContact> {

        const created = await this.prisma.contacto_emergencia.create({

            data: {

                id_chofer: contact.driverUserId,

                nombre_contacto: contact.getContactName().getValue(),

                parentesco: contact.getRelationship(),

                telefono_contacto: contact.getPhone().getValue(),

                activo: contact.estaActivo()

            }

        });

        return this.toDomain(created);

    }

    async findByDriverUserId(driverUserId: number): Promise<EmergencyContact[]> {

        const contacts = await this.prisma.contacto_emergencia.findMany({

            where: {
                id_chofer: driverUserId
            },

            orderBy: {
                id_contacto: "asc"
            }

        });

        return contacts.map(contact => this.toDomain(contact));

    }

    /**
     * RN-028: cuenta directo en la base de datos (en vez de traer
     * la lista completa y hacer `.filter().length` en memoria)
     * porque este método se llama en el "camino caliente" de
     * UpdateDriverStatusUseCase cada vez que se intenta aprobar
     * un chofer.
     */
    async countActiveByDriverUserId(driverUserId: number): Promise<number> {

        return this.prisma.contacto_emergencia.count({

            where: {
                id_chofer: driverUserId,
                activo: true
            }

        });

    }

    private toDomain(contact: contacto_emergencia): EmergencyContact {

        return new EmergencyContact(

            contact.id_contacto,

            contact.id_chofer,

            PersonName.create(contact.nombre_contacto),

            contact.parentesco,

            Phone.create(contact.telefono_contacto),

            contact.activo

        );

    }

}