var spec = require('mapbox-gl-style-spec');

function valueMap(stylesheet, callback) {
    var clone = JSON.parse(JSON.stringify(stylesheet));
    clone.layers.forEach(function (layer) {
        var groups = layer.ref ? ['paint'] : ['layout', 'paint'];
        var layerType = layer.ref ? clone.layers.filter(function (l) {
            return l.id === layer.ref;
        })[0].type : layer.type;
        groups.forEach(function (valueGroup) {
            for (var prop in layer[valueGroup]) {
                var value = layer[valueGroup][prop];
                var valueSpec = spec.v8[valueGroup + '_' + layerType][prop];
                if (valueSpec.function && !Array.isArray(value) && typeof value === 'object') {
                    value.stops.forEach(function (stop) {
                        stop[1] = callback(stop[1], valueSpec);
                    });
                } else {
                    layer[valueGroup][prop] = callback(value, valueSpec);
                }
            }
        });
    });
    return clone;
}

module.exports = valueMap;
