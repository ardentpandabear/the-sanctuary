import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Plus, Heart, MapPin, Calendar, Tag, X, ChevronLeft, Trash2, Upload, FolderPlus, Sparkles, Check } from 'lucide-react';
import { PhotoAlbum, PhotoItem } from '../types';

interface PhotoVaultScreenProps {
  albums: PhotoAlbum[];
  onAddPhotoToAlbum: (albumId: string, photo: Omit<PhotoItem, 'id'>) => void;
  onCreateAlbum?: (album: Omit<PhotoAlbum, 'id' | 'photoCount' | 'photos'>) => void;
  onDeleteAlbum?: (albumId: string) => void;
  onDeletePhoto?: (albumId: string, photoId: string) => void;
}

// Aesthetic preset gallery choices for instant picking
const PRESET_GALLERY = [
  { label: 'Chai & Coffee Date', url: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&q=80&w=1000' },
  { label: 'Sunset Walk', url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=1000' },
  { label: 'Peony Flowers', url: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=1000' },
  { label: 'Hot Air Balloons', url: 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?auto=format&fit=crop&q=80&w=1000' },
  { label: 'Candlelight Dinner', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1000' },
  { label: 'Cozy Library Nook', url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=1000' },
  { label: 'Autumn Park Leaves', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1000' },
  { label: 'Rainy City Window', url: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=1000' }
];

export const PhotoVaultScreen: React.FC<PhotoVaultScreenProps> = ({
  albums,
  onAddPhotoToAlbum,
  onCreateAlbum,
  onDeleteAlbum,
  onDeletePhoto
}) => {
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [lightboxPhoto, setLightboxPhoto] = useState<PhotoItem | null>(null);
  
  // Modals
  const [isAddPhotoModalOpen, setIsAddPhotoModalOpen] = useState(false);
  const [isCreateAlbumModalOpen, setIsCreateAlbumModalOpen] = useState(false);

  // Add Photo Form State
  const [targetAlbumId, setTargetAlbumId] = useState<string>(albums[0]?.id || '');
  const [selectedImageSource, setSelectedImageSource] = useState<'upload' | 'preset' | 'url'>('upload');
  const [photoUrl, setPhotoUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [addedBy, setAddedBy] = useState<'sofs' | 'mumu' | 'both'>('both');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Create Album Form State
  const [albumTitle, setAlbumTitle] = useState('');
  const [albumCategory, setAlbumCategory] = useState('Travel');
  const [albumCoverUrl, setAlbumCoverUrl] = useState('');
  const [albumCoverSource, setAlbumCoverSource] = useState<'upload' | 'preset' | 'url'>('preset');
  const albumFileInputRef = useRef<HTMLInputElement>(null);

  const selectedAlbum = albums.find(a => a.id === selectedAlbumId);

  // Handle local image file upload for photo
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle local image file upload for album cover
  const handleAlbumCoverFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAlbumCoverUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPhotoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoUrl || !targetAlbumId) return;

    onAddPhotoToAlbum(targetAlbumId, {
      url: photoUrl,
      caption: caption || 'Captured memory',
      date: date || 'Recent',
      location: location || 'London & Allahabad',
      tags: ['Memory'],
      addedBy
    });

    setPhotoUrl('');
    setCaption('');
    setLocation('');
    setDate('');
    setIsAddPhotoModalOpen(false);
  };

  const handleCreateAlbumSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!albumTitle) return;

    if (onCreateAlbum) {
      onCreateAlbum({
        title: albumTitle,
        category: albumCategory,
        coverUrl: albumCoverUrl || PRESET_GALLERY[0].url
      });
    }

    setAlbumTitle('');
    setAlbumCoverUrl('');
    setIsCreateAlbumModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#171924] via-[#12141d] to-[#1c1913] border border-[#d4af37]/20 shadow-xl">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs text-[#d4af37] mb-1">
            <ImageIcon className="w-4 h-4" />
            <span className="uppercase tracking-widest font-semibold">Captured Moments</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-semibold text-[#fff8e7]">Photo Vault</h2>
          <p className="text-xs sm:text-sm font-serif italic text-[#c8bfab]">
            Visual reflections of our golden hour laughter, travels, and quiet stolen glances.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => setIsCreateAlbumModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-[#1a1c26] border border-[#d4af37]/30 text-[#f3e7c4] font-semibold text-xs hover:border-[#d4af37] transition flex items-center space-x-2 cursor-pointer"
          >
            <FolderPlus className="w-4 h-4 text-[#d4af37]" />
            <span>Create Album</span>
          </button>

          <button
            onClick={() => {
              if (albums.length > 0) setTargetAlbumId(selectedAlbumId || albums[0].id);
              setIsAddPhotoModalOpen(true);
            }}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#aa8022] text-[#0c0d12] font-semibold text-xs tracking-wider hover:brightness-110 transition shadow-lg shadow-[#d4af37]/20 flex items-center space-x-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Photo</span>
          </button>
        </div>
      </div>

      {/* Main View: All Albums Grid vs Selected Album Gallery */}
      {!selectedAlbumId ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {albums.map((album) => (
            <div
              key={album.id}
              className="glass-panel rounded-3xl overflow-hidden border border-[#d4af37]/20 hover:border-[#d4af37]/40 transition duration-300 group flex flex-col justify-between relative"
            >
              <div 
                onClick={() => setSelectedAlbumId(album.id)}
                className="relative aspect-[4/3] overflow-hidden bg-[#12141d] cursor-pointer"
              >
                <img
                  src={album.coverUrl}
                  alt={album.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d12] via-transparent to-transparent" />
                <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-[#0c0d12]/80 backdrop-blur-md border border-[#d4af37]/30 text-[10px] font-bold text-[#d4af37]">
                  {album.photoCount || album.photos.length} Photos
                </span>
              </div>

              <div className="p-5 space-y-2 flex items-center justify-between">
                <div 
                  onClick={() => setSelectedAlbumId(album.id)}
                  className="cursor-pointer space-y-0.5"
                >
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#d4af37]">{album.category}</span>
                  <h3 className="text-lg font-display font-semibold text-[#fff8e7] group-hover:text-[#d4af37] transition">
                    {album.title}
                  </h3>
                </div>

                {onDeleteAlbum && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Are you sure you want to delete album "${album.title}"?`)) {
                        onDeleteAlbum(album.id);
                      }
                    }}
                    title="Delete Album"
                    className="p-2 rounded-xl text-[#a39780] hover:text-rose-400 hover:bg-rose-950/30 transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Back Button & Album Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <button
              onClick={() => setSelectedAlbumId(null)}
              className="px-4 py-2 rounded-xl bg-[#141620] border border-[#d4af37]/20 text-[#a39780] hover:text-[#f3e7c4] text-xs font-semibold transition cursor-pointer flex items-center space-x-2 w-fit"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to All Albums</span>
            </button>

            <div className="flex items-center space-x-3">
              <h3 className="text-xl font-display font-semibold text-[#fff8e7]">
                {selectedAlbum?.title} ({selectedAlbum?.photos.length} Photos)
              </h3>
              {onDeleteAlbum && selectedAlbum && (
                <button
                  onClick={() => {
                    if (confirm(`Delete entire album "${selectedAlbum.title}"?`)) {
                      onDeleteAlbum(selectedAlbum.id);
                      setSelectedAlbumId(null);
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-semibold hover:bg-rose-900/60 transition cursor-pointer flex items-center space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Album</span>
                </button>
              )}
            </div>
          </div>

          {/* Photos Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {selectedAlbum?.photos.map((photo) => (
              <div
                key={photo.id}
                className="glass-panel rounded-2xl overflow-hidden border border-[#d4af37]/15 hover:border-[#d4af37]/40 transition duration-300 group relative"
              >
                <div 
                  onClick={() => setLightboxPhoto(photo)}
                  className="relative aspect-square overflow-hidden bg-[#12141d] cursor-pointer"
                >
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d12] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition p-4 flex flex-col justify-end text-xs text-white">
                    <p className="font-semibold text-[#fff8e7] line-clamp-1">{photo.caption}</p>
                    <p className="text-[10px] text-[#d4af37]">{photo.location} • {photo.date}</p>
                  </div>
                </div>

                {onDeletePhoto && selectedAlbumId && (
                  <button
                    onClick={() => onDeletePhoto(selectedAlbumId, photo.id)}
                    title="Remove Photo"
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-rose-300 hover:text-rose-100 opacity-0 group-hover:opacity-100 transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}

            {selectedAlbum?.photos.length === 0 && (
              <div className="col-span-full text-center py-12 glass-panel rounded-3xl border border-[#d4af37]/20 p-8 space-y-3">
                <ImageIcon className="w-12 h-12 text-[#d4af37]/50 mx-auto" />
                <h4 className="text-lg font-display text-[#fff8e7]">Album is Empty</h4>
                <p className="text-xs text-[#a39780]">Select photos from your gallery or presets to fill this album.</p>
                <button
                  onClick={() => setIsAddPhotoModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#d4af37] text-[#0c0d12] text-xs font-semibold cursor-pointer"
                >
                  Add Photo Now
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxPhoto && (
        <div className="fixed inset-0 bg-[#000000]/90 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="max-w-3xl w-full space-y-4 relative">
            <button
              onClick={() => setLightboxPhoto(null)}
              className="absolute -top-10 right-0 text-[#f3e7c4] hover:text-[#d4af37] text-2xl font-bold cursor-pointer"
            >
              &times;
            </button>

            <div className="rounded-3xl overflow-hidden border border-[#d4af37]/30 bg-[#0c0d12] shadow-2xl">
              <img
                src={lightboxPhoto.url}
                alt={lightboxPhoto.caption}
                className="w-full max-h-[70vh] object-contain bg-black"
              />

              <div className="p-6 space-y-2 border-t border-[#d4af37]/15">
                <div className="flex items-center justify-between text-xs text-[#d4af37]">
                  <span>📍 {lightboxPhoto.location}</span>
                  <span>📅 {lightboxPhoto.date}</span>
                </div>
                <p className="text-base font-serif text-[#fff8e7] leading-relaxed">
                  "{lightboxPhoto.caption}"
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Album Modal */}
      {isCreateAlbumModalOpen && (
        <div className="fixed inset-0 bg-[#000000]/75 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="glass-panel max-w-md w-full p-6 sm:p-8 rounded-3xl border border-[#d4af37]/30 shadow-2xl space-y-4 relative">
            <button
              onClick={() => setIsCreateAlbumModalOpen(false)}
              className="absolute top-4 right-4 text-[#a39780] hover:text-[#f3e7c4] text-xl font-bold cursor-pointer"
            >
              &times;
            </button>

            <h3 className="text-xl font-display text-[#fff8e7]">Create New Album</h3>

            <form onSubmit={handleCreateAlbumSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#a39780] mb-1">Album Title *</label>
                <input
                  type="text"
                  required
                  value={albumTitle}
                  onChange={(e) => setAlbumTitle(e.target.value)}
                  placeholder="e.g. Allahabad Monsoon Walks"
                  className="w-full px-3 py-2 rounded-xl bg-[#0e1017] border border-[#d4af37]/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#a39780] mb-1">Category</label>
                <select
                  value={albumCategory}
                  onChange={(e) => setAlbumCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0e1017] border border-[#d4af37]/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#d4af37]"
                >
                  <option value="Travel">Travel &amp; Adventures</option>
                  <option value="Cozy">Cozy Everyday</option>
                  <option value="Milestones">Special Milestones</option>
                  <option value="Nature">Nature &amp; Sunsets</option>
                  <option value="Food">Culinary Delights</option>
                  <option value="Family">Family &amp; Friends</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#a39780] mb-1">Album Cover Image</label>
                <div className="flex space-x-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setAlbumCoverSource('preset')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer border ${
                      albumCoverSource === 'preset' ? 'bg-[#d4af37] text-[#0c0d12] border-[#d4af37]' : 'bg-[#0e1017] text-[#a39780] border-[#d4af37]/20'
                    }`}
                  >
                    Preset Gallery
                  </button>
                  <button
                    type="button"
                    onClick={() => setAlbumCoverSource('upload')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer border ${
                      albumCoverSource === 'upload' ? 'bg-[#d4af37] text-[#0c0d12] border-[#d4af37]' : 'bg-[#0e1017] text-[#a39780] border-[#d4af37]/20'
                    }`}
                  >
                    Upload File
                  </button>
                </div>

                {albumCoverSource === 'preset' ? (
                  <div className="grid grid-cols-4 gap-2 max-h-36 overflow-y-auto pr-1">
                    {PRESET_GALLERY.map((p, idx) => (
                      <div
                        key={idx}
                        onClick={() => setAlbumCoverUrl(p.url)}
                        className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 ${
                          albumCoverUrl === p.url ? 'border-[#d4af37]' : 'border-transparent'
                        }`}
                      >
                        <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="file"
                      ref={albumFileInputRef}
                      accept="image/*"
                      onChange={handleAlbumCoverFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => albumFileInputRef.current?.click()}
                      className="w-full p-4 rounded-xl border border-dashed border-[#d4af37]/40 bg-[#0e1017] text-xs text-[#a39780] hover:text-[#f3e7c4] flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <Upload className="w-4 h-4 text-[#d4af37]" />
                      <span>Select Cover Image File</span>
                    </button>
                    {albumCoverUrl && (
                      <div className="w-full h-24 rounded-xl overflow-hidden border border-[#d4af37]/30">
                        <img src={albumCoverUrl} alt="Cover Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-[#d4af37]/15">
                <button
                  type="button"
                  onClick={() => setIsCreateAlbumModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-[#a39780] hover:text-[#f3e7c4] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#d4af37] text-[#0c0d12] text-xs font-semibold hover:brightness-110 cursor-pointer"
                >
                  Create Album
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Photo Modal (Gallery / Upload / Preset Picker) */}
      {isAddPhotoModalOpen && (
        <div className="fixed inset-0 bg-[#000000]/75 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="glass-panel max-w-lg w-full p-6 sm:p-8 rounded-3xl border border-[#d4af37]/30 shadow-2xl space-y-4 relative">
            <button
              onClick={() => setIsAddPhotoModalOpen(false)}
              className="absolute top-4 right-4 text-[#a39780] hover:text-[#f3e7c4] text-xl font-bold cursor-pointer"
            >
              &times;
            </button>

            <h3 className="text-xl font-display text-[#fff8e7]">Add Photo to Gallery</h3>

            <form onSubmit={handleAddPhotoSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#a39780] mb-1">Select Target Album *</label>
                <select
                  value={targetAlbumId}
                  onChange={(e) => setTargetAlbumId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0e1017] border border-[#d4af37]/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#d4af37]"
                >
                  {albums.map((a) => (
                    <option key={a.id} value={a.id}>{a.title} ({a.category})</option>
                  ))}
                </select>
              </div>

              {/* Photo Source Selector */}
              <div>
                <label className="block text-xs font-medium text-[#a39780] mb-1.5">Choose Photo Source</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedImageSource('upload')}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer border transition flex items-center justify-center space-x-1.5 ${
                      selectedImageSource === 'upload'
                        ? 'bg-[#d4af37] text-[#0c0d12] border-[#d4af37]'
                        : 'bg-[#0e1017] text-[#a39780] border-[#d4af37]/20 hover:text-[#f3e7c4]'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload File</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedImageSource('preset')}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer border transition flex items-center justify-center space-x-1.5 ${
                      selectedImageSource === 'preset'
                        ? 'bg-[#d4af37] text-[#0c0d12] border-[#d4af37]'
                        : 'bg-[#0e1017] text-[#a39780] border-[#d4af37]/20 hover:text-[#f3e7c4]'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Preset Gallery</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedImageSource('url')}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer border transition flex items-center justify-center space-x-1.5 ${
                      selectedImageSource === 'url'
                        ? 'bg-[#d4af37] text-[#0c0d12] border-[#d4af37]'
                        : 'bg-[#0e1017] text-[#a39780] border-[#d4af37]/20 hover:text-[#f3e7c4]'
                    }`}
                  >
                    <span>Image URL</span>
                  </button>
                </div>
              </div>

              {/* Upload File Input */}
              {selectedImageSource === 'upload' && (
                <div className="space-y-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full p-6 rounded-2xl border-2 border-dashed border-[#d4af37]/40 bg-[#0e1017] text-xs text-[#a39780] hover:text-[#f3e7c4] hover:border-[#d4af37] transition flex flex-col items-center justify-center space-y-2 cursor-pointer"
                  >
                    <Upload className="w-6 h-6 text-[#d4af37]" />
                    <span className="font-semibold text-[#f3e7c4]">Click to Choose Photo from Device Gallery</span>
                    <span className="text-[10px] text-[#a39780]">PNG, JPG, WEBP, GIF supported</span>
                  </button>

                  {photoUrl && (
                    <div className="relative w-full h-36 rounded-2xl overflow-hidden border border-[#d4af37]/30">
                      <img src={photoUrl} alt="Uploaded Preview" className="w-full h-full object-cover" />
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/80 text-[10px] text-[#d4af37] font-semibold">
                        Preview Ready
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Preset Gallery Picker */}
              {selectedImageSource === 'preset' && (
                <div className="space-y-2">
                  <span className="text-[10px] text-[#a39780] block">Click an aesthetic photo from gallery:</span>
                  <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1">
                    {PRESET_GALLERY.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => setPhotoUrl(item.url)}
                        className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition ${
                          photoUrl === item.url ? 'border-[#d4af37] scale-95 shadow-lg' : 'border-transparent opacity-80 hover:opacity-100'
                        }`}
                      >
                        <img src={item.url} alt={item.label} className="w-full h-full object-cover" />
                        {photoUrl === item.url && (
                          <div className="absolute inset-0 bg-[#d4af37]/30 flex items-center justify-center">
                            <Check className="w-5 h-5 text-[#0c0d12] bg-[#d4af37] rounded-full p-0.5" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom Image URL */}
              {selectedImageSource === 'url' && (
                <div>
                  <input
                    type="url"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-[#0e1017] border border-[#d4af37]/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-[#a39780] mb-1">Caption / Story Note</label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="e.g. Afternoon tea in Allahabad"
                  className="w-full px-3 py-2 rounded-xl bg-[#0e1017] border border-[#d4af37]/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-[#a39780] mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Allahabad / Birmingham"
                    className="w-full px-3 py-2 rounded-xl bg-[#0e1017] border border-[#d4af37]/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#a39780] mb-1">Date</label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="e.g. Recent"
                    className="w-full px-3 py-2 rounded-xl bg-[#0e1017] border border-[#d4af37]/30 text-xs text-[#f3e7c4] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-[#d4af37]/15">
                <button
                  type="button"
                  onClick={() => setIsAddPhotoModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-[#a39780] hover:text-[#f3e7c4] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!photoUrl}
                  className="px-5 py-2 rounded-xl bg-[#d4af37] text-[#0c0d12] text-xs font-semibold hover:brightness-110 disabled:opacity-50 cursor-pointer"
                >
                  Save Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
