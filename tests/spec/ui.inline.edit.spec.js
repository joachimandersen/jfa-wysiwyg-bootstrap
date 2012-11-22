describe('$.ui.inlineedit', function() {

    var html;
    beforeEach(function() {
        html = $('.testarea').html();
        $('.testarea').inlineedit({
        });
    });
    afterEach(function() {
        $('.testarea').html(html);
    });
 
    describe('Initializing the in line editing on an area', function() {
        afterEach(function() {
            $('.testarea').inlineedit('destroy');
        });
        it('should have the contenteditable attribute set to true', function() {
            expect($('.testarea').attr('contenteditable')).toEqual('true');
        });
        it('should add a unique id to the containers data', function() {
            expect($('.testarea').data('inline:edit:uuid')).not.toBeUndefined();
        });
        it('should create a toolbar with a reference to the containers id which is hidden', function(){
            expect($('.testarea').data('inline:edit:toolbar')).not.toBeUndefined();
            expect($('div[data-editor="' + $('.testarea').data('inline:edit:uuid') + '"]').css('display')).toEqual('none');
        });
        it('should position the toolbar above the area', function(){
            expect($('div[data-editor="' + $('.testarea').data('inline:edit:uuid') + '"]').css('position')).toEqual('absolute');
            expect($('div[data-editor="' + $('.testarea').data('inline:edit:uuid') + '"]').css('top')).toEqual(($('.testarea').position().top - 50) + 'px');
            expect($('div[data-editor="' + $('.testarea').data('inline:edit:uuid') + '"]').css('left')).toEqual($('.testarea').position().left + 'px');
        });
        it('should add a bold toggle button the the toolbar', function() {
            var toolbar = $('div[data-editor="' + $('.testarea').data('inline:edit:uuid') + '"]');
            expect(toolbar.find('button:eq(2)').attr('title')).toEqual('Bold');
            expect(toolbar.find('button:eq(2)').children('i.icon-bold').length).toEqual(1);
        });
    });


    describe('Giving focus to the area', function() {
        beforeEach(function() {
            $('.testarea').focus();
        });

        afterEach(function() {
            $('.testarea').inlineedit('destroy');
        });
        it('should add and display the toolbar', function() {
            expect($('div[data-editor="' + $('.testarea').data('inline:edit:uuid') + '"]').css('display')).toEqual('block');
            expect($('div[data-editor="' + $('.testarea').data('inline:edit:uuid') + '"]').length).toEqual(1);
        });
    });

    describe('Calling destroy', function() {
        beforeEach(function() {
            $('.testarea').focus();
        });

        afterEach(function() {
        });
        it('should remove the data attributes and remove the toolbar from the dom', function() {
            var id = $('.testarea').data('inline:edit:uuid');
            expect($('div[data-editor="' + id + '"]').length).toEqual(1);
            $('.testarea').inlineedit('destroy');
            expect($('.testarea').data('inlineedit')).toBeUndefined();
            expect($('div[data-editor="' + id + '"]').length).toEqual(0);
        });
    });

    describe('Clicking the bold button', function() {
        beforeEach(function() {
            $('.testarea').show();
            $('.testarea').focus();
        });

        afterEach(function() {
            $('.testarea').hide();
            $('.testarea').inlineedit('destroy');
        });

        it('should add a strong tag surrounding the selected text', function() {
            jfa.rangetools.setSelection('p');
            var id = $('.testarea').data('inline:edit:uuid');
            $('div[data-editor="' + id + '"]').find('button[title="Bold"]').click();
            expect($('.testarea p').html().trim()).toEqual('<strong>This is a paragraf</strong>')
        });
        it('should toggle the bold button', function() {
            jfa.rangetools.setSelection('p');
            var id = $('.testarea').data('inline:edit:uuid');
            $('div[data-editor="' + id + '"]').find('button[title="Bold"]').click();
            expect($('div[data-editor="' + id + '"]').find('button[title="Bold"]').hasClass('active')).toEqual(true);
            $('div[data-editor="' + id + '"]').find('button[title="Bold"]').click();
            expect($('div[data-editor="' + id + '"]').find('button[title="Bold"]').hasClass('active')).toEqual(false);
        });
    });

    describe('Clicking the bold button while it is toggled', function() {
        beforeEach(function() {
            $('.testarea').show();
            $('.testarea').focus();
            jfa.rangetools.setSelection('p');
            var id = $('.testarea').data('inline:edit:uuid');
            $('div[data-editor="' + id + '"]').find('button[title="Bold"]').click();
        });

        afterEach(function() {
            $('.testarea').hide();
            $('.testarea').inlineedit('destroy');
        });

        it('should remove the strong tag', function() {
            jfa.rangetools.setSelection('p');
            var id = $('.testarea').data('inline:edit:uuid');
            $('div[data-editor="' + id + '"]').find('button[title="Bold"]').click();
            expect($('.testarea p').html().trim()).toEqual('This is a paragraf')
        });
    });

    describe('Placing the cursor inside a bold area', function() {
        beforeEach(function() {
            $('.testarea').show();
            $('.testarea').focus();
            $('.testarea p').replaceWith('<p>This is a <strong>paragraf</strong></p>')
        });

        afterEach(function() {
            $('.testarea').hide();
            $('.testarea').inlineedit('destroy');
        });
        it('should toogle the bold button to indicate that the a press will remove the bold', function() {
            jfa.rangetools.setSelection('p');
            var id = $('.testarea').data('inline:edit:uuid');
            $($('.testarea strong')).trigger('mouseup');
            expect($('div[data-editor="' + id + '"]').find('button[title="Bold"]').hasClass('active')).toBe(true);
        });
    });

    describe('Pressing enter to exit current tag', function() {
        beforeEach(function() {
            $('.testarea').show();
            $('.testarea').focus();
        });

        afterEach(function() {
            $('.testarea').hide();
        });

        it('should create a new paragraf', function() {
            $('.testarea :last-child').simulate('keydown', { keyCode: $.ui.keyCode.ENTER } );
            $('.testarea :last-child').simulate('keypress', { keyCode: $.ui.keyCode.ENTER } );
            $('.testarea :last-child').simulate('keyup', { keyCode: $.ui.keyCode.ENTER } );
            expect($('.testarea').length).toEqual(0);
            expect($('p').length).toEqual(1);
            $('p').replaceWith($('<div />').addClass('testarea'));
        });
    });

    describe('If a click on bold creates an empty tag it', function() {
        beforeEach(function() {
            $('.testarea').show();
            $('.testarea').focus();
        });

        afterEach(function() {
            $('.testarea').hide();
            $('.testarea').inlineedit('destroy');
        });
        it('should be cleaned up imediately after', function() {
            var id = $('.testarea').data('inline:edit:uuid');
            $('div[data-editor="' + id + '"]').find('button[title="Bold"]').click();
            expect($('.testarea strong:empty').length).toEqual(0);
        });
    });

    describe('A click on the indent button when the cursor is placed inside the ul, not first li,', function() {
        beforeEach(function() {
            $('.testarea').show();
            $('.testarea').focus();
        });

        afterEach(function() {
            $('.testarea').hide();
            $('.testarea').inlineedit('destroy');
        });
        it('should add the li as a child to the previous li', function() {
            jfa.rangetools.setSelection('.testarea ul:first > li:last');
            var id = $('.testarea').data('inline:edit:uuid');
            $('div[data-editor="' + id + '"]').find('button[title="Indent"]').click();
            expect($('.testarea ul:first > li:last').html()).toEqual('list item 2<ul><li>list item 3</li></ul>');
        });
    });

    describe('A click on the unindent button when the cursor is placed inside a nested ul with only one li', function() {
        beforeEach(function() {
            $('.testarea').show();
            $('.testarea').focus();
        });

        afterEach(function() {
            $('.testarea').hide();
            $('.testarea').inlineedit('destroy');
        });
        it('should add the li as a sibling to the parent li and remove the nested ul', function() {
            jfa.rangetools.setSelection('.testarea ul:first > li:last');
            var id = $('.testarea').data('inline:edit:uuid');
            expect($('.testarea ul:first > li').length).toEqual(3);
            $('div[data-editor="' + id + '"]').find('button[title="Indent"]').click();
            expect($('.testarea ul:first > li').length).toEqual(2);
            expect($('.testarea ul > li > ul > li').length).toEqual(1);
            jfa.rangetools.setSelection('.testarea ul > li > ul > li');
            $('div[data-editor="' + id + '"]').find('button[title="Unindent"]').click();
            expect($('.testarea ul:first > li').length).toEqual(3);
            expect($('.testarea ul > li > ul > li').length).toEqual(0);
        });
    });

    describe('A click on the unindent button when the cursor is placed inside a nested ul with more than one li', function() {
        beforeEach(function() {
            $('.testarea').show();
            $('.testarea').focus();
        });

        afterEach(function() {
            $('.testarea').hide();
            $('.testarea').inlineedit('destroy');
        });
        it('should add the li as a sibling to the parent li and preserve the nested ul', function() {
            jfa.rangetools.setSelection('.testarea ul:first > li:last');
            var id = $('.testarea').data('inline:edit:uuid');
            expect($('.testarea ul:first > li').length).toEqual(3);
            $('div[data-editor="' + id + '"]').find('button[title="Indent"]').click();
            expect($('.testarea ul:first > li').length).toEqual(2);
            expect($('.testarea ul > li > ul > li').length).toEqual(1);
            $('.testarea ul > li > ul > li').after($('<li />').html('list item 3.1'))
            expect($('.testarea ul > li > ul > li').length).toEqual(2);
            jfa.rangetools.setSelection('.testarea ul > li > ul > li');
            $('div[data-editor="' + id + '"]').find('button[title="Unindent"]').click();
            expect($('.testarea ul:first > li').length).toEqual(3);
            expect($('.testarea ul > li > ul > li').length).toEqual(1);
        });
    });

    describe('A click on the unordered list button when the cursor is placed ie in a p and with an empty selection', function() {
        beforeEach(function() {
            $('.testarea').show();
            $('.testarea').focus();
        });

        afterEach(function() {
            $('.testarea').hide();
            $('.testarea').inlineedit('destroy');
        });
        it('should add an empty ul', function() {
            $('.testarea').append($('<p />').html('&nbsp;'));
            jfa.rangetools.setSelection('.testarea p:last');
            var id = $('.testarea').data('inline:edit:uuid');
            $('div[data-editor="' + id + '"]').find('button[title="Unordered list"]').click();
            expect($('.testarea ul').length).toEqual(2);
            expect($('.testarea p').length).toEqual(1);
        });
    });

    describe('A click on the un indent button in an indented list with only one li', function() {
        beforeEach(function() {
            $('.testarea').show();
            $('.testarea').focus();
        });

        afterEach(function() {
            $('.testarea').hide();
            $('.testarea').inlineedit('destroy');
        });
        it('should should un indent the li', function() {
            $('.testarea').append($('<ul />').append($('<ul />').append($('<li />').html('item'))));
            jfa.rangetools.setSelection('.testarea > ul:last li');
            var id = $('.testarea').data('inline:edit:uuid');
            $('div[data-editor="' + id + '"]').find('button[title="Unindent"]').click();
            expect($('<div />').append($('.testarea > ul:last')).html()).toEqual('<ul><li>item</li></ul>');
        });        
    });

    describe('A click on the un indent button in a list with only one li', function() {
        beforeEach(function() {
            $('.testarea').show();
            $('.testarea').focus();
        });

        afterEach(function() {
            $('.testarea').hide();
            $('.testarea').inlineedit('destroy');
        });
        it('should un indent the li', function() {
            $('.testarea').append($('<ul />').append($('<li />').html('item')));
            jfa.rangetools.setSelection('.testarea > ul:last > li');
            var id = $('.testarea').data('inline:edit:uuid');
            $('div[data-editor="' + id + '"]').find('button[title="Unindent"]').click();
            expect($('<div />').append($('.testarea > p:last')).html()).toEqual('<p>item</p>');
        });        
    });

    describe('A click on the un indent button on the first item in a list with two lis', function() {
        beforeEach(function() {
            $('.testarea').show();
            $('.testarea').focus();
        });

        afterEach(function() {
            $('.testarea').hide();
            $('.testarea').inlineedit('destroy');
        });
        it('should detach the li from the list leaving the second li intact', function() {
            $('.testarea').append($('<ul />').append($('<li />').html('item 1')).append($('<li />').html('item 2')));
            jfa.rangetools.setSelection('.testarea > ul:last > li');
            var id = $('.testarea').data('inline:edit:uuid');
            $('div[data-editor="' + id + '"]').find('button[title="Unindent"]').click();
            expect($('<div />').append($('.testarea > p:last')).html()).toEqual('<p>item 1</p>');
            expect($('<div />').append($('.testarea > ul:last')).html()).toEqual('<ul><li>item 2</li></ul>');
        });        
    });

    describe('A click on the un indent button on the second item in a list with three lis', function() {
        beforeEach(function() {
            $('.testarea').show();
            $('.testarea').focus();
        });

        afterEach(function() {
            $('.testarea').hide();
            $('.testarea').inlineedit('destroy');
        });
        it('should detach the li from the list leaving the first and third li as two separate lists', function() {
            jfa.rangetools.setSelection('.testarea > ul > li:eq(1)');
            var id = $('.testarea').data('inline:edit:uuid');
            $('div[data-editor="' + id + '"]').find('button[title="Unindent"]').click();
            expect($('<div />').append($('.testarea > ul:first')).html()).toEqual('<ul><li>list item 1</li></ul>');
            expect($('<div />').append($('.testarea > p:last')).html()).toEqual('<p>list item 2</p>');
            expect($('<div />').append($('.testarea > ul:last')).html()).toEqual('<ul><li>list item 3</li></ul>');
        });        
    });

    describe('A click on the un indent button on the third item in a list with five lis', function() {
        beforeEach(function() {
            $('.testarea').show();
            $('.testarea').focus();
        });

        afterEach(function() {
            $('.testarea').hide();
            $('.testarea').inlineedit('destroy');
        });
        it('should detach the li from the list leaving the first and third li as two separate lists', function() {
            $('.testarea ul').prepend($('<li />').html('list item 0'));
            $('.testarea ul').append($('<li />').html('list item 4'));
            jfa.rangetools.setSelection('.testarea > ul > li:eq(2)');
            var id = $('.testarea').data('inline:edit:uuid');
            $('div[data-editor="' + id + '"]').find('button[title="Unindent"]').click();
            expect($('<div />').append($('.testarea > ul:first')).html()).toEqual('<ul><li>list item 0</li><li>list item 1</li></ul>');
            expect($('<div />').append($('.testarea > p:last')).html()).toEqual('<p>list item 2</p>');
            expect($('<div />').append($('.testarea > ul:last')).html()).toEqual('<ul><li>list item 3</li><li>list item 4</li></ul>');
        });        
    });

    describe('A click on the p button when inside a h2 tag', function() {
        beforeEach(function() {
            $('.testarea').show();
            $('.testarea').focus();
        });

        afterEach(function() {
            $('.testarea').hide();
            $('.testarea').inlineedit('destroy');
        });
        it('should replace the h2 tag with a p tag', function() {
            jfa.rangetools.setSelection('.testarea h2');
            var id = $('.testarea').data('inline:edit:uuid');
            $('div[data-editor="' + id + '"]').find('button[title="Paragraf"]').click();
            expect($('.testarea h2').length).toEqual(0);
            expect($('.testarea p').length).toEqual(2);
            expect($('.testarea p:first').html()).toEqual('Header 2');
        });        
    });

    describe('A click on the 2 button when inside a p tag', function() {
        beforeEach(function() {
            $('.testarea').show();
            $('.testarea').focus();
        });

        afterEach(function() {
            $('.testarea').hide();
            $('.testarea').inlineedit('destroy');
        });
        it('should replace the p tag with a h2 tag', function() {
            jfa.rangetools.setSelection('.testarea p');
            var id = $('.testarea').data('inline:edit:uuid');
            $('div[data-editor="' + id + '"]').find('button[title="Header 2"]').click();
            expect($('.testarea p').length).toEqual(0);
            expect($('.testarea h2').length).toEqual(2);
            expect($('.testarea h2:last').html().trim()).toEqual('This is a paragraf');
        });        
    });
});
