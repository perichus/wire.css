var wire = wire || {};

// Order Module
wire.Order = (function () {

  return {
    isMatch: function () {
      if (phone.matches) {
        wire.Order.setReorder('phone');
      } else if (tablet.matches) {
        wire.Order.setReorder('tablet');
      } else {
        wire.Order.setReorder();
      }
    },
    setReorder: function (device) {
      var allItems = document.querySelectorAll('[data-order], [data-order-tablet], [data-order-phone]'),
          styledItems = document.querySelectorAll('[style*="order"]');
      if (phone.matches || tablet.matches) {
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
    }
  };

})();

// Fixed Module
wire.Fixed = (function () {

  return {
    elements: function () {
      return document.querySelectorAll('[data-fixed]');
    },

    fixElements: function () {
      if (!tablet.matches || !phone.matches) {
        if (wire.Fixed.elements().length) {
          Array.prototype.forEach.call(wire.Fixed.elements(), function (e) {
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
        Array.prototype.forEach.call(wire.Fixed.elements(), function (e) {
          window.onscroll = function (ev) {
              ev.preventDefault();
            };
          e.style.removeProperty('position');
          e.style.removeProperty('top');
        });
      }
    }
  };

})();

if (matchMedia) {
  var phone = window.matchMedia("(max-width: 44.95em)");
  var tablet = window.matchMedia("(min-width: 45em) and (max-width: 63.93em)");
  phone.addListener(wire.Order.isMatch);
  tablet.addListener(wire.Order.isMatch);
  phone.addListener(wire.Fixed.fixElements);
  tablet.addListener(wire.Fixed.fixElements);
  if (phone.matches) {
    wire.Order.setReorder('phone');
  } else if (tablet.matches) {
    wire.Order.setReorder('tablet');
  } else {
    wire.Order.setReorder();
  }
}

if (wire.Fixed.elements().length) wire.Fixed.fixElements();