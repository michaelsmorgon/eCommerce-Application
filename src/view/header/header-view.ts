import HeaderContainer from './header-container';
import Menu from './header-menu';
import UserPanel from './user-panel';
import BurgerMenu from './burger-menu';

export default class Header {
  burgerMenu!: BurgerMenu;

  create(): void {
    const headerContainer = new HeaderContainer();
    const { headerCenter, headerUser } = headerContainer.create();
    new Menu().create(headerCenter);
    new UserPanel().create(headerUser);

    this.burgerMenu = new BurgerMenu('.burger-menu', '.header__center', '.overlay');
  }
}
