document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");
  const statusText = document.getElementById("form-status");

  // IMPORTANT:
  // Ivide ninte Render backend URL kodukkanam
  const API_URL = "https://portfolio-bxq5.onrender.com/contact";

  if (!form) {
    console.error("Form with id='contact-form' not found.");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = nameInput ? nameInput.value.trim() : "";
    const email = emailInput ? emailInput.value.trim() : "";
    const message = messageInput ? messageInput.value.trim() : "";

    // Basic validation
    if (!name || !email || !message) {
      showStatus("Please fill all fields.", "red");
      return;
    }

    if (!isValidEmail(email)) {
      showStatus("Please enter a valid email address.", "red");
      return;
    }

    showStatus("Sending message...", "blue");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          message
        })
      });

      const data = await response.json();

      if (response.ok) {
        showStatus(data.message || "Message sent successfully!", "green");
        form.reset();
      } else {
        showStatus(data.message || "Failed to send message.", "red");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      showStatus("Server error. Please try again later.", "red");
    }
  });

  function showStatus(message, color) {
    if (statusText) {
      statusText.textContent = message;
      statusText.style.color = color;
    } else {
      alert(message);
    }
  }

  function isValidEmail(email) {
    return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
  }
});