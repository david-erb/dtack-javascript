// thanks for this to http://jsfiddle.net/gabrieleromanato/JShpZ/
// apparently http://gabrieleromanato.name/
// slight modifications  
var romanato_autogrow_alert_count = 0;
            
(function($) {
    $.fn.romanato_autogrow = function() {
        return this.each(function() {
            var textarea = this;
            $.fn.romanato_autogrow.resize(textarea);
            $(textarea).focus(function() {
                textarea.interval = setInterval(function() {
                    $.fn.romanato_autogrow.resize(textarea);
                }, 200);
            }).blur(function() {
                clearInterval(textarea.interval);
            });
        });
    };
    $.fn.romanato_autogrow.resize = function(textarea) {      
        var lineHeight = parseFloat($(textarea).css('line-height'));
        if (isNaN(lineHeight))
          lineHeight = 18;
        var lines = textarea.value.split('\n');
        lineCount = lines.length;
        var height = lineHeight * (lineCount);

//        if (romanato_autogrow_alert_count++ < 1)
//        alert(
//          "lineHeight: " + lineHeight + "\n" +
//          "lineCount: " + lineCount + "\n" +
//          "height: " + height);

        $(textarea).css('height', height);
    };
    $.fn.romanato_autogrow.resize_ORIGINAL = function(textarea) {      
        var lineHeight = parseInt($(textarea).css('line-height'), 10);
        var lines = textarea.value.split('\n');
        var columns = textarea.cols;
        var lineCount = 0;
        $.each(lines, function() {
            lineCount += Math.ceil(this.length / columns) || 1;
        });                                                                  
        var height = lineHeight * (lineCount + 1);
        $(textarea).css('height', height);
    };
})(jQuery);