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
  Lock,
  Mail,
  Phone,
  MapPin,
  Image as ImageIcon,
  Globe,
  Star,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Project, ContactMessage, AdminSettings } from "@shared/schema";
import { useLang } from "@/lib/i18n";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const queryClient = useQueryClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const settingsRef = doc(db, "settings", "admin");
      const settingsSnap = await getDoc(settingsRef);
      
      let correctCode = "admin123";
      
      if (settingsSnap.exists()) {
        correctCode = settingsSnap.data().adminCode;
      } else {
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
              <CardTitle>{t("admin_login_title") || "Login"}</CardTitle>
              <CardDescription>{t("admin_login_sub") || "Protected area for management"}</CardDescription>
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
                  {t("admin_login_btn") || "Unlock Dashboard"} <Unlock className="ml-2 w-4 h-4" />
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
            <h1 className="text-5xl font-display font-bold">{t("admin_panel") || "Admin"} <span className="text-primary">{t("admin_panel_accent") || "Panel"}</span></h1>
            <p className="text-muted-foreground mt-2">{t("admin_panel_sub") || "Manage your projects and communications"}</p>
          </div>
          <Button variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={handleLogout}>
            {t("admin_logout") || "Logout"}
          </Button>
        </div>

        <AdminTabs queryClient={queryClient} onUpdatePassword={(newPass) => setPassword(newPass)} />
      </div>
    </div>
  );
}

function AdminTabs({ queryClient, onUpdatePassword }: { queryClient: any; onUpdatePassword: (p: string) => void }) {
  // Fetch counts for badges
  const { data: messages } = useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() })) as ContactMessage[];
    }
  });

  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() })) as Project[];
    }
  });

  const unreadCount = messages?.filter(m => m.status === "unread").length ?? 0;

  return (
    <Tabs defaultValue="dashboard" className="space-y-8">
      <TabsList className="bg-white/5 border border-white/10 h-14 p-1 rounded-xl flex-wrap gap-1">
        <TabsTrigger value="dashboard" className="px-5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
          <LayoutDashboard className="w-4 h-4 mr-2" /> {t("admin_dashboard")}
        </TabsTrigger>
        <TabsTrigger value="projects" className="px-5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
          <FolderPlus className="w-4 h-4 mr-2" /> {t("admin_projects")}
        </TabsTrigger>
        <TabsTrigger value="messages" className="px-5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground relative">
          <MessageSquare className="w-4 h-4 mr-2" /> {t("admin_messages")}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="settings" className="px-5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
          <Settings className="w-4 h-4 mr-2" /> {t("admin_settings")}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="dashboard">
        <DashboardTab projects={projects ?? []} messages={messages ?? []} unreadCount={unreadCount} />
      </TabsContent>

      <TabsContent value="projects">
        <ProjectsTab projects={projects} queryClient={queryClient} />
      </TabsContent>

      <TabsContent value="messages">
        <MessagesTab messages={messages} queryClient={queryClient} />
      </TabsContent>

      <TabsContent value="settings">
        <SettingsTab onUpdatePassword={onUpdatePassword} />
      </TabsContent>
    </Tabs>
  );
}

// --- DASHBOARD ---
function DashboardTab({ projects, messages, unreadCount }: { projects: Project[]; messages: ContactMessage[]; unreadCount: number }) {
  const recentMessages = messages.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <Card className="glass border-white/10">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <FolderPlus className="w-7 h-7 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("admin_total_projects")}</p>
                <p className="text-4xl font-bold">{projects.length}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass border-white/10">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-500/10">
                <MessageSquare className="w-7 h-7 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("admin_total_messages")}</p>
                <p className="text-4xl font-bold">{messages.length}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glass border-primary/20 ring-1 ring-primary/30">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/20">
                <MessageSquare className="w-7 h-7 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("admin_unread_messages")}</p>
                <p className="text-4xl font-bold text-primary">{unreadCount}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Messages */}
      <div>
        <h2 className="text-2xl font-bold mb-4">{t("admin_recent_messages")}</h2>
        {recentMessages.length === 0 ? (
          <Card className="glass border-white/5">
            <CardContent className="py-12 text-center text-muted-foreground">No messages yet.</CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {recentMessages.map(msg => (
              <Card key={msg.id} className={`glass border-white/10 ${msg.status === "unread" ? "ring-1 ring-primary/40 bg-primary/5" : ""}`}>
                <CardContent className="p-4 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-2 ${msg.status === "unread" ? "bg-primary" : "bg-muted-foreground"}`} />
                    <div>
                      <p className="font-semibold">{msg.name} <span className="text-xs text-muted-foreground">— {msg.email}</span></p>
                      <p className="text-sm text-gray-400 line-clamp-1">{msg.message}</p>
                    </div>
                  </div>
                  <a href={`mailto:${msg.email}`} className="text-primary hover:text-cyan-400 transition-colors flex-shrink-0" title="Reply">
                    <Mail className="w-4 h-4" />
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// --- PROJECTS ---
function ProjectsTab({ projects, queryClient }: { projects?: Project[]; queryClient: any }) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteDoc(doc(db, "projects", id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project deleted successfully");
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t("admin_manage_portfolio")}</h2>
        <Button onClick={() => setIsAddOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" /> {t("admin_add_project")}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(projects ?? []).map((project) => (
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
              {project.isFavorite && (
                <div className="absolute top-2 right-2 bg-yellow-500/90 text-black p-1.5 rounded-full z-10 shadow-lg">
                  <Star className="w-4 h-4 fill-black" />
                </div>
              )}
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
        queryClient={queryClient}
      />
    </div>
  );
}

function ProjectDialog({ open, onOpenChange, initialData, queryClient }: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  initialData?: Project;
  queryClient: any;
}) {
  const [formData, setFormData] = useState<Partial<Project>>({
    title: "", description: "", type: "", image: "", link: "", isFavorite: false,
  });
  const [imgPreview, setImgPreview] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setImgPreview(initialData.image ?? "");
    } else {
      setFormData({ title: "", description: "", type: "", image: "", link: "", isFavorite: false });
      setImgPreview("");
    }
  }, [initialData, open]);

  const mutation = useMutation({
    mutationFn: async (data: Partial<Project>) => {
      if (initialData?.id) {
        await updateDoc(doc(db, "projects", initialData.id), { ...data, updatedAt: Timestamp.now() });
      } else {
        await addDoc(collection(db, "projects"), { ...data, createdAt: Timestamp.now(), updatedAt: Timestamp.now() });
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
          <DialogTitle>{initialData ? t("admin_edit_project") : t("admin_add_project")}</DialogTitle>
          <DialogDescription>Fill in project details. All fields are required.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Project Name" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Input value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} placeholder="e.g. E-commerce • 2025" required />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Image URL</label>
            <Input 
              value={formData.image} 
              onChange={e => { setFormData({...formData, image: e.target.value}); setImgPreview(e.target.value); }}
              placeholder="https://images.unsplash.com/..." 
              required 
            />
            {/* Image preview */}
            {imgPreview && (
              <div className="relative h-32 rounded-lg overflow-hidden bg-white/5 border border-white/10">
                <img 
                  src={imgPreview} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                  onError={() => setImgPreview("")}
                />
              </div>
            )}
            {!imgPreview && (
              <div className="h-32 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground gap-2">
                <ImageIcon className="w-5 h-5" /> <span className="text-sm">Image preview</span>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Project Link</label>
            <Input value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} placeholder="https://..." required />
          </div>
          <div className="flex items-center gap-2 py-2">
            <input 
              type="checkbox" 
              id="isFavorite" 
              checked={formData.isFavorite || false} 
              onChange={e => setFormData({...formData, isFavorite: e.target.checked})}
              className="w-4 h-4 rounded border-white/20 bg-white/5 accent-primary"
            />
            <label htmlFor="isFavorite" className="text-sm font-medium flex items-center gap-1 cursor-pointer">
              Mark as Favorite (Shows on Home Page) <Star className="w-4 h-4 text-yellow-500 fill-yellow-500/50" />
            </label>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Brief overview of the project..." className="h-24" required />
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

// --- MESSAGES ---
function MessagesTab({ messages, queryClient }: { messages?: ContactMessage[]; queryClient: any }) {
  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t("admin_user_inquiries")}</h2>
        <span className="text-sm text-muted-foreground">{messages?.length ?? 0} {t("admin_total_msg")}</span>
      </div>

      <div className="space-y-4">
        {(messages ?? []).map((msg) => (
          <Card key={msg.id} className={`glass border-white/10 transition-all ${msg.status === "unread" ? "ring-1 ring-primary/40 bg-primary/5" : ""}`}>
            <CardHeader className="flex flex-row justify-between items-start pb-2">
              <div className="flex gap-3 items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${msg.status === "unread" ? "bg-primary" : "bg-muted"}`}>
                  {msg.status === "unread" ? <MessageSquare className="w-4 h-4 text-black" /> : <CheckCircle2 className="w-4 h-4" />}
                </div>
                <div>
                  <CardTitle className="text-lg">{msg.name}</CardTitle>
                  <CardDescription>{msg.email}</CardDescription>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <a href={`mailto:${msg.email}?subject=Re: Your inquiry`}>
                  <Button size="sm" variant="outline" className="h-8 gap-1">
                    <Mail className="w-3 h-3" /> Reply
                  </Button>
                </a>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-8"
                  onClick={() => updateStatus.mutate({ id: msg.id!, status: msg.status === "unread" ? "read" : "unread" })}
                >
                  Mark as {msg.status === "unread" ? "Read" : "Unread"}
                </Button>
                <Button size="sm" variant="ghost" className="h-8 text-destructive hover:bg-destructive/10" onClick={() => deleteMutation.mutate(msg.id!)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 bg-black/20 p-3 rounded-lg border border-white/5 whitespace-pre-wrap">{msg.message}</p>
              <div className="mt-4 text-xs text-muted-foreground">
                Received: {msg.createdAt && (msg.createdAt as any).toDate ? (msg.createdAt as any).toDate().toLocaleString() : "Just now"}
              </div>
            </CardContent>
          </Card>
        ))}
        {(messages?.length ?? 0) === 0 && (
          <div className="text-center py-20 glass rounded-2xl border border-white/5">
            <MessageSquare className="w-12 h-12 text-muted mx-auto mb-4" />
            <p className="text-muted-foreground">No messages found yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

// --- SETTINGS ---
function SettingsTab({ onUpdatePassword }: { onUpdatePassword: (pass: string) => void }) {
  const [newCode, setNewCode] = useState("");
  const [isCodeLoading, setIsCodeLoading] = useState(false);

  // Contact info state
  const [siteInfo, setSiteInfo] = useState({
    location: "Algiers, Algeria",
    email: "novawebdv@gmail.com",
    phone: "+213 663 699 433",
    phoneRaw: "213663699433",
    whatsappMessage: "مرحباً، أريد الاستفسار عن خدمات تطوير المواقع",
  });
  const [isSiteLoading, setIsSiteLoading] = useState(false);

  // Load current site info
  useEffect(() => {
    const fetchSiteInfo = async () => {
      const snap = await getDoc(doc(db, "settings", "siteInfo"));
      if (snap.exists()) {
        setSiteInfo({ ...siteInfo, ...snap.data() });
      }
    };
    fetchSiteInfo();
  }, []);

  const handleUpdateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newCode.length < 4) {
      toast.error("Code must be at least 4 characters");
      return;
    }
    setIsCodeLoading(true);
    try {
      await setDoc(doc(db, "settings", "admin"), { adminCode: newCode, lastUpdated: Timestamp.now() });
      onUpdatePassword(newCode);
      setNewCode("");
      toast.success("Security code updated successfully");
    } catch {
      toast.error("Failed to update security code");
    } finally {
      setIsCodeLoading(false);
    }
  };

  const handleUpdateSiteInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSiteLoading(true);
    try {
      await setDoc(doc(db, "settings", "siteInfo"), { ...siteInfo, lastUpdated: Timestamp.now() });
      toast.success("Contact info updated successfully");
    } catch {
      toast.error("Failed to update contact info");
    } finally {
      setIsSiteLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-8">
      {/* Contact Info */}
      <Card className="glass border-white/10 shadow-2xl overflow-hidden">
        <div className="bg-cyan-500/20 h-2" />
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Globe className="w-6 h-6 text-primary" /> {t("admin_contact_page_info")}
          </CardTitle>
          <CardDescription>{t("admin_contact_page_desc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateSiteInfo} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Location
              </label>
              <Input
                value={siteInfo.location}
                onChange={e => setSiteInfo({ ...siteInfo, location: e.target.value })}
                placeholder="e.g. Algiers, Algeria"
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email
              </label>
              <Input
                type="email"
                value={siteInfo.email}
                onChange={e => setSiteInfo({ ...siteInfo, email: e.target.value })}
                placeholder="contact@example.com"
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Phone className="w-4 h-4" /> Phone (Display)
                </label>
                <Input
                  value={siteInfo.phone}
                  onChange={e => setSiteInfo({ ...siteInfo, phone: e.target.value })}
                  placeholder="+213 663 699 433"
                  className="bg-white/5 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Phone (Raw)</label>
                <Input
                  value={siteInfo.phoneRaw}
                  onChange={e => setSiteInfo({ ...siteInfo, phoneRaw: e.target.value })}
                  placeholder="213663699433"
                  className="bg-white/5 border-white/10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">WhatsApp Message</label>
              <Input
                value={siteInfo.whatsappMessage}
                onChange={e => setSiteInfo({ ...siteInfo, whatsappMessage: e.target.value })}
                placeholder="WhatsApp pre-filled message"
                className="bg-white/5 border-white/10"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 font-bold uppercase tracking-widest bg-cyan-600 hover:bg-cyan-500 text-white"
              disabled={isSiteLoading}
            >
              {isSiteLoading ? "Saving..." : "Save Contact Info"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Security Code */}
      <Card className="glass border-white/10 shadow-2xl overflow-hidden">
        <div className="bg-primary/20 h-2" />
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Lock className="w-6 h-6 text-primary" /> Security Settings
          </CardTitle>
          <CardDescription>Update your dashboard access credentials</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateCode} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">New Security Code</label>
              <Input
                type="text"
                placeholder="Enter new 4+ character code"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                className="bg-white/5 border-white/10 h-14 text-lg font-mono"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-14 text-lg font-bold uppercase tracking-widest bg-primary hover:bg-cyan-400 text-black"
              disabled={isCodeLoading}
            >
              {isCodeLoading ? "Updating..." : "Update Security Code"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="bg-white/5 p-4 flex gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
          <p className="text-xs text-gray-400">Security codes are stored securely in Firestore.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
