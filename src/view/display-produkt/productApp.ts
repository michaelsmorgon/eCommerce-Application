import ProductView from './productView';

export default class ProductApp {
  static create(productKey: string | null = null): void {
    let view: ProductView | null = null;
    if (productKey !== null) {
      view = new ProductView(productKey);
    } else {
      console.error('Product key not provided');
    }

    const main = document.querySelector('.mainView');
    if (!main) {
      console.error('Main element not found');
      return;
    }

    main.innerHTML = '';

    if (view) {
      main.appendChild(view.getHtmlElement());
    }
  }
}
