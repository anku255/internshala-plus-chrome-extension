import "../css/popup.css";
import { messageType, senderType } from "./constants";

window.addEventListener("DOMContentLoaded", () => {
  chrome.runtime.onMessage.addListener(gotMessage);

  function gotMessage(msg, sender, sendResponse) {
    if (
      msg.from === senderType.CONTENT &&
      msg.type === messageType.SKILLS_LOADED
    ) {
      const loader = document.querySelector(".loader");
      loader.innerHTML = "Skills Loaded";
    }
  }
});
