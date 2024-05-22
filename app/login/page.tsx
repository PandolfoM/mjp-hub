"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Input from "../components/input";
import axios from "axios";
import Button from "../components/button";
import Spinner from "../components/spinner";

function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/login", user);

      router.push("/");
    } catch (error: any) {
      console.log("Login failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Spinner />}
      <div className="flex flex-col gap-3 items-center justify-center h-full w-full text-center">
        <div className="flex flex-col gap-3 w-[90%]">
          <h1 className="font-bold text-md">MJP Hub</h1>
          <span className="flex flex-col gap-1">
            <Input
              type="email"
              placeholder="Email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
            <Input
              type="password"
              placeholder="Password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
          </span>
          <Button onClick={handleLogin} disabled={loading}>
            Login
          </Button>
        </div>
      </div>
    </>
  );
}

export default Login;
