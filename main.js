$(document).ready(() => {
    // Bootstrap
    // Modal
    $('.modal').on(
        'shown.bs.modal',
        function () {
            $('.modal-btn').focus();
        }
    );

    const CONTENT_BLOCK = $('.text');

    const BTN_CLASS_ACTIVE = 'style-settings__btn-active';

    const FONT_WEIGHT_BTN = $('#style-settings__font-weight-btn');
    const FONT_STYLE_BTN = $('#style-settings__font-style-btn');
    const UNDERLINE_BTN = $('#style-settings__underline-btn');
    const STRIKETHROUH_BTN = $('#style-settings__strikethrough-btn');

    const getProperty = value => {
        switch (value) {
            case 'bold':
                return 'fontWeight';
            case 'italic':
                return 'fontStyle';
            case 'underline':
            case 'line-through':
                return 'textDecorationLine';
            case 'left':
            case 'center':
            case 'right':
                return 'textAlign';
        };
    };

    // Убирает либо добавляет элементу класс в зависимости от его состояния
    const switchClassFromState = (state, selector, className) => selector[(state ? 'add' : 'remove') + 'Class'](className);

    // Убирает либо добавляет свойству значение в зависимости от его состояния
    const forNotSinglePropertyValue =
        (state, currentValue, value) => {
            if (state)
                return `${currentValue} ${value}`;
            else
                return currentValue.split(' ').filter(val => val != value).join(' ');
        }

    const setTextStyleEvent = sel => {
        sel.on(
            'click',
            function (e) {
                const BTN_STATE = this.checked;

                switchClassFromState(BTN_STATE, $(e.target).parent(), BTN_CLASS_ACTIVE);

                let { propertyValue } = this.dataset;
                let property = getProperty(propertyValue);

                const CURRENT_PROPERTY_VALUE = CONTENT_BLOCK.css(property);

                if (property == 'textDecorationLine' && CURRENT_PROPERTY_VALUE != 'none')
                    propertyValue = forNotSinglePropertyValue(BTN_STATE, CURRENT_PROPERTY_VALUE, propertyValue);
                else
                    if (!BTN_STATE)
                        propertyValue = '';

                CONTENT_BLOCK.css({
                    [property]: propertyValue
                });
            }
        );
    };

    setTextStyleEvent(FONT_WEIGHT_BTN);
    setTextStyleEvent(FONT_STYLE_BTN);
    setTextStyleEvent(UNDERLINE_BTN);
    setTextStyleEvent(STRIKETHROUH_BTN);

    const ALIGN_LEFT = $('#style-settings__align-left-btn');
    const ALIGN_CENTER = $('#style-settings__align-center-btn');
    const ALIGN_RIGHT = $('#style-settings__align-right-btn');

    const setTextAlignEvent = sel => {
        sel.on(
            'click',
            function () {
                let radioList = $('.style-settings__radio');

                radioList.each(function () {
                    switchClassFromState(this.checked, $(this).parent(), BTN_CLASS_ACTIVE);
                });

                let { propertyValue } = this.dataset;
                let property = getProperty(propertyValue);

                CONTENT_BLOCK.css({
                    [property]: propertyValue
                });
            }
        );
    };

    setTextAlignEvent(ALIGN_LEFT);
    setTextAlignEvent(ALIGN_CENTER);
    setTextAlignEvent(ALIGN_RIGHT);

    // const dropDown = (selector, dropBlock, cssProperty) => {
    //     $(selector).on(
    //         'click',
    //         e => {
    //             $(dropBlock).toggleClass('none');

    //             e.stopPropagation();

    //             $(window).on(
    //                 'click',
    //                 e => {
    //                     if (!$(e.target).parent().hasClass(dropBlock))
    //                         $(dropBlock).addClass('none');
    //                 }
    //             );
    //         }
    //     );

    //     $(dropBlock).on(
    //         'click',
    //         e => {
    //             CONTENT_BLOCK.css({
    //                 [cssProperty]: $(e.target).css(cssProperty),
    //             });

    //             $(dropBlock).addClass('none');
    //         }
    //     );
    // }

    // dropDown('.font-family-select-btn', '.font-family-select', 'fontFamily');
    // dropDown('.font-size-select-btn', '.font-size-select', 'fontSize');

    const DROPDOWN_MENU = $('.dropdown-menu');

    const setFontStyle = sel => {
        $(sel).on(
            'click',
            function (e) {
                // Получаю свойство CSS из атрибута data родительского элемента
                const CSS_PROPERTY = $(this).data('fontStyle');

                // Получаю стили выбраного элемента и задаю их блоку с текстом
                CONTENT_BLOCK.css({
                    [CSS_PROPERTY]: $(e.target).css(CSS_PROPERTY),
                });
            }
        );
    };

    for (const menu of DROPDOWN_MENU)
        setFontStyle(menu);

    $('.modal-colors').on(
        'click',
        function (e) {
            $('body').css({
                [$(this).data('property')]: $(e.target).css('backgroundColor'),
            })
        }
    );
});