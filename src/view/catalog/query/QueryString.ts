export const QueryStringNames = {
  PRICE_FROM: 'price_from',
  PRICE_TO: 'price_to',
  SIZE: 'size',
  COLOR: 'color',
  MATERIAL: 'material',
};

export class QueryString {
  private queryList: string[] = [];

  private priceFrom: string | null = null;

  private priceTo: string | null = null;

  private size: string[] = [];

  private colors: string[] = [];

  private material: string[] = [];

  constructor(private str: string) {
    this.parseString();
  }

  private parseString(): void {
    this.str.split('&').forEach((res) => {
      const strParsed = res.split('=');
      switch (strParsed[0]) {
        case QueryStringNames.PRICE_FROM:
          this.priceFrom = strParsed[1] ? strParsed[1] : null;
          break;
        case QueryStringNames.PRICE_TO:
          this.priceTo = strParsed[1] ? strParsed[1] : null;
          break;
        case QueryStringNames.SIZE:
          this.size = strParsed[1] ? strParsed[1].split(';') : [];
          break;
        case QueryStringNames.COLOR:
          this.colors = strParsed[1] ? strParsed[1].split(';') : [];
          break;
        case QueryStringNames.MATERIAL:
          this.material = strParsed[1] ? strParsed[1].split(';') : [];
          break;
        default:
          break;
      }
    });
  }

  public getPriceFrom(): string | null {
    return this.priceFrom;
  }

  public getPriceTo(): string | null {
    return this.priceTo;
  }

  public getSize(): string[] {
    return this.size;
  }

  public getColor(): string[] {
    return this.colors;
  }

  public getMaterial(): string[] {
    return this.material;
  }

  public getSearchList(): string[] {
    if (this.priceFrom !== null && this.priceTo !== null) {
      this.queryList.push(`variants.price.centAmount:range ("${+this.priceFrom * 100}" to "${+this.priceTo * 100}")`);
    } else if (this.priceFrom !== null) {
      this.queryList.push(`variants.price.centAmount:range ("${+this.priceFrom * 100}" to *)`);
    } else if (this.priceTo !== null) {
      this.queryList.push(`variants.price.centAmount:range (* to "${+this.priceTo * 100}")`);
    }

    const colorsQuery: string[] = [];
    this.colors.forEach((color) => {
      colorsQuery.push(`"${color}"`);
    });
    if (colorsQuery.length > 0) {
      this.queryList.push(`variants.attributes.color.key:${colorsQuery.join(',')}`);
    }

    const sizesQuery: string[] = [];
    this.size.forEach((size) => {
      sizesQuery.push(`"${size}"`);
    });
    if (sizesQuery.length > 0) {
      this.queryList.push(`variants.attributes.size.key:${sizesQuery.join(',')}`);
    }

    const materialQuery: string[] = [];
    this.material.forEach((material) => {
      materialQuery.push(`"${material}"`);
    });
    if (materialQuery.length > 0) {
      this.queryList.push(`variants.attributes.material.key:${materialQuery.join(',')}`);
    }

    return this.queryList;
  }
}