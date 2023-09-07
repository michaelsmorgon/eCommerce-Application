import { ClientResponse, createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { RegInputClasses, userAddressFields, userAddressFieldsShipping } from '../../../../data/registration-fields';
import ElementCreator, { ElementConfig, ICallbackFunc } from '../../../../util/ElementCreator';
import { InputField } from '../../../../util/input_field/InputField';
import { SelectField } from '../../../../util/select_field/SelectField';
import View, { ViewParams } from '../../../View';
import { Warning } from '../input-field-warning/Warning';
import './user-view.css';

import { BuilderClient } from '../../../../api/BuilderClient';
import { TokenCacheStore } from '../../../../api/TokenCacheStore';
import { Address } from '../../profileView/profile';

type CheckboxConfig = {
  className: string;
  inputId: string;
  labelTextContent: string;
  isChecked: boolean;
  callback?: ICallbackFunc;
};

const CssClassesAddrView = {
  USER_ADDRESSES_CONTAINER: 'user-addresses__container',
  USER_ADDRESS_CAPTION: 'user-address__caption',
  USER_ADDRESS_CONTAINER: 'user-address__container',
  BILLING_ADDRESS: 'billing-address',
  SHIPPING_ADDRESS: 'shipping-address',
  BILLING_DEFAULT: 'billing_default',
  SHIPPING_DEFAULT: 'shipping_default',
  ADDRESS_CHECKBOX: 'address-checkbox',
  CHECKBOX_LABEL: 'address-label',
};

const checkboxIds = {
  INCLUDE_BILLING: 'billing-include',
  INCLUDE_SHIPPING: 'shipping-include',
  BILLING_DEFAULT: 'billing-def',
  SHIPPING_DEFAULT: 'shipping-def',
  USE_AS_BILLING: 'use-billing',
  USE_AS_SHIPPING: 'use-shipping',
};

const AddressCaptions = {
  BILLING_CAPTION: 'Billing Address',
  SHIPPING_CAPTION: 'Shipping Address',
};

const checkboxNames = {
  INCLUDE_BILLING: 'Include billing address',
  INCLUDE_SHIPPING: 'Include shipping address',
  DEFAULT_BILLING: 'Default billing address',
  DEFAULT_SHIPPING: 'Default shipping address',
  USE_BILLING: 'Use as billing address',
  USE_SHIPPING: 'Use as shipping address',
};

export class UserAddressView extends View {
  private tokenCacheStore: TokenCacheStore;

  constructor() {
    const params: ViewParams = {
      tag: 'div',
      classNames: [CssClassesAddrView.USER_ADDRESSES_CONTAINER],
    };
    super(params);
    this.CallMethod();
    this.tokenCacheStore = new TokenCacheStore();
  }

  async CallMethod(): Promise<void> {
    const response = await this.checkCustomerExists();
    await this.configureView();

    response?.body.addresses.forEach((address: Address) => {
      if (address.key === 'shipping') {
        this.setUserShippingValueToString(response);
      }
    });

    response?.body.addresses.forEach((address: Address) => {
      if (address.key === 'billing') {
        this.setUserBillingValueToString(response);
      }
    });
  }

  async checkCustomerExists(): Promise<ClientResponse | null> {
    const projectKey = 'dumians';
    const builderClient: BuilderClient = new BuilderClient(this.tokenCacheStore);
    const ctpClient = builderClient.httpMiddleware();
    const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({ projectKey });
    const id = localStorage.getItem('id');

    if (id !== null) {
      try {
        const response = await apiRoot.customers().withId({ ID: id }).get().execute();

        return response;
      } catch (error) {
        console.error('Error checking customer:', error);
        return null;
      }
    } else {
      console.error('Customer ID not found in local storage');
      return null;
    }
  }

  private configureView(): void {
    const billing = this.configureAddress();
    this.viewElementCreator.addInnerElement(billing);

    const shipping = this.configureAddress(false);
    this.viewElementCreator.addInnerElement(shipping);
  }

  private configureAddress(isBillingAddress: boolean = true): ElementCreator {
    let caption = AddressCaptions.BILLING_CAPTION;
    let addressClass = CssClassesAddrView.BILLING_ADDRESS;
    if (!isBillingAddress) {
      caption = AddressCaptions.SHIPPING_CAPTION;
      addressClass = CssClassesAddrView.SHIPPING_ADDRESS;
    }
    const params: ViewParams = {
      tag: 'div',
      classNames: [CssClassesAddrView.USER_ADDRESS_CONTAINER, addressClass],
    };
    const addressContainer = new ElementCreator(params);

    addressContainer.addInnerElement(this.addCaption(caption));

    addressContainer.addInnerElement(this.addIncludeCheckbox(isBillingAddress, isBillingAddress));

    let addressFields = userAddressFields;
    if (!isBillingAddress) {
      addressFields = userAddressFieldsShipping;
    }
    addressFields.forEach((inputParams: ElementConfig) => {
      if (inputParams.tag === 'select') {
        const creatorInput = new SelectField(inputParams);
        addressContainer.addInnerElement(creatorInput);
      } else {
        const creatorInput = new InputField(inputParams);
        addressContainer.addInnerElement(creatorInput);
      }
    });

    addressContainer.addInnerElement(this.addDefaultCheckbox(isBillingAddress));
    addressContainer.addInnerElement(this.addUseAsCheckbox(isBillingAddress));

    return addressContainer;
  }

  private addCaption(caption: string): ElementCreator {
    const params: ElementConfig = {
      tag: 'h2',
      classNames: [CssClassesAddrView.USER_ADDRESS_CAPTION],
      textContent: caption,
    };

    return new ElementCreator(params);
  }

  private addIncludeCheckbox(isBillingAddress: boolean = true, isSelected: boolean = false): ElementCreator {
    const params: CheckboxConfig = {
      className: isBillingAddress ? CssClassesAddrView.BILLING_DEFAULT : CssClassesAddrView.SHIPPING_DEFAULT,
      inputId: isBillingAddress ? checkboxIds.INCLUDE_BILLING : checkboxIds.INCLUDE_SHIPPING,
      labelTextContent: isBillingAddress ? checkboxNames.INCLUDE_BILLING : checkboxNames.INCLUDE_SHIPPING,
      isChecked: isSelected,
      callback: (event: Event) => this.includeAddressHandler(event),
    };

    return this.addCheckbox(params);
  }

  private addDefaultCheckbox(isBillingAddress: boolean = true, isSelected: boolean = false): ElementCreator {
    const params: CheckboxConfig = {
      className: isBillingAddress ? CssClassesAddrView.BILLING_DEFAULT : CssClassesAddrView.SHIPPING_DEFAULT,
      inputId: isBillingAddress ? checkboxIds.BILLING_DEFAULT : checkboxIds.SHIPPING_DEFAULT,
      labelTextContent: isBillingAddress ? checkboxNames.DEFAULT_BILLING : checkboxNames.DEFAULT_SHIPPING,
      isChecked: isSelected,
    };

    return this.addCheckbox(params);
  }

  private addUseAsCheckbox(isBillingAddress: boolean = true, isSelected: boolean = false): ElementCreator {
    const params: CheckboxConfig = {
      className: isBillingAddress ? CssClassesAddrView.BILLING_DEFAULT : CssClassesAddrView.SHIPPING_DEFAULT,
      inputId: isBillingAddress ? checkboxIds.USE_AS_SHIPPING : checkboxIds.USE_AS_BILLING,
      labelTextContent: isBillingAddress ? checkboxNames.USE_SHIPPING : checkboxNames.USE_BILLING,
      isChecked: isSelected,
    };

    return this.addCheckbox(params);
  }

  private addCheckbox(checkboxParams: CheckboxConfig): ElementCreator {
    const params: ViewParams = {
      tag: 'div',
      classNames: [CssClassesAddrView.ADDRESS_CHECKBOX],
    };
    const checkboxContainer = new ElementCreator(params);

    const inputParams: ElementConfig = {
      tag: 'input',
      classNames: [checkboxParams.className],
      attributes: [
        { name: 'type', value: 'checkbox' },
        { name: 'id', value: checkboxParams.inputId },
      ],
      callback: checkboxParams.callback,
    };

    const checkboxInput = new ElementCreator(inputParams).getElement() as HTMLInputElement;
    if (checkboxParams.isChecked) {
      checkboxInput.checked = true;
    }

    checkboxContainer.addInnerElement(checkboxInput);

    const labelParams: ElementConfig = {
      tag: 'label',
      classNames: [CssClassesAddrView.CHECKBOX_LABEL],
      textContent: checkboxParams.labelTextContent,
    };

    checkboxContainer.addInnerElement(new ElementCreator(labelParams));

    return checkboxContainer;
  }

  private includeAddressHandler(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.id === checkboxIds.INCLUDE_BILLING) {
      this.toggleAddress();
    } else {
      this.toggleAddress(false);
    }
  }

  private toggleAddress(isBilling: boolean = true): void {
    let countrySelector = `.${CssClassesAddrView.BILLING_ADDRESS} .${RegInputClasses.REG_COUNTRY} > select`;
    let countryElement = document.querySelector(countrySelector) as HTMLInputElement;
    let postalCodeSelector = `.${CssClassesAddrView.BILLING_ADDRESS} .${RegInputClasses.REG_POSTAL_CODE} > input`;
    let postalCodeElement = document.querySelector(postalCodeSelector) as HTMLInputElement;
    let citySelector = `.${CssClassesAddrView.BILLING_ADDRESS} .${RegInputClasses.REG_CITY} > input`;
    let cityElement = document.querySelector(citySelector) as HTMLInputElement;
    let streetSelector = `.${CssClassesAddrView.BILLING_ADDRESS} .${RegInputClasses.REG_STREET} > input`;
    let streetElement = document.querySelector(streetSelector) as HTMLInputElement;

    if (!isBilling) {
      countrySelector = `.${CssClassesAddrView.SHIPPING_ADDRESS} .${RegInputClasses.REG_COUNTRY_SHIPPING} > select`;
      countryElement = document.querySelector(countrySelector) as HTMLInputElement;
      postalCodeSelector = `.${CssClassesAddrView.SHIPPING_ADDRESS} .${RegInputClasses.REG_POSTAL_CODE_SHIPPING} > input`;
      postalCodeElement = document.querySelector(postalCodeSelector) as HTMLInputElement;
      citySelector = `.${CssClassesAddrView.SHIPPING_ADDRESS} .${RegInputClasses.REG_CITY_SHIPPING} > input`;
      cityElement = document.querySelector(citySelector) as HTMLInputElement;
      streetSelector = `.${CssClassesAddrView.SHIPPING_ADDRESS} .${RegInputClasses.REG_STREET_SHIPPING} > input`;
      streetElement = document.querySelector(streetSelector) as HTMLInputElement;
      Warning.removeWarning(countryElement, RegInputClasses.REG_COUNTRY_SHIPPING);
      Warning.removeWarning(postalCodeElement, RegInputClasses.REG_POSTAL_CODE_SHIPPING);
      Warning.removeWarning(cityElement, RegInputClasses.REG_CITY_SHIPPING);
      Warning.removeWarning(streetElement, RegInputClasses.REG_STREET_SHIPPING);
    } else {
      Warning.removeWarning(countryElement, RegInputClasses.REG_COUNTRY);
      Warning.removeWarning(postalCodeElement, RegInputClasses.REG_POSTAL_CODE);
      Warning.removeWarning(cityElement, RegInputClasses.REG_CITY);
      Warning.removeWarning(streetElement, RegInputClasses.REG_STREET);
    }

    countryElement.toggleAttribute('disabled');
    countryElement.value = '-1';
    postalCodeElement.toggleAttribute('disabled');
    postalCodeElement.value = '';
    cityElement.toggleAttribute('disabled');
    cityElement.value = '';
    streetElement.toggleAttribute('disabled');
    streetElement.value = '';
  }

  setUserBillingValueToString(response: ClientResponse | null): void {
    if (!response || !response.body) {
      return;
    }
    const billingInclude = document.getElementById('billing-include') as HTMLInputElement;
    const selectbilling = document.querySelector('.select-field__container.reg-country >select') as HTMLInputElement;
    const postalCodeInput = document.querySelector('input[name="reg-postal-code"]') as HTMLInputElement;
    const cityInput = document.querySelector('input[name="reg-city"]') as HTMLInputElement;
    const streetInput = document.querySelector('input[name="reg-street"]') as HTMLInputElement;
    const defbillingInclude = document.getElementById('billing-def') as HTMLInputElement;
    const Useshipping = document.getElementById('use-shipping') as HTMLInputElement;

    const BillingAddress = response.body.addresses.find((address: Address) => address.key === 'billing');

    // this.toggleAddress(false);
    billingInclude.checked = true;
    selectbilling.value = BillingAddress.country;
    postalCodeInput.value = BillingAddress.postalCode;
    cityInput.value = BillingAddress.city;
    streetInput.value = BillingAddress.streetName;
    if (response?.body.defaultBillingAddressId) {
      defbillingInclude.checked = true;
    }

    if (response.body.shippingAddressIds.includes(BillingAddress.id)) {
      Useshipping.checked = true;
    }
  }

  setUserShippingValueToString(response: ClientResponse | null): void {
    if (!response || !response.body) {
      return;
    }

    const ShippingInclude = document.getElementById('shipping-include') as HTMLInputElement;
    const selectbilling = document.querySelector('.select-field__container.reg-country-s>select') as HTMLInputElement;
    const postalCodeInput = document.querySelector('input[name="reg-postal-code-s"]') as HTMLInputElement;
    const cityInput = document.querySelector('input[name="reg-city-s"]') as HTMLInputElement;
    const streetInput = document.querySelector('input[name="reg-street-s"]') as HTMLInputElement;
    const defshippingInclude = document.getElementById('shipping-def') as HTMLInputElement;
    const Usebilling = document.getElementById('use-billing') as HTMLInputElement;

    this.toggleAddress(false);
    ShippingInclude.checked = true;

    const shippingAddress = response.body.addresses.find((address: Address) => address.key === 'shipping');

    console.log(shippingAddress);

    selectbilling.value = shippingAddress.country;
    postalCodeInput.value = shippingAddress.postalCode;
    cityInput.value = shippingAddress.city;
    streetInput.value = shippingAddress.streetName;

    if (response?.body.defaultShippingAddressId) {
      defshippingInclude.checked = true;
    }
    if (response.body.billingAddressIds.includes(shippingAddress.id)) {
      Usebilling.checked = true;
    }
  }
}
