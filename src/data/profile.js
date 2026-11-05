// ==============================================================================
// PANDUAN MENGUBAH DATA PROFIL:
// Anda cukup mengubah teks atau link di bawah ini sesuai dengan data diri Anda.
// Foto profil bisa berupa file di folder public (misal: "/profile.jpg") atau link web.
// ==============================================================================

export const profileData = {
  name: "Ahmad Hardiansyah",
  username: "matt",
  tagline: "",
  bio: "Selamat datang di website pribadi saya, website ini untuk menyimpan foto bersama teman dan keluarga saya.",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  location: "Bogor, Indonesia",
  status: "Mahasiwa",

  // Link sosial media / kontak untuk bio
  socials: [
    {
      name: "WhatsApp",
      url: "https://wa.me/6281234567890?text=Halo%20saya%20tertarik%20dengan%20karya%20foto%20Anda",
      icon: "MessageCircle",
      primary: false,
      label: "Hubungi via WA",
    },
    {
      name: "Email",
      url: "ahmadyansyah001@gmail.com",
      icon: "Mail",
      primary: false,
      label: "Kirim Email",
    },
    {
      name: "TikTok / Portofolio",
      url: "https://www.tiktok.com/@66stresss?is_from_webapp=1&sender_device=pc",
      icon: "Share2",
      primary: false,
      label: "Lihat TikTok",
    },
  ],
};

