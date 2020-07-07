function path_to_url(path){
  // if starts with /, remove it
  if (path.startsWith("/")){
    path = path.substring(1, path.length);
  }

  // if starts with ed/, remove it
  if (path.startsWith("ed")){
    path = path.substring(2, path.length);
  }

  return path;
}

function path_exists(path, from_dir, file_flag){
  if (path == undefined){
    return false;
  }

  let segments = path.split(/[\\/]/);
  let temp_directory = from_dir;

  // for each segment
  for (let i=0; i < segments.length; i++){
    var seg = segments[i];

    if (seg == "" || seg == "."){									// self
      continue;
    }
    else if (seg == '..'){												// parent dir
      if (temp_directory["_parent"] != ""){
        temp_directory = path_exists(temp_directory["_parent"], file_system, file_flag);
      }
    }
    else if (temp_directory[seg] != null){				// child
      if (temp_directory[seg]["_type"] == "dir" || file_flag){
        temp_directory = temp_directory[seg];
      }
      else{
        return false;
      }
    }
    else{																					// n/a
      return false;
    }
  }
  return temp_directory;
}

function ask_question(question, format, callback){
  terminal.push(function(input){
    if (new RegExp(format).test(input)){
      terminal.pop();
      callback(input);
    }
  }, {
      prompt: question + ' '
  });
}

function send_email(result){
  if (result["confirm"] == "y"){
    $.ajax({
      url: "https://usebasin.com/f/441f945eb655.json",
      method: "POST",
      data: {message: result["message"], email: result["email"]},
      dataType: "json",
      success: function(){
        alert("Email sent successfully.");
      }
    }).fail(function() {
      alert("Error: Email not sent.")
    });
  }
}

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

  $('.toast-container').append('<div id="' + id + '" class="toast bg-dark" data-delay="5000"><div class="toast-header bg-dark"><strong class="mr-auto text-light">' + title + '</strong><button type="button text-light" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="toast-body bg-dark">' + message + '</div></div></div>')
  $('.toast').toast('show');

  $('#' + id).on('hidden.bs.toast', function () {
    $(this).remove();
  })
}

function closeTab(id){
  // get index of current tab
  var index = -1;
  for (i = 0; i < $('.nav-tabs li').length; i++){
    if ($('.nav-tabs li:eq('+i+')').attr('id') == "t"+id){
      index = i;
      break;
    }
  }

  // remove tab and pane
  $('#t'+id).remove();
  $('#p'+id).remove();

  // find next tab to become active
  index--;
  if (index >= 0){
    $('.nav-tabs li a').removeClass("active");
    $('.tab-pane').removeClass("active");

    $('.nav-tabs li:eq('+index+') a').addClass('active');
    $('.tab-pane:eq('+index+')').addClass('active');
  }

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
  var id = $('.tab-pane.active').attr('id').substring(1,2);
  closeTab(id);
}
