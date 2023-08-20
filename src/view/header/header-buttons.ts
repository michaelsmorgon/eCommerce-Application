import ElementCreator from '../../util/ElementCreator';
import { route } from '../../router/router';

export default class AuthButtons {
  create(): ElementCreator {
    const headerButtons = this.createHeaderButtons();
    const loginButton = this.createButton('Login', '/login', 'login', './assets/icons/login-icon.png');
    const logoutButton = this.createButton('Logout', '/logout', 'logout', './assets/icons/logout-icon.png');
    const registrationButton = this.createButton(
      'Registration',
      '/registration',
      'registration',
      './assets/icons/registration-1.png'
    );

    headerButtons.addInnerElement(loginButton);
    headerButtons.addInnerElement(logoutButton);
    headerButtons.addInnerElement(registrationButton);

    return headerButtons;
  }

  private createHeaderButtons(): ElementCreator {
    return new ElementCreator({
      tag: 'div',
      classNames: ['auth-buttons'],
    });
  }

  private createButton(text: string, href: string, iconClass: string, iconSrc: string): ElementCreator {
    const button = new ElementCreator({
      tag: 'a',
      classNames: [`${iconClass}-button`],
      textContent: text,
      attributes: [{ name: 'href', value: href }],
      callback: (event: Event): void => {
        const mouseEvent = event as MouseEvent;
        route(mouseEvent);
      },
    });

    const icon = new ElementCreator({
      tag: 'div',
      classNames: [iconClass],
    });

    const img = new ElementCreator({
      tag: 'img',
      classNames: ['icon'],
      attributes: [{ name: 'src', value: iconSrc }],
    });

    icon.addInnerElement(img);
    button.addInnerElement(icon);

    return button;
  }
}
