import ElementCreator from '../../util/ElementCreator';
import { RegistrationView } from '../registration/RegistrationView';

export default class AuthButtons {
  create(): ElementCreator {
    const headerButtons = new ElementCreator({
      tag: 'div',
      classNames: ['auth-buttons'],
    });

    const loginButton = new ElementCreator({
      tag: 'button',
      classNames: ['login-button'],
      textContent: 'Login',
      callback: (): void => {
        // Add Click function by pressing
      },
    });

    const logoutButton = new ElementCreator({
      tag: 'button',
      classNames: ['logout-button'],
      textContent: 'Logout',
      callback: (): void => {
        // Add Click function by pressing
      },
    });

    const registrationButton = new ElementCreator({
      tag: 'button',
      classNames: ['registration-button'],
      textContent: 'Registration',
      callback: () => this.displayRegistrationHandler(),
    });

    headerButtons.addInnerElement(loginButton);
    headerButtons.addInnerElement(logoutButton);
    headerButtons.addInnerElement(registrationButton);

    return headerButtons;
  }

  public displayRegistrationHandler(): void {
    const regView = new RegistrationView();
    const main = document.querySelector('.main');

    main?.appendChild(regView.getHtmlElement());
  }
}
