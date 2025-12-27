import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

const ADMIN_PASSWORD = "salaho55";

// Simple token generation (in production, use proper JWT)
function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // Admin login endpoint
  app.post("/api/admin/login", async (req, res) => {
    try {
      console.log("Login request received:", { body: req.body });
      const { password } = req.body;

      if (!password) {
        console.log("No password provided");
        return res.status(400).json({ error: "Password required" });
      }

      if (password !== ADMIN_PASSWORD) {
        console.log("Invalid password attempt");
        return res.status(401).json({ error: "Invalid password" });
      }

      const token = generateToken();
      console.log("Login successful, token generated");
      res.json({ success: true, token, message: "Logged in successfully" });
    } catch (error) {
      console.error("Error during login:", error);
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error("Error details:", errorMsg);
      res.status(500).json({ error: "Server error: " + errorMsg });
    }
  });

  // Contact message endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, message } = req.body;

      if (!name || !email || !message) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const savedMessage = await storage.saveContactMessage(name, email, message);
      res.json({
        success: true,
        message: "Message received! We'll be in touch soon.",
        messageId: savedMessage.id,
      });
    } catch (error) {
      console.error("Error saving contact message:", error);
      res.status(500).json({ error: "Failed to save message" });
    }
  });

  // Get all contact messages (for admin purposes)
  app.get("/api/contact/messages", async (req, res) => {
    try {
      const messages = await storage.getAllContactMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  // Delete a contact message
  app.delete("/api/contact/messages/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteContactMessage(id);
      res.json({ success: true, message: "Message deleted" });
    } catch (error) {
      console.error("Error deleting message:", error);
      res.status(500).json({ error: "Failed to delete message" });
    }
  });

  return httpServer;
}
