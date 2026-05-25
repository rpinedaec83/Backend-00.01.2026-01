const googleLoginBtn = document.getElementById("googleLoginBtn");
const usersOnline = document.getElementById("usersOnline");
const messages = document.getElementById("messages");
const chatForm = document.getElementById("chatForm");
const usernameInput = document.getElementById("username");
const messageInput = document.getElementById("message");
let oauthEnabled = true;

function appendMessage(item) {
  const li = document.createElement("li");
  li.textContent = `[${new Date(item.createdAt || Date.now()).toLocaleTimeString()}] ${item.username}: ${item.body}`;
  messages.appendChild(li);
}

async function configureAuthButton() {
  const authRes = await fetch("/auth/me");
  const authData = await authRes.json();
  oauthEnabled = Boolean(authData.oauthEnabled);

  googleLoginBtn.textContent = "Iniciar sesión con Google";
}

const socket = io();
socket.on("chat:history", (items) => {
  messages.innerHTML = "";
  items.forEach(appendMessage);
});

socket.on("chat:new", appendMessage);

socket.on("chat:users", (count) => {
  usersOnline.textContent = `Usuarios conectados: ${count}`;
});

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  socket.emit(
    "chat:send",
    {
      username: usernameInput.value,
      body: messageInput.value,
    },
    (ack) => {
      if (!ack.ok) {
        alert(ack.error);
      }
    },
  );

  messageInput.value = "";
});

googleLoginBtn.addEventListener("click", (event) => {
  if (!oauthEnabled) {
    event.preventDefault();
    alert("OAuth Google no esta configurado. Configura OAUTH_GOOGLE_CLIENT_ID y OAUTH_GOOGLE_CLIENT_SECRET.");
  }
});

configureAuthButton().catch(() => {
  oauthEnabled = false;
  googleLoginBtn.textContent = "Iniciar sesión con Google";
});
