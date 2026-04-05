export interface VideoEntry {
  videoId: string;
  title: string;
  level?: string;
}

export interface VideoChannel {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  videos: VideoEntry[];
}

export const videoChannels: VideoChannel[] = [
  {
    id: 'emma-daily-english',
    name: 'Emma Daily English',
    description: 'Easy English listening stories for A2-B1 learners. Follow along with clear narration and everyday topics.',
    thumbnail: 'https://img.youtube.com/vi/7I3fF97vRdw/mqdefault.jpg',
    videos: [
      {
        videoId: '7I3fF97vRdw',
        title: "Peter's School Project | Easy English Listening Story (A2 Level)",
        level: 'A2',
      },
      {
        videoId: 'QQWrLL5BeBQ',
        title: 'A Famous Chef Lost to My Homemade Food | Easy English Listening Practice (A2)',
        level: 'A2',
      },
      {
        videoId: 'QxzEkTcKKik',
        title: 'Museum Chase! Anna Finds the Golden Scepter | Easy English Listening Story (A2 Level)',
        level: 'A2',
      },
      {
        videoId: '5_NGM7OUcsk',
        title: 'We Went Looking for Gold in California! | Easy English Listening Story (A2 Level)',
        level: 'A2',
      },
      {
        videoId: '6gmWIjTRYWE',
        title: "A Family's Worst Day in New York | Easy English Listening Story (A2 Level)",
        level: 'A2',
      },
      {
        videoId: 'ikc9cIlfN5w',
        title: 'Multiple Remotes, One Big Problem | English Listening Practice (A2)',
        level: 'A2',
      },
      {
        videoId: 'oGaKN1233ZI',
        title: 'Gate Changed… We Almost Missed the Flight | English Listening Practice (A2)',
        level: 'A2',
      },
      {
        videoId: 'LitRBk4IQlg',
        title: 'The Night the Library Went Dark | Easy English Listening Story (A2 Level)',
        level: 'A2',
      },
      {
        videoId: '3RaUhRWNezA',
        title: 'Three Friends and a School Circus | Easy English Listening Practice (A2 Level)',
        level: 'A2',
      },
    ],
  },
];
