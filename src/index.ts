import { App } from './router/app';
import './style.css';
import Products from './view/product-information/display-produkt';

const app: App = new App();
app.init();
// eslint-disable-next-line no-new
new Products(); // дадау часова
