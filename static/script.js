const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");

// This array will store the entire conversation history.
let conversation = [];

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) {
    return;
  }

  // 1. Add the user's message to the UI.
  appendMessage("user", userMessage);

  // 2. Add the user's message to our conversation history.
  conversation.push({ role: "user", text: userMessage });

  // 3. Clear the input field.
  input.value = "";

  // 4. Show a temporary "thinking..." message and keep a reference to it.
  const botMessageElement = appendMessage("bot", "thinking...");

  try {
    // 5. Send the entire conversation to the server.
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ conversation }), // The backend expects an object with a 'conversation' key
    });

    const result = await response.json();

    // 6. Handle the response from the server.
    if (response.ok && result.success) {
      // Update the "thinking..." message with the actual response.
      botMessageElement.textContent = result.data;
      // Add the bot's response to our conversation history.
      conversation.push({ role: "model", text: result.data });
    } else {
      // If the server returned an error, display it.
      botMessageElement.textContent =
        result.message || "Sorry, no response was received.";
    }
  } catch (error) {
    // 7. Handle network errors.
    console.error("Error:", error);
    botMessageElement.textContent = "Failed to get response from server.";
  }
});

/**
 * Creates a new message element and appends it to the chat box.
 * @param {string} sender - The sender of the message ('user' or 'bot').
 * @param {string} text - The content of the message.
 * @returns {HTMLElement} The created message element.
 */
function appendMessage(sender, text) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  // Scroll to the bottom of the chat box to show the latest message.
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg; // Return the element so we can update it later.
}
