$('.modal-image').each(function(i, obj) {
  obj.innerHTML += "<br><small>" + $(this).children('img').attr('alt') + "</small><div class=\"modal px-0\"><span class=\"close\" onclick=\"$(this).parent().css('display', 'none');\">&times;</span><div class=\"container h-100\"><div class=\"row h-100 d-flex flex-wrap align-items-center\"><div class=\"w-100 h-100 p-5\" style=\"vertical-align: middle;\"><div style=\"background: url(" + $(this).children('img').attr('src') + "); background-repeat: no-repeat; background-size: contain; height: 80%; background-position: center;\"></div><br><small>" + $(this).children('img').attr('alt') + "</small></div></div></div></div>";
});

function load_project(path){
  var json_data;

  // Load config file
  $.ajax({
    url: "/_config.json",
    cache: false,
    async: false,
    // if request successful
    success:function(json) {
      json_data = json;
    }
    // if request failed
    }).fail(function() {
      alert("Error: Failed to retrieve config.json");
      window.stop();
    }
  );

  var segments = path.split(/[\\/]/);
  var file = json_data["directory"]["edgorman"];

  // for each segment
  for (let i=0; i < segments.length; i++){
    file = file[segments[i]];
  }

  // update page data
  document.title = file["_parent"] + "/" + file["_name"];
  //string.replace(/^./, string[0].toUpperCase())
  $('#pagetype').html(segments[segments.length-2].replace(/^./, segments[segments.length-2][0].toUpperCase()));
  $('#dateandtime').html(file["_date"] + " - " + file["_time"]);
  //https://twitter.com/intent/tweet?url={url}&text={title}&via={user_id}&hashtags={hash_tags}
  $('#twitter').attr('href', 'https://twitter.com/intent/tweet?url='+encodeURIComponent(window.location)+'&text='+$('h1.text-center').html());
  //https://www.linkedin.com/sharing/share-offsite/?url={url}
  $('#linkedin').attr('href', 'https://www.linkedin.com/sharing/share-offsite/?url='+encodeURIComponent(window.location));
  //mailto:{email_address}?subject={title}&body={url} {text}
  $('#email').attr('href', 'mailto:?subject='+$('h1.text-center').html()+'&body='+encodeURIComponent(window.location));
}
