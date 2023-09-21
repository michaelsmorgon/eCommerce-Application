import { RegistrationView } from './RegistrationView';

export default class EditPage {
  static create(): void {
    const view = new RegistrationView();
    const main = document.querySelector('.mainView');
    if (!main) {
      return;
    }

    main.innerHTML = '';
    main.appendChild(view.getHtmlElement());
  }
}
