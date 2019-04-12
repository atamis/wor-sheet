exports.hello = function() {
    console.log("Hello from mod.js");
};

exports.walk = function walk(el, f) {
    f(el);

    const children = el.children;

    for(var i = 0; i < children.length; i++) {
        walk(children[i], f);
    }

};
