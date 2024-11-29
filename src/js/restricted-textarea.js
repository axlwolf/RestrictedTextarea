export const RestrictedTextarea = (() => {
  console.log("RestrictedTextarea");

  // Constants
  const MAX_VALUE = 250;
  const CURRENT_VALUE = Symbol("currentValue");
  let state = {
    [CURRENT_VALUE]: 0,
  };

  // DOM References
  const $textarea = document.getElementById("textarea");
  const $textareaCounter = document.querySelector(".textarea-charcount");
  const $counterCurrent = document.querySelector(
    ".textarea-charcount--current"
  );
  const $counterMax = document.querySelector(".textarea-charcount--max");

  const updateCounter = () => {
    $counterCurrent.textContent = state[CURRENT_VALUE];
    if (state[CURRENT_VALUE] >= MAX_VALUE) {
      state[CURRENT_VALUE] = MAX_VALUE;
      $textarea.classList.add("limit-reach");
      $textareaCounter.classList.add("limit-reach");
    } else {
      $textarea.classList.remove("limit-reach");
      $textareaCounter.classList.remove("limit-reach");
    }
  };

  const enforceMaxCharacters = (e) => {
    if (
      state[CURRENT_VALUE] >= MAX_VALUE &&
      ![
        "Backspace",
        "Delete",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
      ].includes(e.code)
    ) {
      e.preventDefault();
    }
  };

  const onPaste = (e) => {
    const pastedText = e.clipboardData.getData("text");
    const newLength = state[CURRENT_VALUE] + pastedText.length;

    if (newLength > MAX_VALUE) {
      e.preventDefault();
      $textarea.value += pastedText.substring(
        0,
        MAX_VALUE - state[CURRENT_VALUE]
      );
      state[CURRENT_VALUE] = MAX_VALUE;
    } else {
      state[CURRENT_VALUE] += pastedText.length;
    }

    updateCounter();
  };

  const onChange = (e) => {
    const valueLength = $textarea.value.length;

    if (valueLength === 0) {
      state[CURRENT_VALUE] = 0;
    } else if (e.code === "Backspace" || e.code === "Delete") {
      state[CURRENT_VALUE] = Math.max(0, valueLength);
    } else {
      state[CURRENT_VALUE] = Math.min(MAX_VALUE, valueLength);
    }

    updateCounter();
  };

  const eventHandlers = () => {
    $textarea.addEventListener("keyup", onChange);
    $textarea.addEventListener("keydown", enforceMaxCharacters);
    $textarea.addEventListener("paste", onPaste);
  };

  const init = () => {
    console.log("Init RestrictedTextarea");
    $counterMax.textContent = MAX_VALUE;

    updateCounter();
    eventHandlers();
  };

  return {
    init,
  };
})();
