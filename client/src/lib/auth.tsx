import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { auth, db } from "./firebase";
import {
  UserProfile,
  UserSubscription,
  RESERVED_USERNAMES,
  usernameRegex,
  SocialLink,
} from "@shared/saas-schema";

const DEFAULT_SOCIAL_LINKS: SocialLink[] = [
  { id: "1", platform: "github", title: "GitHub", url: "https://github.com", enabled: true, order: 0 },
  { id: "2", platform: "linkedin", title: "LinkedIn", url: "https://linkedin.com", enabled: true, order: 1 },
  { id: "3", platform: "instagram", title: "Instagram", url: "https://instagram.com", enabled: true, order: 2 },
  { id: "4", platform: "whatsapp", title: "WhatsApp", url: "https://wa.me/213660000000", enabled: true, order: 3 },
  { id: "5", platform: "website", title: "Personal Website", url: "https://novawebdv.com", enabled: false, order: 4 },
];

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  subscription: UserSubscription | null;
  unlockedTemplates: string[];
  loading: boolean;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, pass: string, fullName: string, username: string) => Promise<void>;
  signIn: (email: string, pass: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshUserData: () => Promise<void>;
  updateUserProfileData: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [unlockedTemplates, setUnlockedTemplates] = useState<string[]>([
    "modern-minimalist",
    "developer-profile",
    "professional-profile",
  ]);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (uid: string) => {
    try {
      // 1. Fetch Profile
      const profRef = doc(db, "profiles", uid);
      const profSnap = await getDoc(profRef);
      if (profSnap.exists()) {
        setUserProfile(profSnap.data() as UserProfile);
      } else {
        setUserProfile(null);
      }

      // 2. Fetch Subscription
      const subRef = doc(db, "subscriptions", uid);
      const subSnap = await getDoc(subRef);
      if (subSnap.exists()) {
        const subData = subSnap.data() as UserSubscription;
        // Check if trial has expired automatically
        const now = Date.now();
        const trialEnd = subData.trialEndsAt?.toMillis ? subData.trialEndsAt.toMillis() : (subData.trialEndsAt?.seconds ? subData.trialEndsAt.seconds * 1000 : 0);
        const periodEnd = subData.currentPeriodEnd?.toMillis ? subData.currentPeriodEnd.toMillis() : (subData.currentPeriodEnd?.seconds ? subData.currentPeriodEnd.seconds * 1000 : 0);

        if (subData.status === "trial" && trialEnd > 0 && now > trialEnd) {
          subData.status = "expired";
        } else if (subData.status === "active" && periodEnd > 0 && now > periodEnd) {
          subData.status = "expired";
        }

        setSubscription(subData);
      } else {
        setSubscription(null);
      }

      // 3. Fetch Unlocked Purchases
      const pQuery = query(collection(db, "purchases"), where("userId", "==", uid), where("status", "==", "completed"));
      const pSnap = await getDocs(pQuery);
      const purchased = pSnap.docs.map((d) => d.data().templateId as string);
      
      setUnlockedTemplates([
        "modern-minimalist",
        "developer-profile",
        "professional-profile",
        ...purchased,
      ]);
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchUserData(user.uid);
      } else {
        setUserProfile(null);
        setSubscription(null);
        setUnlockedTemplates(["modern-minimalist", "developer-profile", "professional-profile"]);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    const res = await signInWithPopup(auth, provider);
    const user = res.user;

    // Check if profile exists
    const profRef = doc(db, "profiles", user.uid);
    const profSnap = await getDoc(profRef);

    if (!profSnap.exists()) {
      // Generate clean unique username
      const base = user.email ? user.email.split("@")[0] : (user.displayName || "user");
      let chosenUsername = base.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 15);
      if (chosenUsername.length < 3) chosenUsername = "user" + Math.floor(100 + Math.random() * 900);

      if ((RESERVED_USERNAMES as readonly string[]).includes(chosenUsername)) {
        chosenUsername = `${chosenUsername}${Math.floor(10 + Math.random() * 90)}`;
      }

      // Verify availability in usernames collection
      let unameRef = doc(db, "usernames", chosenUsername);
      let unameSnap = await getDoc(unameRef);
      let attempts = 0;
      while (unameSnap.exists() && attempts < 10) {
        chosenUsername = `${chosenUsername.slice(0, 12)}${Math.floor(10 + Math.random() * 90)}`;
        unameRef = doc(db, "usernames", chosenUsername);
        unameSnap = await getDoc(unameRef);
        attempts++;
      }

      // Reserve username
      await setDoc(unameRef, {
        userId: user.uid,
        username: chosenUsername,
        createdAt: Timestamp.now(),
      });

      // 7-day free trial dates
      const now = new Date();
      const trialEndsAtDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      const subData: UserSubscription = {
        userId: user.uid,
        status: "trial",
        planId: "trial",
        trialStartsAt: Timestamp.fromDate(now),
        trialEndsAt: Timestamp.fromDate(trialEndsAtDate),
        currentPeriodEnd: Timestamp.fromDate(trialEndsAtDate),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
      await setDoc(doc(db, "subscriptions", user.uid), subData);

      // Create new profile with Google avatar & name
      const newProfile: UserProfile = {
        userId: user.uid,
        username: chosenUsername,
        fullName: user.displayName || chosenUsername,
        jobTitle: "Digital Creator",
        bio: "Welcome to my official digital hub! Connect with me across platforms.",
        avatarUrl: user.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        coverUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
        location: "Algeria",
        email: user.email || "",
        phone: "",
        whatsapp: "",
        socialLinks: DEFAULT_SOCIAL_LINKS,
        templateId: "modern-minimalist",
        customTheme: {
          primaryColor: "#06FFF0",
          backgroundColor: "#0b0f17",
          fontFamily: "Inter",
          backgroundStyle: "mesh",
        },
        isPublished: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
      await setDoc(profRef, newProfile);

      setUserProfile(newProfile);
      setSubscription(subData);
    } else {
      await fetchUserData(user.uid);
    }

    setCurrentUser(user);
  };

  const signUp = async (email: string, pass: string, fullName: string, rawUsername: string) => {
    const cleanUsername = rawUsername.trim().toLowerCase();

    // 1. Validation
    if (!usernameRegex.test(cleanUsername)) {
      throw new Error("Username must be 3-20 characters long and contain only letters, numbers, hyphens or underscores.");
    }

    if ((RESERVED_USERNAMES as readonly string[]).includes(cleanUsername)) {
      throw new Error(`The username '${cleanUsername}' is reserved by Novaweb. Please pick another one.`);
    }

    // 2. Check availability
    const unameRef = doc(db, "usernames", cleanUsername);
    const unameSnap = await getDoc(unameRef);
    if (unameSnap.exists()) {
      throw new Error(`The username '${cleanUsername}' is already taken.`);
    }

    // 3. Firebase Auth User
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    const uid = res.user.uid;

    await updateProfile(res.user, { displayName: fullName });

    // 4. Reserve username
    await setDoc(unameRef, {
      userId: uid,
      username: cleanUsername,
      createdAt: Timestamp.now(),
    });

    // 5. Default 7-day trial dates
    const now = new Date();
    const trialEndsAtDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days exact

    // 6. Subscription record
    const subData: UserSubscription = {
      userId: uid,
      status: "trial",
      planId: "trial",
      trialStartsAt: Timestamp.fromDate(now),
      trialEndsAt: Timestamp.fromDate(trialEndsAtDate),
      currentPeriodEnd: Timestamp.fromDate(trialEndsAtDate),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    await setDoc(doc(db, "subscriptions", uid), subData);

    // 7. Profile record
    const newProfile: UserProfile = {
      userId: uid,
      username: cleanUsername,
      fullName: fullName,
      jobTitle: "Digital Creator",
      bio: "Welcome to my official digital hub! Connect with me across platforms.",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      coverUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
      location: "Algiers, Algeria",
      email: email,
      phone: "",
      whatsapp: "",
      socialLinks: DEFAULT_SOCIAL_LINKS,
      templateId: "modern-minimalist",
      customTheme: {
        primaryColor: "#06FFF0",
        backgroundColor: "#0b0f17",
        fontFamily: "Inter",
        backgroundStyle: "mesh",
      },
      isPublished: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    await setDoc(doc(db, "profiles", uid), newProfile);

    // Refresh context
    setCurrentUser(res.user);
    setUserProfile(newProfile);
    setSubscription(subData);
  };

  const signIn = async (email: string, pass: string) => {
    const res = await signInWithEmailAndPassword(auth, email, pass);
    await fetchUserData(res.user.uid);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setCurrentUser(null);
    setUserProfile(null);
    setSubscription(null);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const refreshUserData = async () => {
    if (currentUser) {
      await fetchUserData(currentUser.uid);
    }
  };

  const updateUserProfileData = async (data: Partial<UserProfile>) => {
    if (!currentUser) throw new Error("User not authenticated");
    const docRef = doc(db, "profiles", currentUser.uid);
    const updated = {
      ...data,
      updatedAt: Timestamp.now(),
    };
    await setDoc(docRef, updated, { merge: true });
    setUserProfile((prev) => (prev ? { ...prev, ...updated } : null));
  };

  const isAdmin = currentUser?.email?.toLowerCase() === "novawebdv@gmail.com" || 
                  currentUser?.email?.toLowerCase().includes("admin@novawebdv.com");

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        subscription,
        unlockedTemplates,
        loading,
        isAdmin,
        signInWithGoogle,
        signUp,
        signIn,
        signOut,
        resetPassword,
        refreshUserData,
        updateUserProfileData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
