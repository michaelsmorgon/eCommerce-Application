import View, { ViewParams } from '../View';
import ElementCreator, { ElementConfig } from '../../util/ElementCreator';
import { developersData, DeveloperInfo } from './infoDevelopers';

export default class AboutUsView extends View {
  private infoTop: ElementCreator | undefined;

  private infoCentr: ElementCreator | undefined;

  private infoBottom: ElementCreator | undefined;

  private developerContainer: ElementCreator | undefined;

  constructor() {
    const params: ViewParams = {
      tag: 'section',
      classNames: ['about-us-section'],
    };
    super(params);
    this.addContentContainer();
    this.addContent();
  }

  private addContentContainer(): void {
    this.infoTop = this.createElementWithConfig({
      tag: 'div',
      classNames: ['about-us-top'],
    });

    this.infoCentr = this.createElementWithConfig({
      tag: 'div',
      classNames: ['about-us-centr'],
      textContent: '',
    });

    this.infoBottom = this.createElementWithConfig({
      tag: 'div',
      classNames: ['about-us-bottom'],
      textContent: '',
    });

    if (this.infoTop) {
      this.viewElementCreator.addInnerElement(this.infoTop);
    }
    if (this.infoCentr) {
      this.viewElementCreator.addInnerElement(this.infoCentr);
    }
    if (this.infoBottom) {
      this.viewElementCreator.addInnerElement(this.infoBottom);
    }
  }

  private createElementWithConfig(config: ElementConfig): ElementCreator {
    return new ElementCreator(config);
  }

  private infoTopContent(): ElementCreator {
    const topContent = this.createElementWithConfig({
      tag: 'div',
      classNames: ['top-content'],
    });

    const image = this.createElementWithConfig({
      tag: 'img',
      classNames: ['top-image'],
      attributes: [
        {
          name: 'src',
          value: 'assets/images/dev-logo.png',
        },
        {
          name: 'alt',
          value: 'developer logo',
        },
      ],
    });

    const textContent = this.createElementWithConfig({
      tag: 'div',
      textContent:
        'At DUMIAN, we believe in the power of collaboration and innovation. Our dedicated development team has worked tirelessly to create the successful product you see today. Get to know the individuals behind the scenes who have made it all possible:',
      classNames: ['top-text'],
    });

    topContent.addInnerElement(image);
    topContent.addInnerElement(textContent);

    return topContent;
  }

  private addDeveloperInfoToInfoCentr(developerInfo: DeveloperInfo): ElementCreator {
    const developerContainerParams: ElementConfig = {
      tag: 'div',
      classNames: ['developer-container'],
    };
    this.developerContainer = this.createElementWithConfig(developerContainerParams);

    this.createDeveloperNameElement(developerInfo);
    this.createDeveloperImage(developerInfo);
    this.createDeveloperInfoElements();
    this.createDeveloperInfoElement(developerInfo);
    this.createDeveloperGitHubElement(developerInfo);
    this.createDeveloperContributionsElement(developerInfo);

    return this.developerContainer;
  }

  private createDeveloperNameElement(developerInfo: DeveloperInfo): void {
    const developerNameElementParams: ElementConfig = {
      tag: 'div',
      textContent: developerInfo.name,
      classNames: ['developer-name'],
    };
    const developerNameElement = this.createElementWithConfig(developerNameElementParams);
    this.developerContainer?.addInnerElement(developerNameElement);
  }

  private createDeveloperImage(developerInfo: DeveloperInfo): void {
    const developerImageWrapperParams: ElementConfig = {
      tag: 'div',
      classNames: ['developer-image__wrapper'],
    };
    const developerImageWrapper = this.createElementWithConfig(developerImageWrapperParams);

    const developerImageParams: ElementConfig = {
      tag: 'img',
      attributes: [
        {
          name: 'src',
          value: developerInfo.foto,
        },
        {
          name: 'alt',
          value: developerInfo.name,
        },
      ],
      classNames: ['developer-image'],
    };
    const developerImage = this.createElementWithConfig(developerImageParams);

    developerImageWrapper.addInnerElement(developerImage);
    this.developerContainer?.addInnerElement(developerImageWrapper);
  }

  private createDeveloperInfoElements(): void {
    const developerInfoElementParams: ElementConfig = {
      tag: 'div',
      classNames: ['developer-info'],
    };
    const developerInfoElement = this.createElementWithConfig(developerInfoElementParams);
    this.developerContainer?.addInnerElement(developerInfoElement);
  }

  private createDeveloperInfoElement(developerInfo: DeveloperInfo): void {
    const developerInfoElementsParams: ElementConfig = {
      tag: 'ul',
      classNames: ['info-list'],
    };
    const developerInfoElements = this.createElementWithConfig(developerInfoElementsParams);

    Object.keys(developerInfo.info).forEach((key) => {
      const infoItemParams: ElementConfig = {
        tag: 'ol',
        textContent: developerInfo.info[key as keyof typeof developerInfo.info] as string,
        classNames: ['contribution'],
      };
      const infoItem = this.createElementWithConfig(infoItemParams);
      developerInfoElements.addInnerElement(infoItem);
    });

    this.developerContainer?.addInnerElement(developerInfoElements);
  }

  private createDeveloperGitHubElement(developerInfo: DeveloperInfo): void {
    const developerGitHubElementParams: ElementConfig = {
      tag: 'a',
      textContent: 'GitHub Profile',
      classNames: ['github-link'],
      attributes: [
        {
          name: 'href',
          value: developerInfo.gitHub,
        },
        {
          name: 'target',
          value: '_blank',
        },
      ],
    };
    const developerGitHubElement = this.createElementWithConfig(developerGitHubElementParams);
    this.developerContainer?.addInnerElement(developerGitHubElement);
  }

  private createDeveloperContributionsElement(developerInfo: DeveloperInfo): void {
    const developerContributionsElementParams: ElementConfig = {
      tag: 'ul',
      textContent: 'Contributions:',
      classNames: ['contributions'],
    };
    const developerContributionsElement = this.createElementWithConfig(developerContributionsElementParams);

    Object.keys(developerInfo.contributions).forEach((key) => {
      const contributionItemParams: ElementConfig = {
        tag: 'li',
        textContent: developerInfo.contributions[key as keyof typeof developerInfo.contributions] as string,
        classNames: ['contribution'],
      };
      const contributionItem = this.createElementWithConfig(contributionItemParams);
      developerContributionsElement.addInnerElement(contributionItem);
    });

    this.developerContainer?.addInnerElement(developerContributionsElement);
  }

  private createCollaborationContent(): ElementCreator {
    const collaborationContent = this.createElementWithConfig({
      tag: 'div',
      classNames: ['collaboration-content'],
    });

    collaborationContent.addInnerElement(this.createSuccessStory());
    collaborationContent.addInnerElement(this.createEndContent());
    collaborationContent.addInnerElement(this.createRssLogo());

    return collaborationContent;
  }

  private createSuccessStory(): ElementCreator {
    const successStory = this.createElementWithConfig({
      tag: 'div',
      classNames: ['success-story'],
      textContent:
        'Our success story is not just about individual expertise but also our seamless collaboration. We embraced agile methodologies, daily stand-ups, and open communication channels:',
    });

    successStory.addInnerElement(this.createCollaborationList());

    return successStory;
  }

  private createCollaborationList(): ElementCreator {
    const ul = this.createElementWithConfig({
      tag: 'ul',
      classNames: ['methodologies'],
    });

    ul.addInnerElement(this.createListItem('Regular Meetings: Daily stand-ups kept us aligned on goals and progress.'));
    ul.addInnerElement(
      this.createListItem('Collaborative Tools: We used Jira and GitHub to manage tasks and discussions.')
    );
    ul.addInnerElement(
      this.createListItem('Feedback Culture: Constructive feedback was encouraged to drive improvements.')
    );
    ul.addInnerElement(
      this.createListItem('Flexibility: We adapted to changing requirements and challenges with agility.')
    );

    return ul;
  }

  private createListItem(text: string): HTMLElement {
    const li = document.createElement('li');
    const firstColonIndex = text.indexOf(':');
    if (firstColonIndex !== -1) {
      const spanText = text.substring(0, firstColonIndex + 1);
      const span = document.createElement('span');
      span.classList.add('methodologie');
      span.textContent = spanText;
      li.appendChild(span);
      const remainingText = text.substring(firstColonIndex + 1);
      li.innerHTML += remainingText;
    } else {
      li.textContent = text;
    }
    return li;
  }

  private createEndContent(): ElementCreator {
    const end = this.createElementWithConfig({
      tag: 'div',
      classNames: ['end-content'],
      textContent:
        'The combination of diverse skills and the dedication of our team has resulted in the outcome you see on your screen. Thank you for choosing DUMIAN.',
    });

    return end;
  }

  private createRssLogo(): ElementCreator {
    const rssContainer = this.createElementWithConfig({
      tag: 'div',
      classNames: ['rss-logo'],
    });
    const rssLogoLink = this.createElementWithConfig({
      tag: 'a',
      classNames: ['rss-link'],
      attributes: [
        { name: 'href', value: 'https://rs.school/js/' },
        { name: 'target', value: '_blank' },
      ],
    });

    rssContainer.addInnerElement(rssLogoLink);
    return rssContainer;
  }

  private addContent(): void {
    const collaborationContent = this.createCollaborationContent();
    const topContent = this.infoTopContent();
    const developerContainer1 = this.addDeveloperInfoToInfoCentr(developersData.developer1);
    const developerContainer2 = this.addDeveloperInfoToInfoCentr(developersData.developer2);
    const developerContainer3 = this.addDeveloperInfoToInfoCentr(developersData.developer3);

    if (this.infoTop) {
      this.infoTop.addInnerElement(topContent);
    }

    if (this.infoCentr) {
      this.infoCentr.addInnerElement(developerContainer1);
      this.infoCentr.addInnerElement(developerContainer2);
      this.infoCentr.addInnerElement(developerContainer3);
    }

    if (this.infoBottom) {
      this.infoBottom.addInnerElement(collaborationContent);
    }
  }
}
