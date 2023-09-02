// app.ts
import ElementCreator from '../util/ElementCreator';
import CatalogApp from '../view/catalog/CatalogApp';
import ProductApp from '../view/display-produkt/productApp';
import Footer from '../view/footer/footer-view';
import Header from '../view/header/header-view';
import LoginApp from '../view/login/loginvView';
import Main from '../view/mainPage/main-view';
import NotFoundPageApp from '../view/page-404/page404View';
import RegistrationApp from '../view/registration/displayRegistration';

export class App {
  footer: Footer;

  main: typeof Main | typeof LoginApp | typeof RegistrationApp | typeof CatalogApp | typeof ProductApp;

  header: Header;

  productKey: string | null = null;

  constructor() {
    this.header = new Header();
    this.main = this.getBody();
    this.footer = new Footer();
  }

  urlChange(productKey: string | null = null): void {
    this.productKey = productKey;
    this.main = this.getBody();
    if (this.productKey !== null) {
      this.main.create(this.productKey);
    } else {
      this.main.create();
    }
  }

  getBody(): typeof Main | typeof LoginApp | typeof RegistrationApp | typeof CatalogApp | typeof ProductApp {
    const token = localStorage.getItem('token');
    if (
      (document.location.pathname === '/login' && token) ||
      (document.location.pathname === '/registration' && token)
    ) {
      window.history.pushState({}, '', '/');
    }
    switch (document.location.pathname) {
      case '/':
        return Main;
      case '/login':
        return LoginApp;
      case '/registration':
        return RegistrationApp;
      case '/catalog':
        return CatalogApp;
      // case `/catalog/product?key=${this.productKey}`:
      case '/catalog/product?key=10006': // 'этот case  не срабатывает
        return ProductApp;
      default:
        return NotFoundPageApp;
    }
  }

  init(): void {
    this.header.create();
    const params = {
      tag: 'main',
      classNames: ['mainView'],
    };
    const main = new ElementCreator(params);
    document.body.appendChild(main.getElement());
    if (this.productKey !== null) {
      this.main.create(this.productKey);
    } else {
      this.main.create();
    }
    this.footer.create();

    window.onpopstate = (): void => {
      this.urlChange();
    };
  }
}
