import CatalogView from './CatalogView';

export default class CatalogApp {
  static create(): void {
    const view = new CatalogView();
    const main = document.querySelector('.mainView');
    if (!main) {
      console.log();
      return;
    }

    main.innerHTML = '';
    main.appendChild(view.getHtmlElement());
  }
}