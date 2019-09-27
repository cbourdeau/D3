var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = 'obesity';


//function used for updating x scale var upon click on axis label
function xScale(mainData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(mainData, d => d[chosenXAxis] * 0.9),
            d3.max(mainData, d => d[chosenXAxis] * 1.2)
        ])
        .range([0, width]);
    console.log(xLinearScale);

    return xLinearScale;

};

//function used for updating x scale var upon click on axis label
function yScale(mainData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
        .domain([0,
            d3.max(mainData, d => d[chosenYAxis])
        ])
        .range([height, 0]);
    console.log(yLinearScale);
    return yLinearScale;
};

// function used for updating xAxis var upon cick on axis label
function renderAxis(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

        return xAxis;
};
// function used for updating yAxis var upon click on axis label
function renderYAxis(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;
};

//function used for updating circle group with a transition.
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

console.log(Object.keys(chosenXAxis))

    circlesGroup.transition()
        .duration(1000)
        .attr('cx', d => newXScale(d[chosenXAxis]))
    return circlesGroup;
};

function renderCirclesY(circlesGroup, newYScale, chosenYAxis) {

  console.log(Object.keys(chosenYAxis))


    circlesGroup.transition()
        .duration(1000)
        .attr('cy', d => newYScale(d[chosenYAxis])) //!!!!!!!!!!!!!!!!!!!!!!!!!!! 
    return circlesGroup;

};

// -----------------tooltip------------------
function updateToolTip(chosenXAxis, circlesGroup) {

  if (chosenXAxis === "poverty") {
    var label = "Poverty Rate:";
  }
  else if (chosenXAxis === 'age') {
    var label = "Age:";
  }
  else {
    var label = "Household Income:"
  }

  var tip = d3.tip()
    .attr("class", "tooltip")
    .style('z-index',99999)
    .offset([80, -60])
    .html(function(d) {
      return (`${label} <br> ${d[chosenXAxis]}`);
    });

  circlesGroup.call(tip);

  circlesGroup.on("mouseover", function(data) {
      tip.show(data,this);
      })
    // onmouseout event
    .on("mouseout", function(data) {
      tip.hide(data,this);
    });

  return circlesGroup;
};

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);



//Retrieve data  from the csv file and execute everything below
d3.csv('assets/data/data.csv', function(err, mainData) {
    if (err) throw err;
    console.log("Here")
    //parse data
    mainData.forEach(function(data) {
        data.id = +data.id;
        data.state = +data.state;
        data.abbr = +data.abbr;
        data.poverty = +data.poverty;
        data.povertyMoe = +data.povertyMoe;
        data.age = +data.age;
        data.ageMoe = +data.ageMoe;
        data.income = +data.income;
        data.incomeMoe = +data.incomeMoe;
        data.healthcare = +data.healthcare;
        data.healthcareLow = +data.healthcareLow;
        data.healthcareHigh = +data.healthcareHigh;
        data.obesity = +data.obesity;
        data.obesityLow = +data.obesityLow;
        data.obesityHigh = +data.obesityHigh;
        data.smokes = +data.smokes;
        data.smokesLow = +data.smokesLow;
        data.smokesHigh = +data.smokesHigh;
    });

    //xLinearScale function
    var xLinearScale = xScale(mainData, chosenXAxis);

    // create y scale function
    var yLinearScale = yScale(mainData, chosenYAxis);

    // create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append('g')
        .classed("x-axus", true)
        .attr('transform', `translate(0,${height})`)
        .call(bottomAxis);

    // append y axis
    var yAxis = chartGroup.append('g')
        .classed('y-axus', true)
        .call(leftAxis);

    //append initial circles
    var circlesGroup = chartGroup.selectAll('circle')
        .data(mainData)
        .enter()
        .append('circle')
        .attr('cx', d => xLinearScale(d[chosenXAxis]))
        .attr('cy', d => yLinearScale(d[chosenYAxis]))
        .attr('r', 10)
        .attr('fill', 'blue')
        .attr('opacity', '.9');
    // Update toolTip
    var circlesGroup = updateToolTip(chosenXAxis,circlesGroup);

    //Create group for 3 x- axis labels
    var labelsGroup = chartGroup.append('g')
        .attr('transform', `translate(${width/2},${height+20})`);
    var povertyLabel = labelsGroup.append('text')
        .attr('x', 0)
        .attr('y', 20)
        .attr('value', 'poverty')
        .classed('active', true)
        .text("Poverty rate");
    var ageLabel = labelsGroup.append('text')
        .attr('x', 0)
        .attr('y', 40)
        .attr('value', 'age')
        .classed('inactive', true)
        .text("Age (Median)");
    var householdLabel = labelsGroup.append('text')
        .attr('x', 0)
        .attr('y', 60)
        .attr('value', 'income')
        .classed('inactive', true)
        .text("Household Income (Median)");

    //append group for 3 y- axis labels
    var labelsGroupY = chartGroup.append('g')
        .attr('transform', "rotate(-90)");
    var obesityLabel = labelsGroupY.append('text')
        .attr('x', -width / 4)
        .attr('y', -30)
        .attr('value', 'obesity')
        .classed('active', true)
        .text("Obesity(%)");
    var smokeLabel = labelsGroupY.append('text')
        .attr('x', -width / 4)
        .attr('y', -50)
        .attr('value', 'smokes')
        .classed('inactive', true)
        .text("Smoke(%)");
    var lackhealthLabel = labelsGroupY.append('text')
        .attr('x', -width / 4)
        .attr('y', -70)
        .attr('value', 'healthcare')
        .classed('inactive', true)
        .text("Lack Healthcare");
    
    

    labelsGroup.selectAll('text').on('click', function() {
        // get value of selection
        var value = d3.select(this).attr('value');
        if (value !== chosenXAxis) {
            //replace chosenXAxis with value
            chosenXAxis = value;

            console.log(chosenXAxis)
            // updates x scale for new data
            xLinearScale = xScale(mainData, chosenXAxis);
            // updates x axis with the transition
            xAxis = renderAxis(xLinearScale, xAxis);
            // update circles with new x values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);
            // Update toolTip
            circlesGroup = updateToolTip(chosenXAxis,circlesGroup);
            

            // change classes to change bold text.
            if (chosenXAxis === "poverty") {
                povertyLabel
                    .classed("active", true)
                    .classed("inactive", false);
                householdLabel
                    .classed("active", false)
                    .classed("inactive", true);
                ageLabel
                    .classed("active", false)
                    .classed("inactive", true);
            } else if (chosenXAxis === 'age') {
                ageLabel
                    .classed("active", true)
                    .classed("inactive", false);
                householdLabel
                    .classed("active", false)
                    .classed("inactive", true);
                povertyLabel
                    .classed("active", false)
                    .classed("inactive", true);
            } else {
                householdLabel
                    .classed("active", true)
                    .classed("inactive", false);
                ageLabel
                    .classed("active", false)
                    .classed("inactive", true);
                povertyLabel
                    .classed("active", false)
                    .classed("inactive", true);
            };
        };
    });
    labelsGroupY.selectAll('text').on('click', function() {
        // get value of selection
        console.log(this)
        var value = d3.select(this).attr('value');
        if (value !== chosenYAxis) {
            //replace chosenYAxis with value
            chosenYAxis = value;

            console.log(chosenYAxis)
            // updates x scale for new data
            yLinearScale = yScale(mainData, chosenYAxis);
            // updates x axis with the transition
            yAxis = renderYAxis(yLinearScale, yAxis);
            // update circles with new x values
            circlesGroup = renderCirclesY(circlesGroup, yLinearScale, chosenYAxis);
            console.log(chosenYAxis);
            // update tooltips

            // change classes to change bold text.
            if (chosenYAxis === "obesity") {
                obesityLabel
                    .classed("active", true)
                    .classed("inactive", false);
                smokeLabel
                    .classed("active", false)
                    .classed("inactive", true);
                lackhealthLabel
                    .classed("active", false)
                    .classed("inactive", true);
            } else if (chosenYAxis === 'smokes') {
                smokeLabel
                    .classed("active", true)
                    .classed("inactive", false);
                lackhealthLabel
                    .classed("active", false)
                    .classed("inactive", true);
                obesityLabel
                    .classed("active", false)
                    .classed("inactive", true);
            } else {
                lackhealthLabel
                    .classed("active", true)
                    .classed("inactive", false);
                obesityLabel
                    .classed("active", false)
                    .classed("inactive", true);
                smokeLabel
                    .classed("active", false)
                    .classed("inactive", true);
            };
        };
    });
});