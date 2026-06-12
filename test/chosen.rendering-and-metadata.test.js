import { beforeEach, describe, expect, it } from "vitest";
import {
  getResultByText,
  leftMouseEvent,
  openChosen,
  resetChosenTestDom,
  setupDataAttributeSelect,
  setupFormattedTextSelect,
  setupGeneratedAttributeSelect,
  setupOptionMetadataSelect,
  setupSingleSelect
} from "./helpers/chosen-test-utils.js";

describe("Chosen option rendering and metadata", () => {
  beforeEach(resetChosenTestDom);

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

  it("renders option labels from text content", () => {
    const select = setupFormattedTextSelect();

    select.chosen();

    openChosen("formatted-text");

    const result = getResultByText("Hungary");

    expect(result).not.toBeUndefined();
    expect(result.querySelector("span.country-label")).toBeNull();
    expect(result.textContent).toContain("Hungary");
  });

  it("carries option classes, styles, and copied data attributes to result items", () => {
    const select = setupOptionMetadataSelect();

    select.chosen({
      parser_config: {
        copy_data_attributes: true
      }
    });

    openChosen("option-metadata");

    const france = getResultByText("France");

    expect(france).not.toBeUndefined();
    expect(france.classList.contains("flag-fr")).toBe(true);
    expect(france.classList.contains("country-option")).toBe(true);
    expect(france.getAttribute("style")).toContain("font-weight");
    expect(france.getAttribute("data-country-code")).toBe("FR");
    expect(france.getAttribute("data-region")).toBe("EU");
  });

  it("keeps generated result data attributes when option data attributes are copied", () => {
    const select = setupGeneratedAttributeSelect();

    select.chosen({
      parser_config: {
        copy_data_attributes: true
      }
    });

    openChosen("generated-attributes");

    const hungary = getResultByText("Hungary");

    expect(hungary).not.toBeUndefined();
    expect(hungary.getAttribute("data-country-code")).toBe("HU");
    expect(hungary.getAttribute("data-option-array-index")).not.toBe("999");
    expect(hungary.getAttribute("data-value")).toBe("hu");
  });

  it("updates results after chosen:updated is dispatched", () => {
    const select = setupSingleSelect();

    select.chosen({ create_option: true, skip_no_results: true });

    select.insertAdjacentHTML("beforeend", `<option value="Spain">Spain</option>`);
    select.dispatchEvent(new Event("chosen:updated"));

    openChosen("country");

    expect(getResultByText("Spain")).not.toBeUndefined();
  });

});
