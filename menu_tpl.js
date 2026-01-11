/* Browser Detection */
var detect = navigator.userAgent.toLowerCase();
var OS,browser,total,thestring;
var version = 0;

if (checkIt('konqueror'))
{
	browser = "Konqueror";
	OS = "Linux";
}
else if (checkIt('safari')) browser = "Safari"
else if (checkIt('omniweb')) browser = "OmniWeb"
else if (checkIt('opera')) browser = "Opera"
else if (checkIt('webtv')) browser = "WebTV";
else if (checkIt('icab')) browser = "iCab"
else if (checkIt('msie')) browser = "Internet Explorer"
else if (!checkIt('compatible'))
{
	browser = "Netscape Navigator"
	version = detect.charAt(8);
}
else browser = "An unknown browser";

if (!version) version = detect.charAt(place + thestring.length);

if (!OS)
{
	if (checkIt('linux')) OS = "Linux";
	else if (checkIt('x11')) OS = "Unix";
	else if (checkIt('mac')) OS = "Mac"
	else if (checkIt('win')) OS = "Windows"
	else OS = "an unknown operating system";
}

function checkIt(string)
{
	place = detect.indexOf(string) + 1;
	thestring = string;
	return place;
}

winW = document.body.clientWidth;
winH = document.body.clientHeight;
winHoffset = 0;
if (browser == "Opera") {
  winHoffset = 8;
  if (document.body.offsetWidth != document.body.clientWidth) {
	winW = document.body.offsetWidth - 17;
  }
}


/* Menu Positioning Settings */
var MENU_POS = [
{
	// item sizes
	'height': 23,
	'width': 105,
	// menu block offset from the origin:
	//	for root level origin is upper left corner of the page
	//	for other levels origin is upper left corner of parent item
	// this value places the fisrt block 102 pixels down + more if browser is Opera
	'block_top': 102 + winHoffset, 
	// this value places the first block 374 pixels left of the center of the page
	'block_left': winW/2 - 374, 
	// offsets between items of the same level
	'top': 0,
	'left': 107,
	// time in milliseconds before menu is hidden after cursor has gone out
	// of any items
	'hide_delay': 200,
	'expd_delay': 200,
	'css' : {
		'outer': ['m0l0oout', 'm0l0oover'],
		'inner': ['m0l0iout', 'm0l0iover']
	}
},
{
	'height': 23,
	'width': 105,
	'block_top': 25,
	'block_left': 0,
	'top': 25,
	'left': 0,
	'css': {
		'outer' : ['m0l1oout', 'm0l1oover'],
		'inner' : ['m0l1iout', 'm0l1iover']
	}
},
{
	'block_top': 5,
	'block_left': 107,
	'css': {
		'outer': ['m0l2oout', 'm0l2oover'],
		'inner': ['m0l1iout', 'm0l2iover']
	}
}
]
