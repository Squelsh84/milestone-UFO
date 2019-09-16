queue()
    .defer(d3.csv, "data/scrub.csv")
    .await(makeGraphs);

function makeGraphs(error, scrubData) {
    var ndx = crossfilter(scrubData);

    //show_region_selector(ndx);

    show_country_sighting(ndx);

    show_shape_of_ufo(ndx);

    show_ufo_year(ndx);

    show_country_year(ndx);

    dc.renderAll();
}

function show_region_selector(ndx) {
    var dim = ndx.dimension(dc.pluck('datetime'));
    var group = dim.group();

    dc.selectMenu("#region-selector")
        .dimension(dim)
        .group(group)
}

function show_country_sighting(ndx) {
    var dim = ndx.dimension(dc.pluck('country'));
    var group = dim.group();


    dc.pieChart("#country")
        .dimension(dim)
        .group(group)
        .height(300)
        .width(650)
        .radius(150)
        .useViewBoxResizing(false)
        .transitionDuration(1500)
        .legend(dc.legend().x(0).y(0).itemHeight(16).gap(2));



}


function show_shape_of_ufo(ndx) {
    var dim = ndx.dimension(dc.pluck('shape'));
    var group = dim.group();


    dc.pieChart("#shape")
        .dimension(dim)
        .group(group)
        .height(300)
        .width(650)
        .radius(150)
        .useViewBoxResizing(false)
        .transitionDuration(1500)
        .legend(dc.legend().x(0).y(0).itemHeight(16).gap(2));



}


function show_ufo_year(ndx) {
    var dim = ndx.dimension(dc.pluck('country'));
    var group = dim.group();

    dc.barChart("#year")
        .width(800)
        .height(400)
        .margins({ top: 10, right: 50, bottom: 40, left: 50 })
        .dimension(dim)
        .group(group)
        .transitionDuration(1500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .xAxisLabel("Year")
        .yAxisLabel("Total")
        .yAxis().ticks(5);

}



// Composite Chart
function show_country_year(ndx) {
    var date_dim = ndx.dimension(dc.pluck('country'));

    function sightings_by_country(datetime) {
        return function (d) {
            if (d.datetime === datetime) {
                return +d.Number;
            }
            else {
                return 0;
            }
        };
    }
    var UnitedStatesSightingByYear = date_dim.group().reduceSum(sightings_by_country('United States'));

    var AustraliaSightingByYear = date_dim.group().reduceSum(sightings_by_country('Australia'));

    var GreatBritainSightingByYear = date_dim.group().reduceSum(sightings_by_country('Great Britain'));

    var CanadaSightingByYear = date_dim.group().reduceSum(sightings_by_country('Canada'));

    var RussiaSightingsByYear = date_dim.group().reduceSum(sightings_by_country('Russia'));

    var UnknownSightingsByYear = date_dim.group().reduceSum(sightings_by_country('Unknown'));

    var RestOfTheWorldSightingByYear = date_dim.group().reduceSum(sightings_by_country('Rest of the World'));

    var EuropeSightingByYear = date_dim.group().reduceSum(sightings_by_country('Europe'));

    var NewZealandSightingByYear = date_dim.group().reduceSum(sightings_by_country('New Zealand'));

    var TotalSightingByYear = date_dim.group();

    var compositeChart = dc.compositeChart('#composite-chart');

    compositeChart
        .width(1200)
        .height(500)
        .useViewBoxResizing(true)
        .dimension(date_dim)
        .x(d3.scale.linear().domain([1949, 2013]))
        .xAxisLabel("Year")
        .yAxisLabel("Sightings")
        .legend(dc.legend().x(80).y(20).itemHeight(13).gap(5))
        .renderHorizontalGridLines(true)

        .compose([
            dc.lineChart(compositeChart)
                .colors('red')
                .group(UnitedStatesSightingByYear, 'United States'),
            dc.lineChart(compositeChart)
                .colors('green')
                .group(AustraliaSightingByYear, 'Australia'),
            dc.lineChart(compositeChart)
                .colors('Violet')
                .group(CanadaSightingByYear, 'Canada'),
            dc.lineChart(compositeChart)
                .colors('aqua')
                .group(EuropeSightingByYear, 'Europe'),
            dc.lineChart(compositeChart)
                .colors('gold')
                .group(NewZealandSightingByYear, 'New Zealand'),
            dc.lineChart(compositeChart)
                .colors('aquaMarine')
                .group(RestOfTheWorldSightingByYear, 'Rest of the World'),
            dc.lineChart(compositeChart)
                .colors('crimson')
                .group(RussiaSightingsByYear, 'Russia'),
            dc.lineChart(compositeChart)
                .colors('khaki')
                .group(GreatBritainSightingByYear, 'Great Britain'),
            dc.lineChart(compositeChart)
                .colors('darkRed')
                .group(UnknownSightingsByYear, 'Unknown'),
            dc.lineChart(compositeChart)
                .dashStyle([5,])
                .colors('pink')
                .group(TotalSightingByYear, 'Total')
        ])
        .brushOn(false)
        .render();



    compositeChart.xAxis().tickFormat(function (v) { return v; });
}








/*.function to refresh page when Refresh Charts buttons are clicked */

function refreshPage() {
    window.location.reload();
}