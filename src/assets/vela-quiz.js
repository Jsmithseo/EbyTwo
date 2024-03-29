window.quiz = window.quiz || {};

quiz.cacheSelectors = function () {
  quiz.cache = {
    $steps					 : $('.steps'),
    $html                    : $('html'),
    $body                    : $('body'),
    $quizSelectionImage      : $('#ProductPhotoImg'),
    $quizLoading             : $('#loading')
  };
};

quiz.selector = [];

quiz.init = function () {
  quiz.startTheme();
};

quiz.quizPage = function(){
  
}

quiz.startTheme = function () {
  $('.sortable-handler').on('touchstart', function (e) {
    e.preventDefault();
    //alert('touchstart');
  });

  $('.sortable-handler').on('touchmove', function (e) {
    e.preventDefault();
    //console.log('touchmove');
  });

  $('.sortable-handler').on('touchcancel', function (e) {
    e.preventDefault();
    //console.log('touchcancel');
  });

  $('.sortable-handler').mouseleave(function (e) {
    e.preventDefault();
    //console.log('mouseleave');
  });
  
  function getUrlVars() {
    var vars = [], hash;
    var url = decodeURIComponent(window.location.href);
    var hashes = url.slice(url.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
      hash = hashes[i].split('=');
      //vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  }
  
  
  var product, products = [];
  var selection = [];
  var images = [];
  
  var packs = 3;
  
  /* category list start */
  var collections = window.quizCollections; 
  /* category list end */
  
  var selectedProducts = [];
  var locationProductIDs = [];
  var productLocationDetails = [];
  var customCollectionProducts = [];
  
  var collectionProduct, collectionProductStock = [];
  
  var isSubscriptionOOS = false;
  
  /* ================================================== Edit Subscription JS ================================================== */
  
  var isEdit = false;
  var editableData = getUrlVars();
  var subscriptionID;
  var subscriptionDetails;
  var subscriptionProductDetails;
  
  if( Object.keys(editableData).length > 1 ){
    isEdit = true;
    $('.ebyQuizApp').addClass('editMode');
    
    for (const [key, value] of Object.entries(editableData)) {
      var name = `${key}`;
      var val = `${value}`;
      if(name != 'id'){
        var d = {name : val};
        selection[name] = val;
      }else{
        subscriptionID = val;
      }
      $('input[name="'+name+'s"][value="' + val + '"]').attr('checked', 'checked').trigger('change');
      if(name == 'style'){
        generateRadioClick($('input[name="'+name+'s"][value="' + val + '"]'), selection);
      }
    }
    
    console.log(selection);
    
    $('.sticky-bottom').removeClass('hide');
    
    $.ajax({
      type: "POST",
      crossDomain : true,
      url: "https://secureddatasystem.com/ShopifyApps/eby/subscription.php",
      data: {data: {'customer': window.customer_id, 'id':subscriptionID, 'type':"get" } },
      dataType: 'json',
      success: function(response){
        console.log(response);
        subscriptionDetails = response.subscription;
        subscriptionProductDetails = response.products;
        console.log(subscriptionDetails);
      },
      error: function(xhr, text) {
        console.log(text);
        console.log(xhr);
      }
    });    
  }else{
    var d = window.localStorage.getItem('quizStyle');
    var editableData = JSON.parse(d);
    //console.log(d);
    //console.log(editableData);

    if(editableData != undefined){
      var name = editableData.name;
      var val = editableData.value;
      selection[name] = val;

      $('input[name="'+name+'s"][value="' + val + '"]').attr('checked', 'checked').trigger('change');
      //console.log($('input[name="'+name+'s"][value="' + val + '"]'));
      if(name == 'style'){
        generateRadioClick($('input[name="'+name+'s"][value="' + val + '"]'), selection);
      }
      //console.log(selection);
      $('.sticky-bottom').removeClass('hide');
      $('.steps .step').removeClass('active');
      $('.steps .step[data-step="2"]').addClass('active');
      $('.sticky-top').removeClass('hide');
      window.localStorage.removeItem('quizStyle');
    }
  }
  
  /* ================================================== Edit Subscription JS ================================================== */
  
  var getCollectionHandle = function(data){
    var collection = '';
    if(data[0] == 'All Thongs'){
      if((data[2] == 'Only Neutrals' || data[data.length - 1] == 'Only Neutrals') && (data[3] == 'Every 3 Months' || data[2] == 'Every 3 Months')){
        collection = 'first-box-at-nu-quarterly-assortment';
      }
      if((data[2] == 'Mixed Colors' || data[data.length - 1] == 'Mixed Colors') && (data[3] == 'Every 3 Months' || data[2] == 'Every 3 Months')){
        collection = 'first-box-at-mx-quarterly-assortment';
      }

      if((data[2] == 'Only Neutrals' || data[data.length - 1] == 'Only Neutrals') && (data[3] == 'Every 6 Months' || data[2] == 'Every 6 Months')){
        //collection = '';
      }
      if((data[2] == 'Mixed Colors' || data[data.length - 1] == 'Mixed Colors') && (data[3] == 'Every 6 Months' || data[2] == 'Every 6 Months')){
        collection = 'first-box-at-mx-semi-annual-assortment';
      }
    }else if(data[0] == 'All Briefs'){
      if((data[2] == 'Only Neutrals' || data[data.length - 1] == 'Only Neutrals') && (data[3] == 'Every 3 Months' || data[2] == 'Every 3 Months')){
        collection = 'first-box-ab-nu-quarterly-assortment';
      }
      if((data[2] == 'Mixed Colors' || data[data.length - 1] == 'Mixed Colors') && (data[3] == 'Every 3 Months' || data[2] == 'Every 3 Months')){
        collection = 'first-box-ab-mx-quarterly-assortment';
      }

      if((data[2] == 'Only Neutrals' || data[data.length - 1] == 'Only Neutrals') && (data[3] == 'Every 6 Months' || data[2] == 'Every 6 Months')){
        //collection = '';
      }
      if((data[2] == 'Mixed Colors' || data[data.length - 1] == 'Mixed Colors') && (data[3] == 'Every 6 Months' || data[2] == 'Every 6 Months')){
        collection = 'first-box-ab-mx-semi-annual-assortment';
      }
    }else if(data[0] == 'Mixed Styles'){
      if((data[2] == 'Only Neutrals' || data[data.length - 1] == 'Only Neutrals') && (data[3] == 'Every 3 Months' || data[2] == 'Every 3 Months')){
        collection = 'first-box-mx-nu-quarterly-assortment';
      }
      if((data[2] == 'Mixed Colors' || data[data.length - 1] == 'Mixed Colors') && (data[3] == 'Every 3 Months' || data[2] == 'Every 3 Months')){
        collection = 'first-box-mx-mx-quarterly-assortment';
      }

      if((data[2] == 'Only Neutrals' || data[data.length - 1] == 'Only Neutrals') && (data[3] == 'Every 6 Months' || data[2] == 'Every 6 Months')){
        //collection = '';
      }
      if((data[2] == 'Mixed Colors' || data[data.length - 1] == 'Mixed Colors') && (data[3] == 'Every 6 Months' || data[2] == 'Every 6 Months')){
        collection = 'first-box-mx-mx-semi-annual-assortment';
      }
    }else if(data[0] == 'All High Waisted'){
      if((data[2] == 'Only Neutrals' || data[data.length - 1] == 'Only Neutrals') && (data[3] == 'Every 3 Months' || data[2] == 'Every 3 Months')){
        collection = 'first-box-hw-nu-quarterly-assortment';
      }
      if((data[2] == 'Mixed Colors' || data[data.length - 1] == 'Mixed Colors') && (data[3] == 'Every 3 Months' || data[2] == 'Every 3 Months')){
        collection = 'first-box-hw-mx-quarterly-assortment';
      }

      if((data[2] == 'Only Neutrals' || data[data.length - 1] == 'Only Neutrals') && (data[3] == 'Every 6 Months' || data[2] == 'Every 6 Months')){
        collection = '';
      }
      if((data[2] == 'Mixed Colors' || data[data.length - 1] == 'Mixed Colors') && (data[3] == 'Every 6 Months' || data[2] == 'Every 6 Months')){
        collection = 'first-box-hw-mx-semi-annual-assortment';
      }
    }else if(data[0] == 'Full Coverage'){
      if((data[2] == 'Only Neutrals' || data[data.length - 1] == 'Only Neutrals') && (data[3] == 'Every 3 Months' || data[2] == 'Every 3 Months')){
        collection = 'first-box-fc-nu-quarterly-assortment';
      }
      if((data[2] == 'Mixed Colors' || data[data.length - 1] == 'Mixed Colors') && (data[3] == 'Every 3 Months' || data[2] == 'Every 3 Months')){
        collection = 'first-box-fc-mx-quarterly-assortment';
      }
      if((data[2] == 'Only Neutrals' || data[data.length - 1] == 'Only Neutrals') && (data[3] == 'Every 6 Months' || data[2] == 'Every 6 Months')){
        collection = '';
      }
      if((data[2] == 'Mixed Colors' || data[data.length - 1] == 'Mixed Colors') && (data[3] == 'Every 6 Months' || data[2] == 'Every 6 Months')){
        collection = 'first-box-fc-mx-semi-annual-assortment';
      }
    }
    return collection;
  };
  
  function getSize(size){
    var t = '';
    switch (size) {
      case 'XS': t = "XS"; break;
      case 'SM': t = "Small"; break;
      case 'MD': t = "Medium"; break;
      case 'LG': t = "Large"; break;
      case 'XL': t = "XL"; break;
      case '1X': t = "1X"; break;
      case '2X': t = "2X"; break;
      case '3X': t = "3X"; break;
      case '4X': t = "4X"; break;
    }
    return t;
  }
  
  /* ================================================== Get location index ================================================== */
  
  var getLocationIndex = function(info){
    var i;
    $(info).each(function(index,location){
      if(location.name == "Subscription First Box WH"){
        i = index;
      }
    });
    return i;
  };
  
  /* ================================================== Get location index ================================================== */
  
  /* ================================================== Last Step function ================================================== */
  
  $('.ebyQuizReviews.planReviews .ebyReviewsBlurbListing').owlCarousel({
    autoplay: true,
    loop: true,
    items: 1,
    dots: true
  });

  $(document).on('mouseout', '.selection-list label', function() {
    // find selected input
    var selectedOption = $('.selection_wrapper').find(".step.active input[type='radio']:checked");
    var currentActive = $(' .steps').find('.active').data('index');
    // if no selected input, go back to Land image
      if (selectedOption.length > 0) {
        var backgroundImage = selectedOption.attr("data-img");
        // change current background image
        $('.image_wrapper .steps').find('.step[data-index="'+currentActive+'"]').find('.feature_img img').attr('src', backgroundImage);
      } else {
        // what is the currently landing page of the current screen supposed to be
    var defaultImageOfCurrentScreen = $('.step.active').find('.feature_img img').attr('data-ogsrc');
        console.log('default bg 1', defaultImageOfCurrentScreen);
        $('.image_wrapper .steps').find('.step[data-index="'+currentActive+'"]').find('.feature_img img').attr('src', defaultImageOfCurrentScreen);
      }
    
  });
  
  function redirectToRechargeCheckout(cart){
    //console.log(cart);
    $.ajax({
      type: "POST",
      crossDomain : true,
      url: "https://secureddatasystem.com/ShopifyApps/eby/index.php",
      data: {data: cart},
      dataType: 'json',
      success: function(data){
        $('body').removeClass('velaCartAdding');
        var token = data.checkout.token;
        var url = 'https://checkout.rechargeapps.com/r/checkout/'+token+'?myshopify_domain=eby-by-sofia-vergara.myshopify.com';

        if (window.offerDataCoupon) {
          //url = `${url}&discount=${window.offerDataCoupon}`;
          url = `${url}`;
        } else {
       	  url = `${url}`;
        }

        location.href=url;
      }
    });
  }
  
  function generateResultPreview(detail){
    var selectionHTML = '';
    $(detail).each(function(k,v){
      var l,t ='';
      if(k == '0'){ l = 'Membership'; t = v;}
      if(k == '1'){
        l = 'Size';
        t = getSize(v);
        //t = v;
      }
      if(k == '2' && v.indexOf('month') <= 0){ l = 'Colors'; t = v;}
      if(k == '2' && v.indexOf('month') >= 0){ l = 'Shipments'; t = v;}
      if(k == '3' && v.indexOf('month') >= 0){ l = 'Shipments'; t = v;}
      if(k == '3' && v.indexOf('month') <= 0){ l = 'Colors'; t = v;}
      if(k == '0' || k == '1' || k == '2' || k == '3'){
        selectionHTML += '<li><strong>'+l+'</strong><br/><span>'+t+'</span></li>';
      }
    });
    $('#summary-detail').html(selectionHTML);
  }
  
  function generateRadioClick(input, selection){
    var selected = Object.values(selection);
    
    var imgSrc = $(input).data('img');

    var currentActive = $('.steps').find('.active').data('index');
    //console.log(input);
    //console.log(selected);
    //console.log(imgSrc);
    if($(input).attr('name') == 'sizes'){

      if(selected[0] == 'Custom Collection'){
        var htm = '<li data-index="1" data-product="" data-group="" class="selected"></li><li data-index="2" data-product="" data-group="" class=""></li><li data-index="3" data-product="" data-group="" class=""></li><li data-index="4" data-product="" data-group="" class="hide"></li><li data-index="5" data-product="" data-group="" class="hide"></li>';
        $('.selection-list-wrapper .product-selection-wrapper').html(htm);
        customCollectionProducts = [];
        $('.custom-plan-error').html('');
      }

      var imgSrc = $(input).data(selection.color == 'Only Neutrals' ? 'neutral-img' : 'mixed-img');
      if(selection.style == 'All Thongs'){
        if($(input).val() == 'XS' || $(input).val() == 'SM' || $(input).val() == 'MD'){
          imgSrc = '//cdn.shopify.com/s/files/1/0313/4062/5964/files/th-xs-md_800x.jpg?v=2725560212675678276';
        }else if($(input).val() == 'LG' || $(input).val() == 'XL' || $(input).val() == '1X'){
          imgSrc = '//cdn.shopify.com/s/files/1/0313/4062/5964/files/th-lg-1x_800x.jpg?v=2205138654221181440';
        }else if($(input).val() == '2X' || $(input).val() == '3X' || $(input).val() == '4X'){
          imgSrc = '//cdn.shopify.com/s/files/1/0313/4062/5964/files/th-2x-4x_800x.jpg?v=4380119296532889040';
        }
      }else if(selection.style == 'All Briefs'){
        if($(input).val() == 'XS' || $(input).val() == 'SM' || $(input).val() == 'MD'){
          imgSrc = '//cdn.shopify.com/s/files/1/0313/4062/5964/files/bf-xs-md_800x.jpg?v=4335830165275180013';
        }else if($(input).val() == 'LG' || $(input).val() == 'XL' || $(input).val() == '1X'){
          imgSrc = '//cdn.shopify.com/s/files/1/0313/4062/5964/files/bf-lg-1x_800x.jpg?v=4706614556980228517';
        }else if($(input).val() == '2X' || $(input).val() == '3X' || $(input).val() == '4X'){
          imgSrc = '//cdn.shopify.com/s/files/1/0313/4062/5964/files/bf-2x-4x_800x.jpg?v=5790137143841315113';
        }
      }else if(selection.style == 'Mixed Styles'){
        if($(input).val() == 'XS' || $(input).val() == 'SM' || $(input).val() == 'MD'){
          imgSrc = '//cdn.shopify.com/s/files/1/0313/4062/5964/files/mx-xs-md_800x.jpg?v=11506267250706871318';
        }else if($(input).val() == 'LG' || $(input).val() == 'XL' || $(input).val() == '1X'){
          imgSrc = '//cdn.shopify.com/s/files/1/0313/4062/5964/files/mx-lg-1x_800x.jpg?v=4053023341695244635';
        }else if($(input).val() == '2X' || $(input).val() == '3X' || $(input).val() == '4X'){
          imgSrc = '//cdn.shopify.com/s/files/1/0313/4062/5964/files/mx-2x-4x_800x.jpg?v=12451042439503244820';
        }
      }else if(selection.style == 'All High Waisted'){
        if($(input).val() == 'XS' || $(input).val() == 'SM' || $(input).val() == 'MD'){
          imgSrc = '//cdn.shopify.com/s/files/1/0313/4062/5964/files/hw-xs-md_800x.jpg?v=8414177096750587582';
        }else if($(input).val() == 'LG' || $(input).val() == 'XL' || $(input).val() == '1X'){
          imgSrc = '//cdn.shopify.com/s/files/1/0313/4062/5964/files/hw-lg-1x_800x.jpg?v=13352877859073276617';
        }else if($(input).val() == '2X' || $(input).val() == '3X' || $(input).val() == '4X'){
          imgSrc = '//cdn.shopify.com/s/files/1/0313/4062/5964/files/hw-2x-4x_800x.jpg?v=10574369161203492572';
        }
      }else if(selection.style == 'Full Coverage'){
        if($(input).val() == 'XS' || $(input).val() == 'SM' || $(input).val() == 'MD'){
          imgSrc = '//cdn.shopify.com/s/files/1/0313/4062/5964/files/fc-xs-md_800x.jpg?v=8683876195333143600';
        }else if($(input).val() == 'LG' || $(input).val() == 'XL' || $(input).val() == '1X'){
          imgSrc = '//cdn.shopify.com/s/files/1/0313/4062/5964/files/fc-lg-1x_800x.jpg?v=10125282441437075726';
        }else if($(input).val() == '2X' || $(input).val() == '3X' || $(input).val() == '4X'){
          imgSrc = '//cdn.shopify.com/s/files/1/0313/4062/5964/files/fc-2x-4x_800x.jpg?v=16866653788872890860';
        }
      }

      $('.image_wrapper .steps').find('.step[data-index="'+currentActive+'"]').find('.feature_img img').attr('src', imgSrc);
    }else if($(input).attr('name') == 'plans'){
      var imgSrc = $(input).data(selection.color == 'Only Neutrals' ? 'nu-img' : 'mx-img');

      $('.image_wrapper .steps').find('.step[data-index="'+currentActive+'"]').find('.feature_img img').attr('src', imgSrc);
    }else{
      $('.image_wrapper .steps').find('.step[data-index="'+currentActive+'"]').find('.feature_img img').attr('src', imgSrc);
    }
    
    if($(input).attr('name') == 'styles'){
      if(selected[0] == "Custom Collection" || selected[0] == "Full Coverage" || selected[0] == "All High Waisted"){
        $('.quiz-style li').removeClass('hide');
        $('.quiz-style .load-more-btn').addClass('hide');
      }
    }

    if($(input).parents('.step').data('group') == 'style'){
      var v = $(input).val();
      $('.back-btn .style-selection').text(v);
      $('.selection_wrapper .sticky-bottom').removeClass('hide');
    }else{
      //selection[$(input).parents('.step').data('group')] = $(input).val();
    }

    if($(input).attr('name') == 'plans'){
      if(value == 'Every 3 Months'){
        packs = 3;
      }else{
        packs = 5;
      }
    }

    if($(input).attr('name') == 'pair'){
      var packTotal = $('input[name="pair"]:checked').data('pack');

      var value = $(input).val();
      if(value == 'Choose 3 Panties'){
        packTotal = 3;
        if(customCollectionProducts.length > 0){
          customCollectionProducts.splice(3, 2);
        }
        $('.custom-plan-detail').html("<b>3 Panties</b> Delivered <b>Every 3 Months</b>");
        $('.quiz-pick-style').find('.infor .price-plan h3').text('$45');
        $('.quiz-pick-style').find('.infor .price-plan s').text('$59');
        $('.quiz-pick-style').find('.infor .price-plan span').text('$9');
        $('.product-selection-wrapper > li').each(function(k,v){
          if(k < 3){
            packs = 3;
            $(v).removeClass('hide');
          }else{
            $('.product-selection-wrapper > li:eq('+k+')').removeClass('reserved').html('');
            packs = 5;
            $(v).addClass('hide');
          }
        });
        $('.product-selection-wrapper > li:eq(3)').addClass('selected');
      }
      if(value == 'Choose 5 Panties'){
        packTotal = 5;        
        $('.custom-plan-detail').html("<b>5 Panties</b> Delivered <b>Every 6 Months</b>");
        $('.quiz-pick-style').find('.infor .price-plan h3').text('$65');
        $('.quiz-pick-style').find('.infor .price-plan s').text('$90');
        $('.quiz-pick-style').find('.infor .price-plan span').text('$25');
        $('.product-selection-wrapper li').removeClass('hide');
        $('.product-selection-wrapper > li:eq(4)').removeClass('selected');
      }

      console.log(subscriptionProductDetails);
      /*$(subscriptionProductDetails).each(function(keyP, product){
        console.log(product);
        if(product.product_type == "Core Underwear"){
          var select = [];
          //console.log(product.variants);
          $(product.variants).each(function(key, variant){
            if(variant.title == selected[1].toLowerCase()){
              select = {
                id: product.id,
                available: variant.available,
                v_id: variant.id,
                title: product.title,
                sku: variant.sku,
                img: 'https://cdn.shopify.com/s/files/1/0313/4062/5964/files/'+product.handle+'.jpg'
              };
            }
          });
          console.log(select);
          var html = '<div class="product-line-item"><span class="product_image"><img src="'+select.img+'"></span><span class="product_detail"><h3>'+select.title+'</h3><p><a href="javascript:void(0);" class="edit-product-btn">Edit</a></p></span></div>';
          console.log(html);
          $('.product-selection-wrapper > li').each(function(k,v){
            console.log($(v));
            if($(v).hasClass('reserved')){
            }else{
              var grp = "";
              var h = product.handle;
              if(h.indexOf('thong') != -1){grp="thong";}
              if(h.indexOf('brief') != -1){grp="brief";}
              if(h.indexOf('highwaisted') != -1){grp="highwaisted";}
              if(h.indexOf('highwaisted-thong') != -1){grp="highwaisted-thong";}
              if(h.indexOf('bikini') != -1){grp="bikini";}
              if(h.indexOf('cheeky') != -1){grp="cheeky";}
              $(v).attr('data-group', grp);
              $(v).attr('data-product', product.handle);
              $(v).removeClass('selected').addClass('reserved').html(html);
              var o = k+1;
              console.log(o);
              console.log(packTotal);
              if(o == packTotal){
                $('.sticky-bottom .next-btn').removeClass('hide');
              }
              if($('.product-selection-wrapper > li:eq('+o+')').hasClass('active')){
              }else{
                $('.product-selection-wrapper > li:eq('+o+')').addClass('selected');
              }
              return false;
            }
            
          });
          customCollectionProducts.push(select);
        }
      });*/
      
      //console.log(customCollectionProducts.length);
      //console.log(customCollectionProducts);
      if(customCollectionProducts.length == packTotal){
        $('.sticky-bottom .next-btn').removeClass('hide');
      }else{
        $('.sticky-bottom .next-btn').addClass('hide');
      }

    }
    console.log(subscriptionDetails);
    if(subscriptionDetails != undefined){
      $('#productSelect').val(subscriptionDetails.shopify_variant_id);
    }
    $('.selection_wrapper .next-btn').attr('disable', false);
  }
  
  /* ================================================== Last Step function ================================================== */
  
  /* ================================================== Quiz page functionality JS ================================================== */
  
  $(document).on('mouseover', '.selection-list label', function() {
    var inputData = $(this).siblings('input[type="radio"]');
    var imgSrc = $(this).siblings('input[type="radio"]').data('img');
    
    var currentActive = $(' .steps').find('.active').data('index');
    if($(inputData).attr('name') == 'sizes'){
      var imgSrc = $(inputData).data(selection.color == 'Only Neutrals' ? 'neutral-img' : 'mixed-img');
      if(selection.style == 'All Thongs'){
        if($(inputData).val() == 'XS' || $(inputData).val() == 'SM' || $(inputData).val() == 'MD'){
          imgSrc = '//cdn.shopify.com/s/files/1/0313/4062/5964/files/th-xs-md_800x.jpg?v=2725560212675678276';
        }else if($(inputData).val() == 'LG' || $(inputData).val() == 'XL' || $(inputData).val() == '1X'){
          imgSrc = '//cdn.shopify.com/s/files/1/0313/4062/5964/files/th-lg-1x_800x.jpg?v=2205138654221181440';
        }else if($(inputData).val() == '2X' || $(inputData).val() == '3X' || $(inputData).val() == '4X'){
          imgSrc = '//cdn.shopify.com/s/files/1/0313/4062/5964/files/th-2x-4x_800x.jpg?v=4380119296532889040';
        }
      }else if(selection.style == 'All Briefs'){
        if($(inputData).val() == 'XS' || $(inputData).val() == 'SM' || $(inputData).val() == 'MD'){
          imgSrc = '//cdn.shopify.com/s/files/1/0313/4062/5964/files/bf-xs-md_800x.jpg?v=4335830165275180013';
        }else if($(inputData).val() == 'LG' || $(inputData).val() == 'XL' || $(inputData).val() == '1X'){
          imgSrc = '//cdn.shopify.com/s/files/1/0313/4062/5964/files/bf-lg-1x_800x.jpg?v=4706614556980228517';
        }else if($(inputData).val() == '2X' || $(inputData).val() == '3X' || $(inputData).val() == '4X'){
          imgSrc = '//cdn.shopify.com/s/files/1/0313/4062/5964/files/bf-2x-4x_800x.jpg?v=5790137143841315113';
        }
      }else if(selection.style == 'Mixed Styles'){
        if($(inputData).val() == 'XS' || $(inputData).val() == 'SM' || $(inputData).val() == 'MD'){
          imgSrc = '//cdn.shopify.com/s/files/1/0313/4062/5964/files/mx-xs-md_800x.jpg?v=11506267250706871318';
        }else if($(inputData).val() == 'LG' || $(inputData).val() == 'XL' || $(inputData).val() == '1X'){
          imgSrc = '//cdn.shopify.com/s/files/1/0313/4062/5964/files/mx-lg-1x_800x.jpg?v=4053023341695244635';
        }else if($(inputData).val() == '2X' || $(inputData).val() == '3X' || $(inputData).val() == '4X'){
          imgSrc = '//cdn.shopify.com/s/files/1/0313/4062/5964/files/mx-2x-4x_800x.jpg?v=12451042439503244820';
        }
      }else if(selection.style == 'All High Waisted'){
        if($(inputData).val() == 'XS' || $(inputData).val() == 'SM' || $(inputData).val() == 'MD'){
          imgSrc = '//cdn.shopify.com/s/files/1/0313/4062/5964/files/hw-xs-md_800x.jpg?v=8414177096750587582';
        }else if($(inputData).val() == 'LG' || $(inputData).val() == 'XL' || $(inputData).val() == '1X'){
          imgSrc = '//cdn.shopify.com/s/files/1/0313/4062/5964/files/hw-lg-1x_800x.jpg?v=13352877859073276617';
        }else if($(inputData).val() == '2X' || $(inputData).val() == '3X' || $(inputData).val() == '4X'){
          imgSrc = '//cdn.shopify.com/s/files/1/0313/4062/5964/files/hw-2x-4x_800x.jpg?v=10574369161203492572';
        }
      }else if(selection.style == 'Full Coverage'){
        if($(inputData).val() == 'XS' || $(inputData).val() == 'SM' || $(inputData).val() == 'MD'){
          imgSrc = '//cdn.shopify.com/s/files/1/0313/4062/5964/files/fc-xs-md_800x.jpg?v=8683876195333143600';
        }else if($(inputData).val() == 'LG' || $(inputData).val() == 'XL' || $(inputData).val() == '1X'){
          imgSrc = '//cdn.shopify.com/s/files/1/0313/4062/5964/files/fc-lg-1x_800x.jpg?v=10125282441437075726';
        }else if($(inputData).val() == '2X' || $(inputData).val() == '3X' || $(inputData).val() == '4X'){
          imgSrc = '//cdn.shopify.com/s/files/1/0313/4062/5964/files/fc-2x-4x_800x.jpg?v=16866653788872890860';
        }
      }
      
      $('.image_wrapper .steps').find('.step[data-index="'+currentActive+'"]').find('.feature_img img').attr('src', imgSrc);
    }else if($(inputData).attr('name') == 'plans'){
      var imgSrc = $(inputData).data(selection.color == 'Only Neutrals' ? 'nu-img' : 'mx-img');
      
      $('.image_wrapper .steps').find('.step[data-index="'+currentActive+'"]').find('.feature_img img').attr('src', imgSrc);
    }else{
      $('.image_wrapper .steps').find('.step[data-index="'+currentActive+'"]').find('.feature_img img').attr('src', imgSrc);
    }
    
  });
  
  $(document).on('click', '.selection-list input[type="radio"]', function() {
    selection[$(this).parents('.step').data('group')] = $(this).val();
    
    $(this).parents('.selection-list-wrapper').find('.quiz_error').html('');
    
    var selected = Object.values(selection);
    
    var imgSrc = $(this).data('img');
    console.log(selection);
    var currentActive = $(' .steps').find('.active').data('index');
    
    if($(this).attr('name') == 'sizes'){
      if(selected[0] == 'Custom Collection'){
        var htm = '<li data-index="1" data-product="" data-group="" class="selected"></li><li data-index="2" data-product="" data-group="" class=""></li><li data-index="3" data-product="" data-group="" class=""></li><li data-index="4" data-product="" data-group="" class="hide"></li><li data-index="5" data-product="" data-group="" class="hide"></li>';
        $('.selection-list-wrapper .product-selection-wrapper').html(htm);
        customCollectionProducts = [];
        $('.custom-plan-error').html('');
      }
      
      var imgSrc = $(this).data(selection.color == 'Only Neutrals' ? 'neutral-img' : 'mixed-img');
      if(selection.style == 'All Thongs'){
        if($(this).val() == 'XS' || $(this).val() == 'SM' || $(this).val() == 'MD'){
          imgSrc = '//cdn.shopify.com/s/files/1/0313/4062/5964/files/th-xs-md_800x.jpg?v=2725560212675678276';
        }else if($(this).val() == 'LG' || $(this).val() == 'XL' || $(this).val() == '1X'){
          imgSrc = '//cdn.shopify.com/s/files/1/0313/4062/5964/files/th-lg-1x_800x.jpg?v=2205138654221181440';
        }else if($(this).val() == '2X' || $(this).val() == '3X' || $(this).val() == '4X'){
          imgSrc = '//cdn.shopify.com/s/files/1/0313/4062/5964/files/th-2x-4x_800x.jpg?v=4380119296532889040';
        }
      }else if(selection.style == 'All Briefs'){
        if($(this).val() == 'XS' || $(this).val() == 'SM' || $(this).val() == 'MD'){
          imgSrc = '//cdn.shopify.com/s/files/1/0313/4062/5964/files/bf-xs-md_800x.jpg?v=4335830165275180013';
        }else if($(this).val() == 'LG' || $(this).val() == 'XL' || $(this).val() == '1X'){
          imgSrc = '//cdn.shopify.com/s/files/1/0313/4062/5964/files/bf-lg-1x_800x.jpg?v=4706614556980228517';
        }else if($(this).val() == '2X' || $(this).val() == '3X' || $(this).val() == '4X'){
          imgSrc = '//cdn.shopify.com/s/files/1/0313/4062/5964/files/bf-2x-4x_800x.jpg?v=5790137143841315113';
        }
      }else if(selection.style == 'Mixed Styles'){
        if($(this).val() == 'XS' || $(this).val() == 'SM' || $(this).val() == 'MD'){
          imgSrc = '//cdn.shopify.com/s/files/1/0313/4062/5964/files/mx-xs-md_800x.jpg?v=11506267250706871318';
        }else if($(this).val() == 'LG' || $(this).val() == 'XL' || $(this).val() == '1X'){
          imgSrc = '//cdn.shopify.com/s/files/1/0313/4062/5964/files/mx-lg-1x_800x.jpg?v=4053023341695244635';
        }else if($(this).val() == '2X' || $(this).val() == '3X' || $(this).val() == '4X'){
          imgSrc = '//cdn.shopify.com/s/files/1/0313/4062/5964/files/mx-2x-4x_800x.jpg?v=12451042439503244820';
        }
      }else if(selection.style == 'All High Waisted'){
        if($(this).val() == 'XS' || $(this).val() == 'SM' || $(this).val() == 'MD'){
          imgSrc = '//cdn.shopify.com/s/files/1/0313/4062/5964/files/hw-xs-md_800x.jpg?v=8414177096750587582';
        }else if($(this).val() == 'LG' || $(this).val() == 'XL' || $(this).val() == '1X'){
          imgSrc = '//cdn.shopify.com/s/files/1/0313/4062/5964/files/hw-lg-1x_800x.jpg?v=13352877859073276617';
        }else if($(this).val() == '2X' || $(this).val() == '3X' || $(this).val() == '4X'){
          imgSrc = '//cdn.shopify.com/s/files/1/0313/4062/5964/files/hw-2x-4x_800x.jpg?v=10574369161203492572';
        }
      }else if(selection.style == 'Full Coverage'){
        if($(this).val() == 'XS' || $(this).val() == 'SM' || $(this).val() == 'MD'){
          imgSrc = '//cdn.shopify.com/s/files/1/0313/4062/5964/files/fc-xs-md_800x.jpg?v=8683876195333143600';
        }else if($(this).val() == 'LG' || $(this).val() == 'XL' || $(this).val() == '1X'){
          imgSrc = '//cdn.shopify.com/s/files/1/0313/4062/5964/files/fc-lg-1x_800x.jpg?v=10125282441437075726';
        }else if($(this).val() == '2X' || $(this).val() == '3X' || $(this).val() == '4X'){
          imgSrc = '//cdn.shopify.com/s/files/1/0313/4062/5964/files/fc-2x-4x_800x.jpg?v=16866653788872890860';
        }
      }
      
      $('.image_wrapper .steps').find('.step[data-index="'+currentActive+'"]').find('.feature_img img').attr('src', imgSrc);
    }else if($(this).attr('name') == 'plans'){
      var imgSrc = $(this).data(selection.color == 'Only Neutrals' ? 'nu-img' : 'mx-img');
      
      $('.image_wrapper .steps').find('.step[data-index="'+currentActive+'"]').find('.feature_img img').attr('src', imgSrc);
    }else{
      $('.image_wrapper .steps').find('.step[data-index="'+currentActive+'"]').find('.feature_img img').attr('src', imgSrc);
    }
    
    if($(this).parents('.step').data('group') == 'style'){
      var v = $(this).val();
      $('.sticky-top .style-selection').text(v);
      $('.selection_wrapper .sticky-bottom').removeClass('hide');
    }else{
      //selection[$(this).parents('.step').data('group')] = $(this).val();
    }
    
    if($(this).attr('name') == 'plans'){
      if(value == 'Every 3 Months'){
        packs = 3;
      }else{
        packs = 5;
      }
    }
    
    if($(this).attr('name') == 'pair'){
      var packTotal = $('input[name="pair"]:checked').data('pack');
      
      var value = $(this).val();
      console.log(value);
      console.log(packTotal);
      
      if(value == 'Choose 3 Panties'){
        packTotal = 3;
        customCollectionProducts.splice(3, 2);
        //customCollectionProducts.splice(4, 1);
        $('.custom-plan-detail').html("<b>3 Panties</b> Delivered <b>Every 3 Months</b>");
        $('.quiz-pick-style').find('.infor .price-plan h3').text('$45');
        $('.quiz-pick-style').find('.infor .price-plan s').text('$59');
        $('.quiz-pick-style').find('.infor .price-plan span').text('$9');
        //$('.product-selection-wrapper li').removeClass('hide');
        $('.product-selection-wrapper > li').each(function(k,v){
          if(k < 3){
            packs = 3;
            $(v).removeClass('hide');
          }else{
            $('.product-selection-wrapper > li:eq('+k+')').removeClass('reserved').html('');
            packs = 5;
            $(v).addClass('hide');
          }
        });
        $('.product-selection-wrapper > li:eq(3)').addClass('selected');
      }
      if(value == 'Choose 5 Panties'){
        packTotal = 5;        
        $('.custom-plan-detail').html("<b>5 Panties</b> Delivered <b>Every 6 Months</b>");
        $('.quiz-pick-style').find('.infor .price-plan h3').text('$65');
        $('.quiz-pick-style').find('.infor .price-plan s').text('$90');
        $('.quiz-pick-style').find('.infor .price-plan span').text('$25');
        $('.product-selection-wrapper li').removeClass('hide');
      }
      //console.log(customCollectionProducts.length);
      //console.log(customCollectionProducts);
      if(customCollectionProducts.length == packTotal){
        $('.sticky-bottom .next-btn').removeClass('hide');
      }else{
        $('.sticky-bottom .next-btn').addClass('hide');
      }
    }
    
    $('.selection_wrapper .next-btn').attr('disable', false);
  });
  
  $('.back-btn').on('click', function(){
    var selected = Object.values(selection);
    
    var currentActive = $('.steps').find('.step.active').data('index');
    console.log('::current screen init', currentActive);
    if(currentActive == 4){
      var t = getSize(selected[1]);
      
      $('.sticky-top .prev-selection').text(t);
      
      var newIndex = currentActive-1;
      $('.steps').find('.step').removeClass('active');
      $('.img_section .steps').find('.step[data-index="'+newIndex+'"]').addClass('active');
      $('.steps').find('.step.quiz-color').addClass('active');
    }
    
    if(currentActive == 3){
      $('.back-btn .prev-selection').text('');
    }
    
    // remove custom box wrapper class when not in it
    if(currentActive == 5 && selected[0] == 'Custom Collection'){
      $('.ebyQuizApp').addClass('ebyCustomSelectionWrapper');
    }else{
      $('.ebyQuizApp').removeClass('ebyCustomSelectionWrapper');
    }
    
    $('.next-btn').removeClass('hide');
    $('.final-step').addClass('hide');
    
    if(currentActive == 5 && selected[0] == 'Custom Collection'){
      var newIndex = currentActive-2;
      $('.steps').find('.step').removeClass('active');
      $('.img_section .steps').find('.step[data-index="'+newIndex+'"]').addClass('active');
      $('.steps').find('.step.quiz-pick-style').addClass('active');
      //$('.steps').find('.step[data-index="'+newIndex+'"]').addClass('active');
    }else{
      if(currentActive == 5){
        var selected1 = Object.values(selection);
        selected1.splice(0, 1);

        selected1[0] = getSize(selected1[0]);
        selected1.pop();
        $('.back-btn .prev-selection').text(selected1.join(', '));
      }
      if(currentActive != 4){
        var newIndex = currentActive-1;
        $('.steps').find('.step').removeClass('active');
        $('.steps').find('.step[data-index="'+newIndex+'"]').addClass('active');
      }
    }
    
    if($('.steps').find('.active').data('index') == 1){
      $('.selection_wrapper .sticky-top .back-btn').addClass('hide');
    }else{
      $('.selection_wrapper .sticky-top .back-btn').removeClass('hide');
    }
  });
  
  $('.final-step .edit-selection').on('click', function(){
    var currentActive = $('.steps').find('.active').data('index');
    $('.steps').find('.step').removeClass('active');
    $('.steps').find('.step[data-index="1"]').addClass('active');
    
    $('.selection_wrapper .sticky-top .back-btn').addClass('hide');
    
    $('.next-btn').removeClass('hide');
    $('.final-step').addClass('hide');
  });
  
  $('.next-btn, .skips-btn').on('click', function(){
    
    console.log(selection);
    
    var step = $('.selection_wrapper').find('.step.active');
    
    var selected = Object.values(selection);
   	var productHandle = selected[0]+'-in-'+selected[2];    
    
    productHandle = productHandle.replace(/\s+/g, '-').toLowerCase();
    
    selected.splice(0, 1);
    
    var currentActive = $('.steps').find('.step.active').data('index');
    
    
    var radioValue = $(step).find("input[type='radio']:checked").val();
    
    let currentStep = $(step).find("input").attr('name');
    
    //console.log(radioValue);
    
    if(radioValue == undefined && currentActive != 5){
      var t = $(step).find("input").attr('name');
      if(t == 'styles'){ alert('Please select style'); }
      if(t == 'sizes'){
        $('.'+t+'-error').html('<p>Please select size</p>'); 
      }
      if(t == 'colors'){
        $('.'+t+'-error').html('<p>Please select color</p>'); 
      }
      if(t == 'plans'){
        $('.'+t+'-error').html('<p>Please select plan</p>'); 
      }
      
      return false;
    }else{
      // remove active class from current, soon to be previous, screen
      step.removeClass('active');
    }
    
    console.log('::current screen init, fwd', currentActive);
    if(currentActive == 1){
      $('.sticky-top .prev-selection').text('');
      // and hide the back btn, the user is on pg 1
      //$('.back-btn').toggleClass('hide');
    }
    
    //console.log(currentActive);
    
    if(currentActive == 2){
      var t = getSize(selected[0]);            
      
      selected[0] = t;
      $('.back-btn .prev-selection').text(selected[0]);
      
      var selected = Object.values(selection);
      //console.log(selected);
      if(selected[0] == 'Custom Collection'){
        // add class to wrapper so you know the user is within this interface
        $('.ebyQuizApp').addClass('ebyCustomSelectionWrapper');
        
        var packTotal = $('input[name="pair"]:checked').data('pack');
        
        if(customCollectionProducts.length == packTotal){
        }else{
          $('.sticky-bottom .next-btn').addClass('hide');
        }
        
        var newIndex = currentActive+1;
        $('.steps').find('.step').removeClass('active');
        $('.img_section .steps').find('.step[data-index="'+newIndex+'"]').addClass('active'); 
        $('.steps').find('.step[data-index="'+newIndex+'"] .feature_img').addClass('hide');
        $('.steps').find('.step[data-index="'+newIndex+'"] .pick-style-outerwrapper').removeClass('hide');
        $('.steps').find('.step.quiz-pick-style').addClass('active');

        $('.pick-style-products-wrapper > div').each(function(k,v){
          locationProductIDs.push($(v).data('product-id'));
        });

        tomitProductInventoryInfo.getProductsInventoryInformation(locationProductIDs).then(function(e){
          productLocationDetails.push(e);
        });
        
        generateRadioClick($('.selection_wrapper .step[data-index="'+newIndex+'"]').find('input:checked'), selection);
      }else{
        var newIndex = currentActive+1;
        $('.ebyQuizApp').removeClass('ebyCustomSelectionWrapper');
        $('.steps').find('.step[data-index="'+newIndex+'"] .feature_img').removeClass('hide');
        $('.steps').find('.step[data-index="'+newIndex+'"] .pick-style-outerwrapper').addClass('hide');        
        
        $('.steps').find('.step').removeClass('active');
        $('.img_section .steps').find('.step[data-index="'+newIndex+'"]').addClass('active'); 
        $('.steps').find('.step[data-group="color"]').addClass('active');
        
        if(isEdit == true){
          generateRadioClick($('.selection_wrapper .step[data-index="'+currentActive+'"]').find('input:checked'), selection);
        }
        
      }
    }else{
      $('.ebyQuizApp').removeClass('ebyCustomSelectionWrapper');
      if(currentActive != 3){
        var newIndex = currentActive+1;
        $('.steps').find('.step').removeClass('active');
        $('.steps').find('.step[data-index="'+newIndex+'"]').addClass('active');
        if(isEdit == true){
          generateRadioClick($('.selection_wrapper .step[data-index="'+currentActive+'"]').find('input:checked'), selection);
        }
      }
    }
    
    if(currentActive == 3){
      var selected = Object.values(selection);
      if(selected[0] == 'Custom Collection'){
        var newIndex = currentActive+2;
        //console.log(newIndex);
        $('.steps').find('.step').removeClass('active');
        $('.steps').find('.step[data-index="'+newIndex+'"]').addClass('active');        
      }else{
        var selected1 = Object.values(selection);
        selected1.splice(0, 1);
        
        selected1[0] = getSize(selected1[0]);
        //selected1.pop();
        var newIndex = currentActive+1;
        $('.steps').find('.step').removeClass('active');
        $('.steps').find('.step[data-index="'+newIndex+'"]').addClass('active'); 
        
        if(isEdit == true){
          generateRadioClick($('.selection_wrapper .step[data-index="'+currentActive+'"]').find('input:checked'), selection);
        }
        
        $('.back-btn .prev-selection').text(selected1.join(', '));
        var handles = [];
        var plan = [
          'quarterly',
          'semi-annual'
        ];
        
        productHandle = productHandle.replace('only-', '');
        productHandle = productHandle.replace('-colors', '');

        handles[0] = 'eby-subscription-'+productHandle+'-'+plan[0];
        handles[1] = 'eby-subscription-'+productHandle+'-'+plan[1];

        $(handles).each(function(k,v){
          Shopify.getProduct(v,function(product) {
            products.push(product);
            $(product.variants).each(function(key, variant){
              var size = selected[1];
              if(variant.public_title == size.toLowerCase()){
                if(v.indexOf('quarterly') != -1){
                  $('#quarterly').find('input').attr('data-product', k);
                  //$('#quarterly').find('.price').text(Shopify.formatMoney(variant.price, window.money));

                  var salePrice = window.offerDataSalePrice;

                  if (!salePrice) {
                    salePrice = '45';
                  }

                  $('#quarterly').find('.price').html('<s>$54</s> <span>$' + salePrice + '</span>');
                }
                if(v.indexOf('semi-annual') != -1){
                  $('#semi-annual').find('input').attr('data-product', k);
                  //$('#semi-annual').find('.price').text(Shopify.formatMoney(variant.price, window.money));
                  $('#semi-annual').find('.price').html('<s>$90</s> <span>$65</span>');
                }
              }
            });
          });
        });
      }
    }
    
    if(currentActive == 4){
      var data = Object.values(selection);
      collectionProduct = [];
      if(data[0] != 'Custom Collection'){
        
        var selected1 = Object.values(selection);
        selected1.splice(0, 1);

        selected1[0] = getSize(selected1[0]);
        selected1[2] = selected1[2] == 'Every 3 Months' ? 'Quarterly' : 'Semi Annual';
        $('.back-btn .prev-selection').text(selected1.join(', '));
        
        var c = getCollectionHandle(data);
        
        var p = collections[c];
        locationProductIDs = [];
        if(p != undefined){
          var handles = p.split('|');
          var isAvailable = true;

          $(handles).each(function(k,v){
            if(v.indexOf('{') == -1){
              Shopify.getProduct(v,function(product) {
                //console.log(product);
                collectionProduct.push(product);
                locationProductIDs.push(product.id);
                //productIDs.push(product.id);
                var v = '';
              });
            }
          });
        }
      }
    }
    
    if(currentActive == 5){
      $('body').addClass('velaCartAdding');
      selectedProducts = [];
      var data = Object.values(selection);
      var mainSubscriptionVariant;
      if(isEdit == true){
        console.log(subscriptionID);
        $('.final-step .btnAddToCart').addClass('btnUpdate').text('Update');
      }
      
      if(data[0] == 'Custom Collection'){
        //console.log(selectedProducts);
        selectedProducts = [];
        var selectionHTML = '';
        var productIDs = [];
        $(data).each(function(k,v){
          var l,t ='';
          if(k == '0'){
            l = 'Membership'; t = v;
            selectionHTML += '<li><strong>'+l+'</strong><br/><span>'+t+'</span></li>';
          }
          if(k == '1'){
            l = 'Size'; t = v;
            selectionHTML += '<li><strong>'+l+'</strong><br/><span>'+t+'</span></li>';
          }                    
          
          if(k == '0'){
            var productsHTML = '';
            $(customCollectionProducts).each(function(key,value){
              productIDs.push(value.v_id);
              productsHTML += '<li>'+value.title+'</li>';
            });
            selectionHTML += '<li><strong>Selections</strong><br/><ul>'+productsHTML+'</ul></li>';
          }
        });
        
        selectedProducts = productIDs;
        
        var handles = ['welcome-booklet', 'monthly-insert'];
        $(handles).each(function(k,handle){
          //console.log(handle);
          Shopify.getProduct(handle,function(product) {
            tomitProductInventoryInfo.getProductsInventoryInformation([product.id]).then(function(e){
              setTimeout(function(){
                var locationIndex;
                if(e[product.id] != undefined){
                  var info = e[product.id].product.variants[product.variants[0].id].inventoryItem.locations;
                  //console.log(info);
                  $(info).each(function(index,location){
                    if(location.name == "Subscription WH"){
                      locationIndex = index;
                    }
                  });
                  if(info[locationIndex].name == "Subscription WH" && info[locationIndex].available > 0){
                    //console.log(product.variants[0].id);
                    selectedProducts.push(product.variants[0].id);
                  }
                }
              }, 800);
            });
          });
        });
        
        //selectedProducts = productIDs;
        //console.log(selectedProducts);
        //console.log(productIDs);
        var p = $('input[name="pair"]:checked').data('pack');
        var handle = '';
        if(p == '3'){
          selectionHTML += '<li><strong>Shipments</strong><br/><span>3 Panties every 3 months</span></li>';
          handle = 'eby-custom-subscription-quarterly';
        }else{
          selectionHTML += '<li><strong>Shipments</strong><br/><span>5 Panties every 6 months</span></li>';
          handle = 'eby-custom-subscription-semi-annual';
          $('#productInterval').val('6');
        }
        //console.log(productIDs);
        if(handle != ''){
          Shopify.getProduct(handle,function(product) {
            var isAvailable = false, variantID, variantPrice;
            $(product.variants).each(function(key, variant){
              if(variant.public_title == data[1].toLowerCase() && variant.available == true){
                isAvailable = true;
                variantPrice = variant.price/100;
                variantID = variant.id;
              }
            });

            if(isAvailable = true){
              $('.btnAddToCart').removeClass('hide');
              $('#productSelect').val(variantID);
              $('#productPrice').val(variantPrice);
              $('#summary-error').html('');
              $('.btnAddToCart').attr('disabled', false);
              isSubscriptionOOS = true;
            }else{
              $('#summary-error').html('<p>Subscription Product is out of stock.</p>');
              $('.btnAddToCart').attr('disabled', true);
              isSubscriptionOOS = false;
            }
            $('body').removeClass('velaCartAdding');
            $('.btnAddToCart').attr('disabled', false);
          });
        }else{
          $('#summary-error').html('<p>Subscription Product is out of stock.</p>');
          $('.btnAddToCart').attr('disabled', true);
          $('body').removeClass('velaCartAdding');
        }
        
        $('#summary-detail').html(selectionHTML);
        
        $('#subscription_ids').val(productIDs.join(','));
        //console.log(data);
        //console.log(selectedProducts);
      }else{
        var selectedProductDetail = [];
        //console.log(collectionProduct);
        
        generateResultPreview(data);
        selectedProducts = [];
        
        var selectedProductDetail = [];

        if(collectionProduct != []){

          var productLimit = data[3] == 'Every 3 Months' || data[2] == 'Every 3 Months' ? 3 : 5;
          if (productLimit === 3) {
          	$('#productInterval').val('3');
          } else {
          	$('#productInterval').val('6');
          }
          
          var c = 0;

          tomitProductInventoryInfo.getProductsInventoryInformation(locationProductIDs).then(function(e){
            collectionProductStock = e;
            setTimeout(function(){
              //console.log(collectionProductStock);
              $(collectionProduct).each(function(k, product){
                var locationIndex;
                if(product.variants.length > 1){
                  $(product.variants).each(function(key, variant){
                    var pt = product.title;
                    if(variant.public_title == data[1].toLowerCase()){
                      if(collectionProductStock[product.id] != undefined){
                        var info = collectionProductStock[product.id].product.variants[variant.id].inventoryItem.locations;
                        locationIndex = getLocationIndex(info);
                        if(info[locationIndex].name == "Subscription First Box WH" && info[locationIndex].available > 0){
                          if(pt.indexOf('Subscription') != -1){
                            if(variant.available == true){
                              isSubscriptionOOS = false;
                              mainSubscriptionVariant = variant.id;
                              $('#productSelect').val(variant.id);
                              $('#productPrice').val(variant.price/100);
                            }else{
                              isSubscriptionOOS = true;                                    
                            }
                          }else{
                            //console.log(c);
                            if(c < productLimit){
                              selectedProductDetail.push({
                                variantID : variant.id,
                                variant : variant.name,
                                stock : info[locationIndex].available,
                                available: variant.available,
                                sku : variant.sku
                              });
                              v = variant.id;
                              selectedProducts.push(variant.id);
                              c = c+1;
                            }
                          }
                        }
                      }
                    }
                  });
                }else{
                  var info = collectionProductStock[product.id].product.variants[product.variants[0].id].inventoryItem.locations;
                  locationIndex = getLocationIndex(info);
                  if(info[locationIndex].name == "Subscription First Box WH" && info[locationIndex].available > 0){
                    selectedProducts.push(product.variants[0].id);
                    selectedProductDetail.push({
                      variantID : product.variants[0].id,
                      variant : product.variants[0].name,
                      available: product.variants[0].available,
                      stock : info[locationIndex].available,
                      sku : product.variants[0].sku
                    });
                  }
                }
              });
              //console.log(isSubscriptionOOS);
              //console.log(c);
              if(isSubscriptionOOS == false && c == productLimit){
                $('#summary-error').html('');
                $('.btnAddToCart').attr('disabled', false);
                $('body').removeClass('velaCartAdding');
              }else{
                $('#summary-error').html('<p>Subscription Product is out of stock.</p>');
                $('.btnAddToCart').attr('disabled', true);
                $('body').removeClass('velaCartAdding');
              }
            }, 1000);
          });
        }
      }
      $('.final-step').removeClass('hide');
      $('.next-btn').addClass('hide');

    }else{
      var data = Object.values(selection);
      if(data[0] == 'Custom Collection'){
      }else{
        $('.next-btn').removeClass('hide');
        $('.final-step').addClass('hide');
      }
    }
    
    if(currentStep == 'styles'){ 
      	/* facebook tracking - s&d box */
      	if (!isEdit) {
          if (typeof fbq !== "undefined") {
            fbq('trackCustom', 'Build Your Box - Styles Chosen', {
              'selection' : radioValue.replace(/\s/g, '-')
            });
          }
      	}
      	
      	// AT chosen
      	if (radioValue == "All Thongs") {
      		// hide 3X, 4X
          	$('.step.quiz-size input[value="3X"], .step.quiz-size input[value="4X"]').parent().addClass('hide');
        } else {
        	$('.step.quiz-size input[value="3X"], .step.quiz-size input[value="4X"]').parent().removeClass('hide');
        }
      
    } else if (currentStep == 'sizes'){
      	/* facebook tracking - s&d box */
      	if (!isEdit) {
          fbq('trackCustom', 'Build Your Box - Size Chosen', {
            'selection' : selected[currentActive - 1]
          });
      	}  
      
      
      	// XS, 1X, 2X, 3X, 4X chosen
      	if (selected[currentActive - 1] == "XS" || 
            selected[currentActive - 1] == "1X" ||
            selected[currentActive - 1] == "2X" ||
            selected[currentActive - 1] == "3X" ||
            selected[currentActive - 1] == "4X") {
      		// hide NU
          	$('.step.quiz-color input[value="Only Neutrals"]').parent().addClass('hide');
        } else {
        	$('.step.quiz-color input[value="Only Neutrals"]').parent().removeClass('hide');
        }
    } else if(currentStep == 'colors'){
      	/* facebook tracking - s&d box */
      	if (!isEdit) { 
          fbq('trackCustom', 'Build Your Box - Colors Chosen', {
            'selection' : selected[currentActive - 1].replace(/\s/g, '-')
          });
      	}
      
      	// Im 1X-$x or XS chosen
      	if (selected[currentActive - 1] == "Only Neutrals") {
      		// hide NU
          	$('.step.quiz-plan input[value="Every 6 Months"]').parent().addClass('hide');
        } else {
        	$('.step.quiz-plan input[value="Every 6 Months"]').parent().removeClass('hide');
        }
      
        if (selected[1] == "XS" || 
            selected[1] == "1X" ||
            selected[1] == "2X" ||
            selected[1] == "3X" ||
            selected[1] == "4X") {
			$('.step.quiz-plan input[value="Every 6 Months"]').parent().addClass('hide');
        } else {
            if (selected[currentActive - 1] != "Only Neutrals") {
              $('.step.quiz-plan input[value="Every 6 Months"]').parent().removeClass('hide');
            }
        }
      
    } else if(currentStep == 'plans'){
      	/* facebook tracking - s&d box */
      	if (!isEdit) {
          fbq('trackCustom', 'Build Your Box - Plan Chosen', {
            'selection' : selected[currentActive - 2].replace(/\s/g, '-')
          });
      	}

    }
    
    $('.selection_wrapper .next-btn').attr('disable', true);
    $('.selection_wrapper .sticky-top .back-btn').removeClass('hide');
    
    // on mobile only, scroll up
    if (window.innerWidth < 770) {
    	document.querySelector('.ebyQuizPanelWrapper').scrollTo(0, 0);
    }
    
  });
  
  $('.load-more-btn').on('click', function(){
    $(this).parents('.selection-list').find('li').removeClass('hide');
    $(this).hide();
  });
  
  /* ================================================== Quiz page functionality JS ================================================== */
    
  /* ================================================== Custom Box Style JS ================================================== */
  
  $('a.style-selection').on('click', function(){
    $('body').addClass('velaCartAdding');
    var data = Object.values(selection);

    var packTotal = $('input[name="pair"]:checked').data('pack');
    var id= $(this).attr('data-href');
    $('.pick-style-products-wrapper').removeClass('hide');
    $('.pick-styles').addClass('hide');
    $(id).addClass('active');
    
    var handle = $(id).find('.product-handle').text();
    Shopify.getProduct(handle,function(product) {
      var variants = product.variants;
        $.get('https://inventorylocations.checkmyapp.net/inventory/products/eby-by-sofia-vergara.myshopify.com/['+product.id+']', function (result, textStatus, jqXHR) {
          if(textStatus == 'success'){
            $(product.variants).each(function(key, variant){
              var pt = product.title;
              //console.log(data);
              //if(variant.public_title == data[1].toLowerCase() && variant.available == true){
              if(variant.public_title == data[1].toLowerCase()){
                if(result[product.id] != undefined && result[product.id].product != undefined){
                  var info = result[product.id].product.variants[variant.id].inventoryItem.locations;
                  //console.log(info);
                  if(info[2] != undefined && info[2].name == "Subscription WH" && info[2].available > 0){
                    $(id).find('.custom-add-box-btn').text('Add To Box').attr('disabled', false);
                  }else{
                    $(id).find('.custom-add-box-btn').text('Out of Stock').attr('disabled', true);
                  }
                }else{
                  $(id).find('.custom-add-box-btn').text('Add To Box').attr('disabled', false);
                }            
              }
            });  
          }
        });
      
      $('body').removeClass('velaCartAdding');
    });
  });
  
  $('.custom-add-box-btn').on('click', function(){
    $('body').addClass('velaCartAdding');
    if($('.product-selection-wrapper .selected').hasClass('reserved') || $('.product-selection-wrapper .selected').hasClass('removed')){	
      var grp = $(this).parent('.single-style').data('group');
      //console.log(grp);
      var handle = $(this).parents('.single-style').find('.product-handle').text();
      
      var product, location = [];
      var data = Object.values(selection);
      //console.log(data);
      Shopify.getProduct(handle,function(p) {
        product = p;
      
        //console.log(product);
        //console.log(productLocationDetails);
        var select = [];
        var variants = product.variants;
        
          $(product.variants).each(function(key, variant){
            var pt = product.title;
            //if(variant.public_title == data[1].toLowerCase() && variant.available == true){
            if(variant.public_title == data[1].toLowerCase()){
              select = {
                id: product.id,
                available: variant.available,
                v_id: variant.id,
                title: product.title,
                sku: variant.sku,
                img: 'https://cdn.shopify.com/s/files/1/0313/4062/5964/files/'+product.handle+'.jpg'
              };
            }
          });
        
        //selectedProducts.push(select);

        var html = '<div class="product-line-item"><span class="product_image"><img src="'+select.img+'"></span><span class="product_detail"><h3>'+select.title+'</h3><p><a href="javascript:void(0);" class="edit-product-btn">Edit</a></p></span></div>';
        //<a href="javascript:void(0);" class="remove-product-btn">Remove</a>
        $('.product-selection-wrapper > li').each(function(k,v){
          if($(v).hasClass('selected')){
            customCollectionProducts[k] = select;
            $(v).attr('data-group', grp);
            $(v).attr('data-product', product.handle)
            $(v).removeClass('selected removed').addClass('reserved').html(html);
          }else if(!$(v).hasClass('reserved')){
            $(v).addClass('selected');
            return false;
          }
        });
        //console.log(selectedProducts);
        $('body').removeClass('velaCartAdding');        
      });
    }else{
      var grp = $(this).parent('.single-style').data('group');
      //console.log(grp);
      var packTotal = $('input[name="pair"]:checked').data('pack');
      
      //console.log(customCollectionProducts);
      //console.log(customCollectionProducts.length);
      //console.log(packTotal);
      
      if(customCollectionProducts.length == packTotal){
        $('.custom-plan-error').html('<p>You completed the product selection.</p>');
        $('body').removeClass('velaCartAdding');
      }else{
        var handle = $(this).parents('.single-style').find('.product-handle').text();
        //console.log(handle);
        var product, location = [];
        var data = Object.values(selection);
        //console.log(data);
        Shopify.getProduct(handle,function(p) {
          product = p;
        
          //console.log(product);
          //console.log(productLocationDetails);        
          var select = [];
          $(product.variants).each(function(key, variant){
            var pt = product.title;
            //if(variant.public_title == data[1].toLowerCase() && variant.available == true){
            if(variant.public_title == data[1].toLowerCase()){
              select = {
                id: product.id,
                available: variant.available,
                v_id: variant.id,
                title: product.title,
                sku: variant.sku,
                img: 'https://cdn.shopify.com/s/files/1/0313/4062/5964/files/'+product.handle+'.jpg'
              };
            }
          });
          customCollectionProducts.push(select);
          //<a href="javascript:void(0);" class="remove-product-btn">Remove</a>
          var html = '<div class="product-line-item"><span class="product_image"><img src="'+select.img+'"></span><span class="product_detail"><h3>'+select.title+'</h3><p><a href="javascript:void(0);" class="edit-product-btn">Edit</a></p></span></div>';

          $('.product-selection-wrapper > li').each(function(k,v){
            if($(v).hasClass('reserved')){
            }else{
              $(v).attr('data-group', grp);
              $(v).attr('data-product', product.handle);
              $(v).removeClass('selected').addClass('reserved').html(html);
              var o = k+1;
              //console.log(o);
              //console.log(packTotal);
              if(o == packTotal){
                $('.sticky-bottom .next-btn').removeClass('hide');
              }
              if($('.product-selection-wrapper > li:eq('+o+')').hasClass('active')){
              }else{
                $('.product-selection-wrapper > li:eq('+o+')').addClass('selected');
              }
              return false;
            }
          });
          //console.log(customCollectionProducts);
          $('body').removeClass('velaCartAdding');
          
          //console.log(customCollectionProducts.length);
          //console.log(packTotal);
          if(customCollectionProducts.length == packTotal){
            $('.custom-plan-error').html('<p>Your personal box is all set now!</p>');
            $('body').removeClass('velaCartAdding');
          }
        });
      }
    }
  });
  
  $(document).on('click', '.remove-product-btn', function(){
    var grp = $(this).parents('li').data('group');
    $('.product-selection-wrapper li').removeClass('selected');
    $(this).parents('li').addClass('selected removed');
    $(this).parents('li').removeClass('reserved');
    $(this).parents('li').attr('data-group', '');
    $(this).parents('li').html('');
    $('.pick-style-products-wrapper .single-style').removeClass('active');
    $('.pick-styles').removeClass('hide');
    //$(this).removeClass('edit-product-btn').addClass('cancel-product-btn').text('Cancel');
    //console.log(grp);
  });
  
  $(document).on('click', '.edit-product-btn', function(){
    var grp = $(this).parents('li').data('group');
    //console.log(grp);
    $('.pick-styles').addClass('hide');
    $('.pick-style-products-wrapper').removeClass('hide');
    $('.pick-style-products-wrapper .single-style').removeClass('active');
    $('.pick-style-products-wrapper .single-style[data-group="'+grp+'"]').addClass('active');
    
    $('.product-selection-wrapper li').removeClass('selected');
    $(this).removeClass('edit-product-btn').addClass('cancel-product-btn').text('Cancel');
    $(this).parents('li').addClass('selected');
  });
  
  $(document).on('click', '.swatch-view-item .swatch-group-selector', function(){
    $('body').addClass('velaCartAdding');
    var data = Object.values(selection);
    var url = $(this).attr('swatch-url');
    var handle = url.split("/").pop();
    //console.log(handle);
    $(this).parents('.single-style').find('.product-handle').text(handle);
    var id = $('.pick-style-products-wrapper .single-style.active').attr('id')
    //console.log(id);
    setTimeout(function(){
      Shopify.getProduct(handle,function(product) {
        //console.log($(this));
        //console.log(id);

        console.log('::getSelection return::', {
          prodTags: product.tags,
          name: product.title
        });
        
        var pantyColor = null;
        
        pantyColor = product.tags.filter(function (tag, index) {
          if (tag.indexOf('pantyColor-') >= 0) {
          	return tag;
          }
        }).join(', ');
        
        if (pantyColor === null) {
          console.log('::selection for swatch bg::', pantyColor);
          pantyColor = 'unavailable';
        } else {
          // if this product has 2+ colors tagged on it, take the 1st
          pantyColor = pantyColor.replace('pantyColor-', '');
        }
        
        $('#'+id).find('.proName').text(product.title);
        $('#'+id).find('.img-responsive').attr('src', 'https://cdn.shopify.com/s/files/1/0313/4062/5964/files/'+pantyColor+'-cb.jpg').load(function(){
          //$('body').removeClass('velaCartAdding');
        });
        $('#'+id).find('.product-handle').text(product.handle);
        
        tomitProductInventoryInfo.getProductsInventoryInformation([product.id]).then(function(e){
          $(product.variants).each(function(key, variant){
            if(variant.public_title == data[1].toLowerCase()){
              if(e[product.id] != undefined && e[product.id].product != undefined){
                var info = e[product.id].product.variants[variant.id].inventoryItem.locations;
                console.log(info);
                if(info[2] != undefined && info[2].name == "Subscription WH" && info[2].available > 0){
                  $('body').removeClass('velaCartAdding');
                  $('#'+id).find('.custom-add-box-btn').text('Add To Box').attr('disabled', false);
                }else{
                  $('body').removeClass('velaCartAdding');
                  $('#'+id).find('.custom-add-box-btn').text('Out of Stock').attr('disabled', true);
                }
              }else{
                $('body').removeClass('velaCartAdding');
                $('#'+id).find('.custom-add-box-btn').text('Add To Box').attr('disabled', false);
              }              
            }
          });
        });        
      });
    }, 100);
  });
  
  $(document).on('click', '.cancel-product-btn', function(){
    $('.product-selection-wrapper li').removeClass('selected');
    //$(this).parents('li').addClass('selected');
    
    $('.product-selection-wrapper > li').each(function(k,v){
      //console.log(k);
      $(this).find('a').addClass('edit-product-btn').removeClass('cancel-product-btn').text('Edit');
      if($(v).hasClass('reserved')){
      }else{
        //console.log(k);
        //var o = k+1;
        $('.product-selection-wrapper > li:eq('+k+')').addClass('selected');
        return false;
      }
    });
  });
  
  $('.back-to-style-btn').on('click', function(){
    $('.pick-style-products-wrapper').addClass('hide');
    $('.pick-styles').removeClass('hide');
    $('.pick-style-products-wrapper .single-style').removeClass('active');
  });
  
  /* ================================================== Custom Box Style JS ================================================== */
  
  /* ================================================== Final Add to cart JS ================================================== */
  
  $('.btnAddToCart').on('click', function(){
    $('body').addClass('velaCartAdding');
    
    var detail = Object.values(selection);
    
    var data = [];
    
    var sOption = detail[0] == 'Custom Collection' ? "Subscription WH" : "Subscription First Box WH";
    
    $(selectedProducts).each(function(k,v){
      data.push({ "id": v, "quantity": '1', "properties" :{'Shipping Option' : sOption, 'product_type' : 'Sub Subscription'} });
    });
    
    data.push({
      "id": $('#productSelect').val(),
      "quantity": '1',
      "properties" :{
        'Shipping Option' : sOption,
        'shipping_interval_unit_type' : $('#productUnitType').val(),
        'shipping_interval_frequency' : $('#productInterval').val(),
        'subscription_ids' : selectedProducts.join(','),
        'product_type' : 'Main Subscription',
      }
    });
    
    if($(this).hasClass('btnUpdate')){
      
      if($('#productSelect').val() == subscriptionDetails.shopify_variant_id && detail[0] != 'Custom Collection'){
        $('#summary-error').html('<p>Please update the subscription or <a href="/account" ><u>Go to Dashboard</u></a></p>');
        $('.btnAddToCart').attr('disabled', true);
        $('body').removeClass('velaCartAdding');
      }else{
        var data = {
          data:{
            'type':"update",
            'product_style':detail[0],
            'id': subscriptionDetails.id,
            'address_id': subscriptionDetails.address_id,
            'custom_products':customCollectionProducts,
            'new_variant_id':$('#productSelect').val(),
            'price':$('#productPrice').val(),
            'next_charge_scheduled_at':subscriptionDetails.next_charge_scheduled_at,
            'frequency': $('#productInterval').val(),
            'subscription_ids': selectedProducts.join(','),
            'customer_id': window.customer_id
          }
        };
        console.log(data);
        $.ajax({
          type: "POST",
          crossDomain : true,
          url: "https://secureddatasystem.com/ShopifyApps/eby/subscription.php",
          data: data,
          dataType: 'json',
          success: function(response){
            /*console.log(response);
            console.log(response.subscription.shopify_variant_id);
            console.log(data.data.new_variant_id);*/
            if(response.subscription.shopify_variant_id == data.data.new_variant_id){
              $.cookie("subscription_status", "true", { expires: 10 });
              $('body').removeClass('velaCartAdding');
              setTimeout(function(){
                //console.log($.cookie("subscription_status"));
                window.location.href= "/account";
              }, 2000);
            }
          },
          error: function(xhr, text) {
            $('body').removeClass('velaCartAdding');
            console.log(text);
            console.log(xhr);
            window.location.href= "/account";
          }
        });
      }
    }else{
      jQuery.ajax({
        type: 'POST',
        url: '/cart/add.js',
        data: {"items" : data },
        async:false,
        dataType: 'json',
        beforeSend: function() {
          
        },
        success: function(cart) {
          jQuery.getJSON('/cart.js', function (cart, textStatus) {
            
            var membershipProfile = Object.values(selection);
            if (membershipProfile[0] === "Custom Collection") {
              /* facebook tracking - custom box */
              fbq('trackCustom', 'Build Your Box - Complete', {
                'selection' : 'CB Membership',
                'boxProfile' : $('#subscription_ids').val()
              });
            } else {
              /* facebook tracking - surprise and delight */
              var profileTag = selection.style.replace(/\s/g, '-') + '_' + selection.color.replace(/\s/g, '-') + '_' + selection.size.replace(/\s/g, '-') + '_' + selection.plan.replace(/\s/g, '-');
              fbq('trackCustom', 'Build Your Box - Complete', {
                'selection' : 'S&D Membership',
                'boxProfile' : profileTag
              });
            }
            
            redirectToRechargeCheckout(cart);
          });
        }
      });
    }
  });
  
  /* ================================================== Final Add to cart JS ================================================== */
  
  /**
   * Select Style
   */
  selectStyle = function() { 
    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    var selectedStyle = urlParams.get("style");

    if (selectedStyle) {
      if (typeof $('input[name="styles"][value="' + selectedStyle + '"]')) {
        selection.style = selectedStyle;
        $('input[name="styles"][value="' + selectedStyle + '"]').prop("checked", true);
        generateRadioClick($('input[name="styles"][value="' + selectedStyle + '"]'), selectedStyle);
        $('.selection_wrapper .sticky-top .back-btn').removeClass('hide');
        $('.next-btn').trigger("click");
      }
    }
  }

  /**
   * Remove Subscription Products from Cart
   */
  prepareCart = function(cart) {
    if (!cart) {
      return;
    }

    var subscriptionProductTypes = ['main subscription', 'sub subscription'];

    var items = cart.items;

    if (typeof items !== "undefined" || items.length > 0) {
      items.map((item) => {
        var properties = item.properties;

        if (typeof properties === "undefined" 
        || properties.length === 0) {
          return;
        }

        var productType = properties['product_type'];

        if (typeof productType === "undefined") {
          return;
        }

        productType = productType.toLowerCase();

        if (subscriptionProductTypes.includes(productType) !== true) {
          return;
        }

        $.ajax({
          type: "POST",
          url: '/cart/change.js',
          async: false,
          data: {
            'id': item.key,
            'quantity': 0
          },
          dataType: 'json',
          success: function() {
            return;
          },
          dataType: 'json'
        });
      });
    }
  }

  /**
   * Init Cart and Quiz styles
   */
  initCart = function() {
    if (typeof Shopify === "undefined") {
      return;
    }

    Shopify.getCart(prepareCart);
  }

  /**
   * Set offer
   */
  setOffer = function() {
    var subscriptionOffer = $('.subscription-offer');

    var hasOffer = subscriptionOffer.data("enabled");
    var salePrice = subscriptionOffer.data("price");
    var coupon = subscriptionOffer.data("coupon");

    if (typeof hasOffer === "undefined" 
    || typeof salePrice === "undefined" 
    || typeof coupon === "undefined") {
      return;
    }
    
    if (hasOffer !== true) {
      return;
    }

    if (!isEdit) {
      window.offerDataSalePrice = salePrice;
      window.offerDataCoupon = coupon;
    }

    $('#semi-annual').hide();    
  }
  
  initCart();
  selectStyle();
  //setOffer(isEdit);
};

$(function() {
  $(quiz.init);
});