import ElementCreator from '../../../util/ElementCreator';
import { benefitsData } from './benefits-data';

export default class BenefitsSectionCreator {
  create(): ElementCreator {
    const benefitsContainer = new ElementCreator({
      tag: 'div',
      classNames: ['benefits-container'],
    });

    benefitsData.forEach((benefit) => {
      const benefitElement = new ElementCreator({
        tag: 'div',
        classNames: ['benefit'],
      });

      const iconElement = new ElementCreator({
        tag: 'div',
        classNames: ['benefit__icon'],
      });

      const textElement = new ElementCreator({
        tag: 'div',
        classNames: ['benefit-text'],
        textContent: benefit.text,
      });

      benefitElement.addInnerElement(iconElement);
      benefitElement.addInnerElement(textElement);
      benefitsContainer.addInnerElement(benefitElement);
    });

    const mainBenefitsElement = new ElementCreator({
      tag: 'div',
      classNames: ['benefits'],
    });

    mainBenefitsElement.addInnerElement(benefitsContainer);
    return mainBenefitsElement;
  }
}
