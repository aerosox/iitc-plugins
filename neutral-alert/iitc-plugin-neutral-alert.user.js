// ==UserScript==
// @id             iitc-plugin-neutral-alert@agentor
// @name           IITC plugin: Neutral Alert
// @version        0.4.20130601
// @namespace      https://github.com/jonatkins/ingress-intel-total-conversion
// @updateURL      https://github.com/agentor/iitc-plugins/raw/master/neutral-alert/iitc-plugin-neutral-alert.user.js
// @downloadURL    https://github.com/agentor/iitc-plugins/raw/master/neutral-alert/iitc-plugin-neutral-alert.user.js
// @include        https://www.ingress.com/intel*
// @include        http://www.ingress.com/intel*
// @match          https://www.ingress.com/intel*
// @match          http://www.ingress.com/intel*
// ==/UserScript==

function wrapper() {
// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};


// PLUGIN START ////////////////////////////////////////////////////////

// use own namespace for plugin
window.plugin.portalAlertNeutral = function() {};

window.plugin.portalAlertNeutral.portalAdded = function(data) {
    
	var d = data.portal.options.details;
    var portal = data.portal;
   
    var portal_level = getPortalLevel(d).toFixed(2);
    var portal_guid = data.portal.options.guid;
    var portal_guid_html = data.portal.options.guid.replace('.','');
    if(d.portalV2.descriptiveText.ADDRESS) {
	    var portal_address = d.portalV2.descriptiveText.ADDRESS;
       	var tmp = portal_address.split(',');
    	var portal_city = tmp[1];
    } else {
     	portal_city = '';   
    }
   
    if(portal_level == 0 && $('#neutral_'+portal_guid_html).length == 0) {
       navigator.geolocation.getCurrentPosition(function(position){ 
           
            lat1 = position.coords.latitude;
            lat2 = portal._latlng.lat;
            lon1 = position.coords.longitude;
            lon2 = portal._latlng.lng;
            var R = 6371; // km
            var dLat = (lat2-lat1) * Math.PI / 180;
            var dLon = (lon2-lon1) * Math.PI / 180;
            var lat1 = lat1 * Math.PI / 180;
            var lat2 = lat2 * Math.PI / 180;
            
            var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
            var d = R * c;
            $('#neutral_'+portal_guid_html+'_distance').text((Math.round(d * 100) / 100).toString()+' km');
            
        }, function(){
            console.log('neutral alert: geolocation error');
        });   
        
        
    	var portal_title = d.portalV2.descriptiveText.TITLE;
       
        var team = portal.options.team;
        var html ='';
        html += '<tr>';
        html += '<td>L'+ Math.floor(portal_level)+'</td><td>('+portal_level	+')</td>';
        html += '<td><a id="neutral_'+portal_guid_html+'" class="help" title="'+portal_address+'" ';
        html += ' onclick="window.zoomToAndShowPortal(\''+portal_guid+'\', [' + portal._latlng.lat + ', ' + portal._latlng.lng + ']);return false"';
        html += ' href="/intel?latE6=' + portal._latlng.lat*1E6 + '&lngE6=' + portal._latlng.lng*1E6 + '&z=17&pguid='+portal_guid+'"';
        switch (team){
            case 1 :
                html += ' style="color:#0088FF;"';
                break;
            case 2 :
                html += ' style="color:#03DC03;"';
                break;
        }
        html += '>'+portal_title+'</a></td><td>'+portal_city+'</td><td id="neutral_'+portal_guid_html+'_distance"></td></tr>';
        $('#chat div#neutral_portal_alert table').append(html);
       
        window.plugin.portalAlertNeutral.blinkStateNeutral = true;
        window.plugin.portalAlertNeutral.blinkStateNeutral1();
    }
    return false;
}


window.plugin.portalAlertNeutral.blinkStateEnlightened = false;
window.plugin.portalAlertNeutral.blinkStateResistance = false;
window.plugin.portalAlertNeutral.blinkStateNeutral = false;
window.plugin.portalAlertNeutral.km = '';

window.plugin.portalAlertNeutral.blinkStateEnlightened1 = function(data) {
	    $('#chatcontrols a#neutral_portal_alert_control').css('background-color','red').css('color','white');
    	setTimeout("window.plugin.portalAlertNeutral.blinkStateEnlightened2()",500);
}

window.plugin.portalAlertNeutral.blinkStateEnlightened2 = function(data) {
	$('#chatcontrols a#neutral_portal_alert_control').css('background-color','transparent').css('color','#ffce00');
    if(window.plugin.portalAlertNeutral.blinkStateEnlightened === true) {
   	 	setTimeout("window.plugin.portalAlertNeutral.blinkStateEnlightened1()",500);
    }
}
window.plugin.portalAlertNeutral.blinkStateResistance1 = function(data) {
    $('#chatcontrols a#neutral_portal_alert_control').css('background-color','#0088FF').css('color','white');
	setTimeout("window.plugin.portalAlertNeutral.blinkStateResistance2()",500);
}

window.plugin.portalAlertNeutral.blinkStateResistance2 = function(data) {
$('#chatcontrols a#neutral_portal_alert_control').css('background-color','transparent').css('color','#ffce00');
if(window.plugin.portalAlertNeutral.blinkStateResistance === true && window.plugin.portalAlertNeutral.blinkStateEnlightened === false) {
	 	setTimeout("window.plugin.portalAlertNeutral.blinkStateResistance1()",500);
}
}
window.plugin.portalAlertNeutral.blinkStateNeutral1 = function(data) {
    $('#chatcontrols a#neutral_portal_alert_control').css('background-color','grey').css('color','white');
	setTimeout("window.plugin.portalAlertNeutral.blinkStateNeutral2()",500);
}

window.plugin.portalAlertNeutral.blinkStateNeutral2 = function(data) {
$('#chatcontrols a#neutral_portal_alert_control').css('background-color','transparent').css('color','#ffce00');
 	if(window.plugin.portalAlertNeutral.blinkStateNeutral === true) {
	 	setTimeout("window.plugin.portalAlertNeutral.blinkStateNeutral1()",500);
}
}

window.plugin.portalAlertNeutral.portalDataLoaded = function(data) {
  $.each(data.portals, function(ind, portal) {
    if(window.portals[portal[0]]) {
      window.plugin.portalAlertNeutral.portalAdded({portal: window.portals[portal[0]]});
    }
  });
}

window.plugin.portalAlertNeutral.displayAlertBox = function(data) {
    $('#chatcontrols a').removeClass('active');
    $('#chatcontrols a#neutral_portal_alert_control').addClass('active');
    $('#chat div').css('display','none');
	$('#chat div#neutral_portal_alert').css('display','block');   
    
    window.plugin.portalAlertNeutral.blinkStateResistance = false;
    window.plugin.portalAlertNeutral.blinkStateEnlightened = false;
    window.plugin.portalAlertNeutral.blinkStateNeutral = false;
}

var setup =  function() {
  window.addHook('portalAdded', window.plugin.portalAlertNeutral.portalAdded);
  window.addHook('portalDataLoaded', window.plugin.portalAlertNeutral.portalDataLoaded);
  window.COLOR_SELECTED_PORTAL = '#f0f';

  $('#chatcontrols').append(' <a id="neutral_portal_alert_control" onclick="window.plugin.portalAlertNeutral.displayAlertBox()">Neutral Alert</a>');
  $('#chat').append(' <div id="neutral_portal_alert" style="display:none;"><table></table></div>');
 
}

// PLUGIN END //////////////////////////////////////////////////////////

if(window.iitcLoaded && typeof setup === 'function') {
  setup();
} else {
  if(window.bootPlugins)
    window.bootPlugins.push(setup);
  else
    window.bootPlugins = [setup];
}
} // wrapper end
// inject code into site context
var script = document.createElement('script');
script.appendChild(document.createTextNode('('+ wrapper +')();'));
(document.body || document.head || document.documentElement).appendChild(script);
