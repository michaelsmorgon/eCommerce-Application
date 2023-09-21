import LoginView from './loginView/loginview';

export default class LoginApp {
  static create(): void {
    const view = new LoginView();
    const main = document.querySelector('.mainView');
    if (!main) {
      return;
    }
    main.innerHTML = '';
    main.appendChild(view.getElement());
  }
}
