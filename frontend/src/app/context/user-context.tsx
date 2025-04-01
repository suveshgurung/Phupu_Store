'use client'

import { createContext, useReducer, ReactNode } from 'react';

interface userInfo {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  profileImage?: string | null;
};

type UserAction = { type: "LOG_IN", payload: userInfo | null } | { type: "LOG_OUT" };

interface UserContextType {
  user: userInfo | null;
  dispatch: (action: UserAction) => void;
};

export const UserContext = createContext<UserContextType | undefined>(undefined);

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
