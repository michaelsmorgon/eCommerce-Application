export default class BurgerMenu {
  private burgerIcon: HTMLElement;
  private mainMenu: HTMLElement;

  constructor(burgerIconSelector: string, mainMenuSelector: string) {
    this.burgerIcon = document.querySelector(burgerIconSelector) as HTMLElement;
    this.mainMenu = document.querySelector(mainMenuSelector) as HTMLElement;
    this.burgerIcon.addEventListener('click', () => this.toggleMenu());
  }

  private toggleMenu(): void {
    this.burgerIcon.classList.toggle('active');
    this.mainMenu.classList.toggle('active');
  }
}