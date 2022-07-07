function tipTextLine1(values) {
  return `<span class='quit'>x</span><div class="tooltip-container">
  <div>There ${values.reversal == 1 ? 'was':'were'} <strong style="background-color:#132a43;padding: 0 2px;color:white;">${numeral(values.reversal).format('0,0')} death penalty reversal${values.reversal == 1 ? '':'s'}</strong> and <strong style="background-color:#b01116;padding: 0 2px;color:white;">${numeral(values.execution).format('0,0')} execution${values.execution == 1 ? '':'s'}</strong> at the state level in <strong>${values.year}</strong>.</div>
  </div>`
}

function tipTextLine2(values) {
  var years = Math.floor(values.months / 12)
  var months = values.months % 12
  var monthsPhrase = !!months ? `, ${months} months` : ''
  var timeSentence = values.year > 1983 ? `, with an average of <strong style="background-color:#132a43;padding: 0 2px;color:white;">${years} years${monthsPhrase}</strong> between sentencing and execution` : ''
  return `<span class='quit'>x</span><div class="tooltip-container">
  <div>There ${values.executions == 1 ? 'was':'were'} <strong style="background-color:#b01116;padding: 0 2px;color:white;">${numeral(values.executions).format('0,0')} execution${values.executions == 1 ? '':'s'}</strong> in <strong>${values.year}</strong> at the state level${timeSentence}.</div>
  </div>`
}

var bisectDate1 = d3.bisector(function(d) {
  return xScale1(d.year) - margin.left;
}).left

var bisectDate2 = d3.bisector(function(d) {
  return xScale2(d.year) - marginLeft;
}).left

function mouseoverLine(data, index) {
  var x0 = d3.mouse(event.target)[0],
    i = index == 1 ? bisectDate1(data, x0, 1) : bisectDate2(data, x0, 2),
    scale = index == 1 ? xScale1 : xScale2,
    mLeft = index == 1 ? margin.left : marginLeft

  var d0 = data[i - 1] !== 'dummy' ? data[i - 1] : data[i],
    d1 = i < data.length ? data[i] : data[i - 1]

  var d = (x0 + mLeft) - scale(d0.year) > scale(d1.year) - (x0 + mLeft) ? d1 : d0;

  var html = index == 1 ? tipTextLine1(d) : tipTextLine2(d)

  d3.selectAll(`#chart-${index} .dot`)
    .attr('r', 1)
    .raise()


  d3.selectAll(`#chart-${index} .dot.yr-${d.year}`)
    .attr('r', 8)

  d3.select(`#tooltip-${index}`)
    .html(html)
    .attr('display', 'block')
    .style("visibility", "visible")
    .style('top', topTT(index))
    .style('left', leftTT(index))

  d3.selectAll(`#tooltip-${index} .quit`)
    .on('click', () => {
      d3.selectAll(`#chart-${index} .dot`)
        .attr('r', 1)

      d3.select(`#tooltip-${index}`)
        .html("")
        .attr('display', 'none')
        .style("visibility", "hidden")
        .style("left", null)
        .style("top", null);
    })
}

function mousemove(i) {
  d3.select(`#tooltip-${i}`)
    .style("visibility", "visible")
    .style('top', topTT(i))
    .style('left', leftTT(i))
}

function mouseout(i) {
  if (window.innerWidth > 767) {
    d3.selectAll(`#chart-${i} .dot`)
      .attr('r', 1)

    d3.select(`#tooltip-${i}`)
      .html("")
      .attr('display', 'none')
      .style("visibility", "hidden")
      .style("left", null)
      .style("top", null);
  }
}

function topTT(d) {
  var offsetParent = document.querySelector(`#chart-${d} .chart`).offsetParent
  var offY = offsetParent.offsetTop
  var cursorY = 5

  var windowWidth = window.innerWidth
  var ch = document.querySelector(`#tooltip-${d}`).clientHeight
  var cy = d3.event.pageY - offY
  var windowHeight = window.innerHeight
  if (windowWidth > 767) {
    if (ch + cy >= windowHeight) {
      return cy - (ch / 2) + "px"
    } else {
      return cy - 28 + "px"
    }
  }
}

function leftTT(d) {
  var offsetParent = document.querySelector(`#chart-${d} .chart`).offsetParent
  var offX = offsetParent.offsetLeft
  var cursorX = 5

  var windowWidth = window.innerWidth
  var cw = document.querySelector(`#tooltip-${d}`).clientWidth
  var cx = d3.event.pageX - offX
  var bodyWidth = document.querySelector(`#chart-${d} .chart`).clientWidth

  if (windowWidth > 767) {
    if (cw + cx >= bodyWidth) {
      document.querySelector(`#tooltip-${d}`).className = 'my-tooltip box-shadow-left'
      return cx - cw - cursorX + "px"
    } else {
      document.querySelector(`#tooltip-${d}`).className = 'my-tooltip box-shadow-right'
      return cx + cursorX + "px"
    }
  }
}