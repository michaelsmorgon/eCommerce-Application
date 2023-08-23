/* import ElementCreator from '../../util/ElementCreator';
import ProductCategories from './category-products/produkt-categories';
import MainBanner from './main-banner';
import CategoriesMainSektion from './category-products/categories-section';
import BenefitsSectionCreator from './benefits/benefits-creator';
import MetodsSectionCreator from './benefits/metods-creator';
import SaleMainSektion from './sale/sale-section';

export default class Main {
  static create(): void {
    const main = new ElementCreator({
      tag: 'section',
      classNames: ['main'],
    });

    const section = new ElementCreator({
      tag: 'section',
      classNames: ['main-page'],
    });

    const mainBanner = new MainBanner();
    const productCategories = new ProductCategories().create();
    const categoriesSektion = new CategoriesMainSektion().create();
    const benefitsSectionCreator = new BenefitsSectionCreator().create();
    const metodsSectionCreator = new MetodsSectionCreator().create();
    const saleMainSektion = new SaleMainSektion().create();

    benefitsSectionCreator.addInnerElement(metodsSectionCreator);
    section.addInnerElement(productCategories);
    section.addInnerElement(mainBanner);
    section.addInnerElement(categoriesSektion);
    section.addInnerElement(saleMainSektion);
    section.addInnerElement(benefitsSectionCreator);

    main.addInnerElement(section);

    const mainView = document.querySelector('.mainView');
    if (!mainView) {
      console.log();
      return;
    }
    // mainView.innerHTML = main.getElement().outerHTML;
    mainView.innerHTML = '';
    mainView.appendChild(main.getElement());
  }
}
*/

import ElementCreator from '../../util/ElementCreator';
import { route } from '../../router/router';

export default class Main {
  static create(): void {
    const section = new ElementCreator({
      tag: 'section',
      classNames: ['main-page'],
    });
    const catalogLink = new ElementCreator({
      tag: 'a',
      classNames: ['catalog-link'],
      attributes: [{ name: 'href', value: '/catalog' }],
      textContent: 'Catalog',
    });
    section.addInnerElement(catalogLink);
    const aboutUsLink = new ElementCreator({
      tag: 'a',
      classNames: ['about-us-link'],
      attributes: [{ name: 'href', value: '/about_us' }],
      textContent: 'About Us',
    });
    section.addInnerElement(aboutUsLink);
    const loginButton = this.createButton('Login', '/login', 'login');
    section.addInnerElement(loginButton);
    const logoutButton = this.createButton('Logout', '/', 'logout');
    section.addInnerElement(logoutButton);
    const registrationButton = this.createButton('Registration', '/registration', 'registration');
    section.addInnerElement(registrationButton);

    const mainView = document.querySelector('.mainView');
    if (!mainView) {
      return;
    }
    mainView.innerHTML = '';
    mainView.appendChild(section.getElement());
  }

  private static createButton(text: string, href: string, iconClass: string): ElementCreator {
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
    button.addInnerElement(icon);

    return button;
  }
}
