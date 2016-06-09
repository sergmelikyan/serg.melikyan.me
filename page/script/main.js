
/******************************************************************************/
/*	Image preloader															  */
/******************************************************************************/

$('.image-preloader img').each(function() 
{
	$(this).attr('src',$(this).attr('src') + '?i='+getRandom(1,100000));
	$(this).bind('load',function() 
	{ 
		$(this).parent().first().css('background-image','none'); 
		$(this).animate({opacity:1},1000); 
	});
});

/******************************************************************************/
/*	Nivo slider																  */
/******************************************************************************/

$('#slider').nivoSlider({directionNav:false});

/******************************************************************************/
/*	Fancybox for images														  */
/******************************************************************************/

$('.fancybox-image').fancybox({});

/******************************************************************************/
/*	Fancybox for youtube videos												  */
/******************************************************************************/

$('.fancybox-video-youtube').bind('click',function() 
{
    $.fancybox(
    {
        'padding'		: 10,
        'autoScale'		: false,
        'transitionIn'	: 'none',
        'transitionOut'	: 'none',
        'width'			: 860,
        'height'		: 468,
        'href'			: this.href,
        'type'			: 'iframe'
    });

    return false;
});

/******************************************************************************/
/*	Fancybox for vimeo videos												  */
/******************************************************************************/

$('.fancybox-video-vimeo').bind('click',function() 
{
	$.fancybox(
	{
		'margin'		: 0,
		'padding'		: 10,
		'autoScale'		: false,
		'transitionIn'	: 'none',
		'transitionOut'	: 'none',
		'title'			: this.title,
		'width'			: 860,
		'height'		: 468,
		'href'			: this.href,
		'type'			: 'iframe'
	});
	
	return false;
});

/******************************************************************************/
/*	Captify for portfolio images											  */
/******************************************************************************/

$('.gallery-list img').captify();

/******************************************************************************/
/*	Hover for portfolio images												  */
/******************************************************************************/

$('.gallery-list').hover(

    function() {},
    function()
    {
        $(this).find('li img').animate({opacity:1},250);
    }	

);

$('.gallery-list li').hover(

    function() 
    {
        $(this).siblings('li').find('img').css('opacity',0.5);
        $(this).find('img').animate({opacity:1},250);
    },

    function()
    {
        $(this).find('img').css('opacity',1);	
    }

);
	
/******************************************************************************/
/*	Portfolio filter														  */
/******************************************************************************/

$('.gallery-list').isotope(
{
	masonry			: {columnWidth:200},
	resizable		: false,
	itemSelector	: 'li',
	animationEngine : 'jquery'
});

$('.filter-list li a').bind('click',function(e) 
{
	e.preventDefault();
	
	$('.filter-list li a').removeClass('selected');
	$(this).addClass('selected');
	
	var object=$(this),filter='';
	var v=object.attr('class').split(' ');

	for(var i=0;i<v.length;i++) 
	{
		if(v[i].indexOf('filter-all')!=-1)
		{
			filter='';
			break;
		}
		
		if(v[i].indexOf('filter-')!=-1) filter+=' .'+v[i];			
	}

	$('.gallery-list').isotope({filter:filter,animationEngine:'jquery'});	
	
	$('.gallery-list .fancybox-image').each(function()
	{
		$(this).attr('_rel',$(this).attr('rel'));
		$(this).removeAttr('rel');
	});
	
	$('.gallery-list .fancybox-image').each(function() 
	{
		var visible=!$(this).parent('li').hasClass('isotope-hidden');
		
		if(visible) 
		{
			$(this).attr('rel',$(this).attr('_rel'));
			$(this).removeAttr('_rel');
		}
	});
});
				
/******************************************************************************/
/*	Skill list animation													  */
/******************************************************************************/

var i=0;
$('.skill-list-item-level span').each(function() 
{
    $(this).delay(((i++)*50)).animate({opacity:1},500);
});

/******************************************************************************/
/*	Google Maps																  */
/******************************************************************************/

try
{
	var coordinate=new google.maps.LatLng(29.803621,-95.37811);

	var mapOptions= 
	{
		zoom:15,
		center:coordinate,
		streetViewControl:false,
		mapTypeControl:false,
		zoomControlOptions: 
		{
			position:google.maps.ControlPosition.RIGHT_CENTER
		},
		panControlOptions: 
		{
			position:google.maps.ControlPosition.LEFT_CENTER
		},
		mapTypeId:google.maps.MapTypeId.ROADMAP
	};

	var googleMap=new google.maps.Map(document.getElementById('map'),mapOptions);

	var markerOptions=
	{
		map:googleMap,
		position:coordinate,
		icon:mainURL+'image/map_marker.png'
	}

	new google.maps.Marker(markerOptions);

}
catch(e) {}	

/******************************************************************************/
/*	Contact form															  */
/******************************************************************************/

$('#contact-form').submit(function() 
{
	submitContactForm();
	return(false);
});

/******************************************************************************/
/******************************************************************************/