import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { Dispatch, ReactNode, SetStateAction, useState } from "react";
import Button from "../button";
import { SimpleUser } from "../navdrawer";
import Spinner from "../spinner";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { User } from "@/models/User";
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

type Props = {
  user: User;
  children: ReactNode;
  setUsers: Dispatch<SetStateAction<User[]>>;
};

const formSchema = z.object({
  email: z
    .string({ required_error: "Required" })
    .email({ message: "Not a valid email" }),
  password: z.string().min(1, { message: "Required" }).optional(),
  confirmPassword: z.string().min(1, { message: "Required" }).optional(),
  name: z.string().min(1, { message: "Required" }),
});

function EditUserDialog({ user, children, setUsers }: Props) {
  const { user: currentUser } = useUser();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const updateUser = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    if (data.password !== data.confirmPassword) {
      setIsLoading(false);
      return setError("Passwords do not match");
    }

    try {
      const updateSelf = currentUser?._id === user._id;
      const updateUser = await axios.post("/api/users/updateuser", {
        user,
        email: data.email,
        name: data.name,
        password: updateSelf ? data.password : null,
        updateSelf,
      });

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === updateUser.data.user._id
            ? { ...user, ...updateUser.data.user }
            : user
        )
      );
      setSuccess("Saved");
      setTimeout(() => {
        setSuccess("");
      }, 2000);
      setIsLoading(false);
    } catch (error: any) {
      setError(error.response.data.error);
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Spinner />}
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogPortal>
          <DialogOverlay className="bg-background/40" />
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-lg">Edit User</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col max-h-[30rem]">
              <section className="flex-1 overflow-y-auto flex flex-col">
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
                              autoFocus
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
                              autoFocus
                              type="text"
                              placeholder="Name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {currentUser?._id === user._id && (
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
                                  autoFocus
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
                    )}
                    <section className="flex flex-col gap-2">
                      {success && (
                        <p className="text-sm text-success">{success}</p>
                      )}
                      {error && <p className="text-sm text-error">{error}</p>}
                      <div className="flex gap-2">
                        <Button
                          disabled={isLoading}
                          className="w-20"
                          type="submit">
                          Save
                        </Button>
                      </div>
                    </section>
                  </form>
                </Form>
              </section>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  );
}

export default EditUserDialog;
