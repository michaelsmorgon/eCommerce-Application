import ElementCreator from '../../util/ElementCreator';
import HeaderLogo from './header-logo';

export default class HeaderContainer {
  create(): { headerCenter: ElementCreator; headerUser: ElementCreator } {
    const parentElement = document.body;
    const header = new ElementCreator({
      tag: 'header',
      classNames: ['header'],
    });

    const headerContainer = new ElementCreator({
      tag: 'div',
      classNames: ['header__container'],
    });

    const headerLogo = new HeaderLogo().create();

    const headerCenter = new ElementCreator({
      tag: 'div',
      classNames: ['header__center'],
    });

    const headerUser = new ElementCreator({
      tag: 'div',
      classNames: ['user-panel'],
    });

    const overlay = new ElementCreator({
      tag: 'div',
      classNames: ['overlay'],
    });

    headerContainer.addInnerElement(headerLogo);
    headerContainer.addInnerElement(headerCenter);
    headerContainer.addInnerElement(headerUser);
    headerContainer.addInnerElement(overlay);

    header.addInnerElement(headerContainer);
    parentElement.classList.add('body');
    parentElement.appendChild(header.getElement());

    return { headerCenter, headerUser };
  }
}
