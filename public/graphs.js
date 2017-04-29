/**
 * Created by nix on 4/29/17.
 */
window.onload = function () {
    var svg = d3.select("svg"),
        margin = {top: 20, right: 20, bottom: 50, left: 100},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var parseTime = function(d) {
        var parser = d3.timeParse("%-m,%Y");
        return parser(d.month + "," + d.year)
    };

    var x = d3.scaleTime()
        .rangeRound([0, width]);

    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    var line = d3.line()
        .x(function(d) { return x(parseTime(d)); })
        .y(function(d) { return y(d.kwh); });

    d3.json("data.json",
        function(error, data) {
            if (error) throw error;

            x.domain(d3.extent(data, function(d) { return parseTime(d); }));
            y.domain([0, d3.max(data, function(d) { return d.kwh; })]);

            g.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(
                    d3.axisBottom(x)
                        .ticks(d3.timeMonth.every(1))
                    )
                .select(".domain")
                .remove();

            g.append("g")
                .call(d3.axisLeft(y));

            g.append("path")
                .datum(data)
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr("stroke-width", 1.5)
                .attr("d", line);


            // text label for the x axis
            svg.append("text")
                .attr("transform",
                    "translate(" + (margin.left + width/2) + " ," +
                    (height + margin.top + 40) + ")")
                .style("text-anchor", "middle")
                .text("Month");

            // text label for the y axis
            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", margin.left/4)
                .attr("x", 0 - (height / 2) - margin.top)
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("Energy  (kWh)");

        });
};