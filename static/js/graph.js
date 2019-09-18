queue()
    .defer(d3.csv, "data/scrub.csv")
    .await(makeGraphs);

function makeGraphs(error, scrubData) {
   
    var ndx = crossfilter(scrubData);

     show_ufo_shape(ndx);

    //show_region_selector(ndx);

    //show_data_table(ndx);

    //show_stacked_country(ndx);

    show_country_sighting(ndx);

    show_shape_of_ufo(ndx);

    show_ufo_year(ndx);

    show_country_year(ndx);

    dc.renderAll();
}



// DataTable

function show_data_table(ndx) {

    var dim = ndx.dimension(function(d) { return d.dim; });
    var table = dc.dataTable("#dc-data-table")
    
           .dimension(dim)
           .group(function(d) { return ""; })
           .size(Infinity)

        .columns([
            function (d) { return d.datetime; },
            function (d) { return d.city; },
            function (d) { return d.country; },
            function (d) { return d.shape; },
            function (d) { return d.comments; },
        ]).sortBy(function(d) {
            return d.datetime; 
        })
        .order(d3.ascending)

        .on('preRender', update_offset)
        .on('preRedraw', update_offset)
        .on('pretransition', display);
        
            var ofs = 0, pag = 10;

    function update_offset() {
        var totFilteredRecs = ndx.groupAll().value();
        var end = ofs + pag > totFilteredRecs ? totFilteredRecs : ofs + pag;
        ofs = ofs >= totFilteredRecs ? Math.floor((totFilteredRecs - 1) / pag) * pag : ofs;
        ofs = ofs < 0 ? 0 : ofs;
        table.beginSlice(ofs); 
        table.endSlice(ofs + pag);
        
}

function display() {
        var totFilteredRecs = ndx.groupAll().value();
        var end = ofs + pag > totFilteredRecs ? totFilteredRecs : ofs + pag;
        d3.select('#begin')
            .text(end === 0 ? ofs : ofs + 1);
        d3.select('#end')
            .text(end);
        d3.select('#last')
            .attr('disabled', ofs - pag < 0 ? 'true' : null);
        d3.select('#next')
            .attr('disabled', ofs + pag >= totFilteredRecs ? 'true' : null);
        d3.select('#size').text(totFilteredRecs);
        if (totFilteredRecs != ndx.size()) {
            d3.select('#totalsize').text("(filtered Total: " + ndx.size() + " )");
        }
        else {
            d3.select('#totalsize').text('');
        }
    }

    $('#next').on('click', function() {
        ofs += pag;
        update_offset();
        table.redraw();
    });
    /* Event Listener function that fires when "next" HTML btn is clicked */  


    $('#prev').on('click', function() {
        ofs -= pag;
        update_offset();
        table.redraw();
    });

}


function show_region_selector(ndx) {
    var dim = ndx.dimension(dc.pluck('datetime'));
    var group = dim.group();

    dc.selectMenu("#region-selector")
        .dimension(dim)
        .group(group)
}


//Country of Sighting and Amount.

function show_country_sighting(ndx) {
    var dim = ndx.dimension(dc.pluck('country'));
    var group = dim.group();


    dc.pieChart("#country")
        .dimension(dim)
        .group(group)
        .height(300)
        .width(650)
        .innerRadius(10)
        .radius(150)
        .useViewBoxResizing(false)
        .transitionDuration(1500)
        .legend(dc.legend().x(0).y(0).itemHeight(16).gap(2));

}

// UFO Shape

function show_shape_of_ufo(ndx) {
    var dim = ndx.dimension(dc.pluck('shape'));
    var group = dim.group();


    dc.pieChart("#shape")
        .dimension(dim)
        .group(group)
        .height(300)
        .width(650)
        .innerRadius(10)
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
        .yAxis().ticks(8);

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

// Stacked Barchart of Country and Types of UFO.


function show_stacked_country(ndx) {

    function typeByShape(dimension, shape) {
        return dimension.group().reduce(
            function(p, v) {
                p.total++;
                if (v.Type == type) {
                    p.match++;
                }
                return p;
            },
            function(p, v) {
                p.total--;
                if (v.Type == type) {
                    p.match--;
                }
                return p;
            },
            function() {
                return { total: 0, match: 0 };
            }
        );
    }

    var dim = ndx.dimension(dc.pluck('country'));
    var lightBySight = typeByShape(dim, "Light" );
    var triangleBySight = typeByShape(dim,"triangle")

    














    dc.barChart("#stacked-chart")
    .width(500)
    .height(500)
    .useViewBoxResizing(true)
    .dimension(dim)
    .group(lightBySight, "light")
    .stack(triangleBySight, "triangle")

    .x(d3.scale.ordinal())
    .xUnits(dc.units.ordinal)
    .xAxisLabel("Country")
    .yAxisLabel("Shape")
    .legend(dc.legend().x(420).y(0).itemHeight(15).gap(5));
    
}




/* shape of ufo barchart*/

function show_ufo_shape(ndx) {
    var dim = ndx.dimension(dc.pluck('shape'));
    var group = dim.group();

    dc.barChart("#shape-barchart")
        .width(1200)
        .height(400)
        .margins({ top: 10, right: 50, bottom: 40, left: 50 })
        .dimension(dim)
        .group(group)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .xAxisLabel("Year")
        .yAxisLabel("Total")
        .yAxis().ticks(10);

}
















/*.function to refresh page when Refresh Charts buttons are clicked */

function refreshPage() {
    window.location.reload();
}