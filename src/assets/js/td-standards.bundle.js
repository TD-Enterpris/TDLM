/*!
 * TD Emerald Standards Bootstrap 5 v5.5.0
 * Copyright 2024 Daniel Cho <daniel.cho@td.com> (http://code.td.com)
 */
!(function (e, t) {
  'object' == typeof exports && 'undefined' != typeof module
    ? (module.exports = t())
    : 'function' == typeof define && define.amd
    ? define(t)
    : ((e = 'undefined' != typeof globalThis ? globalThis : e || self)[
        'td-standards'
      ] = t())
})(this, function () {
  'use strict'
  var e = {
      tdWinDOMContentLoaded: function (e) {
        window.addEventListener('DOMContentLoaded', e)
      },
      tdDOMContentLoaded: function (e) {
        document.addEventListener('DOMContentLoaded', e)
      },
      tdWinLoad: function (e) {
        window.addEventListener('load', e)
      },
      tdLoadstart: function (e, t) {
        e.addEventListener('loadstart', t)
      },
      tdProgress: function (e, t) {
        e.addEventListener('progress', t)
      },
      tdLoad: function (e, t) {
        e.addEventListener('load', t)
      },
      tdLoadend: function (e, t) {
        e.addEventListener('loadend', t)
      },
      tdError: function (e, t) {
        e.addEventListener('error', t)
      },
      tdAbort: function (e, t) {
        e.addEventListener('abort', t)
      }
    },
    t = [],
    n = {
      evL: e,
      tdDOMContentLoadedCallbacks: t,
      tdOnDOMContentLoaded: function (n) {
        'loading' === document.readyState
          ? (t.length ||
              e.tdDOMContentLoaded(function () {
                for (var e = 0, n = t; e < n.length; e++) (0, n[e])()
              }),
            t.push(n))
          : n()
      }
    },
    i = 'td-mobile-hamburgerMenu',
    r = 'td-mobile-hamburgerMenu-closeStateTxt',
    o = 'td-mobile-hamburgerMenu-openStateTxt',
    s = 'td-mobile-nav-menu',
    a = ['main', 'footer'],
    l = 'td-overlay',
    c = 'td-header-nav-dropdown',
    u = 'td-header-nav-dropdown-hover-on',
    d = 'td-header-nav-dropdown-open',
    f = 'td-header-nav-dropdown-close',
    h = 'td-header-nav-dropdown-items',
    g = 'td-header-nav-dropdown-items-open',
    m = 'td-header-nav-main-dropdown-active',
    v = document.querySelectorAll('.td-header-nav'),
    p = (function () {
      function e (e) {
        this.$baseObj = e
      }
      var t = e.prototype
      return (
        (t.init = function () {
          this.evt()
        }),
        (t.evt = function () {
          var e = this
          this.$baseObj.forEach(function (t, n) {
            e.mobileNavEvt(t),
              t.querySelectorAll('.' + c).forEach(function (t, n) {
                t.addEventListener('click', function (t) {
                  var n = t.currentTarget
                  n.classList.contains(u) || e.toggle(n)
                }),
                  t.addEventListener('keydown', function (t) {
                    ;(32 !== t.which && 13 !== t.which) ||
                      e.toggle(t.currentTarget),
                      27 === t.which && e.dropdown_close(t.currentTarget)
                  }),
                  t.addEventListener('mouseenter', function (t) {
                    var n,
                      i = t.currentTarget
                    e.close_all_dropdowns(),
                      e.dropdown_open(i),
                      null == (n = i.classList) || n.add(u)
                  }),
                  t.addEventListener('mouseleave', function (t) {
                    var n,
                      i = t.currentTarget
                    e.dropdown_close(i),
                      null == (n = i.classList) || n.remove(u)
                  }),
                  e.accessibility(t, n)
              })
          }),
            document.addEventListener('click', function (t) {
              e.on_document_click(t)
            }),
            document.addEventListener('touchstart', function (t) {
              e.on_document_click(t)
            })
        }),
        (t.mobileNavEvt = function (e) {
          var t = e.querySelector('.td-mobile-nav')
          null != t &&
            (this.mobileHamberMenuEvt(t),
            this.mobileAccordionEvt(t),
            this.mobileOverlayEvt(t),
            this.mobileFocusTrapEvt(t))
        }),
        (t.mobileAccordionEvt = function (e) {
          e.querySelectorAll('.td-mobile-nav-menu-section-accordion').forEach(
            function (e, t) {
              var n = e
              n.children[0].addEventListener('click', function (e) {
                e.preventDefault()
                var t = e.currentTarget,
                  i = t.nextElementSibling
                n.classList.contains('show')
                  ? (t.setAttribute('aria-expanded', 'false'),
                    i.setAttribute('aria-hidden', 'true'))
                  : (t.setAttribute('aria-expanded', 'true'),
                    i.setAttribute('aria-hidden', 'false')),
                  n.classList.toggle('show')
              })
            }
          )
        }),
        (t.mobileFocusTrapEvt = function (e) {
          var t =
              'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
            n = e,
            i = n.querySelectorAll(t)[0],
            r = n.querySelectorAll(t),
            o = r[r.length - 1]
          n.addEventListener('keydown', function (e) {
            ;('Tab' === e.key || 9 === e.keyCode) &&
              (e.shiftKey
                ? document.activeElement === i &&
                  (o.focus(), e.preventDefault())
                : document.activeElement === o &&
                  (i.focus(), e.preventDefault()))
          })
        }),
        (t.mobileHamberMenuEvt = function (e) {
          var t = this,
            n = 0,
            r = !1,
            o = 0,
            a = !1
          e.querySelector('.' + i).addEventListener('click', function (e) {
            var i = e.currentTarget,
              c = i.parentElement.parentElement.parentElement.parentElement,
              u = c.querySelector('.' + s),
              d = c.querySelector('.' + l)
            ;((0 == n && 0 == o) || (n > 0 && 1 == r && o > 0 && 1 == a)) &&
              ((r = !1),
              (a = !1),
              i.classList.toggle('show'),
              c.classList.contains('show')
                ? (t.mobileHamburgerMenu(i, c.classList.contains('show')),
                  t.mobileHideShowPageEls(c.classList.contains('show')),
                  c.classList.toggle('show'),
                  setTimeout(function () {
                    ;(u.style.display = 'none'), (r = !0), n++
                  }, 290))
                : (t.mobileHamburgerMenu(i, c.classList.contains('show')),
                  t.mobileHideShowPageEls(c.classList.contains('show')),
                  t.mobileShowHideBodyScrollbar('hidden'),
                  (u.style.display = 'flex'),
                  setTimeout(function () {
                    c.classList.toggle('show'), (r = !0), n++
                  }, 0)),
              d.classList.contains('td-overlay-show')
                ? (d.classList.toggle('td-overlay-show'),
                  setTimeout(function () {
                    ;(d.style.display = 'none'),
                      t.mobileShowHideBodyScrollbar('initial'),
                      (a = !0),
                      o++
                  }, 790))
                : ((d.style.display = 'block'),
                  setTimeout(function () {
                    d.classList.toggle('td-overlay-show'), (a = !0), o++
                  }, 0)))
          })
        }),
        (t.mobileOverlayEvt = function (e) {
          var t = this
          e.querySelector('.' + l).addEventListener('click', function (e) {
            var n = e.currentTarget,
              r = n.parentElement,
              o = r.querySelector('.' + s),
              a = r.querySelector('.' + i)
            a.classList.toggle('show'),
              t.mobileHamburgerMenu(a, n.classList.contains('td-overlay-show')),
              t.mobileHideShowPageEls(n.classList.contains('td-overlay-show')),
              r.classList.contains('show') &&
                (r.classList.toggle('show'),
                setTimeout(function () {
                  o.style.display = 'none'
                }, 290)),
              n.classList.contains('td-overlay-show') &&
                (n.classList.toggle('td-overlay-show'),
                setTimeout(function () {
                  ;(n.style.display = 'none'),
                    t.mobileShowHideBodyScrollbar('initial')
                }, 790))
          })
        }),
        (t.mobileHamburgerMenu = function (e, t) {
          t
            ? (e.setAttribute('aria-expanded', 'false'),
              e.querySelector('.' + r).setAttribute('aria-hidden', 'false'),
              e.querySelector('.' + o).setAttribute('aria-hidden', 'true'))
            : (e.setAttribute('aria-expanded', 'true'),
              e.querySelector('.' + r).setAttribute('aria-hidden', 'true'),
              e.querySelector('.' + o).setAttribute('aria-hidden', 'false'))
        }),
        (t.mobileHideShowPageEls = function (e) {
          e
            ? a.forEach(function (e) {
                null != document.querySelector(e)
                  ? document.querySelector(e).removeAttribute('aria-hidden')
                  : 'main' == e &&
                    null != document.querySelector('[role=' + e + ']') &&
                    document
                      .querySelector('[role=' + e + ']')
                      .removeAttribute('aria-hidden')
              })
            : a.forEach(function (e) {
                null != document.querySelector(e)
                  ? document
                      .querySelector(e)
                      .setAttribute('aria-hidden', 'true')
                  : 'main' == e &&
                    null != document.querySelector('[role=' + e + ']') &&
                    document
                      .querySelector('[role=' + e + ']')
                      .setAttribute('aria-hidden', 'true')
              })
        }),
        (t.mobileShowHideBodyScrollbar = function (e) {
          document.querySelector('body').style.overflow = e
        }),
        (t.toggle = function (e) {
          var t = e
          t.classList.contains(m)
            ? this.dropdown_close(t)
            : (this.close_all_dropdowns(), this.dropdown_open(t))
        }),
        (t.dropdown_open = function (e, t) {
          var n, i
          void 0 === t && (t = 'MAIN')
          var r = e,
            o = e.querySelector('a'),
            s = o.classList
          'MAIN' == t && (null == (n = r.classList) || n.add(m)),
            null == (i = r.querySelector('ul.' + h).classList) || i.add(g),
            null == s || s.remove(f),
            null == s || s.add(d),
            o.setAttribute('aria-expanded', 'true')
        }),
        (t.dropdown_close = function (e, t) {
          var n, i
          void 0 === t && (t = 'MAIN')
          var r = e,
            o = r.querySelector('a'),
            s = o.classList
          'MAIN' == t && (null == (n = r.classList) || n.remove(m)),
            null == (i = e.querySelector('ul.' + h).classList) || i.remove(g),
            null == s || s.remove(d),
            null == s || s.add(f),
            o.setAttribute('aria-expanded', 'false')
        }),
        (t.close_all_dropdowns = function () {
          var e = this
          this.$baseObj.forEach(function (t, n) {
            t.querySelectorAll('.' + c).forEach(function (t, n) {
              t.classList.contains(u) || e.dropdown_close(t)
            })
          })
        }),
        (t.on_document_click = function (e) {
          e.target.closest('.' + c) || this.close_all_dropdowns()
        }),
        (t.accessibility = function (e, t) {
          var n = this,
            i = e,
            r = i.querySelector('a'),
            o = i.querySelector('.' + h),
            s = c + '-' + t + Math.floor(1e4 * Math.random() + 1)
          r.setAttribute('aria-expanded', 'false'),
            r.setAttribute('id', s),
            null == o || o.setAttribute('aria-labelledby', s)
          var a = o.querySelectorAll('li')
          a[a.length - 1].addEventListener('keydown', function (e) {
            e.shiftKey || 9 !== e.which || n.close_all_dropdowns()
          }),
            r.addEventListener('keydown', function (e) {
              e.shiftKey && 9 === e.which && n.close_all_dropdowns()
            })
        }),
        e
      )
    })()
  function _ (e, t) {
    for (var n = 0; n < t.length; n++) {
      var i = t[n]
      ;(i.enumerable = i.enumerable || !1),
        (i.configurable = !0),
        'value' in i && (i.writable = !0),
        Object.defineProperty(
          e,
          (void 0,
          'symbol' ==
          typeof (r = (function (e, t) {
            if ('object' != typeof e || null === e) return e
            var n = e[Symbol.toPrimitive]
            if (void 0 !== n) {
              var i = n.call(e, 'string')
              if ('object' != typeof i) return i
              throw new TypeError(
                '@@toPrimitive must return a primitive value.'
              )
            }
            return String(e)
          })(i.key))
            ? r
            : String(r)),
          i
        )
    }
    var r
  }
  function y (e, t, n) {
    return (
      t && _(e.prototype, t),
      n && _(e, n),
      Object.defineProperty(e, 'prototype', { writable: !1 }),
      e
    )
  }
  function b () {
    return (
      (b = Object.assign
        ? Object.assign.bind()
        : function (e) {
            for (var t = 1; t < arguments.length; t++) {
              var n = arguments[t]
              for (var i in n)
                Object.prototype.hasOwnProperty.call(n, i) && (e[i] = n[i])
            }
            return e
          }),
      b.apply(this, arguments)
    )
  }
  function w (e, t) {
    ;(e.prototype = Object.create(t.prototype)),
      (e.prototype.constructor = e),
      E(e, t)
  }
  function E (e, t) {
    return (
      (E = Object.setPrototypeOf
        ? Object.setPrototypeOf.bind()
        : function (e, t) {
            return (e.__proto__ = t), e
          }),
      E(e, t)
    )
  }
  function A (e) {
    if (void 0 === e)
      throw new ReferenceError(
        "this hasn't been initialised - super() hasn't been called"
      )
    return e
  }
  function S (e, t) {
    ;(null == t || t > e.length) && (t = e.length)
    for (var n = 0, i = new Array(t); n < t; n++) i[n] = e[n]
    return i
  }
  function L (e, t) {
    var n =
      ('undefined' != typeof Symbol && e[Symbol.iterator]) || e['@@iterator']
    if (n) return (n = n.call(e)).next.bind(n)
    if (
      Array.isArray(e) ||
      (n = (function (e, t) {
        if (e) {
          if ('string' == typeof e) return S(e, t)
          var n = Object.prototype.toString.call(e).slice(8, -1)
          return (
            'Object' === n && e.constructor && (n = e.constructor.name),
            'Map' === n || 'Set' === n
              ? Array.from(e)
              : 'Arguments' === n ||
                /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
              ? S(e, t)
              : void 0
          )
        }
      })(e)) ||
      (t && e && 'number' == typeof e.length)
    ) {
      n && (e = n)
      var i = 0
      return function () {
        return i >= e.length ? { done: !0 } : { done: !1, value: e[i++] }
      }
    }
    throw new TypeError(
      'Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
    )
  }
  n.tdOnDOMContentLoaded(function () {
    new p(v).init()
  })
  var k = 'transitionend',
    C = function (e) {
      return (
        e &&
          window.CSS &&
          window.CSS.escape &&
          (e = e.replace(/#([^\s"#']+)/g, function (e, t) {
            return '#' + CSS.escape(t)
          })),
        e
      )
    },
    T = function (e) {
      return (
        !(!e || 'object' != typeof e) &&
        (void 0 !== e.jquery && (e = e[0]), void 0 !== e.nodeType)
      )
    },
    O = function (e) {
      return T(e)
        ? e.jquery
          ? e[0]
          : e
        : 'string' == typeof e && e.length > 0
        ? document.querySelector(C(e))
        : null
    },
    q = function (e) {
      if (!T(e) || 0 === e.getClientRects().length) return !1
      var t = 'visible' === getComputedStyle(e).getPropertyValue('visibility'),
        n = e.closest('details:not([open])')
      if (!n) return t
      if (n !== e) {
        var i = e.closest('summary')
        if (i && i.parentNode !== n) return !1
        if (null === i) return !1
      }
      return t
    },
    N = function (e) {
      return (
        !e ||
        e.nodeType !== Node.ELEMENT_NODE ||
        !!e.classList.contains('disabled') ||
        (void 0 !== e.disabled
          ? e.disabled
          : e.hasAttribute('disabled') &&
            'false' !== e.getAttribute('disabled'))
      )
    },
    M = function (e) {
      e.offsetHeight
    },
    D = function () {
      return window.jQuery && !document.body.hasAttribute('data-bs-no-jquery')
        ? window.jQuery
        : null
    },
    j = [],
    x = function () {
      return 'rtl' === document.documentElement.dir
    },
    P = function (e) {
      var t
      ;(t = function () {
        var t = D()
        if (t) {
          var n = e.NAME,
            i = t.fn[n]
          ;(t.fn[n] = e.jQueryInterface),
            (t.fn[n].Constructor = e),
            (t.fn[n].noConflict = function () {
              return (t.fn[n] = i), e.jQueryInterface
            })
        }
      }),
        'loading' === document.readyState
          ? (j.length ||
              document.addEventListener('DOMContentLoaded', function () {
                for (var e = 0, t = j; e < t.length; e++) (0, t[e])()
              }),
            j.push(t))
          : t()
    },
    F = function (e, t, n) {
      return (
        void 0 === t && (t = []),
        void 0 === n && (n = e),
        'function' == typeof e ? e.apply(void 0, t) : n
      )
    },
    I = function (e, t, n) {
      if ((void 0 === n && (n = !0), n)) {
        var i =
            (function (e) {
              if (!e) return 0
              var t = window.getComputedStyle(e),
                n = t.transitionDuration,
                i = t.transitionDelay,
                r = Number.parseFloat(n),
                o = Number.parseFloat(i)
              return r || o
                ? ((n = n.split(',')[0]),
                  (i = i.split(',')[0]),
                  1e3 * (Number.parseFloat(n) + Number.parseFloat(i)))
                : 0
            })(t) + 5,
          r = !1
        t.addEventListener(k, function n (i) {
          i.target === t && ((r = !0), t.removeEventListener(k, n), F(e))
        }),
          setTimeout(function () {
            r || t.dispatchEvent(new Event(k))
          }, i)
      } else F(e)
    },
    H = /[^.]*(?=\..*)\.|.*/,
    B = /\..*/,
    W = /::\d+$/,
    z = {},
    K = 1,
    V = { mouseenter: 'mouseover', mouseleave: 'mouseout' },
    Y = new Set([
      'click',
      'dblclick',
      'mouseup',
      'mousedown',
      'contextmenu',
      'mousewheel',
      'DOMMouseScroll',
      'mouseover',
      'mouseout',
      'mousemove',
      'selectstart',
      'selectend',
      'keydown',
      'keypress',
      'keyup',
      'orientationchange',
      'touchstart',
      'touchmove',
      'touchend',
      'touchcancel',
      'pointerdown',
      'pointermove',
      'pointerup',
      'pointerleave',
      'pointercancel',
      'gesturestart',
      'gesturechange',
      'gestureend',
      'focus',
      'blur',
      'change',
      'reset',
      'select',
      'submit',
      'focusin',
      'focusout',
      'load',
      'unload',
      'beforeunload',
      'resize',
      'move',
      'DOMContentLoaded',
      'readystatechange',
      'error',
      'abort',
      'scroll'
    ])
  function R (e, t) {
    return (t && t + '::' + K++) || e.uidEvent || K++
  }
  function $ (e) {
    var t = R(e)
    return (e.uidEvent = t), (z[t] = z[t] || {}), z[t]
  }
  function Q (e, t, n) {
    return (
      void 0 === n && (n = null),
      Object.values(e).find(function (e) {
        return e.callable === t && e.delegationSelector === n
      })
    )
  }
  function U (e, t, n) {
    var i = 'string' == typeof t,
      r = i ? n : t || n,
      o = X(e)
    return Y.has(o) || (o = e), [i, r, o]
  }
  function J (e, t, n, i, r) {
    if ('string' == typeof t && e) {
      var o = U(t, n, i),
        s = o[0],
        a = o[1],
        l = o[2]
      t in V &&
        (a = (function (e) {
          return function (t) {
            if (
              !t.relatedTarget ||
              (t.relatedTarget !== t.delegateTarget &&
                !t.delegateTarget.contains(t.relatedTarget))
            )
              return e.call(this, t)
          }
        })(a))
      var c = $(e),
        u = c[l] || (c[l] = {}),
        d = Q(u, a, s ? n : null)
      if (d) d.oneOff = d.oneOff && r
      else {
        var f = R(a, t.replace(H, '')),
          h = s
            ? (function (e, t, n) {
                return function i (r) {
                  for (
                    var o = e.querySelectorAll(t), s = r.target;
                    s && s !== this;
                    s = s.parentNode
                  )
                    for (var a, l = L(o); !(a = l()).done; )
                      if (a.value === s)
                        return (
                          te(r, { delegateTarget: s }),
                          i.oneOff && ee.off(e, r.type, t, n),
                          n.apply(s, [r])
                        )
                }
              })(e, n, a)
            : (function (e, t) {
                return function n (i) {
                  return (
                    te(i, { delegateTarget: e }),
                    n.oneOff && ee.off(e, i.type, t),
                    t.apply(e, [i])
                  )
                }
              })(e, a)
        ;(h.delegationSelector = s ? n : null),
          (h.callable = a),
          (h.oneOff = r),
          (h.uidEvent = f),
          (u[f] = h),
          e.addEventListener(l, h, s)
      }
    }
  }
  function Z (e, t, n, i, r) {
    var o = Q(t[n], i, r)
    o && (e.removeEventListener(n, o, Boolean(r)), delete t[n][o.uidEvent])
  }
  function G (e, t, n, i) {
    for (var r = t[n] || {}, o = 0, s = Object.entries(r); o < s.length; o++) {
      var a = s[o],
        l = a[0],
        c = a[1]
      l.includes(i) && Z(e, t, n, c.callable, c.delegationSelector)
    }
  }
  function X (e) {
    return (e = e.replace(B, '')), V[e] || e
  }
  var ee = {
    on: function (e, t, n, i) {
      J(e, t, n, i, !1)
    },
    one: function (e, t, n, i) {
      J(e, t, n, i, !0)
    },
    off: function (e, t, n, i) {
      if ('string' == typeof t && e) {
        var r = U(t, n, i),
          o = r[0],
          s = r[1],
          a = r[2],
          l = a !== t,
          c = $(e),
          u = c[a] || {},
          d = t.startsWith('.')
        if (void 0 === s) {
          if (d)
            for (var f = 0, h = Object.keys(c); f < h.length; f++)
              G(e, c, h[f], t.slice(1))
          for (var g = 0, m = Object.entries(u); g < m.length; g++) {
            var v = m[g],
              p = v[0],
              _ = v[1],
              y = p.replace(W, '')
            ;(l && !t.includes(y)) ||
              Z(e, c, a, _.callable, _.delegationSelector)
          }
        } else {
          if (!Object.keys(u).length) return
          Z(e, c, a, s, o ? n : null)
        }
      }
    },
    trigger: function (e, t, n) {
      if ('string' != typeof t || !e) return null
      var i = D(),
        r = null,
        o = !0,
        s = !0,
        a = !1
      t !== X(t) &&
        i &&
        ((r = i.Event(t, n)),
        i(e).trigger(r),
        (o = !r.isPropagationStopped()),
        (s = !r.isImmediatePropagationStopped()),
        (a = r.isDefaultPrevented()))
      var l = te(new Event(t, { bubbles: o, cancelable: !0 }), n)
      return (
        a && l.preventDefault(),
        s && e.dispatchEvent(l),
        l.defaultPrevented && r && r.preventDefault(),
        l
      )
    }
  }
  function te (e, t) {
    void 0 === t && (t = {})
    for (
      var n = function () {
          var t = r[i],
            n = t[0],
            o = t[1]
          try {
            e[n] = o
          } catch (t) {
            Object.defineProperty(e, n, {
              configurable: !0,
              get: function () {
                return o
              }
            })
          }
        },
        i = 0,
        r = Object.entries(t);
      i < r.length;
      i++
    )
      n()
    return e
  }
  var ne = function (e) {
      var t = e.getAttribute('data-bs-target')
      if (!t || '#' === t) {
        var n = e.getAttribute('href')
        if (!n || (!n.includes('#') && !n.startsWith('.'))) return null
        n.includes('#') && !n.startsWith('#') && (n = '#' + n.split('#')[1]),
          (t = n && '#' !== n ? n.trim() : null)
      }
      return C(t)
    },
    ie = {
      find: function (e, t) {
        var n
        return (
          void 0 === t && (t = document.documentElement),
          (n = []).concat.apply(
            n,
            Element.prototype.querySelectorAll.call(t, e)
          )
        )
      },
      findOne: function (e, t) {
        return (
          void 0 === t && (t = document.documentElement),
          Element.prototype.querySelector.call(t, e)
        )
      },
      children: function (e, t) {
        var n
        return (n = []).concat.apply(n, e.children).filter(function (e) {
          return e.matches(t)
        })
      },
      parents: function (e, t) {
        for (var n = [], i = e.parentNode.closest(t); i; )
          n.push(i), (i = i.parentNode.closest(t))
        return n
      },
      prev: function (e, t) {
        for (var n = e.previousElementSibling; n; ) {
          if (n.matches(t)) return [n]
          n = n.previousElementSibling
        }
        return []
      },
      next: function (e, t) {
        for (var n = e.nextElementSibling; n; ) {
          if (n.matches(t)) return [n]
          n = n.nextElementSibling
        }
        return []
      },
      focusableChildren: function (e) {
        var t = [
          'a',
          'button',
          'input',
          'textarea',
          'select',
          'details',
          '[tabindex]',
          '[contenteditable="true"]'
        ]
          .map(function (e) {
            return e + ':not([tabindex^="-"])'
          })
          .join(',')
        return this.find(t, e).filter(function (e) {
          return !N(e) && q(e)
        })
      },
      getSelectorFromElement: function (e) {
        var t = ne(e)
        return t && ie.findOne(t) ? t : null
      },
      getElementFromSelector: function (e) {
        var t = ne(e)
        return t ? ie.findOne(t) : null
      },
      getMultipleElementsFromSelector: function (e) {
        var t = ne(e)
        return t ? ie.find(t) : []
      }
    },
    re = new Map()
  function oe (e) {
    if ('true' === e) return !0
    if ('false' === e) return !1
    if (e === Number(e).toString()) return Number(e)
    if ('' === e || 'null' === e) return null
    if ('string' != typeof e) return e
    try {
      return JSON.parse(decodeURIComponent(e))
    } catch (t) {
      return e
    }
  }
  function se (e) {
    return e.replace(/[A-Z]/g, function (e) {
      return '-' + e.toLowerCase()
    })
  }
  var ae = function (e, t) {
      return oe(e.getAttribute('data-bs-' + se(t)))
    },
    le = (function () {
      function e () {}
      var t = e.prototype
      return (
        (t._getConfig = function (e) {
          return (
            (e = this._mergeConfigObj(e)),
            (e = this._configAfterMerge(e)),
            this._typeCheckConfig(e),
            e
          )
        }),
        (t._configAfterMerge = function (e) {
          return e
        }),
        (t._mergeConfigObj = function (e, t) {
          var n = T(t) ? ae(t, 'config') : {}
          return b(
            {},
            this.constructor.Default,
            'object' == typeof n ? n : {},
            T(t)
              ? (function (e) {
                  if (!e) return {}
                  for (
                    var t,
                      n = {},
                      i = Object.keys(e.dataset).filter(function (e) {
                        return e.startsWith('bs') && !e.startsWith('bsConfig')
                      }),
                      r = L(i);
                    !(t = r()).done;

                  ) {
                    var o = t.value,
                      s = o.replace(/^bs/, '')
                    n[(s = s.charAt(0).toLowerCase() + s.slice(1, s.length))] =
                      oe(e.dataset[o])
                  }
                  return n
                })(t)
              : {},
            'object' == typeof e ? e : {}
          )
        }),
        (t._typeCheckConfig = function (e, t) {
          void 0 === t && (t = this.constructor.DefaultType)
          for (var n = 0, i = Object.entries(t); n < i.length; n++) {
            var r = i[n],
              o = r[0],
              s = r[1],
              a = e[o],
              l = T(a)
                ? 'element'
                : null == (c = a)
                ? '' + c
                : Object.prototype.toString
                    .call(c)
                    .match(/\s([a-z]+)/i)[1]
                    .toLowerCase()
            if (!new RegExp(s).test(l))
              throw new TypeError(
                this.constructor.NAME.toUpperCase() +
                  ': Option "' +
                  o +
                  '" provided type "' +
                  l +
                  '" but expected type "' +
                  s +
                  '".'
              )
          }
          var c
        }),
        y(e, null, [
          {
            key: 'Default',
            get: function () {
              return {}
            }
          },
          {
            key: 'DefaultType',
            get: function () {
              return {}
            }
          },
          {
            key: 'NAME',
            get: function () {
              throw new Error(
                'You have to implement the static method "NAME", for each component!'
              )
            }
          }
        ]),
        e
      )
    })(),
    ce = (function (e) {
      function t (t, n) {
        var i
        return (
          (i = e.call(this) || this),
          (t = O(t))
            ? ((i._element = t),
              (i._config = i._getConfig(n)),
              (function (e, t, n) {
                re.has(e) || re.set(e, new Map())
                var i = re.get(e)
                i.has(t) || 0 === i.size
                  ? i.set(t, n)
                  : console.error(
                      "Bootstrap doesn't allow more than one instance per element. Bound instance: " +
                        Array.from(i.keys())[0] +
                        '.'
                    )
              })(i._element, i.constructor.DATA_KEY, A(i)),
              i)
            : A(i)
        )
      }
      w(t, e)
      var n = t.prototype
      return (
        (n.dispose = function () {
          ;(function (e, t) {
            if (re.has(e)) {
              var n = re.get(e)
              n.delete(t), 0 === n.size && re.delete(e)
            }
          })(this._element, this.constructor.DATA_KEY),
            ee.off(this._element, this.constructor.EVENT_KEY)
          for (
            var e, t = L(Object.getOwnPropertyNames(this));
            !(e = t()).done;

          )
            this[e.value] = null
        }),
        (n._queueCallback = function (e, t, n) {
          void 0 === n && (n = !0), I(e, t, n)
        }),
        (n._getConfig = function (e) {
          return (
            (e = this._mergeConfigObj(e, this._element)),
            (e = this._configAfterMerge(e)),
            this._typeCheckConfig(e),
            e
          )
        }),
        (t.getInstance = function (e) {
          return (function (e, t) {
            return (re.has(e) && re.get(e).get(t)) || null
          })(O(e), this.DATA_KEY)
        }),
        (t.getOrCreateInstance = function (e, t) {
          return (
            void 0 === t && (t = {}),
            this.getInstance(e) || new this(e, 'object' == typeof t ? t : null)
          )
        }),
        (t.eventName = function (e) {
          return '' + e + this.EVENT_KEY
        }),
        y(t, null, [
          {
            key: 'VERSION',
            get: function () {
              return '5.3.0'
            }
          },
          {
            key: 'DATA_KEY',
            get: function () {
              return 'bs.' + this.NAME
            }
          },
          {
            key: 'EVENT_KEY',
            get: function () {
              return '.' + this.DATA_KEY
            }
          }
        ]),
        t
      )
    })(le),
    ue = 'backdrop',
    de = 'show',
    fe = 'mousedown.bs.' + ue,
    he = {
      className: 'modal-backdrop',
      clickCallback: null,
      isAnimated: !1,
      isVisible: !0,
      rootElement: 'body'
    },
    ge = {
      className: 'string',
      clickCallback: '(function|null)',
      isAnimated: 'boolean',
      isVisible: 'boolean',
      rootElement: '(element|string)'
    },
    me = (function (e) {
      function t (t) {
        var n
        return (
          ((n = e.call(this) || this)._config = n._getConfig(t)),
          (n._isAppended = !1),
          (n._element = null),
          n
        )
      }
      w(t, e)
      var n = t.prototype
      return (
        (n.show = function (e) {
          if (this._config.isVisible) {
            this._append()
            var t = this._getElement()
            this._config.isAnimated && M(t),
              t.classList.add(de),
              this._emulateAnimation(function () {
                F(e)
              })
          } else F(e)
        }),
        (n.hide = function (e) {
          var t = this
          this._config.isVisible
            ? (this._getElement().classList.remove(de),
              this._emulateAnimation(function () {
                t.dispose(), F(e)
              }))
            : F(e)
        }),
        (n.dispose = function () {
          this._isAppended &&
            (ee.off(this._element, fe),
            this._element.remove(),
            (this._isAppended = !1))
        }),
        (n._getElement = function () {
          if (!this._element) {
            var e = document.createElement('div')
            ;(e.className = this._config.className),
              this._config.isAnimated && e.classList.add('fade'),
              (this._element = e)
          }
          return this._element
        }),
        (n._configAfterMerge = function (e) {
          return (e.rootElement = O(e.rootElement)), e
        }),
        (n._append = function () {
          var e = this
          if (!this._isAppended) {
            var t = this._getElement()
            this._config.rootElement.append(t),
              ee.on(t, fe, function () {
                F(e._config.clickCallback)
              }),
              (this._isAppended = !0)
          }
        }),
        (n._emulateAnimation = function (e) {
          I(e, this._getElement(), this._config.isAnimated)
        }),
        y(t, null, [
          {
            key: 'Default',
            get: function () {
              return he
            }
          },
          {
            key: 'DefaultType',
            get: function () {
              return ge
            }
          },
          {
            key: 'NAME',
            get: function () {
              return ue
            }
          }
        ]),
        t
      )
    })(le),
    ve = '.bs.focustrap',
    pe = 'focusin' + ve,
    _e = 'keydown.tab' + ve,
    ye = 'backward',
    be = { autofocus: !0, trapElement: null },
    we = { autofocus: 'boolean', trapElement: 'element' },
    Ee = (function (e) {
      function t (t) {
        var n
        return (
          ((n = e.call(this) || this)._config = n._getConfig(t)),
          (n._isActive = !1),
          (n._lastTabNavDirection = null),
          n
        )
      }
      w(t, e)
      var n = t.prototype
      return (
        (n.activate = function () {
          var e = this
          this._isActive ||
            (this._config.autofocus && this._config.trapElement.focus(),
            ee.off(document, ve),
            ee.on(document, pe, function (t) {
              return e._handleFocusin(t)
            }),
            ee.on(document, _e, function (t) {
              return e._handleKeydown(t)
            }),
            (this._isActive = !0))
        }),
        (n.deactivate = function () {
          this._isActive && ((this._isActive = !1), ee.off(document, ve))
        }),
        (n._handleFocusin = function (e) {
          var t = this._config.trapElement
          if (
            e.target !== document &&
            e.target !== t &&
            !t.contains(e.target)
          ) {
            var n = ie.focusableChildren(t)
            0 === n.length
              ? t.focus()
              : this._lastTabNavDirection === ye
              ? n[n.length - 1].focus()
              : n[0].focus()
          }
        }),
        (n._handleKeydown = function (e) {
          'Tab' === e.key &&
            (this._lastTabNavDirection = e.shiftKey ? ye : 'forward')
        }),
        y(t, null, [
          {
            key: 'Default',
            get: function () {
              return be
            }
          },
          {
            key: 'DefaultType',
            get: function () {
              return we
            }
          },
          {
            key: 'NAME',
            get: function () {
              return 'focustrap'
            }
          }
        ]),
        t
      )
    })(le),
    Ae = '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top',
    Se = '.sticky-top',
    Le = 'padding-right',
    ke = 'margin-right',
    Ce = (function () {
      function e () {
        this._element = document.body
      }
      var t = e.prototype
      return (
        (t.getWidth = function () {
          var e = document.documentElement.clientWidth
          return Math.abs(window.innerWidth - e)
        }),
        (t.hide = function () {
          var e = this.getWidth()
          this._disableOverFlow(),
            this._setElementAttributes(this._element, Le, function (t) {
              return t + e
            }),
            this._setElementAttributes(Ae, Le, function (t) {
              return t + e
            }),
            this._setElementAttributes(Se, ke, function (t) {
              return t - e
            })
        }),
        (t.reset = function () {
          this._resetElementAttributes(this._element, 'overflow'),
            this._resetElementAttributes(this._element, Le),
            this._resetElementAttributes(Ae, Le),
            this._resetElementAttributes(Se, ke)
        }),
        (t.isOverflowing = function () {
          return this.getWidth() > 0
        }),
        (t._disableOverFlow = function () {
          this._saveInitialAttribute(this._element, 'overflow'),
            (this._element.style.overflow = 'hidden')
        }),
        (t._setElementAttributes = function (e, t, n) {
          var i = this,
            r = this.getWidth()
          this._applyManipulationCallback(e, function (e) {
            if (!(e !== i._element && window.innerWidth > e.clientWidth + r)) {
              i._saveInitialAttribute(e, t)
              var o = window.getComputedStyle(e).getPropertyValue(t)
              e.style.setProperty(t, n(Number.parseFloat(o)) + 'px')
            }
          })
        }),
        (t._saveInitialAttribute = function (e, t) {
          var n = e.style.getPropertyValue(t)
          n &&
            (function (e, t, n) {
              e.setAttribute('data-bs-' + se(t), n)
            })(e, t, n)
        }),
        (t._resetElementAttributes = function (e, t) {
          this._applyManipulationCallback(e, function (e) {
            var n = ae(e, t)
            null !== n
              ? ((function (e, t) {
                  e.removeAttribute('data-bs-' + se(t))
                })(e, t),
                e.style.setProperty(t, n))
              : e.style.removeProperty(t)
          })
        }),
        (t._applyManipulationCallback = function (e, t) {
          if (T(e)) t(e)
          else
            for (var n, i = L(ie.find(e, this._element)); !(n = i()).done; )
              t(n.value)
        }),
        e
      )
    })(),
    Te = '.bs.modal',
    Oe = 'hide' + Te,
    qe = 'hidePrevented' + Te,
    Ne = 'hidden' + Te,
    Me = 'show' + Te,
    De = 'shown' + Te,
    je = 'resize' + Te,
    xe = 'click.dismiss' + Te,
    Pe = 'mousedown.dismiss' + Te,
    Fe = 'keydown.dismiss' + Te,
    Ie = 'click' + Te + '.data-api',
    He = 'modal-open',
    Be = 'show',
    We = 'modal-static',
    ze = { backdrop: !0, focus: !0, keyboard: !0 },
    Ke = {
      backdrop: '(boolean|string)',
      focus: 'boolean',
      keyboard: 'boolean'
    },
    Ve = (function (e) {
      function t (t, n) {
        var i
        return (
          ((i = e.call(this, t, n) || this)._dialog = ie.findOne(
            '.modal-dialog',
            i._element
          )),
          (i._backdrop = i._initializeBackDrop()),
          (i._focustrap = i._initializeFocusTrap()),
          (i._isShown = !1),
          (i._isTransitioning = !1),
          (i._scrollBar = new Ce()),
          i._addEventListeners(),
          i
        )
      }
      w(t, e)
      var n = t.prototype
      return (
        (n.toggle = function (e) {
          return this._isShown ? this.hide() : this.show(e)
        }),
        (n.show = function (e) {
          var t = this
          this._isShown ||
            this._isTransitioning ||
            ee.trigger(this._element, Me, { relatedTarget: e })
              .defaultPrevented ||
            ((this._isShown = !0),
            (this._isTransitioning = !0),
            this._scrollBar.hide(),
            document.body.classList.add(He),
            this._adjustDialog(),
            this._backdrop.show(function () {
              return t._showElement(e)
            }))
        }),
        (n.hide = function () {
          var e = this
          this._isShown &&
            !this._isTransitioning &&
            (ee.trigger(this._element, Oe).defaultPrevented ||
              ((this._isShown = !1),
              (this._isTransitioning = !0),
              this._focustrap.deactivate(),
              this._element.classList.remove(Be),
              this._queueCallback(
                function () {
                  return e._hideModal()
                },
                this._element,
                this._isAnimated()
              )))
        }),
        (n.dispose = function () {
          ee.off(window, Te),
            ee.off(this._dialog, Te),
            this._backdrop.dispose(),
            this._focustrap.deactivate(),
            e.prototype.dispose.call(this)
        }),
        (n.handleUpdate = function () {
          this._adjustDialog()
        }),
        (n._initializeBackDrop = function () {
          return new me({
            isVisible: Boolean(this._config.backdrop),
            isAnimated: this._isAnimated()
          })
        }),
        (n._initializeFocusTrap = function () {
          return new Ee({ trapElement: this._element })
        }),
        (n._showElement = function (e) {
          var t = this
          document.body.contains(this._element) ||
            document.body.append(this._element),
            (this._element.style.display = 'block'),
            this._element.removeAttribute('aria-hidden'),
            this._element.setAttribute('aria-modal', !0),
            this._element.setAttribute('role', 'dialog'),
            (this._element.scrollTop = 0)
          var n = ie.findOne('.modal-body', this._dialog)
          n && (n.scrollTop = 0),
            M(this._element),
            this._element.classList.add(Be),
            this._queueCallback(
              function () {
                t._config.focus && t._focustrap.activate(),
                  (t._isTransitioning = !1),
                  ee.trigger(t._element, De, { relatedTarget: e })
              },
              this._dialog,
              this._isAnimated()
            )
        }),
        (n._addEventListeners = function () {
          var e = this
          ee.on(this._element, Fe, function (t) {
            'Escape' === t.key &&
              (e._config.keyboard ? e.hide() : e._triggerBackdropTransition())
          }),
            ee.on(window, je, function () {
              e._isShown && !e._isTransitioning && e._adjustDialog()
            }),
            ee.on(this._element, Pe, function (t) {
              ee.one(e._element, xe, function (n) {
                e._element === t.target &&
                  e._element === n.target &&
                  ('static' !== e._config.backdrop
                    ? e._config.backdrop && e.hide()
                    : e._triggerBackdropTransition())
              })
            })
        }),
        (n._hideModal = function () {
          var e = this
          ;(this._element.style.display = 'none'),
            this._element.setAttribute('aria-hidden', !0),
            this._element.removeAttribute('aria-modal'),
            this._element.removeAttribute('role'),
            (this._isTransitioning = !1),
            this._backdrop.hide(function () {
              document.body.classList.remove(He),
                e._resetAdjustments(),
                e._scrollBar.reset(),
                ee.trigger(e._element, Ne)
            })
        }),
        (n._isAnimated = function () {
          return this._element.classList.contains('fade')
        }),
        (n._triggerBackdropTransition = function () {
          var e = this
          if (!ee.trigger(this._element, qe).defaultPrevented) {
            var t =
                this._element.scrollHeight >
                document.documentElement.clientHeight,
              n = this._element.style.overflowY
            'hidden' === n ||
              this._element.classList.contains(We) ||
              (t || (this._element.style.overflowY = 'hidden'),
              this._element.classList.add(We),
              this._queueCallback(function () {
                e._element.classList.remove(We),
                  e._queueCallback(function () {
                    e._element.style.overflowY = n
                  }, e._dialog)
              }, this._dialog),
              this._element.focus())
          }
        }),
        (n._adjustDialog = function () {
          var e =
              this._element.scrollHeight >
              document.documentElement.clientHeight,
            t = this._scrollBar.getWidth(),
            n = t > 0
          if (n && !e) {
            var i = x() ? 'paddingLeft' : 'paddingRight'
            this._element.style[i] = t + 'px'
          }
          if (!n && e) {
            var r = x() ? 'paddingRight' : 'paddingLeft'
            this._element.style[r] = t + 'px'
          }
        }),
        (n._resetAdjustments = function () {
          ;(this._element.style.paddingLeft = ''),
            (this._element.style.paddingRight = '')
        }),
        (t.jQueryInterface = function (e, n) {
          return this.each(function () {
            var i = t.getOrCreateInstance(this, e)
            if ('string' == typeof e) {
              if (void 0 === i[e])
                throw new TypeError('No method named "' + e + '"')
              i[e](n)
            }
          })
        }),
        y(t, null, [
          {
            key: 'Default',
            get: function () {
              return ze
            }
          },
          {
            key: 'DefaultType',
            get: function () {
              return Ke
            }
          },
          {
            key: 'NAME',
            get: function () {
              return 'modal'
            }
          }
        ]),
        t
      )
    })(ce)
  ee.on(document, Ie, '[data-bs-toggle="modal"]', function (e) {
    var t = this,
      n = ie.getElementFromSelector(this)
    ;['A', 'AREA'].includes(this.tagName) && e.preventDefault(),
      ee.one(n, Me, function (e) {
        e.defaultPrevented ||
          ee.one(n, Ne, function () {
            q(t) && t.focus()
          })
      })
    var i = ie.findOne('.modal.show')
    i && Ve.getInstance(i).hide(), Ve.getOrCreateInstance(n).toggle(this)
  }),
    (function (e, t) {
      void 0 === t && (t = 'hide')
      var n = 'click.dismiss' + e.EVENT_KEY,
        i = e.NAME
      ee.on(document, n, '[data-bs-dismiss="' + i + '"]', function (n) {
        if (
          (['A', 'AREA'].includes(this.tagName) && n.preventDefault(), !N(this))
        ) {
          var r = ie.getElementFromSelector(this) || this.closest('.' + i)
          e.getOrCreateInstance(r)[t]()
        }
      })
    })(Ve),
    P(Ve)
  var Ye = '.bs.modal',
    Re = 'hidden' + Ye,
    $e = 'show' + Ye,
    Qe = 'shown' + Ye,
    Ue = 'resize' + Ye,
    Je = 'click' + Ye + '.data-api',
    Ze = '.modal-body',
    Ge = (function (e) {
      function t (t, n) {
        var i
        return (
          (i = e.call(this, t, n) || this)._chk_scrollbar(),
          i._event_shown_listener(),
          i
        )
      }
      w(t, e)
      var n = t.prototype
      return (
        (n._event_shown_listener = function () {
          var e = this
          ee.on(this._element, Qe, function () {
            var t = e._element.querySelector(Ze)
            e._chk_scrollbar_fn(e._element),
              t.classList.add('td-modal-body-shown')
          })
        }),
        (n._chk_scrollbar = function () {
          var e = this
          ee.on(window, Ue, function () {
            e._chk_scrollbar_fn(e._element)
          })
        }),
        (n._chk_scrollbar_fn = function (e) {
          var t = e.querySelector(Ze),
            n = t.clientHeight,
            i = t.scrollHeight
          window.innerWidth >= 768
            ? n != i
              ? (t.style.setProperty(
                  'padding-right',
                  Number.parseFloat(32) + 'px'
                ),
                t.style.setProperty(
                  'margin-right',
                  Number.parseFloat(20) + 'px'
                ))
              : t.removeAttribute('style')
            : n != i
            ? (t.style.setProperty(
                'padding-right',
                Number.parseFloat(8) + 'px'
              ),
              t.style.setProperty('margin-right', Number.parseFloat(0) + 'px'))
            : t.removeAttribute('style')
        }),
        t
      )
    })(Ve)
  ee.on(document, Je, '[data-bs-toggle="td-modal"]', function (e) {
    var t = this,
      n = ie.getElementFromSelector(this)
    ;['A', 'AREA'].includes(this.tagName) && e.preventDefault(),
      ee.one(n, $e, function (e) {
        e.defaultPrevented ||
          ee.one(n, Re, function () {
            q(t) && t.focus()
          })
      })
    var i = ie.findOne('.modal.show')
    i && Ge.getInstance(i).hide(), Ge.getOrCreateInstance(n).toggle(this)
  })
  var Xe = '.bs.collapse',
    et = 'show' + Xe,
    tt = 'shown' + Xe,
    nt = 'hide' + Xe,
    it = 'hidden' + Xe,
    rt = 'click' + Xe + '.data-api',
    ot = 'show',
    st = 'collapse',
    at = 'collapsing',
    lt = ':scope .' + st + ' .' + st,
    ct = '[data-bs-toggle="collapse"]',
    ut = { parent: null, toggle: !0 },
    dt = { parent: '(null|element)', toggle: 'boolean' },
    ft = (function (e) {
      function t (t, n) {
        var i
        ;((i = e.call(this, t, n) || this)._isTransitioning = !1),
          (i._triggerArray = [])
        for (var r, o = L(ie.find(ct)); !(r = o()).done; ) {
          var s = r.value,
            a = ie.getSelectorFromElement(s),
            l = ie.find(a).filter(function (e) {
              return e === i._element
            })
          null !== a && l.length && i._triggerArray.push(s)
        }
        return (
          i._initializeChildren(),
          i._config.parent ||
            i._addAriaAndCollapsedClass(i._triggerArray, i._isShown()),
          i._config.toggle && i.toggle(),
          i
        )
      }
      w(t, e)
      var n = t.prototype
      return (
        (n.toggle = function () {
          this._isShown() ? this.hide() : this.show()
        }),
        (n.show = function () {
          var e = this
          if (!this._isTransitioning && !this._isShown()) {
            var n = []
            if (
              !(this._config.parent &&
                (n = this._getFirstLevelChildren(
                  '.collapse.show, .collapse.collapsing'
                )
                  .filter(function (t) {
                    return t !== e._element
                  })
                  .map(function (e) {
                    return t.getOrCreateInstance(e, { toggle: !1 })
                  })),
              (n.length && n[0]._isTransitioning) ||
                ee.trigger(this._element, et).defaultPrevented)
            ) {
              for (var i, r = L(n); !(i = r()).done; ) i.value.hide()
              var o = this._getDimension()
              this._element.classList.remove(st),
                this._element.classList.add(at),
                (this._element.style[o] = 0),
                this._addAriaAndCollapsedClass(this._triggerArray, !0),
                (this._isTransitioning = !0)
              var s = 'scroll' + (o[0].toUpperCase() + o.slice(1))
              this._queueCallback(
                function () {
                  ;(e._isTransitioning = !1),
                    e._element.classList.remove(at),
                    e._element.classList.add(st, ot),
                    (e._element.style[o] = ''),
                    ee.trigger(e._element, tt)
                },
                this._element,
                !0
              ),
                (this._element.style[o] = this._element[s] + 'px')
            }
          }
        }),
        (n.hide = function () {
          var e = this
          if (
            !this._isTransitioning &&
            this._isShown() &&
            !ee.trigger(this._element, nt).defaultPrevented
          ) {
            var t = this._getDimension()
            ;(this._element.style[t] =
              this._element.getBoundingClientRect()[t] + 'px'),
              M(this._element),
              this._element.classList.add(at),
              this._element.classList.remove(st, ot)
            for (var n, i = L(this._triggerArray); !(n = i()).done; ) {
              var r = n.value,
                o = ie.getElementFromSelector(r)
              o && !this._isShown(o) && this._addAriaAndCollapsedClass([r], !1)
            }
            ;(this._isTransitioning = !0),
              (this._element.style[t] = ''),
              this._queueCallback(
                function () {
                  ;(e._isTransitioning = !1),
                    e._element.classList.remove(at),
                    e._element.classList.add(st),
                    ee.trigger(e._element, it)
                },
                this._element,
                !0
              )
          }
        }),
        (n._isShown = function (e) {
          return void 0 === e && (e = this._element), e.classList.contains(ot)
        }),
        (n._configAfterMerge = function (e) {
          return (e.toggle = Boolean(e.toggle)), (e.parent = O(e.parent)), e
        }),
        (n._getDimension = function () {
          return this._element.classList.contains('collapse-horizontal')
            ? 'width'
            : 'height'
        }),
        (n._initializeChildren = function () {
          if (this._config.parent)
            for (
              var e, t = L(this._getFirstLevelChildren(ct));
              !(e = t()).done;

            ) {
              var n = e.value,
                i = ie.getElementFromSelector(n)
              i && this._addAriaAndCollapsedClass([n], this._isShown(i))
            }
        }),
        (n._getFirstLevelChildren = function (e) {
          var t = ie.find(lt, this._config.parent)
          return ie.find(e, this._config.parent).filter(function (e) {
            return !t.includes(e)
          })
        }),
        (n._addAriaAndCollapsedClass = function (e, t) {
          if (e.length)
            for (var n, i = L(e); !(n = i()).done; ) {
              var r = n.value
              r.classList.toggle('collapsed', !t),
                r.setAttribute('aria-expanded', t)
            }
        }),
        (t.jQueryInterface = function (e) {
          var n = {}
          return (
            'string' == typeof e && /show|hide/.test(e) && (n.toggle = !1),
            this.each(function () {
              var i = t.getOrCreateInstance(this, n)
              if ('string' == typeof e) {
                if (void 0 === i[e])
                  throw new TypeError('No method named "' + e + '"')
                i[e]()
              }
            })
          )
        }),
        y(t, null, [
          {
            key: 'Default',
            get: function () {
              return ut
            }
          },
          {
            key: 'DefaultType',
            get: function () {
              return dt
            }
          },
          {
            key: 'NAME',
            get: function () {
              return 'collapse'
            }
          }
        ]),
        t
      )
    })(ce)
  ee.on(document, rt, ct, function (e) {
    ;('A' === e.target.tagName ||
      (e.delegateTarget && 'A' === e.delegateTarget.tagName)) &&
      e.preventDefault()
    for (
      var t, n = L(ie.getMultipleElementsFromSelector(this));
      !(t = n()).done;

    ) {
      var i = t.value
      ft.getOrCreateInstance(i, { toggle: !1 }).toggle()
    }
  }),
    P(ft)
  var ht = '.bs.collapse',
    gt = 'click' + ht + '.data-api',
    mt = 'show' + ht,
    vt = 'shown' + ht,
    pt = 'collapse',
    _t = 'collapsing',
    yt = '[data-bs-toggle="td-collapse"]',
    bt = (function (e) {
      function t (t, n) {
        var i
        ;((i = e.call(this, t, n) || this)._isTransitioning = !1),
          (i._triggerArray = [])
        for (var r, o = L(ie.find(yt)); !(r = o()).done; ) {
          var s = r.value,
            a = ie.getSelectorFromElement(s),
            l = ie.find(a).filter(function (e) {
              return e === i._element
            })
          null !== a && l.length && i._triggerArray.push(s)
        }
        return i._initializeChildren(), i
      }
      w(t, e)
      var n = t.prototype
      return (
        (n.show = function () {
          var e = this
          if (!this._isTransitioning && !this._isShown()) {
            var n = []
            if (
              !(this._config.parent &&
                (n = this._getFirstLevelChildren(
                  '.collapse.show, .collapse.collapsing'
                )
                  .filter(function (t) {
                    return t !== e._element
                  })
                  .map(function (e) {
                    return t.getOrCreateInstance(e, { toggle: !1 })
                  })),
              (n.length && n[0]._isTransitioning) ||
                ee.trigger(this._element, mt).defaultPrevented)
            ) {
              for (var i, r = L(n); !(i = r()).done; ) i.value.hide()
              var o = this._getDimension()
              this._element.classList.remove(pt),
                this._element.classList.add(_t),
                (this._element.style[o] = 0),
                this._addAriaAndCollapsedClass(this._triggerArray, !0),
                (this._isTransitioning = !0)
              var s = 'scroll' + (o[0].toUpperCase() + o.slice(1))
              this._queueCallback(
                function () {
                  ;(e._isTransitioning = !1),
                    e._element.classList.remove(_t),
                    e._element.classList.add(pt, 'show'),
                    (e._element.style[o] = ''),
                    ee.trigger(e._element, vt)
                },
                this._element,
                !0
              ),
                (this._element.style[o] = this._element[s] + 'px')
            }
          }
        }),
        (n._initializeChildren = function () {
          if (this._config.parent)
            for (
              var e, t = L(this._getFirstLevelChildren(yt));
              !(e = t()).done;

            ) {
              var n = e.value,
                i = ie.getElementFromSelector(n)
              i && this._addAriaAndCollapsedClass([n], this._isShown(i))
            }
        }),
        (n._addAriaAndCollapsedClass = function (e, t) {
          if (e.length)
            for (var n, i = L(e); !(n = i()).done; ) {
              var r = n.value
              r.classList.toggle('collapsed', !t),
                r.setAttribute('aria-expanded', t)
            }
        }),
        t
      )
    })(ft)
  ee.on(document, gt, yt, function (e) {
    ;('A' === e.target.tagName ||
      (e.delegateTarget && 'A' === e.delegateTarget.tagName)) &&
      e.preventDefault()
    for (
      var t, n = L(ie.getMultipleElementsFromSelector(this));
      !(t = n()).done;

    ) {
      var i = t.value
      bt.getOrCreateInstance(i, { toggle: !1 }).toggle()
    }
  })
  var wt = 'td-side-nav-collapsed',
    Et = 'td-side-nav-item-link-label',
    At = 'badge',
    St = 'td-badge-dot',
    Lt = document.querySelectorAll('.td-side-nav'),
    kt = (function () {
      function e (e) {
        this.$baseObj = e
      }
      var t = e.prototype
      return (
        (t.init = function () {
          this.evt()
        }),
        (t.evt = function () {
          this.$baseObj.forEach(function (e) {
            var t = e.querySelector('.td-side-nav-button'),
              n = e.querySelectorAll('.td-side-nav-item-link')
            t &&
              (t.addEventListener('click', function (i) {
                e.classList.contains(wt)
                  ? (e.classList.remove(wt),
                    t.setAttribute('aria-expanded', 'true'),
                    n.forEach(function (e) {
                      var t = e.querySelector('.' + At)
                      t && (t.style.display = 'none')
                    }),
                    setTimeout(function () {
                      n.forEach(function (e) {
                        var t = e.querySelector('.' + Et),
                          n = e.querySelector('.' + At)
                        ;(t.style.display = 'block'),
                          n &&
                            (n.classList.remove(St),
                            (n.style.display = 'block'))
                      })
                    }, 450),
                    setTimeout(function () {
                      n.forEach(function (e) {
                        var t = e.querySelector('.' + Et),
                          n = e.querySelector('.' + At)
                        ;(t.style.opacity = '1'), n && (n.style.opacity = '1')
                      })
                    }, 500))
                  : (t.setAttribute('aria-expanded', 'false'),
                    n.forEach(function (e) {
                      var t = e.querySelector('.' + Et),
                        n = e.querySelector('.' + At)
                      ;(t.style.opacity = '0'), n && (n.style.opacity = '0')
                    }),
                    setTimeout(function () {
                      e.classList.add(wt),
                        n.forEach(function (e) {
                          var t = e.querySelector('.' + Et),
                            n = e.querySelector('.' + At)
                          ;(t.style.display = 'none'), n && n.classList.add(St)
                        })
                    }, 200),
                    setTimeout(function () {
                      n.forEach(function (e) {
                        var t = e.querySelector('.' + At)
                        t && (t.style.opacity = '1')
                      })
                    }, 500))
              }),
              n.forEach(function (e) {
                var n = e.querySelector('.' + Et)
                'false' == t.getAttribute('aria-expanded') &&
                  ((n.style.display = 'none'), (n.style.opacity = '0')),
                  ['focus', 'mouseover'].forEach(function (i) {
                    e.addEventListener(i, function () {
                      'false' == t.getAttribute('aria-expanded') &&
                        ((n.style.opacity = '1'), (n.style.display = 'block'))
                    })
                  }),
                  ['blur', 'mouseout'].forEach(function (i) {
                    e.addEventListener(i, function () {
                      'false' == t.getAttribute('aria-expanded') &&
                        ((n.style.opacity = '0'), (n.style.display = 'none'))
                    })
                  })
              }))
          })
        }),
        e
      )
    })()
  return (
    n.tdOnDOMContentLoaded(function () {
      new kt(Lt).init()
    }),
    { TdCommon: n, TdHeader: p, TdModal: Ge, TdCollapse: bt, TdSideNav: kt }
  )
})
//# sourceMappingURL=td-standards.bundle.js.map
