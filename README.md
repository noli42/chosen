# Chosen

[![Tests](https://github.com/noli42/chosen/actions/workflows/test.yml/badge.svg)](https://github.com/noli42/chosen/actions/workflows/test.yml)

Chosen is a lightweight JavaScript library for making long, unwieldy select boxes more user-friendly.

It enhances standard HTML `<select>` elements with a searchable, more usable interface while keeping the original form element intact.

Chosen has no jQuery dependency and does not require any other external JavaScript libraries. It is written in plain JavaScript and can be used directly in modern web projects.

For **downloads**, see:
https://github.com/noli42/chosen/releases

## Demo

A live demo is available on GitHub Pages:

[Open the demo](https://noli42.github.io/chosen)

## Usage

Include the JavaScript and CSS files, then call `chosen()` on a select element.

```html
<link rel="stylesheet" href="chosen.css">
<script src="chosen.js"></script>

<select id="country-select">
  <option value=""></option>
  <option value="hu">Hungary</option>
  <option value="de">Germany</option>
  <option value="fr">France</option>
</select>

<script>
  document.getElementById("country-select").chosen({
    search_contains: true
  });
</script>
```

## Usage with npm

```bash
npm install @noli42/chosen
```

Import the JavaScript, then import the CSS:

```js
import "@noli42/chosen";
import "@noli42/chosen/chosen.css";

const select = document.querySelector("#country-select");

window.Chosen.init(select, {
  search_contains: true
});
```

The original DOM API is also available:

```js
select.chosen({
  search_contains: true
});
```

## Usage with React

Chosen is a DOM-based select enhancement library, so initialize it after the `<select>` element has mounted. In React, that usually means calling it inside `useEffect`.

```jsx
import { useEffect, useRef } from "react";
import "@noli42/chosen";
import "@noli42/chosen/chosen.css";

export function ChosenSelect() {
  const selectRef = useRef(null);

  useEffect(() => {
    const select = selectRef.current;

    if (!select || !window.Chosen) {
      return;
    }

    window.Chosen.init(select, {
      search_contains: true
    });

    return () => {
      window.Chosen.destroy(select);
    };
  }, []);

  return (
    <select ref={selectRef}>
      <option value=""></option>
      <option value="hu">Hungary</option>
      <option value="de">Germany</option>
      <option value="fr">France</option>
    </select>
  );
}
```

For dynamic options, notify Chosen after React updates the `<option>` elements:

```jsx
useEffect(() => {
  if (!selectRef.current) {
    return;
  }

  selectRef.current.dispatchEvent(new Event("chosen:updated"));
}, [options]);
```

Chosen can be imported in server-rendered applications, but initialization still requires a browser DOM. Call `window.Chosen.init(...)` only on the client, for example inside `useEffect`.

### Chosen Credits

- Concept and development by [Patrick Filler](http://patrickfiller.com) for [Harvest](http://getharvest.com/)
- Design and CSS by [Matthew Lettini](http://matthewlettini.com/)
- 1.8.x and earlier maintained by [@pfiller](http://github.com/pfiller), [@kenearley](http://github.com/kenearley), [@stof](http://github.com/stof), [@koenpunt](http://github.com/koenpunt), and [@tjschuck](http://github.com/tjschuck)
- 2.0.x and later maintained by [@JJJ](http://github.com/JJJ) and contributors
- 3.0.x and later maintained by [@noli42](https://github.com/noli42) and contributors
- Chosen includes [contributions by many fine folks](https://github.com/harvesthq/chosen/contributors)
