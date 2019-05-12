const elementify = require('elementify');
const mod = require('./mod.js');
const r20 = require('./r20.js');

console.log("Hello, world");

mod.hello();

function validClass(cls) {
    return cls.startsWith("attr")
        || cls.startsWith("roll")
        || cls.startsWith("repeating");
}

function sheetifyClasses(el) {
    const classes = el.classList;

    for(var i = 0; i < classes.length; i++) {
        const cls = classes[i];
        if (!validClass(cls)) {
            const newClass = "sheet-" + cls;
            el.classList.replace(cls, newClass);
        }
    }
}

if (r20.full) {
    mod.walk(document.getElementById("full-sheet"), sheetifyClasses);
    //mod.walk(document.getElementById("full-sheet"), console.log);
}

r20.on("change:strength", function() {
    console.log("Strength changed");
});

r20.on("sheet:opened", function() {
    // Maybe update more than that? Idk
    var default_attr = {};
    var sheet_values = r20.getAttrs(["totalHP"], function(values) { 
        default_attr["bar1_value"] = 0;
        default_attr["bar1_max"] = values.totalHP;
    })
});