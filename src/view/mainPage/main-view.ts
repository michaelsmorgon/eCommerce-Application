import ElementCreator from '../../util/ElementCreator';
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
