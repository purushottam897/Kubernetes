import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUserContext = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({
        name: '',
        id: '',
        email: ''
      });

  useEffect(() => {
    const storedName = localStorage.getItem('name');
    const storedId = localStorage.getItem('id');
    const storedEmail = localStorage.getItem('email');
    if (storedName && storedId && storedEmail) {
      setUser({
        name: storedName,
        id: storedId,
        email: storedEmail
      });
    }
  }, []);

  const setUserInfo = (userInfo) => {
    setUser(userInfo);
  };

  return (
    <UserContext.Provider value={{ user, setUser: setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};
