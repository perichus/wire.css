var itemsWithOrder = document.querySelectorAll('[data-order]');
if (itemsWithOrder.length){
    [].forEach.call(itemsWithOrder, function(e) {
      e.style.order = e.getAttribute('data-order');
    });
}

if (matchMedia) {
    var phone = window.matchMedia("(max-width: 44.95em)");
    var tablet = window.matchMedia("(min-width: 45em) and (max-width: 63.93em)");
    phone.addListener(WidthChange);
    tablet.addListener(WidthChange);
    if (phone.matches) {
        WidthChange();
    } else if (tablet.matches) {
        WidthChange();
    }
}

function WidthChange() {
    var phoneItems = document.querySelectorAll('[data-order-phone]');
    var tabletItems = document.querySelectorAll('[data-order-tablet]');

    if (phone.matches) {
        if (phoneItems.length){
            [].forEach.call(phoneItems, function(e) {
              e.style.order = e.getAttribute('data-order-phone');
            });
        }
    } else if (tablet.matches) {
        if (tabletItems.length){
            [].forEach.call(tabletItems, function(e) {
              e.style.order = e.getAttribute('data-order-tablet');
            });
        } else {
            if (itemsWithOrder.length){
                [].forEach.call(itemsWithOrder, function(e) {
                  e.style.order = e.getAttribute('data-order');
                });
            }
        }
    } else {
        if (itemsWithOrder.length){
            [].forEach.call(itemsWithOrder, function(e) {
              e.style.order = e.getAttribute('data-order');
            });
        } else {
            var orderItems = document.querySelectorAll('[style*="order"]');
            [].forEach.call(orderItems, function(e) {
              e.style.order = '';
            });
        }
    }
}