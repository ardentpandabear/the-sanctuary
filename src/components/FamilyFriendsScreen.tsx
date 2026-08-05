import React, { useState, useRef } from 'react';
import { Users, Plus, Phone, MapPin, Gift, Heart, Sparkles, Filter, Trash2, HeartHandshake, Home, Upload, Image as ImageIcon } from 'lucide-react';
import { FamilyFriendContact } from '../types';

interface FamilyFriendsScreenProps {
  contacts: FamilyFriendContact[];
  onAddContact: (contact: Omit<FamilyFriendContact, 'id'>) => void;
  onDeleteContact: (id: string) => void;
}

export const FamilyFriendsScreen: React.FC<FamilyFriendsScreenProps> = ({
  contacts,
  onAddContact,
  onDeleteContact
}) => {
  const [selectedCircleTab, setSelectedCircleTab] = useState<'mumu' | 'sofs' | 'both' | 'all'>('all');
  const [filterType, setFilterType] = useState<'all' | 'family' | 'friend'>('all');
  const [selectedContact, setSelectedContact] = useState<FamilyFriendContact | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [phone, setPhone] = useState('');
  const avatarFileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatarUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  const [location, setLocation] = useState('');
  const [birthday, setBirthday] = useState('');
  const [favoriteThingsInput, setFavoriteThingsInput] = useState('');
  const [notes, setNotes] = useState('');
  const [type, setType] = useState<'family' | 'friend'>('family');
  const [belongsTo, setBelongsTo] = useState<'sofs' | 'mumu' | 'both'>('sofs');

  // Filter contacts by circle tab and family/friend type
  const filteredContacts = contacts.filter(c => {
    // Circle tab check
    if (selectedCircleTab === 'mumu' && c.belongsTo !== 'mumu') return false;
    if (selectedCircleTab === 'sofs' && c.belongsTo !== 'sofs') return false;
    if (selectedCircleTab === 'both' && c.belongsTo !== 'both') return false;

    // Type check
    if (filterType !== 'all' && c.type !== filterType) return false;

    return true;
  });

  const mumuContactsCount = contacts.filter(c => c.belongsTo === 'mumu').length;
  const sofsContactsCount = contacts.filter(c => c.belongsTo === 'sofs').length;
  const sharedContactsCount = contacts.filter(c => c.belongsTo === 'both').length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !relation) return;

    onAddContact({
      name,
      relation,
      avatarUrl: avatarUrl || '',
      phone,
      location: location || '',
      birthday: birthday || '',
      favoriteThings: favoriteThingsInput ? favoriteThingsInput.split(',').map(f => f.trim()) : [],
      notes,
      type,
      belongsTo,
      sharedMemoriesCount: 1
    });

    setName('');
    setRelation('');
    setAvatarUrl('');
    setNotes('');
    setPhone('');
    setLocation('');
    setBirthday('');
    setFavoriteThingsInput('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#171924] via-[#12141d] to-[#1c1913] border border-[#d4af37]/20 shadow-xl">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs text-[#d4af37] mb-1">
            <Users className="w-4 h-4" />
            <span className="uppercase tracking-widest font-semibold">Circle of Warmth</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-semibold text-[#fff8e7]">Family &amp; Friends</h2>
          <p className="text-xs sm:text-sm font-serif italic text-[#c8bfab]">
            The souls who surround our story with light, hospitality, and endless warmth across Allahabad &amp; Birmingham.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#aa8022] text-[#0c0d12] font-semibold text-xs tracking-wider hover:brightness-110 transition shadow-lg shadow-[#d4af37]/20 flex items-center space-x-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Contact</span>
        </button>
      </div>

      {/* Main Circle Switcher (Sofs' Circle vs Mumu's Circle vs Shared) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-1.5 rounded-2xl bg-[#12141d] border border-[#d4af37]/20">
        
        <button
          onClick={() => setSelectedCircleTab('all')}
          className={`px-4 py-3 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center justify-center space-x-2 border ${
            selectedCircleTab === 'all'
              ? 'bg-[#d4af37] text-[#0c0d12] border-[#d4af37] shadow-lg'
              : 'text-[#a39780] border-transparent hover:text-[#f3e7c4]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>All Circles ({contacts.length})</span>
        </button>

        <button
          onClick={() => setSelectedCircleTab('sofs')}
          className={`px-4 py-3 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center justify-center space-x-2 border ${
            selectedCircleTab === 'sofs'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-[#0c0d12] border-amber-400 shadow-lg'
              : 'text-[#a39780] border-transparent hover:text-[#f3e7c4]'
          }`}
        >
          <span className="text-base">GB</span>
          <span>Sofs’ Circle ({sofsContactsCount})</span>
        </button>

        <button
          onClick={() => setSelectedCircleTab('mumu')}
          className={`px-4 py-3 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center justify-center space-x-2 border ${
            selectedCircleTab === 'mumu'
              ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white border-sky-400 shadow-lg'
              : 'text-[#a39780] border-transparent hover:text-[#f3e7c4]'
          }`}
        >
          <span className="text-base">IN</span>
          <span>Mumu’s Circle ({mumuContactsCount})</span>
        </button>

        <button
          onClick={() => setSelectedCircleTab('both')}
          className={`px-4 py-3 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center justify-center space-x-2 border ${
            selectedCircleTab === 'both'
              ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white border-rose-400 shadow-lg'
              : 'text-[#a39780] border-transparent hover:text-[#f3e7c4]'
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          <span>Shared Friends ({sharedContactsCount})</span>
        </button>

      </div>

      {/* Circle Description Banner */}
      <div className="p-4 rounded-2xl bg-[#161822] border border-[#d4af37]/15 flex items-center justify-between text-xs text-[#c8bfab]">
        {selectedCircleTab === 'sofs' && (
          <div className="flex items-center space-x-2">
            <span className="text-xl">🕌</span>
            <div>
              <strong className="text-[#d4af37] block">Sofs’ Family &amp; Friends (Prayagraj / Allahabad &amp; India)</strong>
              <span>Cherished family members, uncles, childhood confidantes, and college friends surrounding Sofs in India.</span>
            </div>
          </div>
        )}
        {selectedCircleTab === 'mumu' && (
          <div className="flex items-center space-x-2">
            <span className="text-xl">☕</span>
            <div>
              <strong className="text-sky-400 block">Mumu’s Family &amp; Friends (Birmingham &amp; UK)</strong>
              <span>Close-knit family, university mates, and Birmingham inner circle supporting Mumu in the UK.</span>
            </div>
          </div>
        )}
        {selectedCircleTab === 'both' && (
          <div className="flex items-center space-x-2">
            <span className="text-xl">✨</span>
            <div>
              <strong className="text-rose-300 block">Our Shared Couple Circle</strong>
              <span>Mutual close friends, couple besties, and shared family members who support both Sofs &amp; Mumu.</span>
            </div>
          </div>
        )}
        {selectedCircleTab === 'all' && (
          <div className="flex items-center space-x-2">
            <span className="text-xl">🌍</span>
            <div>
              <strong className="text-[#d4af37] block">Combined Global Inner Circle</strong>
              <span>Showing all loved ones across Allahabad, Birmingham, London, and New York.</span>
            </div>
          </div>
        )}

        {/* Secondary Sub Filter */}
        <div className="flex items-center space-x-1.5 shrink-0 ml-4">
          <Filter className="w-3.5 h-3.5 text-[#d4af37]" />
          {(['all', 'family', 'friend'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition cursor-pointer ${
                filterType === t
                  ? 'bg-[#d4af37] text-[#0c0d12]'
                  : 'bg-[#1e202d] text-[#a39780] hover:text-[#f3e7c4]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredContacts.map((contact) => {
          const isMumuCircle = contact.belongsTo === 'mumu';
          const isSofsCircle = contact.belongsTo === 'sofs';

          return (
            <div
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className={`glass-panel p-6 rounded-3xl border transition duration-300 relative group cursor-pointer text-center space-y-4 shadow-lg ${
                isSofsCircle 
                  ? 'border-amber-500/25 hover:border-amber-400/60 bg-gradient-to-b from-[#1c1d29]/90 to-[#14151f]/90'
                  : isMumuCircle
                  ? 'border-sky-500/25 hover:border-sky-400/60 bg-gradient-to-b from-[#181d2c]/90 to-[#121522]/90'
                  : 'border-rose-500/25 hover:border-rose-400/60 bg-gradient-to-b from-[#1d1722]/90 to-[#14121a]/90'
              }`}
            >
              {/* Circle Owner Pill */}
              <div className="absolute top-3 right-3">
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                  isSofsCircle 
                    ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                    : isMumuCircle
                    ? 'bg-sky-950/60 text-sky-300 border-sky-500/40'
                    : 'bg-rose-950/60 text-rose-300 border-rose-500/40'
                }`}>
                  {isSofsCircle ? 'Sofs’ Circle 🇮🇳' : isMumuCircle ? 'Mumu’s Circle 🇬🇧' : 'Shared ✨'}
                </span>
              </div>

              <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-[#d4af37]/40 shadow-xl mt-1">
                <img src={contact.avatarUrl} alt={contact.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
              </div>

              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#181a24] text-[#d4af37] text-[10px] font-semibold uppercase border border-[#d4af37]/20">
                  {contact.type}
                </span>
                <h3 className="text-lg font-display font-semibold text-[#fff8e7] mt-1.5">{contact.name}</h3>
                <p className="text-xs text-[#a39780]">{contact.relation}</p>
              </div>

              <div className="pt-3 border-t border-[#d4af37]/10 flex items-center justify-between text-xs text-[#8c816d]">
                <span className="truncate max-w-[120px]">📍 {contact.location}</span>
                <span className="text-[#d4af37] font-semibold shrink-0">{contact.sharedMemoriesCount} Memories</span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredContacts.length === 0 && (
        <div className="text-center py-12 glass-panel rounded-3xl border border-[#d4af37]/20 p-8">
          <Users className="w-12 h-12 text-[#d4af37]/50 mx-auto mb-3" />
          <h4 className="text-lg font-display font-semibold text-[#fff8e7]">No contacts found in this circle</h4>
          <p className="text-xs text-[#a39780] mt-1 mb-4">Add loved ones to build Sofs’ &amp; Mumu’s personal circle of warmth.</p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#d4af37] text-[#0c0d12] font-semibold text-xs cursor-pointer"
          >
            Add Contact Now
          </button>
        </div>
      )}

      {/* Contact Drawer Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-[#000000]/75 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="glass-panel max-w-md w-full p-6 sm:p-8 rounded-3xl border border-[#d4af37]/30 shadow-2xl space-y-5 relative">
            <button
              onClick={() => setSelectedContact(null)}
              className="absolute top-4 right-4 text-[#a39780] hover:text-[#f3e7c4] text-xl font-bold cursor-pointer"
            >
              &times;
            </button>

            <div className="flex items-center space-x-4">
              <img src={selectedContact.avatarUrl} alt={selectedContact.name} className="w-16 h-16 rounded-full object-cover border-2 border-[#d4af37]" />
              <div>
                <div className="inline-block px-2 py-0.5 rounded-full bg-[#181a24] text-[#d4af37] text-[10px] font-semibold uppercase border border-[#d4af37]/20 mb-1">
                  {selectedContact.belongsTo === 'sofs' ? 'Sofs’ Circle 🇮🇳' : selectedContact.belongsTo === 'mumu' ? 'Mumu’s Circle 🇬🇧' : 'Shared Circle ✨'}
                </div>
                <h3 className="text-xl font-display font-semibold text-[#fff8e7]">{selectedContact.name}</h3>
                <p className="text-xs text-[#d4af37]">{selectedContact.relation}</p>
                <p className="text-xs text-[#a39780]">📍 {selectedContact.location}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-[#c8bfab]">
              <div className="p-3 rounded-2xl bg-[#0e1017] border border-[#d4af37]/15 space-y-1">
                <span className="text-[#d4af37] font-semibold block uppercase text-[10px]">Important Details</span>
                <p>🎂 Birthday: {selectedContact.birthday}</p>
                {selectedContact.phone && <p>📞 Phone: {selectedContact.phone}</p>}
              </div>

              <div>
                <span className="text-[#d4af37] font-semibold block uppercase text-[10px] mb-1.5">Favorite Things &amp; Gift Ideas</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedContact.favoriteThings.map((fav, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-full bg-[#181a24] text-[#f3e7c4] border border-[#d4af37]/20">
                      🎁 {fav}
                    </span>
                  ))}
                </div>
              </div>

              {selectedContact.notes && (
                <div className="p-3 rounded-2xl bg-[#0e1017] border border-[#d4af37]/15">
                  <span className="text-[#d4af37] font-semibold block uppercase text-[10px] mb-1">Personal Notes</span>
                  <p className="font-serif italic leading-relaxed">{selectedContact.notes}</p>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-[#d4af37]/15">
              <button
                onClick={() => { onDeleteContact(selectedContact.id); setSelectedContact(null); }}
                className="text-xs text-rose-400 hover:underline cursor-pointer flex items-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Contact</span>
              </button>
              <button
                onClick={() => setSelectedContact(null)}
                className="px-5 py-2 rounded-xl bg-[#d4af37] text-[#0c0d12] text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Contact Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-[#000000]/75 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="glass-panel max-w-md w-full p-6 sm:p-8 rounded-3xl border border-[#d4af37]/30 shadow-2xl space-y-4 relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-[#a39780] hover:text-[#f3e7c4] text-xl font-bold cursor-pointer"
            >
              &times;
            </button>

            <h3 className="text-xl font-display text-[#fff8e7]">Add Contact to Circle</h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              
              <div>
                <label className="block text-xs font-medium text-[#a39780] mb-1">Which Circle? *</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setBelongsTo('sofs')}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer border transition ${
                      belongsTo === 'sofs'
                        ? 'bg-amber-500 text-[#0c0d12] border-amber-400'
                        : 'bg-[#0e1017] text-[#a39780] border-[#d4af37]/20'
                    }`}
                  >
                    Sofs’ Circle 🇮🇳
                  </button>
                  <button
                    type="button"
                    onClick={() => setBelongsTo('mumu')}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer border transition ${
                      belongsTo === 'mumu'
                        ? 'bg-sky-500 text-white border-sky-400'
                        : 'bg-[#0e1017] text-[#a39780] border-[#d4af37]/20'
                    }`}
                  >
                    Mumu’s Circle 🇬🇧
                  </button>
                  <button
                    type="button"
                    onClick={() => setBelongsTo('both')}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer border transition ${
                      belongsTo === 'both'
                        ? 'bg-rose-500 text-white border-rose-400'
                        : 'bg-[#0e1017] text-[#a39780] border-[#d4af37]/20'
                    }`}
                  >
                    Shared ✨
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#a39780] mb-1">Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Uncle Khalid"
                  className="w-full px-3 py-2 rounded-xl bg-[#0e1017] border border-[#d4af37]/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-[#a39780] mb-1">Relation *</label>
                  <input
                    type="text"
                    required
                    value={relation}
                    onChange={(e) => setRelation(e.target.value)}
                    placeholder="e.g. Uncle of Sofs"
                    className="w-full px-3 py-2 rounded-xl bg-[#0e1017] border border-[#d4af37]/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#a39780] mb-1">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0e1017] border border-[#d4af37]/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="family">Family</option>
                    <option value="friend">Friend</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-[#a39780]">Avatar Photo</label>
                  <button
                    type="button"
                    onClick={() => avatarFileInputRef.current?.click()}
                    className="text-[11px] text-[#d4af37] hover:underline flex items-center space-x-1 cursor-pointer font-medium"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload from Gallery / Device</span>
                  </button>
                  <input
                    type="file"
                    ref={avatarFileInputRef}
                    onChange={handleAvatarFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                <input
                  type="text"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="Paste Image URL or click 'Upload from Gallery'"
                  className="w-full px-3 py-2 rounded-xl bg-[#0e1017] border border-[#d4af37]/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#d4af37]"
                />
                {avatarUrl && avatarUrl.startsWith('data:image') && (
                  <p className="text-[10px] text-emerald-400 font-mono mt-1 flex items-center space-x-1">
                    <ImageIcon className="w-3 h-3 text-emerald-400" />
                    <span>✓ Avatar loaded from gallery</span>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-[#a39780] mb-1">Birthday</label>
                  <input
                    type="text"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    placeholder="e.g. October 05"
                    className="w-full px-3 py-2 rounded-xl bg-[#0e1017] border border-[#d4af37]/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#a39780] mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder={belongsTo === 'sofs' ? 'e.g. Allahabad, India' : 'e.g. Birmingham, UK'}
                    className="w-full px-3 py-2 rounded-xl bg-[#0e1017] border border-[#d4af37]/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#a39780] mb-1">Favorite Things / Gifts (Comma separated)</label>
                <input
                  type="text"
                  value={favoriteThingsInput}
                  onChange={(e) => setFavoriteThingsInput(e.target.value)}
                  placeholder="Masala Chai, Novels, Scones"
                  className="w-full px-3 py-2 rounded-xl bg-[#0e1017] border border-[#d4af37]/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#a39780] mb-1">Personal Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Special memories, tea preferences, how they support us..."
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
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};