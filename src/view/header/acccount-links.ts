import ElementCreator from '../../util/ElementCreator';

export default class AccountLink {
  create(): ElementCreator {
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
}
