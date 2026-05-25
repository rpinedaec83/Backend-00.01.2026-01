// =============================================
// CHAT CLIENT - Socket.io
// =============================================
const socket = io();

// Datos del usuario actual (inyectados por EJS)
const { username, avatar, userId } = window.CURRENT_USER;

// Referencias al DOM
const messagesContainer = document.getElementById("messages");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");
const onlineList = document.getElementById("online-list");
const onlineCount = document.getElementById("online-count");
const typingIndicator = document.getElementById("typing-indicator");
const currentRoomLabel = document.getElementById("current-room");
const roomButtons = document.querySelectorAll(".room-btn");

let currentRoom = "general";
let typingTimeout = null;

// =============================================
// UNIRSE A LA SALA AL CONECTAR
// =============================================
socket.emit("join-room", { username, avatar, userId, room: currentRoom });

// =============================================
// CAMBIAR DE SALA
// =============================================
roomButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const newRoom = btn.dataset.room;
    if (newRoom === currentRoom) return;

    roomButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    socket.emit("join-room", { username, avatar, userId, room: newRoom });
    currentRoom = newRoom;
    currentRoomLabel.textContent = `# ${newRoom}`;
    messageInput.placeholder = `Escribe un mensaje en #${newRoom}...`;

    messagesContainer.innerHTML = "";
    loadMessages(newRoom);
  });
});

// =============================================
// CARGAR MENSAJES VÍA REST API
// =============================================
async function loadMessages(room) {
  try {
    const res = await fetch(`/chat/api/messages?room=${room}&limit=50`);
    const data = await res.json();
    if (data.success) {
      data.messages.forEach((msg) => renderMessage(msg));
      scrollToBottom();
    }
  } catch (err) {
    console.error("Error cargando mensajes:", err);
  }
}

// =============================================
// ENVIAR MENSAJE
// =============================================
messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const content = messageInput.value.trim();
  if (!content) return;

  socket.emit("send-message", { content, room: currentRoom });
  messageInput.value = "";

  socket.emit("stop-typing", { room: currentRoom });
  clearTimeout(typingTimeout);
});

// =============================================
// INDICADOR DE ESCRITURA
// =============================================
messageInput.addEventListener("input", () => {
  socket.emit("typing", { room: currentRoom });
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    socket.emit("stop-typing", { room: currentRoom });
  }, 1500);
});

// =============================================
// EVENTOS DE SOCKET.IO
// =============================================
socket.on("new-message", (msg) => {
  renderMessage(msg);
  scrollToBottom();
});

socket.on("user-joined", ({ message }) => {
  renderSystemMessage(message);
});

socket.on("user-left", ({ message }) => {
  renderSystemMessage(message);
});

socket.on("online-users", (users) => {
  onlineCount.textContent = users.length;
  onlineList.innerHTML = users.map((u) => `<li>${u.username}</li>`).join("");
});

socket.on("user-typing", ({ username: typingUser }) => {
  typingIndicator.textContent = `${typingUser} está escribiendo...`;
  typingIndicator.classList.remove("hidden");
});

socket.on("user-stop-typing", () => {
  typingIndicator.classList.add("hidden");
});

socket.on("error", ({ message }) => {
  console.error("Error del servidor:", message);
});

// =============================================
// FUNCIONES HELPER
// =============================================
function renderMessage(msg) {
  const div = document.createElement("div");
  div.classList.add("message");

  const time = new Date(msg.timestamp || msg.created_at).toLocaleTimeString(
    "es-PE",
    { hour: "2-digit", minute: "2-digit" }
  );

  const avatarHtml = msg.avatar
    ? `<img src="${msg.avatar}" class="msg-avatar" alt="${msg.username}" />`
    : `<div class="msg-avatar-placeholder">${msg.username[0].toUpperCase()}</div>`;

  div.innerHTML = `
    ${avatarHtml}
    <div class="msg-body">
      <div class="msg-meta">
        <span class="msg-author">${escapeHtml(msg.username)}</span>
        <span class="msg-time">${time}</span>
      </div>
      <p class="msg-content">${escapeHtml(msg.content)}</p>
    </div>
  `;

  messagesContainer.appendChild(div);
}

function renderSystemMessage(text) {
  const p = document.createElement("p");
  p.classList.add("system-message");
  p.textContent = text;
  messagesContainer.appendChild(p);
  scrollToBottom();
}

function scrollToBottom() {
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

scrollToBottom();
