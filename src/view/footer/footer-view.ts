import ElementCreator from '../../util/ElementCreator';
import FooterRssCreator from './footer-rss';
import GitHubLinksCreator from './github-links';
import FooterAutorCreator from './footer-autor';

export default class Footer {
  create(): ElementCreator {
    const parentElement = document.body;
    const footerContainer = new ElementCreator({
      tag: 'div',
      classNames: ['footer__container'],
    });

    const gitContainer = new ElementCreator({
      tag: 'div',
      classNames: ['git-container'],
    });

    const footerRssCreator = new FooterRssCreator();
    const footerRssElements = footerRssCreator.createFooterRss();

    const gitHubLinksCreator = new GitHubLinksCreator();
    const gitHubLinksElements = gitHubLinksCreator.createGitHubLinks();

    const footerAutorCreator = new FooterAutorCreator();
    const footerAutorElement = footerAutorCreator.createFooterAutor();

    footerContainer.addInnerElement(gitContainer);

    gitHubLinksElements.forEach((element) => gitContainer.addInnerElement(element));

    footerContainer.addInnerElement(footerAutorElement);
    footerContainer.addInnerElement(footerRssElements);

    const footer = new ElementCreator({
      tag: 'footer',
      classNames: ['footer'],
    });

    footer.addInnerElement(footerContainer);
    parentElement.appendChild(footer.getElement());

    return footer;
  }
}
