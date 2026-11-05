// src/firebase/hooks/useProfile.js
import { useState, useEffect, useCallback } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../init';
import { profileData as defaultProfile } from '../../data/profile';

export const useProfile = () => {
  const [profile, setProfile] = useState(defaultProfile);
  const [loading, setLoading] = useState(true);

  // Sync profile real-time dari Firestore
  useEffect(() => {
    const profileRef = doc(db, 'settings', 'profile');
    const unsubscribe = onSnapshot(
      profileRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setProfile({ ...defaultProfile, ...docSnap.data() });
        } else {
          setProfile(defaultProfile);
        }
        setLoading(false);
      },
      (err) => {
        console.warn('Gagal membaca profil dari Firestore, memakai data lokal:', err);
        setProfile(defaultProfile);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Update profile ke Firestore
  const updateProfile = useCallback(async (newProfile) => {
    const profileRef = doc(db, 'settings', 'profile');
    await setDoc(profileRef, newProfile, { merge: true });
  }, []);

  return { profile, loading, updateProfile };
};

