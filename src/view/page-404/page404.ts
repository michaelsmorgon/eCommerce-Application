import ElementCreator, { ElementConfig } from '../../util/ElementCreator';

export default class NotFoundPage {
  private container: HTMLElement;

  constructor() {
    this.container = document.createElement('div');
    this.container.classList.add('not-found-container');

    const iconConfig: ElementConfig = {
      tag: 'div',
      classNames: ['not-found-icon'],
    };
    const titleConfig: ElementConfig = {
      tag: 'div',
      classNames: ['not-found-title'],
      textContent: '404 - Page Not Found',
    };
    const messageConfig: ElementConfig = {
      tag: 'p',
      classNames: ['not-found-message'],
      textContent: 'The requested page could not be found.',
    };

    const iconElement = new ElementCreator(iconConfig).getElement();
    const titleElement = new ElementCreator(titleConfig).getElement();
    const messageElement = new ElementCreator(messageConfig).getElement();

    this.container.appendChild(iconElement);
    this.container.appendChild(titleElement);
    this.container.appendChild(messageElement);
  }

  public getContainer(): HTMLElement {
    return this.container;
  }
}
