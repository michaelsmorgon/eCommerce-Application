interface BenefitData {
  icon: string;
  text: string;
}

export const benefitsData: BenefitData[] = [
  {
    icon: 'benefit__icon1',
    text: '99% of our customers recommend us',
  },
  {
    icon: 'benefit__icon2',
    text: 'Only genuine products',
  },
  {
    icon: 'benefit__icon3',
    text: '30 days for returns',
  },
  {
    icon: 'benefit__icon4',
    text: 'Free shipping',
  },
];

export const paymentMethods = ['payu', 'visa', 'master-card'];
export const shippingMethods = ['fedex', 'dhl', 'gls'];
