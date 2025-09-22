"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Show scroll button if user scrolls up
  const handleScroll = () => {
    if (!chatContainerRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
    setShowScrollButton(!isNearBottom)
  }

  // Send user message and await AI reply
  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      // Send message to FastAPI bridge
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"
      const response = await fetch(`${BACKEND_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: userMessage.text }), // ✅ must match backend
      })

      if (!response.ok) throw new Error("Failed to fetch response")

      const data = await response.json()

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply ?? "Sorry, I couldn't generate a response.",
        isUser: false,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (err) {
      console.error("Error sending message:", err)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, something went wrong. Please try again.",
        isUser: false,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 relative">
      {/* Header */}
      <div className="p-6 border-b border-gray-700 text-center">
        <h1 className="text-2xl font-bold text-white">AgriCloud - Farmer's Assistant</h1>
      </div>

      {/* Chat container */}
      <div
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
            <div className="text-6xl mb-4">💬</div>
            <p className="text-lg">Start a conversation</p>
            <p className="text-sm">Type a message below to begin</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex w-full animate-slide-in",
              message.isUser ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[75%] rounded-2xl px-4 py-3 shadow-md break-words",
                message.isUser
                  ? "bg-white text-black border border-gray-300"
                  : "bg-gray-800 text-white border border-gray-700"
              )}
            >
              <p className="text-sm">{message.text}</p>
              <p className="text-xs mt-1 opacity-60 text-right">
                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Scroll-to-bottom button */}
      {showScrollButton && (
        <Button
          onClick={() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })}
          size="sm"
          className="fixed bottom-24 right-6 rounded-full w-10 h-10 p-0 bg-gray-700 hover:bg-gray-600 border border-gray-500"
        >
          <ArrowDown className="w-4 h-4 text-white" />
        </Button>
      )}

      {/* AI typing indicator above input */}
      {isLoading && (
        <div className="absolute bottom-20 left-0 w-full flex justify-center text-gray-400 text-sm animate-pulse">
          AI is typing...
        </div>
      )}

      {/* Input panel */}
      <div className="p-4 border-t border-gray-700 relative z-10 bg-gray-900">
        <div className="flex max-w-4xl mx-auto space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-gray-500 focus:ring-gray-500"
          />
          <Button
            onClick={sendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-blue-600 text-white hover:bg-blue-500 px-6"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
