//Create svg2 element
var marginRight = 65
var marginLeft = 65
var svg2 = d3.select("#chart-2 .chart")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

var tooltip1 = d3.select("#chart-2")
  .append('div')
  .style('visibility', 'hidden')
  .attr('class', 'my-tooltip')
  .attr('id', 'tooltip-2')

// Add X scale
var xScale2 = d3.scaleLinear()
  .range([marginLeft, width - marginRight])
  .domain([1977, 2020])

// Define X axis
var xAxis2 = d3.axisBottom(xScale2)
  .ticks(10)
  .tickFormat(d => d)

// Add Y scale
var yScale2 = d3.scaleLinear()
  .domain([100, 0])
  .range([0, height - (margin.top + margin.bottom)])

var yScale3 = d3.scaleLinear()
  .domain([25, 0])
  .range([0, height - (margin.top + margin.bottom)])

// Define Y axis and format tick marks
var yAxis2 = d3.axisLeft(yScale2)
  .ticks(6)
  .tickFormat(d => d)

var yAxis3 = d3.axisRight(yScale3)
  .ticks(6)
  .tickFormat(d => d)

var yGrid2 = d3.axisLeft(yScale2)
  .tickSize(-width + marginRight + marginLeft, 0, 0)
  .tickFormat("")

// Render Y grid
svg2.append("g")
  .attr("transform", `translate(${marginLeft},${margin.top})`)
  .attr("class", "grid")
  .style('color', '#777777')
  .style('opacity', '0.3')
  .call(yGrid2)

// Render Y axis
svg2.append("g")
  .attr("transform", `translate(${marginLeft},${margin.top})`)
  .attr('class', 'y-axis')
  .call(yAxis2)
  .selectAll("text")
  .style('font-size', () => {
    return window.innerWidth > 767 ? '9pt' : '8pt'
  })
  .attr("transform", "translate(-15,0)")
  .style("text-anchor", "middle")
  .style('fill', '#b01116')

svg2.append("g")
  .attr("transform", `translate(${width - marginRight},${margin.top})`)
  .attr('class', 'y-axis')
  .call(yAxis3)
  .selectAll("text")
  .style('font-size', () => {
    return window.innerWidth > 767 ? '9pt' : '8pt'
  })
  .attr("transform", "translate(15,0)")
  .style("text-anchor", "middle")
  .style('fill', '#132a43')


svg2.append("text")
  .attr("class", "y-label")
  .attr("text-anchor", "middle")
  .attr("transform", `translate(${20},${(height-margin.bottom)/2}) rotate(-90)`)
  .style('font-size', '12pt')
  .style('fill', '#b01116')
  .text('Executions');

svg2.append("text")
  .attr("class", "y-label")
  .attr("text-anchor", "middle")
  .attr("transform", `translate(${width-10},${(height-margin.bottom)/2}) rotate(-90)`)
  .style('font-size', '12pt')
  .style('fill', '#132a43')
  .text('Years');


// Render Y grid
svg2.append("g")
  .attr("transform", `translate(${marginLeft},${margin.top})`)
  .attr("class", "grid")
  .style('color', '#777777')
  .style('opacity', '0.3')
  .call(yGrid2)

// Render lines g
var linesG = svg2.append("g")
  .attr('class', 'lines')

//Render X axis
svg2.append("g")
  .attr("transform", `translate(0,${height-margin.bottom})`)
  .attr('class', 'x-axis')
  .style('color', 'black')
  .call(xAxis2)
  .selectAll(".tick text")
  .style('font-size', '10pt')
  .raise()

d3.csv("data-2.csv")
  .then(function(csv) {
    var months = d3.line()
      .x(function(d) {
        return xScale2(d.year)
      })
      .y(function(d) {
        return (height - margin.bottom) - yScale3(Math.max.apply(Math, yScale3.domain()) - d.months / 12);
      });

    var executions = d3.line()
      .x(function(d) {
        return xScale2(d.year)
      })
      .y(function(d) {
        return (height - margin.bottom) - yScale2(Math.max.apply(Math, yScale2.domain()) - d.executions);
      });

    svg2.select('.lines')
      .data([csv.slice(7)])
      .append("path")
      .attr("class", "line months")
      .attr("d", (d) => {
        return months(d)
      })
      .style('stroke', '#132a43')


    svg2.select('.lines')
      .data([csv])
      .append("path")
      .attr("class", "line executions")
      .attr("d", (d) => {
        return executions(d)
      })
      .style('stroke', '#b01116')

    csv.unshift('dummy')


    svg2.selectAll(".lines")
      .data(csv.slice(7))
      .enter()
      .append("circle") // Uses the enter().append() method
      .attr("class", d => `dot months yr-${d.year}`) // Assign a class for styling
      .attr("cy", function(d) {
        return (height - margin.bottom) - yScale3(Math.max.apply(Math, yScale3.domain()) - d.months / 12);
      })
      .attr("cx", function(d) {
        return xScale2(d.year)
      })
      .attr("r", 1)
      .style('fill', '#132a43')
      .style('stroke-width', 0)

    svg2.selectAll(".lines")
      .data(csv)
      .enter()
      .append("circle") // Uses the enter().append() method
      .attr("class", d => `dot executions yr-${d.year}`) // Assign a class for styling
      .attr("cy", function(d) {
        return (height - margin.bottom) - yScale2(Math.max.apply(Math, yScale2.domain()) - d.executions);
      })
      .attr("cx", function(d) {
        return xScale2(d.year)
      })
      .attr("r", 1)
      .style('fill', '#b01116')
      .style('stroke-width', 0)

    svg2.append("rect")
      .attr("transform", `translate(${marginLeft}, ${margin.top})`)
      .attr("class", "hover-overlay")
      .attr("width", width - marginRight - marginLeft)
      .attr("height", height - margin.bottom - margin.top)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .data([csv])
      .on("mouseover mousemove touchstart touchmove", function(d) {
        return mouseoverLine(d, 2)
      })
      .on("mouseout", () => {
        return mouseout(2)
      });

    d3.selectAll('.hover-overlay')
      .raise()
  })