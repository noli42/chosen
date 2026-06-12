import { expect, vi } from "vitest";
import "../../src/chosen.js";

export function setupSingleSelect() {
  document.body.innerHTML = `
    <select id="country" data-placeholder="Choose a Country..." class="chosen-select" tabindex="1">
      <option value="" selected disabled hidden>Choose a Country...</option>
      <option value="United States">United States</option>
      <option value="United Kingdom">United Kingdom</option>
      <option value="Hungary">Hungary</option>
      <option value="Germany">Germany</option>
    </select>
  `;

  return document.querySelector("#country");
}

export function setupMultipleSelect() {
  document.body.innerHTML = `
    <select id="countries" data-placeholder="Choose countries..." class="chosen-select" multiple tabindex="2">
      <option value=""></option>
      <option value="United States">United States</option>
      <option value="United Kingdom">United Kingdom</option>
      <option value="Hungary">Hungary</option>
      <option value="Germany">Germany</option>
    </select>
  `;

  return document.querySelector("#countries");
}

export function setupOptgroupSelect() {
  document.body.innerHTML = `
    <select id="teams" data-placeholder="Your Favorite Football Team" class="chosen-select" tabindex="3">
      <option value=""></option>
      <optgroup label="NFC EAST">
        <option>Dallas Cowboys</option>
        <option>New York Giants</option>
      </optgroup>
      <optgroup label="AFC EAST">
        <option>Buffalo Bills</option>
        <option>Miami Dolphins</option>
      </optgroup>
    </select>
  `;

  return document.querySelector("#teams");
}

export function setupValueSearchSelect() {
  document.body.innerHTML = `
    <select id="codes" data-placeholder="Choose a country code..." class="chosen-select" tabindex="4">
      <option value=""></option>
      <option value="us">United States</option>
      <option value="uk">United Kingdom</option>
      <option value="hu">Hungary</option>
      <option value="de">Germany</option>
    </select>
  `;

  return document.querySelector("#codes");
}

export function setupDisabledAndHiddenSelect() {
  document.body.innerHTML = `
    <select id="availability" data-placeholder="Choose one..." class="chosen-select">
      <option value=""></option>
      <option value="visible">Visible Option</option>
      <option value="hidden" hidden>Hidden Option</option>
      <option value="disabled" disabled>Disabled Option</option>
      <option value="available">Available Option</option>
    </select>
  `;

  return document.querySelector("#availability");
}

export function setupDisabledOptgroupSelect() {
  document.body.innerHTML = `
    <select id="grouped-disabled" class="chosen-select">
      <option value=""></option>
      <optgroup label="Enabled Group">
        <option value="enabled-one">Enabled One</option>
      </optgroup>
      <optgroup label="Disabled Group" disabled>
        <option value="disabled-one">Disabled One</option>
      </optgroup>
    </select>
  `;

  return document.querySelector("#grouped-disabled");
}

export function setupSingleDeselectSelect() {
  document.body.innerHTML = `
    <select id="deselectable" data-placeholder="Choose a Country..." class="chosen-select-deselect">
      <option value=""></option>
      <option value="Hungary">Hungary</option>
      <option value="Germany">Germany</option>
    </select>
  `;

  return document.querySelector("#deselectable");
}

export function setupDataAttributeSelect() {
  document.body.innerHTML = `
    <select id="data-select" class="chosen-select">
      <option value=""></option>
      <option value="hu" data-country-code="HU" data-region="EU">Hungary</option>
      <option value="de" data-country-code="DE" data-region="EU">Germany</option>
    </select>
  `;

  return document.querySelector("#data-select");
}

export function setupLabelledSelect() {
  document.body.innerHTML = `
    <label for="labelled-country" id="country-label">Country</label>
    <select id="labelled-country" class="chosen-select">
      <option value=""></option>
      <option value="hu">Hungary</option>
      <option value="de">Germany</option>
    </select>
  `;

  return document.querySelector("#labelled-country");
}

export function setupSelectByGroupSelect() {
  document.body.innerHTML = `
    <select id="select-by-group" class="chosen-select" multiple select-by-group>
      <option value=""></option>
      <optgroup label="Europe">
        <option value="hu">Hungary</option>
        <option value="de">Germany</option>
      </optgroup>
      <optgroup label="North America">
        <option value="us">United States</option>
      </optgroup>
    </select>
  `;

  return document.querySelector("#select-by-group");
}

export function setupFormattedTextSelect() {
  document.body.innerHTML = `
    <select id="formatted-text" class="chosen-select">
      <option value=""></option>
      <option value="hu">Hungary</option>
      <option value="de">Germany</option>
    </select>
  `;

  const option = document.querySelector("#formatted-text option[value='hu']");
  option.innerHTML = `<span class="country-label">Hungary</span>`;

  return document.querySelector("#formatted-text");
}

export function setupOptionMetadataSelect() {
  document.body.innerHTML = `
    <select id="option-metadata" class="chosen-select">
      <option value=""></option>
      <option
        value="fr"
        class="flag-fr country-option"
        style="font-weight: bold"
        data-country-code="FR"
        data-region="EU"
      >France</option>
    </select>
  `;

  return document.querySelector("#option-metadata");
}

export function setupGeneratedAttributeSelect() {
  document.body.innerHTML = `
    <select id="generated-attributes" class="chosen-select">
      <option value=""></option>
      <option
        value="hu"
        data-country-code="HU"
        data-option-array-index="999"
        data-value="custom-value"
      >Hungary</option>
    </select>
  `;

  return document.querySelector("#generated-attributes");
}

export function setupSelectorPunctuationLabelSelect() {
  document.body.innerHTML = `
    <label for="country'][data-test='x" id="punctuation-label">Country</label>
    <select id="country'][data-test='x" class="chosen-select">
      <option value=""></option>
      <option value="hu">Hungary</option>
      <option value="de">Germany</option>
    </select>
  `;

  return document.querySelector("select");
}

export function chosenContainerId(selectId) {
  return `${selectId.replace(/[^\w]/g, "_")}_chosen`;
}

export function leftMouseEvent(type) {
  const event = new MouseEvent(type, {
    bubbles: true,
    cancelable: true,
    button: 0
  });

  Object.defineProperty(event, "which", {
    value: 1
  });

  return event;
}

export function keyboardEvent(type, keyCode) {
  return new KeyboardEvent(type, {
    bubbles: true,
    cancelable: true,
    keyCode,
    which: keyCode
  });
}

export function resetChosenTestDom() {
  vi.restoreAllMocks();
  document.body.innerHTML = "";

  // jsdom does not calculate real layout, so this keeps dropup logic predictable.
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
    x: 0,
    y: 0,
    width: 200,
    height: 40,
    top: 0,
    right: 200,
    bottom: 40,
    left: 0,
    toJSON: () => {}
  });
}

export function openChosen(selectId) {
  const container = document.querySelector(`#${chosenContainerId(selectId)}`);

  expect(container).not.toBeNull();

  container.dispatchEvent(leftMouseEvent("mousedown"));

  return container;
}

export function getResultByText(text) {
  return [...document.querySelectorAll(".chosen-results li")]
    .find(result => result.textContent.includes(text));
}

export function getResultsText() {
  return [...document.querySelectorAll(".chosen-results li")].map(li =>
    li.textContent.trim()
  );
}

export function typeSearch(value) {
  const input = document.querySelector(".chosen-search-input");

  expect(input).not.toBeNull();

  input.value = value;
  input.dispatchEvent(keyboardEvent("keyup", value.charCodeAt(0)));

  return input;
}
