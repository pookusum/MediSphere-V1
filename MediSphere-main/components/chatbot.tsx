"use client"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bot, Send, MessageCircle, X } from "lucide-react"

type Msg = { role: "user" | "assistant"; content: string }

const websiteKnowledge = {

  "greeting": "Hello! 👋 Welcome to MediSphere — your AI-powered healthcare assistant. I can help you find nearby hospitals, check real-time ICU and bed availability, explore emergency services, understand our AI recommendations, or guide hospitals for onboarding. How can I assist you today?",

  "finding hospitals": "MediSphere helps you discover nearby hospitals using smart AI-based search. You can filter by city, hospital type (Government/Private), specialization, ICU availability, ventilator support, and emergency readiness. Results are ranked based on availability score, distance, and response capability.",

  "bed availability": "MediSphere provides real-time bed availability including General Beds, ICU Beds, and Ventilators. Our AI continuously analyzes hospital updates and crowd trends to predict availability and help you avoid long waiting times.",

  "emergency": "In emergency situations, activate Emergency Mode. MediSphere instantly prioritizes hospitals with available ICU beds, trauma care units, and emergency services. It also provides real-time traffic-aware routing to minimize travel time.",

  "hospital onboarding": "Hospitals can partner with MediSphere by submitting the onboarding form in the Contact section. Required details include hospital name, city, administrator email, available facilities, and system integration details. Our team verifies and activates accounts within 24–48 hours.",

  "features": "MediSphere offers: Real-time bed tracking, ICU & ventilator monitoring, AI-based hospital ranking, Smart map routing with traffic awareness, Emergency prioritization system, Blood bank availability tracking, Hospital admin dashboard, and Secure data synchronization.",

  "ai predictions": "Our AI system analyzes live hospital data, historical crowd patterns, peak-hour trends, and specialization demand. It predicts crowd density, recommends optimal hospitals, prioritizes emergency cases, and helps reduce response delays.",

  "contact": "You can reach MediSphere via the Contact & Feedback section. Patients can submit queries through the support form, and hospitals can apply through the partnership onboarding form. Our response time is typically within 24 hours.",

  "24/7": "Yes, MediSphere operates 24/7. Our system continuously monitors hospital data feeds and updates bed status, ICU availability, and emergency capacity in real time.",

  "how it works": "Step 1: Enter your location or enable GPS. Step 2: Select hospital type and required specialization. Step 3: View AI-powered availability predictions. Step 4: Compare hospitals based on availability score and travel time. Step 5: Navigate instantly using smart routing.",

  "pricing": "MediSphere is completely free for patients. Hospitals can subscribe to advanced analytics, AI monitoring tools, and dashboard management features through flexible subscription plans based on hospital size and capacity.",

  "data accuracy": "MediSphere uses direct hospital-admin updates, secure cloud synchronization, and machine learning models to maintain high data accuracy. Real-time updates and predictive analytics ensure reliable decision-making support.",

  "mobile app": "MediSphere is currently available as a responsive web application optimized for mobile and desktop. A dedicated Android and iOS mobile application is under development with enhanced emergency support features.",

  "blood bank": "You can check real-time blood availability by selecting your required blood group. MediSphere displays nearby hospitals where the selected blood type is currently available.",

  "privacy": "We prioritize data security. MediSphere uses encrypted communication protocols and secure authentication systems. Personal medical records are not stored without user consent.",

  "hospital ranking": "Hospitals are ranked based on Availability Score, Emergency Readiness Score, Specialization Match, Distance, and Estimated Travel Time.",

  "technology": "MediSphere is built using AI algorithms, real-time cloud databases, smart routing engines, and predictive healthcare analytics to create a seamless healthcare navigation experience.",

  "future updates": "Upcoming features include ambulance integration, telemedicine consultation support, predictive ICU demand forecasting, and government health system integration."

}

function getAnswer(question: string): string {
  const lowerQuestion = question.toLowerCase()
  
  // Check for greetings first
  if (lowerQuestion.includes('hello') || lowerQuestion.includes('hi') || lowerQuestion.includes('hey') || lowerQuestion.includes('greetings') || lowerQuestion.includes('good morning') || lowerQuestion.includes('good afternoon') || lowerQuestion.includes('good evening')) {
    return websiteKnowledge["greeting"]
  }
  
  // Check for keywords and return relevant answers
  for (const [key, answer] of Object.entries(websiteKnowledge)) {
    const keywords = key.split(' ')
    if (keywords.every(keyword => lowerQuestion.includes(keyword))) {
      return answer
    }
  }
  
  // Check for partial matches
  if (lowerQuestion.includes('hospital') || lowerQuestion.includes('find')) {
    return websiteKnowledge["finding hospitals"]
  }
  if (lowerQuestion.includes('bed') || lowerQuestion.includes('availability')) {
    return websiteKnowledge["bed availability"]
  }
  if (lowerQuestion.includes('emergency') || lowerQuestion.includes('urgent')) {
    return websiteKnowledge["emergency"]
  }
  if (lowerQuestion.includes('onboard') || lowerQuestion.includes('join') || lowerQuestion.includes('partner')) {
    return websiteKnowledge["hospital onboarding"]
  }
  if (lowerQuestion.includes('feature') || lowerQuestion.includes('what')) {
    return websiteKnowledge["features"]
  }
  if (lowerQuestion.includes('ai') || lowerQuestion.includes('prediction')) {
    return websiteKnowledge["ai predictions"]
  }
  if (lowerQuestion.includes('contact') || lowerQuestion.includes('support') || lowerQuestion.includes('help')) {
    return websiteKnowledge["contact"]
  }
  if (lowerQuestion.includes('price') || lowerQuestion.includes('cost') || lowerQuestion.includes('free')) {
    return websiteKnowledge["pricing"]
  }
  if (lowerQuestion.includes('data') || lowerQuestion.includes('accurate')) {
    return websiteKnowledge["data accuracy"]
  }
  if (lowerQuestion.includes('mobile') || lowerQuestion.includes('app')) {
    return websiteKnowledge["mobile app"]
  }
  
  return "I can help you with information about finding hospitals, bed availability, emergency services, hospital onboarding, features, AI predictions, contact details, pricing, and more. Could you be more specific about what you'd like to know?"
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "👋 Welcome to MediSphere! I'm MediBot, your AI healthcare assistant. I'm here to help you find hospitals, check bed availability, understand emergency services, or answer any questions about our platform. How can I assist you today?" },
  ])
  const [input, setInput] = useState("")

  function ask() {
    if (!input.trim()) return
    const user = input.trim()
    setMessages((m) => [...m, { role: "user", content: user }])
    setInput("")
    
    // Simulate typing delay for better UX
    setTimeout(() => {
      const answer = getAnswer(user)
      setMessages((m) => [...m, { role: "assistant", content: answer }])
    }, 500)
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 rounded-full w-14 h-14 p-0"
          aria-label="Open chat"
        >
          <MessageCircle className="size-6" />
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)]">
      <Card className="shadow-2xl border-2">
        <div className="flex items-center justify-between p-4 border-b bg-primary/5">
          <div className="flex items-center gap-2">
            <Bot className="size-5 text-primary" />
            <h3 className="font-semibold">MediBot Assistant</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            aria-label="Close chat"
          >
            <X className="size-4" />
          </Button>
        </div>
        
        <div className="max-h-96 space-y-3 overflow-y-auto p-4">
          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
              <span
                className={`inline-block rounded-lg px-3 py-2 text-sm max-w-[80%] ${
                  m.role === "user" 
                    ? "bg-primary text-primary-foreground ml-auto" 
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {m.content}
              </span>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              placeholder="Ask about MediSphere..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && ask()}
              aria-label="Ask the assistant"
              className="flex-1"
            />
            <Button 
              onClick={ask} 
              className="bg-primary text-primary-foreground hover:opacity-90 px-3"
              aria-label="Send"
              disabled={!input.trim()}
            >
              <Send className="size-4" />
            </Button>
          </div>
          
          <div className="mt-2 flex flex-wrap gap-1">
            {["Hello!", "Find hospitals", "Bed availability", "Emergency", "Features"].map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                size="sm"
                onClick={() => setInput(suggestion)}
                className="text-xs h-6 px-2"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
