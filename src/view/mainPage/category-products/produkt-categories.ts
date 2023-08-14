import ElementCreator from '../../../util/ElementCreator';
import SaleLink from '../sale-link';
import { categoryConfig } from './produkt-categories-config';

export default class ProductCategories {
  create(): ElementCreator {
    const productCategories = new ElementCreator({
      tag: 'div',
      classNames: ['product-categories'],
    });

    const productCategoriesContainer = new ElementCreator({
      tag: 'div',
      classNames: ['product-categories__container'],
    });

    categoryConfig.forEach((category, index) => {
      const link = new ElementCreator({
        tag: 'a',
        classNames: [],
        attributes: [
          { name: 'href', value: `#${category.name}` },
          { name: 'index', value: `${index + 1}` },
        ],
        textContent: category.name,
      });
      productCategoriesContainer.addInnerElement(link);
    });

    productCategories.addInnerElement(productCategoriesContainer);

    const saleLink = new SaleLink().create();
    productCategoriesContainer.addInnerElement(saleLink);

    return productCategories;
  }
}
