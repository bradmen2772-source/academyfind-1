"use client";

import { LogOut } from "lucide-react";
import { authClient } from "@/lib/auth/auth-client"; // Apne auth-client ka path
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleLogout}
      className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 cursor-pointer"
    >
      <LogOut className="h-4 w-4" />
      Logout
    </Button>
  );
}