jQuery(document).on('ready', function () {
  
/***
*
* Sort by style
*
*
***/  
  	const SORT_OPT_KEY = "pantyStyle-";
  
	let pantyStyleOpts = jQuery('.pantyStyleOptListing .sortOpt');
  
  	let prodListing = jQuery('.flashsaleProdListing .saleProdTitle');
  
  	// set up click event listening for the Opts
  	// if selected, hide non data-prodtype="x"

    let showOnlySelectedProds = function (prodListing, selection) {
        return prodListing.reduce(function (acc, prd) {
          if (prd.getData('prodtype') === selection) {
          	acc.push(prd);
          } 
        }, []);
    };
  
  
  	let getCurrPantySizeGroupSelection = function () {
      	let currSize = jQuery('.sorterListing.sizeOptListing input:checked').val();
      	let missyGroup = ['xs', 'sm', 'md', 'lg', 'xl'];
      	
      	return missyGroup.indexOf(currSize) >= 0 ? 'missy' : 'plus';
  	};
  
  	let getCurrPantySizeSelection = function () {
      return jQuery('.sorterListing.sizeOptListing input:checked').val();
  	};
    
  	/**
    * @param(optSelection) => string value of DOM element for filter option selected
    **/
    let updateHeaderModule = function(optSelection) {
      
      	console.log(':: Init headerModule update ::');
    
      	let header = jQuery('.collImageHeader');
      	let panelBgs = jQuery('#flashsalePanels').children();
      	let currSelection = optSelection;
      
      	// loop through panels and update the images src/data-src shown
      	panelBgs.map(function (index, panel) {
      		let panelType = panel.id.replace('-panel', '');
          	let panelImg = panel.children[0];
          	let panelImgType = getCurrPantySizeGroupSelection();
          	let globalBannerImg = document.getElementById('flashsale-all_styles_banner').getAttribute('src');
          	let baseImgUrl = globalBannerImg.substr(0, globalBannerImg.indexOf('all---model'));
          
          	panelImg.height = jQuery('.collImageHeader').height();
          
          	panelImg.onload = function (imgEv) {
          		imgEv.path[0].removeAttribute('height');
          	};
          	
          
          	if (panelType === "model") {
          		panelImg.setAttribute('src', baseImgUrl + currSelection.replace('_', '') + '---' + panelImgType + '---model_fr.jpg');
             	panelImg.setAttribute('data-src', baseImgUrl + currSelection.replace('_', '') + '---' + panelImgType + '---model_fr.jpg');
            } else if (panelType === "dress") {
            	panelImg.setAttribute('src', baseImgUrl + currSelection.replace('_', '') + '---' + panelImgType + '---model_dr.jpg');
              	panelImg.setAttribute('data-src', baseImgUrl + currSelection.replace('_', '') + '---' + panelImgType + '---model_dr.jpg');
            } else {
            	panelImg.setAttribute('src', baseImgUrl + currSelection.replace('_', '') + '---' + panelImgType + '---prod_lf.jpg');
              	panelImg.setAttribute('data-src', baseImgUrl + currSelection.replace('_', '') + '---' + panelImgType + '---prod_lf.jpg');
            }
      	});
      
      	// toggle screens from previous to current selection
      	//jQuery('.collHeaderWrapper').removeClass('active');
     
	    if (currSelection === "all") {
          	header.removeClass('panel-view');
            header.addClass('all-view');

          	jQuery('.collHeaderWrapper').removeClass('active');
            jQuery('.collHeaderWrapper.singlePanelView').addClass('active');
        
        } else {
          	if (!!header.hasClass('all-view')) {
                header.removeClass('all-view');
                header.addClass('panel-view');
              
              	jQuery('.collHeaderWrapper').removeClass('active');
                jQuery('.collHeaderWrapper.threePanelView').addClass('active');
          	}
        }
    };
  
  	/***
    *
    * @param(optSelection) => string value of DOM element for filter option selected
    * @param(prodListing)  => jQuery array of prodTiles
    **/
  	let updateCollectionModule = function(optSelection, prodListing) {
      	console.log(':: Init collectionMODULE update ::');
      
      	let collectionContainer = jQuery('.flashsaleProdListing');
      
      	if (!!collectionContainer.hasClass('filterActive')) {
            if (optSelection === "all") {
              	// reset
				collectionContainer.attr('class','ebyProdTileListWrapper flashsaleProdListing');
            } else {
            	collectionContainer.attr('class','ebyProdTileListWrapper flashsaleProdListing filterActive');
              	collectionContainer.addClass('filter-' + optSelection + '_only');
            }
            
      	} else {
      		collectionContainer.addClass('filterActive');
          	collectionContainer.addClass('filter-' + optSelection + '_only');
      	}
      
    };
  	
  	// set up listeners
	jQuery('.pantyStyleOptListing .sortOpt').on('click', function (ev) {
      console.log('style opt', ev.target.getAttribute('data-sortOpt').replace(SORT_OPT_KEY, ""));
      
      	let filterOptSelection = ev.target.getAttribute('data-sortOpt').replace(SORT_OPT_KEY, "");
      	jQuery('.sortOpt').removeClass('optOn');
      	jQuery(ev.target).addClass('optOn');
      
      	// update the Top Banner module
		updateHeaderModule(filterOptSelection);
      
      	// update the Sale Products Collection
      	updateCollectionModule(filterOptSelection, prodListing);
    });
  
  
  	console.log('::Sale Prd Listing::', prodListing);

  
  
  // init the default soring
//   lightningDeals.init({
//     moduleId: "flashSale",
//     toolBar: ".flashSaleToolbar",
//     defaultOpt: "pantySize",
//     defaultVal: "xs",
//     isDiscountApplied: true,
//     productDealListing: window.vela.lightningDeals 
//   });
  
});

