import React, { createContext, useContext, useState, ReactNode } from "react";
import { SimpleUser } from "../components/navdrawer";

interface UserContextProps {
  user: SimpleUser | null;
  setUser: React.Dispatch<React.SetStateAction<SimpleUser | null>>;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<SimpleUser | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
