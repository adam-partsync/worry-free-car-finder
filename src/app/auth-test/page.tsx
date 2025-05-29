"use client";

import { useSession, signIn } from "next-auth/react";
import { useState } from "react";

export default function AuthTest() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("success@example.com");
  const [password, setPassword] = useState("TestPassword123");

  const handleLogin = async () => {
    console.log("Attempting login...");
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    console.log("Login result:", result);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Auth Test Page</h1>

      <div className="mb-4">
        <p><strong>Status:</strong> {status}</p>
        <p><strong>Session:</strong> {session ? JSON.stringify(session, null, 2) : "null"}</p>
      </div>

      <div className="mb-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="border p-2 mr-2"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="border p-2 mr-2"
        />
        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Test Login
        </button>
      </div>
    </div>
  );
}
