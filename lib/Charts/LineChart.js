'use strict';

import {line as d3Line} from 'd3-shape';

import defined from 'terriajs-cesium/Source/Core/defined';

import Scales from './Scales';

import BaseChart from './BaseChart';


const LineChart = Object.assign({}, BaseChart, {
    renderChart(renderContext) {
        const {g, data, scales, t, gTransform} = renderContext;
        
        // Some axis animations need to be a little different if this is the first time we are showing the graph.
        // Assume it's the first time if we have no lines yet.
        const lines = g.selectAll('.line').data(data, d => d.id).attr('class', 'line');
        const isFirstLine = (!defined(lines.nodes()[0]));
        
        if (isFirstLine) {
            g.attr('transform', gTransform);
        } else {
            g.transition(t)
                .attr('transform', gTransform);
        }
            
        // Returns a path function which can be called with an array of points.
        function getPathForUnits(units) {
            return d3Line()
                // .curve(d3Shape.curveBasis)
                .x(d => scales.x(d.x))
                .y(d => scales.y[units](d.y));
                // NOTE: it was originally 'basic', which is not a interpolation
        }

        // Enter.
        // https://github.com/d3/d3/blob/master/CHANGES.md#selections-d3-selection
        // If there are undefined or null y-values, just ignore them. This works well for initial and final undefined values,
        // and simply interpolates over intermediate ones. This may not be what we want.
        lines.enter().append('path')
            .attr('class', 'line')
            .attr('d', line => getPathForUnits(line.units || Scales.unknownUnits)(line.points.filter(point => defined(point.y))))
            .style('fill', 'none')
            .style('opacity', 1e-6)
            .transition(t)
            .style('opacity', 1)
            .style('stroke', d => defined(d.color) ? d.color : '');

        // Mouse event.
        lines
            .on('mouseover', fade(g, 0.33))
            .on('mouseout', fade(g, 1));

        // Update.
        // Same approach to undefined or null y-values as enter.
        lines
            .transition(t)
            .attr('d', line => getPathForUnits(line.units || Scales.unknownUnits)(line.points.filter(point => defined(point.y))))
            .style('opacity', 1)
            .style('stroke', d => defined(d.color) ? d.color : '');

        // Exit.
        lines.exit()
            .transition(t)
            .style('opacity', 1e-6)
            .remove();

    }
});


// Returns an event handler for fading chart lines in or out.
function fade(d3Element, opacity) {
    return function(selectedLine) {
        d3Element.selectAll('.line')
            .filter(function(thisLine) {
                return thisLine.id !== selectedLine.id;
            })
            .transition()
            .style('opacity', opacity);
    };
}



module.exports = LineChart;
