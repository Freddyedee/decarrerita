"use client";

import { Car, Users, Route, Wallet } from "lucide-react";

import { StatCard } from "./StatCart";

export function DashboardStats() {

    /**
     * Actualmente usamos datos simulados.
     *
     * Posteriormente este componente recibirá
     * esta información desde el DashboardUseCase.
     */

    const stats = [

        {
            title: "Vehículos",
            value: 248,
            description: "Vehículos registrados",
            icon: Car,
            trend: 8,
            trendLabel: "este mes"
        },

        {
            title: "Usuarios",
            value: 1542,
            description: "Usuarios activos",
            icon: Users,
            trend: 15,
            trendLabel: "este mes"
        },

        {
            title: "Traslados",
            value: 4821,
            description: "Traslados completados",
            icon: Route,
            trend: 12,
            trendLabel: "últimos 30 días"
        },

        {
            title: "Ingresos",
            value: "$12,450",
            description: "Ganancias de la empresa",
            icon: Wallet,
            trend: 18,
            trendLabel: "este mes"
        }

    ];

    return (

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

            {stats.map((stat) => (

                <StatCard

                    key={stat.title}

                    title={stat.title}

                    value={stat.value}

                    description={stat.description}

                    icon={stat.icon}

                    trend={stat.trend}

                    trendLabel={stat.trendLabel}

                />

            ))}

        </section>

    );

}