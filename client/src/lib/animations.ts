import { Variants } from "framer-motion";

// Standard ease curve for professional and smooth feel
export const smoothEase = [0.22, 1, 0.36, 1];

// Basic fade in
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { duration: 0.6, ease: smoothEase } 
  },
};

// Fade in and slide up
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: smoothEase } 
  },
};

// Stagger container for list items
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

// Item for stagger container
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: smoothEase } 
  },
};

// Scale up on hover
export const hoverScale = {
  scale: 1.02,
  y: -5,
  transition: { duration: 0.3, ease: smoothEase }
};

// Slightly float animation for persistent elements
export const floatAnim: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};
