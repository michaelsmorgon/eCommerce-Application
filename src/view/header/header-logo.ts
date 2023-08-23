import ElementCreator from '../../util/ElementCreator';
import { route } from '../../router/router';

export default class HeaderLogo {
  create(): ElementCreator {
    const logoLink = new ElementCreator({
      tag: 'a',
      classNames: [],
      attributes: [{ name: 'href', value: '/' }],
      callback: (event: Event): void => {
        event.preventDefault();
        const mouseEvent = event as MouseEvent;
        route(mouseEvent);
      },
    });
    const logoImage = new ElementCreator({
      tag: 'img',
      classNames: ['logo-img'],
      attributes: [
        { name: 'src', value: './assets/images/Sport-logo.png' },
        { name: 'alt', value: 'logo' },
      ],
    });
    logoLink.addInnerElement(logoImage);

    const headerLogo = new ElementCreator({
      tag: 'div',
      classNames: ['header__logo'],
    });
    headerLogo.addInnerElement(logoLink);

    return headerLogo;
  }
}
