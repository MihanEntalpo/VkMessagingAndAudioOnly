// ==UserScript==
// @name        vk.com only messaging
// @namespace   mihanentalpo.me
// @description Allow to use messaging only on vk.com
// @include     https://vk.com/*
// @match       https://vk.com/*
// @match       http://vk.com/*
// @version     1
// @grant       none
// @require https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// ==/UserScript==

/**
* Функция, возвращающая временные переделы работы 
*/
function get_time_limits()
{
  return {
    // Со скольки начинать блокировать отвлекающий функционал
    from: "9:30",
    // До скольки блокировать отвлекающий функционал
    to: "18:30"
  };
}

/**
* Проверить, должена ли сейчас быть активной блокировка? 
*/
function is_active(){

  d = Date.now();  
  var d1 = new Date(d);
  var d2 = new Date(d);
  
  var limits = get_time_limits();
  
  d1.setHours(limits.from.split(":")[0]);
  d1.setMinutes(limits.from.split(":")[1]);
  
  d2.setHours(limits.to.split(":")[0]);
  d2.setMinutes(limits.to.split(":")[1]);
  
  return (d2 > d && d1 < d);  

}

global_vkscript_is_active = false;

/**
* Попытаться активировать или деактивировать
*/
function tryToActivate()
{  
  jQuery("#ads_left").remove();
  if (!global_vkscript_is_active && is_active())
  {  
    global_vkscript_is_active = true;
    jQuery('#side_bar li').each(function (index, element) {  
      text = jQuery(element).find('span.left_label.inl_bl').text();
      console.log("text:", text, "inArray:", jQuery.inArray(text, ["Мои Сообщения", "Мои Аудиозаписи"]));
      if (-1 == jQuery.inArray(text, ["Сообщения", "Аудиозаписи"]))
      {
        jQuery(element).remove();
      }
    });

    jQuery('.more_div').remove();
    jQuery('body').append('<div style=\'position:fixed;left:10px;top:50px;z-index:1000; background:white; padding:4px; border:1px solid grey\' id=\'url-box\'>URL:</div>')

    function every_page_remove()
    {
      jQuery('.left_box.attention').remove();  
    }

    function detect_move_out(url)
    {
      var regtxt = "^https://(new\.)?vk.com/(im|audio|away|share|login)";
      var regexp = new RegExp(regtxt);
      if (!regexp.test(url))
      {
        //alert("new url:`" + url + "` doesn't match regexp:`" + regtxt + "`")
        //alert("Bad url! Will redirect!");
        window.location.href = "https://new.vk.com/im";
      }
    }

    global_current_href = '';
    function update_url(url)
    {
      if (global_current_href != url)
      {
        jQuery('#url-box').text('URL:' + url);
        detect_move_out(url);
        every_page_remove();
        global_current_href = url;
      }
    }

    update_url(window.location.href);

    setInterval(function(){
      update_url(window.location.href);
    }, 1000);

  }
  else if(global_vkscript_is_active && !is_active())
  {
     window.location.reload();
  }

}

/**
* Проверять активацию каждые 2 секунды
*/
setInterval(tryToActivate, 2000);



