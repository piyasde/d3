angular.module('AngularD3BarGraph', [])
  .directive('angulard3BarGraph', function () {
    return {
      restrict: 'A',
	  scope: {
        datajson: '=',
		xaxisName: '=',
		xaxisPos: '=',
		yaxisName: '=',
		yaxisPos: '=',
		d3Format: '='
      },
      link: function (scope, elem, attrs) {
		var margin = {top: 20, right: 20, bottom: 30, left: 40},
						width = 960 - margin.left - margin.right,
						height = 500 - margin.top - margin.bottom;

		var formatPercent = d3.format(scope.d3Format);

		var x = d3.scale.ordinal()
			.rangeRoundBands([0, width], .1);

		var y = d3.scale.linear()
			.range([height, 0]);

		var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom");

		var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left")
			.tickFormat(formatPercent);

		var svg = d3.select("#"+elem[0].id).append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		d3.json(scope.datajson, function(error, data) {
			if (error) return console.warn(error);
  
			x.domain(data.map(function(d) { return d.letter; }));
			y.domain([0, d3.max(data, function(d) { return d.frequency; })]);
  
			svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + height + ")")
				.call(xAxis)
			.append("text")
				.attr("x", scope.xaxisPos)
				.attr("dx", ".71em")
				.style("text-anchor", "end")
				.text(scope.xaxisName);

			svg.append("g")
				.attr("class", "y axis")
				.call(yAxis)
			.append("text")
				.attr("transform", "rotate(-90)")
				.attr("y", scope.yaxisPos)
				.attr("dy", ".71em")
				.style("text-anchor", "end")
				.text(scope.yaxisName);

			svg.selectAll(".bar")
				.data(data)
				.enter().append("rect")
				.attr("class", "bar")
				.attr("x", function(d) { return x(d.letter); })
				.attr("width", x.rangeBand())
				.attr("y", function(d) { return y(d.frequency); })
				.attr("height", function(d) { return height - y(d.frequency); });	
		});
      }
    }
  });
