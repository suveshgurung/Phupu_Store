'use client'

import { createContext, useContext, useReducer, ReactNode } from 'react';

interface userInfo {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
};

type UserAction = { type: "LOG_IN", payload: userInfo | null } | { type: "LOG_OUT" };

interface UserContextType {
  user: userInfo | null;
  dispatch: (action: UserAction) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

const UserReducer = (state: userInfo | null, action: UserAction): userInfo | null => {
  switch (action.type) {
    case "LOG_IN":
      return action.payload;
    case "LOG_OUT":
      return null;
    default:
      return state;
  }
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, dispatch] = useReducer(UserReducer, null);

  return (
    <UserContext.Provider value={{ user, dispatch }}>
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
