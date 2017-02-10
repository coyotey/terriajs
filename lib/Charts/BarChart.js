'use strict';

import {select as d3Select} from 'd3-selection';
import d3Sync from './d3Sync';

import defined from 'terriajs-cesium/Source/Core/defined';

import BaseChart from './BaseChart';

const barWidth = 6;

const BarChart = Object.assign({}, BaseChart, {
    renderChart(renderContext) {
        const {g, data, scales} = renderContext;
        
        // animations can kiss my ass
        
        d3Sync(g.selectAll('.line'), data, 'g', (dataline, datalines_count) => {
            dataline.attr('class', 'line')
                .attr('id', chartData => chartData.id)
                .each(function(chartData, chartDataIndex) {
                    const offset = (barWidth * datalines_count) / 2 - chartDataIndex * barWidth;
                    const sx = scales.x, sy = scales.y[chartData.units], color = defined(chartData.color) ? chartData.color : '#ffffff';
                    d3Sync(d3Select(this).selectAll('rect'), chartData.points, 'rect', datapoints => {
                        datapoints
                            .attr('x', p => sx(p.x) - offset)
                            .attr('y', p => sy(p.y))
                            .attr('width', barWidth)
                            .attr('height', p => sy(0) - sy(p.y))
                            .style('fill', color)
                            .style('stroke', 'none');
                    });
                });
        });
    },
    
    getXpadding(data) {
        return (barWidth * data.length) / 2;
    }
});

module.exports = BarChart;
