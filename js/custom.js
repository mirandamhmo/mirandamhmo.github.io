var win = $(window);

// viewport dimensions
var ww = win.width();
var wh = win.height();

$(document).ready(function () {
    sidebar();
    fadeInPage();
    copyEmailButton();
});

/** Copy email to clipboard (hero, footer, any .js-copy-email) */
function copyEmailButton() {
    var buttons = document.querySelectorAll('.js-copy-email');
    if (!buttons.length) {
        return;
    }
    for (var i = 0; i < buttons.length; i += 1) {
        (function (btn) {
            var email = btn.getAttribute('data-email');
            if (!email) {
                return;
            }
            var label = btn.querySelector('.proj-btn-outline__label');
            var defaultLabel = label
                ? (label.textContent || '').replace(/\s+/g, ' ').trim()
                : (btn.textContent || '').replace(/\s+/g, ' ').trim();
            btn.addEventListener('click', function () {
                function showCopied() {
                    if (label) {
                        label.textContent = 'Copied!';
                        setTimeout(function () {
                            label.textContent = defaultLabel;
                        }, 2000);
                    } else {
                        btn.textContent = 'Copied!';
                        setTimeout(function () {
                            btn.textContent = defaultLabel;
                        }, 2000);
                    }
                }
                function fallbackCopy() {
                    var ta = document.createElement('textarea');
                    ta.value = email;
                    ta.setAttribute('readonly', '');
                    ta.style.position = 'absolute';
                    ta.style.left = '-9999px';
                    document.body.appendChild(ta);
                    ta.select();
                    try {
                        document.execCommand('copy');
                        showCopied();
                    } catch (e) { /* ignore */ }
                    document.body.removeChild(ta);
                }
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(email).then(showCopied).catch(fallbackCopy);
                } else {
                    fallbackCopy();
                }
            });
        })(buttons[i]);
    }
}

/** Navbar hidden on scroll-down*/
/** ===================== */
$('body').css('padding-top', $('.navbar').outerHeight() + 'px')
var last_scroll_top = 0;
win.on('scroll', function () {
    scroll_top = $(this).scrollTop();
    if (scroll_top < last_scroll_top) {
        $('.smart-scroll').removeClass('scrolled-down').addClass('scrolled-up');
    }
    else {
        $('.smart-scroll').removeClass('scrolled-up').addClass('scrolled-down');
    }
    last_scroll_top = scroll_top;
});

/** Jump to section on click sidebar anchors*/
/** ===================== */
function scrollSmoothTo(elementId) {
    var element = document.getElementById(elementId);
    const offset = $('.navbar').outerHeight();
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = element.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

/** Change tag passing anchor point */
function sidebar() {
    //find the number of anchors/sections
    var numSec = $('.section').length;

    //append all anchors 
    if (numSec > 0) {
        for (i = 1; i <= numSec; i++) {
            var secName = $('#s' + i).text();
            $('#tags').append('<a class="anchor" id="a' + i + '" onclick="scrollSmoothTo(\'s' + i + '\')">' + secName + '</a>');
        }
        //change tag when pass anchor point 
        var anchor_offset = 0;
        // highlight table of contents
        $(window).on('scroll', function () {
            for (i = 1; i <= numSec; i++) {
                anchor_offset = $('#s' + i).offset().top - 200;

                if ($(window).scrollTop() > anchor_offset) {
                    $('.sidebar-highlight').removeClass('sidebar-highlight');
                    $('#a' + i).addClass('sidebar-highlight');
                }
            }
        })
    };
}

/** Fade In */
/** ===================== */
function fadeInPage() {
    if (!window.AnimationEvent) { return; }
    var fader = document.getElementById('fader');
    fader.classList.add('fade-out');

    document.addEventListener('DOMContentLoaded', function () {
        if (!window.AnimationEvent) { return; }
        var anchors = document.querySelectorAll('a:not(.img-link)');

        for (var idx = 0; idx < anchors.length; idx += 1) {
            if (anchors[idx].hostname !== window.location.hostname ||
                anchors[idx].pathname === window.location.pathname) {
                continue;
            }
            anchors[idx].addEventListener('click', function (event) {
                var fader = document.getElementById('fader'),
                    anchor = event.currentTarget;

                var listener = function () {
                    window.location = anchor.href;
                    fader.removeEventListener('animationend', listener);
                };
                fader.addEventListener('animationend', listener);

                event.preventDefault();
                fader.classList.add('fade-in');
            });
        }
    });
    window.addEventListener('pageshow', function (event) {
        if (!event.persisted) {
            return;
        }
        var fader = document.getElementById('fader');
        fader.classList.remove('fade-in');
    })
};
