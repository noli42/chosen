import { beforeEach, describe, expect, it } from "vitest";
import {
  getResultsText,
  openChosen,
  resetChosenTestDom,
  setupSingleSelect,
  setupValueSearchSelect,
  typeSearch
} from "./helpers/chosen-test-utils.js";

describe("Chosen search and result filtering", () => {
  beforeEach(resetChosenTestDom);

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

  it("disables search for single select when disable_search_threshold is met", () => {
    const select = setupSingleSelect();

    select.chosen({ disable_search_threshold: 10 });

    const container = document.querySelector("#country_chosen");
    const input = container.querySelector(".chosen-search-input");

    expect(container.classList.contains("chosen-container-single-nosearch")).toBe(true);
    expect(input.readOnly).toBe(true);
  });
});
