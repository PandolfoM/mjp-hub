"use client";

import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import Button from "../components/button";
import axios from "axios";
import { useRouter } from "next/navigation";

function Verify() {
  const router = useRouter();
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (password !== confirmPassword) return setError("Passwords do not match");
    if (password === "") return setError("Password missing");

    try {
      await axios.post("/api/users/createpassword", { password });
      router.push("/");
    } catch (error: any) {
      setError(error.response.data.error);
    }
  };
  return (
    <div className="flex w-full h-full flex-col justify-center">
      <div className="bg-gradient-radial to-80% from-card/20 to-card/5 rounded-sm p-2 h-72 flex flex-col gap-5">
        <h3 className="text-center text-lg">Create Password</h3>
        <form className="h-full flex flex-col" onSubmit={handleSubmit}>
          <div className="flex flex-col h-full gap-2">
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input
              placeholder="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-error pb-2">{error}</p>}
          <Button type="submit">Submit</Button>
        </form>
      </div>
    </div>
  );
}

export default Verify;
