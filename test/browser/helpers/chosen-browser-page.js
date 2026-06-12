const path = require("node:path");

const chosenJsPath = path.resolve(__dirname, "../../../src/chosen.js");

function pageHtml(body) {
  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Chosen browser test</title>
      </head>
      <body>
        ${body}
      </body>
    </html>
  `;
}

function singleSelectHtml() {
  return pageHtml(`
    <label for="country">Country</label>
    <select id="country" data-placeholder="Choose a Country..." tabindex="1">
      <option value="" selected disabled hidden>Choose a Country...</option>
      <option value="United States">United States</option>
      <option value="United Kingdom">United Kingdom</option>
      <option value="Hungary">Hungary</option>
      <option value="Germany">Germany</option>
    </select>
  `);
}

async function loadFixture(page, html) {
  await page.setContent(html);
  await page.addScriptTag({ path: chosenJsPath });
}

async function initializeChosen(page, selector, options = {}) {
  await page.locator(selector).evaluate(
    (select, chosenOptions) => {
      select.chosen(chosenOptions);
    },
    options
  );
}

module.exports = {
  initializeChosen,
  loadFixture,
  pageHtml,
  singleSelectHtml
};
