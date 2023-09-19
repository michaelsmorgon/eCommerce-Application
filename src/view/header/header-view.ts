import HeaderContainer from './header-container';
import Menu from './header-menu';
import UserPanel from './user-panel';
import BurgerMenu from './burger-menu';
import { BasketCounter } from './basket-counter';

export default class Header {
  burgerMenu!: BurgerMenu;

  create(): void {
    const headerContainer = new HeaderContainer();
    const { headerCenter, headerUser } = headerContainer.create();
    new Menu().create(headerCenter);
    new UserPanel().create(headerUser);
    const basketCounter = new BasketCounter('.basket-counter-container');
    basketCounter.render();

    this.burgerMenu = new BurgerMenu('.burger-menu', '.header__center', '.overlay');
  }
}
