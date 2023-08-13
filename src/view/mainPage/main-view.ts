import ElementCreator from '../../util/ElementCreator';
import ProductCategories from './produkt-categories';
import MainBanner from './main-banner';

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

    const productCategories = new ProductCategories().create();
    const mainBanner = new MainBanner();

    section.addInnerElement(productCategories);
    section.addInnerElement(mainBanner);

    main.addInnerElement(section);
    parentElement.appendChild(main.getElement());

    return main;
  }
}
