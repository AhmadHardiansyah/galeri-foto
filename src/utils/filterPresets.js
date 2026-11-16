// src/utils/filterPresets.js
// Preset filter efek visual untuk foto galeri

export const FILTER_PRESETS = [
  { id: 'normal', name: 'Normal', class: '', icon: '✨' },
  { id: 'vintage', name: 'Vintage', class: 'sepia-[0.38] contrast-[1.1] saturate-[1.15]', icon: '🎞️' },
  { id: 'bw', name: 'B&W (Monochrome)', class: 'grayscale contrast-[1.2] brightness-[1.02]', icon: '🖤' },
  { id: 'warm', name: 'Warm Sunset', class: 'sepia-[0.25] saturate-[1.35] contrast-[1.05]', icon: '🌅' },
  { id: 'cool', name: 'Cool Tone', class: 'hue-rotate-[18deg] saturate-[1.12] contrast-[1.08]', icon: '❄️' },
  { id: 'vivid', name: 'Vivid HDR', class: 'saturate-[1.45] contrast-[1.15] brightness-[1.02]', icon: '🎨' },
  { id: 'cinematic', name: 'Cinematic', class: 'contrast-[1.18] saturate-[1.08] brightness-[0.96]', icon: '🎬' },
];

export const getFilterClass = (presetId) => {
  const match = FILTER_PRESETS.find((f) => f.id === presetId);
  return match ? match.class : '';
};
