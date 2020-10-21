
    var data =  [

        [{'x': 2001, 'y':0.758},{'x': 2006, 'y':0.666}, {'x': 2011, 'y':0.603}, {'x': 2015, 'y':0.699}, {'x': 2020, 'y':0.612}],
        [{'x': 2001, 'y':0.031},{'x': 2006, 'y':0.163}, {'x': 2011, 'y':0.129}, {'x': 2015, 'y':0.125}, {'x': 2020, 'y':0.112}],
        [{'x': 2001, 'y':0.081},{'x': 2006, 'y':0.041}, {'x': 2011, 'y':0.045}, {'x': 2015, 'y':0.038}, {'x': 2020, 'y':0.045}],
        [{'x': 2001, 'y':0.121},{'x': 2006, 'y':0.130}, {'x': 2011, 'y':0.028}, {'x': 2015, 'y':0.021}, {'x': 2020, 'y':0.015}]

    ];



    var linecolors = [
        'slateblue',
        'green',
        'orange',
        "grey" 
    ];

    var color_hash = {  0 : ["PAP", "slateblue"],
                        1 : ["WP", "green"],
                        2 : ["SDP", "orange"],
                        3 : ["SDA", "grey"]
    } 

    var linemargin = {top: 36, right: 10, bottom: 25, left: 50},
            linewidth = 430 - linemargin.left - linemargin.right,
            lineheight = 230 - linemargin.top - linemargin.bottom;

    // x轴的比例尺 - 离散型
    var x = d3.scaleBand()
            .domain(['2001', '2006', '2011', '2015', '2020'])
            .rangeRound([0, linewidth]);


    var y = d3.scaleLinear()
            .domain([0, 1])
            .range([lineheight, 0]);

    //定义x轴
    var xAxis0 = d3.axisBottom(x)

    //y轴设置
    var yAxis0 = d3.axisLeft(y)
                   .tickPadding(10)
                   .tickSize(-linewidth)


    // 去除缩放拖拽
    // 添加svg画布
    var svg = d3.select("#trendSvg").append("svg")
            .attr("width", linewidth + linemargin.left + linemargin.right)
            .attr("height", lineheight + linemargin.top + linemargin.bottom)
            .append("g")
            .attr("transform", "translate(" + linemargin.left + "," + linemargin.top + ")");


    // 将坐标轴加入到svg容器group中
    svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + lineheight + ")")
            .call(xAxis0);

    svg.append("g")
            .attr("class", "y axis")
            .call(yAxis0);

    // 添加纵坐标轴说明
    svg.append("g")
            .attr("class", "y axis")
            .append("text")
            .attr("class", "axis-label")
            .attr("transform", "rotate(-90)")
            .attr("y", (-linemargin.left) + 15)
            .attr("x", -lineheight/2 - 50)
            .text('Turnout in election')
            .style('font-size', '12px');


    var line = d3.svg.line()
            .interpolate("linear")
            .x(function(d) { return x(d.x); })
            .y(function(d) { return y(d.y); });


    const xOffset = 37.5;

    svg.selectAll('.line')
            .data(data)
            .enter()
            .append("path")
            .attr("class", "line")
            .attr('transform', 'translate(' + xOffset + ',0)')
            // .attr("clip-path", "url(#clip)")
            .attr('stroke', function(d,i){
                return linecolors[i%linecolors.length];
            })
            .attr("d", line);


    var points = svg.selectAll('.dots')
            .data(data)
            .enter()
            .append("g")
            .attr('transform', 'translate(' + xOffset + ',0)')
            .attr("class", "dots");
            // .attr("clip-path", "url(#clip)");

    points.selectAll('.dot')
            .data(function(d, index){
                var a = [];
                d.forEach(function(point,i){
                    a.push({'index': index, 'point': point});
                });
                return a;
            })
            .enter()
            .append('circle')
            .attr('class','dot')
            .attr("r", 3)
            .attr('fill', function(d,i){
                return linecolors[d.index%linecolors.length];
            })
            .attr("transform", function(d) {
                return "translate(" + x(d.point.x) + "," + y(d.point.y) + ")"; }   
            )
            .on('mouseover', function (d, i) {   // 定义鼠标移入事件
              return tooltip.style('visibility', 'visible').text(d.point.y)
            })
            .on('mousemove', function (d, i) {
              return tooltip.style('top', (event.pageY-10)+'px').style('left',(event.pageX+10)+'px')
            })
            .on('mouseout', function (d, i) {
              return tooltip.style('visibility', 'hidden')
            });

    // 添加标题   
     svg.append("svg:text")
        .attr("class", "title")
        .attr("x", 30)
        .attr("y", -15)
        .attr("font-size",12)
        .text("Turnout trend of popular parties during the past elections");

    let tooltip = d3.select('body')
        .append('div')
        .style('position', 'absolute')
        .style('z-index', '10')
        .style('color', '#3497db')
        .style('visibility', 'hidden')   // 是否可见（一开始设置为隐藏）
        .style('font-size', '12px')
        .style('font-weight', 'bold')
        .text('')


    // 添加图例  
     var legend = svg.append("g")
       .attr("class", "legend")
       .attr("x", linewidth - 90)
       .attr("y", 25)
       .attr("height", 100)
       .attr("width", 100);

     legend.selectAll('g').data(data)
         .enter()
         .append('g')
         .each(function(d, i) {
           var g = d3.select(this);
           g.append("rect")
             .attr("x", linewidth - 20)
             .attr("y", i*13)
             .attr("width", 8)
             .attr("height", 8)
             .style("fill", color_hash[String(i)][1]);

           g.append("text")
             .attr("x", linewidth-6)
             .attr("y", i * 13 + 6)
             .attr("height", 50)
             .attr("width", 120)
             .attr("font-size",8)
             .style("fill", color_hash[String(i)][1])
             .text(color_hash[String(i)][0]);

         });












