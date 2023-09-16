import ElementCreator from '../../util/ElementCreator';
import MainBanner from './main-banner';
import CategoriesMainSektion from './category-products/categories-section';
import BenefitsSectionCreator from './benefits/benefits-creator';
import MetodsSectionCreator from './benefits/metods-creator';

import { route } from '../../router/router';
import { LocaleStorage } from '../../api/LocaleStorage';

export default class Main {
  static create(): void {
    const section = new ElementCreator({
      tag: 'section',
      classNames: ['main-page'],
    });

    section.addInnerElement(this.createButtonContainer());
    const mainBanner = new MainBanner();
    const categoriesSektion = new CategoriesMainSektion().create();
    const benefitsSectionCreator = new BenefitsSectionCreator().create();
    const metodsSectionCreator = new MetodsSectionCreator().create();

    benefitsSectionCreator.addInnerElement(metodsSectionCreator);
    section.addInnerElement(mainBanner);
    section.addInnerElement(categoriesSektion);
    section.addInnerElement(benefitsSectionCreator);

    const mainView = document.querySelector('.mainView');
    if (!mainView) {
      return;
    }
    mainView.innerHTML = '';
    mainView.appendChild(section.getElement());
  }

  private static createButtonContainer(): ElementCreator {
    const buttonContainer = new ElementCreator({
      tag: 'div',
      classNames: ['button__container'],
    });
    buttonContainer.addInnerElement(this.createCatalogButton());
    buttonContainer.addInnerElement(this.createAboutUsButton());
    buttonContainer.addInnerElement(this.createLoginButton());
    buttonContainer.addInnerElement(this.createLogoutButton());
    buttonContainer.addInnerElement(this.createRegistrationButton());

    return buttonContainer;
  }

  private static createCatalogButton(): ElementCreator {
    return this.createButton('Catalog', '/catalog', 'catalog-link');
  }

  private static createAboutUsButton(): ElementCreator {
    return this.createButton('About Us', '/aboutus', 'about-us-link');
  }

  private static createLoginButton(): ElementCreator {
    return this.createButton('Login', '/login', 'login-button', 'login');
  }

  private static createLogoutButton(): ElementCreator {
    const button = new ElementCreator({
      tag: 'a',
      classNames: [`logout-button`],
      textContent: 'Logout',
      attributes: [{ name: 'href', value: '/' }],
      callback: (event: Event): void => {
        const mouseEvent = event as MouseEvent;
        LocaleStorage.clearLocalStorage(LocaleStorage.TOKEN);
        LocaleStorage.clearLocalStorage(LocaleStorage.ANONYMOUS_ID);
        LocaleStorage.clearLocalStorage(LocaleStorage.CART_ID);
        LocaleStorage.clearLocalStorage(LocaleStorage.CUSTOMER_ID);
        route(mouseEvent);
      },
    });
    const icon = new ElementCreator({
      tag: 'div',
      classNames: ['logout'],
    });
    button.addInnerElement(icon);

    return button;
  }

  private static createRegistrationButton(): ElementCreator {
    return this.createButton('Registration', '/registration', 'registration-button', 'registration');
  }

  private static createButton(
    textContent: string,
    href: string,
    className: string,
    iconClass: string | null = null
  ): ElementCreator {
    const button = new ElementCreator({
      tag: 'a',
      classNames: [className],
      textContent,
      attributes: [{ name: 'href', value: href }],
      callback: (event: Event): void => {
        const mouseEvent = event as MouseEvent;
        route(mouseEvent);
      },
    });

    if (iconClass !== null) {
      const icon = new ElementCreator({
        tag: 'div',
        classNames: [iconClass],
      });
      button.addInnerElement(icon);
    }

    return button;
  }
}
