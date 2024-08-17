import { useEffect, useState } from "react";
import { useConnectSocket } from "./hooks/useSocketConnect";

function App() {
  const [newMessage, setNewMessage] = useState("");

  const { message } = useConnectSocket();

  const [messagesQuery, setMessagesQuery] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await fetch("http://localhost:3001/messages");

      if (!res.ok) throw new Error("Failed fetch messages");

      const data = await res.json();
      setMessagesQuery(
        data.map((x) => {
          const msg = JSON.parse(x.msg);
          return msg;
        })
      );
    })();
  }, []);

  useEffect(() => {
    setMessagesQuery((prev) => {
      return [message, ...prev];
    });
  }, [message]);

  const sendMessage = async () => {
    if (!newMessage.length) return;

    const res = await fetch("http://localhost:3001/messages", {
      method: "POST",
      body: JSON.stringify({
        msg: newMessage,
      }),
    });

    if (!res.ok) throw new Error("Failed to push message");
    setNewMessage("");
  };

  return (
    <div>
      <h1>Messages client</h1>

      {messagesQuery
        .filter((msg) => typeof msg !== "string")
        .map((msg, index) => (
          <div key={index} style={{ display: "flex" }}>
            <span>{msg.msg}</span>
          </div>
        ))}

      <div>
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
      </div>
      <button onClick={() => sendMessage()}>Отправить</button>
    </div>
  );
}

export default App;
