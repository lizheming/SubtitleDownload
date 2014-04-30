(function($) {
	if(!$('li[data-index]')) return false;
	
	function fake_click(obj) {
	    var ev = document.createEvent("MouseEvents");
	    ev.initMouseEvent(
	        "click", true, false, window, 0, 0, 0, 0, 0
	        , false, false, false, false, 0, null
	        );
	    obj.dispatchEvent(ev);
	}

	function export_raw(name, data) {
	    var urlObject = window.URL || window.webkitURL || window;

	    var export_blob = new Blob([data]);

	    var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
	    save_link.href = urlObject.createObjectURL(export_blob);
	    save_link.download = name;
	    fake_click(save_link);
	}

	function parseTime(time) {
		var min = Math.floor(time / 60000);
		var hour = Math.floor(time / 3600000);
		var second = time / 1000 - hour * 3600 - min * 60;
		min = String(min).length < 2 ? '0'+min : String(min);
		hour = String(hour).length < 2 ? '0'+hour : String(hour);
		second = second.toFixed(3);
		second = String(second).length<6 ? '0'+second : String(second);
		second = second.split('.').join(',');
		return hour+':'+min+':'+second; 
	}
	var l = '<a href="#" id="Subtitle_download" style="font-size:0.7em;">Subtitle download</a>';
	$('section h2') && $('section h2').last().append(l);
	$(document).on('click', '#Subtitle_download', function() {
		if($('li[data-index]').length == 0) {
			alert('Apologies, but no subtitles were found.');
			return false;
		}
		
		subtitles = [];		
		$('li[data-index]').each(function(i, subtitle) {
			if(i === $('li[data-index]').length) return false;
            var start = parseTime(parseInt($(subtitle).attr('data-start')));
            var end = i==$('li[data-index]').length-1 ? start : parseTime(parseInt($(subtitle).attr('data-start')));
			subtitles.push($(subtitle).attr('data-index'));
			subtitles.push(start+' --> '+end);
			subtitles.push($(subtitle).text());
			subtitles.push('');
		})
		export_raw($.trim($('ul li.active p').text().split(', current section')[0])+'.srt', subtitles.join('\r\n'));
	}) 
})(jQuery);