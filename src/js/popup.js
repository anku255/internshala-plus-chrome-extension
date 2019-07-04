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

function reloadSkills() {
  // ...query for the active tab...
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, {
      from: senderType.POPUP,
      type: messageType.RELOAD_SKILLS
    });
  });
}

function setFilterTextValue() {
  getFromStorage("filterText", data => {
    $("#search-field").val(data.filterText);
  });
}
function setSelectFieldValue() {
  getFromStorage("sortBy", data => {
    $(".sort-by-field .sort-by-select").val(data.sortBy);
  });

  getFromStorage("orderBy", data => {
    $(".sort-by-field .order-by-select").val(data.orderBy);
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

function handleSelectChange() {
  let sortBy = $(".sort-by-field .sort-by-select")
    .children("option:selected")
    .val();

  let orderBy = $(".sort-by-field .order-by-select")
    .children("option:selected")
    .val();

  sortBy = sortBy ? sortBy : "noOfInternships"; // Sort By noOfInternships if not selected
  orderBy = orderBy ? orderBy : "desc"; // Order by descening if not selected

  saveToStorage("sortBy", sortBy);
  saveToStorage("orderBy", orderBy);

  // ...query for the active tab...
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, {
      from: senderType.POPUP,
      type: messageType.SORT_CARDS,
      orderBy,
      sortBy
    });
  });
}

function gotMessage(msg, sender, sendResponse) {}

window.addEventListener("DOMContentLoaded", () => {
  chrome.runtime.onMessage.addListener(gotMessage);
  setFilterTextValue();
  setSelectFieldValue();

  $("#search-field").on("input", handleFilter);

  $(".sort-by-field select").change(handleSelectChange);

  $("button#sort-btn").click(handleSelectChange);

  $("button#load-skills-btn").click(reloadSkills);
});
