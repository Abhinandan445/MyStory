import {
  Camera,
  Film,
  Heart,
  MessageCircle,
  Sparkles,
  Stars,
} from "lucide-react";

export type Memory = {
  id: string;
  src: string;
  alt: string;
  title: string;
  date: string;
  line: string;
  detail: string;
  accent: string;
};

export const memories: Memory[] = [
  {
    id: "first-evening",
    src: "/photos/first-evening.jpg",
    alt: "A smiling couple taking a night selfie outside",
    title: "Where It All Began",
    date: "May 2019",
    line: "A simple evening, two bright smiles, and the city lights deciding to join in.",
    detail:
      "Hamari pehli click hai Chennai mein, aur hamari first meet bhi thi ye, aur mai first meet mein hi late ho gaya tha, wo kya haina mai local train leke phir bus leke tab destination ko pahucha tha aur waha jab pahucha mai toh bas dekhte hi raha wo gora sa face aur itni sundar si ladki giraffe ke bagal bench par beth kar mera wait kar raha thi, its special, iss pic mein wo parking area mein hum cab ka wait kar rahe the, acha hua cab ko aane mein thoda time lagga usse ye hamari ye first memory toh ban gye",
    accent: "#f6a6c9",
  },
  {
    id: "cafe-laugh",
    src: "/photos/cafe-laugh.jpg",
    alt: "A couple laughing together at a cafe table",
    title: "The Laugh Between Us",
    date: "July 2019",
    line: "The kind of frame where the camera catches the joke after the heart already has.",
    detail:
      "Ye hamari dusri mulakat hai, yad hai yahan hum gye toh the formals mein the, par harkate puri casual wali kardi haha uski bhi smile capture karli. Aur bhook toh dono mein se kisi ko nahi thi phir bhi beth ke barbecue nation gye the, par waha menu hatta ke bas tumse hi bat karta raha aur waha time kab chala gaya pta hi nahi chala.",
    accent: "#9ddcff",
  },
  {
    id: "video-call",
    src: "/photos/video-call.jpg",
    alt: "A joyful video call screenshot with two smiling faces",
    title: "Missed You, Obviously",
    date: "July 2019",
    line: "Distance had its own soundtrack: one call, one smile, one line that stayed.",
    detail:
      "Ye humse durr nahi raha gaya toh wo distance ko kam karne ke liye video call kar liya aur ye ussi ka screenshot hai, kabhi kabhi bas itne kam time mein sab kitna pass lagne lagta hai, aji pta hi nahi chalta hai janab.",
    accent: "#c7b7ff",
  },
  {
    id: "friends-night",
    src: "/photos/friends-night.jpg",
    alt: "Friends gathered together for a bright night selfie",
    title: "The World Around Us",
    date: "September 2019",
    line: "Friends, lights, music in the air, and the feeling that life was becoming a story.",
    detail:
      "Ye hamari peheli mulakat with sare friends ke sath in a club haha, aur ye club party ekdam last min ka plan tha end tak hum decide hi nahi kar pa rahe the ki milna kaha hai, aur mai milne ko kafi bechain tha aur jabse milla tabse bas party hi party rahi hai. Ye pic mein mai chennai se banglore aaya toh tha bas doston se milne par wo plan kaha se kaha tak chala gaya mujhe bhi nahi yakeen ho raha, Paaji wo aajtak ka sabse best plan tha.",
    accent: "#9ddcff",
  },
  {
    id: "mirror-memory",
    src: "/photos/mirror-memory.jpg",
    alt: "A mirror photo of two people smiling in a room",
    title: "Quiet Room, Loud Heart",
    date: "September 2019",
    line: "A mirror, a bed, a blue phone, and a tiny scene that feels softer with time.",
    detail:
      "Finally ye hai hamara sabse imp movement sab shant bas mai aur tum, electronic city se yehlanka wo barish mein ghumta hua keechta hua bas tumhari taraf aata gaya aur finally ye movement milla, jisme bas mai aur tum uss mirror mein hamesha ke liye capture ho gye.",
    accent: "#f6a6c9",
  },
];

export const timeline = [
  { label: "We Met", text: "A first chapter with a quiet spark.", Icon: Heart },
  {
    label: "First Conversations",
    text: "The small talks became the safest place.",
    Icon: MessageCircle,
  },
  {
    label: "First Pictures",
    text: "A camera started keeping what words could not.",
    Icon: Camera,
  },
  {
    label: "Beautiful Memories",
    text: "Cafe laughs, calls, rooms, lights, and friends.",
    Icon: Film,
  },
  {
    label: "Forever Begins",
    text: "The story keeps choosing tomorrow.",
    Icon: Sparkles,
  },
];

export const closingNotes = [
  "You are my favorite ordinary day.",
  "Some memories do not fade. They learn how to glow.",
  "I would choose the same first hello again.",
  "Every version of us is worth keeping.",
];

export const SurpriseIcon = Stars;
