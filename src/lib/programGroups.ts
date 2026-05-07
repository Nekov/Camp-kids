export interface ProgramGroup {
  slug: string;
  name: string;
  tagline: string;
  ageRange: string;
  sessionSlugs: string[];
  heroImage: string;
  galleryImages: string[];
}

export const PROGRAM_GROUPS: ProgramGroup[] = [
  {
    slug: "creative-camp",
    name: "Детски творчески лагер",
    tagline: "Творчество, природа и нови приятелства",
    ageRange: "7–14 г.",
    sessionSlugs: ["session-3", "session-4", "session-10"],
    heroImage: "/images/creative-camp.jpg",
    galleryImages: [
      "/images/creative-camp-2.jpeg",
      "/images/creative-camp-3.jpeg",
      "/images/creative-camp-4.jpeg",
    ],
  },
  {
    slug: "steam-camp",
    name: "STEAM / наука и изкуство",
    tagline: "Арт и наука в едно",
    ageRange: "7–14 г.",
    sessionSlugs: ["steam-1", "steam-2"],
    heroImage: "/images/steam-1.jpg",
    galleryImages: ["/images/steam-2.jpg"],
  },
  {
    slug: "plein-air",
    name: "Пленер под звездното небе",
    tagline: "Не просто пленер. Голяма стъпка към мечтания път!",
    ageRange: "14–18 г.",
    sessionSlugs: ["plein-air", "plein-air-2"],
    heroImage: "/images/plener-small.jpg",
    galleryImages: ["/images/plener-big.jpeg"],
  },
  {
    slug: "international-friends",
    name: "Международен лагер \u201eПриятели\u201d",
    tagline: "Международни приятелства, театър и творчество",
    ageRange: "7–18 г.",
    sessionSlugs: ["international-friends"],
    heroImage: "/images/international-friends.jpg",
    galleryImages: [],
  },
  {
    slug: "leaders-academy",
    name: "Лидерска академия",
    tagline: "Развий лидерския си потенциал",
    ageRange: "12–18 г.",
    sessionSlugs: ["leaders-academy"],
    heroImage: "/images/leaders-academy-1.jpg",
    galleryImages: ["/images/leaders-academy-2.jpeg"],
  },
];

export function getGroupBySlug(slug: string): ProgramGroup | undefined {
  return PROGRAM_GROUPS.find((g) => g.slug === slug);
}

export function getGroupBySessionSlug(sessionSlug: string): ProgramGroup | undefined {
  return PROGRAM_GROUPS.find((g) => g.sessionSlugs.includes(sessionSlug));
}

/** Short display label for a session within its group (e.g. "Сесия 1", "Есенна сесия") */
export function sessionShortLabel(sessionName: string): string {
  if (sessionName.includes(" — ")) {
    return sessionName.split(" — ").pop()!.trim();
  }
  return sessionName;
}
