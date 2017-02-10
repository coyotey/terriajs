'use strict';

import {min as d3ArrayMin, max as d3ArrayMax} from 'd3-array';

import LineChart from './LineChart';
import BarChart from './BarChart';

const chartTypeHint = {
    line: LineChart,
    bar: BarChart
};

function determineChartType(state, hint=undefined){
    if (hint !== undefined && chartTypeHint[hint] !== undefined)
    {
        return chartTypeHint[hint];
    }
    
    // insert hack here for figuring out which type of chart datasets need
    try
    {
        const chartData = state.data;
        
        const points = chartData.map(cd => cd.points.length).reduce((a, b) => a + b);
        
        let domain = chartData.map(cd => cd.getDomain());

        if (domain.length > 1) {
            domain = domain.reduce((a, b) => {
                return {
                    x: [d3ArrayMin([a.x[0], b.x[0]]), d3ArrayMax([a.x[1], b.x[1]])],
                    y: [d3ArrayMin([a.y[0], b.y[0]]), d3ArrayMax([a.y[1], b.y[1]])]
                };
            });
        } else {
            domain = domain[0];
        }

        if (domain.x[0] instanceof Date) {
            const years = (domain.x[1].getTime() - domain.x[0].getTime()) / (3600 * 24 * 365.25 * 1000);
            
            const pointsPerYear = points / years;
            
            if (pointsPerYear < 1) {
                return BarChart;
            }
        }
    } catch(e) {
        console.error(e.stack);
    }
    
    // fall back to status quo for things we don't understand
    return LineChart;
}

module.exports = determineChartType;
