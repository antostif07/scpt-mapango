"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Search, Send, Paperclip, MoreVertical, Phone, 
  Video, Smile, Check, CheckCheck 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Channel, Message } from "@/lib/types";

export default function ChatInterface({ channels }: { channels: Channel[] }) {
  const [activeChannelId, setActiveChannelId] = useState<number | null>(channels[0]?.id || null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll vers le bas quand un message arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Simulation d'envoi de message
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = {
        id: Date.now(),
        body: `<p>${inputText}</p>`,
        is_me: true,
        date: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    } as Message;

    setMessages([...messages, newMessage]);
    setInputText("");
  };

  // Trouver le channel actif pour le header
  const activeChannel = channels.find(c => c.id === activeChannelId) || { name: "Sélectionnez une discussion", image: null };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-white overflow-hidden">
      
      {/* --- SIDEBAR GAUCHE (Liste des Channels) --- */}
      <div className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/50">
        
        {/* Header Recherche */}
        <div className="p-4 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Messages</h2>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                    type="text" 
                    placeholder="Rechercher une conversation..." 
                    className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                />
            </div>
        </div>

        {/* Liste des conversations */}
        <div className="flex-1 overflow-y-auto">
            {channels.length > 0 ? (
                channels.map(channel => (
                    <div 
                        key={channel.id}
                        onClick={() => setActiveChannelId(channel.id)}
                        className={`flex items-center gap-3 p-4 cursor-pointer transition-colors border-l-4 ${
                            activeChannelId === channel.id 
                            ? "bg-white border-blue-600 shadow-sm" 
                            : "border-transparent hover:bg-slate-100"
                        }`}
                    >
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                                {channel.image ? (
                                    <img src={`data:image/png;base64,${channel.image}`} alt={channel.name} className="w-full h-full object-cover"/>
                                ) : (
                                    <span className="font-bold text-slate-500">{channel.name.substring(0,2).toUpperCase()}</span>
                                )}
                            </div>
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline mb-1">
                                <h3 className={`text-sm font-semibold truncate ${activeChannelId === channel.id ? "text-slate-900" : "text-slate-700"}`}>
                                    {channel.name}
                                </h3>
                                <span className="text-[10px] text-slate-400">10:30</span>
                            </div>
                            <p className="text-xs text-slate-500 truncate">
                                {channel.description || "Cliquez pour lire les messages..."}
                            </p>
                        </div>
                    </div>
                ))
            ) : (
                <div className="p-8 text-center text-slate-400 text-sm">
                    Aucune conversation trouvée.
                </div>
            )}
        </div>
      </div>

      {/* --- ZONE PRINCIPALE (Chat) --- */}
      <div className="flex-1 flex flex-col bg-[#FDFDFD] relative">
         {/* Background pattern subtil style WhatsApp */}
         <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{backgroundImage: "radial-gradient(#444 1px, transparent 1px)", backgroundSize: "20px 20px"}}></div>

         {/* Chat Header */}
         <div className="h-16 border-b border-slate-100 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 z-10">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                    {activeChannel.name.substring(0,1)}
                </div>
                <div>
                    <h3 className="font-bold text-slate-800">{activeChannel.name}</h3>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <p className="text-xs text-slate-500">En ligne</p>
                    </div>
                </div>
            </div>
            <div className="flex gap-2 text-slate-400">
                <button className="p-2 hover:bg-slate-50 rounded-full transition-colors"><Phone size={20}/></button>
                <button className="p-2 hover:bg-slate-50 rounded-full transition-colors"><Video size={20}/></button>
                <button className="p-2 hover:bg-slate-50 rounded-full transition-colors"><MoreVertical size={20}/></button>
            </div>
         </div>

         {/* Messages Area */}
         <div className="flex-1 overflow-y-auto p-6 space-y-4 z-0">
            {messages.map((msg, idx) => (
                <motion.div 
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.is_me ? "justify-end" : "justify-start"}`}
                >
                    <div className={`
                        max-w-[70%] px-4 py-3 rounded-2xl shadow-sm relative text-sm leading-relaxed
                        ${msg.is_me 
                            ? "bg-blue-600 text-white rounded-br-none" 
                            : "bg-white border border-slate-100 text-slate-800 rounded-bl-none"}
                    `}>
                        {/* On utilise dangerouslySetInnerHTML car Odoo envoie du HTML */}
                        <div dangerouslySetInnerHTML={{ __html: msg.body }} />
                        
                        <div className={`text-[10px] mt-1 flex items-center justify-end gap-1 ${msg.is_me ? "text-blue-100" : "text-slate-400"}`}>
                            <span>{msg.date}</span>
                            {msg.is_me && <CheckCheck size={12} />}
                        </div>
                    </div>
                </motion.div>
            ))}
            <div ref={messagesEndRef} />
         </div>

         {/* Input Area */}
         <div className="p-4 bg-white border-t border-slate-100 z-10">
            <form onSubmit={handleSend} className="flex items-center gap-3 max-w-4xl mx-auto">
                <button type="button" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded-full transition-colors">
                    <Paperclip size={20} />
                </button>
                <div className="flex-1 relative">
                    <input 
                        type="text" 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Écrivez votre message..." 
                        className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all placeholder:text-slate-400"
                    />
                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        <Smile size={20} />
                    </button>
                </div>
                <button 
                    type="submit"
                    disabled={!inputText.trim()}
                    className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50 disabled:shadow-none"
                >
                    <Send size={20} />
                </button>
            </form>
         </div>

      </div>
    </div>
  );
}