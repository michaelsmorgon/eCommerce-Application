import ElementCreator from '../../../util/ElementCreator';
import { paymentMethods, shippingMethods } from './benefits-data';

export default class MetodsSectionCreator {
  create(): ElementCreator {
    const methodsContainer = new ElementCreator({
      tag: 'div',
      classNames: ['methods__container'],
    });

    const paymentContainer = new ElementCreator({
      tag: 'div',
      classNames: ['payment'],
    });

    paymentMethods.forEach((method) => {
      const methodElement = new ElementCreator({
        tag: 'div',
        classNames: [method],
      });
      paymentContainer.addInnerElement(methodElement);
    });

    const shippingContainer = new ElementCreator({
      tag: 'div',
      classNames: ['shipping'],
    });

    shippingMethods.forEach((method) => {
      const methodElement = new ElementCreator({
        tag: 'div',
        classNames: [method],
      });
      shippingContainer.addInnerElement(methodElement);
    });

    methodsContainer.addInnerElement(paymentContainer);
    methodsContainer.addInnerElement(shippingContainer);
    return methodsContainer;
  }
}
