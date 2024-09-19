export default class StepSlider {
  constructor({ steps, value = 0 }) {
    this.steps = steps;
    this.value = value;

    this.elem = this.createSlider();
    this.updateSlider();

    this.addClickHandler();
    this.addDragHandler();
  }

  createSlider() {
    const slider = document.createElement('div');
    slider.classList.add('slider');

    const thumb = document.createElement('div');
    thumb.classList.add('slider__thumb');

    const valueDisplay = document.createElement('span');
    valueDisplay.classList.add('slider__value');
    thumb.append(valueDisplay);

    const progress = document.createElement('div');
    progress.classList.add('slider__progress');

    const stepsContainer = document.createElement('div');
    stepsContainer.classList.add('slider__steps');

    for (let i = 0; i < this.steps; i++) {
      const step = document.createElement('span');
      stepsContainer.append(step);
    }

    slider.append(thumb);
    slider.append(progress);
    slider.append(stepsContainer);

    return slider;
  }

  updateSlider(accurate) {
    const valueDisplay = this.elem.querySelector('.slider__value');
    const progress = this.elem.querySelector('.slider__progress');
    const steps = this.elem.querySelectorAll('.slider__steps span');
    const thumb = this.elem.querySelector('.slider__thumb');

    valueDisplay.textContent = this.value;

    const percentage = (this.value / (this.steps - 1)) * 100;
    thumb.style.left = `${percentage - accurate}%`;
    progress.style.width = `${percentage - accurate}%`;

    steps.forEach((step, index) => {
      step.classList.toggle('slider__step-active', index === this.value);
    });
  }

  addClickHandler() {
    this.elem.addEventListener('click', (event) => {
      const rect = this.elem.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const totalWidth = rect.width;
      const stepWidth = totalWidth / (this.steps - 1);

      const newValue = Math.round(offsetX / stepWidth);
      this.value = Math.max(0, Math.min(newValue, this.steps - 1));

      const accurate = 0;
      this.updateSlider(accurate);

      const eventChange = new CustomEvent('slider-change', {
        detail: this.value,
        bubbles: true,
      });
      this.elem.dispatchEvent(eventChange);
    });
  }

  addDragHandler() {
    const thumb = this.elem.querySelector('.slider__thumb');

    thumb.ondragstart = () => false;

    thumb.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      this.elem.classList.add('slider_dragging');

      const onPointerMove = (moveEvent) => {
        const rect = this.elem.getBoundingClientRect();
        const offsetX = moveEvent.clientX - rect.left;
        const totalWidth = rect.width;
        const stepWidth = totalWidth / (this.steps - 1);

        const newValue = Math.round(offsetX / stepWidth);
        this.value = Math.max(0, Math.min(newValue, this.steps - 1));

        const accurate = 20;
        this.updateSlider(accurate);
      };

      const onPointerUp = () => {
        this.elem.classList.remove('slider_dragging');
        document.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('pointerup', onPointerUp);

        const eventChange = new CustomEvent('slider-change', {
          detail: this.value,
          bubbles: true,
        });
        this.elem.dispatchEvent(eventChange);
      };
      document.addEventListener('pointermove', onPointerMove);
      document.addEventListener('pointerup', onPointerUp);
    });
  }
}
