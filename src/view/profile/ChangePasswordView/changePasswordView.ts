import PasswordChangeView from './PaswordView';

export default class ChangePassword {
  static create(): void {
    const view = new PasswordChangeView();
    const main = document.querySelector('.mainView');
    if (!main) {
      return;
    }

    main.innerHTML = '';
    main.appendChild(view.getElement());
  }
}
