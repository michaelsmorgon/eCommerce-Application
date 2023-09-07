import CatalogView from './CatalogView';

export default class CatalogApp {
  static create(categoryId: string | null = null): void {
    const view = new CatalogView(categoryId);
    const main = document.querySelector('.mainView');
    if (!main) {
      return;
    }

    main.innerHTML = '';
    main.appendChild(view.getHtmlElement());
  }
}
