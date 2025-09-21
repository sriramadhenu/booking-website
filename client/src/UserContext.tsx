import React, { createContext, useState } from "react";
import axios from "axios";
import { useEffect } from "react";

export type User = {
  _id: string;
  name: string;
  email: string;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  ready: boolean;
};

export const UserContext = createContext<UserContextType | undefined>(undefined);

type UserContextProviderProps = {
  children: React.ReactNode;
};

export function UserContextProvider({ children }: UserContextProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!user) {
      axios.get('/profile').then(({data}) => {
        setUser(data);
        setReady(true);
      }).catch(() => setReady(true));
    }
  }, []);
  return (
    <UserContext.Provider value={{ user, setUser, ready }}>
      {children}
    </UserContext.Provider>
  );
}
