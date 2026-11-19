// src/firebase/hooks/useNotifications.js
import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  writeBatch,
  addDoc,
} from 'firebase/firestore';
import { db } from '../init';

export const useNotifications = (isAdmin = false) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Real-time listener koleksi notifications dari Firestore
  useEffect(() => {
    // Hanya fetch secara aktif jika admin sudah login (atau saat komponen aktif)
    const q = query(
      collection(db, 'notifications'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        setNotifications(items);
        setLoading(false);
      },
      (err) => {
        console.warn('Firestore notifications listener notice:', err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Hitung jumlah notifikasi yang belum dibaca
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Tandai 1 notifikasi sebagai sudah dibaca
  const markAsRead = useCallback(async (id) => {
    try {
      const notifRef = doc(db, 'notifications', id);
      await updateDoc(notifRef, { read: true });
    } catch (err) {
      console.error('Gagal menandai notifikasi dibaca:', err);
    }
  }, []);

  // Tandai SEMUA notifikasi sebagai sudah dibaca
  const markAllAsRead = useCallback(async () => {
    try {
      const unreadList = notifications.filter((n) => !n.read);
      if (unreadList.length === 0) return;

      const batch = writeBatch(db);
      unreadList.forEach((n) => {
        const ref = doc(db, 'notifications', n.id);
        batch.update(ref, { read: true });
      });
      await batch.commit();
    } catch (err) {
      console.error('Gagal menandai semua dibaca:', err);
    }
  }, [notifications]);

  // Hapus 1 notifikasi
  const deleteNotification = useCallback(async (id) => {
    try {
      await deleteDoc(doc(db, 'notifications', id));
    } catch (err) {
      console.error('Gagal menghapus notifikasi:', err);
    }
  }, []);

  // Bersihkan semua notifikasi
  const clearAllNotifications = useCallback(async () => {
    try {
      const batch = writeBatch(db);
      notifications.forEach((n) => {
        const ref = doc(db, 'notifications', n.id);
        batch.delete(ref);
      });
      await batch.commit();
    } catch (err) {
      console.error('Gagal membersihkan notifikasi:', err);
    }
  }, [notifications]);

  // Helper untuk menambah notifikasi baru (bisa dipanggil dari mana saja)
  const addNotification = useCallback(async (notifData) => {
    try {
      await addDoc(collection(db, 'notifications'), {
        ...notifData,
        createdAt: new Date(),
        read: false,
      });
    } catch (err) {
      console.error('Gagal mencatat notifikasi:', err);
    }
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    addNotification,
  };
};
