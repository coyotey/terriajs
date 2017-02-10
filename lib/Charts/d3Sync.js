"use strict";

function d3Sync(selection, data, append, callback)
{
    const rows = selection.data(data);
    rows.exit().remove();
    callback(rows.enter().append(append), data.length);
    callback(rows, data.length);
}

module.exports = d3Sync;
