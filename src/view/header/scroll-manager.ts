export default class ScrollManager {
  private scrollTop: number;

  private scrollLeft: number;

  constructor() {
    this.scrollTop = 0;
    this.scrollLeft = 0;
  }

  disableScroll(): void {
    this.scrollTop = document.documentElement.scrollTop;
    this.scrollLeft = document.documentElement.scrollLeft;

    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${this.scrollTop}px`;
    document.body.style.left = `-${this.scrollLeft}px`;
  }

  enableScroll(): void {
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';

    window.scrollTo(this.scrollLeft, this.scrollTop);
  }
}
