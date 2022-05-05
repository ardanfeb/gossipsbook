import React, { FunctionComponent, useState } from 'react';

type UserProviderProps = {
  children: React.ReactNode;
};


export type UserContextType = {
  users: string[];
  setUsers: (users: string[]) => void;
};

export const UserContext = React.createContext<UserContextType | undefined>(
  undefined,
);

export const UserProvider: FunctionComponent<UserProviderProps> = ({
  children,
}) => {
  const [users, setUsers] = useState<string[]>([]);

  return (
    <UserContext.Provider
      value={{
        users,
        setUsers,
      }}>
      {children}
    </UserContext.Provider>
  );
};
