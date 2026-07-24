import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Iniciando la siembra de datos para DeCarrera...");

    // ====================================================================
    // 1. DICCIONARIOS BASE (Roles y Marcas)
    // ====================================================================
    console.log("Creando roles y marcas...");
    const rolCliente = await prisma.rol.upsert({
        where: { nombre: 'CLIENTE' },
        update: {},
        create: { nombre: 'CLIENTE', descripcion: 'Usuario que solicita viajes' }
    });

    const rolChofer = await prisma.rol.upsert({
        where: { nombre: 'CHOFER' },
        update: {},
        create: { nombre: 'CHOFER', descripcion: 'Usuario que conduce' }
    });

    const marcaToyota = await prisma.marca.upsert({
        where: { nombre: 'Toyota' },
        update: {},
        create: { nombre: 'Toyota', descripcion: 'Fabricante Toyota' }
    });

    const marcaChevrolet = await prisma.marca.upsert({
        where: { nombre: 'Chevrolet' },
        update: {},
        create: { nombre: 'Chevrolet', descripcion: 'Fabricante Chevrolet' }
    });

    // ====================================================================
    // 2. TARIFA VIGENTE
    // ====================================================================
    console.log("Creando tarifa vigente...");
    const tarifa = await prisma.tarifa.create({
        data: {
            precio_km: 1.50,
            tarifa_base: 2.00,
            tarifa_cancelacion: 1.00,
            porcentaje_comision: 0.20,
            // fecha_inicio_vigencia toma el now() automático
            // fecha_fin_vigencia se queda nulo para que sea la actual
        }
    });

    // ====================================================================
    // 3. EL CLIENTE JURADO (Con dinero en su wallet)
    // ====================================================================
    console.log("Creando cliente de prueba...");
    const cliente = await prisma.usuario.create({
        data: {
            id_rol: rolCliente.id_rol,
            nombre: "María Raquel",
            apellido: "Jurado",
            email: "jurado@uneg.edu.ve",
            telefono: "04140001122",
            password_hash: "hash_simulado_123",
            estado: "ACTIVO",
            cliente: {
                create: {
                    rating_promedio: 5.00
                }
            },
            wallet: {
                create: {
                    saldo_disponible: 500.00,
                    moneda: "USD"
                }
            }
        }
    });

    // ====================================================================
    // 4. ESCENARIO TRAMPA: Chofer reprobado en psicológica (72 puntos)
    // ====================================================================
    console.log("Creando chofer trampa (Psicológica: 72)...");
    const fechaVencimientoTrampa = new Date();
    fechaVencimientoTrampa.setFullYear(fechaVencimientoTrampa.getFullYear() + 1);

    const choferTrampa = await prisma.usuario.create({
        data: {
            id_rol: rolChofer.id_rol,
            nombre: "Conductor",
            apellido: "Irresponsable",
            email: "trampa@decarrera.com",
            telefono: "04241112233",
            password_hash: "hash_simulado_123",
            estado: "ACTIVO",
            chofer: {
                create: {
                    licencia: "LIC-TRAMPA-001",
                    estado_aprobacion: "APROBADO",
                    disponible: true,
                    puntaje_promedio: 4.5,
                    evaluacion_psicologica: {
                        create: [{ // Es un arreglo por la relación 1 a muchos
                            resultado: "REPROBADO",
                            observaciones: "No cumple con el estándar de empatía",
                            fecha_vencimiento: fechaVencimientoTrampa,
                            calificacion: 72 // ¡TRAMPA! < 73
                        }]
                    },
                    vehiculo: {
                        create: [{
                            id_marca: marcaChevrolet.id_marca,
                            placa: "MAL-000",
                            modelo: "Spark",
                            color: "Negro",
                            annio: 2010,
                            capacidad_pasajeros: 4,
                            estado: "activo",
                            revision_vehicular: {
                                create: [{
                                    resultado: "APROBADO",
                                    observaciones: "Frenos óptimos",
                                    fecha_vencimiento: fechaVencimientoTrampa,
                                    calificacion: 95 // El carro está bien
                                }]
                            }
                        }]
                    }
                }
            }
        }
    });

    // ====================================================================
    // 5. ESCENARIO ÉLITE: Chofer perfecto (Psicológica y Vehículo OK)
    // ====================================================================
    console.log("Creando chofer élite (Psicológica: 85, Vehículo: 80)...");
    const choferElite = await prisma.usuario.create({
        data: {
            id_rol: rolChofer.id_rol,
            nombre: "Conductor",
            apellido: "Estrella",
            email: "elite@decarrera.com",
            telefono: "04149998877",
            password_hash: "hash_simulado_123",
            estado: "ACTIVO",
            chofer: {
                create: {
                    licencia: "LIC-ELITE-999",
                    estado_aprobacion: "APROBADO",
                    disponible: true,
                    puntaje_promedio: 4.9,
                    evaluacion_psicologica: {
                        create: [{
                            resultado: "APROBADO",
                            observaciones: "Perfil psicológico excelente",
                            fecha_vencimiento: fechaVencimientoTrampa,
                            calificacion: 85 // PASA! >= 73
                        }]
                    },
                    vehiculo: {
                        create: [{
                            id_marca: marcaToyota.id_marca,
                            placa: "OPT-123",
                            modelo: "Corolla",
                            color: "Blanco",
                            annio: 2018,
                            capacidad_pasajeros: 4,
                            estado: "activo",
                            revision_vehicular: {
                                create: [{
                                    resultado: "APROBADO",
                                    observaciones: "Sin detalles",
                                    fecha_vencimiento: fechaVencimientoTrampa,
                                    calificacion: 80 // PASA! >= 65
                                }]
                            }
                        }]
                    }
                }
            }
        }
    });

    console.log("=============================================");
    console.log("¡SEMILLA PLANTADA CON ÉXITO!");
    console.log(`- ID Tarifa generada: ${tarifa.id_tarifa}`);
    console.log(`- ID Cliente (Jurado): ${cliente.id_usuario}`);
    console.log(`- ID Chofer TRAMPA (No debe salir en la app): ${choferTrampa.id_usuario}`);
    console.log(`- ID Chofer ÉLITE (El que recibirá el viaje): ${choferElite.id_usuario}`);
    console.log("=============================================");
}

main()
    .catch((e) => {
        console.error("Error sembrando datos:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });