import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import Button from "../button";
import { SimpleUser } from "../navdrawer";
import Spinner from "../spinner";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { User } from "@/models/User";

type Props = {
  user: SimpleUser;
  currentUser: SimpleUser | null;
  children: ReactNode;
  setUsers: Dispatch<SetStateAction<User[]>>;
};

function EditUserDialog({ user, currentUser, children, setUsers }: Props) {
  const [deployMessage, setDeployMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const updateUser = async () => {
    setIsLoading(true);

    if (password !== confirmPassword) {
      setIsLoading(false);
      return setError("Passwords do not match");
    }

    try {
      const sameUser = currentUser?._id === user._id;
      const updateUser = await axios.post("/api/users/updateuser", {
        user,
        email,
        password: sameUser ? password : null,
      });

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === updateUser.data.user._id
            ? { ...user, ...updateUser.data.user }
            : user
        )
      );
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setEmail(user.email);
  }, [user]);

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
                <form onSubmit={updateUser} className="flex flex-col gap-2">
                  <Input
                    placeholder="Email"
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {currentUser?._id === user._id && (
                    <>
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
                    </>
                  )}
                </form>
              </section>
            </div>
            <DialogFooter>
              <section className="flex flex-col gap-2">
                {error && <p className="text-sm text-error">{error}</p>}
                <div className="flex gap-2">
                  <Button
                    disabled={isLoading}
                    className="w-20"
                    onClick={() => updateUser()}>
                    Save
                  </Button>
                </div>
              </section>
            </DialogFooter>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  );
}

export default EditUserDialog;
