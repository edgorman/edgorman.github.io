/**
 * @author edgor
 */

document.onkeydown = checkKey;

function checkKey(e) {
    e = e || window.event;
	
    if (e.keyCode == '37') {
        $('.carousel').carousel('prev');
    }
    else if (e.keyCode == '39') {
        $('.carousel').carousel('next');
    }
}