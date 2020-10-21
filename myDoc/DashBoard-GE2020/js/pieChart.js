
var piecolors = d3.scale.category20c();

var piew = 420,
    pieh = 250,
    pier = (Math.min(piew, pieh) - 50) / 2;
// var width = 1200
d3.csv('', function(error, data) {
    data =  [
              {percent: 61.28,value: 1317338, shortname:'PAP',name: 'PAP', detail: {'Aljunied':57244, 'Ang Mo Kio':124430,'Bishan- Toa Payoh': 62853,'Choa Chu Kang': 59462,'East Coast':61009,'Holland-Bukit Timah':70963,'Jalan Besar':64522,'Jurong':91692,'Marine Parade':74993, 'Marsling-Yew Tee':69722,'Nee Soon':86219,'Pasir Ris-Punggol':100772,'Seng Kang':55214,'Sembawang':94068,'Tampines':94551,'Tanjong Pagar':78079,'West Coast':71545 } },
              {percent: 4.35,value: 93546, shortname:'NSP',name: 'National Solidarity Party',detail: {'Sembawang': 45727,'Tampines':47819}},
              {percent: 2.48,value: 53312, shortname:'PV',name: 'Peoples Voice',detail: {'Jalan Besar': 34185,'Pasir Ris-Punggol': 19127 }},
              {percent: 9.65,value: 207492, shortname:'PSP',name: 'Progress Singapore Party',detail: {'Choa Chu Kang': 41942,'Nee Soon':53070 ,'Tanjong Pagar': 45609,'West Coast':66871 }},
              {percent: 1.45,value: 31191, shortname:'RDU',name: 'Red Dot United',detail: {'Jurong':31191 }},
              {percent: 2.26,value: 48600, shortname:'RP',name: 'Reform Party',detail: {'Ang Mo Kio':48600 }},
              {percent: 1.73,value: 37179, shortname:'SDA',name: 'Singapore Democratic Alliance',detail: {'Pasir Ris-Punggol':37179}},
              {percent: 3.57,value: 76613, shortname:'SDP',name: 'Singapore Democratic Party',detail: {'Holland-Bukit Timah':35972,'Marsling-Yew Tee':40641}},
              {percent: 1.42,value: 30594, shortname:'SPP',name: 'Singapore People’s Party',detail: {'Bishan- Toa Payoh':30594}},
              {percent: 7.83,value: 168214, shortname:'W’P',name: 'Workers’ Party',detail: {'East Coast':53228,'Marine Parade':54850,'Seng Kang':60136 }},
              {percent: 3.98,value: 85603, shortname:'WP',name: 'WP', detail: {'Aljunied': 85603 }},
            ]
    var svgPie = d3.select(document.getElementById("pieChart")).append("svg")
        .attr("width", piew)
        .attr("height", pieh)
        .append("g")
        .attr("transform", "translate(" + (piew / 2-70) + "," + (pieh/2 + 25) + ")");

    var arc = d3.svg.arc()
        .outerRadius(pier)
        .innerRadius(2);

    var labelArc = d3.svg.arc()
        .outerRadius(pier-100)
        .innerRadius(pier-5);

    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) { return d.percent; });

    var pie = svgPie.selectAll(".arc")
      .data(pie(data))
      .enter().append("g")
      .attr("class", "arc");

    pie.append("path")
      .attr("d", arc)
      .attr("data-plegend", function(d){return d.data.name})
      .style("fill", function(d) { return piecolors(d.data.name); });


    // pie.append("text")
    //   .attr("transform", function(d) { 
    //   var midAngle = d.endAngle < Math.PI ? d.startAngle/2 + d.endAngle/2 : d.startAngle/2  + d.endAngle/2 + Math.PI ;
    //     return "translate("  + labelArc.centroid(d)[0] + "," + labelArc.centroid(d)[1] + ") rotate(-90) rotate(" + (midAngle * 180/Math.PI) + ")"; })
    //   .attr("dy", ".35em")
    //   .attr('text-anchor','middle')
    //   .style("font-size", "5px")
    //   .style("font-weight", "900")
    //   .style("font", "sans-serif")
    //   .text(function(d) { return d.data.shortname});
    var tooltip = d3.select("body").append("div")
    .style('position', 'absolute')
    .attr("class","tooltip") //用于css设置类样式
    .attr("opacity",0.0);

    pie.append("text")
    .attr("transform", function(d,i) {
      var x = labelArc.centroid(d)[0] * 2.0;
      var y = labelArc.centroid(d)[1] * 2.0;
      return 'translate(' + x + ', ' + y + ')';
    })
    .attr("text-anchor", "middle")
    .text(function(d) {
        return d.data.shortname;
    })
    .style("font-size", "6px")

  // 响应事件
  //-鼠标移入事件
    pie.on("mouseover",function(d)
      {	
        var res = d.data.name+":"+"<br/>"+d.value+"%"
              var detail = d.data.detail
              for(var key in detail){
                      res+= '<p>'+key+': '+ detail[key] +'</p>'
              }
        tooltip.html(res)
        .style("left",(d3.event.pageX)+"px")
        .style("top",(d3.event.pageY+20)+"px")
        .style("opacity",1.0)
      })
  //--鼠标移出事件
      .on("mouseout",function(d)
      {
        tooltip.style("opacity",0.0);
      }); 

      var plegend = svgPie.selectAll('.plegend-entry').data(data)
        .enter().append('g')
        .attr('class', 'plegend-entry')
  
    

      plegend.append('rect')
        .attr('class', 'plegend-rect')
        .attr('x', 130)
        .attr('y', function (d, i) { return i * 15 - 70 })
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', function (d) {
          return piecolors(d.name)
        })

      plegend.append('text')
        .attr('class', 'plegend-text')
        .attr('x', 145)
        .attr('y', function (d, i) { return i * 15 - 62  })
        .text(function (d) {
          return d.name
        })
        .style("font-size", "9px")

      svgPie.append("text")
          .attr("x",70)
          .attr("y", -130)
          .attr("text-anchor", "middle")
          .style("font-size", "12px")
          .text("Singapore GE2020 Statistics");
      });
