// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        globalObject
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"9xcFU":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Settings", ()=>Settings);
var _react = require("react");
var _reactDefault = parcelHelpers.interopDefault(_react);
var _client = require("react-dom/client");
var _styledComponents = require("styled-components");
var _layout = require("./components/Layout");
var _types = require("../types/types");
var _useReplicant = require("../utils/use-replicant");
var _weaponDatabase = require("../utils/WeaponDatabase");
const weaponClassNames = (0, _weaponDatabase.getWeaponClassNames)();
function Settings() {
    const [mode, setMode] = (0, _useReplicant.useReplicant)('mode', {
        defaultValue: (0, _types.WeaponMode).Salmon
    });
    const [filter, setFilter] = (0, _useReplicant.useReplicant)('filter', {
        defaultValue: {
            weaponClasses: weaponClassNames.slice(),
            firstKit: true,
            secondKit: true,
            thirdKit: true,
            baseKit: true,
            cosmeticKit: true,
            seen: true,
            unseen: true
        }
    });
    const setFilterWeaponClass = (0, _react.useCallback)((weaponClass)=>{
        if (filter.weaponClasses.includes(weaponClass)) setFilter({
            ...filter,
            weaponClasses: filter.weaponClasses.filter((value)=>value !== weaponClass)
        });
        else setFilter({
            ...filter,
            weaponClasses: [
                ...filter.weaponClasses,
                weaponClass
            ]
        });
    }, [
        filter
    ]);
    const [progressBar, setProgressBar] = (0, _useReplicant.useReplicant)('progressBar', {
        defaultValue: true
    });
    const [background, setBackground] = (0, _useReplicant.useReplicant)('background', {
        defaultValue: (0, _types.BackgroundMode).Transparent
    });
    return /*#__PURE__*/ (0, _reactDefault.default).createElement(Wrapper, {
        __source: {
            fileName: "src/dashboard/Settings.tsx",
            lineNumber: 44,
            columnNumber: 10
        },
        __self: this
    }, /*#__PURE__*/ (0, _reactDefault.default).createElement((0, _layout.HeadText), {
        $content: "Mode",
        __source: {
            fileName: "src/dashboard/Settings.tsx",
            lineNumber: 45,
            columnNumber: 5
        },
        __self: this
    }, "Mode"), /*#__PURE__*/ (0, _reactDefault.default).createElement(Row, {
        __source: {
            fileName: "src/dashboard/Settings.tsx",
            lineNumber: 46,
            columnNumber: 5
        },
        __self: this
    }, /*#__PURE__*/ (0, _reactDefault.default).createElement((0, _layout.SettingsButton), {
        $content: "Standard",
        $colorTag: "standard",
        $selected: mode === (0, _types.WeaponMode).Standard,
        onClick: ()=>{
            setMode((0, _types.WeaponMode).Standard);
        },
        __source: {
            fileName: "src/dashboard/Settings.tsx",
            lineNumber: 47,
            columnNumber: 6
        },
        __self: this
    }, "Standard"), /*#__PURE__*/ (0, _reactDefault.default).createElement((0, _layout.SettingsButton), {
        $content: "Salmon Run",
        $colorTag: "salmon",
        $selected: mode === (0, _types.WeaponMode).Salmon,
        onClick: ()=>{
            setMode((0, _types.WeaponMode).Salmon);
        },
        __source: {
            fileName: "src/dashboard/Settings.tsx",
            lineNumber: 50,
            columnNumber: 6
        },
        __self: this
    }, "Salmon Run"), /*#__PURE__*/ (0, _reactDefault.default).createElement((0, _layout.SettingsButton), {
        $content: "Grizzco Only",
        $colorTag: "grizzco",
        $selected: mode === (0, _types.WeaponMode).Grizzco,
        onClick: ()=>{
            setMode((0, _types.WeaponMode).Grizzco);
        },
        __source: {
            fileName: "src/dashboard/Settings.tsx",
            lineNumber: 53,
            columnNumber: 6
        },
        __self: this
    }, "Grizzco Only"), /*#__PURE__*/ (0, _reactDefault.default).createElement((0, _layout.SettingsButton), {
        $content: "Side Order",
        $colorTag: "order",
        $selected: mode === (0, _types.WeaponMode).Order,
        onClick: ()=>{
            setMode((0, _types.WeaponMode).Order);
        },
        __source: {
            fileName: "src/dashboard/Settings.tsx",
            lineNumber: 56,
            columnNumber: 6
        },
        __self: this
    }, "Side Order")), /*#__PURE__*/ (0, _reactDefault.default).createElement((0, _layout.HeadText), {
        $content: "Filters",
        __source: {
            fileName: "src/dashboard/Settings.tsx",
            lineNumber: 60,
            columnNumber: 5
        },
        __self: this
    }, "Filters"), /*#__PURE__*/ (0, _reactDefault.default).createElement(Row, {
        __source: {
            fileName: "src/dashboard/Settings.tsx",
            lineNumber: 61,
            columnNumber: 5
        },
        __self: this
    }, weaponClassNames.map((weaponClass, index)=>/*#__PURE__*/ (0, _reactDefault.default).createElement((0, _layout.SettingsButton), {
            key: index,
            $content: weaponClass,
            $colorTag: weaponClass.toLowerCase(),
            $selected: filter.weaponClasses.includes(weaponClass),
            onClick: ()=>{
                setFilterWeaponClass(weaponClass);
            },
            __source: {
                fileName: "src/dashboard/Settings.tsx",
                lineNumber: 62,
                columnNumber: 52
            },
            __self: this
        }, weaponClass)), /*#__PURE__*/ (0, _reactDefault.default).createElement((0, _layout.SettingsButton), {
        $content: "First Kits",
        $colorTag: "first",
        $selected: filter.firstKit,
        onClick: ()=>{
            setFilter({
                ...filter,
                firstKit: !filter.firstKit
            });
        },
        __source: {
            fileName: "src/dashboard/Settings.tsx",
            lineNumber: 65,
            columnNumber: 6
        },
        __self: this
    }, "First Kits"), /*#__PURE__*/ (0, _reactDefault.default).createElement((0, _layout.SettingsButton), {
        $content: "Second Kits",
        $colorTag: "second",
        $selected: filter.secondKit,
        onClick: ()=>{
            setFilter({
                ...filter,
                secondKit: !filter.secondKit
            });
        },
        __source: {
            fileName: "src/dashboard/Settings.tsx",
            lineNumber: 71,
            columnNumber: 6
        },
        __self: this
    }, "Second Kits"), /*#__PURE__*/ (0, _reactDefault.default).createElement((0, _layout.SettingsButton), {
        $content: "Third Kits",
        $colorTag: "third",
        $selected: filter.thirdKit,
        onClick: ()=>{
            setFilter({
                ...filter,
                thirdKit: !filter.thirdKit
            });
        },
        __source: {
            fileName: "src/dashboard/Settings.tsx",
            lineNumber: 77,
            columnNumber: 6
        },
        __self: this
    }, "Third Kits"), /*#__PURE__*/ (0, _reactDefault.default).createElement((0, _layout.SettingsButton), {
        $content: "Base Kits",
        $colorTag: "standard",
        $selected: filter.baseKit,
        onClick: ()=>{
            setFilter({
                ...filter,
                baseKit: !filter.baseKit
            });
        },
        __source: {
            fileName: "src/dashboard/Settings.tsx",
            lineNumber: 83,
            columnNumber: 6
        },
        __self: this
    }, "Base Kits"), /*#__PURE__*/ (0, _reactDefault.default).createElement((0, _layout.SettingsButton), {
        $content: "Cosmetics",
        $colorTag: "order",
        $selected: filter.cosmeticKit,
        onClick: ()=>{
            setFilter({
                ...filter,
                cosmeticKit: !filter.cosmeticKit
            });
        },
        __source: {
            fileName: "src/dashboard/Settings.tsx",
            lineNumber: 89,
            columnNumber: 6
        },
        __self: this
    }, "Cosmetics")), /*#__PURE__*/ (0, _reactDefault.default).createElement((0, _layout.HeadText), {
        $content: "Dashboard Filters",
        __source: {
            fileName: "src/dashboard/Settings.tsx",
            lineNumber: 97,
            columnNumber: 5
        },
        __self: this
    }, "Dashboard Filters"), /*#__PURE__*/ (0, _reactDefault.default).createElement(Row, {
        __source: {
            fileName: "src/dashboard/Settings.tsx",
            lineNumber: 98,
            columnNumber: 5
        },
        __self: this
    }, /*#__PURE__*/ (0, _reactDefault.default).createElement((0, _layout.SettingsButton), {
        $content: "Unseen",
        $colorTag: "reset",
        $selected: filter.unseen,
        onClick: ()=>{
            setFilter({
                ...filter,
                unseen: !filter.unseen
            });
        },
        __source: {
            fileName: "src/dashboard/Settings.tsx",
            lineNumber: 99,
            columnNumber: 6
        },
        __self: this
    }, "Unseen"), /*#__PURE__*/ (0, _reactDefault.default).createElement((0, _layout.SettingsButton), {
        $content: "Seen",
        $colorTag: "import",
        $selected: filter.seen,
        onClick: ()=>{
            setFilter({
                ...filter,
                seen: !filter.seen
            });
        },
        __source: {
            fileName: "src/dashboard/Settings.tsx",
            lineNumber: 105,
            columnNumber: 6
        },
        __self: this
    }, "Seen")), /*#__PURE__*/ (0, _reactDefault.default).createElement((0, _layout.HeadText), {
        $content: "Progress Bar",
        __source: {
            fileName: "src/dashboard/Settings.tsx",
            lineNumber: 112,
            columnNumber: 5
        },
        __self: this
    }, "Progress Bar"), /*#__PURE__*/ (0, _reactDefault.default).createElement(Row, {
        __source: {
            fileName: "src/dashboard/Settings.tsx",
            lineNumber: 113,
            columnNumber: 5
        },
        __self: this
    }, /*#__PURE__*/ (0, _reactDefault.default).createElement((0, _layout.SettingsButton), {
        $content: "Off",
        $colorTag: "reset",
        $selected: !progressBar,
        onClick: ()=>{
            setProgressBar(false);
        },
        __source: {
            fileName: "src/dashboard/Settings.tsx",
            lineNumber: 114,
            columnNumber: 6
        },
        __self: this
    }, "Off"), /*#__PURE__*/ (0, _reactDefault.default).createElement((0, _layout.SettingsButton), {
        $content: "On",
        $colorTag: "import",
        $selected: progressBar,
        onClick: ()=>{
            setProgressBar(true);
        },
        __source: {
            fileName: "src/dashboard/Settings.tsx",
            lineNumber: 117,
            columnNumber: 6
        },
        __self: this
    }, "On")), /*#__PURE__*/ (0, _reactDefault.default).createElement((0, _layout.HeadText), {
        $content: "Background",
        __source: {
            fileName: "src/dashboard/Settings.tsx",
            lineNumber: 121,
            columnNumber: 5
        },
        __self: this
    }, "Background"), /*#__PURE__*/ (0, _reactDefault.default).createElement(Row, {
        __source: {
            fileName: "src/dashboard/Settings.tsx",
            lineNumber: 122,
            columnNumber: 5
        },
        __self: this
    }, /*#__PURE__*/ (0, _reactDefault.default).createElement((0, _layout.SettingsButton), {
        $content: "Transparent",
        $colorTag: "transparent",
        $selected: background === (0, _types.BackgroundMode).Transparent,
        onClick: ()=>{
            setBackground((0, _types.BackgroundMode).Transparent);
        },
        __source: {
            fileName: "src/dashboard/Settings.tsx",
            lineNumber: 123,
            columnNumber: 6
        },
        __self: this
    }, "Transparent"), /*#__PURE__*/ (0, _reactDefault.default).createElement((0, _layout.SettingsButton), {
        $content: "Black",
        $colorTag: "black",
        $selected: background === (0, _types.BackgroundMode).Black,
        onClick: ()=>{
            setBackground((0, _types.BackgroundMode).Black);
        },
        __source: {
            fileName: "src/dashboard/Settings.tsx",
            lineNumber: 126,
            columnNumber: 6
        },
        __self: this
    }, "Black"), /*#__PURE__*/ (0, _reactDefault.default).createElement((0, _layout.SettingsButton), {
        $content: "White",
        $colorTag: "white",
        $selected: background === (0, _types.BackgroundMode).White,
        onClick: ()=>{
            setBackground((0, _types.BackgroundMode).White);
        },
        __source: {
            fileName: "src/dashboard/Settings.tsx",
            lineNumber: 129,
            columnNumber: 6
        },
        __self: this
    }, "White")));
}
const Wrapper = (0, _styledComponents.styled).div.withConfig({
    displayName: "Settings__Wrapper",
    componentId: "sc-16kq4wv-0"
})([
    "position:relative;width:100%;padding:15px 5px;display:grid;grid-template-columns:140px 1fr;align-items:center;text-align:right;gap:15px;"
]);
const Row = (0, _styledComponents.styled).div.withConfig({
    displayName: "Settings__Row",
    componentId: "sc-16kq4wv-1"
})([
    "position:relative;width:100%;display:flex;flex-direction:row;flex-wrap:wrap;gap:5px;"
]);
const root = (0, _client.createRoot)(document.getElementById('root'));
root.render(/*#__PURE__*/ (0, _reactDefault.default).createElement(Settings, {
    __source: {
        fileName: "src/dashboard/Settings.tsx",
        lineNumber: 144,
        columnNumber: 13
    },
    __self: undefined
}));

},{"react":"bH1AQ","react-dom/client":"i5cPj","styled-components":"9xpRL","./components/Layout":"72fYZ","../types/types":"2nPdh","../utils/use-replicant":"8lJRU","../utils/WeaponDatabase":"kbTcL","@parcel/transformer-js/src/esmodule-helpers.js":"hvLRG"}]},["9xcFU"], "9xcFU", "parcelRequire94c2")

//# sourceMappingURL=settings.01788f3c.js.map
