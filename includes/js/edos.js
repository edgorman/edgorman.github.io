var maxTabCount = 6;
var tabIndex = 0;

function newTab(path){
  if ($('.nav-tabs li').length < maxTabCount){
    $('.nav-tabs li a').removeClass("active");
    $('.tab-pane').removeClass("active");

    $('<li id=\"t'+tabIndex+'\"><a class="active" data-toggle="tab" href="#p'+tabIndex+'"><div class="spinner-border text-light" style="height: 15px; width: 15px;" role="status"><span class="sr-only">Loading...</span></div><div class="tab-overlay"><div class="tab-close" onclick="closeTab(\''+tabIndex+'\');">&times;</div></div></a></li>').insertBefore('.add');
    $('.tab-content').append("<div class=\"tab-pane active\" id=\"p"+tabIndex+"\"><iframe src=\""+path+"\"></iframe></div>");

    tabIndex++;
  }
  else{
    spawnToast("Error", "You have reached the maximum number of tabs.");
  }
}

function spawnToast(title, message){
  $('.toast-container').append('<div class="toast bg-dark" data-delay="10000"><div class="toast-header bg-dark"><strong class="mr-auto text-light">' + title + '</strong><button type="button text-light" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="toast-body bg-dark">' + message + '</div></div></div>')
  $('.toast').toast('show');
}

function closeTab(id){
  $('#t'+id).remove();
  $('#p'+id).remove();

  // switch focus to next tab
  // var tmp = id;
  // while($('#t'+tmp).length != 1 && tmp >=0){
  //    tmp--;
  // }
  //
  // if(tmp != -1){
  //    alert(tmp);
  //    $('li #t'+tmp).click();
  //    $('li #t'+tmp).addClass("active");
  //    $('.tab-pane #p'+tmp).addClass("active");
  // }
  // else if(){
  //    grab first list element
  // }
}

function setActiveTitle(title){
  var id = $('li a.active').attr('href').substring(2, 3);
  $('li a.active').html(title + "<div class=\"tab-overlay\"><div class=\"tab-close\" onclick=\"closeTab('"+id+"');\">×</div></div>");
}

function redirectActive(path){
  setActiveTitle('<div class="spinner-border text-light" style="height: 15px; width: 15px;" role="status"><span class="sr-only">Loading...</span></div>');
  $('.tab-pane.active').html("<iframe src=\""+path+"\"></iframe>");
}

function closeActive(){
  $('li a.active').parent().remove();
  $('.tab-pane.active').remove();
}
