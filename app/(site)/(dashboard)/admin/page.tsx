"use client";

import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import NavDrawer, { SimpleUser } from "../../../components/navdrawer";
import Spinner from "../../../components/spinner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Button from "../../../components/button";
import { Input } from "@/components/ui/input";
import { User } from "@/models/User";
import axios from "axios";
import { DeleteDialog } from "../../../components/dialogs";
import EditUserDialog from "../../../components/dialogs/editUserDialog";
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

const formSchema = z.object({
  email: z
    .string({ required_error: "Required" })
    .email({ message: "Not a valid email" }),
  name: z.string().min(1, { message: "Required" }),
});

function Admin() {
  const { user: currentUser } = useUser();
  const { loading, setLoading } = useSite();
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string>("");
  const [ID, setID] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/users/getusers");
        const data = await res.json();
        setUsers(data.data);

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch users", error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, [setLoading]);

  const createUser = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const createUser = await axios.post("/api/users/createuser", {
        email: data.email,
        name: data.name,
      });

      setUsers(createUser.data.users);
      await axios.post("/api/sendemail", {
        email: data.email,
        password: createUser.data.password,
      });
      form.reset();
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      setError(error.response.data.error);
    }
  };

  const deleteUser = async () => {
    setLoading(true);
    try {
      const deleteUser = await axios.post("/api/users/deleteuser", {
        _id: ID,
      });

      setUsers(deleteUser.data.users);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col h-full w-full gap-5">
        <nav className="flex justify-between h-8 px-2 mt-2 items-center">
          <NavDrawer>
            <FontAwesomeIcon
              className="cursor-pointer sm:hidden w-5 h-auto"
              icon={faBars}
            />
          </NavDrawer>
        </nav>
        <div className="flex flex-col px-5 items-center h-full overflow-y-auto">
          <div className="flex flex-col gap-2 w-full">
            <h2 className="text-center w-full text-lg">Users</h2>
            <Accordion type="single" collapsible className="w-full">
              {users.map((user, i) => (
                <AccordionItem key={i} value={user.email}>
                  <AccordionTrigger
                    className={
                      user.tempPassword
                        ? "text-error overflow-hidden"
                        : "overflow-hidden"
                    }>
                    <div className="whitespace-nowrap overflow-hidden text-ellipsis">
                      {user.name}{" "}
                      <span className="text-sm text-white/50  ">
                        ({user.email})
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="flex gap-2 justify-between items-center">
                    {user.tempPassword && (
                      <p className="text-md text-white/80">
                        Account pending...
                      </p>
                    )}
                    <div className="flex gap-2 justify-end">
                      <EditUserDialog user={user} setUsers={setUsers}>
                        <Button
                          variant="filled"
                          className="bg-primary h-10"
                          disabled={user.tempPassword}>
                          Edit
                        </Button>
                      </EditUserDialog>
                      <DeleteDialog onClick={deleteUser} name={user.email}>
                        <Button
                          variant="filled"
                          className="bg-error h-10"
                          onClick={() => setID(user._id)}
                          disabled={
                            user.email === currentUser?.email ||
                            users.length === 1
                          }>
                          Delete
                        </Button>
                      </DeleteDialog>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
              <AccordionItem value="new-user">
                <AccordionTrigger>Add User</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-2 justify-end">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(createUser)}
                      className="flex flex-col gap-2 justify-end sm:flex-row">
                      <FormField
                        control={form.control}
                        name="email"
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
                      <Button
                        type="submit"
                        variant="filled"
                        className="bg-success sm:mt-0 h-[40px]"
                        disabled={loading}>
                        Create
                      </Button>
                    </form>
                  </Form>
                  {error && <p className="text-sm text-error">{error}</p>}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </>
  );
}

export default Admin;
