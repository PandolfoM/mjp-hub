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
import { useSite } from "@/app/context/SiteContext";
import MultipleSelector from "@/components/ui/multipleselctor";

type Props = {
  user: User;
  children: ReactNode;
  setUsers: Dispatch<SetStateAction<User[]>>;
};

const permissionsSchema = z.object({
  label: z.string(),
  value: z.string(),
  disable: z.boolean().optional(),
});

const formSchema = z.object({
  email: z
    .string({ required_error: "Required" })
    .email({ message: "Not a valid email" }),
  name: z.string().min(1, { message: "Required" }),
  permissions: z.array(permissionsSchema).optional(),
});

const Permissions = [
  { label: "Admin", value: "admin" },
  { label: "Developer", value: "dev" },
  { label: "Users", value: "users" },
];

function EditUserDialog({ user, children, setUsers }: Props) {
  const { user: currentUser, setUser } = useUser();
  const { loading, setLoading } = useSite();
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const updateUser = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);

    try {
      const updateSelf = currentUser?._id === user._id;
      const updateUser = await axios.post("/api/users/updateuser", {
        user,
        email: data.email,
        name: data.name,
        permissions: data.permissions,
        updateSelf,
      });

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === updateUser.data.user._id
            ? { ...user, ...updateUser.data.user }
            : user
        )
      );

      if (updateSelf) {
        setUser(updateUser.data.user);
      }

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
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogPortal>
          <DialogOverlay className="bg-background/40" />
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-lg">Edit User</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col max-h-[30rem]">
              <section className="flex-1 overflow-y-visible flex flex-col">
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
                            <Input type="text" placeholder="Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="permissions"
                      render={({ field }) => (
                        <FormItem className="sm:w-full space-y-0">
                          <FormControl>
                            <MultipleSelector
                              {...field}
                              defaultOptions={Permissions}
                              placeholder="Permissions"
                              hidePlaceholderWhenSelected={true}
                              emptyIndicator={<p>No results.</p>}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <section className="flex flex-col gap-2">
                      {success && (
                        <p className="text-sm text-success">{success}</p>
                      )}
                      {error && <p className="text-sm text-error">{error}</p>}
                      <div className="flex gap-2 justify-between">
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
                            className="sm:w-20 border-white/50">
                            Close
                          </Button>
                        </DialogClose>
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
