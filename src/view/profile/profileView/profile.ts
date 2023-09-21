import { ClientResponse, createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import ElementCreator from '../../../util/ElementCreator';
import './profile.css';

import { BuilderClient } from '../../../api/BuilderClient';

import { TokenCacheStore } from '../../../api/TokenCacheStore';
import { route } from '../../../router/router';
import { LocaleStorage } from '../../../api/LocaleStorage';

export interface Address {
  key: string;
  id?: string;
  streetName: string;
  postalCode: string;
  city: string;
  country: string;
}

export default class ProfileView extends ElementCreator {
  private tokenCacheStore: TokenCacheStore;

  constructor(tokenCacheStore: TokenCacheStore) {
    const params = {
      tag: 'section',
      classNames: ['main-profile-view'],
    };
    super(params);
    this.tokenCacheStore = tokenCacheStore;
    this.callMethods();
  }

  async callMethods(): Promise<void> {
    const response = await this.checkCustomerExists();
    if (response !== null) {
      this.configureView(response);

      response.body.addresses.forEach((address: Address) => {
        if (address.key === 'shipping') {
          this.shippingAddressView(response);
        }
      });

      response.body.addresses.forEach((address: Address) => {
        if (address.key === 'billing') {
          this.billingView(response);
        }
      });

      this.editButton();
      this.passwordButton();
    }
  }

  async checkCustomerExists(): Promise<ClientResponse | null> {
    const projectKey = 'dumians';
    const builderClient: BuilderClient = new BuilderClient(this.tokenCacheStore);
    const ctpClient = builderClient.httpMiddleware();
    const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({ projectKey });
    const id = localStorage.getItem(LocaleStorage.CUSTOMER_ID);

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

  configureView(response: ClientResponse): void {
    const userContent = {
      tag: 'div',
      classNames: ['user-content'],
    };
    const Userdiv = new ElementCreator(userContent);
    this.addInnerElement(Userdiv);
    const userName = {
      tag: 'div',
      classNames: ['user-information-content'],
    };
    const UserNamecontent = new ElementCreator(userName);
    Userdiv.addInnerElement(UserNamecontent);

    const UserFirstName = {
      tag: 'div',
      classNames: ['user-UserFirstName-content'],
      textContent: `First name: ${response.body.firstName}`,
    };
    const UserNameFirst = new ElementCreator(UserFirstName);
    UserNamecontent.addInnerElement(UserNameFirst);

    const UserLastName = {
      tag: 'div',
      classNames: ['user-UserLastName-content'],
      textContent: `Last name: ${response.body.lastName}`,
    };
    const UserNameLast = new ElementCreator(UserLastName);
    UserNamecontent.addInnerElement(UserNameLast);

    const UserDate = {
      tag: 'div',
      classNames: ['user-UserDate-content'],
      textContent: `Date of Birth: ${response.body.dateOfBirth}`,
    };
    const UserBirth = new ElementCreator(UserDate);
    UserNamecontent.addInnerElement(UserBirth);
  }

  shippingAddressView(response: ClientResponse): void {
    const userContent = this.createUserContent('Shipping address');
    const UserNamecontent = this.createUserInformationContent(userContent);

    this.createDefaultAddressElement(UserNamecontent, response.body.defaultShippingAddressId, 'shipping');
    this.createUseAsAddressElement(UserNamecontent, response.body.shippingAddressIds, 'billing');

    const shippingAddress = response.body.addresses.find((address: Address) => address.key === 'shipping');
    if (shippingAddress) {
      this.createAddressInfoElement(UserNamecontent, shippingAddress);
    }

    this.addInnerElement(userContent);
  }

  private createAddressInfoElement(parent: ElementCreator, shippingAddress: Address): void {
    const userUsedAsBillingInner = new ElementCreator({ tag: 'div', classNames: ['user-UsedAsBilling'] });
    const addressInfo = [
      `Street: ${shippingAddress.streetName}`,
      `Postal Code: ${shippingAddress.postalCode}`,
      `City: ${shippingAddress.city}`,
      `Country: ${shippingAddress.country}`,
    ];
    addressInfo.forEach((info) => {
      const infoDiv = document.createElement('div');
      infoDiv.textContent = info;
      userUsedAsBillingInner.addInnerElement(infoDiv);
    });
    parent.addInnerElement(userUsedAsBillingInner);
  }

  billingView(response: ClientResponse): void {
    const userContent = this.createUserContent('Billing address');
    const UserNamecontent = this.createUserInformationContent(userContent);

    this.createDefaultAddressElement(UserNamecontent, response.body.defaultBillingAddressId, 'billing');
    this.createUseAsAddressElement(UserNamecontent, response.body.billingAddressIds, 'shipping');

    this.createMatchingAddressElement(UserNamecontent, response.body.addresses, 'billing');

    this.addInnerElement(userContent);
  }

  private createUserContent(title: string): ElementCreator {
    return new ElementCreator({
      tag: 'div',
      classNames: ['user-content'],
      textContent: title,
    });
  }

  private createUserInformationContent(parent: ElementCreator): ElementCreator {
    const userNameContent = new ElementCreator({ tag: 'div', classNames: ['user-information-content'] });
    parent.addInnerElement(userNameContent);
    return userNameContent;
  }

  private createDefaultAddressElement(parent: ElementCreator, defaultAddressId: string, addressType: string): void {
    const isDefaultAddress = defaultAddressId ? 'YES' : 'NO';
    parent.addInnerElement(
      new ElementCreator({
        tag: 'div',
        classNames: ['user-defoultshipping'],
        textContent: `Set as default ${addressType} address: ${isDefaultAddress}`,
      })
    );
  }

  private createUseAsAddressElement(parent: ElementCreator, addressIds: string[], addressType: string): void {
    const firstAddressId = addressIds[0];
    const isUsedAsBilling = addressType === 'billing' && addressIds.includes(firstAddressId);
    parent.addInnerElement(
      new ElementCreator({
        tag: 'div',
        classNames: ['user-UsedAsBilling'],
        textContent: `Use as ${addressType} address: ${isUsedAsBilling ? 'YES' : 'NO'}`,
      })
    );
  }

  private createMatchingAddressElement(parent: ElementCreator, addresses: Address[], addressType: string): void {
    const matchingAddress = addresses.find((address: Address) => address.key === addressType);
    if (matchingAddress) {
      const userUsedAsBillingBilling = new ElementCreator({ tag: 'div', classNames: ['user-UsedAsBilling'] });
      const addressInfo = [
        `Street: ${matchingAddress.streetName}`,
        `Postal Code: ${matchingAddress.postalCode}`,
        `City: ${matchingAddress.city}`,
        `Country: ${matchingAddress.country}`,
      ];
      addressInfo.forEach((info) => {
        const infoDiv = document.createElement('div');
        infoDiv.textContent = info;
        userUsedAsBillingBilling.addInnerElement(infoDiv);
      });
      parent.addInnerElement(userUsedAsBillingBilling);
    }
  }

  editButton(): void {
    const userEditButtonContainer = {
      tag: 'div',
      classNames: ['user-userEdiuserEditButtonContainertButton'],
    };
    const UserButtonContainer = new ElementCreator(userEditButtonContainer);
    this.addInnerElement(UserButtonContainer);
    const userEditButton = {
      tag: 'button',
      classNames: ['user-userEditButton'],
      textContent: 'Edit mode',
      attributes: [{ name: 'href', value: '/EditPage' }],
      callback: (event: Event): void => {
        const mouseEvent = event as MouseEvent;
        route(mouseEvent);
      },
    };
    const UserButton = new ElementCreator(userEditButton);
    UserButtonContainer.addInnerElement(UserButton);
  }

  passwordButton(): void {
    const userEditButtonContainer = {
      tag: 'div',
      classNames: ['user-userEdiuserEditButtonContainertButton'],
    };
    const UserButtonContainer = new ElementCreator(userEditButtonContainer);
    this.addInnerElement(UserButtonContainer);
    const userEditButton = {
      tag: 'button',
      classNames: ['user-userEditButton'],
      textContent: 'Change Password',
      attributes: [{ name: 'href', value: '/ChangePassword' }],
      callback: (event: Event): void => {
        const mouseEvent = event as MouseEvent;
        route(mouseEvent);
      },
    };
    const UserButton = new ElementCreator(userEditButton);
    UserButtonContainer.addInnerElement(UserButton);
  }
}
