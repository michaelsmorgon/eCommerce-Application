import ElementCreator from '../../util/ElementCreator';
import { route } from '../../router/router';
import { LocaleStorage } from '../../api/LocaleStorage';

export default class AuthButtons {
  create(): ElementCreator {
    const headerButtons = this.createHeaderButtons();
    const loginButton = this.createLoginBtn();
    const logoutButton = this.createLogoutBtn();
    const registrationButton = this.createRegistrationBtn();

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

  private createLoginBtn(): ElementCreator {
    const btn = new ElementCreator({
      tag: 'a',
      classNames: [`login-button`],
      textContent: 'Login',
      attributes: [{ name: 'href', value: '/login' }],
      callback: (event: Event): void => {
        const mouseEvent = event as MouseEvent;
        route(mouseEvent);
      },
    });

    return this.createButton(btn, 'login', './assets/icons/login-icon.png');
  }

  private createLogoutBtn(): ElementCreator {
    const btn = new ElementCreator({
      tag: 'a',
      classNames: [`logout-button`],
      textContent: 'Logout',
      attributes: [{ name: 'href', value: '/' }],
      callback: (event: Event): void => {
        const mouseEvent = event as MouseEvent;
        LocaleStorage.clearLocalStorage(LocaleStorage.TOKEN);
        route(mouseEvent);
      },
    });

    return this.createButton(btn, 'logout', './assets/icons/logout-icon.png');
  }

  private createRegistrationBtn(): ElementCreator {
    const btn = new ElementCreator({
      tag: 'a',
      classNames: [`registration-button`],
      textContent: 'Registration',
      attributes: [{ name: 'href', value: '/registration' }],
      callback: (event: Event): void => {
        const mouseEvent = event as MouseEvent;
        LocaleStorage.clearLocalStorage(LocaleStorage.TOKEN);
        route(mouseEvent);
      },
    });

    return this.createButton(btn, 'registration', './assets/icons/registration-1.png');
  }

  private createButton(button: ElementCreator, iconClass: string, iconSrc: string): ElementCreator {
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
