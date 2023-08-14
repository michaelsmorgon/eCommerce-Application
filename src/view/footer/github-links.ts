import ElementCreator, { ElementConfig } from '../../util/ElementCreator';

export default class GitHubLinksCreator {
  createGitHubLinks(): ElementCreator[] {
    const githubLinks: ElementConfig[] = [
      {
        tag: 'a',
        classNames: ['footer__github'],
        attributes: [
          { name: 'href', value: 'https://github.com/AndreWAr85' },
          { name: 'target', value: '_blank' },
        ],
      },
      {
        tag: 'a',
        classNames: ['footer__github'],
        attributes: [
          { name: 'href', value: 'https://github.com/AndreWAr85' },
          { name: 'target', value: '_blank' },
        ],
      },
      {
        tag: 'a',
        classNames: ['footer__github'],
        attributes: [
          { name: 'href', value: 'https://github.com/AndreWAr85' },
          { name: 'target', value: '_blank' },
        ],
      },
    ];

    return githubLinks.map((linkConfig) => new ElementCreator(linkConfig));
  }
}
