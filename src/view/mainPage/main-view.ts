import ElementCreator from '../../util/ElementCreator';
import ProductCategories from './produkt-categories';

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

    section.addInnerElement(productCategories);

    main.addInnerElement(section);
    parentElement.appendChild(main.getElement());

    return main;
  }
}
