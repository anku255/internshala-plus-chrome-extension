import $ from "./lib/jquery.min";
import { getInternshipCards, addPropertiesToCard } from "./utils";
import { messageType, senderType } from "./constants";

// Chrome Event Listeners
chrome.runtime.onMessage.addListener(gotMessage);

// Global Variables
let internshipCards = [];

function gotMessage(msg, sender, sendResponse) {
  console.log("message recieved", msg);

  if (msg.from === senderType.POPUP && msg.type === messageType.FILTER_CARDS) {
    const { filterText } = msg;

    for (const card of internshipCards) {
      const { element } = card;

      const html = $(element)
        .html()
        .toLowerCase();

      if (html.includes(filterText)) {
        $(element).show();
      } else {
        $(element).hide();
      }
    }
  }
}

function setLoadingFalse() {
  chrome.runtime.sendMessage({
    from: senderType.CONTENT,
    type: messageType.SKILLS_LOADED
  });
}

async function init() {
  internshipCards = await getInternshipCards();

  for (const card of internshipCards) {
    addPropertiesToCard(card);
  }
  setLoadingFalse();
}

init();
