
/*!
sarine.viewer.color - v0.6.7 -  Sunday, December 10th, 2017, 9:44:30 AM 
 The source code, name, and look and feel of the software are Copyright © 2015 Sarine Technologies Ltd. All Rights Reserved. You may not duplicate, copy, reuse, sell or otherwise exploit any portion of the code, content or visual design elements without express written permission from Sarine Technologies Ltd. The terms and conditions of the sarine.com website (http://sarine.com/terms-and-conditions/) apply to the access and use of this software.
 */

(function() {
  var SarineColor, Viewer,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Viewer = (function() {
    var error, rm;

    rm = ResourceManager.getInstance();

    function Viewer(options) {
      console.log("");
      this.first_init_defer = $.Deferred();
      this.full_init_defer = $.Deferred();
      this.src = options.src, this.element = options.element, this.autoPlay = options.autoPlay, this.callbackPic = options.callbackPic;
      this.id = this.element[0].id;
      this.element = this.convertElement();
      Object.getOwnPropertyNames(Viewer.prototype).forEach(function(k) {
        if (this[k].name === "Error") {
          return console.error(this.id, k, "Must be implement", this);
        }
      }, this);
      this.element.data("class", this);
      this.element.on("play", function(e) {
        return $(e.target).data("class").play.apply($(e.target).data("class"), [true]);
      });
      this.element.on("stop", function(e) {
        return $(e.target).data("class").stop.apply($(e.target).data("class"), [true]);
      });
      this.element.on("cancel", function(e) {
        return $(e.target).data("class").cancel().apply($(e.target).data("class"), [true]);
      });
    }

    error = function() {
      return console.error(this.id, "must be implement");
    };

    Viewer.prototype.first_init = Error;

    Viewer.prototype.full_init = Error;

    Viewer.prototype.play = Error;

    Viewer.prototype.stop = Error;

    Viewer.prototype.convertElement = Error;

    Viewer.prototype.cancel = function() {
      return rm.cancel(this);
    };

    Viewer.prototype.loadImage = function(src) {
      return rm.loadImage.apply(this, [src]);
    };

    Viewer.prototype.loadAssets = function(resources, onScriptLoadEnd) {
      var element, resource, scripts, scriptsLoaded, _i, _len;
      if (resources !== null && resources.length > 0) {
        scripts = [];
        for (_i = 0, _len = resources.length; _i < _len; _i++) {
          resource = resources[_i];
          if (resource.element === 'script') {
            scripts.push(resource.src + cacheVersion);
          } else {
            element = document.createElement(resource.element);
            element.href = resource.src + cacheVersion;
            element.rel = "stylesheet";
            element.type = "text/css";
            $(document.head).prepend(element);
          }
        }
        scriptsLoaded = 0;
        scripts.forEach(function(script) {
          return $.getScript(script, function() {
            if (++scriptsLoaded === scripts.length) {
              return onScriptLoadEnd();
            }
          });
        });
      }
    };

    Viewer.prototype.setTimeout = function(delay, callback) {
      return rm.setTimeout.apply(this, [this.delay, callback]);
    };

    return Viewer;

  })();

  this.Viewer = Viewer;

  SarineColor = (function(_super) {
    __extends(SarineColor, _super);

    function SarineColor(options) {
      this.preloadAssets = __bind(this.preloadAssets, this);
      var css, head, style;
      SarineColor.__super__.constructor.call(this, options);
      this.isAvailble = true;
      this.colorGradeMaps = {
        1: "D",
        2: "E",
        3: "F",
        4: "G",
        5: "H",
        6: "I",
        7: "J",
        8: "K",
        9: "L",
        10: "M",
        11: "N",
        12: "OP",
        13: "QR",
        14: "ST",
        15: "UV",
        16: "WX",
        17: "YZ"
      };
      this.keysToIndex = {
        "D": 1,
        "E": 2,
        "F": 3,
        "G": 4,
        "H": 5,
        "I": 6,
        "J": 7,
        "K": 8,
        "L": 9,
        "M": 10,
        "N": 11,
        "OP": 12,
        "QR": 13,
        "ST": 14,
        "UV": 15,
        "WX": 16,
        "YZ": 17
      };
      this.resourcesPrefix = options.baseUrl + "atomic/v1/assets/";
      this.colorAssets = options.baseUrl + "atomic/v1/js/color-assets/clean";
      this.atomConfig = configuration.experiences.filter(function(exp) {
        return exp.atom === "colorExperience";
      })[0];
      this.resources = [
        {
          element: 'link',
          src: 'owl.carousel.css'
        }, {
          element: 'script',
          src: 'owl.carousel.min.js'
        }
      ];
      css = '.owl-carousel .item{margin:2px;border-color: gray;cursor: pointer; border: 2px; border-radius: 3px; box-shadow: 1px 1px 2px 2px rgba(0, 0, 0, 0.2); transition: all 200ms ease-out; font: initial; }';
      css += '.owl-carousel .item img{  display: block;  width: 110%;  margin-left: -5%;  height: auto; }';
      css += '.owl-carousel  .owl-item{position:initial;}';
      css += ".owl-item.active.center{    -webkit-transform: scale(1.3);    background: white;    z-index: 10000;    position: relative;}";
      css += '.owl-stage {height:300px;padding-top:20px;}';
      css += '.owl-stage-outer {max-height:130px;    padding-top: 40px;}';
      head = document.head || document.getElementsByTagName('head')[0];
      style = document.createElement('style');
      style.type = 'text/css';
      if (style.styleSheet) {
        style.styleSheet.cssText = css;
      } else {
        style.appendChild(document.createTextNode(css));
      }
      head.appendChild(style);
      this.domain = window.coreDomain;
      this.numberOfImages = this.atomConfig.NumberOfImages || 17;
    }

    SarineColor.prototype.convertElement = function() {
      return this.element.append('<div class="owl-carousel owl-theme"></div>');
    };

    SarineColor.prototype.preloadAssets = function(callback) {
      var element, loaded, resource, totalScripts, triggerCallback, _i, _len, _ref, _results;
      loaded = 0;
      totalScripts = this.resources.map(function(elm) {
        return elm.element === 'script';
      });
      triggerCallback = function(callback) {
        loaded++;
        if (loaded === totalScripts.length - 1 && callback !== void 0) {
          return setTimeout((function(_this) {
            return function() {
              return callback();
            };
          })(this), 500);
        }
      };
      element;
      _ref = this.resources;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        resource = _ref[_i];
        element = document.createElement(resource.element);
        if (resource.element === 'script') {
          $(document.body).append(element);
          element.onload = element.onreadystatechange = function() {
            return triggerCallback(callback);
          };
          element.src = this.resourcesPrefix + resource.src + cacheVersion;
          element.type = "text/javascript";
        } else {
          element.href = this.resourcesPrefix + resource.src + cacheVersion;
          element.rel = "stylesheet";
          element.type = "text/css";
        }
        _results.push($(document.head).prepend(element));
      }
      return _results;
    };

    SarineColor.prototype.first_init = function() {
      var defer, _t;
      defer = $.Deferred();
      _t = this;
      this.stoneColor = window.stones[0].stoneProperties.color;
      if (!_t.keysToIndex.hasOwnProperty(this.stoneColor)) {
        this.failed();
        defer.resolve(this);
      } else {
        this.preloadAssets(function() {
          var src;
          this.pattern = _t.atomConfig.ImagePatternClean || 'colorscalemaster-stacked_*.png';
          this.firstImageName = this.pattern.replace("*", "1");
          src = _t.colorAssets + "/" + this.firstImageName + cacheVersion;
          return _t.loadImage(src).then(function(img) {
            if (img.src.indexOf('data:image') === -1 && img.src.indexOf('no_stone') === -1) {
              return defer.resolve(_t);
            } else {
              _t.isAvailble = false;
              _t.element.empty();
              this.div = $("<div>");
              this.div.attr({
                'style': 'background-color:gray;width:150px;margin:0 auto;'
              });
              this.canvas = $("<canvas>");
              this.canvas[0].width = img.width;
              this.canvas[0].height = img.height;
              this.ctx = this.canvas[0].getContext('2d');
              this.ctx.drawImage(img, 0, 0, img.width, img.height);
              this.canvas.attr({
                'class': 'no_stone'
              });
              this.div.append(this.canvas);
              _t.element.append(this.div);
              return defer.resolve(_t);
            }
          });
        });
      }
      return defer;
    };

    SarineColor.prototype.failed = function() {
      var defer, _t;
      _t = this;
      defer = $.Deferred();
      return _t.loadImage(_t.callbackPic).then(function(img) {
        _t.isAvailble = false;
        _t.element.empty();
        this.canvas = $("<canvas>");
        this.canvas[0].width = img.width;
        this.canvas[0].height = img.height;
        this.ctx = this.canvas[0].getContext('2d');
        this.ctx.drawImage(img, 0, 0, img.width, img.height);
        this.canvas.attr({
          'class': 'no_stone'
        });
        _t.element.append(this.canvas);
        return defer.resolve(_t);
      });
    };

    SarineColor.prototype.full_init = function() {
      var defer, i, newImage, newSpan, _t;
      defer = $.Deferred();
      _t = this;
      this.stoneColor = window.stones[0].stoneProperties.color;
      if (_t.keysToIndex.hasOwnProperty(this.stoneColor)) {
        this.owlCarousel = this.element.find('.owl-carousel');
        this.imagePath = this.colorAssets + "/";
        this.pattern = this.atomConfig.ImagePatternClean || 'colorscalemaster-stacked_*.png';
        this.filePrefix = this.pattern.replace(/\*.[^/.]+$/, '');
        this.fileExt = "." + (this.pattern.split('.').pop());
        i = 1;
        while (i <= this.numberOfImages) {
          this.newPath = this.imagePath + this.filePrefix + i + this.fileExt;
          this.container = $("<div>");
          this.container.attr({
            "class": "item"
          });
          newImage = $("<img>");
          newImage.attr({
            src: this.newPath
          });
          newSpan = $("<span>").html(this.colorGradeMaps[i]);
          newSpan.attr({
            "class": "color-grade-span"
          });
          this.container.append(newSpan);
          this.container.append(newImage);
          this.owlCarousel.append(this.container);
          i++;
        }
        this.owlCarousel.owlCarousel({
          center: true,
          dots: true,
          margin: 1,
          afterMove: function() {
            $('owl-item').css({
              transform: "none"
            });
            return $('active').eq(1).css({
              transform: "scale(1.9)",
              zIndex: 3000
            });
          },
          onReady: function() {
            return defer.resolve(this);
          }
        });
      } else {
        defer.resolve(this);
      }
      return defer;
    };

    SarineColor.prototype.play = function() {};

    SarineColor.prototype.stop = function() {};

    return SarineColor;

  })(Viewer);

  this.SarineColor = SarineColor;

}).call(this);
