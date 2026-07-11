/**
 * Recommended Reading — Source 1 from the Academy brief. Lists real,
 * respected trading books by title and author for attribution only.
 * Every description here is original commentary on the book's general
 * subject area, written for Flux — never a summary of its content, never
 * reproduced text. This is the same posture as a bookstore shelf talker,
 * not a book report.
 */

export interface ReadingListEntry {
  id: string;
  title: string;
  author: string;
  category: string;
  blurb: string; // original framing, not a content summary
  relatedSchoolId: string;
}

export const readingList: ReadingListEntry[] = [
  {
    id: "rl1",
    title: "Reminiscences of a Stock Operator",
    author: "Edwin Lefèvre",
    category: "Psychology",
    blurb: "A century-old speculation classic, often cited for how little trader psychology has actually changed.",
    relatedSchoolId: "school-psychology",
  },
  {
    id: "rl2",
    title: "Trading in the Zone",
    author: "Mark Douglas",
    category: "Psychology",
    blurb: "One of the most frequently recommended books on the mental discipline behind consistent execution.",
    relatedSchoolId: "school-psychology",
  },
  {
    id: "rl3",
    title: "Market Wizards",
    author: "Jack D. Schwager",
    category: "Professional Trading",
    blurb: "Interviews with top traders across styles — useful for seeing how differently successful people actually think.",
    relatedSchoolId: "school-propfirm",
  },
  {
    id: "rl4",
    title: "Japanese Candlestick Charting Techniques",
    author: "Steve Nison",
    category: "Technical Analysis",
    blurb: "The book widely credited with bringing candlestick analysis to Western trading audiences.",
    relatedSchoolId: "school-ict",
  },
  {
    id: "rl5",
    title: "Studies in Tape Reading",
    author: "Richard D. Wyckoff",
    category: "Wyckoff",
    blurb: "An early foundational text behind the accumulation/distribution framework still taught today.",
    relatedSchoolId: "school-wyckoff",
  },
  {
    id: "rl6",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    category: "Behavioral Finance",
    blurb: "Not a trading book, but the behavioral-economics foundation much of modern trading psychology draws from.",
    relatedSchoolId: "school-psychology",
  },
  {
    id: "rl7",
    title: "Way of the Turtle",
    author: "Curtis Faith",
    category: "Risk Management",
    blurb: "A firsthand account of the famous Turtle Traders experiment, heavy on position sizing and rule-following.",
    relatedSchoolId: "school-risk",
  },
  {
    id: "rl8",
    title: "Fooled by Randomness",
    author: "Nassim Nicholas Taleb",
    category: "Risk Management",
    blurb: "A sharp challenge to how easily traders mistake luck for skill — useful humility reading.",
    relatedSchoolId: "school-risk",
  },
];

export const readingListCategories = Array.from(new Set(readingList.map((r) => r.category)));
