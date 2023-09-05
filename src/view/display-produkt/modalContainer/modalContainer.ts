export default class Modal {
  modalContainer: HTMLDivElement;

  closeButton: HTMLDivElement;

  slider: HTMLDivElement;

  prevButton: HTMLDivElement;

  nextButton: HTMLDivElement;

  slides: HTMLElement[] = [];

  slidesCopy: HTMLElement[] = [];

  img: HTMLElement;

  private currentImageIndex: number = 0;

  constructor(img: HTMLElement) {
    this.img = img;
    this.slides = Array.from(document.querySelectorAll('.product-img'));
    this.currentImageIndex = this.slides.indexOf(this.img);
    this.modalContainer = this.createModalContainer();
    this.closeButton = this.createCloseButton();
    this.slider = this.createSlider();
    this.prevButton = this.createPrevButton();
    this.nextButton = this.createNextButton();
    this.init();

    this.modalContainer.addEventListener('click', (event) => {
      const isSliderClick = this.slider.contains(event.target as Node);
      const isPrevButtonClick = event.target === this.prevButton;
      const isNextButtonClick = event.target === this.nextButton;

      if (!isSliderClick && !isPrevButtonClick && !isNextButtonClick) {
        this.closeModal();
      }
    });

    this.slidesCopy[this.currentImageIndex].classList.add('active');
  }

  private createModalContainer(): HTMLDivElement {
    const modalContainer = document.createElement('div');
    modalContainer.classList.add('modal-container');
    document.body.appendChild(modalContainer);
    return modalContainer;
  }

  private createCloseButton(): HTMLDivElement {
    const closeButton = document.createElement('div');
    closeButton.classList.add('close-button');
    closeButton.innerHTML = 'CLOSE';
    this.modalContainer.appendChild(closeButton);
    return closeButton;
  }

  private createSlider(): HTMLDivElement {
    const slider = document.createElement('div');
    slider.classList.add('modal-slider');
    this.slides.forEach((slide) => {
      const slideCopy = slide.cloneNode(true) as HTMLElement;
      slider.appendChild(slideCopy);
      this.slidesCopy.push(slideCopy);
    });

    this.modalContainer.appendChild(slider);
    return slider;
  }

  private createPrevButton(): HTMLDivElement {
    const prevButton = document.createElement('div');
    prevButton.classList.add('prev-button');
    prevButton.addEventListener('click', () => {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.slidesCopy.length) % this.slidesCopy.length;
      this.updateSlider();
    });
    this.modalContainer.appendChild(prevButton);
    return prevButton;
  }

  private createNextButton(): HTMLDivElement {
    const nextButton = document.createElement('div');
    nextButton.classList.add('next-button');
    nextButton.addEventListener('click', () => {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.slidesCopy.length;
      this.updateSlider();
    });
    this.modalContainer.appendChild(nextButton);
    return nextButton;
  }

  private removeModalFromDOM(): void {
    if (this.modalContainer.parentElement) {
      this.modalContainer.parentElement.removeChild(this.modalContainer);
    }
  }

  private closeModal(): void {
    this.removeModalFromDOM();
  }

  private updateSlider(): void {
    const { currentImageIndex } = this;

    this.slidesCopy.forEach((element: HTMLElement, index) => {
      const shouldDisplay = index === currentImageIndex;
      // Добавляем/удаляем класс 'active' для анимации
      if (shouldDisplay) {
        element.classList.add('active');
      } else {
        element.classList.remove('active');
      }
    });
  }

  public init(): void {
    this.closeButton.addEventListener('click', () => {
      document.body.style.overflow = 'auto';
      this.closeModal();
    });
  }
}
