# photo-gallery
Pure javascript proto-type class allowing for the nice display of photos on a page


To use the class you must call the constructor array of image urls to be displayed on the page and an ID of a container to put them.  There are a number of optional arguments that you can pass to the constructor to configure your version of the photo-gallery.  Options are to be the third parameter in a associative object.

Options include 
*	min_size: Int 		  - The minimum height of a picture in pixles. defualt: 250px
*	margin: Int 		    - The margin that should be around each of the photos in the gallery. Default: 5px
*	photo_class: String - The class that each of the photos will have. Default: string
*	grid_snap: int		  - Pixel value of when the photos should resize based on width. Devault: 1
*	max_img_per_row: int- The maximum number of photos to be in each row. Default: 3
*	resize: bool		    - Boolean value to deterime if the images will be reorganized on window resize or not. Default: true


Example:

var output = new Layout(["http://lorempixel.com/600/300",
"http://lorempixel.com/250/800",
"http://lorempixel.com/650/200",
"http://lorempixel.com/210/1000",
"http://lorempixel.com/710/230"], 'photo_view', {min_size: 300});
