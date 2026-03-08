"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { useAuth } from "@/context/AuthContext";
import { Role } from "@/types/User";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export default function NavMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const logoutRedirect = () => {
    logout();
    router.push("/");
  };

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/">Home</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {user && (
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/questionnaire">Questionnaire</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        )}

        {user?.role === Role.ADMIN && (
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/admin-panel">Admin Panel</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        )}

        {!user ? (
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/login">Login</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ) : (
          <NavigationMenuItem>
            <Button variant="secondary" onClick={logoutRedirect}>
              Logout
            </Button>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
