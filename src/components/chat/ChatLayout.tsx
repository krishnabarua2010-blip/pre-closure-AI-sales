import { ReactNode } from "react";

export default function ChatLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex flex-col w-full max-w-3xl mx-auto bg-white shadow-xl">
        {children}
      </div>
    </div>
  );
} 
