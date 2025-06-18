// src/hooks/useAuth.ts
import { useState, useEffect } from "react";

const useAuth = () => {
  const [user, setUser] = useState<{ isLoggedIn: boolean; role: string } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = localStorage.getItem("user"); 
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } else {
          setUser({ isLoggedIn: false, role: "" });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser({ isLoggedIn: false, role: "" });
      }
    };

    fetchUser();
  }, []);

  return user;
};

export default useAuth;
