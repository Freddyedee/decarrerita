"use client";

// Importamos Avatar como un objeto contenedor y Separator
import { Avatar, Separator } from "@base-ui/react";
import { Badge } from "@/components/ui/badge";

interface DashboardHeaderProps {
  title: string;
  description: string;
  userName: string;
  role: string;
}

export function DashboardHeader({
  title,
  description,
  userName,
  role,
}: DashboardHeaderProps) {
  const today = new Intl.DateTimeFormat("es-VE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <header className="flex items-center justify-between mb-8">

      {/* Información principal */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {title}
        </h1>

        <p className="text-muted-foreground">
          {description}
        </p>

        <Separator className="my-2" />

        <p className="text-sm text-muted-foreground capitalize">
          {today}
        </p>
      </div>

      {/* Usuario autenticado */}
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-semibold">
            {userName}
          </p>
          <Badge variant="secondary">
            {role}
          </Badge>
        </div>

        {/* 1. Usamos Avatar.Root en lugar de Avatar */}
        <Avatar.Root className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
          
          {/* 2. Usamos Avatar.Fallback en lugar de AvatarFallback */}
          <Avatar.Fallback>
            {userName
              .split(" ")
              .map((word) => word[0])
              .join("")
              .substring(0, 2)
              .toUpperCase()}
          </Avatar.Fallback>

        </Avatar.Root>
      </div>

    </header>
  );
}