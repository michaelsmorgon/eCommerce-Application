const CssClasses = {
  PAGINATOR: 'paginator',
  PAGINATOR_PREV: 'paginator__prev',
  PAGINATOR_CURRENT: 'paginator__current',
  PAGINATOR_NEXT: 'paginator__next',
  PAGINATOR_DISABLED: 'paginator__disabled',
};

export class CatalogPaginatorApp {
  private LIMIT = 6;

  private currentPage: number = 1;

  private totalPages: number = 1;

  constructor(
    private totalProduct: number,
    private offsetProduct: number,
    private changePageNumeration: (offset: number) => void
  ) {
    this.totalPages = Math.ceil(this.totalProduct / this.LIMIT);
    this.currentPage = this.offsetProduct / this.LIMIT + 1;
    console.log('=====', this.totalPages, this.currentPage);
  }

  public create(): void {
    this.fillPageNumeration();
    this.addPaginationHandler();
    this.changeBtn();
  }

  private fillPageNumeration(): void {
    const pages = document.querySelector(`.${CssClasses.PAGINATOR_CURRENT}`) as HTMLDivElement;
    pages.textContent = `${this.currentPage} / ${this.totalPages}`;
  }

  private changeBtn(): void {
    const prevBtn = document.querySelector(`.${CssClasses.PAGINATOR_PREV}`) as HTMLButtonElement;
    const nextBtn = document.querySelector(`.${CssClasses.PAGINATOR_NEXT}`) as HTMLButtonElement;
    if (this.currentPage === 1) {
      prevBtn.classList.add(CssClasses.PAGINATOR_DISABLED);
    } else {
      prevBtn.classList.remove(CssClasses.PAGINATOR_DISABLED);
    }
    if (this.currentPage === this.totalPages) {
      nextBtn.classList.add(CssClasses.PAGINATOR_DISABLED);
    } else {
      nextBtn.classList.remove(CssClasses.PAGINATOR_DISABLED);
    }
  }

  private addPaginationHandler(): void {
    const paginator = document.querySelector(`.${CssClasses.PAGINATOR}`) as HTMLButtonElement;
    paginator.addEventListener('click', this.paginatorHandler);
  }

  private paginatorHandler = ((event: Event): void => {
    const target = event.target as HTMLDivElement;
    const pages = document.querySelector(`.${CssClasses.PAGINATOR_CURRENT}`) as HTMLDivElement;
    const res = pages?.textContent?.split('/');
    if (res?.length && res?.length > 0) {
      console.log('++++', this.currentPage, this.totalPages);
      if (target.classList.contains(CssClasses.PAGINATOR_NEXT) && +res[0] < this.totalPages) {
        this.changePageNumeration(+res[0] * this.LIMIT);
      }
      if (target.classList.contains(CssClasses.PAGINATOR_PREV) && +res[0] > 1) {
        this.changePageNumeration((+res[0] - 2) * this.LIMIT);
      }
    }
  }) as EventListener;

  public setPageNumeration(): void {
    this.fillPageNumeration();
    this.changeBtn();
  }
}
