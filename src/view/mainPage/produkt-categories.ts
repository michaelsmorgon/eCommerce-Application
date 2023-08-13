import ElementCreator from '../../util/ElementCreator';
import SaleLink from './sale-link';

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

    const categories = ['Clothing and shoes', 'Bikes', 'Snowsports', 'Fitness and gym', 'Tourism'];

    categories.forEach((category, index) => {
      const link = new ElementCreator({
        tag: 'a',
        classNames: [],
        attributes: [
          { name: 'href', value: `#${index + 1}` },
          { name: 'index', value: `${index + 1}` },
        ],
        textContent: category,
      });
      productCategoriesContainer.addInnerElement(link);
    });

    productCategories.addInnerElement(productCategoriesContainer);

    const saleLink = new SaleLink().create();
    productCategoriesContainer.addInnerElement(saleLink);

    return productCategories;
  }
}
