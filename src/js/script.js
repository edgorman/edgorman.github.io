/**
 * @author edgorman
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
    		if(top < -1){
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
    		if(top > 1){
    			window.scrollBy(0, top);
    			break;
    		}
    	}
    }
}

function sendEmail(form){
	
	var validEmail = true;
	var errorReasons = [];
	
	var emailInput = document.getElementById('contact-email').value;
	var emailType = document.getElementById('contact-type').value;
	var emailMsg = document.getElementById('contact-msg').value;
	
	//check email address
	if(emailInput.length == 0){
		validEmail = false;
		errorReasons.push("No email address entered.");
	}
	else if(!emailInput.includes("@")){
		validEmail = false;
		errorReasons.push("Not a valid email address.");
	}
	
	//check email message
	if(emailMsg.length == 0){
		validEmail = false;
		errorReasons.push("No message for email entered.");
	}
	
	if(validEmail){
		$('.email').removeClass("progres");
		$('.email').addClass("success");
		
		$('#contact-email').prop('disabled', true);
		$('#contact-type').prop('disabled', true);
		$('#contact-msg').prop('disabled', true);
		$('#contact-submit').prop('disabled', true);
		
		$('#emailSuccess').toast('show');
		//show success notification
	}
	else{
		errorMsg = "";
		for(i = 0; i < errorReasons.length; i++)
			errorMsg += "<li>" + errorReasons[i] + "</li>";
		$('#emailErrorReason').html(errorMsg);
		
		$('#emailError').toast('show');
		//show error notification
	}
}

function toggleHell(){
	if($('#contact-type')[0].length == 2){
		$('#contact-type').append($('<option>', { value: 'Website Suggsetion', text: 'Website Suggestion' }));
	}
	
	if(!$('.hell').hasClass('show')){
		setTimeout(function(){window.scrollTo(0, document.getElementById('hell').offsetTop);}, 50);
	}
	else{
		window.scrollTo(0, document.getElementById('hell').offsetTop - window.innerHeight);
	}
}
