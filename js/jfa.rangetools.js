window.jfa = window.jfa || {};
window.jfa.rangetools = window.jfa.rangetools || {};
(function(rangetools, $, undefined) {
    var createList = function(tag, range) {
        var html = $(range.commonAncestorContainer.parentNode).html();
        //range.deleteContents();
        $(range.commonAncestorContainer.parentNode).replaceWith($('<' + tag + '/>').append($('<li />').html(html)));
    };
    rangetools.applyCommand = function(tag) {
        var range = rangetools.getSelection();
        if($(range.commonAncestorContainer.parentNode).prop('tagName').toLowerCase() === tag.toLowerCase()) { // Remove tag
            var html = $(range.commonAncestorContainer.parentNode).html();
            range.deleteContents();
            $(range.commonAncestorContainer.parentNode).replaceWith(html);
            return;
        }
        if (rangetools.isEmpty()) {
            return;
        }
        var lists = ['ul', 'ol'];
        switch(range.commonAncestorContainer.nodeType) {
            case 3:
                if ($.inArray(tag, lists) !== -1) {
                    createList(tag, range);
                    return;
                }
                var node = document.createElement(tag);
                var start = range.startOffset;
                var length = range.endOffset - start;
                var text = range.commonAncestorContainer.data.substr(start, length);
                node.appendChild(document.createTextNode(text));
                range.deleteContents();
                range.insertNode(node);
                break;
        }
    };
    rangetools.forceParagraf = function() {
        var range = rangetools.getSelection();
        if (range.commonAncestorContainer.nodeName == 'DIV') {
            range.selectNode(range.commonAncestorContainer);
            range.deleteContents();
            var node = document.createElement('p');
            var childnode = document.createElement('br');
            node.appendChild(childnode);
            range.insertNode(node);
            range.selectNode(node);
            rangy.getSelection(window).setSingleRange(range);
        }
    };
    rangetools.isEmpty = function() {
        var range = rangetools.getSelection();
        return range.collapsed;
    };
    rangetools.getSelectedText = function() {
		return rangetools.getSelection().text()
	};
    rangetools.getSelection = function() {
        var selection = rangy.getSelection();
        var range = null;
        if (selection.rangeCount > 0) {
            range = selection.getRangeAt(0);
        }
        else {
            range = rangy.createRange();
        }
        return range;
    };
    rangetools.getElementAtCursorPosition = function() {
		rangy.getSelection().expand('word');
        return rangy.getSelection().anchorNode.parentNode;
    };
    rangetools.setTextSelection = function(start, len) {
		rangy.getSelection().removeAllRanges();
		var range = rangetools.getSelection();
		range.moveStart("character", start);
		range.moveEnd("character",len);
		rangy.getSelection().setSingleRange(range);
	};
    rangetools.setSelection = function(selector) {
        var element = $(selector)[0];
        var range = rangy.createRange();
        range.selectNodeContents(element);
        rangy.getSelection().setSingleRange(range);
    };
    rangetools.restoreSelection = function(range) {
        var selection = rangy.getSelection();
        selection.setSingleRange(range);
    };
}(window.jfa.rangetools = window.jfa.rangetools || {}, jQuery));
