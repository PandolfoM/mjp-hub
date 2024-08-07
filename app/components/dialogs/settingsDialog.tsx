import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { Dispatch, ReactNode, SetStateAction, useState } from "react";
import Button from "../button";
import { Input } from "@/components/ui/input";
import axios from "axios";
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
import { useUser } from "@/app/context/UserContext";
import { useSite } from "@/app/context/SiteContext";
import { Permissions } from "@/utils/permissions";

type Props = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

const formSchema = z.object({
  email: z
    .string({ required_error: "Required" })
    .email({ message: "Not a valid email" }),
  password: z.string().min(1, { message: "Required" }).optional(),
  confirmPassword: z.string().min(1, { message: "Required" }).optional(),
  name: z.string().min(1, { message: "Required" }),
  githubUsername: z.string().optional(),
});

function SettingsDialog({ isOpen, setIsOpen }: Props) {
  const { user, setUser, hasPermission } = useUser();
  const { setLoading, loading } = useSite();
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const updateUser = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    console.log(data.githubUsername);

    if (data.password !== data.confirmPassword) {
      setLoading(false);
      return setError("Passwords do not match");
    }

    try {
      const newUser = await axios.post("/api/users/updateuser", {
        user,
        email: data.email,
        name: data.name,
        githubUsername: data.githubUsername,
        password: data.password,
        updateSelf: true,
      });

      setUser(newUser.data.user);
      setError("");
      setSuccess("Saved");
      setTimeout(() => {
        setSuccess("");
      }, 2000);
      setLoading(false);
    } catch (error: any) {
      setError(error.response.data.error);
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogPortal>
          <DialogOverlay className="bg-background/40" />
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-lg">Settings</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col max-h-[30rem]">
              <section className="flex-1 overflow-y-auto flex flex-col">
                {user && (
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(updateUser)}
                      className="flex flex-col gap-2">
                      <FormField
                        control={form.control}
                        name="email"
                        defaultValue={user.email}
                        render={({ field }) => (
                          <FormItem className="sm:w-full space-y-0">
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="Email"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="name"
                        defaultValue={user.name}
                        render={({ field }) => (
                          <FormItem className="sm:w-full space-y-0">
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="Name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {(hasPermission(Permissions.Developer) ||
                        hasPermission(Permissions.Admin)) && (
                        <FormField
                          control={form.control}
                          name="githubUsername"
                          defaultValue={user.githubUsername}
                          render={({ field }) => (
                            <FormItem className="sm:w-full space-y-0">
                              <FormControl>
                                <Input
                                  type="text"
                                  placeholder="Github Username"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      <>
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem className="sm:w-full space-y-0">
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
                        <FormField
                          control={form.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem className="sm:w-full space-y-0">
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
                      </>
                      <section className="flex flex-col gap-2">
                        {success && (
                          <p className="text-sm text-success">{success}</p>
                        )}
                        {error && <p className="text-sm text-error">{error}</p>}
                        <div className="flex justify-between gap-2">
                          <Button
                            disabled={loading}
                            className="w-20"
                            type="submit">
                            Save
                          </Button>
                          <DialogClose asChild>
                            <Button
                              variant="outline"
                              disabled={loading}
                              className="w-20 border-white/50">
                              Close
                            </Button>
                          </DialogClose>
                        </div>
                      </section>
                    </form>
                  </Form>
                )}
              </section>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  );
}

export default SettingsDialog;
