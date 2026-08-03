import React from 'react';
import { 
  Home, 
  BookOpen, 
  Calendar, 
  Sparkles, 
  Music, 
  Image as ImageIcon, 
  Users, 
  Clock, 
  Moon, 
  Compass, 
  HelpCircle, 
  Lock,
  Heart,
  Mail
} from 'lucide-react';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onLock: () => void;
  onOpenDailyLetter: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  hasUnreadLetter?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onLock,
  onOpenDailyLetter,
  isMobileOpen,
  setIsMobileOpen,
  hasUnreadLetter = false
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'our-story', label: 'Our Story', icon: BookOpen },
    { id: 'calendar', label: 'Shared Calendar', icon: Calendar },
    { id: 'little-things', label: 'Little Things', icon: Sparkles },
    { id: 'music', label: 'Music Library', icon: Music },
    { id: 'photo-vault', label: 'Photo Vault', icon: ImageIcon },
    { id: 'family-friends', label: 'Family & Friends', icon: Users },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'faith', label: 'Faith & Reflections', icon: Moon },
    { id: 'bucket-list', label: 'Bucket List', icon: Compass },
    { id: 'quiz', label: 'Relationship Quiz', icon: HelpCircle },
  ];

  const handleSelect = (tab: ActiveTab) => {
    setActiveTab(tab);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-[#000000]/70 z-40 lg:hidden backdrop-blur-xs"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 left-0 bottom-0 w-64 bg-[#0e1017]/95 border-r border-[#d4af37]/15 z-50 flex flex-col justify-between transition-transform duration-300 ease-out backdrop-blur-xl
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Top Branding Section */}
        <div>
          <div className="p-6 border-b border-[#d4af37]/10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-[#1e1b15] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] shadow-md shadow-[#000]/40">
                <Heart className="w-5 h-5 fill-[#d4af37]/30 text-[#d4af37]" />
              </div>
              <div>
                <h1 className="font-script text-2xl text-[#f3e7c4] leading-tight">Sofs & Mumu</h1>
                <p className="text-[10px] uppercase tracking-widest text-[#a39780] font-sans">The Sanctuary</p>
              </div>
            </div>
          </div>

          {/* Navigation Links List */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-210px)] custom-scrollbar">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`
                    w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer group relative
                    ${isActive 
                      ? 'bg-gradient-to-r from-[#d4af37]/20 via-[#d4af37]/10 to-transparent text-[#f5ebd2] border-l-2 border-[#d4af37]' 
                      : 'text-[#9c9380] hover:text-[#f3e7c4] hover:bg-[#181a24]'
                    }
                  `}
                >
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-[#d4af37]' : 'text-[#827866] group-hover:text-[#d4af37]'}`} />
                  <span className="tracking-wide">{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#d4af37] shadow-[0_0_8px_#d4af37]" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Letter of the Day & Lock Actions */}
        <div className="p-4 border-t border-[#d4af37]/10 space-y-2 bg-[#0a0b0e]/50">
          <button
            onClick={onOpenDailyLetter}
            className="w-full flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-[#1c1811] via-[#151722] to-[#1a1511] border border-[#d4af37]/40 text-[#f3e7c4] text-xs font-medium hover:border-[#d4af37] transition shadow-md group cursor-pointer relative overflow-hidden"
          >
            <div className="relative">
              <Mail className="w-4 h-4 text-[#d4af37]" />
              {hasUnreadLetter && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              )}
            </div>
            <div className="text-left flex-1">
              <div className="text-[#d4af37] font-semibold flex items-center justify-between">
                <span>Letter of the Day</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30">
                  Daily
                </span>
              </div>
              <div className="text-[10px] text-[#a19680]">Read &amp; write today's love note</div>
            </div>
          </button>

          <button
            onClick={onLock}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-xl text-xs text-[#8c816d] hover:text-rose-300 hover:bg-rose-950/20 transition cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Lock Sanctuary</span>
          </button>
        </div>
      </aside>
    </>
  );
};
