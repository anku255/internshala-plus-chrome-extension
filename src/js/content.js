import { getInternshipCards, addSkillsToCard } from "./utils";
import { messageType, senderType } from "./constants";

// Chrome Event Listeners
chrome.runtime.onMessage.addListener(gotMessage);

function gotMessage(message, sender, sendResponse) {
  const text = message.text;
  console.log("text", text);
}

function setLoadingFalse() {
  chrome.runtime.sendMessage({
    from: senderType.CONTENT,
    type: messageType.SKILLS_LOADED
  });
}

async function init() {
  const internshipCards = await getInternshipCards();

  for (const card of internshipCards) {
    addSkillsToCard(card);
  }
  setLoadingFalse();
}

init();
