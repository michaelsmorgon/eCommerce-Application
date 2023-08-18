// app.ts
import ElementCreator from '../util/ElementCreator';
import Footer from '../view/footer/footer-view';
import Header from '../view/header/header-view';
import LoginApp from '../view/login/loginvView';
import Main from '../view/mainPage/main-view';
import RegistrationApp from '../view/registration/displayRegistration';

export class App {
  footer: Footer;
  main: typeof Main; 
  header: Header;

  constructor() {
    this.header = new Header();
    this.main = this.getBody(); 
    this.footer = new Footer();
    console.log(window.location.pathname);
  }

  urlChange() {
    this.main = this.getBody();
    this.main.create(); 
  }

  getBody() {
    switch (document.location.pathname) {
      case '/':
        return Main;
      case '/login':
        return LoginApp;
      case '/registration':
        return RegistrationApp;
      default:
        return Main;
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

    window.onpopstate = (e) => {
      e.preventDefault();
      console.log(window.location.pathname);
      this.urlChange();
    };
  }
}

