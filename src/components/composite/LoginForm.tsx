"use client";

import { use, useState, type SubmitEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Role } from "@/types/User";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const userList = [
  { username: "admin", password: "admin123", role: Role.ADMIN },
  { username: "user", password: "user123", role: Role.USER },
  { username: "testuser", password: "testpassword", role: Role.USER },
];

export default function LoginForm() {
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e: SubmitEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      setLoading(false);
      setErrorMessage("Username and password are required");
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    const matchedUser = userList.find(
      (u) => u.username === trimmedUsername && u.password === trimmedPassword,
    );

    if (!matchedUser) {
      setLoading(false);
      setErrorMessage("Invalid credentials");
      return;
    }

    login({
      username: matchedUser.username,
      role: matchedUser.role,
    });

    setUsername("");
    setPassword("");
    setLoading(false);

    if (matchedUser.role === Role.ADMIN) {
      router.push("/admin-panel");
    }

    router.push("/questionnaire");
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <h2 className="text-lg font-semibold">Login</h2>
      <p className="text-sm text-muted-foreground">
        Enter your username and password to sign in.
      </p>

      <div className="flex flex-col space-y-2">
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

      <div className="flex flex-col space-y-2">
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

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
}
