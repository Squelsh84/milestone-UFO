queue()
    .defer(d3.csv, "data/scrub.csv")
    .await(makeGraphs);

function makeGraphs(error, scrubData) {
    scrubData.forEach(function (d) {
        d.datetime = new Date(d.datetime);
        d.number = +d.number;
    })

    var ndx = crossfilter(scrubData);

    
    show_data_table(ndx);

    show_date_selector(ndx);

    show_country_selector(ndx);

    show_shape_selector(ndx);

    show_country_sighting(ndx);

    show_shape_of_ufo(ndx);

    show_ufo_shape(ndx);

    show_stacked_country(ndx);

    show_country_year(ndx);

    dc.renderAll();
}


// DataTable

function show_data_table(ndx) {

    var dim = ndx.dimension(function (d) { return d.dim; });
    var table = dc.dataTable("#dc-data-table")

        .dimension(dim)
        .group(function (d) { return ""; })
        .size(Infinity)

        .columns([
            function (d) { return d.datetime; },
            function (d) { return d.city; },
            function (d) { return d.shape; },
            function (d) { return d.comments; }
        ]).sortBy(function (d) {
            return d.datetime;
        })
        .order(d3.ascending)

        .on('preRender', update_offset)
        .on('preRedraw', update_offset)
        .on('pretransition', display);

    var ofs = 0, pag = 7;

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

    $('#next').on('click', function () {
        ofs += pag;
        update_offset();
        table.redraw();
    });
    /* Event Listener function that fires when "next" HTML btn is clicked */

    $('#prev').on('click', function () {
        ofs -= pag;
        update_offset();
        table.redraw();
    });

}

// Date Selector

function show_date_selector(ndx) {
    var dim = ndx.dimension(dc.pluck('datetime'));
    var group = dim.group();

    dc.selectMenu("#date-selector")
        .dimension(dim)
        .group(group)
}

// Country Selector
function show_country_selector(ndx) {
    var dim = ndx.dimension(dc.pluck('country'));
    var group = dim.group();

    dc.selectMenu("#country-selector")
        .dimension(dim)
        .group(group)
}

// Shape Selector

function show_shape_selector(ndx) {
    var dim = ndx.dimension(dc.pluck('shape'));
    var group = dim.group();

    dc.selectMenu("#shape-selector")
        .dimension(dim)
        .group(group)
}


//Country of Sighting and Amount.
//pie chart
function show_country_sighting(ndx) {
    var dim = ndx.dimension(dc.pluck('country'));
    var group = dim.group();


    dc.pieChart("#country")
        .dimension(dim)
        .group(group)
        .height(300)
        .radius(600)
        .innerRadius(50)
        .useViewBoxResizing(false)
        .transitionDuration(1500)
        

}

// UFO Shape
//pie chart
function show_shape_of_ufo(ndx) {
    var dim = ndx.dimension(dc.pluck('shape'));
    var group = dim.group();


    dc.pieChart("#shape")
        .dimension(dim)
        .group(group)
        .height(300)
        .radius(600)
        .innerRadius(50)
        .useViewBoxResizing(false)
        .transitionDuration(1500)
        
}


// Composite Chart
function show_country_year(ndx) {

    var date_dim = ndx.dimension(function (d) {
        return (d.datetime);
    });
    var minDate = date_dim.top(1)[0]['datetime'];
    var maxDate = date_dim.bottom(1)[0]['datetime'];

    function sightings_by_country(country) {
        return function (d) {
            return d.country === country ? parseInt(d.number, 10) : 0;
        };
    }
    var UnitedStatesSightingByYear = date_dim.group().reduceSum(sightings_by_country('United States'));

    var AustraliaSightingByYear = date_dim.group().reduceSum(sightings_by_country('Australia'));

    var GreatBritainSightingByYear = date_dim.group().reduceSum(sightings_by_country('Great Britain'));

    var CanadaSightingByYear = date_dim.group().reduceSum(sightings_by_country('Canada'));

    var BahamasSightingsByYear = date_dim.group().reduceSum(sightings_by_country('Bahamas'));

    var BrazilSightingsByYear = date_dim.group().reduceSum(sightings_by_country('Brazil'));

    var MexicoSightingByYear = date_dim.group().reduceSum(sightings_by_country('Mexico'));

    var DenmarkSightingByYear = date_dim.group().reduceSum(sightings_by_country('Denmark'));

    var HawaiiSightingByYear = date_dim.group().reduceSum(sightings_by_country('Hawaii'));

    var TotalSightingByYear = date_dim.group();

    var compositeChart = dc.compositeChart('#composite-chart');

    compositeChart
        .width(1200)
        .height(500)
        .useViewBoxResizing(true)
        .dimension(date_dim)
        .x(d3.time.scale().domain([new Date(maxDate), new Date(minDate)]))
        .xAxisLabel("Date")
        .yAxisLabel("Sightings")
        .legend(dc.legend().x(80).y(20).itemHeight(13).gap(5))
        .mouseZoomable(true)
        .renderLabel(true)

        .compose([
            dc.lineChart(compositeChart)
                .colors('red')
                .group(UnitedStatesSightingByYear, 'United States'),
            dc.lineChart(compositeChart)
                .colors('orange')
                .group(MexicoSightingByYear, 'Mexico'),
            dc.lineChart(compositeChart)
                .colors('green')
                .group(AustraliaSightingByYear, 'Australia'),
            dc.lineChart(compositeChart)
                .colors('Violet')
                .group(CanadaSightingByYear, 'Canada'),
            dc.lineChart(compositeChart)
                .colors('aquaMarine')
                .group(DenmarkSightingByYear, 'Denmark'),
            dc.lineChart(compositeChart)
                .colors('purple')
                .group(BahamasSightingsByYear, 'Bahamas'),
                dc.lineChart(compositeChart)
                .colors('brown')
                .group(HawaiiSightingByYear, 'Hawaii'),
            dc.lineChart(compositeChart)
                .colors('blue')
                .group(GreatBritainSightingByYear, 'Great Britain'),
            dc.lineChart(compositeChart)
                .colors('darkRed')
                .group(BrazilSightingsByYear, 'Brazil'),
            dc.lineChart(compositeChart)
                .dashStyle([4,])
                .colors('indigo')
                .group(TotalSightingByYear, 'Total')
        ])
        .brushOn(false)
        .render();


    dc.renderAll();
    compositeChart.xAxis().tickFormat(function (v) { return v; });
}

//bar chart
function show_ufo_shape(ndx) {
    var dim = ndx.dimension(dc.pluck('state'));
    var group = dim.group();

    

    dc.pieChart("#state-barchart")
    .dimension(dim)
    .group(group)
    .height(300)
    .radius(400)
    .innerRadius(50)
    .useViewBoxResizing(false)
    .transitionDuration(1500)
    .legend(dc.legend().x(80).y(0).itemHeight(16).gap(2));

}

/**
 * Stacked Barchart with countries and Shape of object 
*/
function show_stacked_country(ndx) {

    function typeByShape(dimension, shape) {
        return dimension.group().reduce(
            function (p, v) {
                p.total++;
                if (v.shape == shape) {
                    p.match++;
                }
                return p;
            },
            function (p, v) {
                p.total--;
                if (v.shape == shape) {
                    p.match--;
                }
                return p;
            },
            function () {
                return { total: 0, match: 0 };
            }
        );
    }
    var shape_dim = ndx.dimension(dc.pluck('country'));
    var lightBySight = typeByShape(shape_dim, "Light");
    var triangleBySight = typeByShape(shape_dim, "Triangle");
    var unknownBySight = typeByShape(shape_dim, "Unknown");
    var otherBySight = typeByShape(shape_dim, "Other");
    var diskBySight = typeByShape(shape_dim, "Disk");
    var sphereBySight = typeByShape(shape_dim, "Sphere");
    var circleBySight = typeByShape(shape_dim, "Circle");
    var fireballBySight = typeByShape(shape_dim, "Fireball");
    var cigarBySight = typeByShape(shape_dim, "Cigar");
    var cylinderBySight = typeByShape(shape_dim, "Cylinder");
    var ovalBySight = typeByShape(shape_dim, "Oval");
    var eggBySight = typeByShape(shape_dim, "Egg");
    var formationBySight = typeByShape(shape_dim, "Formation");
    var rectangleBySight = typeByShape(shape_dim, "Rectangle");
    var diamondBySight = typeByShape(shape_dim, "Diamond");




    dc.barChart("#stacked-chart")
        .width(500)
        .height(300)
        .useViewBoxResizing(true)
        .dimension(shape_dim)
        .group(lightBySight, "Light")
        .stack(triangleBySight, "Triangle")
        .stack(unknownBySight, "Unknown")
        .stack(otherBySight, "Other")
        .stack(diskBySight, "Disk")
        .stack(sphereBySight, "Sphere")
        .stack(circleBySight, "Cirlce")
        .stack(fireballBySight, "Fireball")
        .stack(cigarBySight, "Cigar")
        .stack(cylinderBySight, "Cylinder")
        .stack(ovalBySight, "Oval")
        .stack(eggBySight, "Egg")
        .stack(formationBySight, "Formation")
        .stack(rectangleBySight, "Rectangle")
        .stack(diamondBySight, "Diamond")

        .valueAccessor(function(d) {
            if (d.value.total > 0) {
                return (d.value.match); 
            }
            else {
                return 0;
            }
        })

        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Country")
        .yAxisLabel("Shape")
        .legend(dc.legend().x(250).y(0).itemHeight(10).gap(5));

}


/* function to refresh page when Refresh Charts buttons are clicked */

function refreshPage() {
    window.location.reload();
}


// Sidebar Collapse

$(document).ready(function () {
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });
});


// Back to top btn
let btn = $('#back-to-top' );

$(window).scroll(() => {if ($(window).scrollTop() > 300) {
    btn.addClass('show');
  } else {
    btn.removeClass('show');
  }
});

btn.on('click', (e) => {
  e.preventDefault();
  $('html, body').animate({scrollTop:0}, '300');
});



// Leaflet Map

var mapOptions = {
    center: [40.4168, -3.7038],
    zoom: 1,
    minZoom: 2,
    maxZoom: 18,
    maxBounds: [
        [-75, -190],
        [90, 190]
    ],
    maxBoundsViscosity: 0.5,
};

var map = L.map('map', mapOptions)


L.tileLayer('https://api.maptiler.com/maps/darkmatter/{z}/{x}/{y}.png?key=wIh6HMrA9Fl35sbRhW6D', {
    attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">© MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>',
}).addTo(map);

// Leaflet Icon
var myIcon = L.icon({
    iconUrl: 'static/images/space.png',
    iconSize: [30, 25],
    iconAnchor: [25, 16]
});

function onEachFeature(feature, layer) {
    layer.bindPopup(feature.properties.city);
}

var sightings = L.geoJson(myGeojsonData, {
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
            icon: myIcon
        })
    },
    onEachFeature: onEachFeature
}).addTo(map);



