
    (function($)
    {	
        /**********************************************************************/

        var Cascade=function(cascade,page,requestCurrent)
        {

            /******************************************************************/
            
            var $this=this;
			
			$this.page=page;
			
			$this.cascade=$(cascade);
            $this.cascadeWindow=cascade.find('.cascade-window');
            $this.cascadeElement=cascade.find('.cascade-menu li');
            $this.cascadeNavigation=cascade.find('.cascade-navigation');

            $this.enable=false;

			$this.requestPrevious='';
            $this.requestCurrent=requestCurrent;
			$this.requestType=$this.requestCurrent=='' ? 1 : 2;
            
            $this.scrollbar='';
            
            $this.cascadeWindowWidth=640;
            $this.cascadeElementMargin=20;
			
			$this.cascadeMinimumTabCount=4;
            
            /******************************************************************/

            this.load=function()
            {				
                var i=0,k=0,left=0;
                var width=parseInt($this.cascadeElement.first().css('width'));

                var image=$this.imageLoad($this.cascadeElement.first());
                image.bind('load',function() 
                {
                    $this.cascadeElement.each(function() 
                    {
                        var image=$this.imageLoad($(this).children('a').first());
                   
                        left=(width*k)+($this.cascadeElementMargin*k);
                        $(this).css('left',left);
                    
                        k++;

                        $(image).bind('load',function() 
                        {
                            if((++i)==$this.cascadeElement.length)
                            {
                                var j=0;

                                $this.cascade.removeClass('preloader');
                                $this.cascadeElement.css('display','block');

                                $this.cascadeElement.each(function() 
                                {
                                    $(this).animate({height:parseInt($this.cascade.css('height')),opacity:1},getRandom(100,1000),'easeInOutQuint',function()
                                    {
                                        if((++j)==$this.cascadeElement.length)
                                        {
											$this.requestPrevious=$this.getURL('main');
											
											$this.createCascadeMenuSlider();
                                            $this.enable=true;
                                            $this.handleRequest();
                                        };
                                    });
                                });
                            };			
                        });
                    });
                });
            };
			
			/******************************************************************/
			/******************************************************************/
			
            this.handleRequest=function()
            {     
				if($this.requestType==2)
				{
					$this.doRequest();
				}
	            else 
                {
                    var requestCurrent=$this.checkRequest();	
					if(requestCurrent!==false)
					{
						$this.requestCurrent=requestCurrent;
						if($this.requestCurrent!=$this.requestPrevious) $this.doRequest();
					}					
					
					$(window).bind('hashchange',function(event) 
					{
						event.preventDefault();

						if($this.isEnable()==false) return;
		
						var requestCurrent=$this.checkRequest();
						if(requestCurrent===false) return;

						$this.requestCurrent=requestCurrent;
						$this.doRequest();
					}); 
				}
            };	
			
			/******************************************************************/
			
            this.doRequest=function()
            {
                if(!$this.enable) return(false);
                $this.enable=false;

                var open=$this.isOpen();
				
                if($this.requestCurrent=='main') $this.close();
				else if(open) $this.close({'onComplete':function() { $this.open(); }});
                else $this.open();    
                
                return(true);
            };
			
			/******************************************************************/
			
            this.checkRequest=function()
            {
				var request=window.location.hash.substring(2);
				
				if(request=='main') return('main');
				
                for(var id in $this.page)
                {
                    if(id==request) return(request);
                };
				
				window.location=$this.getURL('main');
				
				return(false);
            };
			
			/******************************************************************/
			/******************************************************************/
			
            this.isOpen=function()
            {
                return($this.cascade.hasClass('open'));
            };
			
			/******************************************************************/
			
			this.openComplete=function()
			{
				$this.createScrollbar();
                $this.showPreloader(false);	

                jQuery.getScript('page/script/main.js');
			
				$this.setTitle();
              
				$this.enable=true;

                $this.requestPrevious=$this.requestCurrent;
				$('#'+$this.getPage($this.requestCurrent,'tab')+' a').attr('href',$this.getURL('main'));
                                
                $this.createNavigation();
								
				if($this.isCascadeMenuSlider())
					$('.cascade-menu').trigger('slideTo',[0,{duration:0}]);
			};
			
			/******************************************************************/
			
			this.setTitle=function()
			{
				var value='';
				
				try
				{
					value=$this.page[$this.requestCurrent].title;
				}
				catch(e) { }
				
				
				document.title=value;
			};
			
			/******************************************************************/
			
			this.open=function()
            {
				$this.setCascadeMenuStyle('open');
				
                var i=0;
                var tab=$this.getPage($this.requestCurrent,'tab');
                var pagePath=$this.getPage($this.requestCurrent,'html');
                
                $('#'+tab).css('z-index',2);

                $this.cascadeElement.animate({left:0},500,'easeOutExpo',function() 
                {
                    i++;
                    if(i==$this.cascadeElement.length)
                    {
                        var className=$('#'+$this.getPage($this.requestCurrent,'tab')).attr('class').split(' ')[0].split('-')[0];
                        
                        $this.cascadeWindow.css('opacity','1').css('display','block').attr('class','cascade-window '+className);

                        $this.cascadeWindow.animate({width:$this.cascadeWindowWidth},500,'easeOutBounce',function()
                        {
							$this.cascade.addClass('open');
							
							if($this.requestType==1)
							{
								$this.showPreloader(true);
								$.get('page/'+pagePath,{},function(page) 
								{			
									$('.cascade-window-content').html(page);
									$this.openComplete();
								},
								'html');
							}
							else $this.openComplete();
                        });
                    };
                });
            };	
			
			/******************************************************************/
			
            this.close=function(data)
            {
				if(!$this.isOpen()) 
				{
					$this.enable=true;
					return;
				}

	            document.title = "Serg Melikyan :: Home"
				
                $(':input,a').qtip('destroy');
              
                $this.destroyScrollbar();
                $('.cascade-window-content').html('');
                
				if($this.requestPrevious!='')
					$('#'+$this.getPage($this.requestPrevious,'tab')+' a').attr('href',$this.getURL($this.requestPrevious));
                
                $this.cascadeWindow.animate({width:'0px',opacity:0},500,'easeOutBounce',function() 	
                {
                    $this.cascadeWindow.css('display','none');
                    $this.expand(data);
                });	
            };
			
			/******************************************************************/
			
			this.expand=function(data)
            {
                var width=parseInt($this.cascadeElement.first().css('width'));
                var counter=0,done=0,left=-1*width;
				
                $this.cascadeElement.each(function() 
                {
                    $(this).css('z-index',1);
                    left+=width+((counter++)>0 ? $this.cascadeElementMargin : 0);

                    $(this).animate({left:left},500,'easeOutExpo',function()
                    {
                        done++;
                        if(done==$this.cascadeElement.length)
                        {
							$this.cascade.removeClass('open');
							$this.setCascadeMenuStyle('close');
							
							if($this.isCascadeMenuSlider())
							{
								var index=$('.cascade-menu li').index($('a[href="'+$this.getURL($this.requestPrevious)+'"]').parent('li'));
								if($this.cascadeMinimumTabCount<=index) $('.cascade-menu').trigger('slideTo',[index,{duration:200}]);
							}
							
                            if(typeof(data)!='undefined')
                            {
                                if(typeof(data.onComplete)!='undefined') data.onComplete.apply();
                                else $this.enable=true;
                            }
                            else $this.enable=true;	
                        };
                    });
                });
            };		
			
			/******************************************************************/
			/******************************************************************/
			
            this.getFirstPage=function()
            {
                for(var id in $this.page) 
                {
                    if($this.page[id]['main']==1) return(id);
                };
                
                return(false);
            };
            
            /******************************************************************/
            
            this.getPrevPage=function()
            {
                var prev='';
				
                for(var id in $this.page)
                {
                    if(id==$this.requestCurrent && prev!='') return(prev);
                    else if($this.page[id]['main']==1) prev=id;
                };

                return(prev);
            };

            /******************************************************************/

            this.getNextPage=function()
            {
                var n=false;
                var next=$this.getFirstPage();

                for(var id in $this.page)
                {
                    if(n) 
                    {
                        if($this.page[id]['main']==1) return(id);
                    };
                    if(id==$this.requestCurrent) n=id;
                };

                return(next);
            };
            
            /******************************************************************/

            this.getPage=function(id,property)
            {
                return($this.page[id][property]);
            };
            
            /******************************************************************/
            
            this.getOpenStartPage=function()
            {
                for(var id in $this.page)
                {
                    if($this.page[id]['openStart']==1) return(id);
                };

                return(false);
            };  

			/******************************************************************/
			/******************************************************************/
			
			this.createScrollbar=function()
            {
                 $this.scrollbar=$('.cascade-window-content').jScrollPane({maintainPosition:false,autoReinitialise:true}).data('jsp');
            };
            
            /******************************************************************/

            this.destroyScrollbar=function()
            {
                if($this.scrollbar!='') 
                {
                    $this.scrollbar.destroy();
                    $this.scrollbar='';
                };              
            };	
			
			/******************************************************************/
			/******************************************************************/
			
			this.createCascadeMenuSlider=function()
			{
				if($this.cascadeElement.length<=$this.cascadeMinimumTabCount) return;
				
				$('.cascade-menu').carouFredSel(
				{
					circular:false,
					items: 
					{
						visible	: 4,
						minimum	: $this.cascadeMinimumTabCount,
						width	: parseInt($this.cascadeElement.first().css('width'))+$this.cascadeElementMargin
					},
					scroll: 
					{
						items		: 1,
						duration	: 500,
						fx			: 'directscroll'

					},
					auto	: false,
					prev	: '.cascade-navigation-slider-prev',
					next	: '.cascade-navigation-slider-next'
				});		
				
				$this.setCascadeMenuStyle('close');
				$('.cascade .caroufredsel_wrapper').css('width',parseInt($('.cascade .caroufredsel_wrapper').width())-$this.cascadeElementMargin);
			};
			
			/******************************************************************/
			
			this.isCascadeMenuSlider=function()
			{
				return($('.cascade .caroufredsel_wrapper').length==1 ? true : false);
			};
			
			/******************************************************************/
			/******************************************************************/
			
			this.createNavigation=function()
            {
                var prev=$this.getPrevPage();				
                var next=$this.getNextPage();	
                
                $this.cascade.find('.cascade-navigation-prev').attr('href',$this.getURL(prev));
                $this.cascade.find('.cascade-navigation-next').attr('href',$this.getURL(next));
            };	
			
			/******************************************************************/
			
			this.showNavigation=function(type)
			{
				$('.cascade-navigation-slider-prev,.cascade-navigation-slider-next,.cascade-navigation-next,.cascade-navigation-prev').css({'display':'none'});

				if(type=='open') $('.cascade-navigation-next,.cascade-navigation-prev').css({'display':'block'});
				if((type=='close') && ($this.isCascadeMenuSlider())) $('.cascade-navigation-slider-prev,.cascade-navigation-slider-next').css({'display':'block'});
			};
			
			/******************************************************************/
			/******************************************************************/
			
            this.imageLoad=function(object)
            {
                var image=$(document.createElement('img'));	
                var url=object.css('background-image').substring(4);
                    
                url=url.substring(0,url.length-1).replace(/"/ig,'');

                if($.browser.msie) image.attr('src',url+'?i='+getRandom(1,10000));
                else image.attr('src',url);
                
                return(image);
            };
            
            /******************************************************************/

            this.isEnable=function()
            {
                if(!$this.enable)
                {
                    window.location.href=$this.getURL($this.requestCurrent);
                    return(false);
                }  
                
                return(true);
            };

            /***********************************************************/

            this.showPreloader=function(show)
            {
                if(show) $this.cascadeWindow.addClass('cascade-window-prealoder');
                else $this.cascadeWindow.removeClass('cascade-window-prealoder');
            };

            /******************************************************************/

			this.setCascadeMenuStyle=function(type)
			{
				$this.showNavigation(type);
				
				if(!$this.isCascadeMenuSlider()) return;
				
				if(type=='close') $('.cascade-menu li').css({'position':'static','float':'left','margin-right':$this.cascadeElementMargin});
				if(type=='open')  $('.cascade-menu li').css({'position':'absolute','float':'none','margin-right':'0px'});
			};
			
			/******************************************************************/

			this.getURL=function(page)
			{
				return(($this.requestType==1 ? '#!' : '?_escaped_fragment_=')+page);
			};
			
			/******************************************************************/
        };

        /**************************************************************/

        $.fn.cascade=function(page,requestCurrent)
        {
            /***********************************************************/

            var cascade=new Cascade(this,page,requestCurrent);
            cascade.load();

            /***********************************************************/
        };

        /**************************************************************/

    })(jQuery);