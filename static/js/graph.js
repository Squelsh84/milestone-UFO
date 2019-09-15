queue()
    .defer(d3.json, "data/report.json")
    .await(makeGraphs);

function makeGraphs(error, reportData) {
    var ndx = crossfilter(reportData);

    show_region_selector(ndx);
    show_best_in_europe(ndx);

    show_data_table(ndx);

    show_country_freedom(ndx);

    show_country_chart(ndx);
   
    show_region_chart(ndx);
    
    dc.renderAll();
}


function show_region_selector(ndx) {
    var dim = ndx.dimension(dc.pluck('Region'));
    var group = dim.group();

    dc.selectMenu("#region-selector")
        .dimension(dim)
        .group(group)
}

function show_data_table(ndx) {

    var dim = ndx.dimension(function(d) { return d.dim; });
    var table = dc.dataTable("#dc-data-table")
    
           .dimension(dim)
           .group(function(d) { return ""; })
           .size(Infinity)

        .columns([
            function (d) { return d.Country; },
            function (d) { return d.Region; },
            function (d) { return d.Ladder; },
            function (d) { return d.SDofLadder; },
            function (d) { return d.Positiveaffect; },
            function (d) { return d.Negativeaffect; },
            function (d) { return d.Socialsupport; },
            function (d) { return d.Freedom; },
            function (d) { return d.Corruption; },
            function (d) { return d.Generosity; },
            function (d) { return d.GDP; },
            function (d) { return d.lifeexpectancy; }
        ]).sortBy(function(d) {
            return d.Ladder; 
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



function show_country_chart(ndx) {
  var dim = ndx.dimension(dc.pluck('Country'));
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




function show_region_chart(ndx) {
    var dim = ndx.dimension(dc.pluck('Region'));
    var group = dim.group();
    
    
     dc.pieChart("#region")
        .dimension(dim)
        .group(group)
        .height(300)
        .width(650)
        .radius(150)
        .useViewBoxResizing(false)
        .transitionDuration(1500)
        .legend(dc.legend().x(0).y(0).itemHeight(16).gap(2));

    

}


// Europe Chart

function show_best_in_europe(ndx) {
    var region_dim =ndx.dimension(dc.pluck('Region'))
    var best_to_live = region_dim.group().reduceSum(dc.pluck('Western Europe'))

    dc.barChart("#europe")
        .width(1200)
        .height(400)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(region_dim)
        .group(best_to_live)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Regions")
        .yAxisLabel("Freedom")
        .yAxis().ticks(15);

}

function show_country_freedom(ndx) {
    var region_dim =ndx.dimension(dc.pluck('Region'));
    var freedom_of_living = region_dim.group().reduceSum(dc.pluck('Freedom'));

    

    dc.barChart("#freedom")
        .width(1200)
        .height(400)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(region_dim)
        .group(freedom_of_living)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Regions")
        .yAxisLabel("Freedom")
        .yAxis().ticks(15);

}

























/*.function to refresh page when Refresh Charts buttons are clicked */

function refreshPage() {
    window.location.reload();
}