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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { Permissions } from "@/utils/permissions";

type Props = {
  user: User;
  children: ReactNode;
  setUsers: Dispatch<SetStateAction<User[]>>;
};

const formSchema = z.object({
  email: z
    .string({ required_error: "Required" })
    .email({ message: "Not a valid email" }),
  name: z.string().min(1, { message: "Required" }),
  permission: z.string().min(1, { message: "Required" }),
});

const FormPermissions = [
  { label: "Admin", value: "admin" },
  { label: "Developer", value: "dev" },
  { label: "Manage", value: "manage" },
  { label: "User", value: "user" },
];

function EditUserDialog({ user, children, setUsers }: Props) {
  const { user: currentUser, setUser, hasPermission } = useUser();
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
        permission: data.permission,
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
                      name="permission"
                      defaultValue={user.permission}
                      render={({ field }) => (
                        <FormItem className="sm:w-full space-y-0">
                          <Popover>
                            <PopoverTrigger
                              asChild
                              disabled={
                                (currentUser?._id === user._id &&
                                  hasPermission(Permissions.Manage)) ||
                                (hasPermission(Permissions.Manage) &&
                                  user.permission === Permissions.Admin)
                              }>
                              <FormControl>
                                <Button
                                  variant="filled"
                                  className={cn(
                                    "h-10 w-full bg-white/5 text-left text-sm text-white flex items-center justify-between",
                                    !field.value && "text-white/50"
                                  )}>
                                  {field.value
                                    ? FormPermissions.find(
                                        (perm) => perm.value === field.value
                                      )?.label
                                    : "Select Permission"}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              align="start"
                              className="w-[200px] p-0">
                              <Command>
                                <CommandInput placeholder="Search permission..." />
                                <CommandEmpty>
                                  No permission found.
                                </CommandEmpty>
                                <CommandList>
                                  <CommandGroup>
                                    {FormPermissions.map((perm) => (
                                      <CommandItem
                                        value={perm.label}
                                        key={perm.value}
                                        onSelect={() => {
                                          form.setValue(
                                            "permission",
                                            perm.value
                                          );
                                        }}>
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            perm.value === field.value
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                        {perm.label}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
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
