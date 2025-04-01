import { createContext, useContext, useState, ReactNode } from 'react';

interface userInfo {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
};

interface UserContextType {
  user?: userInfo;
  updateUser: (type: string, user: userInfo) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<userInfo | undefined>(undefined);

  const updateUser = (type: string, user?: userInfo) => {
    switch (type) {
      case "LOG_IN":
        setUser(user);
        break;
      case "LOG_OUT":
        setUser(undefined);
        break;
    }
  }

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }

  return context;
};
