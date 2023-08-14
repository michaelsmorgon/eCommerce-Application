import ElementCreator from '../../../util/ElementCreator';
import { categoryConfig } from './produkt-categories-config';

export default class CategoriesMainSektion {
  create(): ElementCreator {
    const productCategories = new ElementCreator({
      tag: 'div',
      classNames: ['product-section'],
    });
    const productCategoriesContainer = new ElementCreator({
      tag: 'div',
      classNames: ['product-section__container'],
    });
    categoryConfig.forEach((category, index) => {
      const categoriesCards = new ElementCreator({
        tag: 'div',
        classNames: ['product-cards'],
      });
      const categoryIcon = new ElementCreator({
        tag: 'img',
        classNames: ['img-cards'],
        attributes: [
          { name: 'src', value: `${category.img}` },
          { name: 'alt', value: 'logo' },
        ],
      });
      const link = new ElementCreator({
        tag: 'a',
        classNames: ['card-link'],
        textContent: category.name,
        attributes: [
          { name: 'href', value: `#${category.name}` },
          { name: 'index', value: `${index + 1}` },
        ],
      });
      categoriesCards.addInnerElement(link);
      link.addInnerElement(categoryIcon);
      productCategoriesContainer.addInnerElement(categoriesCards);
    });
    productCategories.addInnerElement(productCategoriesContainer);
    return productCategories;
  }
}
