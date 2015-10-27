/*
*	Required Parameters -
*	Array of photo urls starting from the root
*	ID of an element that the new images will go
*	
*	Optional Parameters will be in an object the names are case sensitive
*	min_size: Int 		- The minimum height of a picture in pixles. defualt: 250px
*	margin: Int 		- The margin that should be around each of the photos in the gallery. Default: 5px
*	photo_class: String - The class that each of the photos will have. Default: string
*	grid_snap: int		- Pixel value of when the photos should resize based on width. Devault: 1
*	max_img_per_row: int- The maximum number of photos to be in each row. Default: 3
*	resize: bool		- Boolean value to deterime if the images will be reorganized on resize or not. Default: true
*/
function Layout(photo_arr, container, options){
	this.photos = photo_arr;
	
	//Check if container is an actual ID that exists
	//Otherwise create a new one
	if(document.getElementById(container)){
		this.container = document.getElementById(container);
	}else{
		this.container = document.createElement('div');
		document.body.appendChild (this.container);
	}
	
	//Optional parameters for the function
	this.smallest_height = options.min_size || 250;
	this.margin = typeof options.margin !== 'undefined' ? options.margin : 5;
	this.photo_class_name = options.photo_class || 'scbprojects-com-photo';
	this.grid_snap = options.grid_snap || 1;
	this.max_img_per_row = options.max_img_per_row || 3;
	
	this.original_aspect_ratio = [];
	
	
	if(typeof options.resize === 'undefined' || options.resize){
		window.onresize = this.nice_flow.bind(this);
	}
	
	this.init();
}

Layout.prototype = {

	init: function(){
		//Add CSS for the elements that we are creating
		var css = "."+this.photo_class_name+"{	float: left; margin-left: "+this.margin+"px; background-repeat: no-repeat; background-position: center; background-size: cover; cursor: pointer;}";
		css += 'dialog::backdrop{ background-color: rgba(0, 0, 0, 0.7); }';
		
		var head = document.head || document.getElementsByTagName('head')[0],
		style = document.createElement('style');

		style.type = 'text/css';
		if (style.styleSheet){
			style.styleSheet.cssText = css;
		} else {
			style.appendChild(document.createTextNode(css));
		}
		head.appendChild(style);
	
		for (var i = 0; i < this.photos.length; ++i){
			var self = this;
			var index = i;
			var img = new Image();
			img.onload = function(){	self.init_photo(this);	};
			img.src = this.photos[i];
			this.photos[i] = img;
			
		}
	},
	
	/*
	*	Checks to see if all the photos have been loaded if so calls the all_loaded function
	*/
	init_photo: function(img){
		var oar = img.width / img.height;				//Calculate aspect ratio	
		
		var new_el = document.createElement("div");
		new_el.className = this.photo_class_name;
		new_el.style.backgroundImage = 'url('+img.src+')';
		new_el.onclick = this.show_large;
		this.set_height_and_width(new_el, this.smallest_height, this.smallest_height * oar)
		this.container.appendChild(new_el);
		this.original_aspect_ratio.push([oar, new_el]);
		
		//Check if all your photos are loaded
		if (this.photos.length === this.original_aspect_ratio.length){
			this.nice_flow();
		}
	},
	
	nice_flow: function(){
		var width_snap = Math.floor(this.container.offsetWidth / this.grid_snap) * this.grid_snap;
		this.fill_row(width_snap);
	},
	
	fill_row: function(total_width){
		var row_width = 0;
		var aspect_total = 0;
		var current_row_start_index = 0;
		var row_top = 0;
		var min_height = Math.max(this.smallest_height, total_width/4);
		
		for(var i = 0; i < this.original_aspect_ratio.length; ++i){
			var aspectRatio = this.original_aspect_ratio[i][0];
			var img = this.original_aspect_ratio[i][1];
			aspect_total += aspectRatio;
			//Change height of element to be that of the minimum height requirement
			this.set_height_and_width(img, min_height, min_height * aspectRatio);
			row_width += img.offsetWidth+this.margin;
			
			
			//Check to see if the next element will fit in the row at the current height
			if (i + 1 < this.original_aspect_ratio.length){
				var next_width = row_width + min_height * this.original_aspect_ratio[i+1][0];
			}else{
				//No more elements force row compensation
				var next_width = total_width+1;
			}
			
			//Will next element fit
			//Or you have passed the max row option
			if(total_width - next_width < 0 || i - current_row_start_index >= this.max_img_per_row - 1){
				var extra_width = total_width - row_width;			//The amount of width to fill the row

				//grow current row to fit the remaining space and start a new row
				var left = 0;				
				var height = min_height;
				for (var q = current_row_start_index; q < i+1; q++){
					var el = this.original_aspect_ratio[q][1];		//current element to adjust width
					var ar = this.original_aspect_ratio[q][0];
					
					//If there is only one element left in the final row
					//Set height to the min_height and adjust the width to match.
					if (current_row_start_index === q && q === this.original_aspect_ratio.length - 1){
						this.set_height_and_width(el, min_height, min_height * ar);
						this.set_transform(el, left, row_top);
						
					}else{					
						//Get a percentage of the total aspect ratio then use that percentage to determine how much of the unsued space this element gets
						var new_width = el.offsetWidth + (extra_width * (ar / aspect_total));
						//Calculate new height
						height = new_width / ar;
						this.set_height_and_width(el, height, new_width);
						el.style.position = 'absolute';
						this.set_transform(el, left, row_top);
					}
						
					//Set where next photo will go
					left += new_width+this.margin;
				}
				
				//Reset row variables for next row
				row_width = 0;
				aspect_total = 0;
				current_row_start_index = i+1;
				row_top += height+this.margin;
			}
		}
		
	this.container.style.height = row_top;
	},
	
	set_height_and_width: function(element, h, w){
		element.style.width = w+"px";
		element.style.height = h+"px";
	},
	
	set_transform: function(element, x, y){
		var transfromString = 'translate('+x+'px, '+y+'px)';
		
		//add the proper prefix
		element.style.webkitTransform = transfromString;
		element.style.MozTransform = transfromString;
		element.style.msTransform = transfromString;
		element.style.OTransform = transfromString;
		element.style.transform = transfromString;
	},
	
	show_large: function(){
		var dialog = document.createElement('dialog');
		var ar = this.offsetWidth / this.offsetHeight;
		document.body.appendChild(dialog);
		dialog.style.backgroundImage = this.style.backgroundImage;
		dialog.style.backgroundRepeat = 'no-repeat';
		dialog.style.backgroundPosition = 'center'; 
		dialog.style.backgroundSize = 'cover';
		dialog.style.padding = 0;
		dialog.style.border = 'none';
		
		//Height and width of browser
		var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		h -= 5;
		w -= 25;
	
		//Set to full height
		dialog.style.width = h * ar;
		dialog.style.height = h;
		
		dialog.showModal();
		//Check if its too wide to fit and adjust
		if (w < dialog.offsetWidth){
			dialog.style.width = w;
			dialog.style.height = w / ar;
			dialog.close();
			dialog.showModal();
		}
		console.log(dialog, dialog.offsetWidth);
		dialog.onclick = function(){ this.close(); document.body.removeChild(this);	};
	}
}