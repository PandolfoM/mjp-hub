"use client";

import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import Button from "@/app/components/button";

const formSchema = z.object({
  password: z.string().min(1, { message: "Required" }),
  confirmPassword: z.string().min(1, { message: "Required" }),
});

function Verify() {
  const router = useRouter();
  const [error, setError] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    if (data.password !== data.confirmPassword)
      return setError("Passwords do not match");
    if (data.password === "") return setError("Password missing");

    try {
      await axios.post("/api/users/createpassword", {
        password: data.password,
      });
      router.push("/");
    } catch (error: any) {
      setError(error.response.data.error);
    }
  };
  return (
    <div className="flex flex-col gap-3 items-center justify-center h-full w-full text-center">
      <div className="flex flex-col w-[90%] sm:w-1/4">
        <h1 className="font-bold text-md mb-[20px]">Create Password</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-[5px] text-left">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <p className="text-sm text-error pb-2">{error}</p>}
            <Button type="submit" className="mt-[20px]">
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default Verify;
