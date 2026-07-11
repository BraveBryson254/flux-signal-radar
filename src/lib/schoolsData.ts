import { courses, Course } from "./educationData";

/**
 * "Schools" are the top navigational layer of the Academy hierarchy
 * (Academy → Schools → Courses → Modules → Lessons). Each school maps to
 * an existing course category so this is real structure over real
 * content, not a fabricated infrastructure layer.
 */

export interface School {
  id: string;
  name: string;
  category: string; // matches Course.category
  icon: string;
  description: string;
}

export const schools: School[] = [
  {
    id: "school-smc",
    name: "School of Smart Money Concepts",
    category: "SMC",
    icon: "Compass",
    description: "Liquidity, order blocks, and institutional footprints on the chart.",
  },
  {
    id: "school-ict",
    name: "School of Institutional Trading",
    category: "ICT",
    icon: "Building2",
    description: "Break of structure, change of character, and entry timing.",
  },
  {
    id: "school-wyckoff",
    name: "School of Wyckoff",
    category: "Wyckoff",
    icon: "LineChart",
    description: "Accumulation, distribution, and reading institutional phases.",
  },
  {
    id: "school-risk",
    name: "School of Risk Management",
    category: "Risk Management",
    icon: "ShieldCheck",
    description: "Position sizing, drawdown discipline, and prop-firm survival.",
  },
  {
    id: "school-psychology",
    name: "School of Trading Psychology",
    category: "Psychology",
    icon: "Brain",
    description: "Fear, greed, discipline, and the process behind consistency.",
  },
  {
    id: "school-propfirm",
    name: "School of Prop Firm Preparation",
    category: "Prop Firm",
    icon: "Award",
    description: "Passing funded challenges and managing evaluation accounts.",
  },
];

export function coursesForSchool(school: School): Course[] {
  return courses.filter((c) => c.category === school.category);
}

export function schoolForCourse(courseCategory: string): School | undefined {
  return schools.find((s) => s.category === courseCategory);
}
