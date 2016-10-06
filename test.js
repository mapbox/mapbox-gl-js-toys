var valueMap = require('./value_map');
var parseCSSColor = require('csscolorparser').parseCSSColor;
var test = require('tap').test;

test('propertyMap', function(t) {
    var basic = require('./basic-v8.json');
    var mapped = valueMap(basic, function(value, valueSpec) {
        if (valueSpec.type === 'color') {
            var parsed = parseCSSColor(value);
        }
    });
    t.end();
});
