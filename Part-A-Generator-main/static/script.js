document.addEventListener("DOMContentLoaded", function () {
  const chatBox = document.getElementById("chat-box");
  const userInput = document.getElementById("user-input");
  const sendButton = document.getElementById("send-button");
  const inputForm = document.getElementById("input-container");

  function appendMessage(message, sender) {
    const messageElement = document.createElement("div");
    messageElement.classList.add(sender === "user" ? "user-message" : "bot-message");
    messageElement.innerHTML = message;
    chatBox.appendChild(messageElement);

    // Smooth scroll to bottom
    chatBox.scrollTo({
      top: chatBox.scrollHeight,
      behavior: "smooth"
    });
  }

  function sendUserMessage() {
    const text = userInput.value.trim();
    if (text === "") return;

    appendMessage(text, "user");
    userInput.value = "";
    fetch("/chat", {
      method: "POST",
      body: JSON.stringify({ message: text }),
      headers: { "Content-Type": "application/json" }
    })
    .then(response => response.json())
    .then(data => {
      appendMessage(data.reply, "bot");
      if (data.next) {
        setTimeout(() => {
          appendMessage(data.next, "bot");
        }, 750);
      }
    });
  }

  // 🔵 This should be OUTSIDE of appendMessage!
  inputForm.addEventListener("submit", function (e) {
    e.preventDefault();
    sendUserMessage();
  });

  sendButton.addEventListener("click", sendUserMessage);

  // Optional: welcome message
  window.addEventListener("load", () => {
    appendMessage("👋 Hi, I'm your Part A Mock Exam Generator! 🎓<br>Type <b>Start</b> to begin your mock exam! 🧠", "bot");
  });
});
