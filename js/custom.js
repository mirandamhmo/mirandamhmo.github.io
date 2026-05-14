var win = $(window);

// viewport dimensions
var ww = win.width();
var wh = win.height();

$(document).ready(function () {
    sidebar();
    fadeInPage();
    copyEmailButton();
    updateIndexNavScrollSpy();
    initIndexCarouselLightbox();
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

/** Index home: carousel art tiles use SimpleLightbox (same plugin as sandbox.html) */
function initIndexCarouselLightbox() {
    var carousel = document.querySelector('#index-page .index-life-outside__carousel');
    if (!carousel || typeof window.jQuery === 'undefined' || !$.fn.simpleLightbox) {
        return;
    }
    var $links = $(carousel).find('.index-life-outside__carousel-set:not([aria-hidden="true"]) a.img-link');
    if (!$links.length) {
        return;
    }
    $links.simpleLightbox();
    $links.on('show.simplelightbox', function () {
        carousel.classList.add('index-life-outside__carousel--paused');
    });
    $links.on('close.simplelightbox closed.simplelightbox', function () {
        carousel.classList.remove('index-life-outside__carousel--paused');
    });
}

/** Index home: pill nav follows scroll (Work / About / Connect; home never highlighted) */
function getIndexNavActiveLine() {
    var about = document.getElementById('about');
    if (!about) {
        return 100;
    }
    try {
        var sm = parseFloat(window.getComputedStyle(about).scrollMarginTop);
        if (!isNaN(sm) && sm >= 0) {
            return Math.round(sm + 12);
        }
    } catch (e) {
        /* ignore */
    }
    return 100;
}

function updateIndexNavScrollSpy() {
    var page = document.getElementById('index-page');
    var portfolio = document.getElementById('portfolio');
    var about = document.getElementById('about');
    var connect = document.getElementById('connect');
    if (!page || !portfolio) {
        return;
    }
    var doc = document.documentElement;
    var body = document.body;
    var scrollY = window.scrollY || window.pageYOffset;
    var viewH = window.innerHeight;
    var fullH = Math.max(doc.scrollHeight, doc.offsetHeight, body.scrollHeight, body.offsetHeight);
    if (connect && scrollY + viewH >= fullH - 4) {
        page.setAttribute('data-index-nav', 'connect');
        return;
    }
    var line = getIndexNavActiveLine();
    var sections = [
        { el: portfolio, nav: 'work' },
        { el: about, nav: 'about' },
        { el: connect, nav: 'connect' }
    ];
    var bestTop = -Infinity;
    var next = 'top';
    for (var i = 0; i < sections.length; i += 1) {
        var s = sections[i];
        if (!s.el) {
            continue;
        }
        var r = s.el.getBoundingClientRect();
        if (r.top <= line && r.bottom > 48 && r.top > bestTop) {
            bestTop = r.top;
            next = s.nav;
        }
    }
    page.setAttribute('data-index-nav', next);
}

/** Navbar hidden on scroll-down*/
/** ===================== */
var $nav = $('.navbar');
if ($nav.length) {
    $('body').css('padding-top', $nav.outerHeight() + 'px');
}
var last_scroll_top = 0;
win.on('scroll', function () {
    updateIndexNavScrollSpy();
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
    const offset = $('.navbar').length ? $('.navbar').outerHeight() : 0;
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

window.addEventListener('hashchange', function () {
    if (document.getElementById('index-page')) {
        updateIndexNavScrollSpy();
    }
});

/** True for in-page #anchors and same-path URLs (skip fader + allow native hash scroll) */
function indexPageShouldSkipFadeTransition(anchor) {
    var raw = (anchor.getAttribute('href') || '').trim();
    if (!raw || raw.indexOf('javascript:') === 0) {
        return true;
    }
    if (raw.charAt(0) === '#') {
        return true;
    }
    try {
        var u = new URL(anchor.href, window.location.href);
        if (u.origin !== window.location.origin) {
            return false;
        }
        var norm = function (p) {
            p = p || '/';
            p = p.replace(/\/index\.html$/i, '/');
            if (p.length > 1 && p.charAt(p.length - 1) === '/') {
                p = p.slice(0, -1);
            }
            return p || '/';
        };
        return norm(u.pathname) === norm(window.location.pathname) && u.search === window.location.search;
    } catch (e) {
        return true;
    }
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
            if (indexPageShouldSkipFadeTransition(anchors[idx])) {
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
