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
  var id = "toast-" + Math.floor(Math.random() * 10000);

  $('.toast-container').append('<div id="' + id + '" class="toast bg-dark" data-delay="10000"><div class="toast-header bg-dark"><strong class="mr-auto text-light">' + title + '</strong><button type="button text-light" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="toast-body bg-dark">' + message + '</div></div></div>')
  $('.toast').toast('show');

  $('#' + id).on('hidden.bs.toast', function () {
    $(this).remove();
  })
}

function closeTab(id){
  // get index of current tab
  // var index = -1;
  // for (i = 0; i < $('.nav-tabs li').length; i++){
  //   if ($('.nav-tabs li:eq('+i+')').attr('id') == "t"+id){
  //     index = i;
  //     break;
  //   }
  // }

  // remove tab and pane
  $('#t'+id).remove();
  $('#p'+id).remove();

  // if tab following this exists
  // if(tmp != -1){
  //    $('.nav-tabs li a').removeClass("active");
  //    $('.tab-pane').removeClass("active");
  //
  //    $('.nav-tabs li#t'+tmp+' a').addClass("active");
  //    $('.tab-pane#p'+tmp).addClass("active");
  // }
  // else if($('.nav-tabs li').length > 1){
  //   $('.nav-tabs li a').removeClass("active");
  //   $('.tab-pane').removeClass("active");
  //
  //   $('.nav-tabs li:eq(0) a').addClass("active");
  //   $('.tab-pane:eq(0)').addClass("active");
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
