import $ from "./lib/jquery.min";
import { getInternshipCards, addPropertiesToCard } from "./utils";
import { messageType, senderType } from "./constants";

// Chrome Event Listeners
chrome.runtime.onMessage.addListener(gotMessage);

// Global Variables
let internshipCards = [];

function filterCards(filterText) {
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

function sortCards(sortBy, orderBy) {
  console.log("sorting cards", sortBy, orderBy);
  $("#internship_list_container").css({ display: "flex", "flex-wrap": "wrap" });
  $("#internship_list_container nav").css({ order: 999, margin: "0 auto" });

  $(".individual_internship").css({ "min-width": "600px" });

  let sortedCards = [];
  switch (sortBy) {
    case "noOfInternships":
      if (orderBy === "desc") {
        sortedCards = [...internshipCards].sort(
          (card1, card2) => card2.noOfInternships - card1.noOfInternships
        );
      } else {
        sortedCards = [...internshipCards].sort(
          (card1, card2) => card1.noOfInternships - card2.noOfInternships
        );
      }
      break;

    default:
      break;
  }
  // Change display order using flex order
  let order = 1;
  for (const card of sortedCards) {
    const { element } = card;
    $(element).css({ order });
    order = order + 1;
  }
}

function gotMessage(msg, sender, sendResponse) {
  if (msg.from === senderType.POPUP && msg.type === messageType.FILTER_CARDS) {
    const { filterText } = msg;
    filterCards(filterText);
  }

  if (msg.from === senderType.POPUP && msg.type === messageType.SORT_CARDS) {
    const { sortBy, orderBy } = msg;
    sortCards(sortBy, orderBy);
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
