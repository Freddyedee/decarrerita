import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ClientMenuItem } from "./menu";

interface NavItemProps {
  item: ClientMenuItem;
  isActive: boolean;
}

export default function NavItem({
  item,
  isActive,
}: NavItemProps) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />

      <span>{item.label}</span>
    </Link>
  );
}