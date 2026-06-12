import { beforeEach, describe, expect, it } from "vitest";
import {
  chosenContainerId,
  resetChosenTestDom,
  setupMultipleSelect,
  setupSingleSelect
} from "./helpers/chosen-test-utils.js";

describe("Chosen initialization and lifecycle", () => {
  beforeEach(resetChosenTestDom);

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

  it("initializes a multiple select", () => {
    const select = setupMultipleSelect();

    select.chosen({ create_option: true, skip_no_results: true });

    const container = document.querySelector(`#${chosenContainerId("countries")}`);

    expect(container).not.toBeNull();
    expect(container.classList.contains("chosen-container-multi")).toBe(true);
    expect(container.querySelector(".chosen-choices")).not.toBeNull();
  });

  it("uses custom width option", () => {
    const select = setupSingleSelect();

    select.chosen({ width: "95%" });

    const container = document.querySelector(`#${chosenContainerId("country")}`);

    expect(container.style.getPropertyValue("--chosen-width")).toBe("95%");
  });

  it("inherits select classes when inherit_select_classes is enabled", () => {
    const select = setupSingleSelect();

    select.classList.add("extra-select-class");
    select.chosen({ inherit_select_classes: true });

    const container = document.querySelector(`#${chosenContainerId("country")}`);

    expect(container.classList.contains("extra-select-class")).toBe(true);
  });

  it("destroys the chosen instance and restores the original select class", () => {
    const select = setupSingleSelect();

    select.chosen({ create_option: true, skip_no_results: true });

    expect(document.querySelector(`#${chosenContainerId("country")}`)).not.toBeNull();
    expect(select.classList.contains("chosen-original-select")).toBe(true);

    select.chosen("destroy");

    expect(document.querySelector(`#${chosenContainerId("country")}`)).toBeNull();
    expect(select.__chosen_instance).toBeUndefined();
    expect(select.classList.contains("chosen-original-select")).toBe(false);
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
