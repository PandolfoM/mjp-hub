"use client";

import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import NavDrawer from "../components/navdrawer";
import Spinner from "../components/spinner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Button from "../components/button";
import { Input } from "@/components/ui/input";
import { User } from "@/models/User";
import axios from "axios";

function Admin() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");

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
  }, []);

  const createUser = async () => {
    setLoading(true);
    try {
      const createUser = await axios.post("/api/users/createuser", {
        email,
      });
      console.log(createUser);

      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      setError(error.message);
      throw new Error(`Error creating user: ${error.message}`);
    }
  };

  return (
    <>
      {loading && <Spinner />}
      <main className="flex flex-col gap-5 h-full">
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
                  <AccordionTrigger>{user.email}</AccordionTrigger>
                  <AccordionContent className="flex gap-2 justify-end">
                    <Button variant="filled" className="bg-primary h-10">
                      Edit
                    </Button>
                    <Button variant="filled" className="bg-error h-10">
                      Delete
                    </Button>
                  </AccordionContent>
                </AccordionItem>
              ))}
              <AccordionItem value="new-user">
                <AccordionTrigger>Add User</AccordionTrigger>
                <AccordionContent className="flex gap-2 justify-end">
                  {error && <p className="text-sm text-error">{error}</p>}

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
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </main>
    </>
  );
}

export default Admin;
