export interface DeveloperInfo {
  name: string;
  info: string[];
  gitHub: string;
  foto: string;
  contributions: string[];
}

interface Developers {
  developer1: DeveloperInfo;
  developer2: DeveloperInfo;
  developer3: DeveloperInfo;
}

export const developersData: Developers = {
  developer1: {
    name: 'Michael',
    info: [
      "Michael is a programmer with development experience. He's a coding enthusiast and has a passion for creating elegant solutions to complex problems.",
      'Location: Białystok, Poland',
      'University: BSUIR',
      'Work Experience:',
      '* sys. administrator 1 year',
      '* XSLT-developer 1 year',
      '* php-developer 7 year',
      'Languages:',
      '* Belarusian: native',
      '* English: pre-intermediate/intermediate',
      '* Polish: A1',
    ],
    gitHub: 'https://github.com/michaelsmorgon',
    foto: 'assets/images/michael.jpg',
    contributions: [
      'Repository Setup',
      'CommerceTools Project and API Client Setup',
      'Registration Page Implementation',
      'Catalog Page Implementation',
      'Catalog Page Enhancements',
      'Routing Implementation',
    ],
  },
  developer2: {
    name: 'Nazar',
    info: ['Nazar is a diligent developer with a knack for finding solutions to any problem.', '', '', '', ''],
    gitHub: 'https://github.com/dumik121',
    foto: 'assets/images/nazar.jpg',
    contributions: [
      'Development Environment Configuration',
      'Development Scripts',
      'Login Page Implementation',
      'Routing Implementation',
      'User Profile Page Implementation',
      'Basket Page Implementation',
    ],
  },
  developer3: {
    name: 'Andrew Ar',
    info: [
      'Andrew currently works as a tiler in interior finishing, but aspires to become a Front-End Developer.',
      'Location: Warsaw, Poland',
      'University: Grodno State Agrarian University 2005-2010',
      'Work Experience:',
      '* 2010-2012: Chief agronomist.',
      '* 2013-2018: Sales Representative in the FMCG industry.',
      '* 2018 - present: Interior Finishing Worker.',
      'Languages:',
      '* Belarusian: native',
      '* Polish: B2',
    ],
    gitHub: 'https://github.com/AndreWAr85',
    foto: 'assets/images/andrew.jpg',
    contributions: [
      'Task Board Setup',
      'Comprehensive README',
      'Main Page Enhancements',
      'Detailed Product Page Implementation',
      'About Us Page Implementation',
    ],
  },
};
