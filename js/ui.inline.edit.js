/* 
    jfa WYSIWYG editor plugin
    version: 0.1
    author: Joachim Faucon Andersen (http://www.faucon.dk) 
    plugin home: https://github.com/joachimandersen/jfa-wysiwyg-bootstrap
    LICENSE: MIT - see LICENSE.txt
*/

(function($, undefined) {
	'use strict';

	$.widget('ui.inlineedit', {
		_create: function() {
			var self = this;
            this._defineButtonGroups();
			this.element.attr('contenteditable', 'true');
			this._setData('inline:edit:uuid', this._uniqueIdentifier());
			this.element.bind('focus', function() {
				self._getToolbar().show();
			});
            this.element.bind('blur', function(e) {
                setTimeout(
                    function() {
                        self._getToolbar().trigger('inline:edit:focus:lost', []);
                    }, 
                    100);
            });
			this._setData('inline:edit:toolbar', this._getToolbar());
			this.element.bind('mouseup', function(e) {
				self.element.data('inline:edit:toolbar')
					.find('button')
					.trigger(
						'inline:edit:selection:changed', 
						[$(e.target).prop('tagName').toLowerCase()]
					);
			});
			this.element.bind('keyup', function(e) {
				if (e.which == 13) {
					jfa.rangetools.forceParagraf();
				}
			});
            this.element.bind('keyup mouseup', function(e) {
                var eventname;
                if (self.options.isemptyselectioncallback()) {
                    eventname = 'selection:cleared';
                }
                else {
                    eventname = 'selection:set'
                }
                self.element.data('inline:edit:toolbar')
					.find('button')
					.trigger('inline:edit:' + eventname, []);
            });
		},
		_init: function() {

		},
        _defineButtonGroups: function() {
            if (this.buttongroups === undefined) {
                this.buttongroups = [
                    [
                        {
                            title: 'Paragraf', 
                            display: '\u0026lt;p\u0026gt;', 
                            command: function(target) {
                                window.jfa.wysiwyg.commands.replaceTag(target, 'p');
                            }
                        }, 
                        {
                            title: 'Header 2', 
                            display: '\u0026lt;h2\u0026gt;', 
                            command: function(target) {
                                window.jfa.wysiwyg.commands.replaceTag(target, 'h2');
                            }
                        }
                    ],
                    [
                        {
                            title: 'Bold', 
                            icon: 'icon-bold', 
                            tag: 'strong',
                            command: function(target, text) {
                                window.jfa.wysiwyg.commands.toggleTag(target, text, 'strong');
                            },
                        }, 
                        {
                            title: 'Italic', 
                            icon: 'icon-italic', 
                            tag: 'em',
                            command: function(target, text) {
                                window.jfa.wysiwyg.commands.toggleTag(target, text, 'em');
                            }
                        }
                    ],
                    [
                        {title: 'Unordered list', icon: 'icon-list', tag: 'ul', selection: true},
                        {title: 'Ordered list', icon: 'icon-th-list', tag: 'ol', selection: true},
                        {
                            title: 'Indent', 
                            icon: 'icon-indent-left', 
                            command: function(target) {
                                window.jfa.wysiwyg.commands.increaseIndent(target);
                            }
                        },
                        {
                            title: 'Unindent', 
                            icon: 'icon-indent-right', 
                            command: function(target) {
                                window.jfa.wysiwyg.commands.decreaseIndent(target);
                            }
                        }
                    ]
                ];
            }
        },
		_getToolbar: function() {
			if (this.element.data('inline:edit:toolbar') === undefined) {
				var toolbar = $('<div />')
					.attr('data-editor', this.element.data('inline:edit:uuid'))
					.css({
						position: 'absolute',
						top: (this.element.position().top - 50) + 'px',
						left: this.element.position().left + 'px'
					});
				this._addToolbarButtons(toolbar);
				toolbar.hide();
				$('body').append(toolbar);
                toolbar.bind('mouseup', function() {
                    $(this).data('do:not:hide', true);
                });
                toolbar.bind('inline:edit:focus:lost', function() {
                    if (!$(this).data('do:not:hide')) {
                        $(this).hide();
                    }
                });
				return toolbar;
			}
			return this.element.data('inline:edit:toolbar');
		},
		_addToolbarButtons: function(toolbar) {
			var self = this;
			var btntoolbar = $('<div />').addClass('btn-toolbar');
			$.each(this.buttongroups, function(index, buttongroup) {
				var btngroup = $('<div />')
					.addClass('btn-group');
				btntoolbar.append(btngroup);
				$.each(buttongroup, function(i, button) {
					var btn = $('<button />');
					if (button.icon !== undefined) {
						btn.append($('<i />').addClass(button.icon));
					}
					else {
						btn.html(button.display);
					}
					btn
						.attr('title', button.title)
						.data('inline:edit:tag', button.tag)
						.data('inline:edit:command', button.command)
						.addClass('btn');
					btn.click(function() {
						if ($(this).data('inline:edit:command') !== undefined) {
							$(this).data('inline:edit:command')(
                                self.options.getelementatcursorcallback(), 
                                window.jfa.rangetools.getSelectedText()
                            );
						}
						else if ($(this).data('inline:edit:tag') !== undefined) {
							self.options.actioncallback($(this).data('inline:edit:tag'));
							self.element.find(':empty').remove();
							$(this).toggleClass('active');
						}
					});
					btn.bind('inline:edit:selection:changed', function(e, tag) {
						if ($(this).data('inline:edit:tag') !== tag) {
							$(this).removeClass('active');
						}
						else {
							$(this).addClass('active');
						}
					});
                    if (button.selection === true) {
                        btn.bind('inline:edit:selection:cleared', function(e) {
                            $(this).attr('disabled', 'disabled');
                        });
                        btn.bind('inline:edit:selection:set', function(e) {
                            $(this).removeAttr('disabled');
                        });
                    }
					btngroup.append(btn);
				});
			});
			toolbar.append(btntoolbar);
		},
		_setData: function(key, value) {
			this.element.data(key, value);
		},
		_uniqueIdentifier: function() {
	        var S4;
	        S4 = function() {
				return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
	        };
	        return '' + (S4()) + (S4()) + '-' + (S4()) + '-' + (S4()) + '-' + (S4()) + '-' + (S4()) + (S4()) + (S4());
		},
		_destroy: function() {
			$('div[data-editor="' + this.element.data('inline:edit:uuid') + '"]').remove();
			this.element.removeData('inline:edit:toolbar');
			this.element.removeData('inline:edit:uuid');
			this.element.unbind('focus');
			this.element.unbind('mouseup');
            this.element.unbind('keyup');
			this.element.unbind('keypress');
		},
		options: {
			actioncallback: window.jfa.rangetools.applyCommand,
			getelementatcursorcallback: window.jfa.rangetools.getElementAtCursorPosition,
			isemptyselectioncallback: window.jfa.rangetools.isEmpty
		}
	});
})(jQuery);

window.jfa = window.jfa || {};
window.jfa.wysiwyg = window.jfa.wysiwyg || {};
window.jfa.wysiwyg.commands = window.jfa.wysiwyg.commands || {};
(function(commands, $, undefined) {
	'use strict';

    commands.toggleTag = function(target, text, markup) {
        if (text == '') {
            return;
        }
        var tag = $(target);
        if (tag.prop('tagName').toLowerCase() != markup && tag.parents(markup).length == 0) {
            var html = tag.html();
            tag.html(html.replace(text, $('<div />').append($('<' + markup + ' />').html(text)).html()));
        }
        else {
            tag.replaceWith(tag.html());
        }
    };
	commands.replaceTag = function(target, newtag) {
		var tag = $(target);
		if (tag.prop('tagName').toLowerCase() != newtag) {
			var html = tag.html();
			tag.replaceWith($('<' + newtag + ' />').html(html));
		}
	};
	commands.increaseIndent = function(target) {
		var tag = $(target);
		if (tag.prop('tagName').toLowerCase() == 'li') {
			var li = tag;
			var html = li.html();
			var previous = li.prev();
			var ul = $('<ul />').append($('<li />').html(html));
			if (previous.length > 0) {
				previous.append(ul);
				li.remove();
			}
			else {
				li.replaceWith(ul);
			}
		}
	};
	commands.decreaseIndent = function(target) {
		var tag = $(target);
		if (tag.prop('tagName').toLowerCase() == 'li') {
    		if (tag.parent().parent().prop('tagName').toLowerCase() == 'li') { // this li is a nested li
    			var futuresibling = tag.parent().parent();
    			var ul = tag.parent();
    			var li = tag.detach();
    			li.insertAfter(futuresibling);
    			if (ul.find('li').length == 0) {
    				ul.remove();
    			}
    		}
    		else if(tag.parent().parent().prop('tagName').toLowerCase() == 'ul') {
    			tag.unwrap();
    		}
			else if (tag.parent().prop('tagName').toLowerCase() == 'ul') {
    			var html = tag.html();
    			if (tag.index() == 0 && tag.parent().children().length > 1) {
    				tag.parent().before($('<p />').html(html));
    				tag.remove();
    			}
    			else if (tag.parent().children().length > 1) {
    				var index = tag.index();
    				var previousitems = [];
    				$.each(tag.parent().children(), function(key, li) {
    					if (key < index) {
    						previousitems.push($(li));
    					}
    				});
    				var html = tag.html();
    				var newtag = $('<p />').html(html);
    				var nextitems = [];
    				if (index + 1 < tag.parent().children().length) {
    					$.each(tag.parent().children(), function(key, li) {
    						if (key > index) {
    							nextitems.push($(li));
    						}
    					});
    				}
    				tag.parent().replaceWith(newtag);
    				newtag.before($('<ul />').append(previousitems));
    				if (nextitems.length > 0) {
    					newtag.after($('<ul />').append(nextitems))
    				}
    			}
    			else {
    				var html = tag.html();
    				tag.parent().replaceWith($('<p />').html(html));
    			}
    		}
    	}

	};
}(window.jfa.wysiwyg.commands = window.jfa.wysiwyg.commands || {}, jQuery));
