import ElementCreator from '../../util/ElementCreator';

export default class FooterAutorCreator {
  createFooterAutor(): ElementCreator {
    const footerAutor = new ElementCreator({
      tag: 'div',
      classNames: ['footer__autor'],
      textContent: 'Dumian',
    });

    const footerYear = new ElementCreator({
      tag: 'span',
      classNames: ['footer__year'],
      textContent: '2023',
    });

    footerAutor.addInnerElement(footerYear);

    return footerAutor;
  }
}
