import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import CategoryFilter from './components/CategoryFilter';
import PhotoCard from './components/PhotoCard';
import LightboxModal from './components/LightboxModal';
import UploadModal from './components/UploadModal';
import LoginModal from './components/LoginModal';
import EditProfileModal from './components/EditProfileModal';
import EditPhotoModal from './components/EditPhotoModal';
import SplashScreen from './components/SplashScreen';
import Guestbook from './components/Guestbook';
import FavoriteMusic from './components/FavoriteMusic';
import Footer from './components/Footer';
import NotificationModal from './components/NotificationModal';
import { ImageOff, Upload, Camera, MessageCircle, Music } from 'lucide-react';
import { usePhotos } from './firebase/hooks/usePhotos';
import { useProfile } from './firebase/hooks/useProfile';
import { useGuestbook } from './firebase/hooks/useGuestbook';
import { useNotifications } from './firebase/hooks/useNotifications';
import { auth, onAuthStateChanged, logoutAdmin } from './firebase/init';

export default function App() {
  const { photos, loading: photosLoading, createPhoto, updatePhoto, deletePhoto, toggleLikePhoto } = usePhotos();
  const { profile, updateProfile } = useProfile();
  const {
    messages: guestMessages,
    loading: guestLoading,
    addMessage: sendGuestMessage,
    deleteMessage: deleteGuestMessage,
    likeMessage: likeGuestMessage,
  } = useGuestbook();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
  } = useNotifications();

  // Tab State: 'gallery' | 'guestbook'
  const [activeTab, setActiveTab] = useState('gallery');

  const [activeCategory, setActiveCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [layoutMode, setLayoutMode] = useState('masonry');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  
  // Splash Screen State
  const [showSplash, setShowSplash] = useState(true);

  // Modals state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Authentication State (Admin)
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Persistent Likes in LocalStorage
  const [likedPhotos, setLikedPhotos] = useState(() => {
    try {
      const saved = localStorage.getItem('bio_gallery_likes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('bio_gallery_theme');
      if (savedTheme !== null) return savedTheme === 'dark';
      return true;
    } catch {
      return true;
    }
  });

  // Apply dark mode class to html
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('bio_gallery_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('bio_gallery_theme', 'light');
    }
  }, [isDarkMode]);

  // Handle like toggle (stored in localStorage & sync to Firestore + create notification)
  const handleToggleLike = (photoId) => {
    const isCurrentlyLiked = !!likedPhotos[photoId];
    setLikedPhotos((prev) => {
      const updated = { ...prev, [photoId]: !isCurrentlyLiked };
      try {
        localStorage.setItem('bio_gallery_likes', JSON.stringify(updated));
      } catch (e) { /* ignored */ }
      return updated;
    });

    // Update Firestore like count & buat notifikasi jika baru memberi like
    const targetPhoto = photos.find((p) => p.id === photoId);
    if (targetPhoto && toggleLikePhoto) {
      toggleLikePhoto(targetPhoto, isCurrentlyLiked);
    }
  };

  // Handle upload from modal form
  const handleUpload = async (file, meta, onProgress) => {
    setUploading(true);
    try {
      await createPhoto(file, meta, onProgress);
      setShowUploadModal(false);
    } catch (err) {
      console.error('Upload failed:', err);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  // Handle delete photo (admin only)
  const handleDelete = async (photo) => {
    if (!currentUser) return;
    if (!window.confirm(`Hapus foto "${photo.title}"?`)) return;
    try {
      await deletePhoto(photo.id);
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Gagal menghapus foto.');
    }
  };

  // Pemetaan kategori lama ke nama baru agar selalu sinkron
  const normalizedPhotos = useMemo(() => {
    const categoryMap = {
      'Teman SMP': 'SMP',
      'Teman SMK': 'SMK',
      'Keluarga': 'Family',
      'Teman Rumah': 'Rumah',
      'Momen Spesial': 'Momen',
    };
    return photos.map((p) => ({
      ...p,
      category: categoryMap[p.category] || p.category,
    }));
  }, [photos]);

  // Gabungan semua kategori (bawaan + kategori baru yang pernah diupload)
  const allCategories = useMemo(() => {
    const defaultList = ['Semua', 'SMP', 'SMK', 'Family', 'Rumah', 'Momen', 'Kampus'];
    const legacyList = ['Teman SMP', 'Teman SMK', 'Keluarga', 'Teman Rumah', 'Momen Spesial'];
    const fromPhotos = normalizedPhotos
      .map((p) => p.category)
      .filter((c) => Boolean(c) && !legacyList.includes(c));
    return Array.from(new Set([...defaultList, ...fromPhotos]));
  }, [normalizedPhotos]);

  // Jumlah foto di setiap kelompok / kategori
  const categoryCounts = useMemo(() => {
    const counts = { Semua: normalizedPhotos.length };
    normalizedPhotos.forEach((p) => {
      if (p.category) {
        counts[p.category] = (counts[p.category] || 0) + 1;
      }
    });
    return counts;
  }, [normalizedPhotos]);

  // Filtered photos based on Category and Search
  const filteredPhotos = useMemo(() => {
    return normalizedPhotos.filter((photo) => {
      const matchCategory =
        activeCategory === 'Semua' || photo.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        (photo.title && photo.title.toLowerCase().includes(q)) ||
        (photo.location && photo.location.toLowerCase().includes(q)) ||
        (photo.camera && photo.camera.toLowerCase().includes(q)) ||
        (photo.category && photo.category.toLowerCase().includes(q));
      return matchCategory && matchSearch;
    });
  }, [normalizedPhotos, activeCategory, searchQuery]);

  // Total likes count
  const totalLikes = useMemo(() => {
    return photos.reduce((acc, p) => acc + (p.likes || 0) + (likedPhotos[p.id] ? 1 : 0), 0);
  }, [photos, likedPhotos]);

  // Lightbox handlers
  const handleOpenLightbox = (photo) => {
    const idx = filteredPhotos.findIndex((p) => p.id === photo.id);
    if (idx !== -1) setSelectedPhotoIndex(idx);
  };
  const handleNextPhoto = () => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((prev) => (prev + 1) % filteredPhotos.length);
  };
  const handlePrevPhoto = () => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((prev) => (prev - 1 + filteredPhotos.length) % filteredPhotos.length);
  };

  // Buka foto dari ID notifikasi
  const handleOpenPhotoById = (photoId) => {
    setActiveTab('gallery');
    const idx = filteredPhotos.findIndex((p) => p.id === photoId);
    if (idx !== -1) {
      setSelectedPhotoIndex(idx);
    } else {
      setActiveCategory('Semua');
      setSearchQuery('');
      setTimeout(() => {
        const i = normalizedPhotos.findIndex((p) => p.id === photoId);
        if (i !== -1) setSelectedPhotoIndex(i);
      }, 50);
    }
  };

  const selectedPhoto = selectedPhotoIndex !== null ? filteredPhotos[selectedPhotoIndex] : null;

  return (
    <div className="min-h-screen bg-[#faf7f2] dark:bg-[#12100e] text-stone-900 dark:text-stone-100 transition-colors duration-300">
      {/* Background warm film ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-32 -left-20 w-[550px] h-[550px] bg-gradient-to-tr from-amber-600/10 via-orange-500/10 to-transparent blur-[140px] rounded-full animate-aurora-1" />
        <div className="absolute top-1/4 -right-24 w-[600px] h-[600px] bg-gradient-to-bl from-amber-700/10 via-stone-800/10 to-transparent blur-[150px] rounded-full animate-aurora-2" />
        <div className="absolute -bottom-32 left-1/3 w-[650px] h-[450px] bg-gradient-to-t from-orange-500/10 via-amber-300/5 to-transparent blur-[150px] rounded-full animate-pulse-glow" />
      </div>

      <div className="relative z-10">
        {/* Profile Header */}
        <Header
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          totalPhotos={photos.length}
          totalLikes={totalLikes}
          currentUser={currentUser}
          onOpenLogin={() => setShowLoginModal(true)}
          onLogout={logoutAdmin}
          profile={profile}
          onEditProfile={() => setShowEditProfileModal(true)}
          onOpenNotifications={() => setShowNotificationsModal(true)}
          unreadCount={unreadCount}
        />

        {/* ========================================================================= */}
        {/* TAB SWITCHER: Galeri Foto VS Buku Tamu VS Musik Favorit */}
        {/* ========================================================================= */}
        <div className="flex justify-center mb-6 px-4">
          <div className="inline-flex p-1.5 bg-[#ede6dc]/80 dark:bg-[#1c1815]/90 border border-[#dfd4c4] dark:border-stone-800/80 rounded-full shadow-sm backdrop-blur flex-wrap justify-center gap-1.5">
            <button
              onClick={() => setActiveTab('gallery')}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-xs font-bold transition-all transform hover:scale-105 active:scale-95 ${
                activeTab === 'gallery'
                  ? 'bg-gradient-to-r from-amber-800 via-amber-900 to-stone-900 text-[#fcfaf7] shadow-md shadow-amber-950/30 scale-100'
                  : 'text-stone-600 dark:text-stone-400 hover:text-amber-800 dark:hover:text-amber-300'
              }`}
            >
              <span>🎞️ Galeri Foto</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'gallery'
                  ? 'bg-white/20 text-white'
                  : 'bg-amber-200/60 dark:bg-stone-800 text-amber-900 dark:text-amber-300'
              }`}>
                {photos.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('guestbook')}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-xs font-bold transition-all transform hover:scale-105 active:scale-95 ${
                activeTab === 'guestbook'
                  ? 'bg-gradient-to-r from-amber-800 via-amber-900 to-stone-900 text-[#fcfaf7] shadow-md shadow-amber-950/30 scale-100'
                  : 'text-stone-600 dark:text-stone-400 hover:text-amber-800 dark:hover:text-amber-300'
              }`}
            >
              <span>📻 Buku Tamu</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-amber-700 text-white">
                {guestMessages.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('music')}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-xs font-bold transition-all transform hover:scale-105 active:scale-95 ${
                activeTab === 'music'
                  ? 'bg-gradient-to-r from-amber-800 via-amber-900 to-stone-900 text-[#fcfaf7] shadow-md shadow-amber-950/30 scale-100'
                  : 'text-stone-600 dark:text-stone-400 hover:text-amber-800 dark:hover:text-amber-300'
              }`}
            >
              <span>📼 Musik & Band</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VIEW 1: GALERI FOTO */}
        {/* ========================================================================= */}
        {activeTab === 'gallery' && (
          <div className="animate-fade-in">
            {/* Admin upload button (HANYA MUNCUL JIKA PEMILIK SUDAH LOGIN) */}
            {currentUser && (
              <div className="flex justify-center mb-5">
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-700 via-orange-700 to-stone-900 hover:from-amber-800 hover:to-stone-950 text-white text-xs font-bold rounded-full shadow-lg shadow-amber-950/25 transition-all duration-200 transform hover:scale-105 active:scale-95 border border-amber-600/30"
                >
                  <Upload className="w-4 h-4 text-amber-300" />
                  <span>+ Upload Foto Baru (Admin)</span>
                </button>
              </div>
            )}

            {/* Filter & Layout Controls */}
            <CategoryFilter
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              layoutMode={layoutMode}
              setLayoutMode={setLayoutMode}
              categories={allCategories}
              categoryCounts={categoryCounts}
            />

            {/* Gallery Grid */}
            <main className="max-w-5xl mx-auto px-4">
              {photosLoading ? (
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="break-inside-avoid rounded-2xl bg-zinc-200 dark:bg-zinc-800 animate-pulse"
                      style={{ height: i % 2 === 0 ? 280 : 200 }}
                    />
                  ))}
                </div>
              ) : filteredPhotos.length === 0 ? (
                <div className="py-20 text-center">
                  <div className="inline-flex p-4 rounded-full bg-zinc-100 dark:bg-zinc-900 mb-3 text-zinc-400">
                    <ImageOff className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-semibold text-zinc-700 dark:text-zinc-300">
                    {photos.length === 0 ? 'Belum ada foto dalam galeri.' : 'Tidak ada foto ditemukan'}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1">
                    {photos.length === 0 && currentUser
                      ? 'Klik tombol "Upload Foto Baru (Admin)" di atas.'
                      : 'Coba gunakan kata kunci lain atau pilih kategori "Semua".'}
                  </p>
                  {photos.length > 0 && (
                    <button
                      onClick={() => { setActiveCategory('Semua'); setSearchQuery(''); }}
                      className="mt-4 px-4 py-1.5 text-xs font-medium rounded-full bg-rose-500 text-white hover:bg-rose-600 transition-colors"
                    >
                      Reset Filter
                    </button>
                  )}
                </div>
              ) : layoutMode === 'masonry' ? (
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance] space-y-4">
                  {filteredPhotos.map((photo) => (
                    <div key={photo.id} className="break-inside-avoid">
                      <PhotoCard
                        photo={photo}
                        onOpenLightbox={handleOpenLightbox}
                        onDelete={handleDelete}
                        onEdit={(p) => setEditingPhoto(p)}
                        layoutMode={layoutMode}
                        isLiked={!!likedPhotos[photo.id]}
                        onToggleLike={handleToggleLike}
                        isAdmin={!!currentUser}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                  {filteredPhotos.map((photo) => (
                    <PhotoCard
                      key={photo.id}
                      photo={photo}
                      onOpenLightbox={handleOpenLightbox}
                      onDelete={handleDelete}
                      onEdit={(p) => setEditingPhoto(p)}
                      layoutMode={layoutMode}
                      isLiked={!!likedPhotos[photo.id]}
                      onToggleLike={handleToggleLike}
                      isAdmin={!!currentUser}
                    />
                  ))}
                </div>
              )}
            </main>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: BUKU TAMU (GUESTBOOK) */}
        {/* ========================================================================= */}
        {activeTab === 'guestbook' && (
          <Guestbook
            messages={guestMessages}
            loading={guestLoading}
            onSendMessage={sendGuestMessage}
            onDeleteMessage={deleteGuestMessage}
            onLikeMessage={likeGuestMessage}
            isAdmin={!!currentUser}
          />
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: MUSIK & BAND FAVORIT */}
        {/* ========================================================================= */}
        {activeTab === 'music' && (
          <FavoriteMusic />
        )}

        {/* Lightbox Modal */}
        {selectedPhoto && (
          <LightboxModal
            photo={selectedPhoto}
            onClose={() => setSelectedPhotoIndex(null)}
            onNext={handleNextPhoto}
            onPrev={handlePrevPhoto}
            isLiked={!!likedPhotos[selectedPhoto.id]}
            onToggleLike={handleToggleLike}
            isAdmin={!!currentUser}
            onEditPhoto={(p) => setEditingPhoto(p)}
            onDeletePhoto={handleDelete}
          />
        )}

        {/* Upload Modal (Hanya jika admin login) */}
        {showUploadModal && currentUser && (
          <UploadModal
            onClose={() => setShowUploadModal(false)}
            onUpload={handleUpload}
            uploading={uploading}
            availableCategories={allCategories}
          />
        )}

        {/* Login Modal */}
        {showLoginModal && (
          <LoginModal
            onClose={() => setShowLoginModal(false)}
            onSuccess={() => setShowLoginModal(false)}
          />
        )}

        {/* Edit Profile Modal (Hanya jika admin login) */}
        {showEditProfileModal && currentUser && (
          <EditProfileModal
            profile={profile}
            onClose={() => setShowEditProfileModal(false)}
            onSave={updateProfile}
          />
        )}

        {/* Edit Photo Modal (Hanya jika admin login) */}
        {editingPhoto && currentUser && (
          <EditPhotoModal
            photo={editingPhoto}
            onClose={() => setEditingPhoto(null)}
            onSave={async (id, updatedFields) => {
              await updatePhoto(id, updatedFields);
              setEditingPhoto(null);
            }}
            availableCategories={allCategories}
          />
        )}

        {/* Notification Modal (Admin Activity Feed) */}
        <NotificationModal
          isOpen={showNotificationsModal}
          onClose={() => setShowNotificationsModal(false)}
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
          onDeleteNotification={deleteNotification}
          onClearAll={clearAllNotifications}
          onOpenPhotoById={handleOpenPhotoById}
          onOpenGuestbook={() => setActiveTab('guestbook')}
        />

        <Footer />

        {/* Splash Screen (Intro layar pembuka ala aplikasi) */}
        {showSplash && (
          <SplashScreen onFinish={() => setShowSplash(false)} />
        )}
      </div>
    </div>
  );
}
