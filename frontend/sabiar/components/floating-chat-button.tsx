"use client";

import { useState } from "react";
import { ChatBot } from "./chatbot";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import Image from "next/image";

export function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg hover:scale-110 transition-transform duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300"
        aria-label="Abrir chat"
      >
        <Image
          src="/sab.png"
          alt="SABIAR Chat"
          width={64}
          height={64}
          className="rounded-full"
        />
      </button>

      {/* Chat drawer */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-full sm:w-[540px] p-0 flex flex-col">
          <SheetHeader className="px-6 py-4 border-b">
            <SheetTitle className="flex items-center gap-2">
              <Image
                src="/sab.png"
                alt="SABIAR"
                width={32}
                height={32}
                className="rounded-full"
              />
              Sabiá
            </SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-hidden p-4">
            <ChatBot />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
