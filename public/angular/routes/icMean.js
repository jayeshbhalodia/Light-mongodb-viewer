'use strict';

/*!
 * jsonformatter
 * 
 * Version: 0.6.0 - 2016-08-27T12:58:03.306Z
 * License: Apache-2.0
 */
"use strict";
angular.module("jsonFormatter", ["RecursionHelper"]).provider("JSONFormatterConfig", function() {
    var n = !1,
        e = 100,
        t = 5;
    return {get hoverPreviewEnabled() {
            return n
        },
        set hoverPreviewEnabled(e) {
            n = !!e
        },
        get hoverPreviewArrayCount() {
            return e
        },
        set hoverPreviewArrayCount(n) {
            e = parseInt(n, 10)
        },
        get hoverPreviewFieldCount() {
            return t
        },
        set hoverPreviewFieldCount(n) {
            t = parseInt(n, 10)
        },
        $get: function() {
            return {
                hoverPreviewEnabled: n,
                hoverPreviewArrayCount: e,
                hoverPreviewFieldCount: t
            }
        }
    }
}).directive("jsonFormatter", ["RecursionHelper", "JSONFormatterConfig", function(n, e) {
    function t(n) {
        return n.replace('"', '"')
    }

    function r(n) {
        if (void 0 === n) return "";
        if (null === n) return "Object";
        if ("object" == typeof n && !n.constructor) return "Object";
        if (void 0 !== n.__proto__ && void 0 !== n.__proto__.constructor && void 0 !== n.__proto__.constructor.name) return n.__proto__.constructor.name;
        var e = /function (.{1,})\(/,
            t = e.exec(n.constructor.toString());
        return t && t.length > 1 ? t[1] : ""
    }

    function o(n) {
        return null === n ? "null" : typeof n
    }

    function s(n, e) {
        var r = o(n);
        return "null" === r || "undefined" === r ? r : ("string" === r && (e = '"' + t(e) + '"'), "function" === r ? n.toString().replace(/[\r\n]/g, "").replace(/\{.*\}/, "") + "{…}" : e)
    }

    function i(n) {
        var e = "";
        return angular.isObject(n) ? (e = r(n), angular.isArray(n) && (e += "[" + n.length + "]")) : e = s(n, n), e
    }

    function a(n) {
        n.isArray = function() {
            return angular.isArray(n.json)
        }, n.isObject = function() {
            return angular.isObject(n.json)
        }, n.getKeys = function() {
            if (n.isObject()) return Object.keys(n.json).map(function(n) {
                return "" === n ? '""' : n
            })
        }, n.type = o(n.json), n.hasKey = "undefined" != typeof n.key, n.getConstructorName = function() {
            return r(n.json)
        }, "string" === n.type && ("Invalid Date" !== new Date(n.json).toString() && (n.isDate = !0), 0 === n.json.indexOf("http") && (n.isUrl = !0)), n.isEmptyObject = function() {
            return n.getKeys() && !n.getKeys().length && n.isOpen && !n.isArray()
        }, n.isOpen = !!n.open, n.toggleOpen = function() {
            n.isOpen = !n.isOpen
        }, n.childrenOpen = function() {
            return n.open > 1 ? n.open - 1 : 0
        }, n.openLink = function(e) {
            e && (window.location.href = n.json)
        }, n.parseValue = function(e) {
            return s(n.json, e)
        }, n.showThumbnail = function() {
            return !!e.hoverPreviewEnabled && n.isObject() && !n.isOpen
        }, n.getThumbnail = function() {
            if (n.isArray()) return n.json.length > e.hoverPreviewArrayCount ? "Array[" + n.json.length + "]" : "[" + n.json.map(i).join(", ") + "]";
            var t = n.getKeys(),
                r = t.slice(0, e.hoverPreviewFieldCount),
                o = r.map(function(e) {
                    return e + ":" + i(n.json[e])
                }),
                s = t.length >= 5 ? "…" : "";
            return "{" + o.join(", ") + s + "}"
        }
    }
    return {
        templateUrl: "json-formatter.html",
        restrict: "E",
        replace: !0,
        scope: {
            json: "=",
            key: "=",
            open: "="
        },
        compile: function(e) {
            return n.compile(e, a)
        }
    }
}]), "object" == typeof module && (module.exports = "jsonFormatter"), angular.module("RecursionHelper", []).factory("RecursionHelper", ["$compile", function(n) {
    return {
        compile: function(e, t) {
            angular.isFunction(t) && (t = {
                post: t
            });
            var r, o = e.contents().remove();
            return {
                pre: t && t.pre ? t.pre : null,
                post: function(e, s) {
                    r || (r = n(o)), r(e, function(n) {
                        s.append(n)
                    }), t && t.post && t.post.apply(null, arguments)
                }
            }
        }
    }
}]), angular.module("jsonFormatter").run(["$templateCache", function(n) {
    n.put("json-formatter.html", '<div ng-init="isOpen = open && open > 0" class="json-formatter-row"><a ng-click="toggleOpen()"><span class="toggler {{isOpen ? \'open\' : \'\'}}" ng-if="isObject()"></span> <span class="key" ng-if="hasKey"><span class="key-text">{{key}}</span><span class="colon">:</span></span> <span class="value"><span ng-if="isObject()"><span class="constructor-name">{{getConstructorName(json)}}</span> <span ng-if="isArray()"><span class="bracket">[</span><span class="number">{{json.length}}</span><span class="bracket">]</span></span></span> <span ng-if="!isObject()" ng-click="openLink(isUrl)" class="{{type}}" ng-class="{date: isDate, url: isUrl}">{{parseValue(json)}}</span></span> <span ng-if="showThumbnail()" class="thumbnail-text">{{getThumbnail()}}</span></a><div class="children" ng-if="getKeys().length && isOpen"><json-formatter ng-repeat="key in getKeys() track by $index" json="json[key]" key="key" open="childrenOpen()"></json-formatter></div><div class="children empty object" ng-if="isEmptyObject()"></div><div class="children empty array" ng-if="getKeys() && !getKeys().length && isOpen && isArray()"></div></div>')
}]);


/**
 *
 */
var checkUserIsLoggedOrNot = function($q, $timeout, $http, $location, $rootScope, status) {

    // Initialize a new promise
    var deferred = $q.defer();

    // Make an AJAX call to check if the user is logged in
    $http.get('/users/me').success(function(user) {

        $rootScope.loggedUser = user;

        if (user == null || user == 'null') {
            user = false;
        }

        // Authenticated
        if (status && !user) {
            $timeout(deferred.reject);
            setTimeout(function() {
                window.location = '#!login';
            }, 100);
            return;
        }

        // 
        if (!status && user) {
            $timeout(deferred.reject);
            window.location = '#!/login';
        }

    }).error(function() {
        $timeout(deferred.reject);
    });

    $timeout(deferred.reject);

    return deferred.promise;
}

// --
// Generate guid for QR code 
var guid = (function() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return function() {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    };
})();

// Check if the user is logged in
var checkLoggedIn = function($q, $timeout, $http, $location, $rootScope) {
    checkUserIsLoggedOrNot($q, $timeout, $http, $location, $rootScope, true);
};

// Check if the user is logged in
var checkLoggedOut = function($q, $timeout, $http, $location, $rootScope) {
    checkUserIsLoggedOrNot($q, $timeout, $http, $location, $rootScope, false);
};

var dbMfgModule = angular.module('Mfg', ['ngCookies', 'ngResource', 'ui.bootstrap', 'ui.router', 'toastr', 'ngAnimate', 'jsonFormatter']);


dbMfgModule.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',

    function($stateProvider, $urlRouterProvider, $locationProvider) {

        $locationProvider.html5Mode({
            enabled: false,
            requireBase: true
        }).hashPrefix('!');

        $stateProvider.state('ic-signup', {
            url: '/signup',
            templateUrl: '/angular/views/users/signup.html',
            resolve: {
                loggedin: checkLoggedOut
            }
        });

        $stateProvider.state('login', {
            url: '/login',
            templateUrl: 'angular/views/users/login.html',
            resolve: {
                loggedin: checkLoggedOut
            }
        });

        $stateProvider.state('forgot-password', {
            url: '/forgot-password',
            templateUrl: '/angular/views/users/forgot-password.html',
            resolve: {
                loggedin: checkLoggedOut
            }
        });

        $stateProvider.state('my-profile', {
            url: '/profile',
            templateUrl: '/angular/views/users/profile-edit.html',
            resolve: {
                loggedin: checkLoggedIn
            }
        });

        $stateProvider.state('change-password', {
            url: '/change-password',
            templateUrl: '/angular/views/users/change-password.html',
            resolve: {
                loggedin: checkLoggedIn
            }
        });


        // $stateProvider.state('dashboard', {
        //     url: '/dashboard',
        //     templateUrl: '/angular/views/dashboard.html',
        //     resolve: {
        //         loggedin: checkLoggedIn
        //     }
        // });

        $stateProvider.state('reset-password', {
            url: '/reset/:token',
            templateUrl: '/angular/views/users/reset-password.html'
        });


        $stateProvider.state('dashboard', {
            url: '/',
            templateUrl: '/angular/views/dashboard.html'
        });



        $urlRouterProvider.otherwise('/');
        // $urlRouterProvider.otherwise('/dashboard');

    }
]);

angular.element(document).ready(function() {
    if (window.location.hash === '#_=_') window.location.hash = '#!';
    angular.bootstrap(document, ['Mfg']);
});