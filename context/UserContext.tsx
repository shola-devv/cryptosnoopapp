'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

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
  email?: string;
  name?: string;
  image?: string;
  assets: Asset[];
  accounts: Account[];
  addresses: Address[];
};

const UserContext = createContext<{
  user: User | null;
  setUser: (u: User) => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}>({
  user: null,
  setUser: () => {},
  isLoading: true,
  isAuthenticated: false,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const { data: session, status } = useSession();

  // Load user from NextAuth session
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const userId = session.user.id;
      
      setUser({ 
        id: userId,
        email: session.user.email || undefined,
        name: session.user.name || undefined,
        image: session.user.image || undefined,
        assets: [], 
        accounts: [], 
        addresses: [] 
      });
    } else if (status === 'unauthenticated') {
      setUser(null);
    }
  }, [session, status]);

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser,
      isLoading: status === 'loading',
      isAuthenticated: status === 'authenticated'
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);