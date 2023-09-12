export interface DeveloperInfo {
  name: string;
  info: string;
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
    info: "Michael is a programmer with development experience. He's a coding enthusiast and has a passion for creating elegant solutions to complex problems.",
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
    info: 'Nazar is a diligent developer with a knack for finding solutions to any problem.',
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
    name: 'Andrew',
    info: 'Andrew is a beginning frontend developer',
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
