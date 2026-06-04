/* =============================================
   HackChat — Cliente Socket.io
   ============================================= */

const socket = io();

const { id: userId, name: username, avatar } = window.CURRENT_USER;
let currentRoom = window.CURRENT_ROOM || "general";

const messagesEl    = document.getElementById("messages");
const chatForm      = document.getElementById("chat-form");
const messageInput  = document.getElementById("message-input");
const onlineUsersEl = document.getElementById("online-users");
const onlineCountEl = document.getElementById("online-count");
const roomLabelEl   = document.getElementById("room-label");
const typingEl      = document.getElementById("typing-indicator");
const roomItems     = document.querySelectorAll(".room-item");

let typingTimeout;

// ── CONECTAR / UNIRSE A LA SALA ─────────────
socket.emit("join-room", { username, avatar, userId, room: currentRoom });

// Cargar historial de mensajes al conectar
loadMessages(currentRoom);

// ── CAMBIAR DE SALA ─────────────────────────
roomItems.forEach((item) => {
  item.addEventListener("click", () => {
    const newRoom = item.dataset.room;
    if (newRoom === currentRoom) return;

    roomItems.forEach((r) => r.classList.remove("active"));
    item.classList.add("active");

    currentRoom = newRoom;
    roomLabelEl.textContent = currentRoom;
    messagesEl.innerHTML = '<div class="loading-msgs">Cargando mensajes...</div>';

    socket.emit("join-room", { username, avatar, userId, room: currentRoom });
    loadMessages(currentRoom);
  });
});

// ── ENVIAR MENSAJE ───────────────────────────
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const content = messageInput.value.trim();
  if (!content) return;

  socket.emit("send-message", { content, room: currentRoom });
  socket.emit("stop-typing", { room: currentRoom });
  messageInput.value = "";
  clearTimeout(typingTimeout);
});

// ── INDICADOR DE ESCRITURA ───────────────────
messageInput.addEventListener("input", () => {
  socket.emit("typing", { room: currentRoom });
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    socket.emit("stop-typing", { room: currentRoom });
  }, 1500);
});

// ── EVENTOS SOCKET ───────────────────────────

// Nuevo mensaje entrante
socket.on("new-message", (msg) => {
  appendMessage(msg);
  scrollToBottom();
});

// Alguien se unió
socket.on("user-joined", ({ username: who, message }) => {
  appendSystem(message);
  scrollToBottom();
});

// Alguien salió
socket.on("user-left", ({ message }) => {
  appendSystem(message);
  scrollToBottom();
});

// Lista de usuarios en línea
socket.on("online-users", (users) => {
  onlineCountEl.textContent = users.length;
  onlineUsersEl.innerHTML = users
    .map((u) => {
      const avatarSrc = u.avatar
        ? u.avatar
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(u.username)}&background=1a1a2e&color=e94560`;
      return `
        <li class="online-user-item">
          <span class="online-dot"></span>
          <img src="${avatarSrc}" alt="" class="online-avatar" />
          <span>${escapeHtml(u.username)}</span>
        </li>`;
    })
    .join("");
});

// Indicador de escritura
socket.on("user-typing", ({ username: who }) => {
  typingEl.textContent = `${escapeHtml(who)} está escribiendo...`;
});

socket.on("user-stop-typing", () => {
  typingEl.textContent = "";
});

// Error
socket.on("error", ({ message }) => {
  appendSystem(`⚠️ ${message}`);
});

// ── HELPERS ──────────────────────────────────

function appendMessage(msg) {
  // Limpiar el loading placeholder si existe
  const loading = messagesEl.querySelector(".loading-msgs");
  if (loading) loading.remove();

  const isOwn = msg.username === username;
  const time  = formatTime(msg.timestamp);
  const avatarSrc = msg.avatar
    ? msg.avatar
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.username)}&background=1a1a2e&color=e94560`;

  const div = document.createElement("div");
  div.className = `message${isOwn ? " own" : ""}`;
  div.innerHTML = `
    <img src="${avatarSrc}" alt="" class="msg-avatar" />
    <div class="msg-body">
      <div class="msg-header">
        <span class="msg-username">${escapeHtml(msg.username)}</span>
        <span class="msg-time">${time}</span>
      </div>
      <div class="msg-bubble">${escapeHtml(msg.content)}</div>
    </div>`;
  messagesEl.appendChild(div);
}

function appendSystem(text) {
  const div = document.createElement("div");
  div.className = "system-msg";
  div.textContent = text;
  messagesEl.appendChild(div);
}

function scrollToBottom() {
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function loadMessages(room) {
  try {
    const res  = await fetch(`/chat/api/messages?room=${room}&limit=50`);
    const data = await res.json();
    messagesEl.innerHTML = "";
    if (data.messages.length === 0) {
      messagesEl.innerHTML = '<div class="loading-msgs">No hay mensajes aún. ¡Sé el primero! 🎉</div>';
      return;
    }
    data.messages.forEach(appendMessage);
    scrollToBottom();
  } catch (err) {
    messagesEl.innerHTML = '<div class="loading-msgs">Error cargando mensajes.</div>';
  }
}
