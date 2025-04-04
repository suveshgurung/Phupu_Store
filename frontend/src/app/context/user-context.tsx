'use client'

import { createContext, useReducer, ReactNode, useRef, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import Cookies from 'js-cookie';
import UserInfo from '@/app/types/user-info';

type UserAction = { type: "LOG_IN", payload: UserInfo | null | undefined } | { type: "LOG_OUT" };

interface UserContextType {
  user: UserInfo | null | undefined;
  userLoaded: boolean;
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
  const userLoaded = useRef<boolean>(false);

  useEffect(() => {
    const secretKey = process.env.NEXT_PUBLIC_ENCRYPTION_SECRET_KEY;
    if (!secretKey) {
      throw new Error("Secret key not provided!");
    }

    const encryptedUserInfo = Cookies.get("user");

    if (encryptedUserInfo) {
      const bytes = CryptoJS.AES.decrypt(encryptedUserInfo, secretKey);
      const decryptedUserInfo = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      dispatch({ type: "LOG_IN", payload: decryptedUserInfo });
    }

    userLoaded.current = true;
  }, []);

  return (
    <UserContext.Provider value={{ user, userLoaded: userLoaded.current, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};
