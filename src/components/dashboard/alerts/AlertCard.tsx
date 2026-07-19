"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface AlertCardProps {

    title: string;

    description: string;

    quantity: number;

    href: string;

    icon: LucideIcon;

}

export function AlertCard({

    title,

    description,

    quantity,

    href,

    icon: Icon

}: AlertCardProps) {

    return (

        <Link href={href}>

            <Card className="transition-all hover:shadow-md hover:border-primary cursor-pointer">

                <CardContent className="p-5">

                    <div className="flex justify-between">

                        <div className="space-y-2">

                            <div className="flex items-center gap-2">

                                <Icon className="h-5 w-5 text-primary"/>

                                <h3 className="font-semibold">

                                    {title}

                                </h3>

                            </div>

                            <p className="text-sm text-muted-foreground">

                                {description}

                            </p>

                        </div>

                        <Badge>

                            {quantity}

                        </Badge>

                    </div>

                </CardContent>

            </Card>

        </Link>

    );

}