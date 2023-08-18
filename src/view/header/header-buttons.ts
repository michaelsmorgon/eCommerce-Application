import ElementCreator from '../../util/ElementCreator';

export default class AuthButtons {
  create(): ElementCreator {
    const headerButtons = new ElementCreator({
      tag: 'div',
      classNames: ['auth-buttons'],
    });

    const loginButton = new ElementCreator({
      tag: 'a',
      classNames: ['login-button'],
      textContent: 'Login',
      attributes: [{ name: 'href', value: '/login' }],
      callback: (event: Event): void => {
        const mouseEvent = event as MouseEvent;
        this.route(mouseEvent);
      },
    });

    const logoutButton = new ElementCreator({
      tag: 'button',
      classNames: ['logout-button'],
      textContent: 'Logout',
      callback: (): void => {},
    });

    const registrationButton = new ElementCreator({
      tag: 'a',
      classNames: ['registration-button'],
      textContent: 'Registration',
      attributes: [
        { name: 'href', value: '/registration' },
      ],
      callback: (event: Event): void => {
        const mouseEvent = event as MouseEvent;
        this.route(mouseEvent);
      },
    });

    headerButtons.addInnerElement(loginButton);
    headerButtons.addInnerElement(logoutButton);
    headerButtons.addInnerElement(registrationButton);

    return headerButtons;
  }
  route(event: MouseEvent): void {
    const target = event.target as HTMLAnchorElement;
    if (!target || !target.href) {
      return;
    }

    window.history.pushState({}, '', target.href);
  }
}
