import React, { createContext, useContext, useState, ReactNode } from "react";
import { SimpleUser } from "../components/navdrawer";
import { Site } from "@/models/Site";

interface UserContextProps {
  user: SimpleUser | null;
  setUser: React.Dispatch<React.SetStateAction<SimpleUser | null>>;
  favorites: Site[] | [];
  setFavorites: React.Dispatch<React.SetStateAction<Site[] | []>>;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<SimpleUser | null>(null);
  const [favorites, setFavorites] = useState<Site[] | []>([]);

  return (
    <UserContext.Provider value={{ user, setUser, favorites, setFavorites }}>
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
