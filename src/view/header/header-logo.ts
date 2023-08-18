import ElementCreator from '../../util/ElementCreator';

export default class HeaderLogo {
  create(): ElementCreator {
    const logoLink = new ElementCreator({
      tag: 'a',
      classNames: [],
      attributes: [{ name: 'href', value: '/' },],
      callback: (event: Event): void => {
        const mouseEvent = event as MouseEvent;
        this.route(mouseEvent);
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

  route(event: MouseEvent): void {
    const target = event.target as HTMLAnchorElement;
    if (!target || !target.href) {
      return;
    }

    window.history.pushState({}, '', target.href);
  }
}
