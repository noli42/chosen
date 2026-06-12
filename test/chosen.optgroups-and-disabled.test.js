import { beforeEach, describe, expect, it } from "vitest";
import {
  getResultByText,
  getResultsText,
  leftMouseEvent,
  openChosen,
  resetChosenTestDom,
  setupDisabledAndHiddenSelect,
  setupDisabledOptgroupSelect,
  setupOptgroupSelect,
  setupSelectByGroupSelect
} from "./helpers/chosen-test-utils.js";

describe("Chosen optgroups, hidden options, and disabled options", () => {
  beforeEach(resetChosenTestDom);

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
});
