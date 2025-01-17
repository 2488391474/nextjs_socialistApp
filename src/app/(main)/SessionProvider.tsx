"use client";

import { User, Session } from "lucia";
import React, { createContext, useContext } from "react";

interface SessionContextType {
  user: User;
  session: Session;
}

const SessionContext = createContext<SessionContextType | null>(null);

const SessionProvider = ({
  children,
  value,
}: React.PropsWithChildren<{ value: SessionContextType }>) => {
  return (
    <>
      <SessionContext.Provider value={value}>
        {children}
      </SessionContext.Provider>
    </>
  );
};

export default SessionProvider;

export function useSession(): SessionContextType {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("必须在被provider包含的组件中使用useSession!");
  }
  return context;
}
