var wire;

// Variables
var _breakpoints = {
  huge: window.matchMedia('screen and (min-width: 75em)'),
  large: window.matchMedia('screen and (min-width: 64em)'),
  medium: window.matchMedia('screen and (min-width: 45em) and (max-width: 63.93em)'),
  small: window.matchMedia('screen and (max-width: 44.95em)')
};

var device;
wire = wire || {};


// Order Module
wire.order = (function() {
  var match = function() {
    for (device in _breakpoints) {
      if (_breakpoints[device].matches) {
        if (device === 'large') {
          wire.order.reorder();
        } else {
          wire.order.reorder(device);
        }
      }
    }
  };

  var reorder = function(device) {
    var orderItems = ['[data-order]'];
    var styledItems = document.querySelectorAll('[style*="order"]');
    var _bp;
    if (device) {
      for (_bp in _breakpoints) {
        if ({}.hasOwnProperty.call(_breakpoints, _bp)) {
          orderItems.push('[data-order-' + _bp + ']');
        }
      }
      Array.prototype.forEach.call(document.querySelectorAll(orderItems), function(e) {
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
      Array.prototype.forEach.call(styledItems, function(e) {
        e.style.removeProperty('order');
      });
      Array.prototype.forEach.call(document.querySelectorAll('[data-order]'), function(e) {
        e.style.order = e.getAttribute('data-order');
      });
    }
  };

  return {
    match: match,
    reorder: reorder
  };
}());

// Responsive Tables Module
wire.responsiveTable = (function() {
  var elements = function() {
    return document.querySelectorAll('[data-table~="responsive"]');
  };

  var addData = function() {
    Array.prototype.forEach.call(elements(), function(e) {
      var thElements = e.getElementsByTagName('th');
      var thText = [];
      var tbodyElements = e.getElementsByTagName('tbody');
      var i = 0;
      Array.prototype.forEach.call(thElements, function(th) {
        thText.push(th.textContent);
      });

      Array.prototype.forEach.call(tbodyElements, function(tbody) {
        var trElements = tbody.getElementsByTagName('tr');
        Array.prototype.forEach.call(trElements, function(tr) {
          var tdElements = tr.getElementsByTagName('td');
          var tdCount = tdElements.length;
          for (i; i < tdCount; ++i) {
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
}());

if (window.matchMedia) {
  for (device in _breakpoints) {
    if ({}.hasOwnProperty.call(_breakpoints, device)) {
      _breakpoints[device].addListener(wire.order.match);
      if (_breakpoints[device].matches) {
        wire.order.reorder(device);
      }
    }
  }
}

if (wire.responsiveTable.elements().length) wire.responsiveTable.addData();
