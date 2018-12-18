import { PollState } from "@/constants/PollState";
import { Opinion } from "@/models/Opinion";
import * as icon from "../assets/svg/bar.svg";
import { Poll } from "./models/Poll";

/**
 * Background script goes here.
 */
(() => {
  /**
   * Injects the button.
   */
  function onInit() {
    // check if tweet is a poll
    const element = document.querySelector(".PollXChoice") as HTMLElement;

    if (!element) {
      return;
    }

    // get twitter data object
    const twitterInitObject = document.querySelector(`script[type="text/twitter-cards-serialization"]`).innerHTML;

    // extract the card object
    const { card, ...other } = JSON.parse(twitterInitObject);

    const poll = new Poll(card, element);

    if (poll.initialState === PollState.CLOSED || poll.initialState === PollState.FINAL) {
      return;
    }

    poll.process();
    poll.setControlButton(createButton());

    // get all opinions, create the opinion objects and add them to the poll.
    element.querySelectorAll(".PollXChoice-choice").forEach((e: HTMLElement) => poll.add(new Opinion(e)));
  }

  /**
   * Creates a bar chart button.
   */
  function createButton() {

    const button = document.createElement("span");
    button.innerHTML = icon;
    button.classList.add("btn-results");

    return button;
  }

  //
  onInit();
})();
