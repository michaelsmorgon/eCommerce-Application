import LoginView from './loginView/loginview';

export default class LoginApp {
  static create(): void {
    const view = new LoginView();
    const main = document.querySelector('.mainView');
    if (!main) {
      console.log();
      return;
    }
    main.innerHTML = view.getElement().outerHTML;
  }
}
