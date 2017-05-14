// ==UserScript==
// @id             iitc-plugin-cellscore-extrapolation@agentor
// @name           IITC plugin: cellscore extrapolation
// @version        0.1.20170513
// @namespace      https://github.com/jonatkins/ingress-intel-total-conversion
// @updateURL      https://github.com/agentor/iitc-plugins/raw/master/cellscore-extrapolation/iitc-plugin-cellscore-extrapolation.user.js
// @downloadURL    https://github.com/agentor/iitc-plugins/raw/master/cellscore-extrapolation/iitc-plugin-cellscore-extrapolation.user.js
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
window.plugin.cellscoreExtrapolation = function() {};


window.plugin.cellscoreExtrapolation.calculate = function(data) {
    console.log('cellscoreExtrapolate: calculate START');
    
    var last_checkpoint = 0;
    var i = 0;
    var enl_last = 0;
    var enl_last_three = 0;
    var res_last = 0;
    var res_last_three = 0;
    
    var enl_sum_current = 0;
    var res_sum_current = 0;
    
    $('.cellscore table.checkpoint_table tbody tr').each(function(index) {
        var cp = $($(this).children('td')[0]).text();
        var enl = $($(this).children('td')[1]).text().replace(/\s/g,'');
        var res = $($(this).children('td')[2]).text().replace(/\s/g,'');
        
        if (last_checkpoint == 0) {
            last_checkpoint = cp/1;
            enl_last = enl/1;
            res_last = res/1;
        }
        
        if (i<3) {
            enl_last_three += enl/1;
            res_last_three += res/1;
        }
        
        enl_sum_current += enl/1;
        res_sum_current += res/1;
        
        i++;
    });
    
    var divider = 3;
    switch (i) {
        case 0:
            divider = 0;
            break;
        case 1:
            divider = 1;
            break;
        case 2:
            divider = 2;
            break;
        default:
            divider = 3;
            break;
    }
    
    enl_last_three = enl_last_three / divider;
    res_last_three = res_last_three / divider;
    
    var missing_checkpoints = 35 - last_checkpoint;
    var res_extrapolation_last = parseInt((res_sum_current + (res_last * missing_checkpoints)) / 35);
    var enl_extrapolation_last = parseInt((enl_sum_current + (enl_last * missing_checkpoints)) / 35);
    
    var res_extrapolation_last_three = parseInt((res_sum_current + (res_last_three * missing_checkpoints)) / 35);
    var enl_extrapolation_last_three = parseInt((enl_sum_current + (enl_last_three * missing_checkpoints)) / 35);
    
    $('.cellscore table.checkpoint_table tbody').prepend('<tr style="color:yellow;"><td>last 3<td>'+enl_extrapolation_last_three+'</td><td>'+res_extrapolation_last_three+'</td><td>extrapolated cellscore</td></tr>');
    $('.cellscore table.checkpoint_table tbody').prepend('<tr style="color:yellow;"><td>last<td>'+enl_extrapolation_last+'</td><td>'+res_extrapolation_last+'</td><td>extrapolated cellscore</td></tr>');
};

var setup =  function() {
    //if (window.plugin.regions) {
        $('#toolbox').append('<a onclick="window.plugin.cellscoreExtrapolation.calculate();return false;">extrapolate cellscore</a>');
    //}
};

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
