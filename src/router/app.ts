// app.ts
import ElementCreator from '../util/ElementCreator';
import CatalogApp from '../view/catalog/CatalogApp';
import ProductApp from '../view/display-produkt/productApp';
import Footer from '../view/footer/footer-view';
import Header from '../view/header/header-view';
import LoginApp from '../view/login/loginvView';
import Main from '../view/mainPage/main-view';
import NotFoundPageApp from '../view/page-404/page404View';
import ChangePassword from '../view/profile/ChangePasswordView/changePasswordView';
import EditPage from '../view/profile/EditPageView/displayRegistration';
import ProfileApp from '../view/profile/profileView';
import RegistrationApp from '../view/registration/displayRegistration';

export class App {
  footer: Footer;

  main: typeof Main | typeof LoginApp | typeof RegistrationApp | typeof CatalogApp | typeof ProductApp;

  header: Header;

  productKey: string | null = null;

  categoryId: string | null = null;

  constructor() {
    this.header = new Header();
    this.main = this.getBody();
    this.footer = new Footer();
  }

  urlChange(): void {
    this.main = this.getBody();
    if (this.productKey !== null) {
      this.main.create(this.productKey);
    } else if (this.categoryId !== null) {
      this.main.create(this.categoryId);
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
    const partPathList = document.location.pathname.match(/(\/[a-zA-Z0-9-]*)/g);

    if (partPathList === null) {
      return NotFoundPageApp;
    }
    const [firstLevel, secondLevel] = partPathList;
    switch (firstLevel) {
      case '/':
        return Main;
      case '/login':
        return LoginApp;
      case '/registration':
        return RegistrationApp;
      case '/catalog':
        if (partPathList.length > 1) {
          this.productKey = secondLevel.substring(1);
          return ProductApp;
        }
        return CatalogApp;
      case '/category':
        if (partPathList.length > 1) {
          this.categoryId = secondLevel.substring(1);
          return CatalogApp;
        }
        return CatalogApp;
      case '/profile':
        return ProfileApp;
      case '/EditPage':
        return EditPage;
      case '/ChangePassword':
        return ChangePassword;
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
