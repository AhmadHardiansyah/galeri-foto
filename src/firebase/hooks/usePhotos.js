// src/firebase/hooks/usePhotos.js
import { useEffect, useState, useCallback } from "react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  increment,
} from "firebase/firestore";
import { db } from "../init";

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export const usePhotos = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  // ---------- READ (real-time listener dari Firestore) ----------
  useEffect(() => {
    const q = query(collection(db, "photos"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        setPhotos(list);
        setLoading(false);
      },
      (err) => {
        console.error("Firestore read error:", err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // ---------- CREATE (Mendukung File maupun Data URL langsung) ----------
  const createPhoto = useCallback(async (imageInput, meta, onProgress) => {
    if (onProgress) onProgress(40);

    let dataUrl = '';
    if (typeof imageInput === 'string' && imageInput.startsWith('data:image/')) {
      dataUrl = imageInput;
    } else {
      dataUrl = await fileToBase64(imageInput);
    }

    if (onProgress) onProgress(80);

    // Simpan dokumen ke Firestore
    await addDoc(collection(db, "photos"), {
      ...meta,
      url: dataUrl,
      createdAt: new Date(),
    });

    if (onProgress) onProgress(100);
  }, []);

  // ---------- UPDATE ----------
  const updatePhoto = useCallback(async (id, newMeta) => {
    const photoRef = doc(db, "photos", id);
    await updateDoc(photoRef, newMeta);
  }, []);

  // ---------- DELETE ----------
  const deletePhoto = useCallback(async (id) => {
    await deleteDoc(doc(db, "photos", id));
  }, []);

  // ---------- TOGGLE LIKE & CATAT NOTIFIKASI ----------
  const toggleLikePhoto = useCallback(async (photo, isCurrentlyLiked) => {
    if (!photo || !photo.id) return;
    try {
      const photoRef = doc(db, "photos", photo.id);
      const inc = isCurrentlyLiked ? -1 : 1;
      await updateDoc(photoRef, {
        likes: increment(inc),
      });

      // Jika aksi ini adalah memberi like (+1), buat dokumen notifikasi
      if (!isCurrentlyLiked) {
        await addDoc(collection(db, "notifications"), {
          type: "photo_like",
          photoId: photo.id,
          photoTitle: photo.title || "Foto Kenangan",
          photoCategory: photo.category || "Momen",
          photoUrl: photo.url || photo.src || "",
          createdAt: new Date(),
          read: false,
        });
      }
    } catch (err) {
      console.warn("Gagal update like atau notifikasi ke Firestore:", err);
    }
  }, []);

  return {
    photos,
    loading,
    createPhoto,
    updatePhoto,
    deletePhoto,
    toggleLikePhoto,
  };
};
