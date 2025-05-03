const wire = {}
wire._breakpoints = {
  huge: window.matchMedia('screen and (min-width: 75em)'),
  large: window.matchMedia('screen and (min-width: 64em)'),
  medium: window.matchMedia('screen and (min-width: 45em) and (max-width: 63.93em)'),
  small: window.matchMedia('screen and (max-width: 44.95em)')
}
wire.device = []

// Order Module
wire.order = (function () {
  const match = function () {
    for (wire.device in wire._breakpoints) {
      if (wire._breakpoints[wire.device].matches) {
        if (wire.device === 'large') {
          wire.order.reorder()
        } else {
          wire.order.reorder(wire.device)
        }
      }
    }
  }

  const reorder = function (device) {
    const orderItems = ['[data-order]']
    const styledItems = document.querySelectorAll('[style*="order"]')
    let _bp

    if (device) {
      for (_bp in wire._breakpoints) {
        if ({}.hasOwnProperty.call(wire._breakpoints, _bp)) {
          orderItems.push('[data-order-' + _bp + ']')
        }
      }
      document.querySelectorAll(orderItems).forEach(function (e) {
        if (e.getAttribute('data-order-' + device)) {
          e.style.order = e.getAttribute('data-order-' + device)
        } else {
          if (e.getAttribute('data-order')) {
            e.style.order = e.getAttribute('data-order')
          } else {
            e.style.removeProperty('order')
          }
        }
      })
    } else {
      styledItems.forEach(function (e) {
        e.style.removeProperty('order')
      })
      document.querySelectorAll('[data-order]').forEach(function (e) {
        e.style.order = e.getAttribute('data-order')
      })
    }
  }

  return {
    match: match,
    reorder: reorder
  }
}())

if (window.matchMedia) {
  for (wire.device in wire._breakpoints) {
    if ({}.hasOwnProperty.call(wire._breakpoints, wire.device)) {
      wire._breakpoints[wire.device].addListener(wire.order.match)
      if (wire._breakpoints[wire.device].matches) {
        wire.order.reorder(wire.device)
      }
    }
  }
}

// Responsive Tables Module
wire.responsiveTable = (function () {
  const getElements = function () {
    return document.querySelectorAll('[data-table~="responsive"]')
  }

  const addData = function () {
    getElements().forEach(function (e) {
      const thElements = e.getElementsByTagName('th')
      const thText = []
      const tbodyElements = e.getElementsByTagName('tbody')

      Array.prototype.forEach.call(thElements, function (th) {
        thText.push(th.textContent)
      })

      Array.prototype.forEach.call(tbodyElements, function (tbody) {
        const trElements = tbody.getElementsByTagName('tr')

        Array.prototype.forEach.call(trElements, function (tr) {
          const tdElements = tr.getElementsByTagName('td')
          let i = 0

          Array.prototype.forEach.call(tdElements, function (td) {
            td.setAttribute('data-th', thText[i])
            i++
          })
        })
      })
    })
  }

  return {
    getElements: getElements,
    addData: addData
  }
}())

if (wire.responsiveTable.getElements().length) wire.responsiveTable.addData()
