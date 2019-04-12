const full = (typeof wor !== 'undefined' && wor.state == 'full');

exports.full = full;

const taglog = (...args) => (data) => {
    console.log.apply(null, args.concat([data]));
    return data;
};


// https://wiki.roll20.net/Sheet_Worker_Scripts
// For documentation.

if (full) {
    exports.on = taglog('r20.on');
    exports.getAttrs = taglog('r20.getAttrs');
    exports.setAttrs = taglog('r20.setAttrs');
    exports.getSectionIDs = taglog('r20.getSectionIDs');
    exports.generateRowID = taglog('r20.generateRowID');
    exports.removeRepeatingRow = taglog('r20.removeRepeatingRow');
    exports.getTranslationByKey = taglog('r20.getTranslationByKey');
    exports.getTranslationLanguage = taglog('r20.getTranslationLanguage');
    exports.setDefaultToken = taglog('r20.setDefaultToken');
} else {
    exports.on = on;
    exports.getAttrs = getAttrs;
    exports.setAttrs = setAttrs;
    exports.getSectionIDs = getSectionIDs;
    exports.generateRowID = generateRowID;
    exports.removeRepeatingRow = removeRepeatingRow;
    exports.getTranslationByKey = getTranslationByKey;
    exports.getTranslationLanguage = getTranslationLanguage;
    exports.setDefaultToken = setDefaultToken;
}
