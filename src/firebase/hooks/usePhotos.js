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
} from "firebase/firestore";
import { db } from "../init";

// Fungsi mengubah file gambar menjadi string Base64 (Data URL)
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

  // ---------- CREATE (Simpan langsung ke Firestore tanpa perlu Storage) ----------
  const createPhoto = useCallback(async (file, meta, onProgress) => {
    if (onProgress) onProgress(40);

    // Ubah gambar menjadi format data URL
    const base64Data = await fileToBase64(file);
    if (onProgress) onProgress(80);

    // Simpan dokumen ke Firestore
    await addDoc(collection(db, "photos"), {
      ...meta,
      url: base64Data, // Data gambar tersimpan aman di Firestore
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

  return {
    photos,
    loading,
    createPhoto,
    updatePhoto,
    deletePhoto,
  };
};
