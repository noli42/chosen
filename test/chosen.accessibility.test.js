import { beforeEach, describe, expect, it } from "vitest";
import {
  chosenContainerId,
  keyboardEvent,
  leftMouseEvent,
  openChosen,
  resetChosenTestDom,
  setupLabelledSelect,
  setupMultipleSelect,
  setupSelectorPunctuationLabelSelect,
  setupSingleSelect
} from "./helpers/chosen-test-utils.js";

describe("Chosen accessibility attributes", () => {
  beforeEach(resetChosenTestDom);

  it("associates labels when select ids contain selector punctuation", () => {
    const select = setupSelectorPunctuationLabelSelect();

    expect(() => select.chosen()).not.toThrow();

    const input = document.querySelector(".chosen-container .chosen-search-input");

    expect(input).not.toBeNull();
    expect(input.getAttribute("aria-labelledby")).toContain("punctuation-label");
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

  it("mirrors aria-expanded on the visible single-select trigger", () => {
    const select = setupSingleSelect();

    select.chosen({ create_option: true, skip_no_results: true });

    const container = document.querySelector(`#${chosenContainerId("country")}`);
    const trigger = container.querySelector(".chosen-single");
    const input = container.querySelector(".chosen-search-input");

    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(input.getAttribute("aria-expanded")).toBe("false");

    openChosen("country");

    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(input.getAttribute("aria-expanded")).toBe("true");

    select.dispatchEvent(new Event("chosen:close"));

    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(input.getAttribute("aria-expanded")).toBe("false");
  });

  it("links the single-select trigger and search input to the listbox", () => {
    const select = setupSingleSelect();

    select.chosen({ create_option: true, skip_no_results: true });

    const container = document.querySelector(`#${chosenContainerId("country")}`);
    const trigger = container.querySelector(".chosen-single");
    const input = container.querySelector(".chosen-search-input");
    const results = container.querySelector(".chosen-results");

    expect(trigger.getAttribute("role")).toBe("button");
    expect(trigger.getAttribute("aria-haspopup")).toBe("listbox");
    expect(trigger.getAttribute("aria-controls")).toBe(results.id);

    expect(input.getAttribute("role")).toBe("combobox");
    expect(input.getAttribute("aria-controls")).toBe(results.id);
    expect(input.getAttribute("aria-owns")).toBe(results.id);
  });

  it("does not override the single-select trigger accessible name", () => {
    const select = setupLabelledSelect();

    select.chosen();

    const container = document.querySelector(`#${chosenContainerId("labelled-country")}`);
    const trigger = container.querySelector(".chosen-single");

    expect(trigger.hasAttribute("aria-label")).toBe(false);
    expect(trigger.hasAttribute("aria-labelledby")).toBe(false);
    expect(trigger.querySelector("span").textContent).toBe("Select an Option");
  });

  it("keeps initial single-select focus on the visible trigger", () => {
    const select = setupSingleSelect();

    select.chosen({ create_option: true, skip_no_results: true });

    const container = document.querySelector(`#${chosenContainerId("country")}`);
    const trigger = container.querySelector(".chosen-single");
    const input = container.querySelector(".chosen-search-input");

    trigger.focus();

    expect(document.activeElement).toBe(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(input.getAttribute("aria-expanded")).toBe("false");
    expect(container.classList.contains("chosen-with-drop")).toBe(false);
  });

  it.each([13, 32])("opens a focused single select with key code %i", keyCode => {
    const select = setupSingleSelect();

    select.chosen({ create_option: true, skip_no_results: true });

    const container = document.querySelector(`#${chosenContainerId("country")}`);
    const trigger = container.querySelector(".chosen-single");
    const input = container.querySelector(".chosen-search-input");

    trigger.focus();
    trigger.dispatchEvent(keyboardEvent("keydown", keyCode));
    trigger.dispatchEvent(keyboardEvent("keyup", keyCode));

    expect(container.classList.contains("chosen-with-drop")).toBe(true);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(input.getAttribute("aria-expanded")).toBe("true");
    expect(document.activeElement).toBe(input);
  });

  it("keeps single-select aria-expanded false after mouse selection", () => {
    const select = setupSingleSelect();

    select.chosen({ create_option: true, skip_no_results: true });

    const container = openChosen("country");
    const trigger = container.querySelector(".chosen-single");
    const input = container.querySelector(".chosen-search-input");
    const germany = [...document.querySelectorAll(".chosen-results li")]
      .find(result => result.textContent.includes("Germany"));

    expect(germany).not.toBeUndefined();

    germany.dispatchEvent(leftMouseEvent("mouseup"));

    expect(select.value).toBe("Germany");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(input.getAttribute("aria-expanded")).toBe("false");
  });

  it("keeps keyboard selection behavior while collapsing aria-expanded", () => {
    const select = setupSingleSelect();

    select.chosen({ create_option: true, skip_no_results: true });

    const container = openChosen("country");
    const trigger = container.querySelector(".chosen-single");
    const input = container.querySelector(".chosen-search-input");

    input.dispatchEvent(keyboardEvent("keydown", 40));
    input.dispatchEvent(keyboardEvent("keyup", 40));

    input.dispatchEvent(keyboardEvent("keydown", 13));
    input.dispatchEvent(keyboardEvent("keyup", 13));

    expect(select.value).toBe("United Kingdom");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(input.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(input);
  });

  it("keeps single-select aria-expanded false after closing with Escape", () => {
    const select = setupSingleSelect();

    select.chosen({ create_option: true, skip_no_results: true });

    const container = openChosen("country");
    const trigger = container.querySelector(".chosen-single");
    const input = container.querySelector(".chosen-search-input");

    input.dispatchEvent(keyboardEvent("keydown", 27));
    input.dispatchEvent(keyboardEvent("keyup", 27));

    expect(container.classList.contains("chosen-with-drop")).toBe(false);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(input.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(trigger);
  });

  it("keeps multiple-select aria-expanded behavior on the search input only", () => {
    const select = setupMultipleSelect();

    select.chosen({ create_option: true, skip_no_results: true });

    const container = openChosen("countries");
    const input = container.querySelector(".chosen-search-input");

    expect(container.querySelector(".chosen-single")).toBeNull();
    expect(input.getAttribute("aria-expanded")).toBe("true");

    select.dispatchEvent(new Event("chosen:close"));

    expect(input.getAttribute("aria-expanded")).toBe("false");
  });
});
