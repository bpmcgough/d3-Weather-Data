let currentMonth = "March";
let temperatureScale = "Fahrenheit";

var margin = {
    top: 50,
    right: 10,
    bottom: 50,
    left: 50
  },
  width = 400 - margin.left - margin.right,
  height = 570 - margin.top - margin.bottom;

var x = d3.scale.linear().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

var tickLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'];

// Define the axes
var xAxis = d3.svg.axis().scale(x)
  .orient("bottom")
  .tickValues([0, 7, 14, 21, 28])
  .tickFormat(function(d, i) {
    return tickLabels[i];
  });

var yAxis = d3.svg.axis().scale(y)
  .orient("right").tickValues([50, 75, 100, 125, 150, 175, 200]);

var area = d3.svg.area()
  .interpolate("basis")
  .x(function(d) {
    return x(d.date);
  })
  .y0(height)
  .y1(function(d) {
    return y(d.close);
  });

var areaCelsius = d3.svg.area()
  .interpolate("basis")
  .x(function(d) {
    return x(d.date);
  })
  .y0(height)
  .y1(function(d) {
    return (y((d.close - 32) * (5/9)));
  });

// Define the line
var valueline = d3.svg.line()
  .interpolate("basis")
  .x(function(d) {
    return x(d.date);
  })
  .y(function(d) {
      return y(d.close);
  });

var valuelineCelsius = d3.svg.line()
  .interpolate("basis")
  .x(function(d) {
    return x(d.date);
  })
  .y(function(d) {
    return (y((d.close - 32) * (5/9)));
  });

// Adds the svg canvas
var svg = d3.select("body")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")")

// make background
svg.append("rect")
  .attr("width", "85%")
  .attr("height", "80%")
  .attr("fill", "#333869");

// adds y label
svg.append("text")
  .attr("text-anchor", "middle")
  .attr("transform", "translate("+ (-10) +","+(height/2)+")rotate(-90)")
  .style("font-size", "18px")
  .style("stroke", "#B4BCBF")
  .style("fill", "#B4BCBF")
  .text("Temperature");

// add the title
svg.append("text")
  .attr("x", (width / 2))
  .attr("y", 0 - (margin.top / 2))
  .attr("text-anchor", "middle")
  .attr("class", "title")
  .style("font-size", "24px")
  .style("stroke", "#B4BCBF")
  .style("fill", "#B4BCBF")
  .text("March");

// add change scale button
svg.append("text")
  .attr("x", (width / 2) + 110)
  .attr("y", 5 - (margin.top / 2))
  .attr("type", "button")
  .attr("class", "change-scale")
  .text("°C")
  .on("click", changeScale);

// buttons for month navigation
svg.append("text")
  .attr("x", (width / 2) - 75)
  .attr("y", 0 - (margin.top / 2))
  .attr("type", "button")
  .style("font-size", "24px")
  .style("stroke", "#B4BCBF")
  .style("fill", "#B4BCBF")
  .text("<")
  .on("click", decrementMonth);

svg.append("text")
  .attr("x", (width / 2) + 60)
  .attr("y", 0 - (margin.top / 2))
  .attr("type", "button")
  .style("font-size", "24px")
  .style("stroke", "#B4BCBF")
  .style("fill", "#B4BCBF")
  .text(">")
  .on("click", incrementMonth);

function makeXAxis() {
  return d3.svg.axis()
    .scale(x)
    .orient("bottom")
    // .ticks(5)
    .tickValues([0, 7, 14, 21, 28])
    .tickFormat(function(d, i) {
      return tickLabels[i]
    });
}

// Get the data
d3.csv("/data/data-March-15.csv", function(error, data) {

  // Scale the range of the data
  x.domain([0, 30]);
  y.domain([0, 200]);

  // shade under area-15
  svg.append("path")
    .datum(data)
    .attr("class", "area-15")
    .attr("d", area);

  // makes x axis grid
  svg.append("g")
    .attr("class", "grid")
    .attr("transform", "translate(0," + height + ")")
    .call(makeXAxis()
      .tickSize(-height, 0, 0)
      .tickFormat("")
    )

  // Add the valueline path.
  svg.append("path")
    .attr("class", "line-15")
    .attr("d", valueline(data))
    .style("stroke", "#A8CCF0");

  // Add the X Axis
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  // Add the Y Axis
  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

});

d3.csv("/data/data-March-16.csv", function(error, data) {

  // shade under area-16
  svg.append("path")
    .datum(data)
    .attr("class", "area-16")
    .attr("d", area);

  // Add the valueline path.
  svg.append("path")
    .attr("class", "line-16")
    .attr("d", valueline(data))
    .style("stroke", "#F0A8F0");

});

let legend = svg.append("g")
  .attr("class","legend")
  .attr("transform","translate(99,30)")
  .style("font-size","12px")
  .call(d3.legend)

  legend.append("text")
    .attr("transform","translate(0,30)")
    .attr("stroke", "#F08DF0")
    .text('2015')

  legend.append("text")
    .attr("transform","translate(0,10)")
    .attr("stroke", "lightsteelblue")
    .text('2016')

  legend
    .style("font-size","16px")
    .attr("data-style-padding",10)
    .call(d3.legend)

// ** Update data section (Called from the onclick)
function decrementMonth() {

  if(currentMonth !== "February") currentMonth = currentMonth === "March" ? "February" : "March"

  // Get the data again
  d3.csv("/data/data-" + currentMonth + "-15.csv", function(error, data) {

    // Scale the range of the data again
    x.domain([0, 30]);
    y.domain([0, 200]);

    // Select the section we want to apply our changes to
    var svg = d3.select("body").transition();

    // Make the changes
    svg.select(".area-15") // shade under line-15
      .duration(750)
      .attr("d", area(data));
    svg.select(".line-15") // change the line
      .duration(750)
      .attr("d", valueline(data));
  });

  d3.csv("/data/data-" + currentMonth + "-16.csv", function(error, data) {

    // Scale the range of the data again
    x.domain([0, 30]);
    y.domain([0, 200]);

    // Select the section we want to apply our changes to
    var svg = d3.select("body").transition();

    // Make the changes
    svg.select(".area-16") // shade under line-16
      .duration(750)
      .attr("d", area(data));
    svg.select(".line-16") // change the line
      .duration(750)
      .attr("d", valueline(data));
    svg.select(".title")
      .text(currentMonth);
  });
}

function incrementMonth() {

  if(currentMonth !== "April") currentMonth = currentMonth === "March" ? "April" : "March"

  // Get the data again
  d3.csv("/data/data-" + currentMonth + "-15.csv", function(error, data) {

    // Scale the range of the data again
    x.domain([0, 30]);
    y.domain([0, 200]);

    // Select the section we want to apply our changes to
    var svg = d3.select("body").transition();

    // Make the changes
    svg.select(".area-15") // shade under line-15
      .duration(750)
      .attr("d", area(data));
    svg.select(".line-15") // change the line
      .duration(750)
      .attr("d", valueline(data));
  });

  d3.csv("/data/data-" + currentMonth + "-16.csv", function(error, data) {

    // Scale the range of the data again
    x.domain([0, 30]);
    y.domain([0, 200]);

    // Select the section we want to apply our changes to
    var svg = d3.select("body").transition();

    // Make the changes
    svg.select(".area-16") // shade under line-16
      .duration(750)
      .attr("d", area(data));
    svg.select(".line-16") // change the line
      .duration(750)
      .attr("d", valueline(data));
    svg.select(".title")
      .text(currentMonth);
  });
}

function changeScale(){
  if(temperatureScale === "Fahrenheit"){
    temperatureScale = "Celsius";
    svg.select('.change-scale')
      .text('°F')
    d3.csv("/data/data-" + currentMonth + "-15.csv", function(error, data) {

      // Scale the range of the data again
      x.domain([0, 30]);
      y.domain([0, 200]);

      // Select the section we want to apply our changes to
      var svg = d3.select("body").transition();

      // Make the changes
      svg.select(".area-15") // shade under line-15
        .duration(750)
        .attr("d", areaCelsius(data));
      svg.select(".line-15") // change the line
        .duration(750)
        .attr("d", valuelineCelsius(data));
    });

    d3.csv("/data/data-" + currentMonth + "-16.csv", function(error, data) {

      // Scale the range of the data again
      x.domain([0, 30]);
      y.domain([0, 200]);

      var yAxis = d3.svg.axis().scale(y)
        .orient("right").tickValues([0, 25, 50, 75, 100, 125, 150, 175, 200]);

      // Select the section we want to apply our changes to
      var svg = d3.select("body").transition();

      // Make the changes
      svg.select(".area-16") // shade under line-16
        .duration(750)
        .attr("d", areaCelsius(data));
      svg.select(".line-16") // change the line
        .duration(750)
        .attr("d", valuelineCelsius(data));
      svg.select(".y.axis")
       .attr("class", "y axis")
       .call(yAxis);
    });

  } else { // if current temperature is celsius
    temperatureScale = "Fahrenheit";
    svg.select('.change-scale')
      .text('°C')
    d3.csv("/data/data-" + currentMonth + "-15.csv", function(error, data) {

      // Scale the range of the data again
      x.domain([0, 30]);
      y.domain([25, 200]);

      // Select the section we want to apply our changes to
      var svg = d3.select("body").transition();

      // Make the changes
      svg.select(".area-15") // shade under line-15
        .duration(750)
        .attr("d", area(data));
      svg.select(".line-15") // change the line
        .duration(750)
        .attr("d", valueline(data));
      svg.select(".x.axis") // change the x axis
        .duration(750)
        .call(xAxis);
      svg.select(".y.axis") // change the y axis
        .duration(750)
        .call(yAxis);
    });

    d3.csv("/data/data-" + currentMonth + "-16.csv", function(error, data) {

      // Scale the range of the data again
      x.domain([0, 30]);
      y.domain([25, 200]);

      // Select the section we want to apply our changes to
      var svg = d3.select("body").transition();

      // Make the changes
      svg.select(".area-16") // shade under line-16
        .duration(750)
        .attr("d", area(data));
      svg.select(".line-16") // change the line
        .duration(750)
        .attr("d", valueline(data));
      svg.select(".title")
        .text(currentMonth);
      svg.select(".x.axis") // change the x axis
        .duration(750)
        .call(xAxis);
      svg.select(".y.axis") // change the y axis
        .duration(750)
        .call(yAxis);
    });
  }
}
