import ElementCreator from '../../util/ElementCreator';

export default class MainBanner extends ElementCreator {
  constructor() {
    super({
      tag: 'div',
      classNames: ['baners'],
    });

    const banner = new ElementCreator({
      tag: 'div',
      classNames: ['baners__content'],
    });

    const bannerText = ['Reach higher', 'Run faster', 'Train smarter', 'With us, your potential is limitless'];

    bannerText.forEach((text) => {
      const content = new ElementCreator({
        tag: 'span',
        classNames: [],
        textContent: text,
      });
      banner.addInnerElement(content);
    });
    this.addInnerElement(banner);
  }
}
