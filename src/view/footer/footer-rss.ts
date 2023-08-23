import ElementCreator from '../../util/ElementCreator';

export default class FooterRssCreator {
  createFooterRss(): ElementCreator {
    const footerRss = new ElementCreator({
      tag: 'div',
      classNames: ['rss-container'],
    });

    const rssLink = new ElementCreator({
      tag: 'a',
      classNames: ['footer__rss'],
      attributes: [
        { name: 'href', value: 'https://rs.school/js/' },
        { name: 'target', value: '_blank' },
      ],
    });

    footerRss.addInnerElement(rssLink);

    return footerRss;
  }
}
