const config = {
  '.chosen-select': { create_option: true, skip_no_results: true },
  '.chosen-select-deselect': { allow_single_deselect: true },
  '.chosen-select-no-single': { disable_search_threshold: 10 },
  '.chosen-select-no-results': { no_results_text: 'Oops, nothing found!' },
  '.chosen-select-rtl': { rtl: true },
  '.chosen-select-width': { width: '95%' }
};

for (const selector in config) {
  const elements = document.querySelectorAll(selector);
  elements.forEach(element => {
    element.chosen(config[selector]);
  });
}