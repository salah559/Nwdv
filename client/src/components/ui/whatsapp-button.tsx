import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/213663699433"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 right-4 z-[9998] w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-[0_4px_15px_rgba(37,211,102,0.4)] hover:scale-110 active:scale-95 transition-all md:hidden border border-white/10"
      title="Chat on WhatsApp"
    >
      <MessageCircle className="w-8 h-8 fill-current" />
      {/* Pulse effect */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25" />
    </a>
  );
}
