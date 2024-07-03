import { q } from '../../lib';

export const simulateType = (inputElement: HTMLInputElement, text: string) => {
  inputElement.focus();
  inputElement.value = text;
  ['keydown', 'keyup'].forEach((eventType) => {
    const keyboardEvent = new KeyboardEvent(eventType, { key: text });
    inputElement.dispatchEvent(keyboardEvent);
  });
  const changeEvent = new Event('change', { bubbles: true });
  inputElement.dispatchEvent(changeEvent);
  inputElement.blur();
};

export const simulateClick = (buttonElement: HTMLButtonElement) => {
  buttonElement.dispatchEvent(new MouseEvent('click', { bubbles: true }));
};

export const simulateSelect = (selector: string, value: string) => {
  const selectControl = q<HTMLElement>(
    selector
  )?.querySelector<HTMLInputElement>('.react-select__control input');

  if (!selectControl) {
    console.error('Select control not found');
    return;
  }

  selectControl.focus();
  selectControl.value = value;

  const inputEvent = new Event('input', { bubbles: true });
  selectControl.dispatchEvent(inputEvent);

  const keydownEvent = new KeyboardEvent('keydown', {
    bubbles: true,
    keyCode: 13, // Enter key
  });
  selectControl.dispatchEvent(keydownEvent);

  selectControl.blur();
};
