$("#accordion > li > h3").click(function(){

	if(false == $(this).next().is(':visible')) {
		$('#accordion ul').slideUp(300);
	}

	var classnm = $(this).parent('li').attr("class");
	// Line Added to remove the active class from all 'li'
	$('#accordion > li').removeClass('active');
	// Line Added to remove the blank attribute of class from all 'li'
	$('#accordion > li[class=""]').removeAttr('class');
	// Line Added to add the active class in current 'li'

	$(this).next().slideToggle(300);  

	if(classnm == "undefined" || classnm == "" || classnm == undefined){
		$(this).parent('li').addClass('active');
	}
});

$('#accordion ul:eq(0)').show();

$("#accordion1 > li > h3").click(function(){

	if(false == $(this).next().is(':visible')) {
		$('#accordion1 ul').slideUp(300);
	}

	var classnm = $(this).parent('li').attr("class");
	// Line Added to remove the active class from all 'li'
	$('#accordion1 > li').removeClass('active');
	// Line Added to remove the blank attribute of class from all 'li'
	$('#accordion1 > li[class=""]').removeAttr('class');
	// Line Added to add the active class in current 'li'

	$(this).next().slideToggle(300);

	if(classnm == "undefined" || classnm == "" || classnm == undefined){
		$(this).parent('li').addClass('active');
	}
});

$('#accordion1 ul:eq(0)').show();

$(".accordion > li > h3").click(function(){

	if(false == $(this).next().is(':visible')) {
		$('.accordion ul').slideUp(300);
	}

	var classnm = $(this).parent('li').attr("class");
	// Line Added to remove the active class from all 'li'
	$('.accordion > li').removeClass('active');
	// Line Added to remove the blank attribute of class from all 'li'
	$('.accordion > li[class=""]').removeAttr('class');
	// Line Added to add the active class in current 'li'

	$(this).next().slideToggle(300);  

	if(classnm == "undefined" || classnm == "" || classnm == undefined){
		$(this).parent('li').addClass('active');
	}
});

$('.accordion ul:eq(0)').show();

$(".accordion1 > li > h3").click(function(){

	if(false == $(this).next().is(':visible')) {
		$('.accordion1 ul').slideUp(300);
	}

	var classnm = $(this).parent('li').attr("class");
	// Line Added to remove the active class from all 'li'
	$('.accordion1 > li').removeClass('active');
	// Line Added to remove the blank attribute of class from all 'li'
	$('.accordion1 > li[class=""]').removeAttr('class');
	// Line Added to add the active class in current 'li'

	$(this).next().slideToggle(300);

	if(classnm == "undefined" || classnm == "" || classnm == undefined){
		$(this).parent('li').addClass('active');
	}
});

$('.accordion1 ul:eq(0)').show();