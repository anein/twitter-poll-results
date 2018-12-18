/**
 * class Button encapsulates basic behavior of twitter button
 */
export class Button {
  /**
   * Stores a state of button.
   */
  private initState: boolean = true;

  private readonly observer: MutationObserver;

  public constructor(private element: HTMLButtonElement) {
    // observe button attributes to catch user and twitter actions
    this.observer = new MutationObserver(() => {
      // check if user clicked on an opinion but hasn't voted yet
      if (!!this.element.getAttribute("data-card-scribe-data")) {
        this.initState = false;
      }
    });

    this.observer.observe(this.element, { attributes: true });
  }

  /**
   * Disables or enables the button.
   *
   * @param {boolean} state - flag
   */
  public disable(state: boolean): void {
    this.element.disabled = state || this.initState;
  }

  /**
   * Disconnects the observer from the button.
   */
  public disconnect() {
    this.observer.disconnect();
  }
}
