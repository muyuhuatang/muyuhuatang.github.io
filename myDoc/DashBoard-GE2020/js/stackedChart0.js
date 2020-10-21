

			//Width and height
			var w0 = 240;
			var h0 = 130;

			//Original data
			var dataset = [
				{ c:'Aljunied',PAP: 57244, WP:85603 },
                { c:'Ang Mo Kio',PAP: 124430, RP: 48600},
                { c:'Bishan- Toa Payoh',PAP: 62853, SPP:30594 },
                { c:'Choa Chu Kang',PAP: 59462, PSP: 41942},
                { c:'East Coast',PAP: 61009, WP:53228 },
                { c:'Holland-Bukit Timah',PAP: 70963, SDP: 35972},
                { c:'Jalan Besar',PAP: 64522, PV:34185 },
                { c:'Jurong',PAP: 91692, RDU:31191 },
                { c:'Marine Parade',PAP: 74993, WP:54850 },
                { c:'Marsling-Yew Tee',PAP: 69722, SDP:40641 },
                { c:'Nee Soon',PAP: 86219, PSP:53070 },
                { c:'Pasir Ris-Punggol',PAP: 100772, SDA:37179,PV:19127 },
                { c:'Seng Kang',PAP: 55214, WP:60136 },
                { c:'Sembawang',PAP: 94068, NSP:45727 },
				{ c:'Tampines',PAP: 94551, WP:47819 },
				{ c:'Tanjong Pagar',PAP: 78079, PSP:45609 },
				{ c:'West Coast',PAP: 71545, PSP:66871 },
				
		
			];

			//Set up stack method
			var stack = d3.stack()
						  .keys([ "PAP", "RDU","RP","PV", "PSP","WP","NSP","SDA","SDP","SPP","PPP","Ind" ])
						  .order(d3.stackOrderDescending);  // <-- Flipped stacking order

			//Data, stacked
			var series = stack(dataset);
			console.log(series);

           

			//Set up scales
			var xScale = d3.scaleBand()
				//.domain(d3.range(dataset.length))
                .domain(dataset.map(function(d){return d.c;}))
                //.domain(['2001', '2006', '2011', '2015', '2020'])
				.rangeRound([0, w0])
				.paddingInner(0.2);
           
            var lalala = d3.scaleBand()
				.domain(d3.range(dataset.length))
                //.domain(dataset.map(function(d){return d.c;}))
                //.domain(['2001', '2006', '2011', '2015', '2020'])
				.rangeRound([0, w0])
				.paddingInner(0.2);
            
					
			var yScale = d3.scaleLinear()
				.domain([0,				
					d3.max(dataset, function(d) {
						return d.PAP + d.RP;
					})
				])
				.range([h0, 0]);  // <-- Flipped vertical scale
			
            const xAxis = d3.axisBottom(xScale);
                    
    		const yAxis = d3.axisLeft(yScale);
                    		
                    						
			//Easy colors accessible via a 10-step ordinal scale
			var colors = d3.scaleOrdinal(d3.schemeCategory10);
            var margin = {top: 55, right: 30, bottom: 40, left: 45};
            var fruits = [ "PAP", "RDU","RP","PV", "PSP","WP","NSP","SDA","SDP","SPP","PPP","Ind"];
		
			//Create SVG element
			var svg = d3.select(document.getElementById('chart0'))
						.append("svg")
						.attr("width", w0+margin.left+margin.right)
						.attr("height", h0+margin.top+margin.bottom)
						.append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");;
            
            

	
			// Add a group for each row of data
			var groups = svg.selectAll("g")
				.data(series)
				.enter()
				.append("g")
				.style("fill", function(d, i) {
					return colors(i);
				});
	
			// Add a rect for each data value
			var rects = groups.selectAll("rect")
				.data(function(d) { return d; })
				.enter()
				.append("rect")
				.attr("x", function(d, i) {
					return lalala(i);
				})
				.attr("y", function(d) {
					console.log(d[1]);
					return yScale(d[1]);  // <-- Changed y value
				})
				.attr("height", function(d) {
					//console.log(d);
					return yScale(d[0]) - yScale(d[1]);  // <-- Changed height value
				})
				.attr("width", xScale.bandwidth());
			

    		svg.append("g")
            		.attr("class", "y axis")
                    .attr("transform", "translate(0, 10)")
            		.call(yAxis);
            var la= h0 +10;

                    
            svg.append("g")
            		.attr("class", "x axis")
                    .attr("transform", "translate(0, " +la  +")")
            		.call(xAxis)
                    .selectAll("text")
                    .style("font-size", "5px")
		            .attr("dx", "-2em")
                    .attr("dy", "-0.0em")
                    .attr("transform", function(d) {
                return "rotate(-45)" 
                }) ;
 svg.append("svg:text")
        .attr("class", "title")
        .attr("x", +30)
        .attr("y", -38)
        .attr("font-size",12)
        .text("Voting situation in GRCs");
            
 

			
						