import HeaderContainer from './header-container';
import Menu from './header-menu';
import UserPanel from './user-panel';

export default class Header {
  create(): void {
    const headerContainer = new HeaderContainer();
    const { headerCenter, headerUser } = headerContainer.create();
    new Menu().create(headerCenter);
    new UserPanel().create(headerUser);
  }
}
