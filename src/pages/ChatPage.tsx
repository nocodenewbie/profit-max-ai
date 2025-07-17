import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { ChatInterface } from "@/components/chat/ChatInterface"

export default function ChatPage() {
  return (
    <DashboardLayout title="Chat com IA">
      <div className="animate-fade-in">
        <ChatInterface />
      </div>
    </DashboardLayout>
  )
}