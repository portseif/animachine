'use strict';

var amgui;

module.exports = function (_amgui) {

    amgui = _amgui;

    return {
        addTooltip: addTooltip,
    }
};



function addTooltip(opt) {

    var showSetT, delay = 798, mx = 0, my = 0;

    var de = document.createElement('div');
    de.textContent = opt.text;
    de.style.position = 'fixed';
    de.style.padding = '12px';
    de.style.display = 'inline-block';
    de.style.background = amgui.color.overlay;
    de.style.color = amgui.color.text;

    opt.deTarget.addEventListener('mouseenter', onMEnter);

    function onMEnter(e) {

        opt.deTarget.addEventListener('mousemove', onMMove);
        opt.deTarget.addEventListener('mouseleave', onMLeave);
        opt.deTarget.addEventListener('mousedown', onMLeave);

        onMMove(e);
    }

    function onMLeave(e) {

        opt.deTarget.removeEventListener('mousemove', onMMove);
        opt.deTarget.removeEventListener('mouseleave', onMLeave);
        opt.deTarget.removeEventListener('mousedown', onMLeave);

        hide();
        clearShowSetT();
    }

    function onMMove(e) {

        hide();
        refreshShowSetT();
        mx = e.clientX;
        my = e.clientY;
    }

    function refreshShowSetT() {

        clearShowSetT();
        showSetT = setTimeout(show, delay);
    }

    function clearShowSetT() {

        clearTimeout(showSetT);
    }

    function show() {

        amgui.deOverlayCont.appendChild(de);
        amgui.placeToPoint(de, mx, my, opt.side);
    }

    function hide() {

        if (de.parentElement) {
            de.parentElement.removeChild(de);
        }
    }
}