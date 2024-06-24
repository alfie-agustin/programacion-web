// chatbot.js

document.addEventListener("DOMContentLoaded", function() {
    // Function to display a message in the chat box
    function displayMessage(message) {
        const messageContainer = document.querySelector(".message-container");
        const messageElement = document.createElement("div");
        messageElement.classList.add("message");
        messageElement.innerText = message;
        messageContainer.appendChild(messageElement);
    }

    // Function to display a loading message
    function displayLoadingMessage() {
        const loadingMessage = "Loading...";
        displayMessage(loadingMessage);
    }

    // Function to handle user input
    function handleUserInput() {
        const userInput = document.getElementById("user-input").value;
        if (userInput.trim() !== "") {
            displayMessage("You: " + userInput);
            displayLoadingMessage(); // Display loading message after user input

            // Clear the input box after sending the message
            document.getElementById("user-input").value = "";

            // Send the user input to the backend to generate a response
            const xhr = new XMLHttpRequest();
            xhr.open("POST", "/response");
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.onload = function() {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    displayMessage("Bot: " + response.result);
                } else {
                    displayMessage("Bot: Error occurred while processing your request.");
                }
                removeLoadingMessage(); // Remove the loading message after the request cycle is complete
            };
            xhr.onerror = function() {
                displayMessage("Bot: Error occurred while processing your request.");
                removeLoadingMessage(); // Remove the loading message after the request cycle is complete
            };
            xhr.send(JSON.stringify({ user_interaction: userInput }));
        }
    }

    // Function to remove the loading message
    // Function to remove the loading message
function removeLoadingMessage() {
    const messageElements = document.querySelectorAll(".message-container .message");
    messageElements.forEach(function(element) {
        if (element.innerText === "Loading...") {
            element.remove();
        }
    });
}


    // Event listener for send button click
    const sendButton = document.getElementById("send-button");
    sendButton.addEventListener("click", function() {
        handleUserInput();
    });

    // Event listener for pressing Enter in the input field
    const userInputField = document.getElementById("user-input");
    userInputField.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            handleUserInput();
        }
    });

    // Display the welcome message when the page loads
    const welcomeMessage = "Welcome! How can I assist you today?";
    displayMessage(welcomeMessage);
});
