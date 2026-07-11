/**
 * Research Library — Source 3 from the Academy brief. Each entry
 * synthesizes a well-established, stable research theme in original
 * language, written for beginners. These are general-topic explainers,
 * not summaries of any specific paper, and no paper is directly cited
 * or reproduced.
 */

export interface ResearchEntry {
  id: string;
  title: string;
  topic: string;
  difficulty: "Beginner" | "Intermediate";
  keyFindings: string[];
  practicalApplication: string;
  relatedSchoolId: string;
}

export const researchLibrary: ResearchEntry[] = [
  {
    id: "res1",
    title: "Why Losses Hurt More Than Wins Feel Good",
    topic: "Loss aversion",
    difficulty: "Beginner",
    keyFindings: [
      "People consistently weigh losses more heavily than equivalent gains — a pattern well documented across decades of behavioral economics research.",
      "This asymmetry shows up in trading as reluctance to close a losing position and eagerness to close a winning one too early.",
    ],
    practicalApplication:
      "Pre-committing to an exit plan before entering a trade removes the in-the-moment decision, since that's exactly when loss aversion is strongest.",
    relatedSchoolId: "school-psychology",
  },
  {
    id: "res2",
    title: "The Overconfidence Problem",
    topic: "Overconfidence bias",
    difficulty: "Beginner",
    keyFindings: [
      "Traders, like most people making decisions under uncertainty, systematically overestimate the accuracy of their own judgment.",
      "Overconfidence tends to increase after a winning streak — precisely when position sizing discipline matters most.",
    ],
    practicalApplication:
      "Fixed fractional risk (the same % risked regardless of recent results) is a direct, practical defense against overconfidence creeping in after wins.",
    relatedSchoolId: "school-risk",
  },
  {
    id: "res3",
    title: "Why Backtested Strategies Look Better Than They Are",
    topic: "Survivorship bias",
    difficulty: "Intermediate",
    keyFindings: [
      "Strategies and traders that failed tend to disappear from public discussion, leaving only the visible survivors as examples.",
      "This skews perception of how achievable consistent results actually are, and how common failure genuinely is.",
    ],
    practicalApplication:
      "Treat any strategy's public track record skeptically until you've walked it forward yourself on a demo account over a meaningful sample size.",
    relatedSchoolId: "school-propfirm",
  },
  {
    id: "res4",
    title: "Decision Fatigue and Late-Session Trading",
    topic: "Decision fatigue",
    difficulty: "Beginner",
    keyFindings: [
      "The quality of decisions tends to decline the more decisions a person has already made in a session — a well-studied effect across many decision-making domains.",
      "For traders, this often shows up as impulsive, lower-quality entries late in a session compared to the first clean setup of the day.",
    ],
    practicalApplication:
      "A hard daily trade-count limit protects decision quality directly, independent of how the day's earlier trades performed.",
    relatedSchoolId: "school-psychology",
  },
  {
    id: "res5",
    title: "Position Sizing as the Real Edge",
    topic: "Risk of ruin",
    difficulty: "Intermediate",
    keyFindings: [
      "Mathematical models of betting and investing consistently show that sizing determines survival long before strategy edge does.",
      "Two traders with identical win rates can have completely different outcomes purely from how much they risk per trade.",
    ],
    practicalApplication:
      "Before optimizing entries further, calculate your risk of ruin at your current position size — it often reveals more than the strategy itself.",
    relatedSchoolId: "school-risk",
  },
];
