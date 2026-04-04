import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  setDoc,
  getDoc,
  Timestamp 
} from "firebase/firestore";
import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  LayoutDashboard, 
  MessageSquare, 
  FolderPlus, 
  Settings, 
  Trash2, 
  ExternalLink, 
  Plus, 
  Edit2,
  CheckCircle2,
  Unlock,
  Lock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Project, ContactMessage, AdminSettings } from "@shared/schema";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const queryClient = useQueryClient();

  // Authentication Logic
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const settingsRef = doc(db, "settings", "admin");
      const settingsSnap = await getDoc(settingsRef);
      
      let correctCode = "admin123"; // Default code
      
      if (settingsSnap.exists()) {
        correctCode = settingsSnap.data().adminCode;
      } else {
        // Initialize default settings if not exists
        await setDoc(settingsRef, { adminCode: "admin123", lastUpdated: Timestamp.now() });
      }

      if (password === correctCode) {
        setIsAuthenticated(true);
        sessionStorage.setItem("isAdmin", "true");
        toast.success("Welcome back, Admin!");
      } else {
        toast.error("Invalid admin code");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Failed to connect to security server");
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem("isAdmin") === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("isAdmin");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="inline-flex p-4 rounded-2xl bg-primary/10 mb-4">
              <Lock className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-4xl font-display font-bold mb-2">Admin Access</h1>
            <p className="text-muted-foreground">Enter your security code to continue</p>
          </div>

          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Protected area for management</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="password"
                    placeholder="Enter security code"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/5 border-white/10"
                    autoFocus
                  />
                </div>
                <Button type="submit" className="w-full uppercase font-bold tracking-widest">
                  Unlock Dashboard <Unlock className="ml-2 w-4 h-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <div className="container mx-auto max-w-7xl pt-32 pb-20 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
            <h1 className="text-5xl font-display font-bold">Admin <span className="text-primary">Panel</span></h1>
            <p className="text-muted-foreground mt-2">Manage your projects and communications</p>
          </div>
          <Button variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <Tabs defaultValue="projects" className="space-y-8">
          <TabsList className="bg-white/5 border border-white/10 h-14 p-1 rounded-xl">
            <TabsTrigger value="projects" className="px-6 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <FolderPlus className="w-4 h-4 mr-2" /> Projects
            </TabsTrigger>
            <TabsTrigger value="messages" className="px-6 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <MessageSquare className="w-4 h-4 mr-2" /> Messages
            </TabsTrigger>
            <TabsTrigger value="settings" className="px-6 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Settings className="w-4 h-4 mr-2" /> Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-6">
            <ProjectsTab />
          </TabsContent>

          <TabsContent value="messages">
            <MessagesTab />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsTab onUpdatePassword={(newPass) => {
              setPassword(newPass);
            }} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function ProjectsTab() {
  const queryClient = useQueryClient();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Project[];
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteDoc(doc(db, "projects", id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project deleted successfully");
    }
  });

  if (isLoading) return <div className="text-center py-20">Loading projects...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Portfolio</h2>
        <Button onClick={() => setIsAddOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Add Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects?.map((project) => (
          <Card key={project.id} className="glass group border-white/10 overflow-hidden">
            <div className="relative h-40 bg-muted">
              <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button size="icon" variant="ghost" onClick={() => setEditingProject(project)}>
                  <Edit2 className="w-5 h-5 text-white" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(project.id!)}>
                  <Trash2 className="w-5 h-5 text-destructive" />
                </Button>
              </div>
            </div>
            <CardHeader className="p-4">
              <CardTitle className="text-lg">{project.title}</CardTitle>
              <CardDescription className="line-clamp-2">{project.description}</CardDescription>
            </CardHeader>
            <CardFooter className="p-4 pt-0 text-xs text-muted-foreground flex justify-between">
              <span>{project.type}</span>
              <a href={project.link} target="_blank" className="text-primary hover:underline flex items-center gap-1">
                View <ExternalLink className="w-3 h-3" />
              </a>
            </CardFooter>
          </Card>
        ))}
      </div>

      <ProjectDialog 
        open={isAddOpen || !!editingProject} 
        onOpenChange={(open) => {
          if (!open) {
            setIsAddOpen(false);
            setEditingProject(null);
          }
        }}
        initialData={editingProject || undefined}
      />
    </div>
  );
}

function ProjectDialog({ open, onOpenChange, initialData }: { open: boolean, onOpenChange: (open: boolean) => void, initialData?: Project }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Partial<Project>>({
    title: "",
    description: "",
    type: "",
    image: "",
    link: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ title: "", description: "", type: "", image: "", link: "" });
    }
  }, [initialData, open]);

  const mutation = useMutation({
    mutationFn: async (data: Partial<Project>) => {
      if (initialData?.id) {
        await updateDoc(doc(db, "projects", initialData.id), {
          ...data,
          updatedAt: Timestamp.now()
        });
      } else {
        await addDoc(collection(db, "projects"), {
          ...data,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success(initialData ? "Project updated" : "Project added");
      onOpenChange(false);
    },
    onError: (err) => {
      toast.error("Action failed: " + (err as any).message);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-white/20 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Project" : "Add New Project"}</DialogTitle>
          <DialogDescription>Fill in project details. All fields are required.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})}
                placeholder="Project Name"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Input 
                value={formData.type} 
                onChange={e => setFormData({...formData, type: e.target.value})}
                placeholder="e.g. E-commerce • 2024"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Image URL</label>
            <Input 
              value={formData.image} 
              onChange={e => setFormData({...formData, image: e.target.value})}
              placeholder="https://images.unsplash.com/..."
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Project Link</label>
            <Input 
              value={formData.link} 
              onChange={e => setFormData({...formData, link: e.target.value})}
              placeholder="https://..."
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="Brief overview of the project..."
              className="h-24"
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving..." : (initialData ? "Update Project" : "Save Project")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function MessagesTab() {
  const queryClient = useQueryClient();
  
  const { data: messages, isLoading } = useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ContactMessage[];
    }
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      await updateDoc(doc(db, "messages", id), { status });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["messages"] })
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteDoc(doc(db, "messages", id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      toast.success("Message deleted");
    }
  });

  if (isLoading) return <div className="text-center py-20">Loading messages...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Inquiries</h2>
        <span className="text-sm text-muted-foreground">{messages?.length} total messages</span>
      </div>

      <div className="space-y-4">
        {messages?.map((msg) => (
          <Card key={msg.id} className={`glass border-white/10 transition-all ${msg.status === 'unread' ? 'ring-1 ring-primary/40 bg-primary/5' : ''}`}>
            <CardHeader className="flex flex-row justify-between items-start pb-2">
              <div className="flex gap-3 items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${msg.status === 'unread' ? 'bg-primary' : 'bg-muted'}`}>
                  {msg.status === 'unread' ? <MessageSquare className="w-4 h-4 text-black" /> : <CheckCircle2 className="w-4 h-4" />}
                </div>
                <div>
                  <CardTitle className="text-lg">{msg.name}</CardTitle>
                  <CardDescription>{msg.email}</CardDescription>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-8"
                  onClick={() => updateStatus.mutate({ id: msg.id!, status: msg.status === 'unread' ? 'read' : 'unread' })}
                >
                  Mark as {msg.status === 'unread' ? 'Read' : 'Unread'}
                </Button>
                <Button size="sm" variant="ghost" className="h-8 text-destructive hover:bg-destructive/10" onClick={() => deleteMutation.mutate(msg.id!)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 bg-black/20 p-3 rounded-lg border border-white/5 whitespace-pre-wrap">{msg.message}</p>
              <div className="mt-4 text-xs text-muted-foreground">
                Received on: {msg.createdAt && (msg.createdAt as any).toDate ? (msg.createdAt as any).toDate().toLocaleString() : 'Just now'}
              </div>
            </CardContent>
          </Card>
        ))}
        {messages?.length === 0 && (
          <div className="text-center py-20 glass rounded-2xl border border-white/5">
            <MessageSquare className="w-12 h-12 text-muted mx-auto mb-4" />
            <p className="text-muted-foreground">No messages found yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SettingsTab({ onUpdatePassword }: { onUpdatePassword: (pass: string) => void }) {
  const [newCode, setNewCode] = useState("");
  const [currentCode, setCurrentCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCurrent = async () => {
      const settingsSnap = await getDoc(doc(db, "settings", "admin"));
      if (settingsSnap.exists()) {
        setCurrentCode(settingsSnap.data().adminCode);
      }
    };
    fetchCurrent();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newCode.length < 4) {
      toast.error("Code must be at least 4 characters long");
      return;
    }
    
    setIsLoading(true);
    try {
      await setDoc(doc(db, "settings", "admin"), {
        adminCode: newCode,
        lastUpdated: Timestamp.now()
      });
      onUpdatePassword(newCode);
      setCurrentCode(newCode);
      setNewCode("");
      toast.success("Security code updated successfully");
    } catch (error) {
      toast.error("Failed to update security code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <Card className="glass border-white/10 shadow-2xl overflow-hidden">
        <div className="bg-primary/20 h-2" />
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Lock className="w-6 h-6 text-primary" /> Security Settings
          </CardTitle>
          <CardDescription>Update your dashboard access credentials</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-6">
            <p className="text-sm text-gray-400">Current Security Code</p>
            <p className="text-2xl font-mono mt-1 tracking-widest text-primary">****</p>
            <p className="text-xs text-gray-500 mt-2 italic">Last updated: Automatic tracking enabled</p>
          </div>

          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">New Security Code</label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Enter new 4+ digit code"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="bg-white/5 border-white/10 h-14 text-lg font-mono focus:ring-primary"
                  required
                />
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full h-14 text-lg font-bold uppercase tracking-widest bg-primary hover:bg-cyan-400 text-black shadow-lg shadow-primary/20"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Security Code"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="bg-white/5 p-4 flex gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
          <p className="text-xs text-gray-400">Security codes are encrypted and stored securely in Firestore. Changing this code will require it for your next login.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
