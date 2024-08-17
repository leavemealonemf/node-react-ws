import { useEffect, useState } from "react";
import { WSConnection } from "../ws/ws";

export const useConnectSocket = () => {
  const [message, setMessage] = useState("");

  const connectSocket = () => {
    WSConnection.connect();
    WSConnection.ws.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      setMessage(data);
    });
  };

  useEffect(() => {
    connectSocket();

    return () => {
      WSConnection.disconnect();
    };
  }, []);

  return {
    message,
  };
};
