function load_project(path){
  // if path contains index.html, remove
  path = path.replace("index.html", "");

  // if path starts with /, remove
  if (path.startsWith("/")){
    path = path.substring(1, path.length);
  }

  // if path ends with /, remove
  if (path.endsWith("/")){
    path = path.substring(0, path.length-1);
  }

  // get config file at given path
  var config_data;

  $.ajax({
    url: "/" + path + "/contents.json",
    cache: false,
    async: false,
    success:function(data) {
      config_data = data;
    }
  });

  // if request failed, return
  if (config_data == null){
    console.log("Error: Configuration file not found")
    return
  }

  // update pageheader
  if (config_data['headimg'] != null){
    $('#pageheader').html("<img class=\"img-fluid w-100\" src=\"" + config_data['headimg'] + "\"/><div class=\"header-cover\"></div>");
  }

  // update title
  if (self == top){
    document.title = config_data['title'];
  }
  else{
    parent.setActiveTitle('Post Viewer - ' + config_data['title']);
  }

  // update pagetitle
  $('#pagetitle').html(config_data['title']);

  // update pagedate
  $('#pagetimestamp').html(config_data['date'] + " - " + config_data['time'])

  // update pagetype
  $('#pagetype').html(config_data['type'])

  // update pagelinks
  var sub = encodeURIComponent(config_data['title'] + " - Edward Gorman");
  var url = encodeURIComponent(window.location);
  for (key in config_data['links']){
    switch(config_data['links'][key]) {
      case "email":
        $('#pagelinks').append("<a class=\"ml-1\" href=\"mailto:?subject=" + sub + "&body=" + url + "\"><i class=\"fas fa-envelope-square\"></i></a>");
        break;
      case "twitter":
        $('#pagelinks').append("<a class=\"ml-1\" href=\"https://twitter.com/intent/tweet?url=" + url + "&text=" + sub + "\"><i class=\"fab fa-twitter-square\"></i></a>");
        break;
      case "linkedin":
        $('#pagelinks').append("<a class=\"ml-1\" href=\"https://www.linkedin.com/sharing/share-offsite/?url=" + url + "\"><i class=\"fab fa-linkedin\"></i></a>");
        break;
      default:
        console.log("Error: Page link not indentified: " + key);
    }
  }

  // update pagecontent
  $('#pagecontent').html("");
  for (index in config_data['content']){
    var line = config_data['content'][index];
    var key = line.substring(0, 1);
    var con = line.substring(2, line.length);

    switch(key) {
      case "p": // paragraph
        $('#pagecontent').append("<p>" + con + "</p>");
        break;
      case "b": // bold
        $('#pagecontent').append("<b>" + con + "</p>");
        break;
      case "q": // quote
        var name = con.split("~")[0];
        var quote = con.split("~")[1];
        $('#pagecontent').append("<blockquote class=\"blockquote m-5\"><p>" + quote + "</p><small class=\"blockquote-footer\">" + name + "</small></blockquote>");
        break;
      case "i": // image
        var src = con.split("~")[0];
        var capt = con.split("~")[1];
        $('#pagecontent').append("<div class=\"modal-image text-center mt-3 mb-3\"><img alt=\"" + capt + "\" src=\"" + src + "\" onclick=\"$(this).siblings('.modal').css('display', 'block');\" style=\"cursor: pointer; width: 100%;\"><small>" + capt + "</small><div class=\"modal px-0\"><span class=\"close\" onclick=\"$(this).parent().css('display', 'none');\">&times;</span><div class=\"container h-100\"><div class=\"row h-100 d-flex flex-wrap align-items-center\"><div class=\"w-100 h-100 p-5\" style=\"vertical-align: middle;\"><div style=\"background: url(" + src + "); background-repeat: no-repeat; background-size: contain; height: 80%;background-position: center;\"></div><br><small>" + capt + "</small></div></div></div></div></div>");
        break;
      default:
        console.log("Error: Page content not identified: " + key);
    }
  }

  // update pagereferences
  if (config_data['refs'].length > 0){
    $('#pagereferences').append("<p class=\"mb-1\"><b>References</b></p>");
  }

  for (index in config_data['refs']){
    var ref = config_data['refs'][index];
    var name = ref.split("~")[0];
    var link = ref.split("~")[1];

    $('#pagereferences').append("<li>" + name + " - <a href=\"" + link + "\" target=\"_blank\">" + link + "</a></li>");
  }
}
