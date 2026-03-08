"use client";
import Link from "next/link";
import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { useAuth } from "@/context/AuthContext";
import { Role } from "@/types/User";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import LoginForm from "./LoginForm";

export default function NavMenu() {
  const { user, logout } = useAuth();

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/">Home</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          {user && (
            <NavigationMenuLink asChild>
              <Link href="/questionnaire">Questionnaire</Link>
            </NavigationMenuLink>
          )}
        </NavigationMenuItem>
        {user?.role === Role.ADMIN && (
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/admin-panel">Admin Panel</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        )}
        {!user ? (
          <NavigationMenuItem>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary" className="px-4 py-2 text-sm">
                  Login
                </Button>
              </DialogTrigger>
              <DialogContent>
                <div className="flex flex-col space-y-2">
                  <LoginForm />
                </div>
              </DialogContent>
            </Dialog>
          </NavigationMenuItem>
        ) : (
          <NavigationMenuItem>
            <Button
              variant="secondary"
              className="px-4 py-2 text-sm"
              onClick={logout}
            >
              Logout
            </Button>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
