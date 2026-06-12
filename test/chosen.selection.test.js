import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getResultByText,
  keyboardEvent,
  leftMouseEvent,
  openChosen,
  resetChosenTestDom,
  setupSingleDeselectSelect,
  setupSingleSelect
} from "./helpers/chosen-test-utils.js";

describe("Chosen single-select selection behavior", () => {
  beforeEach(resetChosenTestDom);

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

  it("keeps keyboard focus usable after selecting a single option with Enter", () => {
    const select = setupSingleSelect();

    select.chosen({ create_option: true, skip_no_results: true });

    const container = openChosen("country");
    const searchInput = container.querySelector(".chosen-search-input");

    expect(document.activeElement).toBe(searchInput);

    searchInput.dispatchEvent(keyboardEvent("keydown", 40));
    searchInput.dispatchEvent(keyboardEvent("keyup", 40));

    searchInput.dispatchEvent(keyboardEvent("keydown", 13));
    searchInput.dispatchEvent(keyboardEvent("keyup", 13));

    expect(select.value).toBe("United Kingdom");
    expect(container.classList.contains("chosen-with-drop")).toBe(false);
    expect(container.classList.contains("chosen-container-active")).toBe(true);
    expect(document.activeElement).toBe(searchInput);

    searchInput.dispatchEvent(keyboardEvent("keydown", 32));
    searchInput.dispatchEvent(keyboardEvent("keyup", 32));

    expect(container.classList.contains("chosen-with-drop")).toBe(true);
    expect(document.activeElement).toBe(searchInput);
  });

  it("removes active styling after focus leaves a single select after keyboard selection", async () => {
    document.body.innerHTML = `
      <select id="country" data-placeholder="Choose a Country..." class="chosen-select" tabindex="1">
        <option value="" selected disabled hidden>Choose a Country...</option>
        <option value="United States">United States</option>
        <option value="United Kingdom">United Kingdom</option>
        <option value="Hungary">Hungary</option>
        <option value="Germany">Germany</option>
      </select>
      <button id="after">After</button>
    `;

    const select = document.querySelector("#country");

    select.chosen({ create_option: true, skip_no_results: true });

    const container = openChosen("country");
    const searchInput = container.querySelector(".chosen-search-input");
    const afterButton = document.querySelector("#after");

    searchInput.dispatchEvent(keyboardEvent("keydown", 40));
    searchInput.dispatchEvent(keyboardEvent("keyup", 40));

    searchInput.dispatchEvent(keyboardEvent("keydown", 13));
    searchInput.dispatchEvent(keyboardEvent("keyup", 13));

    expect(document.activeElement).toBe(searchInput);
    expect(container.classList.contains("chosen-container-active")).toBe(true);

    afterButton.focus();

    await new Promise(resolve => setTimeout(resolve, 150));

    expect(document.activeElement).toBe(afterButton);
    expect(container.classList.contains("chosen-container-active")).toBe(false);
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
});
