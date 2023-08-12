import ElementCreator from '../../util/ElementCreator';

function createHeaderLogo(): ElementCreator {
  const logoLink = new ElementCreator({
    tag: 'a',
    classNames: [],
    attributes: [{ name: 'href', value: '#main' }],
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

function createHeaderContainer(): { headerCenter: ElementCreator; headerUser: ElementCreator } {
  const parentElement = document.body;
  const header = new ElementCreator({
    tag: 'header',
    classNames: ['header'],
  });

  const headerContainer = new ElementCreator({
    tag: 'div',
    classNames: ['header__container'],
  });

  const headerLogo = createHeaderLogo();

  const headerCenter = new ElementCreator({
    tag: 'div',
    classNames: ['header__center'],
  });

  const headerUser = new ElementCreator({
    tag: 'div',
    classNames: ['user-panel'],
  });

  headerContainer.addInnerElement(headerLogo);
  headerContainer.addInnerElement(headerCenter);
  headerContainer.addInnerElement(headerUser);
  header.addInnerElement(headerContainer);
  parentElement.classList.add('body');
  parentElement.appendChild(header.getElement());

  return { headerCenter, headerUser };
}

function createMenu(headerCenter: ElementCreator): void {
  const headerMenu = new ElementCreator({
    tag: 'nav',
    classNames: ['menu'],
  });

  const catalogLink = new ElementCreator({
    tag: 'a',
    attributes: [{ name: 'href', value: '#catalog' }],
    classNames: [],
    textContent: 'Catalog',
  });

  const aboutUsLink = new ElementCreator({
    tag: 'a',
    attributes: [
      {
        name: 'href',
        value: '#about_as',
      },
    ],
    classNames: [],
    textContent: 'About Us',
  });

  headerMenu.addInnerElement(catalogLink);
  headerMenu.addInnerElement(aboutUsLink);
  headerCenter.addInnerElement(headerMenu);
}

function createAuthButtons(): ElementCreator {
  const headerButtons = new ElementCreator({
    tag: 'div',
    classNames: ['auth-buttons'],
  });

  const loginButton = new ElementCreator({
    tag: 'button',
    classNames: ['login-button'],
    textContent: 'Login',
    callback: (): void => {
      // Add Click function by pressing
    },
  });

  const logoutButton = new ElementCreator({
    tag: 'button',
    classNames: ['logout-button'],
    textContent: 'Logout',
    callback: (): void => {
      // Add Click function by pressing
    },
  });

  const registrationButton = new ElementCreator({
    tag: 'button',
    classNames: ['registration-button'],
    textContent: 'Registration',
    callback: (): void => {
      //  Add Click function by pressing
    },
  });

  headerButtons.addInnerElement(loginButton);
  headerButtons.addInnerElement(logoutButton);
  headerButtons.addInnerElement(registrationButton);

  return headerButtons;
}

function createAccountLink(): ElementCreator {
  const accountLink = new ElementCreator({
    tag: 'a',
    classNames: [],
    attributes: [{ name: 'href', value: '#account' }],
  });

  const accountImage = new ElementCreator({
    tag: 'img',
    classNames: ['account-icon'],
    attributes: [
      { name: 'src', value: './assets/icons/my-account.png' },
      { name: 'alt', value: 'account-icon' },
    ],
  });

  accountLink.addInnerElement(accountImage);

  const accountDiv = new ElementCreator({
    tag: 'div',
    classNames: ['account'],
  });

  accountDiv.addInnerElement(accountLink);

  return accountDiv;
}

function createBasketLink(): ElementCreator {
  const basketLink = new ElementCreator({
    tag: 'a',
    classNames: [],
    attributes: [{ name: 'href', value: '#basket' }],
  });

  const basketImage = new ElementCreator({
    tag: 'img',
    classNames: ['basket-logo'],
    attributes: [
      {
        name: 'src',
        value: './assets/icons/basket.png',
      },
      {
        name: 'alt',
        value: 'basket',
      },
    ],
  });

  basketLink.addInnerElement(basketImage);

  const basketDiv = new ElementCreator({
    tag: 'div',
    classNames: ['basket'],
  });

  basketDiv.addInnerElement(basketLink);

  return basketDiv;
}

function createUserPanel(headerUser: ElementCreator): void {
  const headerButtons = createAuthButtons();
  const accountDiv = createAccountLink();
  const basketDiv = createBasketLink();

  headerUser.addInnerElement(headerButtons);
  headerUser.addInnerElement(accountDiv);
  headerUser.addInnerElement(basketDiv);
}

export default function createHeader(): void {
  const { headerCenter, headerUser } = createHeaderContainer();
  createMenu(headerCenter);
  createUserPanel(headerUser);
}
