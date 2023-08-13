import ElementCreator from '../../util/ElementCreator';

export default class BasketLink {
  create(): ElementCreator {
    const basketLink = new ElementCreator({
      tag: 'a',
      classNames: [],
      attributes: [{ name: 'href', value: '#basket' }],
    });

    const basketImage = new ElementCreator({
      tag: 'img',
      classNames: ['basket-logo'],
      attributes: [
        {
          name: 'src',
          value: './assets/icons/basket.png',
        },
        {
          name: 'alt',
          value: 'basket',
        },
      ],
    });

    basketLink.addInnerElement(basketImage);

    const basketDiv = new ElementCreator({
      tag: 'div',
      classNames: ['basket'],
    });

    basketDiv.addInnerElement(basketLink);

    return basketDiv;
  }
}