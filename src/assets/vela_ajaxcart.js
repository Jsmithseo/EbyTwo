Handlebars.registerHelper('ifHasProperty', function(needle, properties) {
  if (properties && typeof properties[needle] !== "undefined") {
    return true;
  }

  return false;
});

Handlebars.registerHelper('getProductName', function(name) {
  return name.lastIndexOf(' E') === (name.length - 2) ? name.substring(0, name.length - 2) : name
});

/**
 * Start mask pack logic
 */
const MASK_PACK_BLACK_VARIANT_ID = 34754912845868;
const MASK_CHILD_BLACK_VARIANT_ID = 34503167705132;
const MASK_PACK_GREEN_VARIANT_ID = 34768104194092;
const MASK_CHILD_GREEN_VARIANT_ID = 34768154099756;

var PACK_CHILD_IDS = [
  {
    pack: MASK_PACK_BLACK_VARIANT_ID, 
    child: MASK_CHILD_BLACK_VARIANT_ID
  },
  {
    pack: MASK_PACK_GREEN_VARIANT_ID, 
    child: MASK_CHILD_GREEN_VARIANT_ID
  }
]

const MASK_PACK_QUANTITY = 3;
const IS_IN_MASK_PACK_PROPERTY = '_in_mask_pack';
const INCLUDED_IN_PACK_PROPERTY = 'included_in_pack';

function cartUpdateListener() {
  this.addEventListener("load", function () {
    const url = this._url;

    const addUrls = ["/cart/add.js"];
    const updateUrls = ["/cart/update.js", "/cart/change.js"];

    if (addUrls.includes(url)) {
      snapchatAddCartTracking(this.response);
      maskPackAdd(this.response);
    }

    if (updateUrls.includes(url)) {
      maskPacksUpdate(this.response);
    }
  });

  return open.apply(this, arguments);
}

function snapchatAddCartTracking(cartJson) {
  var snapchatTracking = window.snaptr;

  if (typeof snapchatTracking === "undefined") {
    return;
  }

  var itemData = JSON.parse(cartJson);
  var variantId = itemData['variant_id'];

  if (typeof variantId === "undefined") {
    return;
  }
  
  var usdItemPrice = +itemData['price'] / 100;
  
  var trackingData = {
    'currency': 'USD',
    'price': usdItemPrice,
    'item_ids': [variantId.toString()],
    'item_category': itemData['product_type']
  };

  snapchatTracking('init', 'ef23133e-21ae-4673-9405-c011205e53de');
  snapchatTracking('track', 'ADD_CART', trackingData);
}

function maskPackAdd(cartJson) {
  var itemData = JSON.parse(cartJson);
  var packIds = getPackIds();
  var variantId = itemData['variant_id'];

  if (!itemData || !packIds.includes(variantId)) {
    return;
  }

  var childId = getChildId(variantId);

  if (!childId) {
    return;
  }

  addChildMask(childId);
}

function getPackIds() {
  var packIds = [];
  var packsData = PACK_CHILD_IDS;

  for (i = 0; i < packsData.length; i++) {
    var packData = packsData[i];
    var packId = packData['pack'];

    if (packId) {
      packIds.push(packId);
    }
  }

  return packIds;
}

function getChildId(packId) {
  var packsData = PACK_CHILD_IDS;

  for (i = 0; i < packsData.length; i++) {
    var packData = packsData[i];

    if (packData['pack'] === packId) {
      return packData['child'];
    }
  }
}

function addChildMask(childMaskId) {
  var properties = {};
  properties[IS_IN_MASK_PACK_PROPERTY] = true;
  properties[INCLUDED_IN_PACK_PROPERTY] = true;

  jQuery.ajax({
    type: 'POST',
    url: '/cart/add.js',
    async: false,
    data: {quantity: MASK_PACK_QUANTITY, id: childMaskId, properties: properties},
    dataType: 'json',
    success:function() {
      return;
    }
  });
}

function maskPacksUpdate(cartJson) {
  var cartData = JSON.parse(cartJson);

  if (!cartData || !cartData['items']) {
    return;
  }

  var cartItems = cartData.items;
  var itemsLength = cartItems.length;

  var packsData = PACK_CHILD_IDS;
  for (i = 0; i < packsData.length; i++) {
    var packData = packsData[i];
    var maskPackId = packData['pack'];
    var maskChildId = packData['child'];

    maskPackUpdate(cartItems, itemsLength, maskPackId, maskChildId)
  }
}

function maskPackUpdate(cartItems, itemsLength, maskPackId, maskChildId) {
  var maskPacksCount = 0;
  var maskChildsCount = 0;
  var maskChildLineItemId;

  for (var i = 0; i < itemsLength; i++) {
    var cartItem = cartItems[i];
    var variantId = cartItem['variant_id'];
    var quantity = cartItem['quantity'];

    if (variantId === maskPackId) {
      maskPacksCount = maskPacksCount + quantity;
    }

    if (variantId === maskChildId) {
      var properties = cartItem['properties'];

      if (properties 
        && typeof properties !== 'undefined' 
        && typeof properties[IS_IN_MASK_PACK_PROPERTY] !== 'undefined') {
          maskChildLineItemId = cartItem['id']
          maskChildsCount = maskChildsCount + quantity;
      }
    }
  }

  maskChildsShouldHaveCount = maskPacksCount * MASK_PACK_QUANTITY;

  if (maskChildsShouldHaveCount > maskChildsCount) {
    quantityToAdd = maskChildsShouldHaveCount - maskChildsCount;
    addPackChilds(quantityToAdd, maskChildId)
  } else if (maskChildsShouldHaveCount < maskChildsCount) {
    updatePackChilds(maskChildLineItemId, maskChildsShouldHaveCount)
  }
}

function addPackChilds(quantity, variantId) {
  var properties = {};
  properties[IS_IN_MASK_PACK_PROPERTY] = true;
  properties[INCLUDED_IN_PACK_PROPERTY] = true;

  jQuery.ajax({
    type: 'POST',
    url: '/cart/add.js',
    async: false,
    data: {quantity: quantity, id: variantId, properties: properties},
    dataType: 'json',
    success:function() {
      return;
    }
  });
}

function updatePackChilds(lineItemId, quantity) {
  if (!lineItemId || !(lineItemId > 0)) {
    return;
  }

  var properties = {};
  properties[IS_IN_MASK_PACK_PROPERTY] = true;
  properties[INCLUDED_IN_PACK_PROPERTY] = true;

  const data = {
    'id': lineItemId,
    'quantity': quantity,
    'properties': properties
  };

  jQuery.ajax({
    type: 'POST',
    url: '/cart/change.js',
    async: false,
    data: data,
    dataType: 'json',
    success:function() {
      return;
    }
  });
}

const open = window.XMLHttpRequest.prototype.open;
window.XMLHttpRequest.prototype.open = cartUpdateListener;

/**
 * End mask pack logic
 */

if ((typeof ShopifyAPI) === 'undefined') { ShopifyAPI = {}; }
function attributeToString(attribute) {
    if ((typeof attribute) !== 'string') {
        attribute += '';
        if (attribute === 'undefined') {
            attribute = '';
        }
    }
    return jQuery.trim(attribute);
};
ShopifyAPI.onCartUpdate = function(cart) {
    // alert('There are now ' + cart.item_count + ' items in the cart.');
};
ShopifyAPI.updateCartNote = function(note, callback) {
    var params = {
        type: 'POST',
        url: '/cart/update.js',
        data: 'note=' + attributeToString(note),
        dataType: 'json',
        success: function(cart) {
            if ((typeof callback) === 'function') {
                callback(cart);
            }
            else {
                ShopifyAPI.onCartUpdate(cart);
            }
        },
        error: function(XMLHttpRequest, textStatus) {
            ShopifyAPI.onError(XMLHttpRequest, textStatus);
        }
    };
    jQuery.ajax(params);
};
ShopifyAPI.onError = function(XMLHttpRequest, textStatus) {
    var data = eval('(' + XMLHttpRequest.responseText + ')');
    if (!!data.message) {
        alert(data.message + '(' + data.status  + '): ' + data.description);
    }
};

ShopifyAPI.addItem = function(id, qty, properties){
  var params = {
    type: 'POST',
    url: '/cart/add.js',
    async: false,
    //, properties:{'SubBundle': '0'}
    data: {quantity: qty, id: id, properties: properties},
    dataType: 'json',
    beforeSend: function() {
    },
    success: function(line_item) {
      //console.log(line_item);
    },
    error: function(XMLHttpRequest, textStatus) {
      $('body').removeClass('velaCartAdding');
      console.log(XMLHttpRequest);
      var data = eval('(' + XMLHttpRequest.responseText + ')');
      if (!!data.message) {
        if (data.status == 422) {
          $('#summary-error').append('<div class="alert alert-danger qtyError">'+ data.description +'</div>')
        }
      }
      
      /*if ((typeof errorCallback) === 'function') {
        errorCallback(form, XMLHttpRequest, textStatus);
      }
      else {
        ShopifyAPI.onError(XMLHttpRequest, textStatus);
      }*/
    }
  };
  jQuery.ajax(params);
};

ShopifyAPI.addItemFromForm = function(form, callback, errorCallback) {
  console.log(jQuery(form).serializeArray());
  
  if($(form).find('.btnAddToCart').hasClass('AddBundleProduct')){
    var vals = [];
    $('.bundle-products .single-product').each(function(k,v){
      var val = '';
      val = $(v).find('.product-selector option:selected').val();
      vals.push(val);
    });
    
    console.log(vals);
    var data = [];
    $('#v_ids').val(vals.join(','));
    var i = [];
    $(vals).each(function(k,v){
      //data.push({quantity: 1, id: v, properties:{'SubBundle': '0'}});      
      jQuery.ajax({
        type: 'POST',
        url: '/cart/add.js',
        async:false,
        data: {quantity: 1, id: v, properties:{'sub_bundle': '0', 'included_in_pack': true}},
        dataType: 'json',
        success:function(d){
          //console.log(d);
        }
      });
    });
  }
  
    var params = {
        type: 'POST',
        url: '/cart/add.js',
        data: jQuery(form).serialize(),
        dataType: 'json',
        beforeSend: function() {
            $('body').addClass('velaCartAdding');
        },
        success: function(line_item) {
            $('body').removeClass('velaCartAdding');
            if (window.ajaxcart_type == 'modal') {
                if (line_item.image != null) {
                    $('.headerCartModal').find('.cartProductImage img').attr('src', line_item.image);
                } else {
                    $('.headerCartModal').find('.cartProductImage img').attr('src', '//placehold.it/100x100');
                }
                $('.headerCartModal').find('.productTitle').html(line_item.title);
                $('.headerCartModal').addClass('active');
            }
            if ((typeof callback) === 'function') {
                callback(line_item, form);
            }
            else {
                ShopifyAPI.onItemAdded(line_item, form);
            }
        },
        error: function(XMLHttpRequest, textStatus) {
          	$('body').removeClass('velaCartAdding');
            if ((typeof errorCallback) === 'function') {
                errorCallback(form, XMLHttpRequest, textStatus);
            }
            else {
                ShopifyAPI.onError(XMLHttpRequest, textStatus);
            }
        }
    };
    jQuery.ajax(params);
};
ShopifyAPI.getCart = function(callback) {
    jQuery.getJSON('/cart.js', function (cart, textStatus) {
        if ((typeof callback) === 'function') {
            callback(cart);
        }
        else {
            ShopifyAPI.onCartUpdate(cart);
        }
    });
};
ShopifyAPI.changeItem = function(line, quantity, callback) {
  
  console.log('item data under change', {
  	line,
    quantity
  });
  
    var params = {
        type: 'POST',
        url: '/cart/change.js',
        data: 'quantity=' + quantity + '&line=' + line,
        dataType: 'json',
        success: function(cart) {
            if ((typeof callback) === 'function') {
                callback(cart);
            }
            else {
              ShopifyAPI.onCartUpdate(cart);
            }
        },
        error: function(XMLHttpRequest, textStatus) {
            ShopifyAPI.onError(XMLHttpRequest, textStatus);
        }
    };
    jQuery.ajax(params);
};

/*============================================================================
  Ajax Shopify Add To Cart
==============================================================================*/
var ajaxCart = (function(module, $) {
    'use strict';
    var init, loadCart;
    var settings, isUpdating, $body;
    var $formContainer, $addToCart, $cartCountSelector, $cartCostSelector, $cartContainer, $drawerContainer;
    var updateCountPrice, formOverride, itemAddedCallback, itemErrorCallback, cartUpdateCallback, buildCart, cartCallback, adjustCart, adjustCartCallback, createQtySelectors, qtySelectors, validateQty, submitAjaxCart;
  let y = 0;
    init = function (options) {
        settings = {
            formSelector       : 'form[action^="/cart/add"]',
            cartContainer      : '#cartContainer',
            addToCartSelector  : '#AddToCart',
            cartCountSelector  : '#CartCount',
            cartCostSelector   : '#CartCost',
            moneyFormat        : window.money,
            disableAjaxCart    : false,
            enableQtySelectors : true
        };
        $.extend(settings, options);
        $formContainer     = $(settings.formSelector);
        $cartContainer     = $(settings.cartContainer);
        $addToCart         = $formContainer.find(settings.addToCartSelector);
        $cartCountSelector = $(settings.cartCountSelector);
        $cartCostSelector  = $(settings.cartCostSelector);
        $body = $('body');
        isUpdating = false;
        if (settings.enableQtySelectors) {
            qtySelectors();
        }
        if (!settings.disableAjaxCart && $addToCart.length) {
            formOverride();
        }
      if(y == 0){
        y=1;
        adjustCart();
        
      }
    };
    loadCart = function () {
        $body.addClass('ajaxcartIsLoading');
        ShopifyAPI.getCart(cartUpdateCallback);
      	//Rebuy.init();
    };
    updateCountPrice = function (cart) {
        if ($cartCountSelector) {
            $cartCountSelector.html(cart.item_count).removeClass('hidden-count');
            if (cart.item_count === 0) {
                $cartCountSelector.addClass('hidden-count');
            }
        }
        if ($cartCostSelector) {
            $cartCostSelector.html(Shopify.formatMoney(cart.total_price, settings.moneyFormat));
        }
    };
    formOverride = function () {
        if (window.ajaxcart_type != 'page') {
          
            $formContainer.on('submit', function(evt) {
              console.log('newe');
              $formContainer.find("input[type='submit']").attr('disabled', 'disabled');
              if ($formContainer.data('submitted') === true) {
                console.log('asdas');
              }
              $addToCart.attr('disable', true);
                evt.preventDefault();
                $addToCart.removeClass('is-added').addClass('is-adding');
                $('.qtyError').remove();
                ShopifyAPI.addItemFromForm(evt.target, itemAddedCallback, itemErrorCallback);
                if ($formContainer.hasClass('form-ajaxtocart')) {
                    $("#velaQuickView").fadeOut(500);
                    $(".jsQuickview").html("");
                    $(".jsQuickview").fadeOut(500);
                }
              $addToCart.attr('disable', false);
            });
        }
    };
    itemAddedCallback = function (product) {
        $addToCart.removeClass('is-adding').addClass('is-added');
        ShopifyAPI.getCart(cartUpdateCallback);
    };
    itemErrorCallback = function (form, XMLHttpRequest, textStatus) {
        var data = eval('(' + XMLHttpRequest.responseText + ')');
        $addToCart.removeClass('is-adding is-added');
        if (!!data.message) {
            if (data.status == 422) {
                $(form).after('<div class="alert alert-danger qtyError">'+ data.description +'</div>')
            }
        }
    };
    cartUpdateCallback = function (cart) {
      if(typeof freeGiftProduct == 'function') {
        var result = freeGiftProduct(cart, $('body').hasClass('template-cart') ? true : false, true);
        console.log(result);
        if (result.foundMoreFreeGift == true && $('body').hasClass('template-cart') == true) {
          ShopifyAPI.getCart(cartUpdateCallback);
          return false;
        } else {
          cart = result.cart;
        }
      }
      updateCountPrice(cart);
      buildCart(cart);
    };
    buildCart = function (cart) {
      console.log(cart);
      if(window.Rebuy != undefined){
        window.Rebuy.init();
      }
        $cartContainer.empty();
        if (window.ajaxcart_type == 'modal') {
            if (cart.item_count === 0) {
                $cartContainer
                .append('<div class="headerCartEmpty">Your Cart is Empty.</div>');
                cartCallback(cart);
                return;
            }
            var items = [],
                item = {},
                data = {},
                source = $("#headerCartTemplate").html(),
                template = Handlebars.compile(source);
            $.each(cart.items, function(index, cartItem) {
                if (cartItem.image != null){
                    var prodImg = cartItem.image.replace(/(\.[^.]*)$/, "_200x$1").replace('http:', '');
                } else {
                    var prodImg = "//cdn.shopify.com/s/assets/admin/no-image-medium-cc9732cb976dd349a0df1d39816fbcc7.gif";
                }
                let productFreeGift = false;
                if (cartItem.properties !== null) {
                  $.each(cartItem.properties, function(key, value) {
                    if (key === 'Free' && value === 'Gift') {
                      productFreeGift = true;
                      delete cartItem.properties[key];
                    }
                  });
                }
                item = {
                    id: cartItem.variant_id,
                    line: index + 1, // Shopify uses a 1+ index in the API
                    url: cartItem.url,
                    img: prodImg,
                    name: cartItem.product_title,
                    variation: cartItem.variant_title,
                    properties: cartItem.properties,
                    itemAdd: cartItem.quantity + 1,
                    itemMinus: cartItem.quantity - 1,
                    itemQty: cartItem.quantity,
                    price: Shopify.formatMoney(cartItem.price, settings.moneyFormat),
                    vendor: cartItem.vendor,
                  	productType: cartItem.product_type,
                    productFreeGift: productFreeGift
                };
                if(item.properties) {
                  for (var key in item.properties) {
                    if(key[0] === "_") {
                      delete item.properties[key];
                    } 
                  }   
                }
              
              	if(item.variation) {
                  for (var key in item.variation) {
                    if(key[0] === "_") {
                      delete item.variation[key];
                    } 
                  }   
                }              
                items.push(item);
            });
            data = {
                items: items,
                note: cart.note,
                totalPrice: Shopify.formatMoney(cart.total_price, settings.moneyFormat)
            }
            $cartContainer.append(template(data));
            submitAjaxCart();
            cartCallback(cart);
        } else {
            if (cart.item_count === 0) {
              	//$('.ebyHeaderCtaWrapper').removeClass('buy').addClass('join');
              	$('.cartIndicator').addClass('ebyMinicartEmptyCount').removeClass('ebyMinicartHasCount');
              	$('.velaCartTop').addClass('empty').removeClass('avail');
              	$('.ebyMicroBtn.joinNow').removeClass('buy').addClass('join');
              	$('.header-minicart-wrapper').removeClass('checkout').addClass('shop');
              	$('.header-checkoutbtn-wrapper').removeClass('checkout').addClass('shop');
              
                $cartContainer.append('<div class="drawerCartEmpty">Your Bag is Empty. <span>Let\'s show it some love.</span></div>');
                cartCallback(cart);              	
                return;
            }
          	if (cart.item_count > 0) {
                $('.ebyHeaderCtaWrapper').removeClass('join').addClass('buy');
              	$('.ebyMicroBtn.joinNow').removeClass('join').addClass('buy');
              	$('.header-checkoutbtn-wrapper').removeClass('shop').addClass('checkout');
            }
            var items = [],
                item = {},
                data = {},
                source = $("#CartTemplate").html(),
                template = Handlebars.compile(source);
            var bundle = [], packPro= [];
            var subscription = [], subscriptionPro= [];
            var slashPrice = 0;
            $.each(cart.items, function(index, cartItem) {
                if (cartItem.image != null){
                    var prodImg = cartItem.image.replace(/(\.[^.]*)$/, "_200x$1").replace('http:', '');
                } else {
                    var prodImg = "//cdn.shopify.com/s/assets/admin/no-image-medium-cc9732cb976dd349a0df1d39816fbcc7.gif";
                }

                var originalLinePrice = cartItem.original_line_price;
                var linePrice = cartItem.line_price;

                var hasDiscount = false;

                if (originalLinePrice > linePrice) {
                  hasDiscount = true;
                }

                let productFreeGift = false;
                if (cartItem.properties !== null) {
                  $.each(cartItem.properties, function(key, value) {
                    if (key === 'Free' && value === 'Gift') {
                      productFreeGift = true;
                      delete cartItem.properties[key];
                    }
                  });
                }

                item = {
                    id: cartItem.variant_id,
                    line: index + 1, // Shopify uses a 1+ index in the API
                    url: cartItem.url,
                    img: prodImg,
                    name: cartItem.product_title,
                    variation: cartItem.variant_title,
                    properties: cartItem.properties,
                    itemAdd: cartItem.quantity + 1,
                    itemMinus: cartItem.quantity - 1,
                    itemQty: cartItem.quantity,
                    price: Shopify.formatMoney(cartItem.price, settings.moneyFormat),
                    hasDiscount: hasDiscount,
                    originalTotal: Shopify.formatMoney(originalLinePrice, settings.moneyFormat),
                    itemTotal: Shopify.formatMoney(linePrice, settings.moneyFormat),
                    vendor: cartItem.vendor,
                    productType: cartItem.product_type,
                    productFreeGift: productFreeGift
                };
              
              if(item.properties) {
                for (var key in item.properties) {
                  if(key[0] === "_") {
                    delete item.properties[key];
                  }
                  if(key == "Shipping Option") {
                    delete item.properties[key];
                  }
                  if(key == 'shipping_interval_unit_type'){
                    delete item.properties[key];
                  }
                  if(key == 'shipping_interval_frequency'){
                    delete item.properties[key];
                  }
                  if(key == 'bundle_'){
                    item['bundle'] = true;
                    bundle.push({v: cartItem.variant_title, q: cartItem.quantity});
                    delete item.properties[key];
                  }
                  if(key == 'bundle_ids'){
                    item['bundleIDS'] = item.properties[key];
                    delete item.properties[key];
                  }
                  if(key == 'sub_bundle'){
                    item['subbundle'] = true;
                    packPro.push({v : cartItem.variant_title, k: index+1, q:cartItem.quantity});
                    delete item.properties[key];
                  }
                  if(key == 'product_type' && item.properties[key] == 'Main Subscription'){
                    item['subscription'] = true;
                    subscription.push({v: cartItem.variant_title, q: cartItem.quantity});
                    delete item.properties[key];
                  }
                  if(key == 'subscription_ids'){
                    item['subscriptionIDs'] = item.properties[key];
                    delete item.properties[key];
                  }
                  if(key == 'product_type' && item.properties[key] == 'Sub Subscription'){
                    console.log('altering price of cart items');
                    
                    slashPrice += cartItem.final_line_price;
                    item['subsubscription'] = item.properties[key];
                    subscriptionPro.push({v : cartItem.variant_title, k: index+1, q:cartItem.quantity});
                    delete item.properties[key];
                  }
                }
              }
              console.log(':addtocart: added item', item);
              
              items.push(item);
            });

            data = {
                items: items,
                note: cart.note,
                totalOriginal: Shopify.formatMoney(cart.original_total_price, settings.moneyFormat),
                totalDiscount: Shopify.formatMoney(cart.total_discount, settings.moneyFormat),
                totalPrice: Shopify.formatMoney(cart.total_price - slashPrice, settings.moneyFormat)
            }
            $('.cartIndicator').removeClass('ebyMinicartEmptyCount').addClass('ebyMinicartHasCount');
            $('.velaCartTop').removeClass('empty').addClass('avail');
            $('.ebyMicroBtn.joinNow').removeClass('join').addClass('buy');
            $('.header-minicart-wrapper').removeClass('shop').addClass('checkout');
            $('.header-checkoutbtn-wrapper').removeClass('shop').addClass('checkout');
          
            $cartContainer.append(template(data));
            submitAjaxCart();
            cartCallback(cart);
        }
    };
    submitAjaxCart = function() {
      function checkAjaxCart() {
        if (isUpdating == false) {
          var result = true;
          $.ajax({
            type: 'GET',
            url: '/cart.json',
            async: false,
            dataType: 'json',
            success: function (cart) {
              if(typeof freeGiftProduct == 'function') {
                result = freeGiftProduct(cart, $('body').hasClass('template-cart') ? true : false, true);
                console.log(result);
                if (result.foundMoreFreeGift == true && $('body').hasClass('template-cart') == true) {
                  $('.cart.ajaxcart__form.ajaxcart [type="submit"]').addClass('disabled').attr("disabled", "disabled");
                  $('.cart.ajaxcart__form.ajaxcart .btn.btnVelaCart.btnCheckout').addClass('disabled').attr("disabled", "disabled");
                  $('.cart.ajaxcart__form.ajaxcart').addClass('disabled').attr("disabled", "disabled");
                  return false;
                }/* else {
                  //console.log(cartSubscription);
                  if (cartSubscription) {
                    var l = "",
                        s = "&cart_token=" + (document.cookie.match("(^|; )cart=([^;]*)") || 0)[2],
                        u = "myshopify_domain=".concat(Shopify.shop);
                    //window.SLIDECART_CUSTOMER_ID && window.SLIDECART_CUSTOMER_EMAIL && (l = "&customer_id=".concat(window.SLIDECART_CUSTOMER_ID, "&customer_email=").concat(window.SLIDECART_CUSTOMER_EMAIL));
                    try {
                      var c = "&" + ga.getAll()[0].get("linkerParam");
                    } catch (e) {
                      c = ""
                    }
                    var codeCookieValue = getCookie('discount_code');
                    var rechargeCookieValue = getCookie('ec-recharge-discount');
                    if(codeCookieValue && !rechargeCookieValue){
                      l = l.concat("&discount=" + codeCookieValue);
                    } else {
                      l = l.concat("&discount=" + rechargeCookieValue);
                    }
                    var f = "https://checkout.rechargeapps.com/r/checkout?" + u + s + c + l;
                    console.log('go to rechage checkout');
                    window.location = f;
                    return false;
                  } else {*/
                    console.log('go to shopify checkout');
                    window.location = "/checkout"
                    return false;
                  /*}
                }*/
              }
            }
          });
        } else {
          return false;
        }
      }
      $('.cart.ajaxcart .btn.btnVelaCart.btnCheckout').click(function(e){
        console.log('submit');
        e.preventDefault();
        checkAjaxCart();
      });
      $('.cart.ajaxcart [type="submit"]').click(function(e){
        console.log('submit');
        e.preventDefault();
        checkAjaxCart();
      });
    };
    cartCallback = function(cart) {
      if($('.motivator-bar').length > 0){
        checkMotivatorBanner((cart.total_price/100.0));
      }

      $body.removeClass('drawerIsLoading');
      if(window.Rebuy != undefined){
        window.Rebuy.init();
      }
        $body.trigger('ajaxCart.afterCartLoad', cart);
      	if (window.Shopify && Shopify.StorefrontExpressButtons) {
          Shopify.StorefrontExpressButtons.initialize();
        }
    };
    adjustCart = function () {
        $body.on('click', '.qtyAdjust', function() {
            var $el = $(this),
                line = $el.data('line'),
                $qtySelector = $el.siblings('.qtyNum'),
                isBundle = $qtySelector.data('prop'),
                qty = parseInt($qtySelector.val().replace(/\D/g, ''));
            var qty = validateQty(qty);
            if ($el.hasClass('velaQtyPlus')) {
                qty += 1;
            } else {
                qty -= 1;
                if (qty <= 0) qty = 0;
            }
            if (line) {
              if(isBundle == ""){
                updateQuantity(line, qty);
              }else{
                var ids = isBundle;
                var updates = ids.split(',');
                var id = [];
                $(updates).each(function(k,v){
                  id.push("updates["+v+"]="+qty+"");
                });
                updateQuantity(line, qty);
                jQuery.post('/cart/update.js', id.join('&'));
              }
            } else {
                $qtySelector.val(qty);
            }
        });
        $body.on('change', '.qtyNum', function() {
            var $el = $(this),
                line = $el.data('line'),
                isBundle = $el.data('prop'),
                qty = parseInt($el.val().replace(/\D/g, ''));
            var qty = validateQty(qty);
            if (line) {
              	if(isBundle == ""){
                  updateQuantity(line, qty);
                }else{
                  var ids = isBundle;
                  var updates = ids.split(',');
                  var id = [];
                  $(updates).each(function(k,v){
                    id.push("updates["+v+"]="+qty+"");
                  });
                  updateQuantity(line, qty);
                  jQuery.post('/cart/update.js', id.join('&'));
                }
            }
        });
        $body.on('submit', 'form.ajaxcart', function(evt) {
            if (isUpdating) {
                evt.preventDefault();
            }
        });
        $body.on('focus', '.qtyAdjust', function() {
            var $el = $(this);
            setTimeout(function() {
                $el.select();
            }, 50);
        });
        $body.on('click', '.cartRemove', function() {
            var $el = $(this),
                line = $el.data('line'),
                isBundle = $el.data('prop'),
                qty = 0;
            if (line) {
              if(isBundle == "" || isBundle == undefined){
                updateQuantity(line, qty);
              }else{
                var ids = isBundle;
                var updates = ids.split(',');
                var id = [];
                
                ShopifyAPI.getCart(function (cart) {
                	console.log('cart received', cart);
                  
                  var idsInQuestion = cart.items.map(function (item, index) {
                    if (!!item.properties['sub_bundle'] && updates.indexOf(item.id.toString()) >= 0) {
                    	id.push("updates["+item.id+"]=0");
                    }
                  });
                  
                  console.log('cart bundle prods to remove', id);
                  
                  var r = jQuery.post('/cart/update.js', id.join('&'));
                r.always(function() {
                  updateQuantity(line, qty);
                });
                  
                  
                });
                
                
              }
            }
        });
        var updateQuantity = function(line, qty) {
            isUpdating = true;
            var $row = $('.ajaxCartRow[data-line="' + line + '"]').addClass('is-loading');
            if (qty === 0) {
                $row.parent().addClass('is-removed');
            }
            if($('body').hasClass('template-cart')){
                ShopifyAPI.changeItem(line, qty);
                setTimeout(function() {
                  location.reload();
                }, 500);
            }else{
                setTimeout(function() {
                    ShopifyAPI.changeItem(line, qty, adjustCartCallback);
                }, 250);
            }
        }
        $body.on('change', 'textarea[name="note"]', function() {
            var newNote = $(this).val();
            ShopifyAPI.updateCartNote(newNote, function(cart) {});
        });
    };
    adjustCartCallback = function (cart) {
        if(typeof freeGiftProduct == 'function') {
          var result = freeGiftProduct(cart, $('body').hasClass('template-cart') ? true : false, true);
          console.log(result);
          if (result.foundMoreFreeGift == true && $('body').hasClass('template-cart') == true) {
            ShopifyAPI.getCart(cartUpdateCallback);
            return false;
          } else {
            cart = result.cart;
          }
        }
        isUpdating = false;
        updateCountPrice(cart);
        if(cart.item_count == 0){
          $('.cartIndicator').addClass('ebyMinicartEmptyCount').removeClass('ebyMinicartHasCount');
          $('.velaCartTop').addClass('empty').removeClass('avail');
          $('.ebyMicroBtn.joinNow').addClass('join').removeClass('buy');
          $('.header-minicart-wrapper').addClass('shop').removeClass('checkout');
          $('.header-checkoutbtn-wrapper').addClass('shop').removeClass('checkout');
          

          if($('.motivator-bar').length > 0){
            checkMotivatorBanner(0);
          }
          
          //ShopifyAPI.getCart(buildCart);
          setTimeout(function() {
            vela.RightDrawer.close();
          }, 150);  
        }else{
          setTimeout(function() {
            ShopifyAPI.getCart(buildCart);
          }, 150);
        }
    };
    createQtySelectors = function() {
        if ($('input[type="number"]', $cartContainer).length) {
            $('input[type="number"]', $cartContainer).each(function() {
                var $el = $(this),
                    currentQty = $el.val();
                var itemAdd = currentQty + 1,
                    itemMinus = currentQty - 1,
                    itemQty = currentQty;
                var source   = $("#velaAjaxQty").html(),
                template = Handlebars.compile(source),
                data = {
                    id: $el.data('id'),
                    itemQty: itemQty,
                    itemAdd: itemAdd,
                    itemMinus: itemMinus
                };
                $el.after(template(data)).remove();
            });
        }
    };
    qtySelectors = function() {
        var numInputs = $('input[type="number"]');
        if (numInputs.length) {
            numInputs.each(function() {
                var $el = $(this),
                    currentQty = $el.val(),
                    inputName = $el.attr('name'),
                    inputId = $el.attr('id');
                var itemAdd = currentQty + 1,
                    itemMinus = currentQty - 1,
                    itemQty = currentQty;
                var source   = $("#velaJsQty").html(),
                    template = Handlebars.compile(source),
                    data = {
                        id: $el.data('id'),
                        itemQty: itemQty,
                        itemAdd: itemAdd,
                        itemMinus: itemMinus,
                        inputName: inputName,
                        inputId: inputId
                    };
                $el.after(template(data)).remove();
            });
            $('body').on('click', '.velaQtyAdjust', function() {
                var $el = $(this),
                    id = $el.data('id'),
                    $qtySelector = $el.siblings('.velaQtyNum'),
                    qty = parseInt($qtySelector.val().replace(/\D/g, ''));
                var qty = validateQty(qty);
                if ($el.hasClass('velaQtyPlus')) {
                    qty += 1;
                } else {
                    qty -= 1;
                    if (qty <= 1) qty = 1;
                }
                $qtySelector.val(qty);
            });
        }
    };
    validateQty = function (qty) {
        if((parseFloat(qty) == parseInt(qty)) && !isNaN(qty)) {

        } else {
            qty = 1;
        }
        return qty;
    };
    module = {
        init: init,
        load: loadCart
    };
    return module;
}(ajaxCart || {}, jQuery));
$(document).ready(function() {
//   ajaxCart.init();
    ajaxCart.init({
        formSelector: '.formAddToCart',
        cartContainer: '#cartContainer',
        addToCartSelector: '.btnAddToCart',
        cartCountSelector: '#CartCount',
        cartCostSelector: '#CartCost',
        moneyFormat: window.money
    });
});
