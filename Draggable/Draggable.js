
var Draggable = (function() {
    'use strict';

    var container, content, $container, $content,
        containerW, containerH, contentH, contentW, diffW, diffH,
        isDragging = false,
        start = {
            x: 0,
            y: 0,
            scrollTop: 0,
            scrollLeft: 0
        };

    function throwErr(msg) {
        console.error('Draggable: ' + msg);
    }

    function init(containerId, contentId, useJqueryUIDraggable) {

        if (typeof $ == 'undefined') {
            throwErr('Draggable requires jQuery loaded.');
            return;
        }

        $(function() {
            if (!containerId || !contentId) {
                throwErr('Required init arguments: containerId, contentId');
                return;
            }

            container = document.getElementById(containerId);
            if (!container) {
                throwErr('Cant find element with id: ' + containerId);
                return;
            }

            content = document.getElementById(contentId);
            if (!content) {
                throwErr('Cant find element with id: ' + contentId);
                return;
            }

            container.style.overflow = 'hidden';

            $container = $(container);
            $content = $(content);
            containerW = $container.width();
            containerH = $container.height();
            contentW = $content.width();
            contentH = $content.height();
            diffW = containerW - contentW;
            diffH = containerH - contentH;

            if (useJqueryUIDraggable) {
                initWithJquery();
            } else {
                initNative();
            }
        });

        return this;
    }

    function initNative() {

        content.addEventListener('dragstart', function(e) {
            e.preventDefault();
        });

        content.addEventListener('mouseout', function(e) {
            isDragging = false;
        }, false);

        content.addEventListener('mouseup', function(e) {
            isDragging = false;
        }, false);

        content.addEventListener('mousedown', function(e) {
            isDragging = true;
            start.x = e.pageX;
            start.y = e.pageY;
            start.scrollTop = container.scrollTop;
            start.scrollLeft = container.scrollLeft;
        }, false);

        content.addEventListener('mousemove', function(e) {
            if (isDragging) {
                container.scrollLeft = start.scrollLeft + (start.x - e.pageX);
                container.scrollTop = start.scrollTop + (start.y - e.pageY);
            }
        }, false);
    }

    function initWithJquery() {

        if (typeof $content.draggable == 'undefined') {
            initNative();
            throwErr('jQuery ui lib not loaded. Loading native implementation...');
            return;
        }

        $content.draggable({
            drag: function(e, ui) {
                if (ui.position.left > 0) {
                    ui.position.left = 0;
                }
                if (ui.position.top > 0) {
                    ui.position.top = 0;
                }
                if (ui.position.left < diffW) {
                    ui.position.left = diffW;
                }
                if (ui.position.top < diffH) {
                    ui.position.top = diffH;
                }
            }
        });
    }

    function center(x, y) {

        var leftPercent = x || 0.5;
        var topPercent = y || 0.5;

        container.scrollLeft = leftPercent * (contentW - containerW);
        container.scrollTop = topPercent * (contentH - containerH);

        return this;
    }

    return {
        init: init,
        center: center
    };
});