window.jfa = window.jfa || {};
window.jfa.rangetools = window.jfa.rangetools || {};
(function(rangetools, $, undefined) {
    var createList = function(tag, range) {
        var html = $(range.commonAncestorContainer.parentNode).html();
        //range.deleteContents();
        $(range.commonAncestorContainer.parentNode).replaceWith($('<' + tag + '/>').append($('<li />').html(html)));
    };
    rangetools.applyCommand = function(tag) {
        var range = rangetools.getSelection(range);
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
        return rangy.getSelection().anchorNode.parentNode;
    };
    rangetools.setSelection = function(selector) {
        var element = $(selector)[0];
        var range;
        var selection;
        if (document.body.createTextRange) { //ms
            range = document.body.createTextRange();
            range.moveToElementText(element);
            range.select();
        }
        else if (window.getSelection) { //all others
            selection = window.getSelection();        
            range = document.createRange();
            range.selectNodeContents(element);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    };
    rangetools.restoreSelection = function(range) {
        var selection = rangy.getSelection();
        selection.setSingleRange(range);
    };
}(window.jfa.rangetools = window.jfa.rangetools || {}, jQuery));