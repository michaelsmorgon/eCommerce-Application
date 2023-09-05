import { RegistrationView } from './RegistrationView';

export default class EditPage {
  static create(): void {
    const view = new RegistrationView();
    const main = document.querySelector('.mainView');
    if (!main) {
      console.log();
      return;
    }
    // main.innerHTML = view.getHtmlElement().outerHTML;

    main.innerHTML = '';
    main.appendChild(view.getHtmlElement());
  }
}