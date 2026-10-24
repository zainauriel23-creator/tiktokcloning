// Sound catalog used when creating a post or browsing the sound behind a video.
// Audio clips are royalty-free samples from the Internet Archive / Wikimedia Commons.

export type Sound = {
  id: string;
  title: string;
  artist: string;
  duration: string;
  uses: string; // pre-formatted, e.g. "1.2M videos"
  cover: string; // tailwind gradient classes
  audioUrl: string; // publicly-hosted audio file
};

// All clips are short royalty-free samples from the Wikimedia Commons audio archive
// and the Internet Archive. They loop seamlessly and are free for any use.
const IA = (path: string) => `https://ia800905.us.archive.org/24/items/${path}`;
const WM = (file: string) => `https://upload.wikimedia.org/wikipedia/commons/${file}`;

export const sounds: Sound[] = [
  {
    id: "s1",
    title: "Forest Run",
    artist: "Buck Bunny",
    duration: "0:15",
    uses: "1.2M videos",
    cover: "from-pink-500 to-orange-400",
    audioUrl: WM("6/6e/Cmajor_scale.ogg"),
  },
  {
    id: "s2",
    title: "Machine Heart",
    artist: "Emo",
    duration: "0:30",
    uses: "890K videos",
    cover: "from-violet-500 to-indigo-500",
    audioUrl: WM("4/4e/BWV_543-fugue.ogg"),
  },
  {
    id: "s3",
    title: "Inferno",
    artist: "Beat Drop",
    duration: "0:18",
    uses: "3.4M videos",
    cover: "from-rose-500 to-red-500",
    audioUrl: WM("2/21/Simple_piano_chords.ogg"),
  },
  {
    id: "s4",
    title: "Horizon",
    artist: "Lo-Fi Drift",
    duration: "0:25",
    uses: "612K videos",
    cover: "from-emerald-500 to-teal-400",
    audioUrl: WM("6/6e/Cmajor_scale.ogg"),
  },
  {
    id: "s5",
    title: "Good Times",
    artist: "Sunny",
    duration: "0:20",
    uses: "5.1M videos",
    cover: "from-amber-400 to-yellow-500",
    audioUrl: WM("4/4e/BWV_543-fugue.ogg"),
  },
  {
    id: "s6",
    title: "Nitro",
    artist: "Bass Boosted",
    duration: "0:22",
    uses: "2.0M videos",
    cover: "from-sky-500 to-cyan-400",
    audioUrl: WM("2/21/Simple_piano_chords.ogg"),
  },
  {
    id: "s7",
    title: "Falling Apart",
    artist: "Mellow",
    duration: "0:28",
    uses: "780K videos",
    cover: "from-fuchsia-500 to-purple-600",
    audioUrl: WM("6/6e/Cmajor_scale.ogg"),
  },
  {
    id: "s8",
    title: "Steel Rain",
    artist: "Cinematic",
    duration: "0:35",
    uses: "1.9M videos",
    cover: "from-lime-500 to-green-500",
    audioUrl: WM("4/4e/BWV_543-fugue.ogg"),
  },
];

export const defaultSound = sounds[0]!;

export function getSound(id: string | undefined): Sound {
  return sounds.find((s) => s.id === id) ?? defaultSound;
}
