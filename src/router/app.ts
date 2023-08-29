// app.ts
import ElementCreator from '../util/ElementCreator';
import CatalogApp from '../view/catalog/CatalogApp';
import Footer from '../view/footer/footer-view';
import Header from '../view/header/header-view';
import LoginApp from '../view/login/loginvView';
import Main from '../view/mainPage/main-view';
import NotFoundPageApp from '../view/page-404/page404View';
import RegistrationApp from '../view/registration/displayRegistration';

export class App {
  footer: Footer;

  main: typeof Main | typeof LoginApp | typeof RegistrationApp | typeof CatalogApp;

  header: Header;

  constructor() {
    this.header = new Header();
    this.main = this.getBody();
    this.footer = new Footer();
  }

  urlChange(): void {
    this.main = this.getBody();
    this.main.create();
  }

  getBody(): typeof Main | typeof LoginApp | typeof RegistrationApp | typeof CatalogApp {
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
    this.main.create();
    this.footer.create();

    window.onpopstate = (): void => {
      this.urlChange();
    };
  }
}
