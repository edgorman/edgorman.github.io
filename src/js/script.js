/**
 * @author edgorman
 */

document.onkeydown = checkKey;
function checkKey(e) {
    e = e || window.event;
	
    if (e.keyCode == '37') {				// left arrow key
        $('.carousel').carousel('prev');
    }
    else if (e.keyCode == '39') {			// right arrow key	
        $('.carousel').carousel('next');
    }
    else if (e.keyCode == '38') {			// up arrow key
    	e.preventDefault();
    	sections = $('.section');
    	
    	for (i = sections.length - 1; i >= 0; i--){
    		var top = sections[i].getBoundingClientRect().top;
    		if(top < -1){
    			window.scrollBy(0, top);
    			break;
    		}
    	}
    }
    else if (e.keyCode == '40') {			// down arrow key
    	e.preventDefault();
    	sections = $('.section');
    	
    	for(i = 0; i < sections.length; i++){
    		var top = sections[i].getBoundingClientRect().top;
    		if(top > 1){
    			var bottom = sections[i - 1].getBoundingClientRect().bottom;
    			
    			if(top > window.innerHeight) window.scrollBy(0, bottom - window.innerHeight);
    			else window.scrollBy(0, top);
    			
    			break;
    		}
    	}
    	
    }
}

function sendEmail(form){
	
	var validEmail = true;
	var errorReasons = [];
	
	var emailInput = document.getElementById('contact-email').childNodes;
	var emailType = document.getElementById('contact-type').childNodes;
	var emailMsg = document.getElementById('contact-msg').childNodes;
	
	//check email address
	if(emailInput[3].value.length == 0){
		validEmail = false;
		emailInput[1].style.color = "red";
		errorReasons.push("No email address entered.");
	}
	else if(!emailInput[3].value.includes("@")){
		validEmail = false;
		emailInput[1].style.color = "red";
		errorReasons.push("Not a valid email address.");
	}
	
	//check email message
	if(emailMsg[3].value.length == 0){
		validEmail = false;
		emailMsg[1].style.color = "red";
		errorReasons.push("No message entered.");
	}
	
	if(validEmail){
		$('.email').removeClass("progres");
		$('.email').addClass("success");
		
		$('#contact-email input').prop('disabled', true);
		$('#contact-type select').prop('disabled', true);
		$('#contact-msg textarea').prop('disabled', true);
		
		$('#contact-submit').removeClass('btn-dark');
		$('#contact-submit').addClass('btn-success');
		$('#contact-submit').html("Email Sent!");
		$('#contact-submit').prop('disabled', true);
		
		$('#emailSuccess').toast('show');
		return true;
	}
	else{
		errorMsg = "";
		for(i = 0; i < errorReasons.length; i++)
			errorMsg += "<li>" + errorReasons[i] + "</li>";
		$('#emailErrorReason').html(errorMsg);
		
		$('#emailError').toast('show');
		return false;
	}
}

function toggleHell(){
	if($('#contact-type select')[0].length == 2){
		$('#contact-type select').append($('<option>', { text: 'Website Suggestion' }));
	}
	
	if(!$('.hell').hasClass('show')){
		setTimeout(function(){window.scrollTo(0, document.getElementById('hell').offsetTop);}, 50);
	}
	else{
		window.scrollTo(0, document.getElementById('hell').offsetTop - window.innerHeight);
	}
}
