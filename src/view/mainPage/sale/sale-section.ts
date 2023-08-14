/* eslint-disable max-lines-per-function */
import ElementCreator from '../../../util/ElementCreator';
import { saleConfig } from './sale-config';

export default class SaleMainSektion {
  create(): ElementCreator {
    const productSale = new ElementCreator({
      tag: 'div',
      classNames: ['sale-section'],
    });
    const productSaleContainer = new ElementCreator({
      tag: 'div',
      classNames: ['sale-section__container'],
    });

    const headerSaleContainer = new ElementCreator({
      tag: 'div',
      classNames: ['sale-section__header'],
      textContent: 'The best deals for you',
    });
    saleConfig.forEach((category, index) => {
      const saleCards = new ElementCreator({
        tag: 'div',
        classNames: ['sale-section__product'],
      });
      const link = new ElementCreator({
        tag: 'a',
        classNames: ['sale-section__sele-link'],
        attributes: [
          { name: 'href', value: `#${category.name}` },
          { name: 'index', value: `${index + 1}` },
        ],
      });

      const saleImg = new ElementCreator({
        tag: 'img',
        classNames: ['sale-section__sale-img'],
        attributes: [
          { name: 'src', value: `${category.img}` },
          { name: 'alt', value: 'logo' },
        ],
      });

      const saleImgContainer = new ElementCreator({
        tag: 'div',
        classNames: ['sale-section__img-container'],
      });

      const discount = new ElementCreator({
        tag: 'div',
        classNames: ['discount'],
        textContent: category.discount,
      });
      const produktSale = new ElementCreator({
        tag: 'div',
        classNames: ['sale-section__name-produkt'],
        textContent: category.name,
      });
      const priceContainer = new ElementCreator({
        tag: 'div',
        classNames: ['price'],
      });
      const priceNew = new ElementCreator({
        tag: 'div',
        classNames: ['price__new'],
        textContent: category.newPrice,
      });
      const priceOld = new ElementCreator({
        tag: 'div',
        classNames: ['price__old'],
        textContent: category.oldPrice,
      });

      productSaleContainer.addInnerElement(saleCards);
      link.addInnerElement(discount);
      priceContainer.addInnerElement(priceNew);
      priceContainer.addInnerElement(priceOld);
      saleCards.addInnerElement(link);
      link.addInnerElement(produktSale);
      link.addInnerElement(priceContainer);
      link.addInnerElement(saleImgContainer);
      saleImgContainer.addInnerElement(saleImg);
    });
    productSale.addInnerElement(headerSaleContainer);
    productSale.addInnerElement(productSaleContainer);
    return productSale;
  }
}
