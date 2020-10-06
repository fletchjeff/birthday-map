function addCommas(nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

function first_draw_graphs(data, sort_type) {

    var days_lines = svg.selectAll(".days_lines").data(days);

    days_lines
        .enter()
        .append("line")
        .attr("class", "days_lines");

    days_lines
        .attr("x1", function(d, i) {
            return i * (block_width + 3) + 53;
        })
        .attr("y1", 40)
        .attr("x2", function(d, i) {
            return i * (block_width + 3) + 53;
        })
        .attr("y2", 40);

    days_lines.exit().remove();

    var block = svg.selectAll("rect").data(data);
    var freq_colour_scale = d3.scale.linear()
        .domain(d3.extent(data, function(d) {
            return +d[sort_type];
        }))
        .range([1, color_scale.length]);
    block.enter()
        .append("rect")
        .attr("class", "rect");

    block
        .attr("y", function(d) {
            return (+(d.Day.substring(0, 2)) * (block_height + 3)) + 0.5;
        }).attr("x", function(d) {
            return (+(d.Day.substring(2, 4)) * (block_width + 3)) + 20.5; //d.Day;
        })
        .attr("height", block_height)
        .attr("width", block_width)
        .attr("rx", 2)
        .attr("ry", 2)
        .attr("fill", function(d) {
            return color_scale[Math.floor(freq_colour_scale(+d[sort_type] - 1))];
        })
        .on("mouseover", function(d) {
            d3.select("#values").text(months[+(d.Day.substring(0, 2)) - 1] + " " + d.Day.substring(2, 4) + " - " + addCommas(367 - +d[sort_type]));
        });

    block.exit().remove();

    var days_list = svg.selectAll(".days_list").data(days);

    days_list.enter()
        .append("text")
        .attr("class", "days_list");

    days_list.attr("x", function(d, i) {
        return i * (block_width + 3) + 53.5;
    })
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .text(function(d) {
            return d;
        });

    days_list.exit().remove();

    var months_list = svg.selectAll(".months_list").data(months);

    months_list.enter()
        .append("text")
        .attr("class", "months_list");

    months_list.attr("y", function(d, i) {
        return i * (block_height + 3) + 45.5;
    })
        .attr("x", 35)
        .attr("text-anchor", "end")
        .text(function(d) {
            return d;
        });

    months_list.exit().remove();

}

function draw_graphs(sort_type, bar) {
    if (sort_type === "Rank") {
        d3.select("#title").text("Rank");
    } else if (sort_type === "Freq") {
        if (bar) {
            d3.select("#title").text("Frequency Bar Chart");
        } else {
            d3.select("#title").text("Frequency");
        }
    }


    var bar_height = bar ? 30 : 0;
    var bar_pad = bar ? 30 : 0;

    if (bar) {
        svg.transition().attr("height", 780);
    } else {
        svg.transition().attr("height", height);
    }

    var days_lines = svg.selectAll(".days_lines").data(days);

    days_lines
        .enter()
        .append("line")
        .attr("class", "days_lines");

    days_lines
        .attr("x1", function(d, i) {
            return i * (block_width + 3) + 53;
        })
        .attr("y1", 40)
        .attr("x2", function(d, i) {
            return i * (block_width + 3) + 53;
        });

    days_lines
        .transition()
        .attr("y2", function() {
            return bar ? 720 : 40;
        });

    days_lines.exit().remove();

    var block = svg.selectAll(".rect").data(data);
    var freq_colour_scale = d3.scale.linear()
        .domain(d3.extent(data, function(d) {
            return +d[sort_type];
        }))
        .range([1, color_scale.length]);

    var freq_length_scale = d3.scale.linear()
        .domain(d3.extent(data, function(d) {
            return +d[sort_type];
        }))
        .range([1, block_height + block_height]);

    block.enter()
        .append("rect")
        .attr("class", "rect")
        .attr("width", block_width);


    block
        .transition()
        .attr("rx", function() {
            return bar ? 0 : 2;
        })
        .attr("ry", function() {
            return bar ? 0 : 2;
        })
        .attr("y", function(d) {
            if (bar) {
                return 20 + (+(d.Day.substring(0, 2)) * (block_height + bar_height + 3)) + 0.5 - freq_length_scale(+d[sort_type]);
            } else {
                return (+(d.Day.substring(0, 2)) * (block_height + bar_height + 3)) + 0.5;
            }
        }).attr("x", function(d) {
            return (+(d.Day.substring(2, 4)) * (block_width + 3)) + 20.5;
        })
        .attr("height", function(d) {
            if (bar) {
                return freq_length_scale(+d[sort_type]);
            } else {

                return block_height;
            }
        })
        .attr("fill", function(d) {
            return color_scale[Math.floor(freq_colour_scale(+d[sort_type] - 1))];
        })
        .each("end", function() {
            // if (!bar) {
            //     d3.selectAll("g.local_bar").transition().attr("display", "block");
            // }
        });

    block
        .on("mouseover", function(d) {
            if (sort_type === "Freq") {
                return d3.select("#values").text(months[+(d.Day.substring(0, 2)) - 1] + " " + d.Day.substring(2, 4) + " - " + addCommas(+d[sort_type]));
            } else {
                return d3.select("#values").text(months[+(d.Day.substring(0, 2)) - 1] + " " + d.Day.substring(2, 4) + " - " + addCommas(367 - +d[sort_type]));
            }
        });

    block.exit().remove();

    var months_list = svg.selectAll(".months_list").data(months);

    months_list.enter()
        .append("text")
        .attr("class", "months_list");

    months_list
        .transition()
        .attr("y", function(d, i) {
            return i * (block_height + bar_height + 3) + 45.5 + bar_pad;
        })
        .attr("x", 35)
        .attr("text-anchor", "end")
        .text(function(d) {
            return d;
        });

    months_list.exit().remove();

}

function draw_bar_chart(local_data, local_width, local_height, local_left, local_top, header_text) {
    local_data = local_data.sort(function(a, b) {
        return d3.ascending(+a.Sort, +b.Sort);
    });
    var x = d3.scale.ordinal()
        .domain(local_data.map(function(d) {
            return d.Var;
        }))
        .rangeRoundBands([0, local_width], 0.1);

    var y = d3.scale.linear()
        .domain([0, d3.max(local_data, function(d) {
            return +d.Freq;
        })])
        .range([local_height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(0);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(4)
        .tickSize(-local_width, 0, 0);

    var days_svg = bar_svg.append("g")
        .attr("class", "local_bar")
        .attr("transform", "translate(" + local_left + "," + local_top + ")");


    days_svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + local_height + ")")
        .call(xAxis);

    days_svg.selectAll(".bar_plot")
        .data(local_data)
        .enter().append("rect")
        .attr("class", "bar_plot")
        .attr("x", function(d) {
            return x(d.Var);
        })
        .attr("width", x.rangeBand())
        .attr("y", function(d) {
            return y(+d.Freq);
        })
        .attr("height", function(d) {
            return local_height - y(+d.Freq);
        });

    days_svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    days_svg
        .append("text")
        .attr("x", local_width / 2)
        .attr("y", -20)
        .attr("text-anchor", "middle")
        .attr("class", "graph_heading")
        .text(header_text);


}
var color_scale = ['rgb(247,252,240)', 'rgb(224,243,219)', 'rgb(204,235,197)', 'rgb(168,221,181)', 'rgb(123,204,196)', 'rgb(78,179,211)', 'rgb(43,140,190)', 'rgb(8,104,172)', 'rgb(8,64,129)'];
var days = _.range(1, 32);
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var width = 780;
var height = 380;
var block_height = 25;
var block_width = 20;

var svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("shape-rendering", "crispEdges");

var bar_svg = d3.select("#bar_graphs")
    .append("svg")
    .attr("width", width)
    .attr("height", height - 200)
    .attr("shape-rendering", "crispEdges");

var brewer_svg = d3.select("#brewer")
    .append("svg")
    .attr("width", width)
    .attr("height", 50)
    .attr("shape-rendering", "crispEdges");


queue()
    .defer(d3.csv, "dates_ranked.csv")
    .defer(d3.csv, "output_days.csv")
    .defer(d3.csv, "output_months.csv")
    .await(ready);

function ready(error, csv, days, months) {
    d3.select("#loader").remove();
    data = csv;
    first_draw_graphs(csv, "Rank");
    draw_bar_chart(days, 200, 200, 80, 35, "Birthdays by Day of Week");
    draw_bar_chart(months, 350, 200, 400, 35, "Birthdays by Month");

    var color_scale_blocks = brewer_svg.selectAll(".brewer_g").data(color_scale);

    color_scale_blocks.enter().append("g").attr("class", ".brewer_g");

    color_scale_blocks
        .append("rect")
        .attr("class", "brewer_blocks")
        .attr("x", function(d, i) {
            return (i * (block_width + 3)) + 296.5;
        })
        .attr("y", 0.5)
        .attr("height", block_height)
        .attr("width", block_width)
        .attr("rx", 2)
        .attr("ry", 2)
        .attr("fill", function(d) {
            return d;
        });

    brewer_svg
        .append("text")
        .attr("x",264)
        .attr("y",18)
        .attr("text-anchor", "middle")
        .attr("class", "graph_heading")
        .text("Lowest");


    brewer_svg
        .append("text")
        .attr("x",536)
        .attr("y",18)
        .attr("text-anchor", "middle")
        .attr("class", "graph_heading")        
        .text("Highest");        

}
