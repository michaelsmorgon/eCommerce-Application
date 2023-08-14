import ElementCreator from '../../util/ElementCreator';
import ProductCategories from './category-products/produkt-categories';
import MainBanner from './main-banner';
import CategoriesMainSektion from './category-products/categories-section';
import BenefitsSectionCreator from './benefits/benefits-creator';
import MetodsSectionCreator from './benefits/metods-creator';

export default class Main {
  create(): ElementCreator {
    const parentElement = document.body;
    const main = new ElementCreator({
      tag: 'main',
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
    benefitsSectionCreator.addInnerElement(metodsSectionCreator);
    section.addInnerElement(productCategories);
    section.addInnerElement(mainBanner);
    section.addInnerElement(categoriesSektion);
    section.addInnerElement(benefitsSectionCreator);

    main.addInnerElement(section);
    parentElement.appendChild(main.getElement());

    return main;
  }
}
