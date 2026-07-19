"use client";

import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {

    title: string;

    value: string | number;

    description: string;

    icon: LucideIcon;

    trend?: number;

    trendLabel?: string;

}

export function StatCard({

    title,

    value,

    description,

    icon: Icon,

    trend,

    trendLabel

}: StatCardProps) {

    return (

        <Card className="transition-all hover:shadow-md">

            <CardContent className="p-6">

                <div className="flex justify-between items-start">

                    <div className="space-y-2">

                        <p className="text-sm text-muted-foreground">

                            {title}

                        </p>

                        <h2 className="text-3xl font-bold">

                            {value}

                        </h2>

                    </div>

                    <div className="rounded-xl bg-primary/10 p-3">

                        <Icon className="h-6 w-6 text-primary"/>

                    </div>

                </div>

                <div className="mt-6 space-y-1">

                    <p className="text-sm text-muted-foreground">

                        {description}

                    </p>

                    {trend !== undefined && (

                        <p
                            className={`text-sm font-medium ${
                                trend >= 0
                                    ? "text-green-600"
                                    : "text-red-600"
                            }`}
                        >

                            {trend >= 0 ? "+" : ""}

                            {trend}%

                            {trendLabel && ` · ${trendLabel}`}

                        </p>

                    )}

                </div>

            </CardContent>

        </Card>

    );

}