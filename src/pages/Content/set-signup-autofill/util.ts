export const simulateType = (inputElement: HTMLInputElement, text: string) => {
  inputElement.focus();
  inputElement.value = text;
  const inputEvent = new Event('input', { bubbles: true });
  inputElement.dispatchEvent(inputEvent);
  const changeEvent = new Event('change', { bubbles: true });
  inputElement.dispatchEvent(changeEvent);
  inputElement.blur();
};

export const simulateClick = (buttonElement: HTMLButtonElement) => {
  buttonElement.dispatchEvent(new MouseEvent('click', { bubbles: true }));
};

export const simulateSelect = (selector: string, value: string) => {
  const selectControl: HTMLInputElement | null = document.querySelector(
    `${selector} .react-select__control input`
  );
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
