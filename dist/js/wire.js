var wire = wire || {};

// Variables
var _breakpoints = {
  desktopHD: window.matchMedia('screen and (min-width: 75em)'),
  desktop: window.matchMedia('screen and (min-width: 64em)'),
  tablet: window.matchMedia('screen and (min-width: 45em) and (max-width: 63.93em)'),
  phone: window.matchMedia('screen and (max-width: 44.95em)')
};

// Order Module
wire.order = (function () {
  var match = function () {
    for (var device in _breakpoints) {
      if (_breakpoints[device].matches) {
        if (device === 'desktop') {
          wire.order.reorder();
        } else {
          wire.order.reorder(device);
        }
      }
    }
  };

  var reorder = function (device) {
    if (device) {
      var orderItems = ['[data-order]'];
      for (var _bp in _breakpoints) {
        orderItems.push('[data-order-' + _bp + ']');
      }
      Array.prototype.forEach.call(document.querySelectorAll(orderItems), function (e) {
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
    } else {
      var styledItems = document.querySelectorAll('[style*="order"]');
      Array.prototype.forEach.call(styledItems, function (e) {
         e.style.removeProperty('order');
      });
      Array.prototype.forEach.call(document.querySelectorAll('[data-order]'), function (e) {
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
wire.fixed = (function () {
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

  var fixItems = function () {
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
    };

  return {
    elements: elements,
    reset: reset,
    fixItems: fixItems
  };

})();

// Responsive Tables Module
wire.responsiveTable = (function () {
  var elements = function () {
    return document.querySelectorAll('[data-table~="responsive"]');
  };

  var addData = function () {
    Array.prototype.forEach.call(elements(), function (e) {
      var thElements = e.getElementsByTagName('th');
      var thText = [];
      Array.prototype.forEach.call(thElements, function (th) {
        thText.push(th.textContent);
      });

      var tbodyElements = e.getElementsByTagName('tbody');
      Array.prototype.forEach.call(tbodyElements, function (tbody) {
        var trElements = tbody.getElementsByTagName('tr');
        Array.prototype.forEach.call(trElements, function (tr) {
          var tdElements = tbody.getElementsByTagName('td'),
              tdCount = tdElements.length;
          for (var i = 0; i < tdCount; ++i) {
            tdElements[i].setAttribute('data-th', thText[i]);
          }
        });
      });
    });
  };

  return {
    elements: elements,
    addData: addData
  };

})();

if (window.matchMedia) {
  for (var device in _breakpoints) {
    _breakpoints[device].addListener(wire.order.match);
    _breakpoints[device].addListener(wire.fixed.fixItems);
    if (_breakpoints[device].matches) {
      wire.order.reorder(device);
    }
  }
}

if (wire.fixed.elements().length) wire.fixed.fixItems();
if (wire.responsiveTable.elements().length) wire.responsiveTable.addData();
