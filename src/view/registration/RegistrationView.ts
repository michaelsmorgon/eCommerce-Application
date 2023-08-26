import { CustomerDraft, BaseAddress } from '@commercetools/platform-sdk';
import { RegInputClasses } from '../../data/registration-fields';
import ElementCreator, { ElementConfig } from '../../util/ElementCreator';
import View, { ViewParams } from '../View';
import { FieldValidator } from './validation-fields/FieldValidator';
import './registration-view.css';
import { Customer } from '../../api/Customer';
import { UserInfoView } from './user-view/UserInfoView';
import { UserAddressView } from './user-view/UserAddressView';
import { route } from '../../router/router';
import { LocaleStorage } from '../../api/LocaleStorage';
import { TokenCacheStore } from '../../api/TokenCacheStore';

const CssClassesForm = {
  REGISTRATION_CONTAINER: 'registration__container',
  USER_INFO_CAPTION: 'user-info__caption',
  REGISTRATION_BTN: 'registration-btn',
};

const AddressCaptions = {
  COMMON_CAPTION: 'User Details',
  ADDRESS_CAPTION: 'Address',
};

export class RegistrationView extends View {
  constructor() {
    const params: ViewParams = {
      tag: 'form',
      classNames: [CssClassesForm.REGISTRATION_CONTAINER],
    };
    super(params);
    this.create();
  }

  create(): void {
    this.addCaption(AddressCaptions.COMMON_CAPTION);
    const userInfoView = new UserInfoView().getHtmlElement();
    this.viewElementCreator.addInnerElement(userInfoView);
    const userAddressView = new UserAddressView().getHtmlElement();
    this.viewElementCreator.addInnerElement(userAddressView);
    this.addSubmitBtn();
    this.addLoginBtn();
  }

  private addCaption(caption: string): void {
    const params: ElementConfig = {
      tag: 'h2',
      classNames: [CssClassesForm.USER_INFO_CAPTION],
      textContent: caption,
    };
    const userInfoCaption = new ElementCreator(params);
    this.viewElementCreator.addInnerElement(userInfoCaption);
  }

  private addSubmitBtn(): void {
    const params: ElementConfig = {
      tag: 'button',
      classNames: [CssClassesForm.REGISTRATION_BTN],
      textContent: 'Sign Up',
      attributes: [
        { name: 'type', value: 'submit' },
        { name: 'href', value: '/' },
      ],
      callback: async (event: Event) => {
        this.submitBtnHandler(event);
      },
    };
    const submitBtn = new ElementCreator(params);
    const submitBtnElement = submitBtn.getElement();
    this.viewElementCreator.addInnerElement(submitBtnElement);
  }

  private addLoginBtn(): void {
    const spanParams: ElementConfig = {
      tag: 'span',
      classNames: ['login-content-TextSignup'],
      textContent: 'Already have an account?',
    };
    const spanText = new ElementCreator(spanParams);
    this.viewElementCreator.addInnerElement(spanText.getElement());

    const params: ElementConfig = {
      tag: 'a',
      classNames: ['login-content-loginSignup'],
      textContent: 'Login',
      attributes: [{ name: 'href', value: '/login' }],
      callback: (event: Event): void => {
        const mouseEvent = event as MouseEvent;
        route(mouseEvent);
      },
    };
    const loginBtn = new ElementCreator(params);
    this.viewElementCreator.addInnerElement(loginBtn.getElement());
  }

  private async submitBtnHandler(event: Event): Promise<void> {
    event.preventDefault();
    const fieldChecker = new FieldValidator();

    const isValid = fieldChecker.validateFields();
    if (isValid) {
      const params = this.getCustomerParams();
      const tokenCacheStore = new TokenCacheStore();
      const customer = new Customer(tokenCacheStore);
      customer
        .createCustomer(params)
        .then(() => {
          setTimeout(() => {
            LocaleStorage.saveLocalStorage(LocaleStorage.TOKEN, tokenCacheStore.get().token);
            route(event as MouseEvent);
          }, 1000);
        })
        .catch(() => {});
    }
  }

  private getCustomerParams(): CustomerDraft {
    const includeBilling = document.querySelector(`#billing-include`) as HTMLInputElement;
    const defaultBilling = document.querySelector(`#billing-def`) as HTMLInputElement;
    const useAsShipping = document.querySelector(`#use-shipping`) as HTMLInputElement;
    const includeShipping = document.querySelector(`#shipping-include`) as HTMLInputElement;
    const defaultShipping = document.querySelector(`#shipping-def`) as HTMLInputElement;
    const useAsBilling = document.querySelector(`#use-billing`) as HTMLInputElement;
    const addresses: BaseAddress[] = [];

    let defaultBillingIndex;
    let defaultShippingIndex;
    const billingIndexes = [];
    const shippingIndexes = [];
    if (includeBilling.checked) {
      billingIndexes.push(0);
      const billingAddress = this.getBillingAddress();
      addresses.push(billingAddress);
      if (defaultBilling.checked) {
        defaultBillingIndex = 0;
      }
      if (useAsShipping.checked) {
        shippingIndexes.push(0);
      }
    }
    if (includeShipping.checked) {
      shippingIndexes.push(includeBilling.checked ? 1 : 0);
      const shippingAddress = this.getShippingAddress();
      addresses.push(shippingAddress);
      if (defaultShipping.checked) {
        defaultShippingIndex = includeBilling.checked ? 1 : 0;
      }
      if (useAsBilling.checked) {
        billingIndexes.push(includeBilling.checked ? 1 : 0);
      }
    }
    return this.getParams(addresses, defaultBillingIndex, defaultShippingIndex, billingIndexes, shippingIndexes);
  }

  private getParams(
    addresses: BaseAddress[],
    defaultBillingIndex: number | undefined,
    defaultShippingIndex: number | undefined,
    billingIndexes: number[],
    shippingIndexes: number[]
  ): CustomerDraft {
    return {
      email: this.getFieldValue(RegInputClasses.REG_EMAIL),
      password: this.getFieldValue(RegInputClasses.REG_PASS),
      firstName: this.getFieldValue(RegInputClasses.REG_FIRST_NAME),
      lastName: this.getFieldValue(RegInputClasses.REG_LAST_NAME),
      dateOfBirth: this.getFieldValue(RegInputClasses.REG_DATE_OF_BIRTH),
      addresses: addresses.length === 0 ? undefined : addresses,
      defaultBillingAddress: defaultBillingIndex,
      defaultShippingAddress: defaultShippingIndex,
      billingAddresses: billingIndexes,
      shippingAddresses: shippingIndexes,
    };
  }

  private getBillingAddress(): BaseAddress {
    return {
      streetName: this.getFieldValue(RegInputClasses.REG_STREET),
      city: this.getFieldValue(RegInputClasses.REG_CITY),
      postalCode: this.getFieldValue(RegInputClasses.REG_POSTAL_CODE),
      country: this.getFieldValue(RegInputClasses.REG_COUNTRY),
    };
  }

  private getShippingAddress(): BaseAddress {
    return {
      streetName: this.getFieldValue(RegInputClasses.REG_STREET_SHIPPING),
      city: this.getFieldValue(RegInputClasses.REG_CITY_SHIPPING),
      postalCode: this.getFieldValue(RegInputClasses.REG_POSTAL_CODE_SHIPPING),
      country: this.getFieldValue(RegInputClasses.REG_COUNTRY_SHIPPING),
    };
  }

  private getFieldValue(className: string): string {
    let element = document.querySelector(`.${className} > input`) as HTMLInputElement;
    if (className === RegInputClasses.REG_COUNTRY || className === RegInputClasses.REG_COUNTRY_SHIPPING) {
      element = document.querySelector(`.${className} > select`) as HTMLInputElement;
    }
    return element.value ? element.value : '';
  }
}
