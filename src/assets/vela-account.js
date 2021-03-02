window.account = window.account || {};

account.init = function () {
  account.customer();
};

account.customerAddress = [];

account.customer = function () {
  var customer = getCustomer();
  var $payment = $('.accountPayment');
  var $accountDetails = $('.accountInfo');
  var $billingAddress = $('.accountBillingAddress');
  var $shippingAddress = $('.accountShippingAddress');
  var $subscriptionBox = $('.accountSubscriptionBox .subscriptionBoxContent');

  //var stripe = Stripe('pk_test_qztSYeedXOL4lfHuJr3VfZZp');
  var stripe = Stripe('pk_live_R7aDpBgftpyrmVZyLOkTId7k');
  var elements = stripe.elements();
  var cardElement = elements.create('card');
  var cardElement = elements.getElement('card');
  var displayError = document.getElementById('card-errors');

  cardElement.mount('#card-element');
  cardElement.on('change', function(event) {
    if (event.error) {
      //displayError.textContent = event.error.message;
    } else {
      displayError.textContent = '';
      stripe.createToken(cardElement).then(function(result) {
        if(result.error != undefined){
          displayError.textContent = result.error.message;
          $('.paymentUpdateBtn').attr('disabled', true);
        }
        //console.log(result);
        if(result.token != undefined){
          //console.log(result);
          //console.log(result.token);
          //console.log(result.token.id);
          displayError.textContent = '';
          $('#payment_token').val(result.token.id);
          $('.paymentUpdateBtn').attr('disabled', false);
        }
      });
    }
  });
  
  //setDetails(customer);
  function generateBillingDetails(customer, address_id){
    //console.log(customer);
    var billingAddress = '<li>'+customer.billing_address1+' '+customer.billing_address2+'</li>';
    billingAddress += '<li>'+customer.billing_city+' '+customer.billing_province+' '+customer.billing_zip+'</li>';
    billingAddress += '<li>'+customer.billing_country+'</li>';
    billingAddress += '<li>'+customer.billing_phone+'</li>';
    $billingAddress.find('.accountContent').html('<ul class="addressInfo list-unstyled">'+billingAddress+'</ul>');
    $billingAddress.removeClass('hide');
    
    var $billingPopup = $('#billingAddressPopup');
    
    var billingForm = '';
    billingForm += "<div class='form-input'><label for='first_name'>First Name</label><input id='first_name' name='first_name' value='"+customer.first_name+"'></div>";
    billingForm += "<div class='form-input'><label for='last_name'>Last Name</label><input id='last_name' name='last_name' value='"+customer.last_name+"'></div>";
    billingForm += "<div class='form-input'><label for='billing_address1'>Address</label><input id='billing_address1' name='billing_address1' value='"+customer.billing_address1+"'></div>";
    billingForm += "<div class='form-input'><label for='billing_address2'>Apt, suite, etc. (optional)</label><input id='billing_address2' name='billing_address2' value='"+customer.billing_address2+"'></div>";
    billingForm += "<div class='form-input'><label for='billing_city'>City</label><input id='billing_city' name='billing_city' value='"+customer.billing_city+"'></div>";
    billingForm += "<div class='form-input'><label for='billing_zip'>Zip</label><input id='billing_zip' name='billing_zip' value='"+customer.billing_zip+"'></div>";
    billingForm += "<div class='form-input'><label for='billing_province'>State</label><input id='billing_province' name='billing_province' value='"+customer.billing_province+"'></div>";
    billingForm += "<div class='form-input'><label for='billing_country'>Country</label><input id='billing_country' name='billing_country' value='"+customer.billing_country+"'></div>";
    billingForm += "<div class='form-input'><label for='billing_phone'>Phone</label><input id='billing_phone' name='billing_phone' value='"+customer.billing_phone+"'></div>";
    billingForm += "<div class='form-input'><input type='checkbox' id='for_shipping' name='is_shipping' value='true' ><label for='for_shipping'>Save for Shipping too?</label></div>";
    if (!!address_id) {
    billingForm += "<input type='hidden' name='customer_id' value='"+customer.id+"'><input type='hidden' name='address_id' id='address_id' value='"+address_id+"'><input type='hidden' name='type' class='type' value='billing_address'>";
    } else {
    billingForm += "<input type='hidden' name='customer_id' value='"+customer.id+"'><input type='hidden' name='type' class='type' value='billing_address'>";
    }
    $billingPopup.html('<h3>Billing Address Details</h3><form class="recharge_forms">'+billingForm+'<button type="submit" class="btn">Update</button></form>');
  }
  
  function generateAccountDetails(customer){
    var accountDetails = '<li>'+customer.first_name+' '+customer.last_name+'</li>';
    accountDetails += '<li>'+customer.email+'</li>';
    $accountDetails.find('.accountContent').html('<ul class="addressInfo list-unstyled">'+accountDetails+'</ul>');
    
    $('.accTitleLeft .customerName').text(customer.first_name+' '+customer.last_name);
    
    var $accountPopup = $('#accountPopup');
    var accountForm = "";
    accountForm += "<div class='form-input'><label for='first_name'>First Name</label><input id='first_name' name='first_name' value='"+customer.first_name+"'></div>";
    accountForm += "<div class='form-input'><label for='last_name'>Last Name</label><input id='last_name' name='last_name' value='"+customer.last_name+"'></div>";
    accountForm += "<div class='form-input'><label for='email'>Email</label><input id='email' name='email' value='"+customer.email+"'></div>";
    accountForm += "<input type='hidden' name='customer_id' value='"+customer.id+"'><input type='hidden' name='type' class='type' value='billing_address'>";
    $accountPopup.html('<h3>My Info</h3><form class="recharge_forms" autocomplete="off">'+accountForm+'<button type="submit" class="btn">Update</button></form>');
    
    $('.rechargeCustomerDetail').html("<input type='hidden' name='customer_id' value='"+customer.id+"'>");
  }
  
  function generateShippingDetails(address){
    //console.log(address);
    var shippingAddress = '<li>'+address.address1+' '+address.address2+'</li>';
    shippingAddress += '<li>'+address.city+' '+address.province+' '+address.zip+'</li>';
    shippingAddress += '<li>'+address.country+'</li>';
    shippingAddress += '<li>'+address.phone+'</li>';
    $shippingAddress.find('.accountContent').html('<ul class="addressInfo list-unstyled">'+shippingAddress+'</ul>');
    $shippingAddress.removeClass('hide');
    
    var $shippingPopup = $('#shippingAddressPopup');
    
    var shippingForm = '';
    shippingForm += "<div class='form-input'><label for='first_name'>First Name</label><input required id='first_name' name='first_name' value='"+address.first_name+"'></div>";
    shippingForm += "<div class='form-input'><label for='last_name'>Last Name</label><input required id='last_name' name='last_name' value='"+address.last_name+"'></div>";
    shippingForm += "<div class='form-input'><label for='address1'>Address 1</label><input required id='address1' name='address1' value='"+address.address1+"'></div>";
    shippingForm += "<div class='form-input'><label for='address2'>Address 2</label><input id='address2' name='address2' value='"+address.address2+"'></div>";
    shippingForm += "<div class='form-input'><label for='city'>City</label><input required id='city' name='city' value='"+address.city+"'></div>";
    shippingForm += "<div class='form-input'><label for='zip'>Zip</label><input required id='zip' name='zip' value='"+address.zip+"'></div>";
    shippingForm += "<div class='form-input'><label for='province'>State/province</label><input required id='province' name='province' value='"+address.province+"'></div>";    
    shippingForm += "<div class='form-input'><label for='country'>Country</label><input required id='country' name='country' value='"+address.country+"'></div>";
    shippingForm += "<div class='form-input'><label for='phone'>Phone</label><input required id='phone' name='phone' value='"+address.phone+"'></div>";
    shippingForm += "<div class='form-input ebyCheckboxFieldRow'><input type='checkbox' id='for_billing' name='is_billing' value='true' ><label for='for_billing'>Save for Billing too?</label></div>";
    if (!!address.id) {
        shippingForm += "<input type='hidden' name='customer_id' value='"+address.customer_id+"'><input type='hidden' name='address_id' value='"+address.id+"'><input type='hidden' name='type' class='type' value='shipping_address'>";
    } else {
    	shippingForm += "<input type='hidden' name='customer_id' value='"+address.customer_id+"'><input type='hidden' name='type' class='type' value='shipping_address'>";
    }
    $shippingPopup.html('<h3>Shipping Address Details</h3><form class="recharge_forms"><div class="error hvr-buzz-out"></div>'+shippingForm+'<button type="submit" class="btn">Update</button></form>');        
  }

  /**
  *
  * determine the box type, date range, current date.
  * @customer(obj) => assumed to have subscription property
  * 
  **/
  function validateBlackoutPeriod (customer) {

  	var blackoutStatus = false;

    var getSubType = function(subscription) {
      	if (!!customer.subscription.sku) {
      		return customer.subscription.sku.slice(0, 2) === 'CB' ? 'cb' : 's&d';
        } else {
          return customer.subscription.product_title.indexOf('Custom') >= 0 ? 'cb' : 's&d';
        }
    };
    
  	var subType = getSubType(customer.subscription),
    	currDate = new Date(),
  		currMon = currDate.getMonth() + 1,
  		currDay = currDate.getDate();

  	var renewalDate = new Date(customer.next_charge.scheduled_at),
  		renewalMon = renewalDate.getMonth() + 1,
  		renewalDay = renewalDate.getDate();

  	var sdBlackoutDay = renewalDay - 4,
      	cbBlackoutDay = 6;
    

  	if (subType === 'cb') {
  		if (currMon === renewalMon && currDate.getFullYear() === renewalDate.getFullYear()) {
	  		// renewal month

	  		if (currDay < cbBlackoutDay) {
	  			blackoutStatus = false;

	  		} else {
	  			// blackout active
	  			blackoutStatus = true;
	  		}

  		} else {
  			// not renewing this month and/or year
  			blackoutStatus = false;
  		}

  	} else {
  		if (currMon === renewalMon && currDate.getFullYear() === renewalDate.getFullYear()) {
	  		// renewal month

	  		if (currDay < sdBlackoutDay) {
	  			blackoutStatus = false;

	  		} else {
	  			// blackout active
	  			blackoutStatus = true;
	  		}

  		} else {
  			// not renewing this month and/or year
  			blackoutStatus = false;
  		}

  	}

  	return blackoutStatus;

  }

  /**
  *
  * determine the box type and if custom box selection is possible.
  * @customer(obj) => assumed to have subscription property
  * @return(obj)
  **/
  function isSelectionOpen (customer) {

  	var selectionStatus = false;

  	var currDate = new Date(),
  		currMon = currDate.getMonth() + 1,
  		currDay = currDate.getDate();
    
    var getSubType = function(subscription) {
      	if (!!customer.subscription.sku) {
      		return customer.subscription.sku.slice(0, 2) === 'CB' ? 'cb' : 's&d';
        } else {
          return customer.subscription.product_title.indexOf('Custom') >= 0 ? 'cb' : 's&d';
        }
    };

  	var subType = getSubType(customer.subscription),
  		renewalDate = new Date(customer.next_charge.scheduled_at),
  		renewalMon = renewalDate.getMonth() + 1,
  		renewalDay = renewalDate.getDate();
    

  	if (subType === 'cb') {
  		if (currMon === renewalMon && currDate.getFullYear() === renewalDate.getFullYear()) {
	  		// renewal month
			selectionStatus = true;
          
  		} else {
  			// not renewing this month and/or year
  			selectionStatus = false;
  		}

  	} else {
  		selectionStatus = false;
  	}

    return {
      isCustom: subType === 'cb',
      isOpen: selectionStatus
    };

  }
  
  function setDetails(customer){
        //console.log(customer);
    //rechargeAccountDetail
    //console.log(customer.customer.stripe_customer_token);
    
    var subscriptionHtml = '',
    	subscriptionProduct, subscriptionVariant, subscriptionProducts = customer.products, customProductsList = [],
    	subscriptionDetail = customer.subscription,
    	nextChargeDetail = "",
        hasSubscription = false,
        isBlackoutActive = false;
    
    if (!!subscriptionDetail){
      	hasSubscription = true;
    	var nextChargeDetail = customer.subscription.next_charge_scheduled_at;
    	/* eby - blackout */
    	isBlackoutActive = validateBlackoutPeriod(customer);
    }
    
    if (!!hasSubscription) {
		$(subscriptionProducts).each(function(k,v){
          if(v.id == subscriptionDetail.shopify_product_id){
            subscriptionProduct = v;

            $(v.variants).each(function(key,val){
              if(val.id == subscriptionDetail.shopify_variant_id){
                subscriptionVariant = val;
              }
            });
          }else{
            //console.log(v);
            if(v.product_type == "Core Underwear"){
              customProductsList.push(v);
            }
          }
        });
    }

    var paymenrDetailsArr = customer.payment;
    if (!!paymenrDetailsArr.card_brand) {
        var paymentDetail = '<li>'+paymenrDetailsArr.card_brand+' •••• '+paymenrDetailsArr.card_last4+'</li>';
        paymentDetail += '<li>'+paymenrDetailsArr.cardholder_name+'</li>';
        paymentDetail += '<li>Expires '+ ("0" + paymenrDetailsArr.card_exp_month).slice(-2)+'/'+ paymenrDetailsArr.card_exp_year +'</li>';
        $payment.find('.accountContent').html('<ul class="addressInfo list-unstyled">'+paymentDetail+'</ul>');
    } else {
        var paymentDetail = '<li>Invalid Card</li>';
        paymentDetail += '<li>Please provide a valid card.</li>';
        paymentDetail += '<li>Next Box On Hold</li>';
        $payment.find('.accountContent').html('<ul class="addressInfo list-unstyled">'+paymentDetail+'</ul>');

        // if there is a card issue, it must be fixed first
        isBlackoutActive = true;
    }

    $payment.removeClass('hide');
    
    //console.log(subscriptionProduct);
    //console.log(customProductsList);
    
    if(subscriptionProduct != undefined){
      //$.cookie("subscription_status", "true", { expires: 1 });
      var selection = [];
      var title = subscriptionProduct.title;
      
      if(title.includes("Thongs")){var box = "All Thongs Box";}
      if(title.includes("Briefs")){var box = "All Briefs Box";}
      if(title.includes("Highwaisted")){var box = "All Highwaisted Box";}
      if(title.includes("Full Coverage")){var box = "Full Coverage Box";}
      if(title.includes("Mixed Styles")){var box = "Mixed Styles Box";}
      if(title.includes("Custom")){var box = "Custom Box";}
      if(box == "Custom Box"){
        selection.push('style=Custom Collection');
      }else{
        selection.push('style='+box.replace(' Box', ''));
      }
      
      var t, size = subscriptionDetail.variant_title;
      switch (size.toUpperCase()) {
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
      selection.push('size='+size.toUpperCase());
      
      if(title.includes("in Mixed")){var color = "Mixed Colors";}
      if(title.includes("in Neutrals")){var color = "Only Neutrals";}
      if(color != undefined){
        selection.push('color='+color);
      }
      
      if(title.includes("Quarterly")){
        var plan = "<u>3 Pair</u> Delivered <u>Every 3 Months</u>";
        selection.push('plan=Every 3 Months');
      }
      if(title.includes("Semi Annual") || title.includes("Semi-Annual")){
        var plan = "<u>5 Pair</u> Delivered <u>Every 6 Months</u>";
        selection.push('plan=Every 6 Months');
      }

      var boxPricing = '<h4>'+Shopify.formatMoney(customer.next_charge.total_line_items_price, window.money).replace(".00", "")+'</h4>',
      	  date = new Date(nextChargeDetail),
          skippedDate = customer.next_charge.status = "SKIPPED" ? new Date(customer.subscription.next_charge_scheduled_at) : null;
      
      var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      
      var nextDate = months[date.getMonth()]+' '+date.getFullYear();      
      
      if (customer.next_charge.status == "SKIPPED") {
      	boxPricing = '<span>Now Ships on: '+ months[skippedDate.getMonth()] + ', ' + skippedDate.getFullYear() +', ' + Shopify.formatMoney(customer.next_charge.total_line_items_price, window.money).replace(".00", "") + '</span>';
        nextDate = 'Skipped'; 
      }
      
      selection.push('id='+subscriptionDetail.id);
      
      var editLink = '/pages/build-your-box?'+selection.join('&');
      var customProductHTML = "";
      if(title.includes("Custom")){
        var packInfo = t;
        
        if (customer.oneTimeProducts.length <= 0) {
        	customProductHTML += "<li>Make your selections on "+ nextDate.split(' ')[0] +" 1st.</li>";
        } else {
        	$(customer.oneTimeProducts).each(function(key,product){
              var number = key + 1;
              customProductHTML += "<li>"+number+" - "+product.product_title+"</li>";
            });
        }
        
        customProductHTML = '<div class="ebyCustomBoxDetails"><span>My Current Selections</span><ul>'+customProductHTML+'</ul></div>';
      }else{
        var packInfo = t+', '+color;
      }
      
      var status = customer.charge.status;
      var skpBtn = '';
      if(status == 'SKIPPED'){
        skpBtn = '<button class="ebySkipbtn btn" data-type="unskip" data-subscription="'+subscriptionDetail.id+'" data-id="'+ nextChargeDetail.id +'">Unskip</button>';
      }else if(status == 'QUEUED'){
        skpBtn = '<button class="ebySkipbtn btn" data-type="skip" data-subscription="'+subscriptionDetail.id+'" data-id="'+ nextChargeDetail.id +'">Skip</button>';
      }
            
      var s = '';
      if(subscriptionDetail.status == 'ACTIVE'){
        if (!!nextChargeDetail) {
          if (!!isBlackoutActive) {
          	s = '<div class="ebyBoxUpcoming"><span>Next Box</span><h4 class="ebyNextDate preppingOrder">Order in Prep</h4><h4>Ships '+nextDate+'</h4><a href="javascript:void(0);" class="ebyChangeDatebtn" >Change Date</a><div class="date-field hide"><form type="get" class="updateRechargeDate"><div class="input-group"><input class="form-control date" id="date" name="date" value="'+nextChargeDetail.scheduled_at+'" type="text"/></div>';
        	s += '<input name="type" class="type" type="hidden" value="change_date"><input name="id" class="id" type="hidden" value="'+nextChargeDetail.id+'"><button type="submit" class="btn">Update</button></form></div></div>';
          } else {
          	s = '<div class="ebyBoxUpcoming"><span>Next Box</span>'+skpBtn+'<h4 class="ebyNextDate">'+nextDate+'</h4><a href="javascript:void(0);" class="ebyChangeDatebtn" >Change Date</a><div class="date-field hide"><form type="get" class="updateRechargeDate"><div class="input-group"><input class="form-control date" id="date" name="date" value="'+nextChargeDetail.scheduled_at+'" type="text"/></div>';
        	s += '<input name="type" class="type" type="hidden" value="change_date"><input name="id" class="id" type="hidden" value="'+nextChargeDetail.id+'"><button type="submit" class="btn">Update</button></form></div></div>';
          }
        
        } else {
        s = '<div class="ebyBoxUpcoming"><span>Next Box</span>'+skpBtn+'<h4 class="ebyNextDate">On Hold - Update Card</h4></div>';
        }
      }else{
        // status handling
        if (subscriptionDetail.status === "CANCELLED") {
        	s = '<div class="ebyBoxUpcoming"><span>Next Box</span><h4 class="statusAlert">Inactive</h4> <button class="ebyReactivateBtn btn" data-type="reactivate" data-id="'+subscriptionDetail.id+'">Reactivate</button></div>';
        } else {
        	s = '<div class="ebyBoxUpcoming"><span>Next Box</span><h4 class="statusAlert">'+subscriptionDetail.status+'</h4></div>';
        }
          
      }
      
      subscriptionHtml += '<div class="ebySubscriptionDetail">';
      if (!!isBlackoutActive) {
      	subscriptionHtml += '<div class="ebyBoxDetails"><div class="ebyDashSubHeader"><h3>'+box+'</h3></div><span class="ebyColor">'+packInfo+'</span><p class="ebyPlan">'+plan+'</p></div>';
      } else {
        if (subscriptionDetail.status == 'ACTIVE') {
          
          	// check if custom_box and if they are ready for selections
          	if (title.includes("Custom")) {
          		var canMakeSelections = isSelectionOpen(customer);
              	if (!!canMakeSelections.isOpen) {
              		subscriptionHtml += '<div class="ebyBoxDetails"><div class="ebyDashSubHeader"><h3>'+box+'</h3><a target="_blank" href="'+editLink+'" class="ebyEditQuizbtn btn">Edit</a></div><span class="ebyColor">'+packInfo+'</span><p class="ebyPlan">'+plan+'</p></div>';  
                } else {
                	subscriptionHtml += '<div class="ebyBoxDetails"><div class="ebyDashSubHeader"><h3>'+box+'</h3></div><span class="ebyColor">'+packInfo+'</span><p class="ebyPlan">'+plan+'</p></div>';  
                }
              
            } else {
          		subscriptionHtml += '<div class="ebyBoxDetails"><div class="ebyDashSubHeader"><h3>'+box+'</h3><a target="_blank" href="'+editLink+'" class="ebyEditQuizbtn btn">Edit</a></div><span class="ebyColor">'+packInfo+'</span><p class="ebyPlan">'+plan+'</p></div>';  
            }
          
        } else {
        	subscriptionHtml += '<div class="ebyBoxDetails"><div class="ebyDashSubHeader"><h3>'+box+'</h3></div><span class="ebyColor">'+packInfo+'</span><p class="ebyPlan">'+plan+'</p></div>';
        }
        
      }
      subscriptionHtml += customProductHTML;
      subscriptionHtml += s;
      subscriptionHtml += '<div class="ebyBoxPricing">'+boxPricing+'</div>';
      subscriptionHtml += '<div class="renew-msg"></div><a class="subscription-renew-btn btn" data-id="'+subscriptionDetail.id+'">Renew Now</a><p class="membership_details_blurb">* Any and all changes to your box must be made 10 days before your Next Box Date. <span>Any changes made during the 10 days before your next box date will not be reflected in your immediate shipment.</span></p>';
      subscriptionHtml += '</div>';
      subscriptionHtml += '<div class="ebySubscriptionImage">';
      subscriptionHtml += '<img src="'+subscriptionProduct.images[0].src+'">';
      subscriptionHtml += '</div>';

      $subscriptionBox.html(subscriptionHtml);
      //console.log($.cookie("subscription_status"));
      
      if($.cookie("subscription_status") == "true"){
        $(".subscriptionUpdate").html('<p>Your Membership Has Updated.</p>');
        setTimeout(function(){
          $(".subscriptionUpdate").hide();
          $.cookie("subscription_status", null);
        }, 10000);
      }
      
      var cDate = new Date();
      var d = cDate.getMonth()+'-'+cDate.getDate()+'-'+cDate.getFullYear()
      var $date = $(document).find('input[name="date"]');
      $date.datetimepicker({
        format: 'YYYY-MM-DD'
      });
      //$(document).find('input[name="date"]').datepicker();
    }
  };
  
  function generatForms(customer){
    var $payment = $('#paymentPopup');
  };
  
  function getCustomer(){
    console.log('::Get customer init::');
    
    $.ajax({
      type: "POST",
      crossDomain:true,
      url: "https://secureddatasystem.com/ShopifyApps/eby/get_customer.php",
      data: {data: {'customer': window.customer_id } },
      dataType: 'json',
      beforeSend: function() {
        $('body').addClass('velaCartAdding');
      },
      success: function(data){
        console.log('::Get customer successful::', data.subscription);
        
        setDetails(data);
        generatForms(data);
        
        if (!!data.address) {
        	generateBillingDetails(data.customer, data.address.id);
        	generateShippingDetails(data.address);
        } else {
        	generateBillingDetails(data.customer, null);
            var customerAddressData = {
              address1: data.customer.billing_address1,
              address2: data.customer.billing_address2,
              city: data.customer.billing_city,
              zip: data.customer.billing_zip,
              province: data.customer.billing_province,
              country: data.customer.billing_country,
              phone: data.customer.billing_phone
            }
          
          	generateShippingDetails(customerAddressData);
        }
        
        generateAccountDetails(data.customer);
        
        $('body').removeClass('velaCartAdding');
      },
      error: function(xhr, text) {
        $('body').removeClass('velaCartAdding');
        console.log('::Get customer failure::', {
          text: text,
          xhr: xhr
        });
      }
    });
    
    /*$.ajax({
      type: "POST",
      url: "https://www.qetail.com/shopify_app/sanket/stripe/get_customer.php",
      //url: "https://secureddatasystem.com/ShopifyApps/eby/stripe/get_customer_payment.php",
      data: {data: {'customer': window.customer_email }},
      dataType: 'json',
      beforeSend: function() {
        $('body').addClass('velaCartAdding');
      },
      success: function(data){
        console.log(data);
        
        var paymentDetail = '<li>'+data.brand+' •••• '+data.last4+'</li>';
        paymentDetail += '<li>'+data.name;
        paymentDetail += '<li>Expires '+ ("0" + data.exp_month).slice(-2)+'/'+ data.exp_year +'</li>';
        $payment.find('.accountContent').html('<ul class="addressInfo list-unstyled">'+paymentDetail+'</ul>');
        $payment.removeClass('hide');
        
        $('#stripe_customer_id').val(data.customer_id);
        
        $('#card_owner_name').val(data.name);
        
        //$('body').removeClass('velaCartAdding');
      },
      error: function(xhr, text) {
        $('body').removeClass('velaCartAdding');
        console.log(text);
        console.log(xhr);
      }
    });*/
  };
  
  /*$('.recharge_forms').submit(function(e){
    e.preventDefault;
    console.log($(this).serialize());
    
    $.ajax({
      type: "POST",
      crossDomain : true,
      url: "https://secureddatasystem.com/ShopifyApps/eby/update_customer.php",
      data: $(this).serialize(),
      dataType: 'json',
      success: function(data){
        console.log(data);
      },
      error: function(xhr, text) {
        console.log(text);
        console.log(xhr);
      }
    });
  });*/
  
  /* eby - accordion func */
  /*
  $(document).ready(function(){

    Smooch.on('widget:closed', function() {
      $('#gorgias-web-messenger-container').fadeOut();
    });

  });
  */

  $('body').on('click', '.gorgias-web-messenger-container-button', function (ev) {
    $('#gorgias-web-messenger-container').fadeIn();
    Smooch.open();
  });

  // change date functionality
  $(document).on('click', '.ebyChangeDatebtn', function(){
    $(this).next('.date-field').toggleClass('hide');
    $(this).text($(this).text() == 'Cancel' ? 'Change Date' : 'Cancel');
  });
  
  // skip functionality
  $(document).on("click", ".ebySkipbtn", function(){
    $('body').addClass('velaCartAdding');
    var id = $(this).data('id');
    var type = $(this).data('type');
    var subscription_id = $(this).data('subscription');
    $.ajax({
      type: "POST",
      crossDomain : true,
      url: "https://secureddatasystem.com/ShopifyApps/eby/charge.php",
      data: { data: {id: id, type: type, subscription_id: subscription_id, shopify_customer_id:window.customer_id }},
      dataType: 'json',
      success: function(data){
        console.log(data);
        var charge = data.charge;
        $('body').removeClass('velaCartAdding');
        location.reload();
      },
      error: function(xhr, text) {
        console.log(text);
        console.log(xhr);
        $('body').removeClass('velaCartAdding');
        location.reload();
      }
    });
  });
  
  $(document).on('click', '.ebyReactivateBtn', function(ev){
    
    console.log('reactivate account');
    
    $('body').addClass('velaCartAdding');
    var id = $(this).data('id');
    var type = $(this).data('type');
    //var subscription_id = $(this).data('subscription');
    
    // is my card valid 
    console.log(customer);
    // reactivate subscription
    $.ajax({
      type: "POST",
      crossDomain : true,
      url: "https://secureddatasystem.com/ShopifyApps/eby/subscription.php",
      data: { data: {type:'reactivate', id: id}},
      dataType: 'json',
      success: function(data){
        console.log('reactivate data ouput', data);
        
        $(document).find('.renew-msg').html('<p>'+data.warning+'</p>');
        setTimeout(function(){
          $(document).find('.renew-msg').hide();
        }, 3000);
        $('body').removeClass('velaCartAdding');
      },
      error: function(xhr, text) {
        $(document).find('.renew-msg').html('<p>'+text+'</p>');
        console.log(text);
        console.log(xhr);
        $('body').removeClass('velaCartAdding');
      }
    });
    
  });
  
  // process now functionality
  $(document).on("click", ".subscription-renew-btn", function(){
    $('body').addClass('velaCartAdding');
    var id = $(this).data('id');
    $.ajax({
      type: "POST",
      crossDomain : true,
      url: "https://secureddatasystem.com/ShopifyApps/eby/subscription.php",
      data: { data: {type:'renew', id: id}},
      dataType: 'json',
      success: function(data){
        console.log(data);
        $(document).find('.renew-msg').html('<p>'+data.warning+'</p>');
        setTimeout(function(){
          $(document).find('.renew-msg').hide();
        }, 3000);
        $('body').removeClass('velaCartAdding');
      },
      error: function(xhr, text) {
        $(document).find('.renew-msg').html('<p>'+text+'</p>');
        console.log(text);
        console.log(xhr);
        $('body').removeClass('velaCartAdding');
      }
    });
  });
  
  // update date functionality
  $(document).on('submit', ".updateRechargeDate", function(e){
    var form = $(this);
    $('body').addClass('velaCartAdding');
    console.log($(form).serializeArray());
    var type = $(form).find('.type').val(), date = $(form).find('.date').val(), id = $(form).find('.id').val();
    console.log();
    $.ajax({
      type: "POST",
      crossDomain : true,
      url: "https://secureddatasystem.com/ShopifyApps/eby/subscription.php",
      data: { data: {
        id:id,
        date:date,
        type:type
      }},
      dataType: 'json',
      success: function(data){
        //console.log(data);
        getCustomer();
        //$('body').removeClass('velaCartAdding');
      },
      error: function(xhr, text) {
        console.log(text);
        console.log(xhr);
        $('body').removeClass('velaCartAdding');
      }
    });
    return false;
  });
  
  function updateRechargeCustomer(customerID, stripeToken){
    $.ajax({
      type: "POST",
      url: "https://secureddatasystem.com/ShopifyApps/eby/update_recharge_customer.php",
      data: {data: {
        stripeToken:stripeToken,
        customerID:customerID,
      }},
      dataType: 'json',
      beforeSend: function() {
        $('body').addClass('velaCartAdding');
        //location.reload();
      },
      success: function(data){
        console.log(data);
        $('body').removeClass('velaCartAdding');
        location.reload();
      },
      error: function(xhr, text){
        $('body').removeClass('velaCartAdding');
        console.log(text);
        console.log(xhr);
      }
    });
  }
  
  $(document).on('submit', ".recharge_forms", function(e){
    var form = $(this);
    $('body').addClass('velaCartAdding');
    console.log('sdf');
    if($(this).hasClass('paymentDetailForm')){
      var formData = $(form).serializeArray();
      //console.log(formData);

      stripe.createToken(cardElement).then(function(result) {
        // Handle result.error or result.token
        if(result.error != undefined){
          displayError.textContent = result.error.message;
        }
        if(result.token != undefined){
          //console.log(result);

          var formData = $(form).serializeArray();
          console.log(formData);
          var customerID = $(form).find('input[name="customer_id"]').val();
          displayError.textContent = '';
          $.ajax({
            type: "POST",
            url: "https://www.qetail.com/shopify_app/sanket/stripe/update_customer.php",
            data: {data: formData},
            dataType: 'json',
            beforeSend: function() {
              $('body').addClass('velaCartAdding');
              //location.reload();
            },
            success: function(data){
              console.log(data);
              if(data.error != undefined){
                $('#card-errors').text(data.error.message);
                $('#card-errors').addClass('hvr-buzz-out');
                $('body').removeClass('velaCartAdding');
              }else{
                $('#card-errors').removeClass('hvr-buzz-out');
                $('body').removeClass('velaCartAdding');
                updateRechargeCustomer(customerID, data.id);
              }
              //updateRechargeCustomer(customerID, data.id);
            },
            error: function(xhr, text){
              $('body').removeClass('velaCartAdding');
              console.log(text);
              console.log(xhr);
            }
          });
        }
      });
      /*$.ajax({
        type: "POST",
        crossDomain : true,
        url: "https://secureddatasystem.com/ShopifyApps/eby/update_customer.php",
        data: { data: $(form).serializeArray()},
        dataType: 'json',
        success: function(data){
          console.log(data);
          $.fancybox.close();
          
          $('body').removeClass('velaCartAdding');
        },
        error: function(xhr, text) {
          console.log(text);
          console.log(xhr);
          $('body').removeClass('velaCartAdding');
        }
      });*/
    }else{
      if($(form).find('.type').val() == "shipping_address"){
        $(this).validate({
          rules: {
            phone: {
              required: true,
              phoneUS: true
            }
          }
        });
      }
      if($(form).find('.type').val() == "billing_address"){
        $(this).validate({
          rules: {
            billing_phone: {
              required: true,
              phoneUS: true
            },
            email: {
              required: true,
              email: true
            }
          }
        });
      }
      
      $.ajax({
        type: "POST",
        crossDomain : true,
        url: "https://secureddatasystem.com/ShopifyApps/eby/update_customer.php",
        data: { data: $(form).serializeArray()},
        dataType: 'json',
        success: function(data){
          console.log(data);
          
          if(data.customer != undefined){
            if(data.customer.errors != undefined){
              var err = '';
              for (var key of Object.keys(data.customer.errors)) {
                //console.log(key + " -> " + data.customer.errors[key])
                err += '<p>'+data.customer.errors[key]+'</p>';
              }
              $(form).find('.error').html(err);
            }else{
              $.fancybox.close();
              if(data.address != undefined){
                generateShippingDetails(data.address.address);
              }
              generateBillingDetails(data.customer.customer, $(form).find('#address_id').val());
              generateAccountDetails(data.customer.customer);
            }
          }
          if(data.address != undefined){
            if(data.address.errors != undefined){
              var err = '';
              for (var key of Object.keys(data.customer.errors)) {
                //console.log(key + " -> " + data.customer.errors[key])
                err += '<p>'+data.customer.errors[key]+'</p>';
              }
              $(form).find('.error').html(err);
            }else{
              $.fancybox.close();
              generateShippingDetails(data.address.address);
              if(data.customer != undefined){
                generateBillingDetails(data.customer.customer, data.address.address.id);
                generateAccountDetails(data.customer.customer);
              }
            }
          }
          
          $('body').removeClass('velaCartAdding');
        },
        error: function(xhr, text) {
          console.log(text);
          console.log(xhr);
          $('body').removeClass('velaCartAdding');
        }
      });
    }
        
    return false;
  });
};
    
    
$(document).ready(function() {
    $(account.init);  
});