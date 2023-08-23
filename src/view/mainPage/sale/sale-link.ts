import { route } from '../../../router/router';
import ElementCreator from '../../../util/ElementCreator';

export default class SaleLink {
  create(): ElementCreator {
    const saleLink = new ElementCreator({
      tag: 'a',
      attributes: [{ name: 'href', value: '/sale' }],
      classNames: ['sale-link'],
      textContent: 'Sale',
      callback: (event: Event): void => {
        const mouseEvent = event as MouseEvent;
        route(mouseEvent);
      },
    });

    const saleIcon = new ElementCreator({
      tag: 'img',
      classNames: ['sale-icon'],
      attributes: [
        { name: 'src', value: '/assets/icons/sale.png' },
        { name: 'alt', value: 'icon' },
      ],
      callback: (event: Event): void => {
        const mouseEvent = event as MouseEvent;
        route(mouseEvent);
      },
    });

    saleLink.addInnerElement(saleIcon);

    return saleLink;
  }
}
