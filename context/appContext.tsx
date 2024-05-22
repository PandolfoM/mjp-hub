import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useState,
} from "react";

interface AppContext {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

export const AppContext = createContext<AppContext>({
  loading: false,
  setLoading: () => {},
});

export const AppContextProvider = (props: React.PropsWithChildren) => {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <AppContext.Provider
      value={{
        loading,
        setLoading,
      }}>
      {props.children}
    </AppContext.Provider>
  );
};
