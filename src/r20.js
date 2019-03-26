const full = (typeof wor !== 'undefined' && wor.state == 'full');

// https://wiki.roll20.net/Sheet_Worker_Scripts
// For documentation.

if (full) {
    exports.on = function(event, fun) {
        console.log("Registering event on " + event);
    };
} else {
    exports.on = on;
}

if (full) {
    
} else {
    exports.getAttrs = getAttrs;
    exports.setAttrs = setAttrs;
    exports.getSectionIDs = getSectionIDs;
    exports.generateRowID = generateRowID;
    exports.removeRepeatingRow = removeRepeatingRow;
    exports.getTranslationByKey = getTranslationByKey;
    exports.getTranslationLanguage = getTranslationLanguage;
    exports.setDefaultToken = setDefaultToken;
}
