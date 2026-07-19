import { EmergencyContactResponse } from "../dto/EmergencyContactResponse";
import { IEmergencyContactRepository } from "../ports/IEmergencyContactRepository";

export class GetEmergencyContactsUseCase {

    constructor(
        private readonly emergencyContactRepository: IEmergencyContactRepository
    ) {}

    async execute(driverUserId: number): Promise<EmergencyContactResponse[]> {

        const contacts =
            await this.emergencyContactRepository.findByDriverUserId(driverUserId);

        return contacts.map(contact => ({

            id: contact.id!,

            driverUserId: contact.driverUserId,

            contactName: contact.getContactName().getValue(),

            relationship: contact.getRelationship(),

            phone: contact.getPhone().getValue(),

            active: contact.estaActivo()

        }));

    }

}