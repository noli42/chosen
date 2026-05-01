import { beforeEach, describe, expect, it, vi } from "vitest";
import "../src/chosen.js";

function setupSingleSelect() {
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

function setupMultipleSelect() {
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

function setupOptgroupSelect() {
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

function setupValueSearchSelect() {
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

function setupDisabledAndHiddenSelect() {
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

function setupDisabledOptgroupSelect() {
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

function setupSingleDeselectSelect() {
  document.body.innerHTML = `
    <select id="deselectable" data-placeholder="Choose a Country..." class="chosen-select-deselect">
      <option value=""></option>
      <option value="Hungary">Hungary</option>
      <option value="Germany">Germany</option>
    </select>
  `;

  return document.querySelector("#deselectable");
}

function setupDataAttributeSelect() {
  document.body.innerHTML = `
    <select id="data-select" class="chosen-select">
      <option value=""></option>
      <option value="hu" data-country-code="HU" data-region="EU">Hungary</option>
      <option value="de" data-country-code="DE" data-region="EU">Germany</option>
    </select>
  `;

  return document.querySelector("#data-select");
}

function setupLabelledSelect() {
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

function setupSelectByGroupSelect() {
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

function chosenContainerId(selectId) {
  return `${selectId.replace(/[^\w]/g, "_")}_chosen`;
}

function leftMouseEvent(type) {
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

function keyboardEvent(type, keyCode) {
  return new KeyboardEvent(type, {
    bubbles: true,
    cancelable: true,
    keyCode,
    which: keyCode
  });
}

function openChosen(selectId) {
  const container = document.querySelector(`#${chosenContainerId(selectId)}`);

  expect(container).not.toBeNull();

  container.dispatchEvent(leftMouseEvent("mousedown"));

  return container;
}

function getResultByText(text) {
  return [...document.querySelectorAll(".chosen-results li")]
    .find(result => result.textContent.includes(text));
}

function getResultsText() {
  return [...document.querySelectorAll(".chosen-results li")].map(li =>
    li.textContent.trim()
  );
}

function typeSearch(value) {
  const input = document.querySelector(".chosen-search-input");

  expect(input).not.toBeNull();

  input.value = value;
  input.dispatchEvent(keyboardEvent("keyup", value.charCodeAt(0)));

  return input;
}

describe("Chosen select component", () => {
  beforeEach(() => {
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
  });

  it("initializes a single select and creates a chosen container", () => {
    const select = setupSingleSelect();

    select.chosen({ create_option: true, skip_no_results: true });

    const container = document.querySelector(`#${chosenContainerId("country")}`);

    expect(container).not.toBeNull();
    expect(container.classList.contains("chosen-container")).toBe(true);
    expect(container.classList.contains("chosen-container-single")).toBe(true);
    expect(container.querySelector(".chosen-single span").textContent).toBe("Choose a Country...");
  });

  it("does not initialize the same select more than once", () => {
    const select = setupSingleSelect();

    select.chosen({ create_option: true, skip_no_results: true });
    select.chosen({ create_option: true, skip_no_results: true });

    expect(document.querySelectorAll(`#${chosenContainerId("country")}`)).toHaveLength(1);
    expect(document.querySelectorAll(".chosen-container")).toHaveLength(1);
  });

  it("builds results from select options", () => {
    const select = setupSingleSelect();

    select.chosen({ create_option: true, skip_no_results: true });

    openChosen("country");

    const results = getResultsText();

    expect(results).toContain("United States");
    expect(results).toContain("United Kingdom");
    expect(results).toContain("Hungary");
    expect(results).toContain("Germany");
  });

  it("filters results when searching", () => {
    const select = setupSingleSelect();

    select.chosen({ create_option: true, skip_no_results: true });

    openChosen("country");
    typeSearch("ger");

    expect(getResultsText()).toEqual(["Germany"]);
  });

  it("searches option values when search_in_values is enabled", () => {
    const select = setupValueSearchSelect();

    select.chosen({
      search_in_values: true,
      create_option: true,
      skip_no_results: true
    });

    openChosen("codes");
    typeSearch("de");

    expect(getResultsText()).toEqual(["Germany"]);
  });

  it("supports search_contains for matching inside words", () => {
    const select = setupSingleSelect();

    select.chosen({
      search_contains: true,
      create_option: true,
      skip_no_results: true
    });

    openChosen("country");
    typeSearch("ngd");

    expect(getResultsText()).toEqual(["United Kingdom"]);
  });

  it("respects case_sensitive_search", () => {
    const select = setupSingleSelect();

    select.chosen({
      case_sensitive_search: true,
      create_option: true,
      skip_no_results: true
    });

    openChosen("country");
    typeSearch("germany");

    const results = getResultsText();

    expect(results).not.toContain("Germany");
    expect(document.querySelector(".create-option").textContent).toContain("germany");
  });

  it("selects a single option and updates the original select value", () => {
    const select = setupSingleSelect();

    select.chosen({ create_option: true, skip_no_results: true });

    const container = openChosen("country");
    const germany = getResultByText("Germany");

    expect(germany).not.toBeUndefined();

    germany.dispatchEvent(leftMouseEvent("mouseup"));

    expect(select.value).toBe("Germany");
    expect(container.querySelector(".chosen-single span").textContent).toContain("Germany");
  });

  it("fires change when a single option is selected", () => {
    const select = setupSingleSelect();
    const changeHandler = vi.fn();

    select.addEventListener("change", changeHandler);

    select.chosen({ create_option: true, skip_no_results: true });

    openChosen("country");

    const hungary = getResultByText("Hungary");

    expect(hungary).not.toBeUndefined();

    hungary.dispatchEvent(leftMouseEvent("mouseup"));

    expect(changeHandler).toHaveBeenCalledTimes(1);
    expect(select.value).toBe("Hungary");
  });

  it("initializes a multiple select", () => {
    const select = setupMultipleSelect();

    select.chosen({ create_option: true, skip_no_results: true });

    const container = document.querySelector(`#${chosenContainerId("countries")}`);

    expect(container).not.toBeNull();
    expect(container.classList.contains("chosen-container-multi")).toBe(true);
    expect(container.querySelector(".chosen-choices")).not.toBeNull();
  });

  it("selects multiple options", () => {
    const select = setupMultipleSelect();

    select.chosen({ create_option: true, skip_no_results: true });

    openChosen("countries");

    const hungary = getResultByText("Hungary");

    expect(hungary).not.toBeUndefined();

    hungary.dispatchEvent(leftMouseEvent("mouseup"));

    openChosen("countries");

    const germany = getResultByText("Germany");

    expect(germany).not.toBeUndefined();

    germany.dispatchEvent(leftMouseEvent("mouseup"));

    const selectedValues = [...select.selectedOptions].map(option => option.value);
    const choices = [...document.querySelectorAll(".search-choice")].map(choice =>
      choice.textContent.trim()
    );

    expect(selectedValues).toEqual(["Hungary", "Germany"]);
    expect(choices.join(" ")).toContain("Hungary");
    expect(choices.join(" ")).toContain("Germany");
  });

  it("deselects an option from a multiple select", () => {
    const select = setupMultipleSelect();

    select.chosen({ create_option: true, skip_no_results: true });

    openChosen("countries");

    const hungary = getResultByText("Hungary");

    expect(hungary).not.toBeUndefined();

    hungary.dispatchEvent(leftMouseEvent("mouseup"));

    expect([...select.selectedOptions].map(option => option.value)).toEqual(["Hungary"]);

    const removeButton = document.querySelector(".search-choice-close");

    expect(removeButton).not.toBeNull();

    removeButton.dispatchEvent(leftMouseEvent("click"));

    expect([...select.selectedOptions].map(option => option.value)).toEqual([]);
    expect(document.querySelector(".search-choice")).toBeNull();
  });

  it("enforces max_selected_options for multiple selects", () => {
    const select = setupMultipleSelect();
    const maxSelectedHandler = vi.fn();

    select.addEventListener("chosen:maxselected", maxSelectedHandler);

    select.chosen({
      max_selected_options: 1,
      create_option: true,
      skip_no_results: true
    });

    openChosen("countries");

    const hungary = getResultByText("Hungary");

    expect(hungary).not.toBeUndefined();

    hungary.dispatchEvent(leftMouseEvent("mouseup"));

    expect([...select.selectedOptions].map(option => option.value)).toEqual(["Hungary"]);

    select.__chosen_instance.results_show();

    expect(maxSelectedHandler).toHaveBeenCalledTimes(1);
    expect([...select.selectedOptions].map(option => option.value)).toEqual(["Hungary"]);
  });

  it("builds optgroup labels and group options", () => {
    const select = setupOptgroupSelect();

    select.chosen({ create_option: true, skip_no_results: true });

    openChosen("teams");

    const groupLabels = [...document.querySelectorAll(".group-result")].map(li =>
      li.textContent.trim()
    );

    const groupOptions = [...document.querySelectorAll(".group-option")].map(li =>
      li.textContent.trim()
    );

    expect(groupLabels).toEqual(["NFC EAST", "AFC EAST"]);
    expect(groupOptions).toContain("Dallas Cowboys");
    expect(groupOptions).toContain("Miami Dolphins");
  });

  it("marks options inside disabled optgroups as disabled", () => {
    const select = setupDisabledOptgroupSelect();

    select.chosen({ create_option: true, skip_no_results: true });

    openChosen("grouped-disabled");

    const disabledOption = getResultByText("Disabled One");
    const enabledOption = getResultByText("Enabled One");

    expect(enabledOption.classList.contains("active-result")).toBe(true);
    expect(disabledOption.classList.contains("disabled-result")).toBe(true);
    expect(disabledOption.classList.contains("active-result")).toBe(false);
  });

  it("can select all active options in a group when select-by-group is enabled", () => {
    const select = setupSelectByGroupSelect();

    select.chosen({ create_option: true, skip_no_results: true });

    openChosen("select-by-group");

    const europeGroup = getResultByText("Europe");

    expect(europeGroup).not.toBeUndefined();

    europeGroup.dispatchEvent(leftMouseEvent("mouseup"));

    const selectedValues = [...select.selectedOptions].map(option => option.value);

    expect(selectedValues).toEqual(["hu", "de"]);
  });

  it("creates a new option when create_option is enabled and no result matches", () => {
    const select = setupSingleSelect();

    select.chosen({ create_option: true, skip_no_results: true });

    openChosen("country");
    typeSearch("Spain");

    const createOption = document.querySelector(".create-option");

    expect(createOption).not.toBeNull();
    expect(createOption.textContent).toContain("Spain");

    createOption.dispatchEvent(leftMouseEvent("mouseover"));
    createOption.dispatchEvent(leftMouseEvent("mouseup"));

    expect(select.value).toBe("Spain");
    expect([...select.options].map(option => option.value)).toContain("Spain");
  });

  it("uses a custom create_option callback", () => {
    const select = setupSingleSelect();
    const createOption = vi.fn(function (term) {
      this.select_append_option({
        value: term.toLowerCase(),
        text: `Custom ${term}`
      });
    });

    select.chosen({
      create_option: createOption,
      skip_no_results: true
    });

    openChosen("country");
    typeSearch("Spain");

    const createOptionResult = document.querySelector(".create-option");

    expect(createOptionResult).not.toBeNull();

    createOptionResult.dispatchEvent(leftMouseEvent("mouseover"));
    createOptionResult.dispatchEvent(leftMouseEvent("mouseup"));

    expect(createOption).toHaveBeenCalledWith("Spain");
    expect(select.value).toBe("spain");
    expect([...select.options].map(option => option.text)).toContain("Custom Spain");
  });

  it("shows custom no-results text", () => {
    const select = setupSingleSelect();

    select.chosen({
      no_results_text: "Oops, nothing found!",
      create_option: false
    });

    openChosen("country");
    typeSearch("Spain");

    const noResults = document.querySelector(".no-results");

    expect(noResults).not.toBeNull();
    expect(noResults.textContent).toContain("Oops, nothing found!");
    expect(noResults.textContent).toContain("Spain");
  });

  it("does not show hidden options in results", () => {
    const select = setupDisabledAndHiddenSelect();

    select.chosen({ create_option: true, skip_no_results: true });

    openChosen("availability");

    const results = getResultsText();

    expect(results).toContain("Visible Option");
    expect(results).toContain("Disabled Option");
    expect(results).toContain("Available Option");
    expect(results).not.toContain("Hidden Option");
  });

  it("can hide disabled options from results", () => {
    const select = setupDisabledAndHiddenSelect();

    select.chosen({
      display_disabled_options: false,
      create_option: true,
      skip_no_results: true
    });

    openChosen("availability");

    const results = getResultsText();

    expect(results).toContain("Visible Option");
    expect(results).toContain("Available Option");
    expect(results).not.toContain("Disabled Option");
    expect(results).not.toContain("Hidden Option");
  });

  it("renders disabled options as disabled results by default", () => {
    const select = setupDisabledAndHiddenSelect();

    select.chosen({ create_option: true, skip_no_results: true });

    openChosen("availability");

    const disabledOption = getResultByText("Disabled Option");

    expect(disabledOption).not.toBeUndefined();
    expect(disabledOption.classList.contains("disabled-result")).toBe(true);
    expect(disabledOption.classList.contains("active-result")).toBe(false);
  });

  it("supports single deselect when allow_single_deselect is enabled", () => {
    const select = setupSingleDeselectSelect();

    select.chosen({ allow_single_deselect: true });

    const container = openChosen("deselectable");
    const germany = getResultByText("Germany");

    expect(germany).not.toBeUndefined();

    germany.dispatchEvent(leftMouseEvent("mouseup"));

    expect(select.value).toBe("Germany");

    const closeButton = container.querySelector(".search-choice-close");

    expect(closeButton).not.toBeNull();

    closeButton.dispatchEvent(leftMouseEvent("mouseup"));

    expect(select.value).toBe("");
    expect(container.querySelector(".chosen-single span").textContent).toBe("Choose a Country...");
  });

  it("disables search for single select when disable_search_threshold is met", () => {
    const select = setupSingleSelect();

    select.chosen({ disable_search_threshold: 10 });

    const container = document.querySelector(`#${chosenContainerId("country")}`);
    const input = container.querySelector(".chosen-search-input");

    expect(container.classList.contains("chosen-container-single-nosearch")).toBe(true);
    expect(input.readOnly).toBe(true);
  });

  it("uses custom width option", () => {
    const select = setupSingleSelect();

    select.chosen({ width: "95%" });

    const container = document.querySelector(`#${chosenContainerId("country")}`);

    expect(container.style.width).toBe("95%");
  });

  it("inherits select classes when inherit_select_classes is enabled", () => {
    const select = setupSingleSelect();

    select.classList.add("extra-select-class");
    select.chosen({ inherit_select_classes: true });

    const container = document.querySelector(`#${chosenContainerId("country")}`);

    expect(container.classList.contains("extra-select-class")).toBe(true);
  });

  it("copies data attributes when parser_config.copy_data_attributes is enabled", () => {
    const select = setupDataAttributeSelect();

    select.chosen({
      parser_config: {
        copy_data_attributes: true
      }
    });

    openChosen("data-select");

    const hungary = getResultByText("Hungary");

    expect(hungary).not.toBeUndefined();
    expect(hungary.getAttribute("data-country-code")).toBe("HU");
    expect(hungary.getAttribute("data-region")).toBe("EU");
  });

  it("updates results after chosen:updated is dispatched", () => {
    const select = setupSingleSelect();

    select.chosen({ create_option: true, skip_no_results: true });

    select.insertAdjacentHTML("beforeend", `<option value="Spain">Spain</option>`);
    select.dispatchEvent(new Event("chosen:updated"));

    openChosen("country");

    expect(getResultsText()).toContain("Spain");
  });

  it("sets aria-labelledby from an associated label", () => {
    const select = setupLabelledSelect();

    select.chosen();

    const input = document.querySelector(
      `#${chosenContainerId("labelled-country")} .chosen-search-input`
    );

    expect(input).not.toBeNull();
    expect(input.getAttribute("aria-labelledby")).toContain("country-label");
  });

  it("sets aria-expanded while opening and closing results", () => {
    const select = setupSingleSelect();

    select.chosen({ create_option: true, skip_no_results: true });

    const container = openChosen("country");
    const input = container.querySelector(".chosen-search-input");

    expect(input.getAttribute("aria-expanded")).toBe("true");

    select.dispatchEvent(new Event("chosen:close"));

    expect(input.getAttribute("aria-expanded")).toBe("false");
  });

  it("destroys the chosen instance and restores the original select styles", () => {
    const select = setupSingleSelect();

    select.chosen({ create_option: true, skip_no_results: true });

    expect(document.querySelector(`#${chosenContainerId("country")}`)).not.toBeNull();

    select.chosen("destroy");

    expect(document.querySelector(`#${chosenContainerId("country")}`)).toBeNull();
    expect(select.__chosen_instance).toBeUndefined();
    expect(select.style.position).toBe("");
    expect(select.style.opacity).toBe("");
    expect(select.style.pointerEvents).toBe("");
  });

  it("can be initialized again after destroy", () => {
    const select = setupSingleSelect();

    select.chosen({ create_option: true, skip_no_results: true });
    select.chosen("destroy");
    select.chosen({ create_option: true, skip_no_results: true });

    expect(document.querySelector(`#${chosenContainerId("country")}`)).not.toBeNull();
    expect(select.__chosen_instance).toBeDefined();
  });
});
