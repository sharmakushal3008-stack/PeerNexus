// Curated High-Quality Avatar Presets for Campus Students & Coders

export const AVATAR_COLLECTIONS = [
  {
    id: 'students',
    name: 'Campus Students',
    style: 'avataaars',
    avatars: [
      { id: 'av-1', name: 'Alex', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
      { id: 'av-2', name: 'Maya', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya' },
      { id: 'av-3', name: 'Kushal', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kushal' },
      { id: 'av-4', name: 'Sophia', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia' },
      { id: 'av-5', name: 'Liam', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Liam' },
      { id: 'av-6', name: 'Emma', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma' },
      { id: 'av-7', name: 'Noah', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Noah' },
      { id: 'av-8', name: 'Ava', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ava' }
    ]
  },
  {
    id: 'tech',
    name: 'Tech & AI Bots',
    style: 'bottts',
    avatars: [
      { id: 'bot-1', name: 'Cyber', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Cyber' },
      { id: 'bot-2', name: 'Sparky', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Sparky' },
      { id: 'bot-3', name: 'Gizmo', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Gizmo' },
      { id: 'bot-4', name: 'Circuit', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Circuit' },
      { id: 'bot-5', name: 'Byte', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Byte' },
      { id: 'bot-6', name: 'Neon', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Neon' },
      { id: 'bot-7', name: 'Matrix', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Matrix' },
      { id: 'bot-8', name: 'Quantum', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Quantum' }
    ]
  },
  {
    id: 'illustrated',
    name: 'Modern Illustrated',
    style: 'lorelei',
    avatars: [
      { id: 'lor-1', name: 'Aria', url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Aria' },
      { id: 'lor-2', name: 'Leo', url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Leo' },
      { id: 'lor-3', name: 'Freya', url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Freya' },
      { id: 'lor-4', name: 'Jasper', url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Jasper' },
      { id: 'lor-5', name: 'Milo', url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Milo' },
      { id: 'lor-6', name: 'Luna', url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Luna' },
      { id: 'lor-7', name: 'Felix', url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Felix' },
      { id: 'lor-8', name: 'Chloe', url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Chloe' }
    ]
  },
  {
    id: 'adventurer',
    name: 'Game Adventurers',
    style: 'adventurer',
    avatars: [
      { id: 'adv-1', name: 'Hero', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Hero' },
      { id: 'adv-2', name: 'Phoenix', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Phoenix' },
      { id: 'adv-3', name: 'Blaze', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Blaze' },
      { id: 'adv-4', name: 'Shadow', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Shadow' },
      { id: 'adv-5', name: 'Vortex', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Vortex' },
      { id: 'adv-6', name: 'Titan', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Titan' },
      { id: 'adv-7', name: 'Storm', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Storm' },
      { id: 'adv-8', name: 'Ranger', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Ranger' }
    ]
  }
];

export const generateRandomAvatar = () => {
  const styles = ['avataaars', 'bottts', 'lorelei', 'adventurer', 'micah'];
  const randomStyle = styles[Math.floor(Math.random() * styles.length)];
  const randomSeed = `usr-${Math.random().toString(36).substring(2, 9)}`;
  return `https://api.dicebear.com/7.x/${randomStyle}/svg?seed=${randomSeed}`;
};
