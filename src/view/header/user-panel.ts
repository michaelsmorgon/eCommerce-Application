import ElementCreator from '../../util/ElementCreator';
import AccountLink from './acccount-links';
import BasketLink from './basket-links';

export default class UserPanel {
  create(headerUser: ElementCreator): void {
    const menuBurger = new ElementCreator({
      tag: 'div',
      classNames: ['burger-menu'],
    });

    const elementBurger = new ElementCreator({
      tag: 'span',
      classNames: [],
    });

    const accountDiv = new AccountLink().create();
    const basketDiv = new BasketLink().create();

    headerUser.addInnerElement(accountDiv);
    headerUser.addInnerElement(basketDiv);
    headerUser.addInnerElement(menuBurger);
    menuBurger.addInnerElement(elementBurger);
  }
}
