var wire = wire || {};

// Variables
var _breakpoints = {
  phone     :    window.matchMedia("screen and (max-width: 44.95em)"),
  retina    :    window.matchMedia("(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dppx)"),
  tablet    :    window.matchMedia("screen and (min-width: 45em) and (max-width: 63.93em)"),
  desktop   :    window.matchMedia("screen and (min-width: 64em)"),
  desktopHD :    window.matchMedia("screen and (min-width: 75em)")
};

// Order Module
wire.Order = (function () {
  var match = function () {
    if (_breakpoints.phone.matches) {
      wire.Order.reorder('phone');
    } else if (_breakpoints.tablet.matches) {
      wire.Order.reorder('tablet');
    } else {
      wire.Order.reorder();
    }
  };

  var reorder = function (device) {
    var allItems = document.querySelectorAll('[data-order], [data-order-tablet], [data-order-phone]'),
        styledItems = document.querySelectorAll('[style*="order"]');
    if (_breakpoints.phone.matches || _breakpoints.tablet.matches) {
      if (device) {
        var currentDevice = allItems;
        Array.prototype.forEach.call(currentDevice, function (e) {
          if (e.getAttribute('data-order-' + device)) {
            e.style.order = e.getAttribute('data-order-' + device);
          } else {
            if (e.getAttribute('data-order')) {
              e.style.order = e.getAttribute('data-order');
            } else {
              e.style.removeProperty('order');
            }
          }
        });
      }
    } else {
      Array.prototype.forEach.call(styledItems, function (e) {
        e.style.removeProperty('order');
      });
      Array.prototype.forEach.call(allItems, function (e) {
        e.style.order = e.getAttribute('data-order');
      });
    }
  };

  return {
    match: match,
    reorder: reorder
  };

})();

// Fixed Module
wire.Fixed = (function () {
  var elements = function () {
    return document.querySelectorAll('[data-fixed]');
  };

  var reset = function () {
    Array.prototype.forEach.call(elements(), function (e) {
      window.onscroll = function (ev) {
          ev.preventDefault();
        };
      e.style.removeProperty('position');
      e.style.removeProperty('top');
    });
  };

  var fix = function () {
      if (!_breakpoints.tablet.matches && !_breakpoints.phone.matches) {
        if (elements().length) {
          Array.prototype.forEach.call(elements(), function (e) {
            var parent = e.parentNode,
                parentOffsetTop = parent.offsetTop,
                elementLimit = parent.offsetHeight - e.offsetHeight;
            window.onscroll = function () {
              if (window.pageYOffset >= parentOffsetTop) {
                if (window.pageYOffset >= elementLimit) {
                  e.style.position = 'absolute';
                  e.style.top = elementLimit - parentOffsetTop + 'px';
                } else {
                  e.style.position = 'fixed';
                  if (e.getAttribute('data-fixed-top')) {
                    e.style.top = e.getAttribute('data-fixed-top') + 'px';
                  } else {
                    e.style.top = '0';
                  }
                }
              } else {
                e.style.top = '0';
                e.style.removeProperty('position');
              }
            };
          });
        }
      } else {
        reset();
      }
    }

  return {
    elements: elements,
    reset: reset,
    fix: fix
  };

})();

if (matchMedia) {
  for (var device in _breakpoints) {
    _breakpoints[device].addListener(wire.Order.match);
    _breakpoints[device].addListener(wire.Fixed.fix);
  }
  if (_breakpoints.phone.matches) {
    wire.Order.reorder('phone');
  } else if (_breakpoints.tablet.matches) {
    wire.Order.reorder('tablet');
  } else {
    wire.Order.reorder();
  }
}

if (wire.Fixed.elements().length) wire.Fixed.fix();