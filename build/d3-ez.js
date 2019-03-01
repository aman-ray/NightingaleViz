(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('d3')) :
	typeof define === 'function' && define.amd ? define(['d3'], factory) :
	(global.d3 = global.d3 || {}, global.d3.ez = factory(global.d3));
}(this, (function (d3) { 'use strict';

var version = "3.3.14";
var license = "GPL-2.0";


/**
 * Reusable Title Component
 *
 * @module
 */
function componentTitle () {

	/* Default Properties */
	var mainText = "Title";
	var subText = "Sub Title";
	var height = 40;
	var width = 200;

	/**
  * Constructor
  *
  * @constructor
  * @alias title
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {
		selection.selectAll("#titleGroup").data([0]).enter().append("g").attr("id", "titleGroup");
		var titleGroup = selection.select("#titleGroup");

		titleGroup.selectAll(".title").data([mainText]).enter().append("text").classed("title", true).text(function (d) {
			return d;
		});
		var title = titleGroup.select(".title").text(mainText);

		titleGroup.selectAll(".subTitle").data([subText]).enter().append("text").classed("subTitle", true).text(function (d) {
			return d;
		});
		var subTitle = titleGroup.select(".subTitle").text(subText);

		// Centre Text
		// let titleOffset = 0 - (title.node().getBBox().width / 2);
		// let subTitleOffset = 0 - (subTitle.node().getBBox().width / 2);
		title.style("text-anchor", "middle").attr("transform", "translate(0, 15)");
		subTitle.style("text-anchor", "middle").attr("transform", "translate(0, 30)");
	}

	/**
  * Width Getter / Setter
  *
  * @param {number} _v - Width in px.
  * @returns {*}
  */
	my.width = function (_v) {
		if (!arguments.length) return width;
		width = _v;
		return this;
	};

	/**
  * Height Getter / Setter
  *
  * @param {number} _v - Height in px.
  * @returns {*}
  */
	my.height = function (_v) {
		if (!arguments.length) return height;
		height = _v;
		return this;
	};

	/**
  * Main Text Getter / Setter
  *
  * @param {string} _v - Main text title.
  * @returns {*}
  */
	my.mainText = function (_v) {
		if (!arguments.length) return mainText;
		mainText = _v;
		return this;
	};

	/**
  * Sub Text Getter / Setter
  *
  * @param {string} _v - Sub text description.
  * @returns {*}
  */
	my.subText = function (_v) {
		if (!arguments.length) return subText;
		subText = _v;
		return this;
	};

	return my;
}

/**
 * Chart Base
 *
 * @module
 */
function base () {

	/* Default Properties */
	var svg = void 0;
	var canvas = void 0;
	var width = 600;
	var height = 400;
	var margin = { top: 15, right: 15, bottom: 15, left: 15 };
	var canvasW = void 0;
	var canvasH = void 0;
	var chartTop = 0;
	var classed = "d3ez";

	var chart = void 0;
	var legend = void 0;
	var title = void 0;
	var yAxisLabel = "";

	var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	/**
  * Initialise Data and Scales
  *
  * @private
  * @param {Array} data - Chart data.
  */
	function init(data) {
		canvasW = width - (margin.left + margin.right);
		canvasH = height - (margin.top + margin.bottom);

		// Init Chart
		chart.dispatch(dispatch).width(canvasW).height(canvasH);

		// Init Legend
		if (legend) {
			legend.width(150).height(200);
			chart.width(chart.width() - legend.width());
		}

		// Init Title
		if (title) {
			chartTop = title.height();
			chart.height(chart.height() - title.height());
		}

		// Init Credit Tag
		// creditTag.text("d3-ez.net").href("http://d3-ez.net");
	}

	/**
  * Constructor
  *
  * @constructor
  * @alias base
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {
		// Create SVG element (if it does not exist already)
		if (!svg) {
			svg = selection.append("svg").classed(classed, true).attr("width", width).attr("height", height);

			canvas = svg.append("g").classed("canvas", true);
			canvas.append("g").classed("chartbox", true);
			canvas.append("g").classed("legendbox", true);
			canvas.append("g").classed("titlebox", true);
			//canvas.append("g").classed("creditbox", true);
		} else {
			canvas = svg.select(".canvas");
		}

		// Update the canvas dimensions
		canvas.attr("transform", "translate(" + margin.left + "," + margin.top + ")").attr("width", canvasW).attr("height", canvasH);

		selection.each(function (data) {
			init(data);

			// Chart
			canvas.select(".chartbox").datum(data).attr("transform", "translate(" + 0 + "," + chartTop + ")").call(chart);

			// Legend
			if (legend && (typeof chart.colorScale === "function" || typeof chart.sizeScale === "function")) {
				if (typeof chart.colorScale === "function") {
					legend.colorScale(chart.colorScale());
				}
				if (typeof chart.sizeScale === "function") {
					legend.sizeScale(chart.sizeScale());
				}
				canvas.select(".legendbox").attr("transform", "translate(" + (canvasW - legend.width()) + "," + title.height() + ")").call(legend);
			}

			// Title
			if (title) {
				canvas.select(".titlebox").attr("transform", "translate(" + canvasW / 2 + "," + 0 + ")").call(title);
			}
		});
	}

	/**
  * Width Getter / Setter
  *
  * @param {number} _v - Width in px.
  * @returns {*}
  */
	my.width = function (_v) {
		if (!arguments.length) return width;
		width = _v;
		return this;
	};

	/**
  * Height Getter / Setter
  *
  * @param {number} _v - Width in px.
  * @returns {*}
  */
	my.height = function (_v) {
		if (!arguments.length) return height;
		height = _v;
		return this;
	};

	/**
  * Chart Getter / Setter
  *
  * @param {d3.ez.chart} _v - Chart component.
  * @returns {*}
  */
	my.chart = function (_v) {
		if (!arguments.length) return chart;
		chart = _v;
		return this;
	};

	/**
  * Legend Getter / Setter
  *
  * @param {d3.ez.component.legend} _v - Legend component.
  * @returns {*}
  */
	my.legend = function (_v) {
		if (!arguments.length) return legend;
		legend = _v;
		return this;
	};

	/**
  * Title Getter / Setter
  *
  * @param {d3.ez.component.title} _v - Title component.
  * @returns {*}
  */
	my.title = function (_v) {
		if (!arguments.length) return title;
		if (typeof _ === "string") {
			// If the caller has passed a plain string convert it to a title object.
			title = componentTitle().mainText(_).subText("");
		} else {
			title = _v;
		}
		return this;
	};

	/**
  * Y Axix Label Getter / Setter
  *
  * @param {string} _v - Label text.
  * @returns {*}
  */
	my.yAxisLabel = function (_v) {
		if (!arguments.length) return yAxisLabel;
		yAxisLabel = _v;
		return this;
	};

	/**
  * Dispatch On Getter
  *
  * @returns {*}
  */
	my.on = function () {
		var value = dispatch.on.apply(dispatch, arguments);
		return value === dispatch ? my : value;
	};

	return my;
}

/**
 * Colour Palettes
 *
 * @module
 * @example
 * d3.ez.palette.categorical(1);
 * d3.ez.palette.diverging(1);
 * d3.ez.palette.sequential("#ff0000", 9);
 * d3.ez.palette.lumShift(d3.ez.palette.categorical(1), 0.2);
 */
var palette = {
	categorical: function categorical(index) {
		// Categorical colour palettes are the ones that are used to separate items into
		// distinct groups or categories.
		switch (index) {
			case 1:
				// Stephen Few - Show Me the Numbers Book
				//      Blue       Orange     Green      Pink       L Brown    Purple     D.Yellow   Red        Black
				return ["#5da5da", "#faa43a", "#60bd68", "#f17cb0", "#b2912f", "#b276b2", "#decf3f", "#f15854", "#4d4d4d"];
			case 2:
				// Color Brewer - http://colorbrewer2.com/
				//      Red        L.Blue     Green      Purple     Orange     Yellow     Brown      Pink       Grey
				return ["#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6", "#ffffcc", "#e5d8bd", "#fddaec", "#f2f2f2"];
			case 3:
				// Google Design - http://www.google.com/design/spec/style/color.html
				//      D. Blue    Orange     L.Green    Purple     Yellow     L.Blue     Red        D.Green    Brown
				return ["#3f51b5", "#ff9800", "#8bc34a", "#9c27b0", "#ffeb3b", "#03a9f4", "#f44336", "#009688", "#795548"];
		}
	},

	diverging: function diverging(index) {
		// Diverging colour palettes are used for quantitative data. Usually two different hues
		// that diverge from a light colour, for the critical midpoint, toward dark colours.
		switch (index) {
			case 1:
				// Color Brewer - Colourblind Safe
				return ["#8c510a", "#bf812d", "#dfc27d", "#f6e8c3", "#f5f5f5", "#c7eae5", "#80cdc1", "#35978f", "#01665e"];
			case 2:
				// Color Brewer - RAG
				return ["#d73027", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850"];
			case 3:
				// Chroma.js - http://gka.github.io/palettes/#colors=Blue,Ivory,Red|steps=9|bez=0|coL=0
				return ["#0000ff", "#8052fe", "#b58bfb", "#ddc5f7", "#fffff0", "#ffcfb4", "#ff9e7a", "#ff6842", "#ff0000"];
		}
	},

	sequential: function sequential(origHex, count) {
		// Sequential colour palettes are primarily used to encode quantitative differences.
		// Quantitative values are arranged sequentially, from low to high.
		var lumStep = 0.1;
		var lumMax = lumStep * count / 2;
		var lumMin = 0 - lumMax;

		var lumScale = d3.scaleLinear().domain([1, count]).range([lumMin, lumMax]);

		var result = [];
		for (var i = 1; i <= count; i++) {
			var lum = lumScale(i);

			// Validate and normalise Hex value.
			origHex = String(origHex).replace(/[^0-9a-f]/gi, "");
			if (origHex.length < 6) {
				origHex = origHex[0] + origHex[0] + origHex[1] + origHex[1] + origHex[2] + origHex[2];
			}

			// Convert to decimal and change luminosity
			var newHex = "#";
			var c = void 0;
			for (var j = 0; j < 3; j++) {
				c = parseInt(origHex.substr(j * 2, 2), 16);
				c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16);
				newHex += ("00" + c).substr(c.length);
			}
			result.push(newHex);
		}
		return result;
	},

	lumShift: function lumShift(colors, lum) {
		var result = [];
		colors.forEach(function addNumber(origHex, index) {
			origHex = String(origHex).replace(/[^0-9a-f]/gi, "");
			if (origHex.length < 6) {
				origHex = origHex[0] + origHex[0] + origHex[1] + origHex[1] + origHex[2] + origHex[2];
			}
			lum = lum || 0;

			// Convert to decimal and change luminosity
			var newHex = "#";
			for (var i = 0; i < 3; i++) {
				var c = parseInt(origHex.substr(i * 2, 2), 16);
				c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16);
				newHex += ("00" + c).substr(c.length);
			}
			result[index] = newHex;
		});
		return result;
	}
};

/**
 * Data Transform
 *
 * @module
 * @returns {Array}
 */
function dataTransform(data) {

	var SINGLE_SERIES = 1;
	var MULTI_SERIES = 2;
	var coordinateKeys = ['x', 'y', 'z'];

	/**
  * Data Type
  *
  * @type {Number}
  */
	var dataType = data.key !== undefined ? SINGLE_SERIES : MULTI_SERIES;

	/**
  * Row Key
  *
  * @returns {Array}
  */
	var rowKey = function () {
		if (dataType === SINGLE_SERIES) {
			return d3.values(data)[0];
		}
	}();

	/**
  * Row Total
  *
  * @returns {Array}
  */
	var rowTotal = function () {
		if (dataType === SINGLE_SERIES) {
			return d3.sum(data.values, function (d) {
				return d.value;
			});
		}
	}();

	/**
  * Row Keys
  *
  * @returns {Array}
  */
	var rowKeys = function () {
		if (dataType === MULTI_SERIES) {
			return data.map(function (d) {
				return d.key;
			});
		}
	}();

	/**
  * Row Totals
  *
  * @returns {Array}
  */
	var rowTotals = function () {
		if (dataType === MULTI_SERIES) {
			var ret = {};
			d3.map(data).values().forEach(function (d) {
				var rowKey = d.key;
				d.values.forEach(function (d) {
					ret[rowKey] = typeof ret[rowKey] === "undefined" ? 0 : ret[rowKey];
					ret[rowKey] += d.value;
				});
			});
			return ret;
		}
	}();

	/**
  * Row Totals Max
  *
  * @returns {number}
  */
	var rowTotalsMax = function () {
		if (dataType === MULTI_SERIES) {
			return d3.max(d3.values(rowTotals));
		}
	}();

	/**
  * Row Value Keys
  *
  * @returns {Array}
  */
	var rowValuesKeys = function () {
		if (dataType === SINGLE_SERIES) {
			return Object.keys(data.values[0]);
		} else {
			return Object.keys(data[0].values[0]);
		}
	}();

	/**
  * Union Two Arrays
  *
  * @private
  * @param {Array} array1 - First Array.
  * @param {Array} array2 - First Array.
  * @returns {Array}
  */
	var union = function union(array1, array2) {
		var ret = [];
		var arr = array1.concat(array2);
		var len = arr.length;
		var assoc = {};

		while (len--) {
			var item = arr[len];

			if (!assoc[item]) {
				ret.unshift(item);
				assoc[item] = true;
			}
		}

		return ret;
	};

	/**
  * Column Keys
  *
  * @returns {Array}
  */
	var columnKeys = function () {
		if (dataType === SINGLE_SERIES) {
			return d3.values(data.values).map(function (d) {
				return d.key;
			});
		}

		var ret = [];
		d3.map(data).values().forEach(function (d) {
			var tmp = [];
			d.values.forEach(function (d, i) {
				tmp[i] = d.key;
			});
			ret = union(tmp, ret);
		});

		return ret;
	}();

	/**
  * Column Totals
  *
  * @returns {Array}
  */
	var columnTotals = function () {
		if (dataType !== MULTI_SERIES) {
			return;
		}

		var ret = {};
		d3.map(data).values().forEach(function (d) {
			d.values.forEach(function (d) {
				var columnName = d.key;
				ret[columnName] = typeof ret[columnName] === "undefined" ? 0 : ret[columnName];
				ret[columnName] += d.value;
			});
		});

		return ret;
	}();

	/**
  * Column Totals Max
  *
  * @returns {Array}
  */
	var columnTotalsMax = function () {
		if (dataType === MULTI_SERIES) {
			return d3.max(d3.values(columnTotals));
		}
	}();

	/**
  * Value Min
  *
  * @returns {number}
  */
	var valueMin = function () {
		if (dataType === SINGLE_SERIES) {
			return d3.min(data.values, function (d) {
				return +d.value;
			});
		}

		var ret = void 0;
		d3.map(data).values().forEach(function (d) {
			d.values.forEach(function (d) {
				ret = typeof ret === "undefined" ? d.value : d3.min([ret, +d.value]);
			});
		});

		return +ret;
	}();

	/**
  * Value Max
  *
  * @returns {number}
  */
	var valueMax = function () {
		var ret = void 0;

		if (dataType === SINGLE_SERIES) {
			ret = d3.max(data.values, function (d) {
				return +d.value;
			});
		} else {
			d3.map(data).values().forEach(function (d) {
				d.values.forEach(function (d) {
					ret = typeof ret !== "undefined" ? d3.max([ret, +d.value]) : +d.value;
				});
			});
		}

		return ret;
	}();

	/**
  * Value Extent
  *
  * @returns {Array}
  */
	var valueExtent = function () {
		return [valueMin, valueMax];
	}();

	/**
  * Coordinates Min
  *
  * @returns {Array}
  */
	var coordinatesMin = function () {
		var ret = {};

		if (dataType === SINGLE_SERIES) {
			coordinateKeys.forEach(function (key) {
				ret[key] = d3.min(data.values, function (d) {
					return +d[key];
				});
			});
			return ret;
		} else {
			d3.map(data).values().forEach(function (d) {
				d.values.forEach(function (d) {
					coordinateKeys.forEach(function (key) {
						ret[key] = key in ret ? d3.min([ret[key], +d[key]]) : d[key];
					});
				});
			});
		}

		return ret;
	}();

	/**
  * Coordinates Max
  *
  * @returns {Array}
  */
	var coordinatesMax = function () {
		var ret = {};

		if (dataType === SINGLE_SERIES) {
			coordinateKeys.forEach(function (key) {
				ret[key] = d3.max(data.values, function (d) {
					return +d[key];
				});
			});
			return ret;
		} else {
			d3.map(data).values().forEach(function (d) {
				d.values.forEach(function (d) {
					coordinateKeys.forEach(function (key) {
						ret[key] = key in ret ? d3.max([ret[key], +d[key]]) : d[key];
					});
				});
			});
		}

		return ret;
	}();

	/**
  * Coordinates Extent
  *
  * @returns {Array}
  */
	var coordinatesExtent = function () {
		var ret = {};
		coordinateKeys.forEach(function (key) {
			ret[key] = [coordinatesMin[key], coordinatesMax[key]];
		});

		return ret;
	}();

	/**
  * How Many Decimal Places?
  *
  * @private
  * @param {number} num - Float.
  * @returns {number}
  */
	var decimalPlaces = function decimalPlaces(num) {
		var match = ("" + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
		if (!match) {
			return 0;
		}

		return Math.max(0,
		// Number of digits right of decimal point.
		(match[1] ? match[1].length : 0) - (
		// Adjust for scientific notation.
		match[2] ? +match[2] : 0));
	};

	/**
  * Max Decimal Place
  *
  * @returns {number}
  */
	var maxDecimalPlace = function () {
		var ret = 0;
		if (dataType === MULTI_SERIES) {
			d3.map(data).values().forEach(function (d) {
				d.values.forEach(function (d) {
					ret = d3.max([ret, decimalPlaces(d.value)]);
				});
			});
		}

		// toFixed must be between 0 and 20
		return ret > 20 ? 20 : ret;
	}();

	/**
  * Thresholds
  *
  * @returns {Array}
  */
	var thresholds = function () {
		var distance = valueMax - valueMin;
		var bands = [0.15, 0.40, 0.55, 0.90];

		return bands.map(function (v) {
			return Number((valueMin + v * distance).toFixed(maxDecimalPlace));
		});
	}();

	/**
  * Summary
  *
  * @returns {Array}
  */
	var summary = function summary() {
		return {
			dataType: dataType,
			rowKey: rowKey,
			rowTotal: rowTotal,
			rowKeys: rowKeys,
			rowTotals: rowTotals,
			rowTotalsMax: rowTotalsMax,
			rowValuesKeys: rowValuesKeys,
			columnKeys: columnKeys,
			columnTotals: columnTotals,
			columnTotalsMax: columnTotalsMax,
			valueMin: valueMin,
			valueMax: valueMax,
			valueExtent: valueExtent,
			coordinatesMin: coordinatesMin,
			coordinatesMax: coordinatesMax,
			coordinatesExtent: coordinatesExtent,
			maxDecimalPlace: maxDecimalPlace,
			thresholds: thresholds
		};
	};

	/**
  * Rotate Data
  *
  * @returns {Array}
  */
	var rotate = function rotate() {
		var columnKeys = data.map(function (d) {
			return d.key;
		});
		var rowKeys = data[0].values.map(function (d) {
			return d.key;
		});

		var rotated = rowKeys.map(function (rowKey, rowIndex) {
			var values = columnKeys.map(function (columnKey, columnIndex) {
				// Copy the values from the original object
				var values = _extends({}, data[columnIndex].values[rowIndex]);
				// Swap the key over
				values.key = columnKey;

				return values;
			});

			return {
				key: rowKey,
				values: values
			};
		});

		return rotated;
	};

	return {
		summary: summary,
		rotate: rotate
	};
}




/**
 * Reusable Circular Axis Component
 *
 * @module
 */
function componentCircularAxis () {

	/* Default Properties */
	var width = 300;
	var height = 300;
	var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
	var radius = void 0;
	var radialScale = void 0;
	var ringScale = void 0;

	/**
  * Constructor
  *
  * @constructor
  * @alias circularAxis
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {
		if (typeof radius === "undefined") {
			radius = Math.min(width, height) / 2;
		}

		// Create axis group
		var axisSelect = selection.selectAll(".axis").data([0]);

		var axis = axisSelect.enter().append("g").classed("axis", true).on("click", function (d) {
			dispatch.call("customClick", this, d);
		}).merge(axisSelect);

		// Outer circle
		var outerCircle = axis.selectAll(".outerCircle").data([radius]).enter().append("circle").classed("outerCircle", true).attr("r", function (d) {
			return d;
		}).style("fill", "none").attr("stroke-width", 2).attr("stroke", "#ddd");

		// Tick Data Generator
		var tickData = function tickData() {
			var tickArray = void 0,
			    tickPadding = void 0;
			if (typeof ringScale.ticks === "function") {
				// scaleLinear
				tickArray = ringScale.ticks();
				tickPadding = 0;
			} else {
				// scaleBand
				tickArray = ringScale.domain();
				tickPadding = ringScale.bandwidth() / 2;
			}

			return tickArray.map(function (d) {
				return {
					value: d,
					radius: ringScale(d),
					padding: tickPadding
				};
			});
		};

		var tickCirclesGroupSelect = axis.selectAll(".tickCircles").data(function () {
			return [tickData()];
		});

		var tickCirclesGroup = tickCirclesGroupSelect.enter().append("g").classed("tickCircles", true).merge(tickCirclesGroupSelect);

		var tickCircles = tickCirclesGroup.selectAll("circle").data(function (d) {
			return d;
		});

		tickCircles.enter().append("circle").style("fill", "none").attr("stroke-width", 1).attr("stroke", "#ddd").merge(tickCircles).transition().attr("r", function (d) {
			return d.radius + d.padding;
		});

		tickCircles.exit().remove();

		// Spoke Data Generator
		var spokeData = function spokeData() {
			var spokeCount = 0;
			var spokeArray = [];
			if (typeof radialScale.ticks === "function") {
				// scaleLinear
				var min = d3.min(radialScale.domain());
				var max = d3.max(radialScale.domain());
				spokeCount = radialScale.ticks().length;
				var spokeIncrement = (max - min) / spokeCount;
				for (var i = 0; i <= spokeCount; i++) {
					spokeArray[i] = (spokeIncrement * i).toFixed(0);
				}
			} else {
				// scaleBand
				spokeArray = radialScale.domain();
				spokeCount = spokeArray.length;
				spokeArray.push("");
			}

			var spokeScale = d3.scaleLinear().domain([0, spokeCount]).range(radialScale.range());

			return spokeArray.map(function (d, i) {
				return {
					value: d,
					rotate: spokeScale(i)
				};
			});
		};

		var spokesGroupSelect = axis.selectAll(".spokes").data(function () {
			return [spokeData()];
		});

		var spokesGroup = spokesGroupSelect.enter().append("g").classed("spokes", true).merge(spokesGroupSelect);

		var spokes = spokesGroup.selectAll("line").data(function (d) {
			return d;
		});

		spokes.enter().append("line").attr("id", function (d) {
			return d.value;
		}).attr("y2", -radius).merge(spokes).attr("transform", function (d) {
			return "rotate(" + d.rotate + ")";
		});

		spokes.exit().remove();
	}

	/**
  * Width Getter / Setter
  *
  * @param {number} _v - Width in px.
  * @returns {*}
  */
	my.height = function (_v) {
		if (!arguments.length) return height;
		height = _v;
		return this;
	};

	/**
  * Height Getter / Setter
  *
  * @param {number} _v - Height in px.
  * @returns {*}
  */
	my.width = function (_v) {
		if (!arguments.length) return width;
		width = _v;
		return this;
	};

	/**
  * Radius Getter / Setter
  *
  * @param {number} _v - Radius in px.
  * @returns {*}
  */
	my.radius = function (_v) {
		if (!arguments.length) return radius;
		radius = _v;
		return this;
	};

	/**
  * Radial Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 scale.
  * @returns {*}
  */
	my.radialScale = function (_v) {
		if (!arguments.length) return radialScale;
		radialScale = _v;
		return my;
	};

	/**
  * Ring Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 scale.
  * @returns {*}
  */
	my.ringScale = function (_v) {
		if (!arguments.length) return ringScale;
		ringScale = _v;
		return my;
	};

	return my;
}

/**
 * Reusable Radial Labels Component
 *
 * @module
 */
function componentCircularRingLabels () {

	/* Default Properties */
	var width = 300;
	var height = 300;
	var radius = void 0;
	var startAngle = 0;
	var endAngle = 360;
	var capitalizeLabels = false;
	var textAnchor = "centre";
	var radialScale = void 0;

	/**
  * Constructor
  *
  * @constructor
  * @alias circularRingLabels
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {
		if (typeof radius === "undefined") {
			radius = Math.min(width, height) / 2;
		}

		var labelsSelect = selection.selectAll(".radialLabels").data([0]);

		var labels = labelsSelect.enter().append("g").classed("radialLabels", true).merge(labelsSelect);

		var radData = radialScale.domain();

		var defSelect = labels.selectAll("def").data(radData);

		defSelect.enter().append("def").append("path").attr("id", function (d, i) {
			return "radialLabelPath" + "-" + i;
		}).attr("d", function (d) {
			var r = radialScale(d);
			var arc = d3.arc().outerRadius(r).innerRadius(r);
			var pathConf = {
				startAngle: startAngle * Math.PI / 180,
				endAngle: endAngle * Math.PI / 180
			};
			var pathStr = arc(pathConf).split(/[A-Z]/);
			return "M" + pathStr[1] + "A" + pathStr[2];
		});

		var textSelect = labels.selectAll("text").data(radData);

		textSelect.enter().append("text").style("text-anchor", "start").attr("dy", -5).attr("dx", 5).append("textPath").attr("xlink:href", function (d, i) {
			return "#radialLabelPath" + "-" + i;
		}).attr("startOffset", "0%").text(function (d) {
			return d;
		});
	}

	/**
  * Width Getter / Setter
  *
  * @param {number} _v - Width in px.
  * @returns {*}
  */
	my.height = function (_v) {
		if (!arguments.length) return height;
		height = _v;
		return this;
	};

	/**
  * Height Getter / Setter
  *
  * @param {number} _v - Height in px.
  * @returns {*}
  */
	my.width = function (_v) {
		if (!arguments.length) return width;
		width = _v;
		return this;
	};

	/**
  * Radius Getter / Setter
  *
  * @param {number} _v - Radius in px.
  * @returns {*}
  */
	my.radius = function (_v) {
		if (!arguments.length) return radius;
		radius = _v;
		return this;
	};

	/**
  * Start Angle Getter / Setter
  *
  * @param {number} _v - Angle in degrees.
  * @returns {*}
  */
	my.startAngle = function (_v) {
		if (!arguments.length) return startAngle;
		startAngle = _v;
		return this;
	};

	/**
  * End Angle Getter / Setter
  *
  * @param {number} _v - Angle in degrees.
  * @returns {*}
  */
	my.endAngle = function (_v) {
		if (!arguments.length) return endAngle;
		endAngle = _v;
		return this;
	};

	/**
  * Capital Label Getter / Setter
  *
  * @param {boolean} _v - Capitalize labels.
  * @returns {*}
  */
	my.capitalizeLabels = function (_v) {
		if (!arguments.length) return capitalizeLabels;
		capitalizeLabels = _v;
		return this;
	};

	/**
  * Radial Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 scale.
  * @returns {*}
  */
	my.radialScale = function (_v) {
		if (!arguments.length) return radialScale;
		radialScale = _v;
		return my;
	};

	/**
  * Text Anchor Getter / Setter
  *
  * @param {string} _v - Anchor name.
  * @returns {*}
  */
	my.textAnchor = function (_v) {
		if (!arguments.length) return textAnchor;
		textAnchor = _v;
		return this;
	};

	return my;
}

/**
 * Reusable Circular Labels Component
 *
 * @module
 */
function componentCircularSectorLabels () {

	/* Default Properties */
	var width = 300;
	var height = 300;
	var radius = void 0;
	var startAngle = 0;
	var endAngle = 360;
	var capitalizeLabels = false;
	var textAnchor = "centre";
	var radialScale = void 0;

	/**
  * Constructor
  *
  * @constructor
  * @alias circularSectorLabels
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {
		if (typeof radius === "undefined") {
			radius = Math.min(width, height) / 2;
		}

		// Tick Data Generator
		var tickData = function tickData() {
			var tickCount = 0;
			var tickArray = [];

			if (typeof radialScale.ticks === "function") {
				// scaleLinear
				var min = d3.min(radialScale.domain());
				var max = d3.max(radialScale.domain());
				tickCount = radialScale.ticks().length;
				var tickIncrement = (max - min) / tickCount;
				for (var i = 0; i <= tickCount; i++) {
					tickArray[i] = (tickIncrement * i).toFixed(0);
				}
			} else {
				// scaleBand
				tickArray = radialScale.domain();
				tickCount = tickArray.length;
			}

			var tickScale = d3.scaleLinear().domain([0, tickCount]).range(radialScale.range());

			return tickArray.map(function (d, i) {
				return {
					value: d,
					offset: tickScale(i) / 360 * 100
				};
			});
		};

		// Unique id so that the text path defs are unique - is there a better way to do this?
		var uId = selection.attr("id") ? selection.attr("id") : "uid-" + Math.floor(1000 + Math.random() * 9000);
		selection.attr("id", uId);

		var labelsSelect = selection.selectAll(".circularLabels").data(function () {
			return [tickData()];
		});

		var labels = labelsSelect.enter().append("g").classed("circularLabels", true).merge(labelsSelect);

		// Labels
		var defSelect = labels.selectAll("def").data([radius]);

		defSelect.enter().append("def").append("path").attr("id", function () {
			var pathId = selection.attr("id") + "-path";
			return pathId;
		}).attr("d", function (d) {
			return "m0 " + -d + " a" + d + " " + d + " 0 1,1 -0.01 0";
		}).merge(defSelect);

		defSelect.exit().remove();

		var textSelect = labels.selectAll("text").data(function (d) {
			return d;
		});

		textSelect.enter().append("text").style("text-anchor", textAnchor).append("textPath").attr("xlink:href", function () {
			var pathId = selection.attr("id") + "-path";
			return "#" + pathId;
		}).text(function (d) {
			var text = d.value;
			return capitalizeLabels ? text.toUpperCase() : text;
		}).attr("startOffset", function (d) {
			return d.offset + "%";
		}).attr("id", function (d) {
			return d.value;
		}).merge(textSelect);

		textSelect.transition().select("textPath").text(function (d) {
			var text = d.value;
			return capitalizeLabels ? text.toUpperCase() : text;
		}).attr("startOffset", function (d) {
			return d.offset + "%";
		});

		textSelect.exit().remove();
	}

	/**
  * Width Getter / Setter
  *
  * @param {number} _v - Width in px.
  * @returns {*}
  */
	my.height = function (_v) {
		if (!arguments.length) return height;
		height = _v;
		return this;
	};

	/**
  * Height Getter / Setter
  *
  * @param {number} _v - Height in px.
  * @returns {*}
  */
	my.width = function (_v) {
		if (!arguments.length) return width;
		width = _v;
		return this;
	};

	/**
  * Radius Getter / Setter
  *
  * @param {number} _v - Radius in px.
  * @returns {*}
  */
	my.radius = function (_v) {
		if (!arguments.length) return radius;
		radius = _v;
		return this;
	};

	/**
  * Start Angle Getter / Setter
  *
  * @param {number} _v - Angle in degrees.
  * @returns {*}
  */
	my.startAngle = function (_v) {
		if (!arguments.length) return startAngle;
		startAngle = _v;
		return this;
	};

	/**
  * End Angle Getter / Setter
  *
  * @param {number} _v - Angle in degrees.
  * @returns {*}
  */
	my.endAngle = function (_v) {
		if (!arguments.length) return endAngle;
		endAngle = _v;
		return this;
	};

	/**
  * Capital Label Getter / Setter
  *
  * @param {boolean} _v - Capitalize labels.
  * @returns {*}
  */
	my.capitalizeLabels = function (_v) {
		if (!arguments.length) return capitalizeLabels;
		capitalizeLabels = _v;
		return this;
	};

	/**
  * Radial Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 scale.
  * @returns {*}
  */
	my.radialScale = function (_v) {
		if (!arguments.length) return radialScale;
		radialScale = _v;
		return my;
	};

	/**
  * Text Anchor Getter / Setter
  *
  * @param {string} _v - Anchor name.
  * @returns {*}
  */
	my.textAnchor = function (_v) {
		if (!arguments.length) return textAnchor;
		textAnchor = _v;
		return this;
	};

	return my;
}


/**
 * Reusable Rose Chart Sector
 *
 * @module
 */
function componentRoseChartSector () {

	/* Default Properties */
	var width = 300;
	var height = 300;
	var transition = { ease: d3.easeBounce, duration: 500 };
	var radius = void 0;
	var startAngle = 0;
	var endAngle = 45;
	var colors = palette.categorical(3);
	var colorScale = void 0;
	var xScale = void 0;
	var yScale = void 0;
	var stacked = false;
	var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
	var classed = "roseChartSector";

	/**
  * Initialise Data and Scales
  *
  * @private
  * @param {Array} data - Chart data.
  */
	function init(data) {
		var _dataTransform$summar = dataTransform(data).summary(),
		    columnKeys = _dataTransform$summar.columnKeys,
		    valueMax = _dataTransform$summar.valueMax,
		    rowTotalsMax = _dataTransform$summar.rowTotalsMax;

		var max = stacked ? rowTotalsMax : valueMax;
		var valueExtent = [0, max];

		if (typeof radius === "undefined") {
			radius = Math.min(width, height) / 2;
		}

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleOrdinal().domain(columnKeys).range(colors);
		}

		if (typeof xScale !== "undefined") {
			startAngle = xScale(data.key);
			endAngle = xScale(data.key) + xScale.bandwidth();
		}

		if (typeof yScale === "undefined") {
			yScale = d3.scaleLinear().domain(valueExtent).range([0, radius]);
		}
	}

	/**
  * Constructor
  *
  * @constructor
  * @alias roseChartSector
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {
		init(selection.data());
		selection.each(function () {
			// Stack Generator
			var stacker = function stacker(data) {
				// Calculate inner and outer radius values
				var series = [];
				var innerRadius = 0;
				var outerRadius = 0;
				data.forEach(function (d, i) {
					outerRadius = innerRadius + d.value;
					series[i] = {
						key: d.key,
						value: d.value,
						innerRadius: yScale(innerRadius),
						outerRadius: yScale(outerRadius)
					};
					innerRadius += stacked ? d.value : 0;
				});

				return series;
			};

			// Arc Generator
			var arc = d3.arc().innerRadius(function (d) {
				return d.innerRadius;
			}).outerRadius(function (d) {
				return d.outerRadius;
			}).startAngle(startAngle * (Math.PI / 180)).endAngle(endAngle * (Math.PI / 180));

			// Update series group
			var seriesGroup = d3.select(this);
			seriesGroup.classed(classed, true).attr("id", function (d) {
				return d.key;
			}).on("mouseover", function (d) {
				dispatch.call("customSeriesMouseOver", this, d);
			}).on("click", function (d) {
				dispatch.call("customSeriesClick", this, d);
			});

			// Add arcs to series group
			var arcs = seriesGroup.selectAll(".arc").data(function (d) {
				return stacker(d.values);
			});

			arcs.enter().append("path").classed("arc", true).attr("fill", function (d) {
				return colorScale(d.key);
			}).on("mouseover", function (d) {
				dispatch.call("customValueMouseOver", this, d);
			}).on("click", function (d) {
				dispatch.call("customValueClick", this, d);
			}).merge(arcs).transition().ease(transition.ease).duration(transition.duration).attr("d", arc);

			arcs.exit().transition().style("opacity", 0).remove();
		});
	}

	/**
  * Width Getter / Setter
  *
  * @param {number} _v - Width in px.
  * @returns {*}
  */
	my.width = function (_v) {
		if (!arguments.length) return width;
		width = _v;
		return this;
	};

	/**
  * Height Getter / Setter
  *
  * @param {number} _v - Height in px.
  * @returns {*}
  */
	my.height = function (_v) {
		if (!arguments.length) return height;
		height = _v;
		return this;
	};

	/**
  * Radius Getter / Setter
  *
  * @param {number} _v - Radius in px.
  * @returns {*}
  */
	my.radius = function (_v) {
		if (!arguments.length) return radius;
		radius = _v;
		return this;
	};

	/**
  * Start Angle Getter / Setter
  *
  * @param {number} _v - Angle in degrees.
  * @returns {*}
  */
	my.startAngle = function (_v) {
		if (!arguments.length) return startAngle;
		startAngle = _v;
		return this;
	};

	/**
  * End Angle Getter / Setter
  *
  * @param {number} _v - Angle in degrees.
  * @returns {*}
  */
	my.endAngle = function (_v) {
		if (!arguments.length) return endAngle;
		endAngle = _v;
		return this;
	};

	/**
  * Color Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 color scale.
  * @returns {*}
  */
	my.colorScale = function (_v) {
		if (!arguments.length) return colorScale;
		colorScale = _v;
		return my;
	};

	/**
  * Colors Getter / Setter
  *
  * @param {Array} _v - Array of colours used by color scale.
  * @returns {*}
  */
	my.colors = function (_v) {
		if (!arguments.length) return colors;
		colors = _v;
		return my;
	};

	/**
  * X Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 scale.
  * @returns {*}
  */
	my.xScale = function (_v) {
		if (!arguments.length) return xScale;
		xScale = _v;
		return my;
	};

	/**
  * Y Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 scale.
  * @returns {*}
  */
	my.yScale = function (_v) {
		if (!arguments.length) return yScale;
		yScale = _v;
		return my;
	};

	/**
  * Stacked Getter / Setter
  *
  * @param {boolean} _v - Stacked bars or grouped?
  * @returns {*}
  */
	my.stacked = function (_v) {
		if (!arguments.length) return stacked;
		stacked = _v;
		return my;
	};

	/**
  * Dispatch Getter / Setter
  *
  * @param {d3.dispatch} _v - Dispatch event handler.
  * @returns {*}
  */
	my.dispatch = function (_v) {
		if (!arguments.length) return dispatch();
		dispatch = _v;
		return this;
	};

	/**
  * Dispatch On Getter
  *
  * @returns {*}
  */
	my.on = function () {
		var value = dispatch.on.apply(dispatch, arguments);
		return value === dispatch ? my : value;
	};

	return my;
}

/**
 * Reusable Size Legend Component
 *
 * @module
 */
function componentLegendSize () {

	/* Default Properties */
	var width = 100;
	var height = 200;
	var sizeScale = void 0;
	var itemCount = 4;

	/**
  * Constructor
  *
  * @constructor
  * @alias legendSize
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {
		height = height ? height : this.attr("height");
		width = width ? width : this.attr("width");

		// Legend Box
		var legendSelect = selection.selectAll("#legendBox").data([0]);

		var legend = legendSelect.enter().append("g").attr("id", "legendBox").attr("width", width).attr("height", height).merge(legendSelect);

		var data = function data() {
			// Calculate radiusScale
			var domainMin = parseFloat(d3.min(sizeScale.domain()));
			var domainMax = parseFloat(d3.max(sizeScale.domain()));
			var increment = (domainMax - domainMin) / itemCount;
			var ranges = Array(itemCount).fill().map(function (v, i) {
				var rangeStart = domainMin + increment * i;
				var rangeEnd = domainMin + increment * (i + 1);
				return [rangeStart, rangeEnd];
			});

			// Calculate yScale
			var yStep = height / (itemCount * 2);
			var yDomain = [0, itemCount - 1];
			var yRange = [yStep, height - yStep];
			var yScale = d3.scaleLinear().domain(yDomain).range(yRange);

			return ranges.map(function (v, i) {
				return {
					x: sizeScale(domainMax),
					y: yScale(i),
					r: sizeScale(ranges[i][0]),
					text: v[0].toFixed(0) + " - " + v[1].toFixed(0)
				};
			});
		};

		var itemsSelect = legend.selectAll(".legendItem").data(data);

		var items = itemsSelect.enter().append("g").classed("legendItem", true).attr("transform", function (d) {
			return "translate(0," + d.y + ")";
		}).merge(itemsSelect);

		items.exit().remove();

		items.append("circle").attr("r", function (d) {
			return d.r;
		}).attr("cx", function (d) {
			return d.x;
		}).attr("fill", "lightgrey").attr("stroke", "grey").attr("stroke-width", 1);

		items.append("text").text(function (d) {
			return d.text;
		}).attr("dominant-baseline", "middle").attr("x", function (d) {
			return d.x * 2 + 5;
		});
	}

	/**
  * Width Getter / Setter
  *
  * @param {number} _v - Width in px.
  * @returns {*}
  */
	my.width = function (_v) {
		if (!arguments.length) return width;
		width = _v;
		return my;
	};

	/**
  * Height Getter / Setter
  *
  * @param {number} _v - Height in px.
  * @returns {*}
  */
	my.height = function (_v) {
		if (!arguments.length) return height;
		height = _v;
		return my;
	};

	/**
  * Size Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 size scale.
  * @returns {*}
  */
	my.sizeScale = function (_v) {
		if (!arguments.length) return sizeScale;
		sizeScale = _v;
		return my;
	};

	/**
  * Item Count Getter / Setter
  *
  * @param {number} _v - Number of items.
  * @returns {*}
  */
	my.itemCount = function (_v) {
		if (!arguments.length) return itemCount;
		itemCount = _v;
		return my;
	};

	return my;
}

/**
 * Reusable Categorical Legend Component
 *
 * @module
 */
function componentLegendColor () {

	/* Default Properties */
	var width = 100;
	var height = 200;
	var colorScale = void 0;
	var itemCount = void 0;
	var itemType = "rect";

	/**
  * Constructor
  *
  * @constructor
  * @alias legendColor
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {
		height = height ? height : this.attr("height");
		width = width ? width : this.attr("width");

		// Legend Box
		var legendSelect = selection.selectAll("#legendBox").data([0]);

		var legend = legendSelect.enter().append("g").attr("id", "legendBox").attr("width", width).attr("height", height).merge(legendSelect);

		var data = function data() {
			var domain = colorScale.domain();
			itemCount = domain.length;
			var itemHeight = height / itemCount / 2;
			var itemWidth = 20;

			return domain.map(function (v, i) {
				return {
					y: 10 + itemHeight * 2 * i,
					width: itemWidth,
					height: itemHeight,
					color: colorScale(v),
					text: v
				};
			});
		};

		var itemsSelect = legend.selectAll(".legendItem").data(data);

		var items = itemsSelect.enter().append("g").classed("legendItem", true).attr("transform", function (d) {
			return "translate(0," + d.y + ")";
		}).merge(itemsSelect);

		items.exit().remove();

		switch (itemType) {
			case "line":
				items.append("line").attr("x1", 0).attr("y1", function (d) {
					return d.height / 2;
				}).attr("x2", function (d) {
					return d.width;
				}).attr("y2", function (d) {
					return d.height / 2;
				}).attr("stroke", function (d) {
					return d.color;
				}).attr("stroke-width", 2);
				break;

			case "rect":
			default:
				items.append("rect").attr("width", function (d) {
					return d.width;
				}).attr("height", function (d) {
					return d.height;
				}).style("fill", function (d) {
					return d.color;
				}).attr("stroke", "#dddddd").attr("stroke-width", 1);
				break;
		}

		items.append("text").text(function (d) {
			return d.text;
		}).attr("dominant-baseline", "middle").attr("x", 40).attr("y", function (d) {
			return d.height / 2;
		});
	}

	/**
  * Width Getter / Setter
  *
  * @param {number} _v - Width in px.
  * @returns {*}
  */
	my.width = function (_v) {
		if (!arguments.length) return width;
		width = _v;
		return my;
	};

	/**
  * Height Getter / Setter
  *
  * @param {number} _v - Height in px.
  * @returns {*}
  */
	my.height = function (_v) {
		if (!arguments.length) return height;
		height = _v;
		return my;
	};

	/**
  * Color Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 color scale.
  * @returns {*}
  */
	my.colorScale = function (_v) {
		if (!arguments.length) return colorScale;
		colorScale = _v;
		return my;
	};

	/**
  * Item Type Getter / Setter
  *
  * @param {string} _v - Item type (‘rect’, ‘circle’).
  * @returns {*}
  */
	my.itemType = function (_v) {
		if (!arguments.length) return itemType;
		itemType = _v;
		return my;
	};

	return my;
}

/**
 * Reusable Threshold Legend Component
 *
 * @module
 * @see https://bl.ocks.org/mbostock/4573883
 */
function componentLegendThreshold () {

	/* Default Properties */
	var width = 100;
	var height = 200;
	var thresholdScale = void 0;

	/**
  * Constructor
  *
  * @constructor
  * @alias legendThreshold
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {
		height = height ? height : this.attr("height");
		width = width ? width : this.attr("width");

		// Legend Box
		var legendSelect = selection.selectAll("#legendBox").data([0]);

		var legend = legendSelect.enter().append("g").attr("id", "legendBox").attr("width", width).attr("height", height).merge(legendSelect);

		var domainMin = d3.min(thresholdScale.domain());
		var domainMax = d3.max(thresholdScale.domain());
		var domainMargin = (domainMax - domainMin) * 0.1;

		var x = d3.scaleLinear().domain([domainMin - domainMargin, domainMax + domainMargin]).range([0, height]);

		var xAxis = d3.axisRight(x).tickSize(30).tickValues(thresholdScale.domain());

		var axis = legend.call(xAxis);
		axis.select(".domain").remove();

		axis.selectAll("rect").data(thresholdScale.range().map(function (color) {
			var d = thresholdScale.invertExtent(color);
			if (typeof d[0] === 'undefined') d[0] = x.domain()[0];
			if (typeof d[1] === 'undefined') d[1] = x.domain()[1];
			return d;
		})).enter().insert("rect", ".tick").attr("width", 20).attr("y", function (d) {
			return x(d[0]);
		}).attr("height", function (d) {
			return x(d[1]) - x(d[0]);
		}).attr("fill", function (d) {
			return thresholdScale(d[0]);
		});
	}

	/**
  * Width Getter / Setter
  *
  * @param {number} _v - Width in px.
  * @returns {*}
  */
	my.width = function (_v) {
		if (!arguments.length) return width;
		width = _v;
		return my;
	};

	/**
  * Height Getter / Setter
  *
  * @param {number} _v - Height in px.
  * @returns {*}
  */
	my.height = function (_v) {
		if (!arguments.length) return height;
		height = _v;
		return my;
	};

	/**
  * Threshold Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 scale.
  * @returns {*}
  */
	my.thresholdScale = function (_v) {
		if (!arguments.length) return thresholdScale;
		thresholdScale = _v;
		return my;
	};

	return my;
}

/**
 * Reusable Legend Component
 *
 * @module
 */
function componentLegend () {

	/* Default Properties */
	var width = 100;
	var height = 150;
	var sizeScale = void 0;
	var colorScale = void 0;
	var title = void 0;
	var legend = void 0;

	var opacity = 0.7;

	/**
  * Constructor
  *
  * @constructor
  * @alias legend
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {
		height = height ? height : this.attr("height");
		width = width ? width : this.attr("width");

		// Legend Box
		var legendBox = selection.selectAll("#legendBox").data([0]).enter().append("g").attr("id", "legendBox");

		legendBox.append("rect").attr("width", width).attr("height", height).attr("fill-opacity", opacity).attr("fill", "#ffffff").attr("stroke-width", 1).attr("stroke", "#000000");

		// Size Legend
		if (typeof sizeScale !== "undefined") {
			legend = componentLegendSize().sizeScale(sizeScale).itemCount(4);
		}

		// Colour Legend
		if (typeof colorScale !== "undefined") {
			if (scaleType(colorScale) === "threshold") {
				legend = componentLegendThreshold().thresholdScale(colorScale);
			} else {
				legend = componentLegendColor().colorScale(colorScale).itemType("rect");
			}
		}

		legendBox.append("g").attr("transform", "translate(10, 10)").append("text").style("font-weight", "bold").attr("dominant-baseline", "hanging").text(title);

		legend.width(width - 20).height(height - 40);
		legendBox.append("g").attr("transform", "translate(10, 30)").call(legend);
	}

	/**
  * Detect Scale Type
  *
  * @param {d3.scale} scale - Scale type.
  *
  * @returns {string}
  */
	function scaleType(scale) {
		var s = scale.copy();
		if (s.domain([1, 2]).range([1, 2])(1.5) === 1) {
			return "ordinal";
		} else if (typeof s.invert !== "function") {
			return "threshold";
		} else if (s.domain([1, 2]).range([1, 2]).invert(1.5) === 1.5) {
			return "linear";
		} else if (s.domain([1, 2]).range([1, 2]).invert(1.5) instanceof Date) {
			return "time";
		} else {
			return "not supported";
		}
	}

	/**
  * Width Getter / Setter
  *
  * @param {number} _v - Width in px.
  * @returns {*}
  */
	my.width = function (_v) {
		if (!arguments.length) return width;
		width = _v;
		return my;
	};

	/**
  * Height Getter / Setter
  *
  * @param {number} _v - Height in px.
  * @returns {*}
  */
	my.height = function (_v) {
		if (!arguments.length) return height;
		height = _v;
		return my;
	};

	/**
  * Size Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 color scale.
  * @returns {*}
  */
	my.sizeScale = function (_v) {
		if (!arguments.length) return sizeScale;
		sizeScale = _v;
		return my;
	};

	/**
  * Color Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 color scale.
  * @returns {*}
  */
	my.colorScale = function (_v) {
		if (!arguments.length) return colorScale;
		colorScale = _v;
		return my;
	};

	/**
  * Title Getter / Setter
  *
  * @param {string} _v - Title text.
  * @returns {*}
  */
	my.title = function (_v) {
		if (!arguments.length) return title;
		title = _v;
		return my;
	};

	return my;
}

var component = {
	//barsCircular: componentBarsCircular,
	//barsStacked: componentBarsStacked,
	// barsHorizontal: componentBarsHorizontal,
	// barsVertical: componentBarsVertical,
	// bubbles: componentBubbles,
	// candleSticks: componentCandleSticks,
	// circularAxis: componentCircularAxis,
	// circularRingLabels: componentCircularRingLabels,
	circularSectorLabels: componentCircularSectorLabels,
	// donut: componentDonut,
	// donutLabels: componentDonutLabels,
	// heatMapRing: componentHeatMapRing,
	// heatMapRow: componentHeatMapRow,
	// htmlList: componentHtmlList,
	// htmlTable: componentHtmlTable,
	// labeledNode: componentLabeledNode,
	legend: componentLegend,
	legendSize: componentLegendSize,
	legendColor: componentLegendColor,
	legendThreshold: componentLegendThreshold,
	// lineChart: componentLineChart,
	// numberCard: componentNumberCard,
	// polarArea: componentPolarArea,
	// radarArea: componentRadarArea,
	roseChartSector: componentRoseChartSector,
	// proportionalAreaCircles: componentProportionalAreaCircles,
	// scatterPlot: componentScatterPlot,
	title: componentTitle
};

/**
 * Rose Chart (also called: Coxcomb Chart; Circumplex Chart; Nightingale Chart)
 *
 * @module
 * @see http://datavizproject.com/data-type/polar-area-chart/
 */
function chartRoseChart () {

	/* Default Properties */
	var svg = void 0;
	var chart = void 0;
	var classed = "roseChart";
	var width = 400;
	var height = 300;
	var margin = { top: 20, right: 20, bottom: 20, left: 20 };
	var transition = { ease: d3.easeBounce, duration: 500 };
	var colors = palette.categorical(3);
	var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	/* Chart Dimensions */
	var chartW = void 0;
	var chartH = void 0;
	var radius = void 0;

	/* Scales */
	var xScale = void 0;
	var yScale = void 0;
	var colorScale = void 0;

	/**
  * Initialise Data and Scales
  *
  * @private
  * @param {Array} data - Chart data.
  */
	function init(data) {
		chartW = width - margin.left - margin.right;
		chartH = height - margin.top - margin.bottom;

		var _dataTransform$summar = dataTransform(data).summary(),
		    rowKeys = _dataTransform$summar.rowKeys,
		    columnKeys = _dataTransform$summar.columnKeys,
		    valueMax = _dataTransform$summar.valueMax;

		var valueExtent = [0, valueMax];

		if (typeof radius === "undefined") {
			radius = Math.min(chartW, chartH) / 2;
		}

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleOrdinal().domain(columnKeys).range(colors);
		}

		xScale = d3.scaleBand().domain(rowKeys).rangeRound([0, 360]);

		yScale = d3.scaleLinear().domain(valueExtent).range([0, radius]);
	}

	/**
  * Constructor
  *
  * @constructor
  * @alias roseChart
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {
		// Create SVG element (if it does not exist already)
		console.log(selection)
		if (!svg) {
			svg = function (selection) {
				var el = selection._groups[0][0];
				if (!!el.ownerSVGElement || el.tagName === "svg") {
					return selection;
				} else {
					return selection.append("svg");
				}
			}(selection);

			svg.classed("d3ez", true).attr("width", width).attr("height", height);

			chart = svg.append("g").classed("chart", true);
		} else {
			chart = selection.select(".chart");
		}

		// Update the chart dimensions and add layer groups
		var layers = ["circularSectorLabels", "rosePetalGroups"];
		chart.classed(classed, true).attr("transform", "translate(" + width / 2 + "," + height / 2 + ")").attr("width", chartW).attr("height", chartH).selectAll("g").data(layers).enter().append("g").attr("class", function (d) {
			return d;
		});

		selection.each(function (data) {
			// Initialise Data
			init(data);

			// Rose Sectors
			var roseChartSector = component.roseChartSector().radius(radius).colorScale(colorScale).yScale(yScale).stacked(false).dispatch(dispatch);

			// Create Series Group
			var seriesGroup = chart.select(".rosePetalGroups").selectAll(".seriesGroup").data(data);

			seriesGroup.enter().append("g").classed("seriesGroup", true).merge(seriesGroup).each(function (d) {
				var startAngle = xScale(d.key);
				var endAngle = xScale(d.key) + xScale.bandwidth();
				roseChartSector.startAngle(startAngle).endAngle(endAngle);
				d3.select(this).call(roseChartSector);
			});

			seriesGroup.exit().remove();

			// Circular Labels
			var circularSectorLabels = component.circularSectorLabels().radius(radius * 1.04).radialScale(xScale).textAnchor("start").capitalizeLabels(true);

			chart.select(".circularSectorLabels").call(circularSectorLabels);
		});
	}

	/**
  * Width Getter / Setter
  *
  * @param {number} _v - Width in px.
  * @returns {*}
  */
	my.width = function (_v) {
		if (!arguments.length) return width;
		width = _v;
		return this;
	};

	/**
  * Height Getter / Setter
  *
  * @param {number} _v - Height in px.
  * @returns {*}
  */
	my.height = function (_v) {
		if (!arguments.length) return height;
		height = _v;
		return this;
	};

	/**
  * Margin Getter / Setter
  *
  * @param {number} _v - Margin in px.
  * @returns {*}
  */
	my.margin = function (_v) {
		if (!arguments.length) return margin;
		margin = _v;
		return this;
	};

	/**
  * Radius Getter / Setter
  *
  * @param {number} _v - Radius in px.
  * @returns {*}
  */
	my.radius = function (_v) {
		if (!arguments.length) return radius;
		radius = _v;
		return this;
	};

	/**
  * Transition Getter / Setter
  *
  * @param {d3.transition} _v - D3 transition style.
  * @returns {*}
  */
	my.transition = function (_v) {
		if (!arguments.length) return transition;
		transition = _v;
		return this;
	};

	/**
  * Colors Getter / Setter
  *
  * @param {Array} _v - Array of colours used by color scale.
  * @returns {*}
  */
	my.colors = function (_v) {
		if (!arguments.length) return colors;
		colors = _v;
		return this;
	};

	/**
  * Color Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 color scale.
  * @returns {*}
  */
	my.colorScale = function (_v) {
		if (!arguments.length) return colorScale;
		colorScale = _v;
		return this;
	};

	/**
  * Dispatch Getter / Setter
  *
  * @param {d3.dispatch} _v - Dispatch event handler.
  * @returns {*}
  */
	my.dispatch = function (_v) {
		if (!arguments.length) return dispatch();
		dispatch = _v;
		return this;
	};

	/**
  * Dispatch On Getter
  *
  * @returns {*}
  */
	my.on = function () {
		var value = dispatch.on.apply(dispatch, arguments);
		return value === dispatch ? my : value;
	};

	return my;
}

var chart = {
	roseChart: chartRoseChart
};

/**
 * d3-ez
 *
 * @author James Saunders [james@saunders-family.net]
 * @copyright Copyright (C) 2018 James Saunders
 * @license GPLv2
 */

// var author$1 = "James Saunders";
// var date = new Date();
// var copyright = "Copyright (C) " + date.getFullYear() + " " + author$1;

var ez = function () {
	var ez = base;
	// ez.version = version;
	// ez.author = author$1;
	// ez.copyright = copyright;
	// ez.license = license;
	ez.chart = chart;
	ez.component = component;
	//ez.palette = palette;
	//ez.dataTransform = dataTransform;

	// TODO: Remove base when new 'ez' constructor fully tested.
	ez.base = base;

	return ez;
}();

return ez;

})));
