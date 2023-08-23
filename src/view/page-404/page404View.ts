import NotFoundPage from './page404';

export default class NotFoundPageApp {
  static create(): void {
    const notFoundPage = new NotFoundPage();
    const main = document.querySelector('.mainView');
    if (!main) {
      console.log();
      return;
    }
    main.innerHTML = notFoundPage.getContainer().outerHTML;
  }
}
