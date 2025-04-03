'use client'

import { createContext, useReducer, ReactNode } from 'react';
import UserInfo from '@/app/types/user-info';

type UserAction = { type: "LOG_IN", payload: UserInfo | null | undefined } | { type: "LOG_OUT" };

interface UserContextType {
  user: UserInfo | null | undefined;
  dispatch: (action: UserAction) => void;
};

export const UserContext = createContext<UserContextType | undefined>(undefined);

const UserReducer = (state: UserInfo | null | undefined, action: UserAction): UserInfo | null |undefined => {
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
