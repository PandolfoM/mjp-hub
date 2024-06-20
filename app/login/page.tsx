"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import axios from "axios";
import Button from "../components/button";
import Spinner from "../components/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  email: z
    .string({ required_error: "Required" })
    .email({ message: "Not a valid email" }),
  password: z.string().min(1, { message: "Required" }),
});

function Login() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const login = await axios.post("/api/users/login", data);

      if (login.data.user.tempPassword) {
        router.push("/verify");
      } else {
        router.push("/");
      }
    } catch (error: any) {
      console.log(error);

      setError(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {loading && <Spinner />}
      <div className="flex flex-col gap-3 items-center justify-center h-full w-full text-center">
        <div className="flex flex-col w-[90%]">
          <h1 className="font-bold text-md mb-[20px]">MJP Hub</h1>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-[5px] text-left">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="email" placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && <p className="text-sm text-error">{error}</p>}
              <Button type="submit" disabled={loading} className="mt-[20px]">
                Login
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}

export default Login;
