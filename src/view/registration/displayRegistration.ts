import { RegistrationView } from './RegistrationView';

export default class RegistrationApp {
  static create(): void {
    const view = new RegistrationView();
    const main = document.querySelector('.mainView');
    if (!main) {
      console.log();
      return;
    }
    main.innerHTML = view.getHtmlElement().outerHTML;
  }
}



