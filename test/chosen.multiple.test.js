import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getResultByText,
  leftMouseEvent,
  openChosen,
  resetChosenTestDom,
  setupMultipleSelect
} from "./helpers/chosen-test-utils.js";

describe("Chosen multiple-select behavior", () => {
  beforeEach(resetChosenTestDom);

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
});
