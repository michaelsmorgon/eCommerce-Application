export interface ICountryInfo {
  Country: string;
  ISO: string;
  Format: string;
  Regex: string;
}

export const countriesInfo: ICountryInfo[] = [
  {
    Country: 'Belarus',
    ISO: 'BY',
    Format: 'NNNNNN',
    Regex: '^\\d{6}$',
  },
  {
    Country: 'Georgia',
    ISO: 'GE',
    Format: 'NNNN',
    Regex: '^\\d{4}$',
  },
  {
    Country: 'Lithuania',
    ISO: 'LT',
    Format: 'LT-NNNNN',
    Regex: '^[Ll][Tt][- ]{0,1}\\d{5}$',
  },
  {
    Country: 'Poland',
    ISO: 'PL',
    Format: 'NN-NNN',
    Regex: '^\\d{2}-\\d{3}$',
  },
  {
    Country: 'Ukraine',
    ISO: 'UA',
    Format: 'NNNNN',
    Regex: '^\\d{5}$',
  },
  {
    Country: 'United States',
    ISO: 'US',
    Format: 'NNNNN (optionally NNNNN-NNNN)',
    Regex: '^\\b\\d{5}\\b(?:[- ]{1}\\d{4})?$',
  },
];
