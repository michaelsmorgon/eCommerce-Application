import { ElementConfig } from '../util/ElementCreator';

export enum RegInputClasses {
  REG_EMAIL = 'reg-email',
  REG_PASS = 'reg-pass',
  REG_CONFIRM_PASS = 'reg-confirm-pass',
  REG_FIRST_NAME = 'reg-first-name',
  REG_LAST_NAME = 'reg-last-name',
  REG_DATE_OF_BIRTH = 'reg-dob',
  REG_COUNTRY = 'reg-country',
  REG_POSTAL_CODE = 'reg-postal-code',
  REG_CITY = 'reg-city',
  REG_STREET = 'reg-street',
  REG_COUNTRY_SHIPPING = 'reg-country-s',
  REG_POSTAL_CODE_SHIPPING = 'reg-postal-code-s',
  REG_CITY_SHIPPING = 'reg-city-s',
  REG_STREET_SHIPPING = 'reg-street-s',
  REG_INPUT = 'reg-input',
}

export const userInfoFields: ElementConfig[] = [
  {
    tag: 'input',
    classNames: [RegInputClasses.REG_FIRST_NAME],
    textContent: 'First name: ',
    attributes: [
      { name: 'pattern', value: '^([a-zA-Z]){1,}$' },
      { name: 'name', value: RegInputClasses.REG_FIRST_NAME },
    ],
  },
  {
    tag: 'input',
    classNames: [RegInputClasses.REG_LAST_NAME],
    textContent: 'Last name: ',
    attributes: [
      { name: 'pattern', value: '^([a-zA-Z]){1,}$' },
      { name: 'name', value: RegInputClasses.REG_LAST_NAME },
    ],
  },
  {
    tag: 'input',
    classNames: [RegInputClasses.REG_DATE_OF_BIRTH],
    textContent: 'Date of birth: ',
    attributes: [
      { name: 'type', value: 'date' },
      { name: 'min', value: '1900-01-01' },
      { name: 'name', value: RegInputClasses.REG_DATE_OF_BIRTH },
    ],
  },
  {
    tag: 'input',
    classNames: [RegInputClasses.REG_EMAIL],
    textContent: 'Email: ',
    placeholderText: 'example@email.com',
    attributes: [
      { name: 'type', value: 'email' },
      { name: 'pattern', value: "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$" },
      { name: 'name', value: RegInputClasses.REG_EMAIL },
      { name: 'class', value: RegInputClasses.REG_INPUT },
    ],
  },
  {
    tag: 'input',
    classNames: [RegInputClasses.REG_PASS],
    textContent: 'Password: ',
    attributes: [
      { name: 'type', value: 'password' },
      { name: 'pattern', value: '(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}' },
      { name: 'name', value: RegInputClasses.REG_PASS },
      { name: 'class', value: RegInputClasses.REG_INPUT },
    ],
  },
  {
    tag: 'input',
    classNames: [RegInputClasses.REG_CONFIRM_PASS],
    textContent: 'Confirm password: ',
    attributes: [
      { name: 'type', value: 'password' },
      { name: 'name', value: RegInputClasses.REG_CONFIRM_PASS },
    ],
  },
];

export const userAddressFields: ElementConfig[] = [
  {
    tag: 'select',
    classNames: [RegInputClasses.REG_COUNTRY],
    textContent: 'Country: ',
    attributes: [{ name: 'name', value: RegInputClasses.REG_COUNTRY }],
  },
  {
    tag: 'input',
    classNames: [RegInputClasses.REG_POSTAL_CODE],
    textContent: 'Postal code: ',
    attributes: [{ name: 'name', value: RegInputClasses.REG_POSTAL_CODE }],
  },
  {
    tag: 'input',
    classNames: [RegInputClasses.REG_CITY],
    textContent: 'City: ',
    attributes: [{ name: 'name', value: RegInputClasses.REG_CITY }],
  },
  {
    tag: 'input',
    classNames: [RegInputClasses.REG_STREET],
    textContent: 'Street: ',
    attributes: [{ name: 'name', value: RegInputClasses.REG_STREET }],
  },
];

export const userAddressFieldsShipping: ElementConfig[] = [
  {
    tag: 'select',
    classNames: [RegInputClasses.REG_COUNTRY_SHIPPING],
    textContent: 'Country: ',
    attributes: [
      { name: 'name', value: RegInputClasses.REG_COUNTRY_SHIPPING },
      { name: 'disabled', value: '' },
    ],
  },
  {
    tag: 'input',
    classNames: [RegInputClasses.REG_POSTAL_CODE_SHIPPING],
    textContent: 'Postal code: ',
    attributes: [
      { name: 'name', value: RegInputClasses.REG_POSTAL_CODE_SHIPPING },
      { name: 'disabled', value: '' },
    ],
  },
  {
    tag: 'input',
    classNames: [RegInputClasses.REG_CITY_SHIPPING],
    textContent: 'City: ',
    attributes: [
      { name: 'name', value: RegInputClasses.REG_CITY_SHIPPING },
      { name: 'disabled', value: '' },
    ],
  },
  {
    tag: 'input',
    classNames: [RegInputClasses.REG_STREET_SHIPPING],
    textContent: 'Street: ',
    attributes: [
      { name: 'name', value: RegInputClasses.REG_STREET_SHIPPING },
      { name: 'disabled', value: '' },
    ],
  },
];
