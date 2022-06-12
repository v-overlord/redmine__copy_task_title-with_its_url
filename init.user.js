// ==UserScript==
// @name         Redmine: copy the task title with its url
// @namespace    https://github.com/v-overlord/redmine__copy_task_title-with_its_url
// @version      1.0
// @description  Adds an icon that is clicked to copy the link to the clipboard with text/html mime
// @author       v-overlord
// @match        https://tracker.egamings.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=egamings.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // .DATA
    const COPY_IMG_EL_ID = `__redmine_copy_title__img`;
    const COPY_IMG_EL_TOAST_CLASS = `__redmine_copy_title__img_toast`;
    const COPIED_STYLE = `.${COPY_IMG_EL_TOAST_CLASS}:after {
content: attr(data-copied);
padding: 5px;
border: 1px solid #ccc;
bottom: 120%;
right: 50%;
background: #cbceca;
border-radius: 5px;
position: relative;
}`;

    const TITLE_CONTAINER_SELECTOR = `#content .subject h3`;
    const COPY_IMG_HTML = `<img style="position: relative; width: 15px; padding-right: 3px; cursor: pointer;" id="${COPY_IMG_EL_ID}" alt="Click to copy!" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxOS4xLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiDQoJIHZpZXdCb3g9IjAgMCA2NCA2NCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgNjQgNjQiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGcgaWQ9IlRleHQtZmlsZXMiPg0KCTxwYXRoIGQ9Ik01My45NzkxNDg5LDkuMTQyOTAwNUg1MC4wMTA4NDljLTAuMDgyNjk4OCwwLTAuMTU2MjAwNCwwLjAyODM5OTUtMC4yMzMxMDA5LDAuMDQ2OTk5OVY1LjAyMjgNCgkJQzQ5Ljc3Nzc0ODEsMi4yNTMsNDcuNDczMTQ4MywwLDQ0LjYzOTg0NjgsMGgtMzQuNDIyNTk2QzcuMzgzOTUxNywwLDUuMDc5MzUxOSwyLjI1Myw1LjA3OTM1MTksNS4wMjI4djQ2Ljg0MzI5OTkNCgkJYzAsMi43Njk3OTgzLDIuMzA0NTk5OCw1LjAyMjgwMDQsNS4xMzc4OTk5LDUuMDIyODAwNGg2LjAzNjcwMDJ2Mi4yNjc4OTg2QzE2LjI1Mzk1Miw2MS44Mjc0MDAyLDE4LjQ3MDI1MTEsNjQsMjEuMTk1NDUxNyw2NA0KCQloMzIuNzgzNjk5YzIuNzI1MjAwNywwLDQuOTQxNDk3OC0yLjE3MjU5OTgsNC45NDE0OTc4LTQuODQzMjAwN1YxMy45ODYxMDAyDQoJCUM1OC45MjA2NDY3LDExLjMxNTUwMDMsNTYuNzA0MzQ5NSw5LjE0MjkwMDUsNTMuOTc5MTQ4OSw5LjE0MjkwMDV6IE03LjExMTA1MTYsNTEuODY2MTAwM1Y1LjAyMjgNCgkJYzAtMS42NDg3OTk5LDEuMzkzODk5OS0yLjk5MDk5OTksMy4xMDYyMDAyLTIuOTkwOTk5OWgzNC40MjI1OTZjMS43MTIzMDMyLDAsMy4xMDYyMDEyLDEuMzQyMiwzLjEwNjIwMTIsMi45OTA5OTk5djQ2Ljg0MzI5OTkNCgkJYzAsMS42NDg3OTk5LTEuMzkzODk4LDIuOTkxMTAwMy0zLjEwNjIwMTIsMi45OTExMDAzaC0zNC40MjI1OTZDOC41MDQ5NTE1LDU0Ljg1NzIwMDYsNy4xMTEwNTE2LDUzLjUxNDkwMDIsNy4xMTEwNTE2LDUxLjg2NjEwMDN6DQoJCSBNNTYuODg4ODQ3NCw1OS4xNTY3OTkzYzAsMS41NTA2MDItMS4zMDU1LDIuODExNTAwNS0yLjkwOTY5ODUsMi44MTE1MDA1aC0zMi43ODM2OTkNCgkJYy0xLjYwNDIwMDQsMC0yLjkwOTc5OTYtMS4yNjA4OTg2LTIuOTA5Nzk5Ni0yLjgxMTUwMDV2LTIuMjY3ODk4NmgyNi4zNTQxOTQ2DQoJCWMyLjgzMzMwMTUsMCw1LjEzNzkwMTMtMi4yNTMwMDIyLDUuMTM3OTAxMy01LjAyMjgwMDRWMTEuMTI3NTk5N2MwLjA3NjkwMDUsMC4wMTg2MDA1LDAuMTUwNDAyMSwwLjA0Njk5OTksMC4yMzMxMDA5LDAuMDQ2OTk5OQ0KCQloMy45NjgyOTk5YzEuNjA0MTk4NSwwLDIuOTA5Njk4NSwxLjI2MDkwMDUsMi45MDk2OTg1LDIuODExNTAwNVY1OS4xNTY3OTkzeiIvPg0KCTxwYXRoIGQ9Ik0zOC42MDMxNDk0LDEzLjIwNjM5OTlIMTYuMjUzOTUyYy0wLjU2MTUwMDUsMC0xLjAxNTkwMDYsMC40NTQyOTk5LTEuMDE1OTAwNiwxLjAxNTgwMDUNCgkJYzAsMC41NjE1OTk3LDAuNDU0NDAwMSwxLjAxNTg5OTcsMS4wMTU5MDA2LDEuMDE1ODk5N2gyMi4zNDkxOTc0YzAuNTYxNTAwNSwwLDEuMDE1ODk5Ny0wLjQ1NDI5OTksMS4wMTU4OTk3LTEuMDE1ODk5Nw0KCQlDMzkuNjE5MDQ5MSwxMy42NjA2OTk4LDM5LjE2NDY1LDEzLjIwNjM5OTksMzguNjAzMTQ5NCwxMy4yMDYzOTk5eiIvPg0KCTxwYXRoIGQ9Ik0zOC42MDMxNDk0LDIxLjMzMzQwMDdIMTYuMjUzOTUyYy0wLjU2MTUwMDUsMC0xLjAxNTkwMDYsMC40NTQyOTk5LTEuMDE1OTAwNiwxLjAxNTc5ODYNCgkJYzAsMC41NjE1MDA1LDAuNDU0NDAwMSwxLjAxNTkwMTYsMS4wMTU5MDA2LDEuMDE1OTAxNmgyMi4zNDkxOTc0YzAuNTYxNTAwNSwwLDEuMDE1ODk5Ny0wLjQ1NDQwMSwxLjAxNTg5OTctMS4wMTU5MDE2DQoJCUMzOS42MTkwNDkxLDIxLjc4NzcwMDcsMzkuMTY0NjUsMjEuMzMzNDAwNywzOC42MDMxNDk0LDIxLjMzMzQwMDd6Ii8+DQoJPHBhdGggZD0iTTM4LjYwMzE0OTQsMjkuNDYwMzAwNEgxNi4yNTM5NTJjLTAuNTYxNTAwNSwwLTEuMDE1OTAwNiwwLjQ1NDM5OTEtMS4wMTU5MDA2LDEuMDE1ODk5Nw0KCQlzMC40NTQ0MDAxLDEuMDE1ODk5NywxLjAxNTkwMDYsMS4wMTU4OTk3aDIyLjM0OTE5NzRjMC41NjE1MDA1LDAsMS4wMTU4OTk3LTAuNDU0Mzk5MSwxLjAxNTg5OTctMS4wMTU4OTk3DQoJCVMzOS4xNjQ2NSwyOS40NjAzMDA0LDM4LjYwMzE0OTQsMjkuNDYwMzAwNHoiLz4NCgk8cGF0aCBkPSJNMjguNDQ0NDQ4NSwzNy41ODcyOTkzSDE2LjI1Mzk1MmMtMC41NjE1MDA1LDAtMS4wMTU5MDA2LDAuNDU0Mzk5MS0xLjAxNTkwMDYsMS4wMTU4OTk3DQoJCXMwLjQ1NDQwMDEsMS4wMTU4OTk3LDEuMDE1OTAwNiwxLjAxNTg5OTdoMTIuMTkwNDk2NGMwLjU2MTUwMjUsMCwxLjAxNTgwMDUtMC40NTQzOTkxLDEuMDE1ODAwNS0xLjAxNTg5OTcNCgkJUzI5LjAwNTk1MDksMzcuNTg3Mjk5MywyOC40NDQ0NDg1LDM3LjU4NzI5OTN6Ii8+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8L3N2Zz4NCg==" />`;

    // .BBS
    let temp_el_to_copy = null;

    // .TEXT
    let title_container_el = document.querySelector(TITLE_CONTAINER_SELECTOR);

    if (title_container_el === null) {
        return;
    }

    const parent_of_title_el = title_container_el.parentNode;

    if (parent_of_title_el === null) {
        return;
    }

    init();

    parent_of_title_el.style.display = 'flex'; // To be inline
    parent_of_title_el.insertAdjacentHTML(`afterbegin`, COPY_IMG_HTML);

    title_container_el.dataset.copied = "Copied!";

    setTimeout(_ => {
        const copy_img_el = parent_of_title_el.querySelector(`#${COPY_IMG_EL_ID}`);

        if (copy_img_el === null) {
            error(`Cannot find the copy image element!`);
            return;
        }

        copy_img_el.addEventListener('click', function(e) {
            document.addEventListener("copy", listener);
            copyIconClickHandler.call(this, title_container_el.textContent.trim(), e);
            document.removeEventListener("copy", listener);
        });
    }, 0);

    // FUNCTIONS
    function listener(e) {
        e.clipboardData.setData("text/html", get_data());
        e.clipboardData.setData("text/plain", get_data());
        e.preventDefault();
    }

    function copyIconClickHandler(text_to_copy) {
        set_data(`<a href=${location.href}>${text_to_copy}</a>`);
        title_container_el.classList.add(COPY_IMG_EL_TOAST_CLASS);

        document.execCommand("copy");

        setTimeout(_ => title_container_el.classList.remove(COPY_IMG_EL_TOAST_CLASS), 1000);
    }

    function init() {
        // PREPARE THE COPY ELEMENT
        if (temp_el_to_copy === null) {
            temp_el_to_copy = document.createElement('DIV');

            temp_el_to_copy.innerHTML = ``;

            temp_el_to_copy.style.display = `none`;

            document.body.appendChild(temp_el_to_copy);
        }

        GM_addStyle(COPIED_STYLE);
    }

    function set_data(value) {
        temp_el_to_copy.innerHTML = value;
    }

    function get_data() {
        return temp_el_to_copy.innerHTML;
    }

    const default_formatter = data => JSON.stringify(data);

    function error(text, data = null, formatter = null) {
        console.warn(`[${GM.info.script.name}] -> ${text}`);

        if (data !== null) {
            data = formatter && formatter instanceof 'function' ? formatter(data) : default_formatter(data);

            console.info(`Data: ${data}`);
        }
    }
})();
