export type MainMenuItem = {
  key: string;
  path: string;
};

export const mainMenuList: MainMenuItem[] = [
  { key: "header.market", path: "/markets" },
  { key: "menu.experience", path: "#experience" },
  { key: "menu.aboutUs", path: "#testimonials" },
  { key: "menu.askedQuestions", path: "#faq" }
];
