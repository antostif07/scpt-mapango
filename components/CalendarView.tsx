"use client";

import { useState } from "react";
// ... (autres imports existants : date-fns, motion, lucide...)
import { 
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, 
  eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, 
  parseISO, isToday 
} from "date-fns";
import { fr } from "date-fns/locale";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, Calendar as CalIcon } from "lucide-react";
import NewEventModal from "./NewEventModal"; // <--- 1. IMPORT ICI
import { CalendarEvent } from "@/lib/types";

export default function CalendarView({ events }: { events: CalendarEvent[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // 2. STATE POUR LA MODALE
  const [isModalOpen, setIsModalOpen] = useState(false); 

  // ... (Logique du calendrier existante : monthStart, days, etc.) ...
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const selectedDayEvents = events.filter(event => isSameDay(parseISO(event.start), selectedDate));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const getEventColor = (id: number) => {
    const colors = ["bg-blue-100 text-blue-700 border-blue-200", "bg-emerald-100 text-emerald-700 border-emerald-200", "bg-violet-100 text-violet-700 border-violet-200", "bg-orange-100 text-orange-700 border-orange-200"];
    return colors[id % colors.length];
  };

  return (
    <>
      {/* 3. APPEL DE LA MODALE */}
      <NewEventModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        defaultDate={selectedDate} // La modale s'ouvrira sur la date cliquée
      />

      <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden bg-white">
        
        {/* SIDEBAR */}
        <div className="w-full lg:w-96 border-r border-slate-100 bg-slate-50/50 flex flex-col h-full">
          <div className="p-6 border-b border-slate-100">
               <h2 className="text-3xl font-bold text-slate-800 capitalize">
                  {format(selectedDate, "EEEE", { locale: fr })}
               </h2>
               <p className="text-slate-500 text-lg">
                  {format(selectedDate, "d MMMM yyyy", { locale: fr })}
               </p>
               
               {/* 4. BOUTON CONNECTÉ */}
               <button 
                 onClick={() => setIsModalOpen(true)}
                 className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all"
               >
                  <Plus size={18} /> Nouvel événement
               </button>
          </div>
          
          {/* ... (Reste de la liste des événements sidebar) ... */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Programme</h3>
              {selectedDayEvents.length > 0 ? (
                  selectedDayEvents.map(evt => (
                      <motion.div 
                          key={evt.id}
                          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                      >
                          <div className="flex justify-between items-start mb-2">
                               <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${getEventColor(evt.id)}`}>
                                  {evt.tags.length > 0 ? "Réunion" : "Visite"}
                               </span>
                               <span className="text-xs font-medium text-slate-400">
                                  {format(parseISO(evt.start), "HH:mm")}
                               </span>
                          </div>
                          <h4 className="font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">{evt.name}</h4>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                              {evt.location && <><MapPin size={12}/> {evt.location}</>}
                              <Clock size={12} className="ml-2"/> {evt.duration}h
                          </div>
                      </motion.div>
                  ))
              ) : (
                  <div className="text-center py-10 text-slate-400">
                      <CalIcon size={40} className="mx-auto mb-3 opacity-20" />
                      <p>Aucun événement prévu</p>
                  </div>
              )}
          </div>
        </div>

        {/* ... (Reste de la Grille principale CALENDRIER) ... */}
        {/* Le reste du fichier est identique à la version précédente */}
        <div className="flex-1 flex flex-col min-w-0">
            {/* Header, Jours, Grille... Copie-colle le reste du code précédent ici */}
             <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold text-slate-800 capitalize">
                        {format(currentDate, "MMMM yyyy", { locale: fr })}
                    </h1>
                    <div className="flex bg-slate-100 rounded-lg p-1">
                        <button onClick={prevMonth} className="p-1 hover:bg-white rounded-md transition-all shadow-sm"><ChevronLeft size={20} /></button>
                        <button onClick={nextMonth} className="p-1 hover:bg-white rounded-md transition-all shadow-sm"><ChevronRight size={20} /></button>
                    </div>
                </div>
                <button 
                    onClick={() => {setCurrentDate(new Date()); setSelectedDate(new Date())}}
                    className="text-sm font-medium text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                >
                    Aujourd'hui
                </button>
            </div>

            <div className="grid grid-cols-7 border-b border-slate-100">
                {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                    <div key={day} className="py-3 text-center text-sm font-medium text-slate-400 uppercase tracking-wider">
                        {day}
                    </div>
                ))}
            </div>

            <div className="flex-1 grid grid-cols-7 grid-rows-5 lg:grid-rows-6">
                {days.map((day, dayIdx) => {
                    const dayEvents = events.filter(e => isSameDay(parseISO(e.start), day));
                    const isSelected = isSameDay(day, selectedDate);
                    const isCurrentMonth = isSameMonth(day, currentDate);
                    const isTodayDate = isToday(day);

                    return (
                        <div 
                            key={day.toString()}
                            onClick={() => setSelectedDate(day)}
                            className={`
                                border-b border-r border-slate-50 relative p-2 transition-colors cursor-pointer
                                ${!isCurrentMonth ? 'bg-slate-50/50' : 'bg-white'}
                                ${isSelected ? 'bg-blue-50/30' : 'hover:bg-slate-50'}
                            `}
                        >
                            <div className="flex justify-between items-start">
                                <span className={`
                                    w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium
                                    ${isTodayDate ? 'bg-blue-600 text-white shadow-md' : isCurrentMonth ? 'text-slate-700' : 'text-slate-300'}
                                `}>
                                    {format(day, 'd')}
                                </span>
                            </div>
                            <div className="mt-2 space-y-1 overflow-hidden max-h-[80px]">
                                {dayEvents.slice(0, 3).map(evt => (
                                    <div 
                                        key={evt.id} 
                                        className={`text-[10px] px-1.5 py-0.5 rounded border truncate ${getEventColor(evt.id)}`}
                                    >
                                        {evt.name}
                                    </div>
                                ))}
                                {dayEvents.length > 3 && (
                                    <div className="text-[10px] text-slate-400 pl-1">
                                        + {dayEvents.length - 3} autres
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
      </div>
    </>
  );
}