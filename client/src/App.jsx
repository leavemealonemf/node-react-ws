import { useEffect, useState } from "react";
import Message from "./components/messages/Message";
import { useConnectSocket } from "./hooks/useSocketConnect";

function App() {
  const [newMessage, setNewMessage] = useState("");

  const { message } = useConnectSocket();

  const [messagesQuery, setMessagesQuery] = useState([]);

  useEffect(() => {
    setMessagesQuery((prev) => {
      return [message, ...prev];
    });
  }, [message]);

  const sendMessage = (e) => {
    e.preventDefault();
  };

  console.log(messagesQuery);

  return (
    <div>
      <h1>Messages client</h1>

      {messagesQuery
        .filter((msg) => typeof msg !== "string")
        .map((msg, index) => (
          <Message key={index} message={msg} />
        ))}

      <div>
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
      </div>
      <button onClick={(e) => sendMessage(e)}>Отправить</button>
    </div>
  );
}

export default App;
