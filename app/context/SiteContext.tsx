import React, { createContext, useContext, useState, ReactNode } from "react";
import Spinner from "../components/spinner";

interface SiteContextProps {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const SiteContext = createContext<SiteContextProps | undefined>(undefined);

export const SiteProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <SiteContext.Provider value={{ loading, setLoading }}>
      {loading && <Spinner />}
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => {
  const context = useContext(SiteContext);
  if (context === undefined) {
    throw new Error("useSite must be used within a SiteProvider");
  }
  return context;
};
