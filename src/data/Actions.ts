export const CUSTOMER_UPDATE_ACTIONS = {
  SET_FIRST_NAME: 'setFirstName' as const,
  SET_LAST_NAME: 'setLastName' as const,
  SET_EMAIL: 'changeEmail' as const,
  SET_DATE_OF_BIRTH: 'setDateOfBirth' as const,
  SET_ADRESS: 'changeAddress' as const,
  ADD_ADRESS: 'addAddress' as const,
  REMOVE_ADRESS: 'removeAddress' as const,

  REMOVE_SHIPPING_ADRESS_ID: 'removeShippingAddressId' as const,
  REMOVE_BILLING_ADRESS_ID: 'removeBillingAddressId' as const,

  ADD_SHIPPING_ADRESS_ID: 'addShippingAddressId' as const,
  ADD_BILLING_ADRESS_ID: 'addBillingAddressId' as const,

  SET_BILLING_ADRESS_DEFAULT: 'setDefaultBillingAddress' as const,
  SET_SHIPPING_ADRESS_DEFAULT: 'setDefaultShippingAddress' as const,
};
