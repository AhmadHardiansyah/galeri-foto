// src/firebase/hooks/useGuestbook.js
import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
  increment,
} from 'firebase/firestore';
import { db } from '../init';

export const useGuestbook = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync pesan buku tamu secara real-time dari Firestore
  useEffect(() => {
    const q = query(collection(db, 'guestbook'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        setMessages(list);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching guestbook:', err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Tambah pesan baru ke buku tamu
  const addMessage = useCallback(async ({ name, relationship, message, avatarEmoji }) => {
    await addDoc(collection(db, 'guestbook'), {
      name: name.trim() || 'Teman Anonim',
      relationship: relationship || 'Teman',
      message: message.trim(),
      avatarEmoji: avatarEmoji || '✨',
      likes: 0,
      createdAt: new Date(),
    });
  }, []);

  // Hapus pesan (khusus Admin jika ada spam)
  const deleteMessage = useCallback(async (id) => {
    await deleteDoc(doc(db, 'guestbook', id));
  }, []);

  // Like pesan teman
  const likeMessage = useCallback(async (id) => {
    const msgRef = doc(db, 'guestbook', id);
    await updateDoc(msgRef, {
      likes: increment(1),
    });
  }, []);

  return {
    messages,
    loading,
    addMessage,
    deleteMessage,
    likeMessage,
  };
};
