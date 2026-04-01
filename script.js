document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contact-form");
  const statusText = document.getElementById("form-status");

  if (!form) {
    console.error("Form not found");
    return;
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !email || !message) {
      statusText.textContent = "Please fill all fields.";
      statusText.style.color = "red";
      return;
    }

    statusText.textContent = "Sending message...";
    statusText.style.color = "blue";

    try {
      const response = await fetch("/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: name,
          email: email,
          message: message
        })
      });

      const data = await response.json();

      if (response.ok) {
        statusText.textContent = data.message || "Message sent successfully!";
        statusText.style.color = "green";
        form.reset();
      } else {
        statusText.textContent = data.message || "Failed to send message.";
        statusText.style.color = "red";
      }
    } catch (error) {
      console.error("Error sending message:", error);
      statusText.textContent = "Server error. Please try again later.";
      statusText.style.color = "red";
    }
  });
});