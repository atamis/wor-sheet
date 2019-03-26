const elementify = require('elementify');
const mod = require('./mod.js');
const r20 = require('./r20.js');

console.log("Hello, world");

mod.hello();

r20.on("change:strength", function() {
    console.log("Strength changed");
});
