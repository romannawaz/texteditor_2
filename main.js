$(document).ready(() => {
    // Bootstrap
    // Modal
    $('.modal').on(
        'shown.bs.modal',
        function () {
            $('.modal-btn').focus();
        }
    );

    const users = [
        {
            login: 'admin',
            password: '123'
        },
    ];

    let isLogged;

    const CONTENT_BLOCK = $('.text');
    const BTN_CLASS_ACTIVE = 'style-settings__btn-active';
    const GALLERY_COLOR = $('.gallery-color');
    const EDIT_BTN = $('.edit-btn');
    const NEW_TEXT = $('.new-text');
    const TEXT_STYLE_BLOCK = $('.text-style');
    const TEXT_ALIGN_BLOCK = $('.text-align');
    const DROPDOWN_MENU = $('.dropdown-menu');
    const GALLERY_IMAGE = $('.gallery-image');
    const FILE_IMG = $('#background_pic');
    const FORM_SING_IN_BTN = $('.form-sing-in-btn');
    const EDIT_BLOCK = $('.text-edit-block');
    const FORM_SING_OUT_BTN = $('.form-sing-out-btn');
    const HEADER_STYLE_SETTINGS = $('.header-style-settings');
    const HEADER_EDIT_SETTINGS = $('.header-edit-settings');
    const SAVE_CHANGES = $('.save-changes');
    const CREATE_TABLE_FORM_SUBMIT_BTN = $('.create-table__btn-submit');
    const RESET_BTN = $('.reset-btn');
    const CREATE_LIST_BTN = $('.create-list_btn-submit');

    // Поиск пользователя
    const findUser = (inputLogin, inputPassword) => {
        return users.some(({ login, password }) => inputLogin == login && inputPassword == password);
    }

    // Возвращает свойство от значения
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
    const forNotSinglePropertyValue = (state, currentValue, value) => {
        if (state)
            return `${currentValue} ${value}`;
        else
            return currentValue.split(' ').filter(val => val != value).join(' ');
    }

    const switchBlocks = (add, remove) => {
        add.addClass('none');
        remove.removeClass('none');
    }

    TEXT_STYLE_BLOCK.on(
        'change',
        function (e) {
            const target = $(e.target.closest('label'));

            if (target.hasClass('style-settings__btn')) {
                const INPUT = $(target).find('input[type=checkbox]');
                const inputState = INPUT.is(':checked');

                switchClassFromState(inputState, target, BTN_CLASS_ACTIVE);

                let { propertyValue } = $(INPUT).data();
                let property = getProperty(propertyValue);

                const CURRENT_PROPERTY_VALUE = CONTENT_BLOCK.css(property);

                if (property == 'textDecorationLine' && CURRENT_PROPERTY_VALUE != 'none')
                    propertyValue = forNotSinglePropertyValue(inputState, CURRENT_PROPERTY_VALUE, propertyValue);
                else
                    if (!inputState)
                        propertyValue = '';

                CONTENT_BLOCK.css({
                    [property]: propertyValue,
                });
            }
        }
    );

    TEXT_ALIGN_BLOCK.on(
        'change',
        function (e) {
            const target = $(e.target.closest('label'));

            if (target.hasClass('style-settings__btn')) {
                const SELECTED_INPUT = $(target).find('input[type=radio]');

                if (SELECTED_INPUT.is(':checked')) {
                    const ALL_INPUTS = $(this).find('.style-settings__radio');

                    ALL_INPUTS.not(SELECTED_INPUT)
                        .closest('label')
                        .removeClass(BTN_CLASS_ACTIVE);

                    SELECTED_INPUT.closest('label').addClass(BTN_CLASS_ACTIVE);

                    let { propertyValue } = $(SELECTED_INPUT).data();
                    let property = getProperty(propertyValue);

                    CONTENT_BLOCK.css({
                        [property]: propertyValue,
                    });
                }
            }
        }
    );

    DROPDOWN_MENU.on(
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

    GALLERY_COLOR.on(
        'click',
        function (e) {
            if ($(e.target).hasClass('gallery-color-item'))
                $('body').css({
                    [$(this).data('property')]: $(e.target).css('backgroundColor'),
                });
        }
    );

    GALLERY_IMAGE.on(
        'click',
        function (e) {
            if ($(e.target).hasClass('gallery-image-item'))
                $('body').css({
                    backgroundImage: $(e.target).css('backgroundImage'),
                });
        }
    );

    FILE_IMG.on(
        'change',
        function (e) {
            $('body').css({
                backgroundImage: `url(${URL.createObjectURL(e.target.files[0])})`,
            });
        }
    );

    FORM_SING_IN_BTN.on(
        'click',
        function (e) {
            const THIS_FORM = FORM_SING_IN_BTN.parents('form');
            const ERROR_MESSAGE = THIS_FORM.find('.form-sing-in-error');
            const FORM_LABELS = THIS_FORM.find('.form-control');

            if (THIS_FORM[0].checkValidity()) {
                const LOGIN = $('#sing-in-login').val();
                const PASSWORD = $('#sing-in-password').val();

                isLogged = findUser(LOGIN, PASSWORD);
                if (isLogged) {
                    EDIT_BTN.prop('disabled', false);
                    $('.btn-close').trigger('click');

                    FORM_LABELS.css({ 'borderColor': '' });
                    ERROR_MESSAGE.text('');
                    THIS_FORM[0].reset();

                    setTimeout(() => {
                        switchBlocks($('.modal-sing-in'), $('.modal-sing-out'));
                    }, 400);
                }
                else {
                    FORM_LABELS.css({ 'borderColor': '#dc3545' });
                    ERROR_MESSAGE.text('Please check your login and password');
                }
            }
            else {
                FORM_LABELS.css({ 'borderColor': '#dc3545' });
                ERROR_MESSAGE.text('Value is empty');
            }
        }
    );

    FORM_SING_OUT_BTN.on(
        'click',
        () => {
            isLogged = false;
            EDIT_BTN.prop('disabled', true);

            switchBlocks($('.modal-sing-out'), $('.modal-sing-in'));
        }
    );

    EDIT_BTN.on(
        'click',
        () => {
            if (isLogged) {
                NEW_TEXT.val(CONTENT_BLOCK.html());

                switchBlocks(CONTENT_BLOCK, EDIT_BLOCK);
                switchBlocks(HEADER_STYLE_SETTINGS, HEADER_EDIT_SETTINGS);
            }
            else {
                EDIT_BTN.prop('disabled', true);
            }
        }
    );

    SAVE_CHANGES.on(
        'click',
        () => {
            CONTENT_BLOCK.html(NEW_TEXT.val());

            switchBlocks(EDIT_BLOCK, CONTENT_BLOCK);
            switchBlocks(HEADER_EDIT_SETTINGS, HEADER_STYLE_SETTINGS);
        }
    );

    CREATE_TABLE_FORM_SUBMIT_BTN.on(
        'click',
        function () {
            const THIS_FORM = $(this).parents('.create-table-form');

            if (THIS_FORM[0].checkValidity()) {
                const COUNT_TR = $('#countTr').val();
                const COUNT_TD = $('#countTd').val();
                const WIDTH_OF_TD = $('#widthOfTD').val();
                const HEIGHT_OF_TD = $('#heightOfTD').val();
                const WIDTH_OF_BORDER = $('#widthOfBorder').val();
                const BORDER_STYLE = $('#table-settings-style-of-border').val();
                const BORDER_COLOR = $('#table-settings-color-of-border').val();

                const table = document.createElement('table');

                for (let i = 0; i < COUNT_TR; i++) {
                    const tr = document.createElement('tr');

                    for (let j = 0; j < COUNT_TD; j++) {
                        const td = document.createElement('td');
                        td.innerText = 'TD';

                        td.style.width = WIDTH_OF_TD + 'px';
                        td.style.height = HEIGHT_OF_TD + 'px';
                        td.style.border = `${WIDTH_OF_BORDER}px ${BORDER_STYLE} ${BORDER_COLOR}`;

                        tr.append(td);
                    }
                    table.append(tr);
                }

                NEW_TEXT.val(NEW_TEXT.val() + $(table)[0].outerHTML);
            }
            else {
                const ERROR_MESSAGE = THIS_FORM.find('.form-sing-in-error');
                ERROR_MESSAGE.text('Invalid value');
            }

            THIS_FORM.addClass('was-validated');
        }
    );

    RESET_BTN.on(
        'click',
        function () {
            const FORM = $(this).parents('form');

            if (FORM.hasClass('was-validated'))
                FORM.removeClass('was-validated');

            FORM.find('.form-sing-in-error').text('');
            FORM[0].reset();
        }
    );

    CREATE_LIST_BTN.on(
        'click',
        function () {
            const THIS_FORM = $(this).parents('form');

            if (THIS_FORM[0].checkValidity()) {
                const LIST = document.createElement(THIS_FORM.data('list'));

                const LIST_STYLE_TYPE = THIS_FORM.find('.list-settings-list-type').val();
                LIST.style.listStyleType = LIST_STYLE_TYPE;

                const COUNT_LI = THIS_FORM.find('#countItems').val();

                for (let i = 0; i < COUNT_LI; i++) {
                    const LIST_ITEM = document.createElement('li');
                    LIST_ITEM.innerText = `Item ${i}`;

                    LIST.append(LIST_ITEM);
                }

                NEW_TEXT.val(NEW_TEXT.val() + $(LIST)[0].outerHTML);
            }
            else {
                const ERROR_MESSAGE = THIS_FORM.find('.form-sing-in-error');
                ERROR_MESSAGE.text('Invalid value');
            }

            THIS_FORM.addClass('was-validated');
        }
    );
});