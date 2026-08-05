import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Circle,
  Edit2,
  Trash2,
  X
} from 'lucide-react';
import { CalendarEvent, CountdownItem } from '../types';

interface CalendarScreenProps {
  events: CalendarEvent[];
  countdowns?: CountdownItem[];
  onAddEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  onUpdateEvent?: (id: string, event: Omit<CalendarEvent, 'id'>) => void;
  onDeleteEvent?: (id: string) => void;
  onToggleEventCompleted: (id: string) => void;
}

export const CalendarScreen: React.FC<CalendarScreenProps> = ({
  events,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  onToggleEventCompleted
}) => {
  // Start calendar view at current month
  const [currentDate, setCurrentDate] = useState(new Date());

  // Add / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('08:00 PM');
  const [endTime, setEndTime] = useState('');
  const [category, setCategory] = useState<'anniversary' | 'date-night' | 'travel' | 'faith' | 'reminder' | 'special'>('date-night');
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

  // Helper to calculate days left relative to today
  const calculateDaysLeft = (targetDateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [y, m, d] = targetDateStr.split('-').map(Number);
    if (!y || !m || !d) return 0;
    const target = new Date(y, m - 1, d);
    target.setHours(0, 0, 0, 0);

    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Dynamically compute Top 3 upcoming events (sorted by date chronologically)
  const sortedUpcomingEvents = [...events].sort((a, b) => a.date.localeCompare(b.date));
  const top3Upcoming = sortedUpcomingEvents.slice(0, 3);

  // Modal Handlers
  const handleOpenAddModal = (initialDate?: string) => {
    setEditingEventId(null);
    setTitle('');
    setDate(initialDate || `${year}-${String(month + 1).padStart(2, '0')}-15`);
    setTime('08:00 PM');
    setEndTime('');
    setCategory('date-night');
    setNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (ev: CalendarEvent) => {
    setEditingEventId(ev.id);
    setTitle(ev.title);
    setDate(ev.date);
    setTime(ev.time || '');
    setEndTime(ev.endTime || '');
    setCategory(ev.category || 'special');
    setNotes(ev.notes || '');
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date) return;

    const payload = {
      title: title.trim(),
      date,
      time: time.trim() || undefined,
      endTime: endTime.trim() || undefined,
      category,
      notes: notes.trim() || undefined,
      isCompleted: false
    };

    if (editingEventId && onUpdateEvent) {
      onUpdateEvent(editingEventId, payload);
    } else {
      onAddEvent(payload);
    }

    setIsModalOpen(false);
  };

  const getCategoryBadgeStyle = (cat?: string) => {
    switch (cat) {
      case 'anniversary':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'travel':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'faith':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'date-night':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      default:
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    }
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
            Safar - Rabi' al-Awwal 1448 • London &amp; Allahabad Time
          </p>
        </div>

        <button
          onClick={() => handleOpenAddModal()}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#aa8022] text-[#0c0d12] font-semibold text-xs tracking-wider hover:brightness-110 transition shadow-lg shadow-[#d4af37]/20 flex items-center space-x-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Plan</span>
        </button>
      </div>

      {/* Dynamic Top 3 Upcoming Plans Cards (Under Synchronized Rhythms) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs uppercase tracking-widest font-semibold text-[#d4af37] flex items-center space-x-2">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Top Upcoming Highlights</span>
          </h3>
          <span className="text-[11px] text-[#8c816d]">Auto-updated from plans</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {top3Upcoming.map((ev) => {
            const daysLeft = calculateDaysLeft(ev.date);
            return (
              <div 
                key={ev.id} 
                className="glass-panel p-5 rounded-2xl border border-[#d4af37]/20 flex flex-col justify-between space-y-3 relative group hover:border-[#d4af37]/50 transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getCategoryBadgeStyle(ev.category)} uppercase tracking-wider`}>
                    {ev.category || 'Special'}
                  </span>

                  {/* Actions: Edit & Delete */}
                  <div className="flex items-center space-x-1 opacity-80 group-hover:opacity-100 transition">
                    <button
                      onClick={() => handleOpenEditModal(ev)}
                      title="Edit Plan"
                      className="p-1 rounded-lg text-[#a39780] hover:text-[#d4af37] hover:bg-[#d4af37]/10 transition cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {onDeleteEvent && (
                      <button
                        onClick={() => {
                          if (confirm(`Delete plan "${ev.title}"?`)) {
                            onDeleteEvent(ev.id);
                          }
                        }}
                        title="Delete Plan"
                        className="p-1 rounded-lg text-[#a39780] hover:text-rose-400 hover:bg-rose-950/30 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-display font-semibold text-[#fff8e7] line-clamp-1">{ev.title}</h4>
                  <p className="text-[11px] text-[#a39780] font-mono mt-0.5">{ev.date} {ev.time ? `• ${ev.time}` : ''}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#d4af37]/10">
                  <span className="text-[10px] text-[#8c816d] italic line-clamp-1">
                    {ev.notes || 'Shared plan'}
                  </span>

                  <div className="text-right shrink-0">
                    <span className="text-xl font-display font-bold text-[#d4af37]">
                      {daysLeft > 0 ? daysLeft : daysLeft === 0 ? 'Today' : 'Past'}
                    </span>
                    {daysLeft > 0 && (
                      <span className="text-[9px] text-[#8c816d] block uppercase font-mono">Days Left</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {top3Upcoming.length === 0 && (
            <div className="col-span-full p-6 text-center glass-panel rounded-2xl border border-[#d4af37]/20 text-xs text-[#a39780]">
              No upcoming plans scheduled yet. Click "Add Plan" to create your first shared event!
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Month Calendar (8 cols) & Upcoming Plans List (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Calendar View */}
        <div className="lg:col-span-8 glass-panel p-6 sm:p-8 rounded-3xl border border-[#d4af37]/20 space-y-6">
          
          {/* Calendar Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-display font-semibold text-[#fff8e7]">
                {monthNames[month]} {year}
              </h3>
              <p className="text-xs text-[#a39780]">Click any day cell to schedule or edit plans</p>
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
              const dayEvents = events.filter(e => e.date === dateString);

              const today = new Date();

const isToday =
  dayNum === today.getDate() &&
  month === today.getMonth() &&
  year === today.getFullYear();
              return (
                <div
                  key={dayNum}
                  onClick={() => handleOpenAddModal(dateString)}
                  className={`h-20 sm:h-24 p-2 rounded-2xl border transition cursor-pointer flex flex-col justify-between overflow-hidden group ${
                    isToday
                      ? 'bg-[#1e1a12] border-[#d4af37] shadow-md shadow-[#d4af37]/20'
                      : 'bg-[#12141d]/80 border-[#d4af37]/10 hover:border-[#d4af37]/40 hover:bg-[#181a24]'
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
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditModal(ev);
                        }}
                        className="px-1.5 py-0.5 rounded-lg bg-[#d4af37]/20 hover:bg-[#d4af37]/40 text-[#f3e7c4] text-[9px] font-medium truncate border border-[#d4af37]/30 transition"
                        title={ev.title}
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

        {/* Right Side: Upcoming Plans List */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-[#d4af37]/20 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-display font-semibold text-[#fff8e7] flex items-center space-x-2">
                <Clock className="w-4 h-4 text-[#d4af37]" />
                <span>Upcoming Plans ({sortedUpcomingEvents.length})</span>
              </h3>

              <button
                onClick={() => handleOpenAddModal()}
                className="text-xs text-[#d4af37] hover:underline font-semibold flex items-center space-x-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-1">
              {sortedUpcomingEvents.map((ev) => (
                <div 
                  key={ev.id}
                  className="p-3.5 rounded-2xl bg-[#141620] border border-[#d4af37]/15 space-y-2 hover:border-[#d4af37]/30 transition group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <button
                      onClick={() => onToggleEventCompleted(ev.id)}
                      className="flex items-center space-x-2 text-xs font-semibold text-[#f3e7c4] hover:text-[#d4af37] transition cursor-pointer text-left"
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

                    <div className="flex items-center space-x-1 shrink-0 opacity-80 group-hover:opacity-100 transition">
                      <button
                        onClick={() => handleOpenEditModal(ev)}
                        title="Edit Plan"
                        className="p-1 rounded-lg text-[#a39780] hover:text-[#d4af37] hover:bg-[#d4af37]/10 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {onDeleteEvent && (
                        <button
                          onClick={() => {
                            if (confirm(`Delete plan "${ev.title}"?`)) {
                              onDeleteEvent(ev.id);
                            }
                          }}
                          title="Delete Plan"
                          className="p-1 rounded-lg text-[#a39780] hover:text-rose-400 hover:bg-rose-950/30 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-[#d4af37] font-mono pl-6">
                    <span>{ev.date}</span>
                    {(ev.time || ev.endTime) && (
                      <span className="text-[#a39780]">
                        {ev.time || ''}{ev.time && ev.endTime ? ' - ' : ''}{ev.endTime || ''}
                      </span>
                    )}
                  </div>

                  {ev.notes && (
                    <p className="text-[11px] text-[#a39780] font-serif italic pl-6">
                      "{ev.notes}"
                    </p>
                  )}
                </div>
              ))}

              {sortedUpcomingEvents.length === 0 && (
                <div className="p-6 text-center text-xs text-[#8c816d] italic">
                  No plans added yet.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Add / Edit Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#000000]/75 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="glass-panel max-w-md w-full p-6 sm:p-8 rounded-3xl border border-[#d4af37]/30 shadow-2xl space-y-4 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-[#a39780] hover:text-[#f3e7c4] text-xl font-bold cursor-pointer"
            >
              &times;
            </button>

            <h3 className="text-xl font-display text-[#fff8e7]">
              {editingEventId ? 'Edit Shared Plan' : 'Schedule New Plan'}
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#a39780] mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Dental appointment"
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
                    placeholder="e.g. 08:00 PM"
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
                    placeholder="e.g. 11:00 PM"
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
                  <option value="date-night">Class</option>
                  <option value="travel">Travel</option>
                  <option value="anniversary">Outing</option>
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
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-[#a39780] hover:text-[#f3e7c4] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#d4af37] text-[#0c0d12] text-xs font-semibold hover:brightness-110 cursor-pointer"
                >
                  {editingEventId ? 'Save Changes' : 'Add Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};