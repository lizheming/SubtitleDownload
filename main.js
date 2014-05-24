(function($) {
	window.location.host == "class.coursera.org" && $('.course-item-list-section-list li').map(function(){return $('a:last', $(this)).get(0)}).each(function(i,item){
		var chinese = this.href.replace('download.mp4?lecture_id', 'subtitles?q');
		chinese += '_zh&format=srt';
		$.ajax({type:"HEAD", url:chinese, complete:function(xhr,data) {
			if(xhr.status != 200) {
				chinese = chinese.replace('_zh&', '_zh-cn&');
				$.ajax({type:"HEAD", url:chinese, complete:function(xhr,data) {
					if(xhr.status != 200) return false;
					$(item).before('<a target="_new" href="'+chinese+'" title="中文字幕下载">中</a>');
				}})
			} else $(item).before('<a target="_new" href="'+chinese+'" title="中文字幕下载">中</a>');
		}})
	})

	/** edX **/
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
		$('li[data-index]').each(function() {
			var start = parseTime($(this).attr('data-start'));
			var end = parseTime( $(this).next().attr('data-start') ? $(this).next().attr('data-start') : +$(this).attr('data-start')+1000 );
			subtitles.push($(this).attr('data-index'));
			subtitles.push(start+' --> '+end);
			subtitles.push($(this).text());
			subtitles.push('');
		})
		export_raw($.trim($('ul li.active p').text().split(', current section')[0])+'.srt', subtitles.join('\r\n'));
	}) 
})(jQuery);