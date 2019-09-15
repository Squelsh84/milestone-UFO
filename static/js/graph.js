queue()
    .defer(d3.json, "data/scrubbed.json")
    .await(makeGraphs);

function makeGraphs(error, scrubbedData) {
    var ndx = crossfilter(scrubbedData);

    
    dc.renderAll();
}







/*.function to refresh page when Refresh Charts buttons are clicked */

function refreshPage() {
    window.location.reload();
}