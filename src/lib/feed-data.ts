// Mock data for the TikTok-style feed.
// In a real app this would come from the Neon database via a server function.

export type Author = {
  id: string;
  username: string; // handle without the @
  displayName: string;
  verified: boolean;
  /** Tailwind gradient classes used for the avatar circle. */
  avatar: string;
};

export type Comment = {
  id: string;
  author: string; // username (no @)
  avatar: string; // gradient classes
  text: string;
  time: string;
  likes: number;
  liked?: boolean;
};

export type VideoPost = {
  id: string;
  videoUrl: string;
  mediaType: "video" | "photo";
  author: Author;
  caption: string;
  hashtags: string[];
  music: string;
  soundId: string;
  likes: number;
  comments: number;
  shares: number;
  bookmarks: number;
  commentsList: Comment[];
  /** Client-side UI state (not from the server). */
  liked?: boolean;
  bookmarked?: boolean;
};

// The "logged in" user — used as the author of new posts and comments.
export const currentUser: Author = {
  id: "me",
  username: "you",
  displayName: "You",
  verified: false,
  avatar: "from-pink-500 to-orange-400",
};

// Stable, publicly-hosted sample clips (Google's test-video bucket).
const clip = (name: string) =>
  `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/${name}.mp4`;

export const authors: Author[] = [
  {
    id: "u1",
    username: "buck.bunny",
    displayName: "Buck Bunny",
    verified: true,
    avatar: "from-pink-500 to-orange-400",
  },
  {
    id: "u2",
    username: "dreamteam",
    displayName: "Ele & Emo",
    verified: false,
    avatar: "from-violet-500 to-indigo-500",
  },
  {
    id: "u3",
    username: "blazeit",
    displayName: "For Bigger",
    verified: true,
    avatar: "from-rose-500 to-red-500",
  },
  {
    id: "u4",
    username: "escapades",
    displayName: "Escapist",
    verified: false,
    avatar: "from-emerald-500 to-teal-400",
  },
  {
    id: "u5",
    username: "joyrider",
    displayName: "Joy Rider",
    verified: false,
    avatar: "from-amber-400 to-yellow-500",
  },
  {
    id: "u6",
    username: "meltdown",
    displayName: "Meltdown Mike",
    verified: true,
    avatar: "from-sky-500 to-cyan-400",
  },
  {
    id: "u7",
    username: "steeltears",
    displayName: "Steel Tears",
    verified: false,
    avatar: "from-fuchsia-500 to-purple-600",
  },
  {
    id: "u8",
    username: "subaruguy",
    displayName: "Outback Ollie",
    verified: true,
    avatar: "from-lime-500 to-green-500",
  },
];

const commentTexts = [
  "this is fire 🔥🔥",
  "wait for the end tho 😭",
  "how is this so clean",
  "the sound >>> everything",
  "POV: you scrolled for this",
  "underrated creator fr",
  "tutorial pls 🙏",
  "where can i find the sound",
  "i needed this today",
  "first 🥇",
];

function makeComments(seed: number, count: number): Comment[] {
  const out: Comment[] = [];
  for (let i = 0; i < count; i++) {
    const a = authors[(seed + i) % authors.length]!;
    out.push({
      id: `c-${seed}-${i}`,
      author: a.username,
      avatar: a.avatar,
      text: commentTexts[(seed + i) % commentTexts.length]!,
      time: ["2m", "15m", "1h", "3h", "5h", "1d", "2d"][(seed + i) % 7]!,
      likes: ((seed + i) * 137) % 4200,
    });
  }
  return out;
}

export const posts: VideoPost[] = [
  {
    id: "p1",
    videoUrl: clip("BigBuckBunny"),
    mediaType: "video",
    author: authors[0]!,
    caption: "when the algorithm finally drops you in the forest 🌲 POV: you're the main character",
    hashtags: ["fyp", "buckbunny", "pov", "maincharacter"],
    music: "Forest Run — Buck Bunny",
    soundId: "s1",
    likes: 1284000,
    comments: 8421,
    shares: 23100,
    bookmarks: 45200,
    commentsList: makeComments(0, 3),
  },
  {
    id: "p2",
    videoUrl: clip("ElephantsDream"),
    mediaType: "video",
    author: authors[1]!,
    caption: "proceed with caution into the machine 🤖 part 1 of my dream diary",
    hashtags: ["dream", "surreal", "fyp", "diary"],
    music: "Machine Heart — Emo",
    soundId: "s2",
    likes: 562300,
    comments: 3201,
    shares: 9800,
    bookmarks: 12300,
    commentsList: makeComments(3, 2),
  },
  {
    id: "p3",
    videoUrl: clip("ForBiggerBlazes"),
    mediaType: "video",
    author: authors[2]!,
    caption: "for bigger blazes only 🔥 rate this 1-10 in the comments",
    hashtags: ["fire", "bigger", "challenge", "fyp"],
    music: "Inferno — Beat Drop",
    soundId: "s3",
    likes: 989000,
    comments: 12100,
    shares: 18700,
    bookmarks: 33000,
    commentsList: makeComments(5, 3),
  },
  {
    id: "p4",
    videoUrl: clip("ForBiggerEscapes"),
    mediaType: "video",
    author: authors[3]!,
    caption: "the great escape was a success 🏃‍♀️ follow for part 2",
    hashtags: ["escape", "travel", "adventure", "fyp"],
    music: "Horizon — Lo-Fi Drift",
    soundId: "s4",
    likes: 410200,
    comments: 2210,
    shares: 5400,
    bookmarks: 18900,
    commentsList: makeComments(7, 2),
  },
  {
    id: "p5",
    videoUrl: clip("ForBiggerFun"),
    mediaType: "video",
    author: authors[4]!,
    caption: "this is bigger fun than it looks 😂 tag someone who needs to see this",
    hashtags: ["fun", "comedy", "fyp", "lol"],
    music: "Good Times — Sunny",
    soundId: "s5",
    likes: 1530000,
    comments: 24300,
    shares: 51200,
    bookmarks: 67800,
    commentsList: makeComments(1, 3),
  },
  {
    id: "p6",
    videoUrl: clip("ForBiggerJoyrides"),
    mediaType: "video",
    author: authors[5]!,
    caption: "joyride gone wrong (not clickbait) 🚗💨 wait for it...",
    hashtags: ["joyride", "cars", "fyp", "waitforit"],
    music: "Nitro — Bass Boosted",
    soundId: "s6",
    likes: 778000,
    comments: 9900,
    shares: 14400,
    bookmarks: 21000,
    commentsList: makeComments(2, 2),
  },
  {
    id: "p7",
    videoUrl: clip("ForBiggerMeltdowns"),
    mediaType: "video",
    author: authors[6]!,
    caption: "the meltdown was inevitable 🫠 relatable? yes or no",
    hashtags: ["meltdown", "relatable", "fyp", "mood"],
    music: "Falling Apart — Mellow",
    soundId: "s7",
    likes: 645000,
    comments: 7600,
    shares: 11200,
    bookmarks: 15600,
    commentsList: makeComments(4, 3),
  },
  {
    id: "p8",
    videoUrl: clip("TearsOfSteel"),
    mediaType: "video",
    author: authors[7]!,
    caption: "tears of steel — the robot uprising starts now 🤖🍿 cinema quality on a phone fr",
    hashtags: ["scifi", "cinema", "robot", "fyp"],
    music: "Steel Rain — Cinematic",
    soundId: "s8",
    likes: 1120000,
    comments: 15400,
    shares: 28900,
    bookmarks: 51200,
    commentsList: makeComments(6, 2),
  },
];

/** A "For You" page worth of posts. */
export const forYouPosts = posts;

/** Compact list used by the discover grid. */
export const trendingHashtags = [
  { tag: "fyp", posts: "8.2B", subtitle: "For You" },
  { tag: "pov", posts: "412.1B", subtitle: "Point of view" },
  { tag: "challenge", posts: "98.4B", subtitle: "Trending challenge" },
  { tag: "comedy", posts: "1.1T", subtitle: "Funny videos" },
  { tag: "scifi", posts: "12.7B", subtitle: "Science fiction" },
  { tag: "travel", posts: "230.5B", subtitle: "Wanderlust" },
];

export function formatCount(n: number): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
}
