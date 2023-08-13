import ElementCreator from '../../util/ElementCreator';
import AccountLink from './acccount-links';
import BasketLink from './basket-links';
import AuthButtons from './header-buttons';

export default class UserPanel {
  create(headerUser: ElementCreator): void {
    const headerButtons = new AuthButtons().create();
    const accountDiv = new AccountLink().create();
    const basketDiv = new BasketLink().create();

    headerUser.addInnerElement(headerButtons);
    headerUser.addInnerElement(accountDiv);
    headerUser.addInnerElement(basketDiv);
  }
}
