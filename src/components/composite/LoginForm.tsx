"use client";

import { useState, type SubmitEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";

const ADMIN_USERNAME = process.env.NEXT_PUBLIC_ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
const USER_USERNAME = process.env.NEXT_PUBLIC_USER_USERNAME;
const USER_PASSWORD = process.env.NEXT_PUBLIC_USER_PASSWORD;

export default function LoginForm() {
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: SubmitEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    await new Promise((resolve) => setTimeout(resolve, 500));

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      login({
        username,
        role: "ADMIN",
      });

      setUsername("");
      setPassword("");
      setLoading(false);
      return;
    } else if (username === USER_USERNAME && password === USER_PASSWORD) {
      login({
        username,
        role: "USER",
      });

      setUsername("");
      setPassword("");
      setLoading(false);
      return;
    }

    setLoading(false);
    setErrorMessage("Invalid credentials");
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <DialogHeader>
        <DialogTitle>Login</DialogTitle>
        <DialogDescription>
          Enter your username and password to sign in.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-medium">
          Username
        </label>
        <Input
          id="username"
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {errorMessage ? (
        <p className="text-sm text-red-500">{errorMessage}</p>
      ) : null}

      <DialogFooter>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Logging in..." : "Login"}
        </Button>
      </DialogFooter>
    </form>
  );
}
