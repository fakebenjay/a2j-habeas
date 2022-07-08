//Create svg1 element
var svg1 = d3.select("#chart-1 .chart")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

var tooltip1 = d3.select("#chart-1")
  .append('div')
  .style('visibility', 'hidden')
  .attr('class', 'my-tooltip')
  .attr('id', 'tooltip-1')

// Add X scale
var xScale1 = d3.scaleLinear()
  .range([margin.left, width - margin.right])
  .domain([1973, 2022])

// Define X axis
var xAxis1 = d3.axisBottom(xScale1)
  .ticks(10)
  .tickFormat(d => d)

// Add Y scale
var yScale1 = d3.scaleLinear()
  .domain([300, 0])
  .range([0, height - (margin.top + margin.bottom)])

// Define Y axis and format tick marks
var yAxis1 = d3.axisLeft(yScale1)
  .ticks(6)
  .tickFormat(d => d)

var yGrid1 = d3.axisLeft(yScale1)
  .tickSize(-width + margin.right + margin.left, 0, 0)
  .tickFormat("")
  .ticks(30)

// Render Y grid
svg1.append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`)
  .attr("class", "grid")
  .style('color', '#777777')
  .style('opacity', '0.3')
  .call(yGrid1)

// Render Y axis
svg1.append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`)
  .attr('class', 'y-axis')
  .call(yAxis1)
  .selectAll("text")
  .style('font-size', () => {
    return window.innerWidth > 767 ? '9pt' : '8pt'
  })
  .attr("transform", "translate(-15,0)")
  .style("text-anchor", "middle")

// Render Y grid
svg1.append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`)
  .attr("class", "grid")
  .style('color', '#777777')
  .style('opacity', '0.3')
  .call(yGrid1)

// Render lines g
var linesG = svg1.append("g")
  .attr('class', 'lines')

//Render X axis
svg1.append("g")
  .attr("transform", `translate(0,${height-margin.bottom})`)
  .attr('class', 'x-axis')
  .style('color', 'black')
  .call(xAxis1)
  .selectAll(".tick text")
  .style('font-size', '10pt')
  .raise()

d3.csv("data-1.csv")
  .then(function(csv) {

    var reversal = d3.line()
      .x(function(d) {
        return xScale1(d.year)
      })
      .y(function(d) {
        return (height - margin.bottom) - yScale1(Math.max.apply(Math, yScale1.domain()) - d.reversal);
      });

    var execution = d3.line()
      .x(function(d) {
        return xScale1(d.year)
      })
      .y(function(d) {
        return (height - margin.bottom) - yScale1(Math.max.apply(Math, yScale1.domain()) - d.execution);
      });

    svg1.select('.lines')
      .data([csv])
      .append("path")
      .attr("class", "line reversal")
      .attr("d", (d) => {
        return reversal(d)
      })
      .style('stroke', '#132a43')


    svg1.select('.lines')
      .data([csv])
      .append("path")
      .attr("class", "line execution")
      .attr("d", (d) => {
        return execution(d)
      })
      .style('stroke', '#b01116')

    csv.unshift('dummy')

    svg1.selectAll(".lines")
      .data(csv)
      .enter()
      .append("circle") // Uses the enter().append() method
      .attr("class", d => `dot execution yr-${d.year}`) // Assign a class for styling
      .attr("cy", function(d) {
        return (height - margin.bottom) - yScale1(Math.max.apply(Math, yScale1.domain()) - d.reversal);
      })
      .attr("cx", function(d) {
        return xScale1(d.year)
      })
      .attr("r", 1)
      .style('fill', '#132a43')
      .style('stroke-width', 0)

    svg1.selectAll(".lines")
      .data(csv)
      .enter()
      .append("circle") // Uses the enter().append() method
      .attr("class", d => `dot execution yr-${d.year}`) // Assign a class for styling
      .attr("cy", function(d) {
        return (height - margin.bottom) - yScale1(Math.max.apply(Math, yScale1.domain()) - d.execution);
      })
      .attr("cx", function(d) {
        return xScale1(d.year)
      })
      .attr("r", 1)
      .style('fill', '#b01116')
      .style('stroke-width', 0)

    var aedpa = svg1.append('g')
      .attr('class', 'aedpa-marker')

    aedpa.append('line')
      .attr('class', 'aedpa-line')
      .attr("x1", xScale1(1996))
      .attr("x2", xScale1(1996))
      .attr("y1", margin.top)
      .attr("y2", height - margin.bottom)
      .style('stroke-width', '2px')
      .style('stroke', '#373739')

    aedpa.append('rect')
      .text('passed')
      .attr('x', xScale1(1996) - 80)
      .attr('y', yScale1(270))
      .attr('width', 80)
      .attr('height', yScale1(220) - yScale1(270))
      .attr('fill', '#373739')

    aedpa.append('text')
      .text('AEDPA')
      .attr('dx', xScale1(1995))
      .attr('dy', yScale1(250))
      .attr('text-anchor', 'end')
      .style('font-size', '12pt')
      .style('fill', 'white')

    aedpa.append('text')
      .text('passed')
      .attr('dx', xScale1(1995))
      .attr('dy', yScale1(230))
      .style('font-size', '12pt')
      .attr('text-anchor', 'end')
      .style('fill', 'white')

    svg1.append("rect")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .attr("class", "hover-overlay")
      .attr("width", width - margin.right - margin.left)
      .attr("height", height - margin.bottom - margin.top)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .data([csv])
      .on("mouseover mousemove touchstart touchmove", function(d) {
        return mouseoverLine(d, 1)
      })
      .on("mouseout", () => {
        return mouseout(1)

      });

    d3.selectAll('.hover-overlay')
      .raise()
  })