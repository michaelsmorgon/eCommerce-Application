import ScrollManager from './scroll-manager';

export default class BurgerMenu {
  private burgerIcon: HTMLElement;

  private headerCenter: HTMLElement;

  private overlay: HTMLElement;

  private menuLinks: NodeListOf<HTMLAnchorElement>;

  private menuButtons: NodeListOf<HTMLAnchorElement>;

  private scrollManager: ScrollManager;

  constructor(burgerIconSelector: string, headerCenterSelector: string, overlaySelector: string) {
    this.burgerIcon = document.querySelector(burgerIconSelector) as HTMLElement;
    this.headerCenter = document.querySelector(headerCenterSelector) as HTMLElement;
    this.overlay = document.querySelector(overlaySelector) as HTMLElement;
    this.menuLinks = document.querySelectorAll('.menu a');
    this.menuButtons = document.querySelectorAll('.auth-buttons a');
    this.scrollManager = new ScrollManager();

    this.burgerIcon.addEventListener('click', () => this.toggleMenu());

    this.menuLinks.forEach((link) => {
      link.addEventListener('click', () => this.closeMenu());
    });

    this.menuButtons.forEach((link) => {
      link.addEventListener('click', () => this.closeMenu());
    });
  }

  private toggleMenu(): void {
    this.burgerIcon.classList.toggle('active');
    this.headerCenter.classList.toggle('active');
    this.overlay.classList.toggle('active');

    if (this.headerCenter.classList.contains('active')) {
      this.scrollManager.disableScroll();
    } else {
      this.scrollManager.enableScroll();
    }
  }

  private closeMenu(): void {
    this.burgerIcon.classList.remove('active');
    this.headerCenter.classList.remove('active');
    this.overlay.classList.remove('active');
    this.scrollManager.enableScroll();
  }
}
