"use client";

import {

    Car,

    FileWarning,

    Wallet,

    BadgeAlert

} from "lucide-react";

import { AlertCard } from "./AlertCard";

export function AlertsPanel() {

    /**
     * Datos simulados.
     *
     * Más adelante serán obtenidos desde
     * DashboardUseCase.
     */

    const alerts = [

        {

            title: "Vehículos pendientes",

            description: "Esperando aprobación administrativa.",

            quantity: 4,

            href: "/vehiculos?status=pending",

            icon: Car

        },

        {

            title: "Revisiones próximas",

            description: "Vehículos próximos a vencer.",

            quantity: 2,

            href: "/revisiones",

            icon: FileWarning

        },

        {

            title: "Solicitudes de retiro",

            description: "Pendientes de aprobación.",

            quantity: 3,

            href: "/wallet/retiros",

            icon: Wallet

        },

        {

            title: "Tarifas próximas a vencer",

            description: "Configuraciones que requieren revisión.",

            quantity: 1,

            href: "/tarifas",

            icon: BadgeAlert

        }

    ];

    return (

        <section className="space-y-4">

            <div>

                <h2 className="text-xl font-semibold">

                    Centro de alertas

                </h2>

                <p className="text-sm text-muted-foreground">

                    Elementos que requieren atención inmediata.

                </p>

            </div>

            <div className="grid gap-4 lg:grid-cols-2">

                {alerts.map(alert => (

                    <AlertCard

                        key={alert.title}

                        {...alert}

                    />

                ))}

            </div>

        </section>

    );

}