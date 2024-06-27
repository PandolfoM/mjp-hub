"use client";

import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import NavDrawer, { SimpleUser } from "../../components/navdrawer";
import Spinner from "../../components/spinner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Button from "../../components/button";
import { Input } from "@/components/ui/input";
import { User } from "@/models/User";
import axios from "axios";
import { DeleteDialog } from "../../components/dialogs";
import EditUserDialog from "../../components/dialogs/editUserDialog";

function Admin() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<SimpleUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [ID, setID] = useState<string>("");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/users/getusers");
        const data = await res.json();
        setUsers(data.data);

        const me = await axios.get("/api/auth/me");
        setCurrentUser(me.data.user);

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch users", error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const createUser = async () => {
    setLoading(true);
    try {
      const createUser = await axios.post("/api/users/createuser", {
        email,
      });
      setUsers(createUser.data.users);
      await axios.post("/api/sendemail", {
        email,
        password: createUser.data.password,
      });
      setEmail("");
      setError("");
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
      {loading && <Spinner />}
      <div className="flex flex-col h-full w-full gap-5">
        <nav className="flex justify-between h-8 px-2 mt-2 items-center">
          <NavDrawer user={currentUser}>
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
                    className={user.tempPassword ? "text-error" : ""}>
                    {user.email}
                  </AccordionTrigger>
                  <AccordionContent className="flex gap-2 justify-between items-center">
                    {user.tempPassword && (
                      <p className="text-md text-white/80">
                        Account pending...
                      </p>
                    )}
                    <div className="flex gap-2 justify-end">
                      <EditUserDialog
                        user={user}
                        currentUser={currentUser}
                        setUsers={setUsers}>
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
                  <div className="flex gap-2 justify-end">
                    <Input
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button
                      variant="filled"
                      className="bg-success"
                      onClick={createUser}>
                      Create
                    </Button>
                  </div>

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
