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
    else if (e.keyCode == '38') {
    	e.preventDefault();
    	sections = $('.section');
    	
    	for (i = sections.length - 1; i >= 0; i--){
    		var top = sections[i].getBoundingClientRect().top;
    		if(top < 0){
    			window.scrollBy(0, top);
    			break;
    		}
    	}
    }
    else if (e.keyCode == '40') {
    	e.preventDefault();
    	sections = $('.section');
    	
    	for (i = 0; i < sections.length; i++){
    		var top = sections[i].getBoundingClientRect().top;
    		if(top > 0){
    			window.scrollBy(0, top);
    			break;
    		}
    	}
    }
}

function sendEmail(form){
	console.log(document.getElementById('contact-email').value);
	console.log(document.getElementById('contact-type').value);
	console.log(document.getElementById('contact-msg').value);
}
