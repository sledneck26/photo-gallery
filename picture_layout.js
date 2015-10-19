function extend (target, source) {
    var a = Object.create(target);
    Object.keys(source).map(function (prop) {
        prop in a && (a[prop] = source[prop]);
    });
    return a;
};

/*
*
*/
function Layout(photo_arr, container, min_size, margin){
	this.photos = photo_arr;
	this.container = document.getElementById(container);
	this.smallest_height = min_size;
	this.min_height = min_size;
	this.margin = typeof margin !== 'undefined' ? margin : 5;
	this.original_aspect_ratio = [];
	this.photo_class_name = 'scb-com-photo';
	this.count = 0;
	this.grid_snap = 1;
	this.max_img_per_row = 3;
	window.onresize = this.nice_flow.bind(this);
	
	this.init();
}

Layout.prototype = {

	init: function(){
	//Add CSS for the elements that we are creating
		var css = "."+this.photo_class_name+"{	float: left; background-repeat: no-repeat; background-position: center; background-size: cover;}",
		head = document.head || document.getElementsByTagName('head')[0],
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
		++this.count;
		var oar = img.width / img.height;				//Calculate aspect ratio	
		
		var new_el = document.createElement("div");
		new_el.className = this.photo_class_name;
		new_el.style.backgroundImage = 'url('+img.src+')';
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
				
				for (var q = current_row_start_index; q < i+1; q++){
					var el = this.original_aspect_ratio[q][1];		//current element to adjust width
					var ar = this.original_aspect_ratio[q][0];
					
					//If there is only one element left in the final row
					//Set height to the min_height and adjust the width to match.
					if (q === this.original_aspect_ratio.length - 1){
						this.set_height_and_width(el, min_height, min_height * ar);
						this.set_transform(el, left, row_top);
						
					}else{					
						//Get a percentage of the total aspect ratio then use that percentage to determine how much of the unsued space this element gets
						var new_width = el.offsetWidth + (extra_width * (ar / aspect_total));
						//Calculate new height
						var height = new_width / ar;
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
	}
}

var array = ['https://farm6.staticflickr.com/5775/21495115833_7b95275c3e_c',
"https://farm6.staticflickr.com/5775/21929641248_871715d790_c.jpg,",
"https://farm6.staticflickr.com/5699/22127358791_0359bc7726_c.jpg",
"https://farm1.staticflickr.com/603/22116627215_75cd465a50_c.jpg",
"https://farm1.staticflickr.com/689/22125157911_0648c89963_c.jpg",
"https://farm6.staticflickr.com/5821/21490634904_c72f156977_c.jpg",
"https://farm6.staticflickr.com/5679/21223936974_cf838e5e43_c.jpg",
"https://farm6.staticflickr.com/5632/21856300911_5bebf9e321_c.jpg",
"https://farm6.staticflickr.com/5782/21856365451_a8e8bcaa9f_c.jpg",
"https://farm1.staticflickr.com/589/21659813329_f04267c8a4_c.jpg",
"https://farm1.staticflickr.com/730/21659790059_de54217a3e_c.jpg",
"https://farm1.staticflickr.com/619/21822313915_e1fcf0eb98_c.jpg",
"https://farm1.staticflickr.com/625/21635422669_35b7731bb2_c.jpg",
"https://farm1.staticflickr.com/646/21199537034_6e7f37287c_c.jpg",
"https://farm1.staticflickr.com/744/21201203283_83e1a0a65f_c.jpg",
"https://farm6.staticflickr.com/5778/21201192423_2914190e84_c.jpg",
"https://farm1.staticflickr.com/635/21813329425_4eff08e21b_c.jpg",
"https://farm1.staticflickr.com/600/21190412624_660b5e349c_c.jpg"]		
var output = new Layout(array, 'photos_page', 300);