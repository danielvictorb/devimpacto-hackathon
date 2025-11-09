import type { Metadata } from "next";
import "./globals.css";
import { FloatingChatButton } from "@/components/floating-chat-button";

export const metadata: Metadata = {
  title: "SabiaR - IA de Reconhecimento para Educação",
  description:
    "Transforme a correção de provas em um plano de ação pedagógico. O SabiaR usa IA de Reconhecimento para corrigir provas dissertativas, gerar insights e criar feedbacks personalizados.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        {children}
        <FloatingChatButton />
      </body>
    </html>
  );
}
