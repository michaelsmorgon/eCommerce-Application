import ElementCreator from '../../util/ElementCreator';

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
      callback: (): void => {
        //  Add Click function by pressing
      },
    });

    headerButtons.addInnerElement(loginButton);
    headerButtons.addInnerElement(logoutButton);
    headerButtons.addInnerElement(registrationButton);

    return headerButtons;
  }
}
