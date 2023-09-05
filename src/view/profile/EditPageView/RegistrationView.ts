import {
  CustomerDraft,
  BaseAddress,
  createApiBuilderFromCtpClient,
  ClientResponse,
  CustomerUpdateAction,
} from '@commercetools/platform-sdk';
import { RegInputClasses } from '../../../data/registration-fields';
import ElementCreator, { ElementConfig } from '../../../util/ElementCreator';
import View, { ViewParams } from '../../View';
import { FieldValidator } from './validation-fields/FieldValidator';
import './registration-view.css';
import { UserInfoView } from './user-view/UserInfoView';
import { UserAddressView } from './user-view/UserAddressView';

import { BuilderClient } from '../../../api/BuilderClient';

import { TokenCacheStore } from '../../../api/TokenCacheStore';
import { CUSTOMER_UPDATE_ACTIONS } from '../../../data/Actions';
import { MessageView } from '../../message/MessageView';

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
  private tokenCacheStore: TokenCacheStore;

  constructor() {
    const params: ViewParams = {
      tag: 'form',
      classNames: [CssClassesForm.REGISTRATION_CONTAINER],
    };
    super(params);
    this.create();
    this.tokenCacheStore = new TokenCacheStore();
  }

  create(): void {
    this.addCaption(AddressCaptions.COMMON_CAPTION);
    const userInfoView = new UserInfoView().getHtmlElement();
    this.viewElementCreator.addInnerElement(userInfoView);
    const userAddressView = new UserAddressView().getHtmlElement();
    this.viewElementCreator.addInnerElement(userAddressView);
    this.addSubmitBtn();
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
      textContent: 'Confirm Changes',
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

  private async submitBtnHandler(event: Event): Promise<ClientResponse | null> {
    event.preventDefault();
    const fieldChecker = new FieldValidator();

    const isValid = fieldChecker.validateFields();
    if (isValid) {
      const params = this.getCustomerParams();
      console.log(params);
      const projectKey = 'dumians';
      const builderClient: BuilderClient = new BuilderClient(this.tokenCacheStore);
      const ctpClient = builderClient.httpMiddleware();
      const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({ projectKey });
      const id = localStorage.getItem('id');

      if (id !== null) {
        try {
          const customerResponse = await apiRoot.customers().withId({ ID: id }).get().execute();
          const customerUpdate: { version: number; actions: CustomerUpdateAction[] } = {
            version: customerResponse.body.version,
            actions: [],
          };
          this.CustomerDetailActions(customerUpdate, params);
          this.CustomerShippingAdressesActions(customerUpdate, params, customerResponse);
          this.CustomerBillingAdressesActions(customerUpdate, params, customerResponse);
          const response = await apiRoot.customers().withId({ ID: id }).post({ body: customerUpdate }).execute();
          const msgView = new MessageView('Information Changed!');
          msgView.showWindowMsg();
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
    return null;
  }

  CustomerDetailActions(
    customerUpdate: { version: number; actions: CustomerUpdateAction[] },
    params: CustomerDraft
  ): void {
    customerUpdate.actions.push({
      action: CUSTOMER_UPDATE_ACTIONS.SET_FIRST_NAME,
      firstName: params.firstName,
    });

    customerUpdate.actions.push({
      action: CUSTOMER_UPDATE_ACTIONS.SET_LAST_NAME,
      lastName: params.lastName,
    });

    customerUpdate.actions.push({
      action: CUSTOMER_UPDATE_ACTIONS.SET_DATE_OF_BIRTH,
      dateOfBirth: params.dateOfBirth,
    });

    customerUpdate.actions.push({
      action: CUSTOMER_UPDATE_ACTIONS.SET_EMAIL,
      email: params.email,
    });
  }

  CustomerShippingAdressesActions(
    customerUpdate: { version: number; actions: CustomerUpdateAction[] },
    params: CustomerDraft,
    customerResponse: ClientResponse
  ): void {
    const shippingAddress = customerResponse.body.addresses?.find((address: BaseAddress) => address.key === 'shipping');
    const shippingAddressNow = params.addresses?.find((address: BaseAddress) => address.key === 'shipping');
    if (!shippingAddress && shippingAddressNow) {
      customerUpdate.actions.push({
        action: CUSTOMER_UPDATE_ACTIONS.ADD_ADRESS,
        address: {
          key: 'shipping',
          streetName: shippingAddressNow.streetName,
          postalCode: shippingAddressNow.postalCode,
          city: shippingAddressNow.city,
          country: shippingAddressNow.country,
        },
      });
      customerUpdate.actions.push({
        action: CUSTOMER_UPDATE_ACTIONS.ADD_SHIPPING_ADRESS_ID,
        addressKey: 'shipping',
      });
    } else if (shippingAddress && shippingAddressNow) {
      customerUpdate.actions.push({
        action: CUSTOMER_UPDATE_ACTIONS.SET_ADRESS,
        addressId: shippingAddress.id,
        address: {
          key: 'shipping',
          streetName: shippingAddressNow.streetName,
          postalCode: shippingAddressNow.postalCode,
          city: shippingAddressNow.city,
          country: shippingAddressNow.country,
        },
      });
    }
    this.ShippingMoreAddres(customerUpdate, params, customerResponse);
    this.ShippingAddsAddres(customerUpdate, params, customerResponse);
  }

  ShippingAddsAddres(
    customerUpdate: { version: number; actions: CustomerUpdateAction[] },
    params: CustomerDraft,
    customerResponse: ClientResponse
  ): void {
    const shippingAddress = customerResponse.body.addresses?.find((address: BaseAddress) => address.key === 'shipping');
    const shippingAddressNow = params.addresses?.find((address: BaseAddress) => address.key === 'shipping');
    if (shippingAddress && !shippingAddressNow) {
      customerUpdate.actions.push({
        action: CUSTOMER_UPDATE_ACTIONS.REMOVE_ADRESS,
        addressId: shippingAddress.id,
      });
    }
  }

  ShippingMoreAddres(
    customerUpdate: { version: number; actions: CustomerUpdateAction[] },
    params: CustomerDraft,
    customerResponse: ClientResponse
  ): void {
    const shippingAddress = customerResponse.body.addresses?.find((address: BaseAddress) => address.key === 'shipping');
    const includeShippingAdress = document.querySelector(`#shipping-include`) as HTMLInputElement;
    const includeShipping = document.querySelector(`#use-billing`) as HTMLInputElement;
    if (params.defaultShippingAddress === 1 && includeShippingAdress.checked) {
      customerUpdate.actions.push({
        action: CUSTOMER_UPDATE_ACTIONS.SET_SHIPPING_ADRESS_DEFAULT,
        addressKey: 'shipping',
      });
    }
    if (includeShipping.checked) {
      customerUpdate.actions.push({
        action: CUSTOMER_UPDATE_ACTIONS.ADD_BILLING_ADRESS_ID,
        addressKey: 'shipping',
      });
    }
    if (
      (shippingAddress &&
        customerResponse.body.shippingAddressIds?.[0] &&
        customerResponse.body.billingAddressIds?.includes(customerResponse.body.shippingAddressIds[0]) &&
        !includeShipping.checked) ||
      (!includeShipping.checked &&
        shippingAddress &&
        customerResponse.body.shippingAddressIds?.[1] &&
        customerResponse.body.billingAddressIds?.includes(customerResponse.body.shippingAddressIds[1]))
    ) {
      customerUpdate.actions.push({
        action: CUSTOMER_UPDATE_ACTIONS.REMOVE_BILLING_ADRESS_ID,
        addressKey: 'shipping',
      });
    }
  }

  CustomerBillingAdressesActions(
    customerUpdate: { version: number; actions: CustomerUpdateAction[] },
    params: CustomerDraft,
    customerResponse: ClientResponse
  ): void {
    const billingAddress = customerResponse.body.addresses?.find((address: BaseAddress) => address.key === 'billing');
    const billingAddressNow = params.addresses?.find((address: BaseAddress) => address.key === 'billing');
    if (!billingAddress && billingAddressNow) {
      customerUpdate.actions.push({
        action: CUSTOMER_UPDATE_ACTIONS.ADD_ADRESS,
        address: {
          key: 'billing',
          streetName: billingAddressNow.streetName,
          postalCode: billingAddressNow.postalCode,
          city: billingAddressNow.city,
          country: billingAddressNow.country,
        },
      });
      customerUpdate.actions.push({
        action: CUSTOMER_UPDATE_ACTIONS.ADD_BILLING_ADRESS_ID,
        addressKey: 'billing',
      });
    } else if (billingAddress && billingAddressNow) {
      customerUpdate.actions.push({
        action: CUSTOMER_UPDATE_ACTIONS.SET_ADRESS,
        addressId: billingAddress.id,
        address: {
          key: 'billing',
          streetName: billingAddressNow.streetName,
          postalCode: billingAddressNow.postalCode,
          city: billingAddressNow.city,
          country: billingAddressNow.country,
        },
      });
    }
    this.BillingMoreAddres(customerUpdate, params, customerResponse);
    this.BillingAddAddres(customerUpdate, params, customerResponse);
  }

  BillingAddAddres(
    customerUpdate: { version: number; actions: CustomerUpdateAction[] },
    params: CustomerDraft,
    customerResponse: ClientResponse
  ): void {
    const billingAddress = customerResponse.body.addresses?.find((address: BaseAddress) => address.key === 'billing');
    const billingAddressNow = params.addresses?.find((address: BaseAddress) => address.key === 'billing');
    if (billingAddress && !billingAddressNow) {
      customerUpdate.actions.push({
        action: CUSTOMER_UPDATE_ACTIONS.REMOVE_ADRESS,
        addressId: billingAddress.id,
      });
    }
  }

  BillingMoreAddres(
    customerUpdate: { version: number; actions: CustomerUpdateAction[] },
    params: CustomerDraft,
    customerResponse: ClientResponse
  ): void {
    const billingAddress = customerResponse.body.addresses?.find((address: BaseAddress) => address.key === 'billing');
    const includeBillingAdress = document.querySelector(`#billing-include`) as HTMLInputElement;
    if (params.defaultBillingAddress === 0 && includeBillingAdress.checked) {
      customerUpdate.actions.push({
        action: CUSTOMER_UPDATE_ACTIONS.SET_BILLING_ADRESS_DEFAULT,
        addressKey: 'billing',
      });
    }
    const includeBilling = document.querySelector(`#use-shipping`) as HTMLInputElement;
    if (includeBilling.checked) {
      customerUpdate.actions.push({
        action: CUSTOMER_UPDATE_ACTIONS.ADD_SHIPPING_ADRESS_ID,
        addressKey: 'billing',
      });
    }
    if (
      billingAddress &&
      customerResponse.body.billingAddressIds?.[0] &&
      customerResponse.body.shippingAddressIds?.includes(customerResponse.body.billingAddressIds[0]) &&
      !includeBilling.checked
    ) {
      console.log(customerResponse);
      customerUpdate.actions.push({
        action: CUSTOMER_UPDATE_ACTIONS.REMOVE_SHIPPING_ADRESS_ID,
        addressKey: 'billing',
      });
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
      key: 'billing',
      streetName: this.getFieldValue(RegInputClasses.REG_STREET),
      city: this.getFieldValue(RegInputClasses.REG_CITY),
      postalCode: this.getFieldValue(RegInputClasses.REG_POSTAL_CODE),
      country: this.getFieldValue(RegInputClasses.REG_COUNTRY),
    };
  }

  private getShippingAddress(): BaseAddress {
    return {
      key: 'shipping',
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
