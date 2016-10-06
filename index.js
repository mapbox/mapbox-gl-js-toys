var mapboxgl = require('mapbox-gl');
var parseCSSColor = require('csscolorparser').parseCSSColor;
var deuteranopia = require('deuteranopia');
var valueMap = require('./value_map');
var chroma = require('chroma-js');

mapboxgl.accessToken = 'pk.eyJ1IjoidG1jdyIsImEiOiJIZmRUQjRBIn0.lRARalfaGHnPdRcc-7QZYQ';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v8', //stylesheet location
    center: [-74.50, 40], // starting position
    zoom: 9 // starting zoom
});

map.on('load', function() {
    var deuteranope = valueMap(map.getStyle(), function (value, valueSpec) {
        if (valueSpec.type === 'color') {
            var parsed = parseCSSColor(value);
            var simulation = deuteranopia(parsed);
            return 'rgba(' + simulation.concat(parsed[3])
                .map(function (num) {
                    return num.toFixed(2);
                }).join(',') + ')';
        } else {
            return value;
        }
    });

    var initialStyle = JSON.parse(JSON.stringify(map.getStyle()))

    var custom = function() {
        return valueMap(initialStyle, function (value, valueSpec) {
            var fn = new Function(['value'],
                document.getElementById('custom').value);
            if (valueSpec.type === 'color') {
                return fn(chroma(value));
            } else {
                return value;
            }
        });
    }

    var styles = {
        normal: map.getStyle(),
        deuteranope: deuteranope,
        custom: custom
    };

    document.getElementById('selector').addEventListener('change', function() {
        var style = typeof styles[this.value] === 'function' ?
            styles[this.value]() : styles[this.value];
        map.setStyle(style);
    });

    document.getElementById('run').addEventListener('click', function() {
        map.setStyle(styles.custom());
    });
});
