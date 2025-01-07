import { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

export const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const user = useSelector((data) => data.loginUser);

  useEffect(() => {
    if (user?.id) {
      const socketInstance = io(`${import.meta.env.VITE_API_URL}`, {
        query: {
          userId: user?.id,
        },
      });
      setSocket(socketInstance);

      socketInstance.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      return () => {
        socketInstance.disconnect(); // Cleanup on unmount or user change
      };
    } else if (socket) {
      socket.disconnect(); // Disconnect the existing socket if no user
      setSocket(null); // Clear socket state
    }
  }, [user]);
  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
