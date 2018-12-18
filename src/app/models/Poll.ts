import { PollState } from "@/constants/PollState";
import { Button } from "@/models/Button";
import { ICard } from "@/models/interfaces/ICard";
import { Opinion } from "@/models/Opinion";

export class Poll {
  private readonly __initialState: PollState = PollState.CLOSED;

  private readonly opinions: Opinion[] = [];

  private footerElement: HTMLElement;

  private controlButton: HTMLElement;

  /**
   * Stores control buttons of poll
   */
  private buttons: Button[] = [];

  public state: PollState;

  public get initialState(): PollState | string {
    return this.__initialState;
  }

  /**
   * Creates an instance of Poll
   */
  public constructor(private card: ICard, private element: HTMLElement) {
    if (card.is_open === "false") {
      this.__initialState = PollState.FINAL;
    } else if ("selected_choice" in card) {
      this.__initialState = PollState.CLOSED;
    } else {
      this.__initialState = PollState.OPENED;
    }
  }

  /**
   * Process the poll: set observers and get basic elements for work.
   */
  public process() {
    this.setAttributesObserver();

    this.footerElement = this.element.querySelector(".PollXChoice-info");

    this.footerElement
      .querySelectorAll("button")
      .forEach((button: HTMLButtonElement) => this.buttons.push(new Button(button)));
  }

  /**
   * Adds an opinion to the poll.
   */
  public add(opinion: Opinion): void {
    this.opinions.push(opinion);
  }

  /**
   * Shows the bar chart.
   */
  public show(): void {
    const opinion = this.getOpinionWithMaxVotes();

    this.showOpinionBar(true);

    this.setMajority(opinion.index);
    this.setState(PollState.CLOSED);
    this.mark(true);
  }

  /**
   * Hides the bar chart.
   */
  public hide(): void {
    this.showOpinionBar(false);

    this.setState(PollState.OPENED);
    this.mark(false);
  }

  public setControlButton(button: HTMLElement): void {
    this.controlButton = button;

    this.controlButton.addEventListener("click", () => {
      !this.state || this.state === PollState.OPENED ? this.show() : this.hide();
    });

    // add out button to the footer
    this.footerElement.querySelector(".PollXChoice-vote").insertAdjacentElement("afterend", this.controlButton);
  }

  /**
   * Gets an opinion with a maximum absolute value.
   */
  private getOpinionWithMaxVotes(): Opinion {
    return this.opinions.reduce((prev: Opinion, cur: Opinion) => (prev.value > cur.value ? prev : cur));
  }

  /**
   * Sets a majority number to the poll element.
   */
  private setMajority(majorityIndex: number): void {
    this.element.setAttribute("data-poll-vote-majority", majorityIndex.toString());
  }

  /**
   * Changes poll state.
   */
  private setState(state: PollState): void {
    this.state = state;
    this.element.setAttribute("data-poll-state", state);
  }

  /**
   *  Marks the footer block as active and disables the vote button.
   */
  private mark(state: boolean): void {
    state ? this.footerElement.classList.add("active") : this.footerElement.classList.remove("active");

    this.disableVoteButtons(state);
  }

  /**
   * Shows or hides chart bar of opinion.
   *
   * @param {boolean} show - flag
   */
  private showOpinionBar(show: boolean): void {
    this.opinions.forEach((o: Opinion) => (show ? o.show() : o.hide()));
  }

  /**
   * Disables or enables the voting button.
   *
   * @param {boolean} disable - flag
   */
  private disableVoteButtons(disable: boolean): void {
    this.buttons.forEach((button: Button) => button.disable(disable));
  }

  private setAttributesObserver(): void {
    new MutationObserver((ml: MutationRecord[], observer: MutationObserver) => {
      const isUserVoted = !!this.element.getAttribute("data-poll-user-choice");

      if (isUserVoted) {
        this.buttons.forEach((button: Button) => button.disconnect());

        // remove our button
        this.controlButton.remove();
        //
        observer.disconnect();
      }
    }).observe(this.element, { attributes: true });
  }
}
