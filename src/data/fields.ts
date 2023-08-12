import { ElementConfig } from '../util/ElementCreator';

export const fields: ElementConfig[] = [
  {
    tag: 'input',
    classNames: ['reg-email'],
    textContent: 'Email: ',
    placeholderText: 'example@email.com',
    attributes: [
      { name: 'type', value: 'email' },
      { name: 'size', value: '30' },
      { name: 'pattern', value: '/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g' },
      { name: 'required', value: '' },
    ],
  },
  {
    tag: 'input',
    classNames: ['reg-pass'],
    textContent: 'Password: ',
    attributes: [
      { name: 'type', value: 'password' },
      { name: 'required', value: '' },
    ],
  },
  {
    tag: 'input',
    classNames: ['confirm-reg-pass'],
    textContent: 'Password: ',
    attributes: [
      { name: 'type', value: 'password' },
      { name: 'required', value: '' },
    ],
  },
  {
    tag: 'input',
    classNames: [],
    textContent: 'First name: ',
  },
  {
    tag: 'input',
    classNames: [],
    textContent: 'Last name: ',
  },
  {
    tag: 'input',
    classNames: [],
    textContent: 'Date of birth: ',
    attributes: [
      { name: 'type', value: 'date' },
      { name: 'min', value: '1900-01-01' },
      { name: 'max', value: '2023-08-12' },
    ],
  },
  {
    tag: 'input',
    classNames: [],
    textContent: 'Street: ',
  },
  {
    tag: 'input',
    classNames: [],
    textContent: 'City: ',
  },
  {
    tag: 'input',
    classNames: [],
    textContent: 'Postal code: ',
  },
  {
    tag: 'input',
    classNames: [],
    textContent: 'Country: ',
  },
];
