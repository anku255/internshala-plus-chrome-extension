import "../css/bulma.min.css";
import "../css/popup.css";
import $ from "./lib/jquery.min";
import { messageType, senderType } from "./constants";

function saveToStorage(key, value) {
  chrome.storage.local.set({ [key]: value }, function() {});
}

function getFromStorage(key, cb) {
  chrome.storage.local.get([key], cb);
}

function setFilterTextValue() {
  getFromStorage("filterText", data => {
    $("#search-field").val(data.filterText);
  });
}

function handleFilter(e) {
  e.preventDefault();
  const filterText = $("#search-field").val();
  saveToStorage("filterText", filterText);

  // ...query for the active tab...
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, {
      from: senderType.POPUP,
      type: messageType.FILTER_CARDS,
      filterText: filterText.toLowerCase()
    });
  });
}

function gotMessage(msg, sender, sendResponse) {}

window.addEventListener("DOMContentLoaded", () => {
  chrome.runtime.onMessage.addListener(gotMessage);
  setFilterTextValue();

  $("#search-field").on("input", handleFilter);
});
