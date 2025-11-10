/*-------------------------------- Constants --------------------------------*/
// No constants yet, but you could define operator symbols or default values here later
const OPERATORS = ['+', '-', '*', '/'];

/*-------------------------------- Variables --------------------------------*/
let current = '0';         // current input (displayed number)
let previous = null;       // stored number for pending operation
let operator = null;       // '+', '-', '*', or '/'
let resetOnNextDigit = false; // flag to clear display when typing after operator or equals

/*------------------------ Cached Element References ------------------------*/
const calculator = document.querySelector('#calculator');
const displayEl =
  document.querySelector('[data-role="display"]') ||
  document.querySelector('#display') ||
  document.querySelector('#output') ||
  document.querySelector('.display');

/*----------------------------- Event Listeners -----------------------------*/
calculator.addEventListener('click', function (event) {
  const button = event.target.closest('.button');
  if (!button) return; // ignore clicks outside buttons

  const value = button.innerText.trim();

  // Number buttons
  if (button.classList.contains('number')) {
    appendDigit(value);
    return;
  }

  // Operator buttons
  if (button.classList.contains('operator') || OPERATORS.includes(value)) {
    chooseOperator(value);
    return;
  }

  // Equals button
  if (button.classList.contains('equals') || value === '=') {
    compute();
    return;
  }

  // Clear button
  if (button.classList.contains('clear') || /^(AC|C|Clear)$/i.test(value)) {
    clearAll();
    return;
  }
});

/*-------------------------------- Functions --------------------------------*/
function updateDisplay(value = current) {
  displayEl.textContent = value;
}

function clearAll() {
  current = '0';
  previous = null;
  operator = null;
  resetOnNextDigit = false;
  updateDisplay();
}

function appendDigit(digit) {
  // Avoid multiple decimals
  if (digit === '.' && current.includes('.')) return;

  // Replace leading zero or start new number after operator/equals
  if (resetOnNextDigit || current === '0') {
    current = digit === '.' ? '0.' : digit;
    resetOnNextDigit = false;
  } else {
    current += digit;
  }

  updateDisplay();
}

function chooseOperator(op) {
  if (!OPERATORS.includes(op)) return;

  if (operator && previous !== null && !resetOnNextDigit) {
    compute();
  } else {
    previous = current;
  }

  operator = op;
  resetOnNextDigit = true;
}

function compute() {
  if (operator === null || previous === null) return;

  const a = parseFloat(previous);
  const b = parseFloat(current);
  let result;

  switch (operator) {
    case '+':
      result = a + b;
      break;
    case '-':
      result = a - b;
      break;
    case '*':
      result = a * b;
      break;
    case '/':
      if (b === 0) {
        updateDisplay('Error');
        resetAfterError();
        return;
      }
      result = a / b;
      break;
  }

  current = String(result);
  previous = null;
  operator = null;
  resetOnNextDigit = true;
  updateDisplay();
}

function resetAfterError() {
  current = '0';
  previous = null;
  operator = null;
  resetOnNextDigit = true;
}

/*-------------------------------- Init --------------------------------*/
updateDisplay(); // initialize display

