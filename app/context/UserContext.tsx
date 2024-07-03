import React, { createContext, useContext, useState, ReactNode } from "react";
import { SimpleUser } from "../components/navdrawer";
import { Site } from "@/models/Site";
import { Permissions } from "@/utils/permissions";

interface UserContextProps {
  user: SimpleUser | null;
  setUser: React.Dispatch<React.SetStateAction<SimpleUser | null>>;
  favorites: Site[] | [];
  setFavorites: React.Dispatch<React.SetStateAction<Site[] | []>>;
  hasPermission: (permission: Permissions) => boolean;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<SimpleUser | null>(null);
  const [favorites, setFavorites] = useState<Site[] | []>([]);

  const hasPermission = (permission: Permissions) => {
    if (user && user.permission) {
      return user.permission === permission;
    }
    return false;
  };

  return (
    <UserContext.Provider
      value={{ user, setUser, favorites, setFavorites, hasPermission }}>
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
