"use client";

import { useState, useEffect } from "react";
import "./style.css";

const HomePage = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (inputValue !== "") {
      const Input = inputValue;
      setLoading(true);
      setMessages((prevMessages) => [...prevMessages, { sender: "user", message: Input }]);
      setInputValue("");
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", message: ". . ." },
      ]);
      try {
        const response = await fetch("/api", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: Input }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch response");
        }

        const data = await response.json();

        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          updatedMessages[updatedMessages.length - 1] = {
            sender: "bot",
            message: data.text,
          };

          return updatedMessages;
        });

        setLoading(false);
        setInputValue("");
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const element = document.querySelector(".Messages");
      if (element) {
        element.scrollTop = element.scrollHeight;
      }
    }
  }, [messages]);

  return (
    <div className="MainChat">

      <h1>
        <img
          src="/Mistral.png"
          alt="Mistral ChatBot Logo"
          style={{ marginRight: "10px", verticalAlign: "middle" }}
        />
        Mistral ChatBot
      </h1>
      <div className="Messages">
      {messages.length === 0 ? (
        <h3 className="Title">Hello To Mistral chat bot . Mistral is here to assisst you !</h3>
      ) : (
        messages.map((msg, index) => (
          <div key={index} className="Message">
            <strong>{msg.sender === "user" ? "You" : "Mistral"}</strong>
            <p>{msg.message}</p>
          </div>
        ))
      )}
     </div>

       
      <div className="InputField">
        <input
          type="text"
          name="Input"
          onChange={handleInputChange}
          id="Input"
          placeholder="What do you have in mind ? "
          value={inputValue}
        />
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Loading..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default HomePage;
