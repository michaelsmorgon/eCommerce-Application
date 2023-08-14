import LoginView from './loginView/loginview';

export default class App {
  static displayLevel(): void {
    const view = new LoginView();
    const main = document.querySelector('.main');
    main?.appendChild(view.getElement());
  }
}
