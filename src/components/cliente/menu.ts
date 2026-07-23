// src/components/cliente/config/menu.ts

import type { LucideIcon } from "lucide-react";
import {
  Car,
  Wallet,
  History,
  UserRound,
} from "lucide-react";

/**
 * Representa una opción de navegación del panel del cliente.
 */
export interface ClientMenuItem {
  /**
   * Identificador único de la opción.
   */
  id: string;

  /**
   * Texto que se mostrará al usuario.
   */
  label: string;

  /**
   * Ruta de navegación.
   *
   * IMPORTANTE:
   * Las rutas NO incluyen "(cliente)" porque los Route Groups
   * de Next.js no forman parte de la URL.
   */
  href: string;

  /**
   * Icono de Lucide.
   */
  icon: LucideIcon;
}

/**
 * Menú principal del panel del cliente.
 *
 * Este archivo únicamente describe la navegación.
 * No contiene lógica ni componentes de React.
 */
export const CLIENT_MENU: ClientMenuItem[] = [
  {
    id: "trip",
    label: "Solicitar traslado",
    href: "/",
    icon: Car,
  },
  {
    id: "wallet",
    label: "Wallet",
    href: "/cliente/wallet",
    icon: Wallet,
  },
  {
    id: "history",
    label: "Historial",
    href: "/cliente/historial",
    icon: History,
  },
  {
    id: "profile",
    label: "Mi perfil",
    href: "/cliente/perfil",
    icon: UserRound,
  },
];