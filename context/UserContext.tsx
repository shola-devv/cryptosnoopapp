'use client';
import { createContext, useContext, useState, useEffect } from 'react';

type Asset = {
  _id: string;
  name: string;
  quantity: number;
};

type Account = {
  _id: string;
  address: string;
  data: any[];
};

type Address = {
  _id: string;
  address: string;
  label: string;
  category: string;
};

type User = {
  id: string;
  assets: Asset[];
  accounts: Account[];
  addresses: Address[];
};

const UserContext = createContext<{
  user: User | null;
  setUser: (u: User) => void;
}>({
  user: null,
  setUser: () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // On mount, load user from Privy or session
  useEffect(() => {
    // TODO: Get userId from Privy auth
    const userId = '68e54cbbec084f39199b2731';
    setUser({ id: userId, assets: [], accounts: [], addresses: [] });
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);