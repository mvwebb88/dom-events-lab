/*
 INTRO: quick “is JS wired?”
*/
console.log("JS loaded!"); 

/*
 CACHED ELEMENT REFERENCES
 */
const calculator = document.querySelector("#calculator");
const displayEl  = document.querySelector(".display");

/*
 OPTION A: forEach to assign listeners
(logs button text for testing; not used for MVP)
Uncomment this block to try the forEach approach.
Then click any button in the UI and watch the console.
const buttons = document.querySelectorAll(".button");
buttons.forEach((button) => {
  button.addEventListener("click", (event) => {
    This log is for testing purposes to verify we're getting the correct value
    console.log("[forEach] clicked:", event.target.innerText);
    Future logic to capture the button's value would go here...
  });
});
*/

/*
 OPTION B: Event Delegation (RECOMMENDED)
 One listener on #calculator handles all buttons
 */

calculator.addEventListener("click", (event) => {
 
  if (!event.target.classList.contains("button")) return;

  console.log("[delegation] clicked:", event.target.innerText);

    // === MVP handlers ===

  if (event.target.classList.contains("number")) {
    handleNumber(event.target.innerText);
    return;
  }

  if (event.target.classList.contains("operator")) {
    handleOperator(event.target.innerText); 
    return;
  }

  if (event.target.classList.contains("equals")) {
    handleEquals();
    return;
  }
});

/*
 * USER STORY STATE (MVP)
 * - As a user, select numbers
 * - Add/Subtract/Multiply/Divide
 * - See output
 * - Clear to 0
 */

let currentInput  = "";  
let previousInput = "";   
let operator      = null; 
let justEvaluated = false; 

// * RENDER: update the screen

function render() {
  // show currentInput if present, otherwise show previousInput, otherwise "0"
  displayEl.textContent = currentInput || previousInput || "0";
}
render();

/****************************************
 * IMPLEMENT A USER STORY (numbers first)
 * “As a user, I want to select numbers…”
 ****************************************/
function handleNumber(digit) {
  // If we just pressed "=", and the user starts typing, begin a new calculation
  if (justEvaluated) {
    currentInput = "";
    previousInput = "";
    operator = null;
    justEvaluated = false;
  }

  // (Optional) avoid leading zeros like "0005"
  if (digit === "0" && currentInput === "0") return;
  if (currentInput === "0" && digit !== "0") currentInput = "";

  currentInput += digit; // append the clicked digit
  render();              // update the display
}

/****************************************
 * OPERATORS: +, -, *, /, and Clear (C)
 ****************************************/
function handleOperator(op) {
  // “As a user, I want to clear and start from 0”
  if (op === "C") {
    currentInput = "";
    previousInput = "";
    operator = null;
    justEvaluated = false;
    render();
    return;
  }

  // If we haven’t saved a left-hand number yet, move current → previous
  if (!previousInput) {
    previousInput = currentInput || "0";
    currentInput = "";
  }
  // If both sides exist, compute first (allows chaining: 7 + 8 * 3 …)
  else if (previousInput && currentInput) {
    const result = compute(previousInput, currentInput, operator);
    previousInput = String(result);
    currentInput = "";
  }

  operator = op;        // remember the chosen operator
  justEvaluated = false;
  render();
}

   // * EQUALS: perform the operation

function handleEquals() {

  // need both sides and an operator to compute
    if (!previousInput || !operator || !currentInput) return;

  const result = compute(previousInput, currentInput, operator);

  // show result; prep for next calculation
  previousInput = String(result);
  currentInput = "";
  operator = null;
  justEvaluated = true;
  render();
}

/*
 MATH ENGINE (MVP)
 integers; division-by-zero returns "∞"
 */
function compute(aStr, bStr, op) {
  const a = Number(aStr);
  const b = Number(bStr);

  switch (op) {
    case "+": return a + b;            
    case "-": return a - b;            
    case "*": return a * b;            
    case "/": return b === 0 ? "∞" : a / b; 
    default : return b; 
  }
}
