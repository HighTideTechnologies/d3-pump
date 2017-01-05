function createPump(pumpOptions) {
  function Pump() {
    this.pumpData = [
      { d: "M50,0.5C22.7,0.5,0,22.7,0.5,50C0.7,59.5,3.4,68.3,8,75.7H0.5v23.8 H50c30.3-0.6,54.2-27,48.7-58.6c-1-6-3.2-11.6-6.2-16.7h7V0.5H50L50,0.5z" }
    ];
    this.wheelData = [
      { id: "back-fill", cx: 50, cy: 50, r: 30 },
      { id: "wheel-border", cx: 50, cy: 50, r: 30 },
      { id: "wheel-center", cx: 50, cy: 50, r: 12 }
    ];
    this.bladeData = [
      { d: "M40.6,21.7c4.9,4.2,9.4,10.8,9.4,20.7" },
      { d: "M59.4,78.3C54.5,74.1,50,67.6,50,57.6" },
      { d: "M30,72.2c1.2-6.4,4.7-13.5,13.3-18.4" },
      { d: "M70,27.8c-1.2,6.4-4.7,13.5-13.3,18.4" },
      { d: "M20.6,43.9c6.1-2.1,14.1-2.7,22.7,2.3" },
      { d: "M79.4,56.1c-6.1,2.1-14.1,2.7-22.7-2.3" }
    ];
    this.labelData = [
      { fontSize: "10px", fill: "#fff", fontFamily: "Helvetica", x: 50, y: 53 }
    ];

    this.defaultOptions = {
      selector: null,
      fill: "#fafafa",
      pumpBodyFill: "#949494",
      wheelFill: "#3fabd4",
      wheelCenterFill: "#333",
      stroke: "#333",
      borderStrokeWidth: 1,
      fanStrokeWidth: 2,
      strokeMiterlimit: 10,
      duration: 2000,
      onColor: "#388E3C",
      offColor: "#D32F2F",
      pumpBodyOffColor: "#F44336",
      wheelFillOffColor: "#E57373",
      alarm: false
    };
    this.loadDefault(pumpOptions);
    this.setDefault();
    this.initSvg();
    this.createPumpBodyGroup();
    this.createPumpBody();
    this.setPumpBodyAttr();
    this.createFanGroup();
    this.createWheelBackFill();
    this.setWheelBackFillAttr();
    this.createBlade();
    this.setBladeAttr();
    this.createWheel();
    this.setWheelAttr();
    this.addLabel();
    this.setLabelAttr();
    this.setFanGroupAttr();
  }

  Pump.prototype.loadDefault = function (options) {
    if ( typeof options !== "undefined" ) {
      for ( var key in this.defaultOptions ) {
        if ( typeof options[key] === "undefined" ) {
          options[key] = this.defaultOptions[key];
        }
      }
    } else {
      this.options = this.defaultOptions;
    }
    this.options = options;
  };
  Pump.prototype.setDefault = function () {
    this.selector = this.options.selector;
    this.fill = this.options.fill;
    this.pumpBodyFill = this.options.pumpBodyFill;
    this.wheelFill = this.options.wheelFill;
    this.wheelCenterFill = this.options.wheelCenterFill;
    this.stroke = this.options.stroke;
    this.borderStrokeWidth = this.options.borderStrokeWidth;
    this.fanStrokeWidth = this.options.fanStrokeWidth;
    this.strokeMiterlimit = this.options.strokeMiterlimit;
    this.duration = this.options.duration;
    this.lastDuration = 0;
    this.rotateDef = "rotate(0, 50, 50)";
    this.labelText = "OFF";
    this.spinning = false;
    this.onColor = this.options.onColor;
    this.offColor = this.options.offColor;
    this.pumpBodyOffColor = this.options.pumpBodyOffColor;
    this.wheelFillOffColor = this.options.wheelFillOffColor;
    this.alarm = this.options.alarm;
  };
  Pump.prototype.initSvg = function () {
    this.svgContainer = d3.select(this.selector)
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", "0, 0, 100, 100");
  };
  Pump.prototype.createPumpBodyGroup = function () {
    this.pumpBodyGroup = this.svgContainer.append("g");
  };
  Pump.prototype.createPumpBody = function () {
    this.pumpBody = this.pumpBodyGroup.selectAll("path")
      .data(this.pumpData)
      .enter()
      .append("path");
  };
  Pump.prototype.setPumpBodyAttr = function () {
    this.pumpBodyAttr = this.pumpBody
      .attr("fill", this.pumpBodyFill)
      .attr("stroke", this.stroke)
      .attr("stroke-width", this.borderStrokeWidth)
      .attr("stroke-miterlimit", this.strokeMiterlimit)
      .attr("d", function (d) {
        return d.d;
      });
  };
  Pump.prototype.createFanGroup = function () {
    this.fanGroup = this.svgContainer.append("g");
  };
  Pump.prototype.resetTime = function () {
    this.fanGroup.attr("T", 0);
  };
  Pump.prototype.createWheelBackFill = function () {
    this.wheelBackFill = this.fanGroup.selectAll("circle")
      .data(this.wheelData.slice(0, 1))
      .enter()
      .append("circle");
  };
  Pump.prototype.setWheelBackFillAttr = function () {
    this.wheelBackFillAttr = this.wheelBackFill
      .attr("id", function (d) {
        return d.id;
      })
      .attr("fill", this.wheelFill)
      .attr("stroke", this.stroke)
      .attr("stroke-width", this.fanStrokeWidth)
      .attr("stroke-miterlimit", this.strokeMiterlimit)
      .attr("cx", function (d) {
        return d.cx;
      })
      .attr("cy", function (d) {
        return d.cy;
      })
      .attr("r", function (d) {
        return d.r;
      });
  };
  Pump.prototype.createBlade = function () {
    this.blade = this.fanGroup.selectAll("path")
      .data(this.bladeData)
      .enter()
      .append("path");
  };
  Pump.prototype.setBladeAttr = function () {
    this.bladeAttr = this.blade
      .attr("fill", "none")
      .attr("stroke", this.stroke)
      .attr("stroke-width", this.fanStrokeWidth)
      .attr("stroke-miterlimit", this.strokeMiterlimit)
      .attr("d", function (d) {
        return d.d;
      });
  };
  Pump.prototype.createWheel = function () {
    this.wheel = this.fanGroup.selectAll("circle")
      .data(this.wheelData)
      .enter()
      .append("circle");
  };
  Pump.prototype.setWheelAttr = function () {
    var that = this;
    this.wheelAttr = this.wheel
      .attr("id", function (d) {
        return d.id;
      })
      .attr("fill", function (d) {
        return d.id === "wheel-border" ? "none" : that.wheelCenterFill;
      })
      .attr("stroke", this.stroke)
      .attr("stroke-width", this.fanStrokeWidth)
      .attr("stroke-miterlimit", this.strokeMiterlimit)
      .attr("cx", function (d) {
        return d.cx;
      })
      .attr("cy", function (d) {
        return d.cy;
      })
      .attr("r", function (d) {
        return d.r;
      });
  };
  Pump.prototype.addLabel = function () {
    this.label = this.svgContainer.selectAll("text")
      .data(this.labelData)
      .enter()
      .append("text");
  };
  Pump.prototype.setLabelAttr = function () {
    this.labelAttr = this.label
      .attr("font-size", function (d) {
        return d.fontSize;
      })
      .attr("fill", function (d) {
        return d.fill;
      })
      .attr("font-family", function (d) {
        return d.fontFamily;
      })
      .attr("x", function (d) {
        return d.x;
      })
      .attr("y", function (d) {
        return d.y;
      })
      .attr("text-anchor", "middle")
      .text(this.labelText);
  };
  Pump.prototype.updateLabel = function (val) {
    this.label.text(val);
  };
  Pump.prototype.toggleColor = function () {
    if (this.spinning === true) {
      this.pumpBody.attr('fill', this.pumpBodyFill);
      this.wheelBackFill.attr('fill', this.wheelFill);
      this.svgContainer.select("#wheel-center").attr("fill", this.onColor);
    } else if (this.spinning === false) {
      if (this.alarm === true) {
        this.pumpBody.attr('fill', this.pumpBodyOffColor);
        this.wheelBackFill.attr('fill', this.wheelFillOffColor);
        this.svgContainer.select("#wheel-center").attr("fill", this.offColor);
      } else {
        this.pumpBody.attr('fill', this.pumpBodyFill);
        this.wheelBackFill.attr('fill', this.wheelFill);
        this.svgContainer.select("#wheel-center").attr("fill", this.offColor);
      }
    }
  };
  Pump.prototype.setFanGroupAttr = function () {
    this.spinning = false;
    this.fanGroup
      .attr("T", 0)
      .attr("transform", this.rotateDef);
    this.updateLabel("OFF");
    this.toggleColor();
  };
  Pump.prototype.startPump = function () {
    var that = this;
    if (this.spinning === false) {
      this.spinning = true;
      this.updateLabel("ON");
      this.toggleColor();
      repeat();
    }

    function repeat() {
      that.resetTime();
      that.fanGroup.transition()
        .duration(that.duration - that.lastDuration * that.duration)
        .ease(d3.easeLinear)
        .attr("T", 1)
        .attrTween("transform", function (d, i, a) {
          return d3.interpolateString(that.rotateDef, "rotate(60, 50, 50)");
        })
        .on("end", function () {
          that.rotateDef = "rotate(0, 50, 50)";
          that.lastDuration = 0;
          if ( that.spinning === true ) {
            repeat();
          }
        });
    }
  };
  Pump.prototype.stopPump = function () {
    this.spinning = false;
    this.updateLabel("OFF");
    this.toggleColor();
    this.fanGroup.transition()
      .duration(0);
    this.lastDuration = this.fanGroup.attr("T");
    var str = this.fanGroup.attr("transform");
    var angle = parseFloat(str.substring(str.indexOf("(") + 1, str.indexOf(",")));
    this.rotateDef = `rotate(${angle + 5}, 50, 50)`;
  };
  Pump.prototype.alarmOn = function () {
    this.alarm = true;
    // this.stopPump();
  };
  Pump.prototype.alarmOff = function () {
    this.alarm = false;
    // if (this.spinning === true) {
    //   this.startPump();
    // } else if (this.spinning === false) {
    //   this.stopPump();
    // }
  };
  Pump.prototype.click = function (callback) {
    if ( typeof callback !== "function" ) {
      throw new Error("argument must be a function");
    }
    this.svgContainer.on("click", callback);
  };

  var pump = new Pump(pumpOptions);
  return pump;
};