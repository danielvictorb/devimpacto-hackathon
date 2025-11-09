"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ChatBotMocked } from "./chatbot-mocked";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import Image from "next/image";
import { useChat } from "./chat-context";

export function FloatingChatButton() {
  const { isOpen, initialMessage, openChat, closeChat } = useChat();
  const pathname = usePathname();

  // Não mostrar o chat na página inicial
  if (pathname === "/") {
    return null;
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => openChat()}
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
      <Sheet open={isOpen} onOpenChange={closeChat}>
        <SheetContent
          side="right"
          className="w-full sm:w-[540px] p-0 flex flex-col"
        >
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
          <div className="flex-1 overflow-hidden">
            <ChatBotMocked key={initialMessage || 'default'} initialMessage={initialMessage} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
