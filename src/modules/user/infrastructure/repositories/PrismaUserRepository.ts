
import { IUserRepository } from "../../application/ports/IUserRepository";

import { User } from "../../domain/entitites/User";

import { Email, PasswordHash, PersonName, Phone } from "../../domain/value-objects";

import { UserRole } from "../../domain/enums/UserRole";
import { UserStatus } from "../../domain/enums/UserStatus";
import { prisma } from "@/shared/lib/prisma";
import { PrismaClient, usuario as PrismaUser } from "@prisma/client";

export class PrismaUserRepository implements IUserRepository {

        constructor(
            private readonly prisma: PrismaClient
        ) {}

    async findById(id: number): Promise<User | null> {

        const user = await prisma.usuario.findUnique({
            where: {
                id_usuario: id
            }
        });

        if (!user) {
            return null;
        }

        return this.toDomain(user);
    }

    async findByEmail(email: Email): Promise<User | null> {

        const user = await prisma.usuario.findUnique({
            where: {
                email: email.getValue()
            }
        });

        if (!user) {
            return null;
        }

        return this.toDomain(user);
    }

    async save(user: User): Promise<User> {

        const created = await prisma.usuario.create({

            data: {

                id_rol: user.getRole(),

                nombre: user.getFirstName().getValue(),

                apellido: user.getLastName().getValue(),

                email: user.getEmail().getValue(),

                telefono: user.getPhone().getValue(),

                password_hash: user.getPasswordHash().getValue(),

                estado: user.getStatus(),

                fecha_creacion: user.createdAt
            }

        });

        return this.toDomain(created);
    }


    async update(user: User): Promise<User> {

        const updatedUser = await prisma.usuario.update({

            where: {
                id_usuario: user.getUserId()!
            },

            data: {

                nombre: user.getFirstName().getValue(),

                apellido: user.getLastName().getValue(),

                email: user.getEmail().getValue(),

                telefono: user.getPhone().getValue(),

                password_hash: user.getPasswordHash().getValue(),

                estado: user.getStatus(),

            }

        });

        return this.toDomain(updatedUser);

    }

    private toDomain(user: PrismaUser): User {

        return new User(

            user.id_usuario,

            user.id_rol as UserRole,

            PersonName.create(user.nombre),

            PersonName.create(user.apellido),

            Email.create(user.email),

            Phone.create(user.telefono ?? ""),

            PasswordHash.create(user.password_hash),

            user.estado as UserStatus,

            user.fecha_creacion

        );

    }

}