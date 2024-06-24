document.addEventListener("DOMContentLoaded", function() {
  const chatList = document.getElementById("chat-list");
  const messageContainer = document.querySelector(".message-container");
  const userInput = document.getElementById("user-input");
  const sendButton = document.getElementById("send-button");
  const newChatButton = document.getElementById("new-chat-button");

  let currentChatId = null;
  let chats = JSON.parse(localStorage.getItem("chats")) || [];

  // Load chats from local storage and populate the chat history
  function loadChats() {
    chatList.innerHTML = "";
    chats.forEach((chat, index) => {
      const li = document.createElement("li");
      li.textContent = `Chat ${index + 1}`;
      li.addEventListener("click", () => loadChat(chat.id));
      chatList.appendChild(li);
    });

    // If there are no chats, start a new one
    if (chats.length === 0) {
      createNewChat();
    } else {
      loadChat(chats[chats.length - 1].id); // Load the last chat by default
    }
  }

  // Function to load a specific chat
  function loadChat(chatId) {
    currentChatId = chatId;
    const chat = chats.find(c => c.id === chatId);
    messageContainer.innerHTML = "";
    chat.messages.forEach(displayMessage);
  }

  // Function to display a message in the chat box
  function displayMessage(message) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", message.sender === "You" ? "user-message" : "response");
    messageElement.innerText = `${message.sender}: ${message.text}`;
    messageContainer.appendChild(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight; // Auto-scroll to bottom
  }

  // Function to display a loading message
  function displayLoadingMessage() {
    const loadingMessage = { sender: "Bot", text: "Loading..." };
    displayMessage(loadingMessage);
  }

  // Function to remove the loading message
  function removeLoadingMessage() {
    const messageElements = document.querySelectorAll(".message-container .message");
    messageElements.forEach(function(element) {
      if (element.innerText === "Bot: Loading...") {
        element.remove();
      }
    });
  }

  // Function to create a new chat
  function createNewChat() {
    currentChatId = Date.now();
    chats.push({ id: currentChatId, messages: [] });
    localStorage.setItem("chats", JSON.stringify(chats));
    loadChats();
    displayMessage({ sender: "Bot", text: "Welcome! How can I assist you today?" });
  }

  // Event listeners for send button click, Enter key press, and new chat button
  sendButton.addEventListener("click", handleUserInput);
  userInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      handleUserInput();
    }
  });
  newChatButton.addEventListener("click", createNewChat);

  // Handle user input to save to the current chat
  function handleUserInput() {
    const userInputValue = userInput.value.trim();
    if (userInputValue !== "") {
      const currentChat = chats.find(c => c.id === currentChatId);
      currentChat.messages.push({ sender: "You", text: userInputValue });
      displayMessage({ sender: "You", text: userInputValue });

      userInput.value = ""; // Clear input field
      displayLoadingMessage(); // Show loading message

      // Send the user input to the backend to generate a response (adjust the URL as needed)
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/response");
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onload = function() {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          currentChat.messages.push({ sender: "Bot", text: response.result });
          displayMessage({ sender: "Bot", text: response.result });
        } else {
          displayMessage({ sender: "Bot", text: "Error occurred while processing your request." });
        }
        removeLoadingMessage(); // Remove loading message
        localStorage.setItem("chats", JSON.stringify(chats)); // Update local storage
        loadChats(); // Refresh chat list
      };
      xhr.onerror = function() {
        displayMessage({ sender: "Bot", text: "Error occurred while processing your request." });
        removeLoadingMessage();
      };
      xhr.send(JSON.stringify({ user_interaction: userInputValue }));
    }
  }

  // Initial load of chats
  loadChats();
});
