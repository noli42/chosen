const { expect, test } = require("@playwright/test");
const {
  initializeChosen,
  loadFixture,
  pageHtml,
  singleSelectHtml
} = require("./helpers/chosen-browser-page.js");

test.describe("Chosen single select in browser", () => {
  test("exposes expanded and collapsed state on the visible trigger", async ({ page }) => {
    await loadFixture(page, singleSelectHtml());

    await initializeChosen(page, "#country", {
      create_option: true,
      skip_no_results: true
    });

    const trigger = page.locator("#country_chosen .chosen-single");

    await expect(trigger).toMatchAriaSnapshot(`
      - button /Choose a Country\\.\\.\\./ [expanded=false]
    `);

    await trigger.click();

    await expect(trigger).toMatchAriaSnapshot(`
      - button /Choose a Country\\.\\.\\./ [expanded=true]
    `);

    await page.keyboard.press("Escape");

    await expect(trigger).toMatchAriaSnapshot(`
      - button /Choose a Country\\.\\.\\./ [expanded=false]
    `);
  });

  test("exposes collapsed state after selecting an option", async ({ page }) => {
    await loadFixture(page, singleSelectHtml());

    await initializeChosen(page, "#country", {
      create_option: true,
      skip_no_results: true
    });

    const trigger = page.locator("#country_chosen .chosen-single");

    await trigger.click();
    await page.getByRole("option", { name: "Germany" }).click();

    await expect(trigger).toMatchAriaSnapshot(`
      - button /Germany/
    `);

    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("keeps keyboard focus usable after selecting with Enter", async ({ page }) => {
    await loadFixture(page, singleSelectHtml());

    await initializeChosen(page, "#country", {
      create_option: true,
      skip_no_results: true
    });

    const container = page.locator("#country_chosen");
    const input = page.locator("#country_chosen .chosen-search-input");

    await page.locator("#country_chosen .chosen-single").click();

    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");

    await expect(container).not.toHaveClass(/chosen-with-drop/);
    await expect(container).toHaveClass(/chosen-container-active/);

    await expect(input).toBeFocused();

    await page.keyboard.press("Space");

    await expect(container).toHaveClass(/chosen-with-drop/);
  });

  test("moves focus backward out of a single select after tabbing into it", async ({ page }) => {
    await loadFixture(page, pageHtml(`
      <button id="before">Before</button>
      <label for="country">Country</label>
      <select id="country" data-placeholder="Choose a Country...">
        <option value="" selected disabled hidden>Choose a Country...</option>
        <option value="United States">United States</option>
        <option value="United Kingdom">United Kingdom</option>
        <option value="Hungary">Hungary</option>
        <option value="Germany">Germany</option>
      </select>
      <button id="after">After</button>
    `));

    await initializeChosen(page, "#country", {
      create_option: true,
      skip_no_results: true
    });

    const before = page.locator("#before");
    const input = page.locator("#country_chosen .chosen-search-input");

    await before.focus();
    await page.keyboard.press("Tab");

    await expect(input).toBeFocused();

    await page.keyboard.press("Shift+Tab");

    await expect(before).toBeFocused();
  });

});
