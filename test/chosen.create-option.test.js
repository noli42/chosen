import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getResultByText,
  keyboardEvent,
  leftMouseEvent,
  openChosen,
  resetChosenTestDom,
  setupSingleSelect,
  typeSearch
} from "./helpers/chosen-test-utils.js";

describe("Chosen create-option and no-results behavior", () => {
  beforeEach(resetChosenTestDom);

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

  it("renders custom no-results text as text", () => {
    const select = setupSingleSelect();

    select.chosen({
      no_results_text: "<strong>Nothing found</strong>",
      create_option: false
    });

    openChosen("country");
    typeSearch("Spain");

    const noResults = document.querySelector(".no-results");

    expect(noResults).not.toBeNull();
    expect(noResults.querySelector("strong")).toBeNull();
    expect(noResults.textContent).toContain("<strong>Nothing found</strong>");
    expect(noResults.textContent).toContain("Spain");
  });

  it("renders custom create-option text as text", () => {
    const select = setupSingleSelect();

    select.chosen({
      create_option: true,
      create_option_text: "<strong>Add country</strong>",
      skip_no_results: true
    });

    openChosen("country");
    typeSearch("Spain");

    const createOption = document.querySelector(".create-option");

    expect(createOption).not.toBeNull();
    expect(createOption.querySelector("strong")).toBeNull();
    expect(createOption.textContent).toContain("<strong>Add country</strong>");
    expect(createOption.textContent).toContain("Spain");
  });

  it("creates new options from typed text without converting it to markup", () => {
    const select = setupSingleSelect();

    select.chosen({
      create_option: true,
      skip_no_results: true
    });

    const typedValue = "<strong>Spain</strong>";

    openChosen("country");
    typeSearch(typedValue);

    const createOption = document.querySelector(".create-option");

    expect(createOption).not.toBeNull();

    createOption.dispatchEvent(leftMouseEvent("mouseover"));
    createOption.dispatchEvent(leftMouseEvent("mouseup"));

    const createdOption = [...select.options].find(option => option.value === typedValue);

    expect(createdOption).not.toBeUndefined();
    expect(createdOption.text).toBe(typedValue);
    expect(createdOption.innerHTML).not.toContain("<strong>");
  });

  it("keeps keyboard focus usable after creating a single option with Enter", () => {
    const select = setupSingleSelect();

    select.chosen({
      create_option: true,
      skip_no_results: true
    });

    const container = openChosen("country");
    const searchInput = container.querySelector(".chosen-search-input");

    searchInput.value = "Spain";
    searchInput.dispatchEvent(keyboardEvent("keyup", "S".charCodeAt(0)));

    const createOption = document.querySelector(".create-option");

    expect(createOption).not.toBeNull();

    createOption.dispatchEvent(leftMouseEvent("mouseover"));

    searchInput.dispatchEvent(keyboardEvent("keydown", 13));
    searchInput.dispatchEvent(keyboardEvent("keyup", 13));

    expect(select.value).toBe("Spain");
    expect(container.classList.contains("chosen-with-drop")).toBe(false);
    expect(container.classList.contains("chosen-container-active")).toBe(true);
    expect(document.activeElement).toBe(searchInput);
  });

});
