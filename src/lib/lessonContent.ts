/**
 * ORIGINAL educational content for Flux Signal Radar.
 *
 * All prose here is written specifically for this platform — synthesized
 * from general, widely-taught trading concepts and expressed in original
 * language. No copyrighted books, articles, or courses are reproduced.
 * Where methodologies disagree, we present the differing views rather
 * than asserting one as universally correct.
 *
 * Structured so an admin can later add/edit lessons, quizzes, and cards
 * without code changes (this file becomes a Supabase content table).
 */

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
}

export interface LessonContent {
  lessonId: string;
  objectives: string[];
  body: string[]; // paragraphs, original prose
  keyTakeaways: string[];
  quiz: QuizQuestion[];
  flashcards: Flashcard[];
  assignment: string;
  reflection: string;
}

/**
 * Content keyed by the lesson ids used in educationData.ts. Not every
 * lesson needs deep content yet; pages fall back gracefully when a
 * lesson has no entry here.
 */
export const lessonContent: Record<string, LessonContent> = {
  c1l1: {
    lessonId: "c1l1",
    objectives: [
      "Define liquidity in a way you can actually use on a chart",
      "Explain why price is drawn toward pools of resting orders",
      "Spot the two most common places liquidity builds up",
    ],
    body: [
      "Liquidity is simply the presence of orders willing to trade against you. When you want to buy, someone must be willing to sell; the more willing sellers there are at a price, the more liquid that price is. Markets move toward liquidity because large participants need it to fill sizeable positions without moving the price against themselves.",
      "A useful reframe: instead of seeing a chart as a tug-of-war between buyers and sellers, picture it as a search for fuel. Big orders cannot be filled all at once in a thin market, so price tends to travel to areas where many smaller orders — especially stop-loss orders — are clustered and waiting.",
      "Two places liquidity reliably builds up are equal highs/lows and obvious trendlines. When many traders can see the same level, they place protective stops just beyond it. Those stops become a pool that price is often drawn to sweep before continuing. Recognizing where that fuel sits is the first practical skill in reading institutional behaviour.",
      "Note that different schools describe this idea with different vocabulary — some call it a 'liquidity grab', others a 'stop hunt', others simply a 'sweep'. The label matters less than the underlying mechanic: price seeks resting orders.",
    ],
    keyTakeaways: [
      "Liquidity = orders available to trade against you",
      "Price gravitates toward clustered stop orders",
      "Equal highs/lows and trendlines are common liquidity pools",
    ],
    quiz: [
      {
        id: "c1l1q1",
        question: "In practical terms, what is 'liquidity' on a chart?",
        options: [
          "The speed at which a candle closes",
          "The presence of orders available to trade against you",
          "The colour of the candle body",
          "The number of indicators on the screen",
        ],
        answerIndex: 1,
        explanation:
          "Liquidity is the availability of opposing orders. Large players need it to fill positions, which is why price seeks it out.",
      },
      {
        id: "c1l1q2",
        question: "Why do equal highs often get 'swept' before a move?",
        options: [
          "They are a charting error",
          "Stops cluster just beyond them, forming a liquidity pool",
          "They repel price permanently",
          "They only matter on weekends",
        ],
        answerIndex: 1,
        explanation:
          "Traders place protective stops just beyond obvious equal highs/lows, creating a pool price is drawn to collect.",
      },
    ],
    flashcards: [
      { id: "c1l1f1", front: "Liquidity", back: "Orders available to trade against you; the fuel large participants need to fill size." },
      { id: "c1l1f2", front: "Liquidity pool", back: "A cluster of resting orders — often stops — that price tends to travel toward." },
      { id: "c1l1f3", front: "Sweep / stop hunt", back: "Price moving to collect resting orders beyond an obvious level before continuing." },
    ],
    assignment:
      "Open a daily chart of XAUUSD. Mark three places where equal highs or equal lows have formed. Note whether price later traded through them.",
    reflection:
      "Where on your recent trades did you place stops at 'obvious' levels? Could they have been part of a liquidity pool?",
  },

  c1l2: {
    lessonId: "c1l2",
    objectives: [
      "Read basic market structure using swing highs and lows",
      "Distinguish an uptrend, downtrend, and range",
      "Understand why structure is the foundation for entries",
    ],
    body: [
      "Market structure is the sequence of swing highs and swing lows that price prints as it moves. An uptrend is a series of higher highs and higher lows; a downtrend is lower highs and lower lows; a range is roughly equal highs and lows with no clear progression.",
      "Structure matters because most entry models are conditional on it. A pullback entry only makes sense inside a defined trend; a reversal setup only makes sense once structure actually shifts. Reading structure first prevents you from applying the right tool to the wrong context.",
      "A common beginner mistake is to zoom in so far that every small wiggle looks like a trend change. Structure is clearest when you first identify the meaningful swings on a higher timeframe, then drill down. This is the essence of multi-timeframe analysis, which later lessons build on.",
    ],
    keyTakeaways: [
      "Uptrend = higher highs + higher lows",
      "Downtrend = lower highs + lower lows",
      "Identify structure on a higher timeframe before drilling down",
    ],
    quiz: [
      {
        id: "c1l2q1",
        question: "What defines an uptrend structurally?",
        options: [
          "Higher highs and higher lows",
          "A green moving average",
          "Three red candles in a row",
          "Any upward wick",
        ],
        answerIndex: 0,
        explanation: "An uptrend is a sequence of higher highs and higher lows.",
      },
    ],
    flashcards: [
      { id: "c1l2f1", front: "Uptrend", back: "A sequence of higher highs and higher lows." },
      { id: "c1l2f2", front: "Range", back: "Roughly equal highs and lows with no clear directional progression." },
    ],
    assignment:
      "On a 4-hour chart, label the last five swing highs and lows. Decide whether the market is trending or ranging.",
    reflection: "Do you tend to trade with or against the higher-timeframe structure?",
  },

  c5l1: {
    lessonId: "c5l1",
    objectives: [
      "Recognize how fear and greed distort decisions",
      "Build simple rules that reduce emotional trading",
    ],
    body: [
      "Fear and greed are not character flaws; they are predictable responses to uncertainty and money. Fear shows up as cutting winners early, hesitating on valid setups, or refusing to take a planned loss. Greed shows up as oversizing, chasing entries, and moving targets further away mid-trade.",
      "The antidote is not to feel less — it is to decide less in the moment. Rules made in a calm state (fixed risk per trade, predefined entry criteria, a written exit plan) remove the need to make high-pressure decisions while money is on the line. The plan does the deciding; you do the executing.",
      "Journaling is the feedback loop that makes this work. By recording the emotion you felt on each trade alongside the outcome, patterns emerge — for example, that your 'greedy' trades lose far more often than your 'calm' ones. That evidence is far more persuasive than willpower alone.",
    ],
    keyTakeaways: [
      "Fear and greed are normal, predictable responses",
      "Pre-made rules reduce in-the-moment decisions",
      "Journaling turns emotion into measurable feedback",
    ],
    quiz: [
      {
        id: "c5l1q1",
        question: "What is the most reliable antidote to emotional trading?",
        options: [
          "Trying harder to feel calm",
          "Deciding less in the moment by trading pre-made rules",
          "Increasing position size after a loss",
          "Removing your stop loss",
        ],
        answerIndex: 1,
        explanation:
          "Rules made in a calm state remove high-pressure in-the-moment decisions. The plan decides; you execute.",
      },
    ],
    flashcards: [
      { id: "c5l1f1", front: "Greed (in trading)", back: "Oversizing, chasing entries, moving targets further mid-trade." },
      { id: "c5l1f2", front: "Fear (in trading)", back: "Cutting winners early, hesitating on valid setups, avoiding planned losses." },
    ],
    assignment:
      "For your next five trades, write down the dominant emotion before entry. Review whether emotion correlated with outcome.",
    reflection: "Which costs you more right now — fear or greed? What evidence supports that?",
  },
};

export function getLessonContent(lessonId: string): LessonContent | null {
  return lessonContent[lessonId] ?? null;
}
