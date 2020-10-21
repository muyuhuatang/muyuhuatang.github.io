			//Width and height
			var w1 = 240;
			var h1 = 130;

			//Original data
			var dataset1 = [
				
				{ c:'Bukit Batok',PAP: 15476, SDP:12764 },
                { c:'Bukit Panjang',PAP: 18070, SDP:15556},
                { c:'Hong Kah North',PAP: 16333, PSP:10452 },
                { c:'Hougang',PAP: 9776, WP:15416},
                { c:'Kebun Baru',PAP: 13284, PSP:7812},
                { c:'MacPherson',PAP: 70963, SDP: 35972},
                { c:'Marymount',PAP: 18983, PPP:7477 },
                { c:'Mountbatten',PAP: 16227, PV:5748 },
                { c:'Pioneer',PAP: 14571, PSP:8285,Ind:654},
                { c:'Potong Pasir',PAP: 11232, SDP:7275 },
                { c:'Punggol West',PAP: 15637, WP:10012 },
                { c:'Radin Mas',PAP: 16834, RP:5905 },
                { c:'Yio Chu Kang',PAP: 14756, PSP:9500 },
                { c:'Yuhua',PAP: 14111, SDP:5894 },
		
			];

			//Set up stack method
			var stack1 = d3.stack()
						  .keys([ "PAP", "RDU","RP","PV", "PSP","WP","NSP","SDA","SDP","SPP","PPP","Ind" ])
						  .order(d3.stackOrderDescending);  // <-- Flipped stacking order

			//Data, stacked
			var series1 = stack(dataset1);
			console.log(series1);

           

			//Set up scales
			var xScale1 = d3.scaleBand()
				//.domain(d3.range(dataset1.length))
                .domain(dataset1.map(function(d){return d.c;}))
                //.domain(['2001', '2006', '2011', '2015', '2020'])
				.rangeRound([0, w1])
				.paddingInner(0.2);
           
            var lalala1 = d3.scaleBand()
				.domain(d3.range(dataset1.length))
                //.domain(dataset1.map(function(d){return d.c;}))
                //.domain(['2001', '2006', '2011', '2015', '2020'])
				.rangeRound([0, w1])
				.paddingInner(0.2);
            
					
			var yScale1 = d3.scaleLinear()
				.domain([0,				
					d3.max(dataset1, function(d) {
						return 173030;
					})
				])
				.range([h1, 0]);  // <-- Flipped vertical scale
			
            const xAxis1 = d3.axisBottom(xScale1);
                    
    		const yAxis1 = d3.axisLeft(yScale1);
                    		
                    						
			//Easy colors accessible via a 10-step ordinal scale
			var colors1 = d3.scaleOrdinal(d3.schemeCategory10);
            var margin1 = {top: 55, right: 30, bottom: 40, left: 45};
            var fruits1 = [ "PAP", "RDU","RP","PV", "PSP","WP","NSP","SDA","SDP","SPP","PPP","Ind"];
		
			//Create SVG element
			var svg1 = d3.select(document.getElementById('chart1'))
						.append("svg")
						.attr("width", w1+margin1.left+margin1.right)
						.attr("height", h1+margin1.top+margin1.bottom)
						.append("g")
                        .attr("transform", "translate(" + margin1.left + "," + margin1.top + ")");;

	
			// Add a group for each row of data
			var groups1 = svg1.selectAll("g")
				.data(series1)
				.enter()
				.append("g")
				.style("fill", function(d, i) {
					return colors1(i);
				});
	
			// Add a rect for each data value
			var rects1 = groups1.selectAll("rect")
				.data(function(d) { return d; })
				.enter()
				.append("rect")
				.attr("x", function(d, i) {
					return lalala1(i);
				})
				.attr("y", function(d) {
					console.log(d[1]);
					return yScale1(d[1]);  // <-- Changed y value
				})
				.attr("height", function(d) {
					//console.log(d);
					return yScale1(d[0]) - yScale1(d[1]);  // <-- Changed height value
				})
				.attr("width", xScale1.bandwidth());
			

    		svg1.append("g")
            		.attr("class", "y axis")
                    .attr("transform", "translate(0, 10)")
            		.call(yAxis1);
            var la1= h1 +10;

                    
            svg1.append("g")
            		.attr("class", "x axis")
                    .attr("transform", "translate(0, " +la  +")")
            		.call(xAxis1)
                    .selectAll("text")
                    .style("font-size", "5px")
		            .attr("dx", "-2em")
                    .attr("dy", "-0.0em")
                    .attr("transform", function(d) {
                return "rotate(-45)" 
                }) ;

            
            // add legend  
            var legend1 = svg1.append('g')
                .attr('class', 'legend')
                .attr('transform', 'translate(' + ( w1-20) + ', 0)');

            legend1.selectAll('rect')
                .data(fruits)
                .enter()
                .append('rect')
                .attr('x', -10)
                .attr('y', function(d, i){
                    return i * 11-23 ;
                })
                .attr('width', 7)
                .attr('height', 7)
                .attr('fill', function(d, i){
                    return colors1(i);
                });
            
            legend1.selectAll('text')
                .data(fruits1)
                .enter()
                .append('text')
                .text(function(d){
                    return d;
                })
                .attr('x', 10)
                .attr('y', function(d, i){
                    return i * 11+1.8-20;
                })
                .attr('text-anchor', 'start')
		.style("font-size", "6px")
                .attr('alignment-baseline', 'hanging');
svg1.append("svg:text")
        .attr("class", "title")
        .attr("x", +30)
        .attr("y", -38)
        .attr("font-size",12)
        .text("Voting situation in SMCs");
			
