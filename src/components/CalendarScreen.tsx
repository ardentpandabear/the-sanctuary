import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Clock, Sparkles, CheckCircle2, Circle } from 'lucide-react';
import { CalendarEvent, CountdownItem } from '../types';

interface CalendarScreenProps {
  events: CalendarEvent[];
  countdowns: CountdownItem[];
  onAddEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  onToggleEventCompleted: (id: string) => void;
}

export const CalendarScreen: React.FC<CalendarScreenProps> = ({
  events,
  countdowns,
  onAddEvent,
  onToggleEventCompleted
}) => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 1)); // October 2025
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('2025-10-14');
  const [time, setTime] = useState('10:00 AM');
  const [endTime, setEndTime] = useState('');
  const [category, setCategory] = useState<'anniversary' | 'date-night' | 'travel' | 'faith' | 'reminder' | 'special'>('anniversary');
  const [notes, setNotes] = useState('');

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    onAddEvent({
      title,
      date,
      time,
      endTime: endTime.trim() || undefined,
      category,
      notes,
      isCompleted: false
    });
    setTitle('');
    setEndTime('');
    setNotes('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#171924] via-[#12141d] to-[#1c1913] border border-[#d4af37]/20 shadow-xl">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs text-[#d4af37] mb-1">
            <CalendarIcon className="w-4 h-4" />
            <span className="uppercase tracking-widest font-semibold">Shared Calendar</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-semibold text-[#fff8e7]">Synchronized Rhythms</h2>
          <p className="text-xs sm:text-sm font-serif italic text-[#c8bfab]">
            Rabi' al-Awwal - Rabi' al-Thani 1447 • London &amp; New York Time
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#aa8022] text-[#0c0d12] font-semibold text-xs tracking-wider hover:brightness-110 transition shadow-lg shadow-[#d4af37]/20 flex items-center space-x-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Event</span>
        </button>
      </div>

      {/* Countdowns Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {countdowns.map((cd) => (
          <div key={cd.id} className="glass-panel p-5 rounded-2xl border border-[#d4af37]/20 flex items-center justify-between">
            <div>
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${cd.badgeColor || 'bg-amber-500/20 text-amber-300'}`}>
                {cd.category}
              </span>
              <h4 className="text-sm font-display font-semibold text-[#fff8e7] mt-1.5">{cd.title}</h4>
              <p className="text-[11px] text-[#a39780]">{cd.targetDate}</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-display font-bold text-[#d4af37]">26</span>
              <span className="text-[10px] text-[#8c816d] block uppercase font-mono">Days Left</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Month Calendar (8 cols) & Today's Schedule (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Calendar View */}
        <div className="lg:col-span-8 glass-panel p-6 sm:p-8 rounded-3xl border border-[#d4af37]/20 space-y-6">
          
          {/* Calendar Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-display font-semibold text-[#fff8e7]">
                {monthNames[month]} {year}
              </h3>
              <p className="text-xs text-[#a39780]">Click any day to schedule shared plans</p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevMonth}
                className="p-2 rounded-xl bg-[#141620] border border-[#d4af37]/20 text-[#a39780] hover:text-[#f3e7c4] transition cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 rounded-xl bg-[#141620] border border-[#d4af37]/20 text-[#a39780] hover:text-[#f3e7c4] transition cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-[#d4af37] uppercase tracking-wider">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="py-1">{d}</div>
            ))}
          </div>

          {/* Calendar Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty slots for start of month */}
            {Array.from({ length: firstDayIndex }).map((_, idx) => (
              <div key={`empty-${idx}`} className="h-20 sm:h-24 rounded-2xl bg-[#0e1017]/40 border border-transparent" />
            ))}

            {/* Actual Days */}
            {Array.from({ length: totalDays }).map((_, idx) => {
              const dayNum = idx + 1;
              const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const dayEvents = events.filter(e => e.date === dateString || (dayNum === 14 && month === 9)); // highlighting 14th

              const isToday = dayNum === 14 && month === 9; // Oct 14 highlight

              return (
                <div
                  key={dayNum}
                  onClick={() => { setDate(dateString); setIsAddModalOpen(true); }}
                  className={`h-20 sm:h-24 p-2 rounded-2xl border transition cursor-pointer flex flex-col justify-between overflow-hidden group ${
                    isToday
                      ? 'bg-[#1e1a12] border-[#d4af37] shadow-md shadow-[#d4af37]/20'
                      : 'bg-[#12141d]/80 border-[#d4af37]/10 hover:border-[#d4af37]/30 hover:bg-[#181a24]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-mono font-semibold ${isToday ? 'text-[#d4af37]' : 'text-[#f3e7c4]'}`}>
                      {dayNum}
                    </span>
                    {isToday && <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />}
                  </div>

                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map((ev) => (
                      <div
                        key={ev.id}
                        className="px-1.5 py-0.5 rounded-lg bg-[#d4af37]/20 text-[#f3e7c4] text-[9px] font-medium truncate border border-[#d4af37]/30"
                      >
                        {ev.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <span className="text-[9px] text-[#a39780] font-mono block">+{dayEvents.length - 2} more</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right Side: Today's Rhythm Schedule & Events List (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-[#d4af37]/20 space-y-4">
            <h3 className="text-base font-display font-semibold text-[#fff8e7] flex items-center space-x-2">
              <Clock className="w-4 h-4 text-[#d4af37]" />
              <span>Upcoming Plans</span>
            </h3>

            <div className="space-y-3">
              {events.map((ev) => (
                <div 
                  key={ev.id}
                  className="p-3.5 rounded-2xl bg-[#141620] border border-[#d4af37]/15 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => onToggleEventCompleted(ev.id)}
                      className="flex items-center space-x-2 text-xs font-semibold text-[#f3e7c4] hover:text-[#d4af37] transition cursor-pointer"
                    >
                      {ev.isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-[#8c816d] shrink-0" />
                      )}
                      <span className={ev.isCompleted ? 'line-through text-[#8c816d]' : ''}>
                        {ev.title}
                      </span>
                    </button>
                    <div className="text-right shrink-0 ml-2">
                      <span className="text-[10px] text-[#d4af37] font-mono block">{ev.date}</span>
                      {(ev.time || ev.endTime) && (
                        <span className="text-[9px] text-[#a39780] font-mono block">
                          {ev.time || ''}{ev.time && ev.endTime ? ' - ' : ''}{ev.endTime || ''}
                        </span>
                      )}
                    </div>
                  </div>

                  {ev.notes && (
                    <p className="text-[11px] text-[#a39780] font-serif italic pl-6">
                      "{ev.notes}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Add Event Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-[#000000]/75 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="glass-panel max-w-md w-full p-6 rounded-3xl border border-[#d4af37]/30 shadow-2xl space-y-4 relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-[#a39780] hover:text-[#f3e7c4] text-xl font-bold cursor-pointer"
            >
              &times;
            </button>

            <h3 className="text-xl font-display text-[#fff8e7]">Schedule New Event</h3>

            <form onSubmit={handleFormSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#a39780] mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Anniversary Trip to Kyoto"
                  className="w-full px-3 py-2 rounded-xl bg-[#0e1017] border border-[#d4af37]/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#a39780] mb-1">Date *</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0e1017] border border-[#d4af37]/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-[#a39780] mb-1">Start Time</label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="e.g. 10:00 AM"
                    className="w-full px-3 py-2 rounded-xl bg-[#0e1017] border border-[#d4af37]/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#a39780] mb-1">
                    End Time <span className="text-[10px] text-[#8c816d]">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    placeholder="e.g. 02:00 PM"
                    className="w-full px-3 py-2 rounded-xl bg-[#0e1017] border border-[#d4af37]/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#a39780] mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0e1017] border border-[#d4af37]/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#d4af37]"
                >
                  <option value="anniversary">Anniversary</option>
                  <option value="date-night">Date Night</option>
                  <option value="travel">Travel</option>
                  <option value="faith">Faith / Ramadan</option>
                  <option value="special">Special</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#a39780] mb-1">Notes &amp; Reminders</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Flight booking confirmation or candle night plans..."
                  className="w-full px-3 py-2 rounded-xl bg-[#0e1017] border border-[#d4af37]/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-[#d4af37]/15">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-[#a39780] hover:text-[#f3e7c4] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#d4af37] text-[#0c0d12] text-xs font-semibold hover:brightness-110 cursor-pointer"
                >
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
