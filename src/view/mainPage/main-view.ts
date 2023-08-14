import ElementCreator from '../../util/ElementCreator';
import ProductCategories from './produkt-categories';
import MainBanner from './main-banner';
import CategoriesMainSektion from './categories-section';

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

    section.addInnerElement(productCategories);
    section.addInnerElement(mainBanner);
    section.addInnerElement(categoriesSektion);

    main.addInnerElement(section);
    parentElement.appendChild(main.getElement());

    return main;
  }
}
