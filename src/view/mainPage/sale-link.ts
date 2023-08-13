import ElementCreator from '../../util/ElementCreator';

export default class SaleLink {
  create(): ElementCreator {
    const saleLink = new ElementCreator({
      tag: 'a',
      attributes: [{ name: 'href', value: '#sale' }],
      classNames: ['sale-link'],
      textContent: 'Sale',
    });

    const saleIcon = new ElementCreator({
      tag: 'img',
      classNames: ['sale-icon'],
      attributes: [
        { name: 'src', value: '/assets/icons/sale.png' },
        { name: 'alt', value: 'icon' },
      ],
    });

    saleLink.addInnerElement(saleIcon);

    return saleLink;
  }
}
