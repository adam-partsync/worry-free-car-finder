"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestAuthPage() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("Password123");
  const [result, setResult] = useState<any>(null);

  const handleCredentialsSignIn = async () => {
    console.log("Attempting sign in with:", { email, password });
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    console.log("Sign in result:", result);
    setResult(result);
  };

  return (
    <div className="container mx-auto p-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Authentication Test Page</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <strong>Session Status:</strong> {status}
          </div>
          <div>
            <strong>Session Data:</strong> 
            <pre className="bg-gray-100 p-2 rounded mt-2 text-sm">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test Credentials Sign In</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>Email:</label>
              <Input 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                type="email"
              />
            </div>
            <div>
              <label>Password:</label>
              <Input 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                type="password"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleCredentialsSignIn}>
              Sign In with Test User
            </Button>
            {session && (
              <Button onClick={() => signOut()} variant="destructive">
                Sign Out
              </Button>
            )}
          </div>
          {result && (
            <div>
              <strong>Last Sign In Result:</strong>
              <pre className="bg-gray-100 p-2 rounded mt-2 text-sm">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}