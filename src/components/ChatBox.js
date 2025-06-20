import React, { useState, useRef, useEffect } from "react";
import { FaComment, FaTimes, FaPaperPlane } from "react-icons/fa";
import "../css/ChatBox.css";

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatBotMessage = (text) => {
    // Tách tin nhắn khi gặp "* **" (dấu sao + 2 dấu sao)
    const messageParts = text.split(/\*/).filter(part => part.trim() !== '');
    
    // Format từng phần tin nhắn
    return messageParts.map((part, index) => {
      // Thay **text** thành <strong>text</strong>
      let formattedText = part.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    //   // Thay *text* thành <em>text</em>
    //   formattedText = formattedText.replace(/\*(.*?)\*/g, '<em>$1</em>');
      
      return {
        text: formattedText,
        sender: "bot",
        key: `bot-msg-${Date.now()}-${index}`
      };
    });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = { text: inputMessage, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputMessage,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const botMessages = formatBotMessage(data.reply || "Xin lỗi, tôi không hiểu câu hỏi của bạn.");
      setMessages((prev) => [...prev, ...botMessages]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = { text: "Đã có lỗi xảy ra khi kết nối với dịch vụ chat.", sender: "bot" };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const createMarkup = (html) => {
    return { __html: html };
  };

  return (
    <div className="chat-container">
      {isOpen ? (
        <div className="chat-box">
          <div className="chat-header">
            <h3>Chăm sóc khách hàng</h3>
            <button className="close-btn" onClick={toggleChat}>
              <FaTimes />
            </button>
          </div>
          <div className="chat-messages">
            {messages.length === 0 ? (
              <div className="welcome-message">
                Xin chào! Tôi có thể giúp gì cho bạn về khách sạn hoặc vé máy bay?
              </div>
            ) : (
              messages.map((msg, index) => (
                <div key={msg.key || `${msg.sender}-${index}`} className={`message ${msg.sender}`}>
                  {msg.sender === "bot" ? (
                    <div dangerouslySetInnerHTML={createMarkup(msg.text)} />
                  ) : (
                    msg.text
                  )}
                </div>
              ))
            )}
            {isLoading && (
              <div className="message bot">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập tin nhắn..."
            />
            <button onClick={handleSendMessage} disabled={isLoading}>
              <FaPaperPlane />
            </button>
          </div>
        </div>
      ) : (
        <button className="chat-toggle" onClick={toggleChat}>
          <FaComment className="chat-icon" />
        </button>
      )}
    </div>
  );
};

export default ChatBox;