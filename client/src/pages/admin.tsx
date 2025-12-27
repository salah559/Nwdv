import { useEffect, useState } from "react";
import { Navbar } from "@/components/ui/navbar";
import { motion } from "framer-motion";
import { Trash2, Mail, User, MessageSquare, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export default function Admin() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/contact/messages");
      
      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.status}`);
      }
      
      const data = await response.json();
      setMessages(data);
      setError("");
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    
    try {
      const response = await fetch(`/api/contact/messages/${id}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        setMessages(messages.filter((msg) => msg.id !== id));
      }
    } catch (err) {
      console.error("Error deleting message:", err);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
              Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Messages</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              {messages.length} message{messages.length !== 1 ? "s" : ""} received
            </p>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-500/20 border border-red-500/50 rounded-2xl p-6 mb-8 text-red-400"
            >
              {error}
            </motion.div>
          )}

          {loading ? (
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-center py-12"
            >
              <p className="text-xl text-muted-foreground">Loading messages...</p>
            </motion.div>
          ) : messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-panel rounded-2xl border border-white/10 p-12 text-center"
            >
              <MessageSquare className="w-16 h-16 text-primary/50 mx-auto mb-4" />
              <p className="text-xl text-muted-foreground">No messages yet</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, idx) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="glass-panel rounded-2xl border border-white/10 p-6 hover:border-primary/30 transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <User className="w-5 h-5 text-primary" />
                        <h3 className="text-2xl font-display font-bold text-white">
                          {message.name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-3 text-muted-foreground mb-3">
                        <Mail className="w-4 h-4" />
                        <a
                          href={`mailto:${message.email}`}
                          className="hover:text-primary transition-colors"
                        >
                          {message.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Calendar className="w-4 h-4" />
                        {new Date(message.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteMessage(message.id)}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                      title="Delete message"
                    >
                      <Trash2 className="w-5 h-5 text-red-400 hover:text-red-300" />
                    </button>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {message.message}
                    </p>
                  </div>

                  <div className="text-xs text-muted-foreground mt-4">
                    ID: {message.id}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-12 text-center"
          >
            <Button
              onClick={fetchMessages}
              className="bg-primary text-black hover:bg-cyan-400 font-ui font-bold uppercase"
            >
              Refresh Messages
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
