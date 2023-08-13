import ElementCreator from '../../util/ElementCreator';

function handleLinkClick(clickedLink: HTMLElement | null): void {
  const menuLinks = document.querySelectorAll('.menu a');
  menuLinks.forEach((link) => link.classList.remove('active'));
  if (clickedLink) {
    clickedLink.classList.add('active');
  }
}

const clickableClassNames = [
  'logo-img',
  'registration-button',
  'logout-button',
  'login-button',
  'basket-logo',
  'account-icon',
];

export default class Menu {
  create(headerCenter: ElementCreator): void {
    const headerMenu = new ElementCreator({
      tag: 'nav',
      classNames: ['menu'],
    });

    const menuLinks = [
      { text: 'Catalog', href: '#catalog' },
      { text: 'About Us', href: '#about_as' },
    ];

    menuLinks.forEach((linkInfo) => {
      const link = new ElementCreator({
        tag: 'a',
        attributes: [{ name: 'href', value: linkInfo.href }],
        classNames: [],
        textContent: linkInfo.text,
      });

      link.getElement().addEventListener('click', (event) => {
        event.preventDefault();
        handleLinkClick(link.getElement());
      });

      headerMenu.addInnerElement(link);
    });

    document.addEventListener('click', (event) => {
      const clickedElement = event.target as HTMLElement;

      if (clickableClassNames.some((className) => clickedElement.classList.contains(className))) {
        handleLinkClick(null);
      }
    });

    headerCenter.addInnerElement(headerMenu);
  }
}