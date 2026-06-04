const mongoose = require("mongoose");

// Conexión MongoDB
async function initDB() {
  try {
    const uri =
      process.env.MONGO_URI ||
      "mongodb://localhost:27017/hackchat_db";

    await mongoose.connect(uri);

    console.log("✅ Base de datos MongoDB inicializada correctamente");
  } catch (err) {
    console.error("❌ Error inicializando la base de datos:", err.message);
    throw err;
  }
}

// Schema de usuarios
const userSchema = new mongoose.Schema({
  google_id: {
    type: String,
    required: true,
    unique: true,
  },
  display_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  avatar: String,
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// Schema de mensajes
const messageSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  room: {
    type: String,
    default: "general",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);
const Message = mongoose.model("Message", messageSchema);

module.exports = {
  mongoose,
  initDB,
  User,
  Message,
};