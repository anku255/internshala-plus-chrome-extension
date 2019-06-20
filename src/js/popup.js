import "../css/popup.css";
import $ from "./lib/jquery.min";
import { messageType, senderType } from "./constants";

function disableForm() {
  $("#filter-form :input").prop("disabled", true);
}

function enableForm() {
  $("#filter-form :input").prop("disabled", false);
}

function handleFilter(e) {
  e.preventDefault();
  const filterText = $("#filter-text").val();

  // ...query for the active tab...
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, {
      from: senderType.POPUP,
      type: messageType.FILTER_CARDS,
      filterText: filterText.toLowerCase()
    });
  });
}

function gotMessage(msg, sender, sendResponse) {
  if (
    msg.from === senderType.CONTENT &&
    msg.type === messageType.SKILLS_LOADED
  ) {
    const loader = document.querySelector(".loader");
    loader.innerHTML = "Skills Loaded";

    enableForm();
  }
}

window.addEventListener("DOMContentLoaded", () => {
  chrome.runtime.onMessage.addListener(gotMessage);

  $("#filter-form").submit(handleFilter);
  $("#filter-text").on("input", handleFilter);
});
