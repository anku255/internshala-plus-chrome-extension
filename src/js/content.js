import $ from "./lib/jquery.min";
import { getInternshipCards, addSkillsToCard } from "./utils";

async function init() {
  const internshipCards = await getInternshipCards();

  for (const card of internshipCards) {
    addSkillsToCard(card);
  }
}

init();
