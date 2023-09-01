import ProductView from './productView';

export default class ProductApp {
  static create(): void {
    const view = new ProductView();
    const main = document.querySelector('.mainView');
    if (!main) {
      console.log();
      return;
    }

    main.innerHTML = '';
    main.appendChild(view.getHtmlElement());
  }
}
