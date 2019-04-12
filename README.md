# wor-sheet

WoR Character Sheet for Roll20.

## Usage

Install packages and `gulp`.

```
npm install
npm install -g gulp-cli
```

To compile once, use the default task:

```
gulp
```

To compile whenever a file changes,

```
gulp watch
```

To see all the tasks, use

```
gulp -T
```

The base output (just the sheet, not a full HTML page) can be found in
`target/bare.html`, while the sheet in an HTML page can be found at
`target/full.html`.

See [Writing the Sheet](#writing-the-sheet) for information on the compilation
process, and see [Compatability Notes](#compatability-notes) for information on
how this sheet attempts to mirror Roll20's sheet environment.

## Writing the sheet

### HTML

HTML is compiled with
[`nunjucks`](https://mozilla.github.io/nunjucks/getting-started.html). The main
templates or "entrypoints" can be found in `templates/`, but you shouldn't need to edit the directly.
Both templates import `src/sheet.html.njk`, which in turn can import other
partials from the `src` directory, which is where you can put other
partial templates. The `.njk` extension is suggested but not required.

All HTML partial templates are in the `src/` directory, so

```
{% include "sheet.html.njk" %}
```

Processes then includes the file at `src/sheet.html.njk`.

### JS

Javascript is compiled with [`browserify`](http://browserify.org/) to manage
modules and `Terser` for transpilation and minification.

Browserify enables `require('module')` in the browser for both local and NPM
modules. To import local modules (for good code organization), you can use

```javascript
const mod = require('./mod.js');
```

To import the module at `src/mod.js`. Local modules are all relative to the
`src/` directory.

NPM modules are imported by their NPM name, so to import the `elementify`
module, first we need to install it with NPM

```
npm install elementify
```

(note that this should be a full dependency, not a development dependency)

Then, you can import it in your Javascript with

```
const elementify = require('elementify');
```

`npm install` automatically adds the dependency to `package.json`, and
Browserify bundles everything together into 1 Javascript file.

[Terser](https://www.npmjs.com/package/terser) is a transpiler for ES6 and a
minifier, which takes the bundled Javascript from Browserify and makes it smaller.

This compilation chain outputs to `target/partials/app.js`


### SASS

Uses [`node-sass`](https://github.com/sass/node-sass) to compile
[SASS](https://sass-lang.com/guide) to CSS. All `.scss` files in `src` are
compiled to equivalently named `.css` files in `target/`. The most
important is `src/style.scss`. SASS allows the use of partials. A preceding
underscore indicates a partial stylesheet that shouldn't be compiled to a
standalone CSS file. For example, `_partial.scss` can be imported with

```scss
@import 'partial';
```

This is relative to the `src` directory. Also note the lack of extension.


## Compatability Notes

Roll20 requires sheets be exactly 1 HTML file and 1 CSS file and nothing else,
so this project compiles all HTML and Javascript to a single HTML file, so this
compilation process inlines all Javascript. This is achieved by compiling
the Javascript first, then using `nunjucks` to import `target/partials/app.js`
and `target/partials/style.css` directly into the resulting file directly. CSS
is compiled separately. The `full.html` sheet links to it. The `bare.html` sheet
doesn't, because Roll20 strips out all `style` and `link` tags, so `style.css`
needs to be copied and pasted into the Roll20 interface.

Note that Roll20 prepends `sheet-` all non-permited class names. Permitted class
names start with `attr`, `roll`, or `repeating_`. To make Roll20-less
development easier, `full.html` includes Javascript which makes the same changes
to the sheet. Additionally note that Roll20 converts all `id` selectors found in
your stylesheets to class selectors, so this project is configured to do the
same, although somewhat crudely.

Note that, although a `r20` Javascript module has been supplied, it is currently
a very thin wrapper over Roll20's provided functions. At this time, it provides
no replacement code or similar shims.

# Authors

Andrew Amis, Jakob Rubin.

# License

GPL 3.0 or later.

