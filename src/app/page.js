"use client";

import { useState, useEffect } from "react";
import { marked } from "marked";
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
        
        Mistral <img
          src="/Mistral.png"
          alt="Mistral ChatBot Logo"
        /> ChatBot
      </h1>
      <div className="Messages">
        {messages.length === 0 ? (
          <h2 className="Title">Hello, how can I assist you today <p>?</p></h2>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className="Message">
              <strong>{msg.sender === "user" ? "You" : "Mistral"}</strong>
              <p dangerouslySetInnerHTML={{ 
                __html: msg.sender === "bot" ? marked(msg.message) : msg.message 
              }} />
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
          placeholder="What do you have in mind?"
          value={inputValue}
        />
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Loading..." : "ASK"}
        </button>
      </div>
    </div>
  );
};

export default HomePage;
