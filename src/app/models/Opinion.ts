export class Opinion {
  private readonly inputElement: HTMLInputElement;
  private readonly progressElement: HTMLElement;
  private readonly chartElement: HTMLElement;

  public readonly index: number;

  public get percentage(): string {
    return this.progressElement.innerHTML;
  }

  /**
   * Percentage in the absolute value
   */
  public get value(): number {
    return parseInt(this.percentage.replace("%", ""), 10);
  }

  public constructor(private element: HTMLElement) {
    this.inputElement = this.element.querySelector(".PollXChoice-choice--input");
    this.chartElement = this.element.querySelector(".PollXChoice-choice--chart");
    this.progressElement = this.element.querySelector(".PollXChoice-progress");
    this.index = parseInt(this.element.getAttribute("data-poll-index"), 10);
  }

  /**
   * Sets percentage to the bar, and disables the input field.
   */
  public show() {
    this.chartElement.style.width = this.percentage;
    this.disable();
  }

  /**
   * Enables the input field.
   */
  public hide() {
    this.enable();
  }

  /**
   * Disables opinion for voting
   */
  public disable() {
    this.inputElement.disabled = true;
  }

  /**
   * Enables opinion for voting
   */
  public enable() {
    this.inputElement.disabled = false;
  }
}
