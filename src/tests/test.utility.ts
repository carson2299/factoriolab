import { ComponentFixture } from '@angular/core/testing';

/* Don't care about coverage on test tools */
/* istanbul ignore next */
export class TestUtility {
  static getSelector<T>(
    fixture: ComponentFixture<T>,
    selector: string,
    index = 0,
  ): HTMLElement {
    return (fixture.nativeElement as HTMLElement).querySelectorAll(selector)[
      index
    ] as HTMLElement;
  }

  static clickSelector<T>(
    fixture: ComponentFixture<T>,
    selector: string,
    index = 0,
  ): void {
    return this.getSelector(fixture, selector, index).click();
  }

  static altClickSelector<T>(
    fixture: ComponentFixture<T>,
    selector: string,
    index = 0,
    preventDefault = false,
  ): void {
    return this.altClick(
      this.getSelector(fixture, selector, index),
      preventDefault,
    );
  }

  static setTextSelector<T>(
    fixture: ComponentFixture<T>,
    selector: string,
    value: string,
    index = 0,
  ): void {
    return this.setText(this.getSelector(fixture, selector, index), value);
  }
  static selectSelector<T>(
    fixture: ComponentFixture<T>,
    selector: string,
    value: string,
    index = 0,
  ): void {
    return this.select(this.getSelector(fixture, selector, index), value);
  }

  static keyPressSelector<T>(
    fixture: ComponentFixture<T>,
    selector: string,
    value: string,
    index = 0,
  ): void {
    return this.keyPress(this.getSelector(fixture, selector, index), value);
  }

  static altClick(element: HTMLElement, preventDefault = false): void {
    const event = new MouseEvent('click', { cancelable: true });
    if (preventDefault) {
      event.preventDefault();
    }
    element.dispatchEvent(event);
  }

  static dispatch(element: HTMLElement, event: string): void {
    element.dispatchEvent(new Event(event));
  }

  static setText(element: HTMLElement, value: string): void {
    (element as HTMLInputElement).value = value;
    element.dispatchEvent(new Event('input'));
  }

  static select(element: HTMLElement, value: string): void {
    (element as HTMLSelectElement).value = value;
    element.dispatchEvent(new Event('change'));
  }

  static keyPress(element: HTMLElement, value: string): void {
    element.dispatchEvent(new KeyboardEvent('keypress', { key: value }));
  }

  static mouseEvent(
    type: string,
    element: HTMLElement,
    clientX: number,
    clientY: number,
  ): void {
    const event = new MouseEvent(type, {
      view: window,
      clientX,
      clientY,
    });
    element.dispatchEvent(event);
  }

  static wheelEvent(type: string, element: HTMLElement, deltaY: number): void {
    const event = new WheelEvent(type, {
      view: window,
      deltaY,
    });
    element.dispatchEvent(event);
  }

  static dragAndDropSelector<T>(
    fixture: ComponentFixture<T>,
    selector: string,
    xOffset: number,
    yOffset: number,
  ): void {
    const element = this.getSelector(fixture, selector);

    const pos = element.getBoundingClientRect();
    const centerX = Math.floor((pos.left + pos.right) / 2);
    const centerY = Math.floor((pos.top + pos.bottom) / 2);

    this.mouseEvent('mousedown', element, centerX, centerY);
    this.mouseEvent('mousemove', element, centerX + xOffset, centerY + yOffset);
    this.mouseEvent('mouseup', element, centerX + xOffset, centerY + yOffset);
  }

  static zoomSelector<T>(
    fixture: ComponentFixture<T>,
    selector: string,
    deltaY: number,
  ): void {
    const element = this.getSelector(fixture, selector);
    this.wheelEvent('wheel', element, deltaY);
  }

  static assert(condition: boolean, msg?: string): asserts condition {
    if (!condition) {
      throw new Error(msg || 'Assertion error, condition is false.');
    }
  }

  static setInputs<T>(
    fixture: ComponentFixture<T>,
    values: Partial<Record<string & keyof T, unknown>>,
  ): void {
    for (const key of Object.keys(values) as (keyof T & string)[])
      fixture.componentRef.setInput(key, values[key]);

    fixture.detectChanges();
  }
}
