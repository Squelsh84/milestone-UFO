queue()
    .defer(d3.csv, "data/scrub.csv")
    .await(makeGraphs);

function makeGraphs(error, scrubData) {
    var ndx = crossfilter(scrubData);

    //show_region_selector(ndx);

    show_country_sighting(ndx);

    show_shape_of_ufo(ndx);

    //show_ufo_year(ndx);

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
  var dim =    ndx.dimension(dc.pluck('country'));
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
    var dim =   ndx.dimension(dc.pluck('shape'));
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


    /*function show_ufo_year(ndx) {
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

*/


/*.function to refresh page when Refresh Charts buttons are clicked */

function refreshPage() {
    window.location.reload();
}