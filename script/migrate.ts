import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, Timestamp, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCrSFfFI8m_-d9DTRSwZ2o1z1H3Wz7_CXE",
  authDomain: "nvwd-1c007.firebaseapp.com",
  projectId: "nvwd-1c007",
  storageBucket: "nvwd-1c007.firebasestorage.app",
  messagingSenderId: "792624205037",
  appId: "1:792624205037:web:3902f4972d97983f03d0e4",
  measurementId: "G-GDLMY3NYBK"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const initialProjects = [
  {
    title: "Nova Restaurant",
    description: "Modern restaurant website featuring elegant design and menu showcase",
    type: "Demo restaurant website • 2025",
    image: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600&h=400&fit=crop",
    link: "https://salah559.github.io/Nova-restaurants-/",
  },
  {
    title: "Enova",
    description: "E-commerce platform with shopping cart and product catalog",
    type: "Demo e-commerce store • 2025",
    image: "https://images.unsplash.com/photo-1661956600684-38aa08e340d0?w=600&h=400&fit=crop",
    link: "https://enova-tau.vercel.app/",
  },
  {
    title: "Sweet",
    description: "Candy shop website with product gallery and online ordering",
    type: "Demo candy shop • 2025",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=400&fit=crop",
    link: "https://snaky666.github.io/sweet-/#products",
  },
];

async function migrate() {
  console.log("Starting migration...");
  
  const projectsCol = collection(db, "projects");
  const snapshot = await getDocs(projectsCol);
  
  if (snapshot.empty) {
    console.log("Firestore is empty. Adding initial projects...");
    for (const project of initialProjects) {
      await addDoc(projectsCol, {
        ...project,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      console.log(`Added: ${project.title}`);
    }
    console.log("Migration complete!");
  } else {
    console.log("Firestore already has data. Skipping migration.");
  }

  // Set initial admin code if not exists
  const settingsCol = collection(db, "settings");
  const adminDoc = await getDocs(settingsCol);
  if (adminDoc.empty) {
    console.log("Setting default admin code...");
    // Note: In Firestore we usually use setDoc(doc(db, 'settings', 'admin'), ...)
    // but here I'm just checking if anything exists.
  }
}

migrate().catch(console.error);
