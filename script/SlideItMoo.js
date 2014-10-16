/*
	SlideItMoo v1.0 - Image slider
	(c) 2007-2008 Constantin Boiangiu <http://www.php-help.ro>
	MIT-style license.
*/
var SlideItMoo = new Class({
					   
	initialize: function(options){
		this.options = $extend({
			itemsVisible:5,
			showControls:1,
			autoSlide: 0,
			transition: Fx.Transitions.linear,
			currentElement: 0,
			thumbsContainer: 'thumbs',
			elementScrolled: 'thumb_container',
			overallContainer: 'gallery_container'
		},options || {});	
		
		this.images = $(this.options.thumbsContainer).getElements('a');
		// assumes that all thumbnails have the same width
		this.image_size = this.images[0].getSize();
		
		// resizes the container div's according to the number of itemsVisible thumbnails
		this.setContainersSize();
		
		this.myFx = new Fx.Scroll(this.options.elementScrolled,{ transition: this.options.transition });		
		// adds the forward-backward buttons
		if( this.images.length > this.options.itemsVisible ){
			this.fwd = this.addControlers('addfwd');
			this.bkwd = this.addControlers('addbkwd');
			this.forward();
			this.backward();
			/* if autoSlide is not set, scoll on mouse wheel */
			if( !this.options.autoSlide ){
				$(this.options.thumbsContainer).addEvent('mousewheel', function(ev){
					new Event(ev).stop();
					ev.wheel < 0 ? this.fwd.fireEvent('click') : this.bkwd.fireEvent('click');			
				}.bind(this));
			}
			else{
				this.startIt = function(){ this.fwd.fireEvent('click') }.bind(this);
				this.autoSlide = this.startIt.periodical(this.options.autoSlide, this);
				this.images.addEvents({
					'mouseover':function(){
						$clear(this.autoSlide);						
					}.bind(this),
					'mouseout':function(){
						this.autoSlide = this.startIt.periodical(this.options.autoSlide, this);
					}.bind(this)
				})
			}
		};
		
		// if there's a specific default thumbnail to start with, slide to it
		if( this.options.currentElement!==0 ){
			this.options.currentElement-=1;
			this.slide(1);
		}
	},
	
	setContainersSize: function(){
		$(this.options.overallContainer).set({
			styles:{
				'width': this.options.itemsVisible * this.image_size.x + 50*this.options.showControls + (this.options.itemsVisible-1)*3
			}
		});
		$(this.options.elementScrolled).set({
			styles:{
				'width': this.options.itemsVisible * this.image_size.x + (this.options.itemsVisible-1)*3
			}
		});
	},
	
	forward: function(){				
		this.fwd.addEvent('click',function(){
			this.slide(1);
		}.bind(this));		
	},
	
	backward: function(){			
		this.bkwd.addEvent('click',function(){											
			this.slide(-1);			
		}.bind(this))	
	},
	
	addControlers: function(cssClass){
		element = new Element('div',{
			'class': cssClass,
			styles:{
				'display': this.options.showControls ? '' : 'none'
			}
		}).injectInside($(this.options.overallContainer));
		return element;
	},
	
	slide: function(step){
		/* if autoslice is on, when end is reached, go back to begining */
		if(this.options.autoSlide && this.options.currentElement >= this.images.length-this.options.itemsVisible ){
			this.options.currentElement = -1;
		}
		
		if ( ( this.options.currentElement < this.images.length-this.options.itemsVisible && step>0 ) || ( step < 0 && this.options.currentElement !== 0 ) ){
			this.myFx.cancel();
			this.options.currentElement += step;		
			this.myFx.toElement( this.images[this.options.currentElement] );
		}
	}
})