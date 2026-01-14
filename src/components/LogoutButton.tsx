"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";

export default function LogoutButton() {
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <Button onClick={handleLogout} className="w-full bg-red-600 hover:bg-red-700 text-white">
      Cerrar Sesión
    </Button>
  );
}
