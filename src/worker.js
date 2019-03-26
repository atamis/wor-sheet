const mod = require('./mod.js');
const r20 = require('./r20.js');

console.log("Hello from worker");

mod.hello();

r20.on("change:dexterity", () => {
    console.log("Dexterity changed");
});

onmessage = function(e) {
    console.log(["Worker recieved", e.data]);
};
