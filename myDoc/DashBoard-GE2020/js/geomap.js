
var margin = {top: 10, right: 10, bottom: 10, left: 10},
		padding = {top: 10, right: 10, bottom: 10, left: 10},
		vizWidth = 660,
		vizHeight = 310,
		plotWidth = vizWidth - margin.left - margin.right,
		plotHeight = vizHeight - margin.top - margin.bottom,
		panelWidth = plotWidth - padding.left - padding.right,
		panelHeight = plotHeight - padding.top - padding.bottom;

var viz = d3.select(document.getElementById('geomap')).append("svg")
						.classed("viz",true)
    				.attr("width", vizWidth)
    				.attr("height", vizHeight);
// some information in text
	viz.append("text")
    .attr("x", 10)
    .attr("y", 3)
    .attr("dy", "0.71em")
    .attr("fill", "#000")
    .text("Singapore General Election Result in Districts")
    .style("font-size", "14px")
    .style("fill", "#000000");
  
     viz.append("text")
    .attr("x", 10)
    .attr("y", 38)
    .attr("dy", "0em")
    .style("font-size", "10px")
    .style("fill", "#000000")
    .text("This is a map shows the winning party of each district");
  
    viz.append("text")
    .attr("x", 10)
    .attr("y", 53)
    // .attr("dy", "1em")
    .style("font-size", "10px")

    // .style("font", "10px avenir")
    .style("fill", "#000000")
    .text("The deeper color indicates the more votes");
  
    // viz.append("text")
    // .attr("x", 30)
    // .attr("y", 202)
    // .attr("dy", "3em")
    // .style("font", "5px avenir")
    // .style("fill", "#000000")
    // .text("By HF")
    // .style("font-weight", "bold");

var plot = viz.append("g")
		.attr("class","plot")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var panel = plot.append("g")
		.attr("class","panel")
    .attr("transform", "translate(" + padding.left + "," + padding.top + ")");

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("display", "none");

//Important Functions
function centralPointx1(d) {
		
		var xPosition1 = d3.min(d.geometry.coordinates[0], function(d){ return d[0]; });
		// xPosition = d3.max(xPosition, function(d){ return d; });
		//var xValue = d3.max(xPosition);

    	// console.log(xPosition);

    	return xPosition1;
}
function centralPointx2(d) {
		
		var xPosition2 = d3.max(d.geometry.coordinates[0], function(d){ return d[0]; });
		// xPosition = d3.max(xPosition, function(d){ return d; });
		//var xValue = d3.max(xPosition);

    	// console.log(xPosition);

    	return xPosition2;
}

function centralPointy1(d) {

    	var yPosition1 = d3.min(d.geometry.coordinates[0], function(d){ return d[1]; });
    	// yPosition = d3.max(yPosition, function(d){ return d; });
    	//var yValue = d3.max(yPosition);

    	// console.log(yPosition);

    	return yPosition1;
}
function centralPointy2(d) {

    	var yPosition2 = d3.max(d.geometry.coordinates[0], function(d){ return d[1]; });
    	// yPosition = d3.max(yPosition, function(d){ return d; });
    	//var yValue = d3.max(yPosition);

    	// console.log(yPosition);

    	return yPosition2;
}

function drawTooltip(d) {
		console.log(d);
		var xPosition = d3.event.pageX;
    	var yPosition = d3.event.pageY;
    	console.log(xPosition, yPosition);
		d3.select("#tooltip")
			.classed("hidden",false)
			.style("left", xPosition + "px")
			.style("top", yPosition + "px")
			.text("Win by "+d.properties.win+" in "+d.properties.Etype+" constituency.");
}

function mouseout() {
	d3.select("#tooltip").classed("hidden", true);
	d3.select(this).classed("highlight",false)
}

// color function
// 2f589e PAP cb8050 WP
var color = d3.scaleOrdinal(['#2f589e','#cb8050']);

// new color set
var colorP = d3.rgb("#d65245");
var colorW = d3.rgb("#377eb8");



d3.json("./data/geomapTest.json", function(error, sg) {
		// use console to output error info when error shows up
		if (error)
			return console.error(error);
		console.log(sg.features);

		// define geo path generator
		var projection = d3.geoMercator().fitSize([panelWidth+40,panelHeight+20],sg),
				geoPath = d3.geoPath(projection);

		var areas = panel.selectAll("path")
										.data(sg.features)
										.enter()
										.append("path")
											.attr("d",geoPath)
											.attr("fill", function(d) {
												if (d.properties.win == "PAP")
													return colorP.darker(d.properties.darker*2.5);
												else
													return colorW.darker(d.properties.darker*2.5);
											})
											.style("stroke", "#ffffff80")
											.style("stroke-width", 0.5)
											// .classed("area", true)
											.on('mouseover', function(d){
												d3.select(this).classed("highlight", true);
												drawTooltip(d);
											})
									    	.on('mouseout', mouseout)
									    	;	

		
    	var testPoint1 = projection([103.760108, 1.379]);
    	var testPoint2 = projection([103.760108, 1.379]);
		
		panel.selectAll("text.label")
				.data(sg.features)
				.enter()
				.append("text")
				.attr("class", "label")
				.attr("x", function(d){
					if (d.geometry.type == "Polygon"){
						// console.log(centralPointx(d));
						testPoint1 = projection([centralPointx1(d), centralPointy1(d)]);
						testPoint2 = projection([centralPointx2(d), centralPointy2(d)]);
					}
					else {
						// console.log(centralPointx(d)[0]);
						testPoint1 = projection([centralPointx1(d)[0], centralPointy1(d)[0]]);
						testPoint2 = projection([centralPointx2(d)[0], centralPointy2(d)[0]]);
					}
					var pointx = (testPoint1[0]+testPoint2[0])/2;
					if (d.properties.name == "West Coast"){
						pointx = pointx - 60;
					}
					if (d.properties.name == "Holland-Bukit Timah"){
						pointx = pointx + 50;
					}
					if (d.properties.name == "Jurong"){
						pointx = pointx + 15;
					}
					if (d.properties.name == "Yio Chu Kang"){
						pointx = pointx + 15;
					}
					if (d.properties.name == "Marine Parade"){
						pointx = pointx + 25;
					}
					if (d.properties.name == "Pasir Ris-Punggol"){
						pointx = pointx + 10;
					}
					// console.log(testPoint[0]);
					return pointx;
				})
				.attr("y", function(d){
					if (d.geometry.type == "Polygon"){
						// console.log(centralPointy(d));
						testPoint1 = projection([centralPointx1(d), centralPointy1(d)]);
						testPoint2 = projection([centralPointx2(d), centralPointy2(d)]);
					}
					else {
						// console.log(centralPointy(d)[1]);
						testPoint1 = projection([centralPointx1(d)[1], centralPointy1(d)[1]]);
						testPoint2 = projection([centralPointx2(d)[1], centralPointy2(d)[1]]);
					}
					var pointy = (testPoint1[1]+testPoint2[1])/2;
					if (d.properties.name == "West Coast"){
						pointy = pointy + 60;
					}
					if (d.properties.name == "Holland-Bukit Timah"){
						pointy = pointy + 40;
					}
					if (d.properties.name == "Jurong"){
						pointy = pointy + 10;
					}
					if (d.properties.name == "Yio Chu Kang"){
						pointy = pointy + 10;
					}
					if (d.properties.name == "Marine Parade"){
						pointy = pointy + 30;
					}
					if (d.properties.name == "Jalan Besar"){
						pointy = pointy + 20;
					}
					if (d.properties.name == "Bishan-Toa Payoh"){
						pointy = pointy + 15;
					}
					if (d.properties.name == "Pasir Ris-Punggol"){
						pointy = pointy + 15;
					}
					// console.log(testPoint[1]);
					return pointy;
				})
				.style("font", "8px avenir")
    			.style("fill", "#000000")
    			.style("text-anchor", "middle")
    			.text(function(d){
					console.log(d.properties.name);
					return d.properties.name;
				});

		var legend = panel.selectAll(".legend")
			.data(sg.features)
			.enter()
			.append("g")
			.attr("class", "legend")
			.attr("transform", "translate(" + (panelWidth - 60) + "," + 20 + ")");

		legend.append("rect")
			.attr("x", 0)
			.attr("y", 0)
			.attr("width", 10)
			.attr("height", 10)
			.style("fill", "#d65245");

		legend.append("rect")
			.attr("x", 0)
			.attr("y", 15)
			.attr("width", 10)
			.attr("height", 10)
			.style("fill", "#377eb8");

		legend.append("text")
			.attr("x", 20)
			.attr("dy", "0.75em")
			.attr("Y", 30)
			.text("PAP")
			.style("font", "10px avenir")
    		.style("fill", "#000000");


		legend.append("text")
			.attr("x", 20)
			.attr("dy", "2.5em")
			.attr("Y", -90)
			.text("WP")
			.style("font", "10px avenir")
    		.style("fill", "#000000");

		legend.append("text")
			.attr("x", 0)
			.attr("y", -15)
			.text("Categories")
			.style("font", "10px avenir")
    		.style("fill", "#000000");

});
