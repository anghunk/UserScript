// ==UserScript==
// @name         AI验证码自动识别填充
// @namespace    https://github.com/anghunk/UserScript
// @version      1.2.3
// @author       anghunk
// @description  自动识别网页上的验证码并填充到输入框中，点击识别图标触发识别。
// @license      Apache-2.0
// @icon         https://raw.githubusercontent.com/anghunk/UserScript/refs/heads/main/CAPTCHA-automatic-recognition/src/assets/logo.png
// @match        *://*/*
// @require      https://unpkg.com/vue@3.4.38/dist/vue.global.prod.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(t=>{if(typeof GM_addStyle=="function"){GM_addStyle(t);return}const o=document.createElement("style");o.textContent=t,document.head.append(o)})(` .captcha-recognition-container{font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol!important;font-size:14px!important;line-height:1.5!important;color:#333!important;box-sizing:border-box!important}.captcha-recognition-container *,.captcha-recognition-container *:before,.captcha-recognition-container *:after{box-sizing:border-box!important;font-family:inherit!important}.captcha-recognition-container input,.captcha-recognition-container textarea,.captcha-recognition-container select,.captcha-recognition-container button{font-family:inherit!important;font-size:inherit!important;line-height:inherit!important}.captcha-recognition-icon{display:inline-block!important;width:20px!important;height:20px!important;vertical-align:middle!important;margin-left:5px!important;background-image:url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>')!important;background-size:contain!important;cursor:pointer!important;position:relative!important;z-index:999!important;opacity:.7!important;transition:opacity .2s!important}.captcha-recognition-icon:hover{opacity:1!important}.input-group-append{position:relative!important}.input-group-append .captcha-recognition-icon{position:absolute!important;left:100%!important}.captcha-recognition-loading{background-image:url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.93 19.07l2.83-2.83"/><path d="M16.24 7.76l2.83-2.83"/></svg>')!important;animation:captcha-spin 1s linear infinite!important}@keyframes captcha-spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.captcha-recognition-success{background-image:url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="green" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>')!important}.captcha-recognition-error{background-image:url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>')!important}body.captcha-settings-open{overflow:hidden!important}.captcha-settings-overlay{position:fixed!important;top:0!important;left:0!important;width:100%!important;height:100%!important;background-color:#00000080!important;z-index:2147483646!important}.captcha-settings-modal{position:fixed!important;top:0!important;right:0!important;width:100%!important;max-width:400px!important;height:100vh!important;padding-bottom:60px!important;background-color:#fff!important;z-index:2147483647!important;text-align:left!important;box-shadow:-2px 0 10px #0000001a!important;transform:translate(100%)!important;transition:transform .3s linear!important}.captcha-settings-modal.show{transform:translate(0)!important}.captcha-settings-content{background-color:transparent!important;color:#333!important;padding:20px 15px 20px 20px!important;width:100%!important;height:100%!important;overflow-y:scroll!important;box-shadow:none!important;display:flex!important;flex-direction:column!important}.captcha-settings-content::-webkit-scrollbar,.settings-card::-webkit-scrollbar,.domain-textarea::-webkit-scrollbar,.captcha-settings-content textarea::-webkit-scrollbar{width:4px!important;height:8px!important}.captcha-settings-content::-webkit-scrollbar-track,.settings-card::-webkit-scrollbar-track,.domain-textarea::-webkit-scrollbar-track,.captcha-settings-content textarea::-webkit-scrollbar-track{background:#f1f1f1!important;border-radius:4px!important}.captcha-settings-content::-webkit-scrollbar-thumb,.settings-card::-webkit-scrollbar-thumb,.domain-textarea::-webkit-scrollbar-thumb,.captcha-settings-content textarea::-webkit-scrollbar-thumb{background:#ccc!important;border-radius:4px!important}.captcha-settings-content h3{margin-top:0!important;color:#333!important;font-size:18px!important;margin-bottom:16px!important;text-align:center!important;font-weight:700!important}.captcha-settings-content h3 span{font-size:14px!important}.captcha-settings-item{margin-bottom:12px!important;display:flex!important;flex-direction:column}.captcha-settings-item label{display:block!important;margin-bottom:4px!important;color:#555!important;font-size:14px!important}.captcha-settings-item input[type=text],.captcha-settings-item select,.captcha-settings-item textarea{width:100%!important;padding:0 8px!important;border:1px solid #ddd!important;background:none!important;border-radius:4px!important;font-size:14px!important;box-sizing:border-box!important;background:#fff!important;color:#333!important;margin:0!important}.captcha-settings-item input[type=text],.captcha-settings-item select{height:33px!important}.captcha-settings-item textarea{resize:vertical!important;min-height:80px!important}.captcha-settings-item small{font-size:12px!important;color:#777!important;display:block!important;margin-top:4px!important;word-break:break-all!important}.textarea-with-button{position:relative!important;display:flex!important;flex-direction:column!important}.use-default-prompt{position:absolute!important;top:5px!important;right:5px!important;background-color:#f1f1f1!important;border:1px solid #ddd!important;border-radius:4px!important;padding:4px 8px!important;font-size:12px!important;cursor:pointer!important;color:#333!important;transition:background-color .2s!important}.use-default-prompt:hover{background-color:#e4e4e4!important}.captcha-settings-buttons{display:flex!important;justify-content:flex-end!important;margin-top:20px!important;gap:10px!important;position:absolute!important;background:#fff!important;width:100%;bottom:0!important;left:0!important;z-index:10!important;padding:10px 15px;box-shadow:1px 2px 5px #0000001a}.captcha-settings-buttons button{padding:8px 16px!important;border:none!important;border-radius:4px!important;cursor:pointer!important;font-size:14px!important;transition:background-color .2s!important}.captcha-settings-buttons button:first-child{background-color:#1a73e8!important;color:#fff!important}.captcha-settings-buttons button:first-child:hover{background-color:#1557b0!important}.captcha-settings-buttons button:last-child{background-color:#f1f1f1!important;color:#333!important}.captcha-settings-buttons button:last-child:hover{background-color:#e4e4e4!important}.dev-settings-button{width:50px!important;height:50px!important;display:flex!important;align-items:center!important;justify-content:center!important;position:fixed!important;bottom:20px!important;right:20px!important;background-color:#fff!important;color:#fff!important;border-radius:50%!important;cursor:pointer!important;z-index:9999!important;font-size:14px!important;box-shadow:0 2px 5px #0003!important;transition:background-color .2s!important}.dev-settings-button svg{color:#1557b0}.dev-settings-button:hover{opacity:.9}#captcha-toast-container{position:fixed!important;top:20px!important;right:20px!important;z-index:9999!important;display:flex!important;flex-direction:column!important;gap:10px!important;pointer-events:none!important;text-align:left!important}.captcha-toast{width:280px!important;padding:12px 16px!important;border-radius:4px!important;box-shadow:0 4px 12px #00000026!important;color:#fff!important;font-size:14px!important;opacity:0!important;transform:translateY(-20px)!important;transition:all .3s ease!important;pointer-events:auto!important;word-break:break-word!important;text-align:left!important}.captcha-toast-show{opacity:1!important;transform:translateY(0)!important}.captcha-toast-hide{opacity:0!important;transform:translateY(-20px)!important}.captcha-toast-info{background-color:#1a73e8!important}.captcha-toast-success{background-color:#4caf50!important}.captcha-toast-error{background-color:#f44336!important}.input-with-button{position:relative!important;display:flex!important;align-items:center!important}.input-with-button input{flex:1!important}.test-api-button{background-color:#1a73e8!important;color:#fff!important;border:none!important;border-radius:4px!important;padding:8px 12px!important;font-size:14px!important;cursor:pointer!important;transition:background-color .2s,color .2s!important;min-width:80px!important;display:flex!important;justify-content:center!important;align-items:center!important;height:33px!important;margin-left:10px!important}.captcha-settings-tip{margin:16px 0!important;padding:12px!important;background-color:#f8f9fa!important;border-left:4px solid #1a73e8!important;border-radius:4px!important;font-size:13px!important;color:#333!important}.captcha-settings-tip p{margin:0 0 8px!important}.captcha-settings-tip ol{margin:8px 0 0!important;padding-left:24px!important}.captcha-settings-tip li{margin-bottom:4px!important}.test-api-button:hover{background-color:#1557b0!important}.test-api-button.test-loading{background-color:#f1f1f1!important;color:#666!important;position:relative!important}.test-api-button.test-loading:after{content:""!important;position:absolute!important;width:12px!important;height:12px!important;left:50%!important;top:50%!important;transform:translate(-50%,-50%);border:2px solid #666!important;border-radius:50%!important;border-top-color:transparent!important;animation:captcha-spin-transform 1s linear infinite!important}@keyframes captcha-spin-transform{0%{transform:translate(-50%,-50%) rotate(0)}to{transform:translate(-50%,-50%) rotate(360deg)}}.test-api-button.test-success{background-color:#4caf50!important;color:#fff!important}.test-api-button.test-error{background-color:#f44336!important;color:#fff!important}img[style="z-index: 2; position: absolute; bottom: -11px; left: 206px; width: 88px; height: 40px;"]+.captcha-recognition-icon{position:absolute!important;left:270px!important}.authcode.co>a:nth-child(2)>#authImage+.captcha-recognition-icon{display:none!important}#yzCode{position:relative}#yzCode>.captcha-recognition-icon{position:absolute!important;right:0!important}.code-plane .img-code+.captcha-recognition-icon{position:absolute!important}.settings-nav{display:flex!important;border-bottom:1px solid #eee!important;margin-bottom:20px!important;padding-bottom:2px!important}.settings-nav::-webkit-scrollbar{display:none!important}.settings-nav-item{padding:10px 15px!important;cursor:pointer!important;font-size:14px!important;color:#666!important;position:relative!important;transition:all .3s!important;-webkit-user-select:none!important;user-select:none!important;white-space:nowrap!important}.settings-nav-item:hover,.settings-nav-item.active{color:#1a73e8!important}.settings-nav-item.active:after{content:""!important;position:absolute!important;bottom:-2px!important;left:0!important;width:100%!important;height:2px!important;background-color:#1a73e8!important;border-radius:2px!important}.settings-content{flex:1!important;position:relative!important}.settings-content-tab{animation:captcha-fadeIn .3s ease!important;width:100%!important}@keyframes captcha-fadeIn{0%{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}.settings-card{background-color:#f9f9f9!important;border-radius:8px!important;padding:15px!important;margin-bottom:15px!important;border:1px solid #eee!important;box-shadow:0 2px 4px #0000000d!important;height:100%!important;display:flex!important;flex-direction:column!important;overflow-y:auto!important}.settings-card-title{font-weight:700!important;margin-bottom:12px!important;color:#333!important;font-size:15px!important;display:flex!important;align-items:center!important;justify-content:space-between!important}.settings-card-title .api-type{color:#1a73e8!important}.settings-section{margin-bottom:20px!important}.settings-section-title{font-weight:700!important;margin-bottom:10px!important;color:#333!important;font-size:15px!important;border-bottom:1px solid #eee!important;padding-bottom:5px!important}.advanced-settings-warning{font-size:12px!important;color:#ff4d4f!important;margin-bottom:10px!important;font-weight:700!important;padding:8px!important;background-color:#fff2f0!important;border-radius:4px!important;border:1px solid #ffccc7!important}.tutorial-link{font-size:12px!important;color:#1890ff!important;margin-left:8px!important;text-decoration:none!important;font-weight:400!important}.tutorial-link:hover{text-decoration:underline!important}.custom-selectors{display:flex!important;flex-direction:column!important;gap:8px!important}.selector-item{display:flex!important;align-items:center!important;gap:8px!important}.selector-item input{flex:1!important}.remove-selector{background-color:#ff4d4f!important;color:#fff!important;border:none!important;border-radius:50%!important;width:24px!important;height:24px!important;font-size:16px!important;line-height:1!important;cursor:pointer!important;display:flex!important;align-items:center!important;justify-content:center!important;padding:0!important}.add-selector{margin-top:8px!important;background-color:#1890ff!important;color:#fff!important;border:none!important;border-radius:4px!important;padding:4px 12px!important;font-size:14px!important;cursor:pointer!important;align-self:flex-start!important}.add-selector:hover{background-color:#40a9ff!important}.remove-selector:hover{background-color:#ff7875!important}.domain-textarea{width:100%!important;border:1px solid #ddd!important;border-radius:4px!important;padding:8px!important;resize:vertical!important;font-family:monospace!important;font-size:14px!important}.reload-rules-button{display:inline-flex!important;align-items:center!important;justify-content:center!important;padding:6px 12px!important;height:34px!important;font-size:14px!important;border-radius:4px!important;border:1px solid #ddd!important;background-color:#f7f7f7!important;cursor:pointer!important;transition:all .3s!important;min-width:120px!important}.reload-rules-button:hover{background-color:#e7e7e7!important}.reload-rules-button.test-loading{background-color:#f5f5f5!important;position:relative!important;color:transparent!important}.reload-rules-button.test-loading:after{content:""!important;width:16px!important;height:16px!important;border:2px solid #666!important;border-top-color:transparent!important;border-radius:50%!important;position:absolute!important;left:50%!important;top:50%!important;margin-left:-8px!important;margin-top:-8px!important;animation:captcha-spin 1s linear infinite!important}.reload-rules-button.test-success{background-color:#eaf7ea!important;border-color:#c3e6c3!important;color:#2a862a!important}.reload-rules-button.test-error{background-color:#fce7e7!important;border-color:#f5c2c2!important;color:#d63030!important}.rules-management{display:flex!important;flex-direction:column!important;gap:10px!important}.rules-url-input{display:flex!important;flex-direction:column!important;gap:5px!important}.rules-url-input input{width:100%!important;padding:8px!important;border:1px solid #ddd!important;border-radius:4px!important;font-size:14px!important}.rules-url-input small{color:#666!important;font-size:12px!important}@media (max-width: 768px){.settings-nav-item{padding:10px!important}} `);

(function (vue) {
  'use strict';

  const name = "CAPTCHA-automatic-recognition";
  const version = "1.2.3";
  const author = "anghunk";
  const description = "Automatically recognize the CAPTCHA on the webpage and fill it into the input box, click the recognition icon to trigger recognition.";
  const type = "module";
  const license = "Apache-2.0";
  const scripts = {
    dev: "vite --mode development",
    build: "vite build",
    preview: "vite preview"
  };
  const dependencies = {
    vue: "^3.4.27",
    webdav: "^5.7.1",
    axios: "^1.6.2"
  };
  const devDependencies = {
    "@vitejs/plugin-vue": "^5.0.4",
    less: "^4.1.0",
    "less-loader": "^8.0.0",
    "style-loader": "^2.0.0",
    vite: "^5.2.12",
    "vite-plugin-monkey": "^4.0.0"
  };
  const packageJson = {
    name,
    version,
    author,
    description,
    type,
    license,
    scripts,
    dependencies,
    devDependencies
  };
  function bind(fn, thisArg) {
    return function wrap() {
      return fn.apply(thisArg, arguments);
    };
  }
  const { toString } = Object.prototype;
  const { getPrototypeOf } = Object;
  const { iterator, toStringTag } = Symbol;
  const kindOf = /* @__PURE__ */ ((cache) => (thing) => {
    const str = toString.call(thing);
    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
  })(/* @__PURE__ */ Object.create(null));
  const kindOfTest = (type2) => {
    type2 = type2.toLowerCase();
    return (thing) => kindOf(thing) === type2;
  };
  const typeOfTest = (type2) => (thing) => typeof thing === type2;
  const { isArray } = Array;
  const isUndefined = typeOfTest("undefined");
  function isBuffer(val) {
    return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
  }
  const isArrayBuffer = kindOfTest("ArrayBuffer");
  function isArrayBufferView(val) {
    let result;
    if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
      result = ArrayBuffer.isView(val);
    } else {
      result = val && val.buffer && isArrayBuffer(val.buffer);
    }
    return result;
  }
  const isString = typeOfTest("string");
  const isFunction = typeOfTest("function");
  const isNumber = typeOfTest("number");
  const isObject = (thing) => thing !== null && typeof thing === "object";
  const isBoolean = (thing) => thing === true || thing === false;
  const isPlainObject = (val) => {
    if (kindOf(val) !== "object") {
      return false;
    }
    const prototype2 = getPrototypeOf(val);
    return (prototype2 === null || prototype2 === Object.prototype || Object.getPrototypeOf(prototype2) === null) && !(toStringTag in val) && !(iterator in val);
  };
  const isDate = kindOfTest("Date");
  const isFile = kindOfTest("File");
  const isBlob = kindOfTest("Blob");
  const isFileList = kindOfTest("FileList");
  const isStream = (val) => isObject(val) && isFunction(val.pipe);
  const isFormData = (thing) => {
    let kind;
    return thing && (typeof FormData === "function" && thing instanceof FormData || isFunction(thing.append) && ((kind = kindOf(thing)) === "formdata" || // detect form-data instance
    kind === "object" && isFunction(thing.toString) && thing.toString() === "[object FormData]"));
  };
  const isURLSearchParams = kindOfTest("URLSearchParams");
  const [isReadableStream, isRequest, isResponse, isHeaders] = ["ReadableStream", "Request", "Response", "Headers"].map(kindOfTest);
  const trim = (str) => str.trim ? str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
  function forEach(obj, fn, { allOwnKeys = false } = {}) {
    if (obj === null || typeof obj === "undefined") {
      return;
    }
    let i;
    let l;
    if (typeof obj !== "object") {
      obj = [obj];
    }
    if (isArray(obj)) {
      for (i = 0, l = obj.length; i < l; i++) {
        fn.call(null, obj[i], i, obj);
      }
    } else {
      const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
      const len = keys.length;
      let key;
      for (i = 0; i < len; i++) {
        key = keys[i];
        fn.call(null, obj[key], key, obj);
      }
    }
  }
  function findKey(obj, key) {
    key = key.toLowerCase();
    const keys = Object.keys(obj);
    let i = keys.length;
    let _key;
    while (i-- > 0) {
      _key = keys[i];
      if (key === _key.toLowerCase()) {
        return _key;
      }
    }
    return null;
  }
  const _global = (() => {
    if (typeof globalThis !== "undefined") return globalThis;
    return typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : global;
  })();
  const isContextDefined = (context) => !isUndefined(context) && context !== _global;
  function merge() {
    const { caseless } = isContextDefined(this) && this || {};
    const result = {};
    const assignValue = (val, key) => {
      const targetKey = caseless && findKey(result, key) || key;
      if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
        result[targetKey] = merge(result[targetKey], val);
      } else if (isPlainObject(val)) {
        result[targetKey] = merge({}, val);
      } else if (isArray(val)) {
        result[targetKey] = val.slice();
      } else {
        result[targetKey] = val;
      }
    };
    for (let i = 0, l = arguments.length; i < l; i++) {
      arguments[i] && forEach(arguments[i], assignValue);
    }
    return result;
  }
  const extend = (a, b, thisArg, { allOwnKeys } = {}) => {
    forEach(b, (val, key) => {
      if (thisArg && isFunction(val)) {
        a[key] = bind(val, thisArg);
      } else {
        a[key] = val;
      }
    }, { allOwnKeys });
    return a;
  };
  const stripBOM = (content) => {
    if (content.charCodeAt(0) === 65279) {
      content = content.slice(1);
    }
    return content;
  };
  const inherits = (constructor, superConstructor, props, descriptors2) => {
    constructor.prototype = Object.create(superConstructor.prototype, descriptors2);
    constructor.prototype.constructor = constructor;
    Object.defineProperty(constructor, "super", {
      value: superConstructor.prototype
    });
    props && Object.assign(constructor.prototype, props);
  };
  const toFlatObject = (sourceObj, destObj, filter2, propFilter) => {
    let props;
    let i;
    let prop;
    const merged = {};
    destObj = destObj || {};
    if (sourceObj == null) return destObj;
    do {
      props = Object.getOwnPropertyNames(sourceObj);
      i = props.length;
      while (i-- > 0) {
        prop = props[i];
        if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
          destObj[prop] = sourceObj[prop];
          merged[prop] = true;
        }
      }
      sourceObj = filter2 !== false && getPrototypeOf(sourceObj);
    } while (sourceObj && (!filter2 || filter2(sourceObj, destObj)) && sourceObj !== Object.prototype);
    return destObj;
  };
  const endsWith = (str, searchString, position) => {
    str = String(str);
    if (position === void 0 || position > str.length) {
      position = str.length;
    }
    position -= searchString.length;
    const lastIndex = str.indexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
  };
  const toArray = (thing) => {
    if (!thing) return null;
    if (isArray(thing)) return thing;
    let i = thing.length;
    if (!isNumber(i)) return null;
    const arr = new Array(i);
    while (i-- > 0) {
      arr[i] = thing[i];
    }
    return arr;
  };
  const isTypedArray = /* @__PURE__ */ ((TypedArray) => {
    return (thing) => {
      return TypedArray && thing instanceof TypedArray;
    };
  })(typeof Uint8Array !== "undefined" && getPrototypeOf(Uint8Array));
  const forEachEntry = (obj, fn) => {
    const generator = obj && obj[iterator];
    const _iterator = generator.call(obj);
    let result;
    while ((result = _iterator.next()) && !result.done) {
      const pair = result.value;
      fn.call(obj, pair[0], pair[1]);
    }
  };
  const matchAll = (regExp, str) => {
    let matches;
    const arr = [];
    while ((matches = regExp.exec(str)) !== null) {
      arr.push(matches);
    }
    return arr;
  };
  const isHTMLForm = kindOfTest("HTMLFormElement");
  const toCamelCase = (str) => {
    return str.toLowerCase().replace(
      /[-_\s]([a-z\d])(\w*)/g,
      function replacer(m, p1, p2) {
        return p1.toUpperCase() + p2;
      }
    );
  };
  const hasOwnProperty = (({ hasOwnProperty: hasOwnProperty2 }) => (obj, prop) => hasOwnProperty2.call(obj, prop))(Object.prototype);
  const isRegExp = kindOfTest("RegExp");
  const reduceDescriptors = (obj, reducer) => {
    const descriptors2 = Object.getOwnPropertyDescriptors(obj);
    const reducedDescriptors = {};
    forEach(descriptors2, (descriptor, name2) => {
      let ret;
      if ((ret = reducer(descriptor, name2, obj)) !== false) {
        reducedDescriptors[name2] = ret || descriptor;
      }
    });
    Object.defineProperties(obj, reducedDescriptors);
  };
  const freezeMethods = (obj) => {
    reduceDescriptors(obj, (descriptor, name2) => {
      if (isFunction(obj) && ["arguments", "caller", "callee"].indexOf(name2) !== -1) {
        return false;
      }
      const value = obj[name2];
      if (!isFunction(value)) return;
      descriptor.enumerable = false;
      if ("writable" in descriptor) {
        descriptor.writable = false;
        return;
      }
      if (!descriptor.set) {
        descriptor.set = () => {
          throw Error("Can not rewrite read-only method '" + name2 + "'");
        };
      }
    });
  };
  const toObjectSet = (arrayOrString, delimiter) => {
    const obj = {};
    const define = (arr) => {
      arr.forEach((value) => {
        obj[value] = true;
      });
    };
    isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));
    return obj;
  };
  const noop = () => {
  };
  const toFiniteNumber = (value, defaultValue) => {
    return value != null && Number.isFinite(value = +value) ? value : defaultValue;
  };
  function isSpecCompliantForm(thing) {
    return !!(thing && isFunction(thing.append) && thing[toStringTag] === "FormData" && thing[iterator]);
  }
  const toJSONObject = (obj) => {
    const stack = new Array(10);
    const visit = (source, i) => {
      if (isObject(source)) {
        if (stack.indexOf(source) >= 0) {
          return;
        }
        if (!("toJSON" in source)) {
          stack[i] = source;
          const target = isArray(source) ? [] : {};
          forEach(source, (value, key) => {
            const reducedValue = visit(value, i + 1);
            !isUndefined(reducedValue) && (target[key] = reducedValue);
          });
          stack[i] = void 0;
          return target;
        }
      }
      return source;
    };
    return visit(obj, 0);
  };
  const isAsyncFn = kindOfTest("AsyncFunction");
  const isThenable = (thing) => thing && (isObject(thing) || isFunction(thing)) && isFunction(thing.then) && isFunction(thing.catch);
  const _setImmediate = ((setImmediateSupported, postMessageSupported) => {
    if (setImmediateSupported) {
      return setImmediate;
    }
    return postMessageSupported ? ((token, callbacks) => {
      _global.addEventListener("message", ({ source, data }) => {
        if (source === _global && data === token) {
          callbacks.length && callbacks.shift()();
        }
      }, false);
      return (cb) => {
        callbacks.push(cb);
        _global.postMessage(token, "*");
      };
    })(`axios@${Math.random()}`, []) : (cb) => setTimeout(cb);
  })(
    typeof setImmediate === "function",
    isFunction(_global.postMessage)
  );
  const asap = typeof queueMicrotask !== "undefined" ? queueMicrotask.bind(_global) : typeof process !== "undefined" && process.nextTick || _setImmediate;
  const isIterable = (thing) => thing != null && isFunction(thing[iterator]);
  const utils$1 = {
    isArray,
    isArrayBuffer,
    isBuffer,
    isFormData,
    isArrayBufferView,
    isString,
    isNumber,
    isBoolean,
    isObject,
    isPlainObject,
    isReadableStream,
    isRequest,
    isResponse,
    isHeaders,
    isUndefined,
    isDate,
    isFile,
    isBlob,
    isRegExp,
    isFunction,
    isStream,
    isURLSearchParams,
    isTypedArray,
    isFileList,
    forEach,
    merge,
    extend,
    trim,
    stripBOM,
    inherits,
    toFlatObject,
    kindOf,
    kindOfTest,
    endsWith,
    toArray,
    forEachEntry,
    matchAll,
    isHTMLForm,
    hasOwnProperty,
    hasOwnProp: hasOwnProperty,
    // an alias to avoid ESLint no-prototype-builtins detection
    reduceDescriptors,
    freezeMethods,
    toObjectSet,
    toCamelCase,
    noop,
    toFiniteNumber,
    findKey,
    global: _global,
    isContextDefined,
    isSpecCompliantForm,
    toJSONObject,
    isAsyncFn,
    isThenable,
    setImmediate: _setImmediate,
    asap,
    isIterable
  };
  function AxiosError(message, code, config, request, response) {
    Error.call(this);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error().stack;
    }
    this.message = message;
    this.name = "AxiosError";
    code && (this.code = code);
    config && (this.config = config);
    request && (this.request = request);
    if (response) {
      this.response = response;
      this.status = response.status ? response.status : null;
    }
  }
  utils$1.inherits(AxiosError, Error, {
    toJSON: function toJSON() {
      return {
        // Standard
        message: this.message,
        name: this.name,
        // Microsoft
        description: this.description,
        number: this.number,
        // Mozilla
        fileName: this.fileName,
        lineNumber: this.lineNumber,
        columnNumber: this.columnNumber,
        stack: this.stack,
        // Axios
        config: utils$1.toJSONObject(this.config),
        code: this.code,
        status: this.status
      };
    }
  });
  const prototype$1 = AxiosError.prototype;
  const descriptors = {};
  [
    "ERR_BAD_OPTION_VALUE",
    "ERR_BAD_OPTION",
    "ECONNABORTED",
    "ETIMEDOUT",
    "ERR_NETWORK",
    "ERR_FR_TOO_MANY_REDIRECTS",
    "ERR_DEPRECATED",
    "ERR_BAD_RESPONSE",
    "ERR_BAD_REQUEST",
    "ERR_CANCELED",
    "ERR_NOT_SUPPORT",
    "ERR_INVALID_URL"
    // eslint-disable-next-line func-names
  ].forEach((code) => {
    descriptors[code] = { value: code };
  });
  Object.defineProperties(AxiosError, descriptors);
  Object.defineProperty(prototype$1, "isAxiosError", { value: true });
  AxiosError.from = (error, code, config, request, response, customProps) => {
    const axiosError = Object.create(prototype$1);
    utils$1.toFlatObject(error, axiosError, function filter2(obj) {
      return obj !== Error.prototype;
    }, (prop) => {
      return prop !== "isAxiosError";
    });
    AxiosError.call(axiosError, error.message, code, config, request, response);
    axiosError.cause = error;
    axiosError.name = error.name;
    customProps && Object.assign(axiosError, customProps);
    return axiosError;
  };
  const httpAdapter = null;
  function isVisitable(thing) {
    return utils$1.isPlainObject(thing) || utils$1.isArray(thing);
  }
  function removeBrackets(key) {
    return utils$1.endsWith(key, "[]") ? key.slice(0, -2) : key;
  }
  function renderKey(path, key, dots) {
    if (!path) return key;
    return path.concat(key).map(function each(token, i) {
      token = removeBrackets(token);
      return !dots && i ? "[" + token + "]" : token;
    }).join(dots ? "." : "");
  }
  function isFlatArray(arr) {
    return utils$1.isArray(arr) && !arr.some(isVisitable);
  }
  const predicates = utils$1.toFlatObject(utils$1, {}, null, function filter(prop) {
    return /^is[A-Z]/.test(prop);
  });
  function toFormData(obj, formData, options) {
    if (!utils$1.isObject(obj)) {
      throw new TypeError("target must be an object");
    }
    formData = formData || new FormData();
    options = utils$1.toFlatObject(options, {
      metaTokens: true,
      dots: false,
      indexes: false
    }, false, function defined(option, source) {
      return !utils$1.isUndefined(source[option]);
    });
    const metaTokens = options.metaTokens;
    const visitor = options.visitor || defaultVisitor;
    const dots = options.dots;
    const indexes = options.indexes;
    const _Blob = options.Blob || typeof Blob !== "undefined" && Blob;
    const useBlob = _Blob && utils$1.isSpecCompliantForm(formData);
    if (!utils$1.isFunction(visitor)) {
      throw new TypeError("visitor must be a function");
    }
    function convertValue(value) {
      if (value === null) return "";
      if (utils$1.isDate(value)) {
        return value.toISOString();
      }
      if (utils$1.isBoolean(value)) {
        return value.toString();
      }
      if (!useBlob && utils$1.isBlob(value)) {
        throw new AxiosError("Blob is not supported. Use a Buffer instead.");
      }
      if (utils$1.isArrayBuffer(value) || utils$1.isTypedArray(value)) {
        return useBlob && typeof Blob === "function" ? new Blob([value]) : Buffer.from(value);
      }
      return value;
    }
    function defaultVisitor(value, key, path) {
      let arr = value;
      if (value && !path && typeof value === "object") {
        if (utils$1.endsWith(key, "{}")) {
          key = metaTokens ? key : key.slice(0, -2);
          value = JSON.stringify(value);
        } else if (utils$1.isArray(value) && isFlatArray(value) || (utils$1.isFileList(value) || utils$1.endsWith(key, "[]")) && (arr = utils$1.toArray(value))) {
          key = removeBrackets(key);
          arr.forEach(function each(el, index) {
            !(utils$1.isUndefined(el) || el === null) && formData.append(
              // eslint-disable-next-line no-nested-ternary
              indexes === true ? renderKey([key], index, dots) : indexes === null ? key : key + "[]",
              convertValue(el)
            );
          });
          return false;
        }
      }
      if (isVisitable(value)) {
        return true;
      }
      formData.append(renderKey(path, key, dots), convertValue(value));
      return false;
    }
    const stack = [];
    const exposedHelpers = Object.assign(predicates, {
      defaultVisitor,
      convertValue,
      isVisitable
    });
    function build(value, path) {
      if (utils$1.isUndefined(value)) return;
      if (stack.indexOf(value) !== -1) {
        throw Error("Circular reference detected in " + path.join("."));
      }
      stack.push(value);
      utils$1.forEach(value, function each(el, key) {
        const result = !(utils$1.isUndefined(el) || el === null) && visitor.call(
          formData,
          el,
          utils$1.isString(key) ? key.trim() : key,
          path,
          exposedHelpers
        );
        if (result === true) {
          build(el, path ? path.concat(key) : [key]);
        }
      });
      stack.pop();
    }
    if (!utils$1.isObject(obj)) {
      throw new TypeError("data must be an object");
    }
    build(obj);
    return formData;
  }
  function encode$1(str) {
    const charMap = {
      "!": "%21",
      "'": "%27",
      "(": "%28",
      ")": "%29",
      "~": "%7E",
      "%20": "+",
      "%00": "\0"
    };
    return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
      return charMap[match];
    });
  }
  function AxiosURLSearchParams(params, options) {
    this._pairs = [];
    params && toFormData(params, this, options);
  }
  const prototype = AxiosURLSearchParams.prototype;
  prototype.append = function append(name2, value) {
    this._pairs.push([name2, value]);
  };
  prototype.toString = function toString2(encoder) {
    const _encode = encoder ? function(value) {
      return encoder.call(this, value, encode$1);
    } : encode$1;
    return this._pairs.map(function each(pair) {
      return _encode(pair[0]) + "=" + _encode(pair[1]);
    }, "").join("&");
  };
  function encode(val) {
    return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
  }
  function buildURL(url, params, options) {
    if (!params) {
      return url;
    }
    const _encode = options && options.encode || encode;
    if (utils$1.isFunction(options)) {
      options = {
        serialize: options
      };
    }
    const serializeFn = options && options.serialize;
    let serializedParams;
    if (serializeFn) {
      serializedParams = serializeFn(params, options);
    } else {
      serializedParams = utils$1.isURLSearchParams(params) ? params.toString() : new AxiosURLSearchParams(params, options).toString(_encode);
    }
    if (serializedParams) {
      const hashmarkIndex = url.indexOf("#");
      if (hashmarkIndex !== -1) {
        url = url.slice(0, hashmarkIndex);
      }
      url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
    }
    return url;
  }
  class InterceptorManager {
    constructor() {
      this.handlers = [];
    }
    /**
     * Add a new interceptor to the stack
     *
     * @param {Function} fulfilled The function to handle `then` for a `Promise`
     * @param {Function} rejected The function to handle `reject` for a `Promise`
     *
     * @return {Number} An ID used to remove interceptor later
     */
    use(fulfilled, rejected, options) {
      this.handlers.push({
        fulfilled,
        rejected,
        synchronous: options ? options.synchronous : false,
        runWhen: options ? options.runWhen : null
      });
      return this.handlers.length - 1;
    }
    /**
     * Remove an interceptor from the stack
     *
     * @param {Number} id The ID that was returned by `use`
     *
     * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
     */
    eject(id) {
      if (this.handlers[id]) {
        this.handlers[id] = null;
      }
    }
    /**
     * Clear all interceptors from the stack
     *
     * @returns {void}
     */
    clear() {
      if (this.handlers) {
        this.handlers = [];
      }
    }
    /**
     * Iterate over all the registered interceptors
     *
     * This method is particularly useful for skipping over any
     * interceptors that may have become `null` calling `eject`.
     *
     * @param {Function} fn The function to call for each interceptor
     *
     * @returns {void}
     */
    forEach(fn) {
      utils$1.forEach(this.handlers, function forEachHandler(h) {
        if (h !== null) {
          fn(h);
        }
      });
    }
  }
  const transitionalDefaults = {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
  };
  const URLSearchParams$1 = typeof URLSearchParams !== "undefined" ? URLSearchParams : AxiosURLSearchParams;
  const FormData$1 = typeof FormData !== "undefined" ? FormData : null;
  const Blob$1 = typeof Blob !== "undefined" ? Blob : null;
  const platform$1 = {
    isBrowser: true,
    classes: {
      URLSearchParams: URLSearchParams$1,
      FormData: FormData$1,
      Blob: Blob$1
    },
    protocols: ["http", "https", "file", "blob", "url", "data"]
  };
  const hasBrowserEnv = typeof window !== "undefined" && typeof document !== "undefined";
  const _navigator = typeof navigator === "object" && navigator || void 0;
  const hasStandardBrowserEnv = hasBrowserEnv && (!_navigator || ["ReactNative", "NativeScript", "NS"].indexOf(_navigator.product) < 0);
  const hasStandardBrowserWebWorkerEnv = (() => {
    return typeof WorkerGlobalScope !== "undefined" && // eslint-disable-next-line no-undef
    self instanceof WorkerGlobalScope && typeof self.importScripts === "function";
  })();
  const origin = hasBrowserEnv && window.location.href || "http://localhost";
  const utils = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    hasBrowserEnv,
    hasStandardBrowserEnv,
    hasStandardBrowserWebWorkerEnv,
    navigator: _navigator,
    origin
  }, Symbol.toStringTag, { value: "Module" }));
  const platform = {
    ...utils,
    ...platform$1
  };
  function toURLEncodedForm(data, options) {
    return toFormData(data, new platform.classes.URLSearchParams(), Object.assign({
      visitor: function(value, key, path, helpers) {
        if (platform.isNode && utils$1.isBuffer(value)) {
          this.append(key, value.toString("base64"));
          return false;
        }
        return helpers.defaultVisitor.apply(this, arguments);
      }
    }, options));
  }
  function parsePropPath(name2) {
    return utils$1.matchAll(/\w+|\[(\w*)]/g, name2).map((match) => {
      return match[0] === "[]" ? "" : match[1] || match[0];
    });
  }
  function arrayToObject(arr) {
    const obj = {};
    const keys = Object.keys(arr);
    let i;
    const len = keys.length;
    let key;
    for (i = 0; i < len; i++) {
      key = keys[i];
      obj[key] = arr[key];
    }
    return obj;
  }
  function formDataToJSON(formData) {
    function buildPath(path, value, target, index) {
      let name2 = path[index++];
      if (name2 === "__proto__") return true;
      const isNumericKey = Number.isFinite(+name2);
      const isLast = index >= path.length;
      name2 = !name2 && utils$1.isArray(target) ? target.length : name2;
      if (isLast) {
        if (utils$1.hasOwnProp(target, name2)) {
          target[name2] = [target[name2], value];
        } else {
          target[name2] = value;
        }
        return !isNumericKey;
      }
      if (!target[name2] || !utils$1.isObject(target[name2])) {
        target[name2] = [];
      }
      const result = buildPath(path, value, target[name2], index);
      if (result && utils$1.isArray(target[name2])) {
        target[name2] = arrayToObject(target[name2]);
      }
      return !isNumericKey;
    }
    if (utils$1.isFormData(formData) && utils$1.isFunction(formData.entries)) {
      const obj = {};
      utils$1.forEachEntry(formData, (name2, value) => {
        buildPath(parsePropPath(name2), value, obj, 0);
      });
      return obj;
    }
    return null;
  }
  function stringifySafely(rawValue, parser, encoder) {
    if (utils$1.isString(rawValue)) {
      try {
        (parser || JSON.parse)(rawValue);
        return utils$1.trim(rawValue);
      } catch (e) {
        if (e.name !== "SyntaxError") {
          throw e;
        }
      }
    }
    return (0, JSON.stringify)(rawValue);
  }
  const defaults = {
    transitional: transitionalDefaults,
    adapter: ["xhr", "http", "fetch"],
    transformRequest: [function transformRequest(data, headers) {
      const contentType = headers.getContentType() || "";
      const hasJSONContentType = contentType.indexOf("application/json") > -1;
      const isObjectPayload = utils$1.isObject(data);
      if (isObjectPayload && utils$1.isHTMLForm(data)) {
        data = new FormData(data);
      }
      const isFormData2 = utils$1.isFormData(data);
      if (isFormData2) {
        return hasJSONContentType ? JSON.stringify(formDataToJSON(data)) : data;
      }
      if (utils$1.isArrayBuffer(data) || utils$1.isBuffer(data) || utils$1.isStream(data) || utils$1.isFile(data) || utils$1.isBlob(data) || utils$1.isReadableStream(data)) {
        return data;
      }
      if (utils$1.isArrayBufferView(data)) {
        return data.buffer;
      }
      if (utils$1.isURLSearchParams(data)) {
        headers.setContentType("application/x-www-form-urlencoded;charset=utf-8", false);
        return data.toString();
      }
      let isFileList2;
      if (isObjectPayload) {
        if (contentType.indexOf("application/x-www-form-urlencoded") > -1) {
          return toURLEncodedForm(data, this.formSerializer).toString();
        }
        if ((isFileList2 = utils$1.isFileList(data)) || contentType.indexOf("multipart/form-data") > -1) {
          const _FormData = this.env && this.env.FormData;
          return toFormData(
            isFileList2 ? { "files[]": data } : data,
            _FormData && new _FormData(),
            this.formSerializer
          );
        }
      }
      if (isObjectPayload || hasJSONContentType) {
        headers.setContentType("application/json", false);
        return stringifySafely(data);
      }
      return data;
    }],
    transformResponse: [function transformResponse(data) {
      const transitional2 = this.transitional || defaults.transitional;
      const forcedJSONParsing = transitional2 && transitional2.forcedJSONParsing;
      const JSONRequested = this.responseType === "json";
      if (utils$1.isResponse(data) || utils$1.isReadableStream(data)) {
        return data;
      }
      if (data && utils$1.isString(data) && (forcedJSONParsing && !this.responseType || JSONRequested)) {
        const silentJSONParsing = transitional2 && transitional2.silentJSONParsing;
        const strictJSONParsing = !silentJSONParsing && JSONRequested;
        try {
          return JSON.parse(data);
        } catch (e) {
          if (strictJSONParsing) {
            if (e.name === "SyntaxError") {
              throw AxiosError.from(e, AxiosError.ERR_BAD_RESPONSE, this, null, this.response);
            }
            throw e;
          }
        }
      }
      return data;
    }],
    /**
     * A timeout in milliseconds to abort a request. If set to 0 (default) a
     * timeout is not created.
     */
    timeout: 0,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    maxContentLength: -1,
    maxBodyLength: -1,
    env: {
      FormData: platform.classes.FormData,
      Blob: platform.classes.Blob
    },
    validateStatus: function validateStatus(status) {
      return status >= 200 && status < 300;
    },
    headers: {
      common: {
        "Accept": "application/json, text/plain, */*",
        "Content-Type": void 0
      }
    }
  };
  utils$1.forEach(["delete", "get", "head", "post", "put", "patch"], (method) => {
    defaults.headers[method] = {};
  });
  const ignoreDuplicateOf = utils$1.toObjectSet([
    "age",
    "authorization",
    "content-length",
    "content-type",
    "etag",
    "expires",
    "from",
    "host",
    "if-modified-since",
    "if-unmodified-since",
    "last-modified",
    "location",
    "max-forwards",
    "proxy-authorization",
    "referer",
    "retry-after",
    "user-agent"
  ]);
  const parseHeaders = (rawHeaders) => {
    const parsed = {};
    let key;
    let val;
    let i;
    rawHeaders && rawHeaders.split("\n").forEach(function parser(line) {
      i = line.indexOf(":");
      key = line.substring(0, i).trim().toLowerCase();
      val = line.substring(i + 1).trim();
      if (!key || parsed[key] && ignoreDuplicateOf[key]) {
        return;
      }
      if (key === "set-cookie") {
        if (parsed[key]) {
          parsed[key].push(val);
        } else {
          parsed[key] = [val];
        }
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
      }
    });
    return parsed;
  };
  const $internals = Symbol("internals");
  function normalizeHeader(header) {
    return header && String(header).trim().toLowerCase();
  }
  function normalizeValue(value) {
    if (value === false || value == null) {
      return value;
    }
    return utils$1.isArray(value) ? value.map(normalizeValue) : String(value);
  }
  function parseTokens(str) {
    const tokens = /* @__PURE__ */ Object.create(null);
    const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
    let match;
    while (match = tokensRE.exec(str)) {
      tokens[match[1]] = match[2];
    }
    return tokens;
  }
  const isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());
  function matchHeaderValue(context, value, header, filter2, isHeaderNameFilter) {
    if (utils$1.isFunction(filter2)) {
      return filter2.call(this, value, header);
    }
    if (isHeaderNameFilter) {
      value = header;
    }
    if (!utils$1.isString(value)) return;
    if (utils$1.isString(filter2)) {
      return value.indexOf(filter2) !== -1;
    }
    if (utils$1.isRegExp(filter2)) {
      return filter2.test(value);
    }
  }
  function formatHeader(header) {
    return header.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
      return char.toUpperCase() + str;
    });
  }
  function buildAccessors(obj, header) {
    const accessorName = utils$1.toCamelCase(" " + header);
    ["get", "set", "has"].forEach((methodName) => {
      Object.defineProperty(obj, methodName + accessorName, {
        value: function(arg1, arg2, arg3) {
          return this[methodName].call(this, header, arg1, arg2, arg3);
        },
        configurable: true
      });
    });
  }
  class AxiosHeaders {
    constructor(headers) {
      headers && this.set(headers);
    }
    set(header, valueOrRewrite, rewrite) {
      const self2 = this;
      function setHeader(_value, _header, _rewrite) {
        const lHeader = normalizeHeader(_header);
        if (!lHeader) {
          throw new Error("header name must be a non-empty string");
        }
        const key = utils$1.findKey(self2, lHeader);
        if (!key || self2[key] === void 0 || _rewrite === true || _rewrite === void 0 && self2[key] !== false) {
          self2[key || _header] = normalizeValue(_value);
        }
      }
      const setHeaders = (headers, _rewrite) => utils$1.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));
      if (utils$1.isPlainObject(header) || header instanceof this.constructor) {
        setHeaders(header, valueOrRewrite);
      } else if (utils$1.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
        setHeaders(parseHeaders(header), valueOrRewrite);
      } else if (utils$1.isObject(header) && utils$1.isIterable(header)) {
        let obj = {}, dest, key;
        for (const entry of header) {
          if (!utils$1.isArray(entry)) {
            throw TypeError("Object iterator must return a key-value pair");
          }
          obj[key = entry[0]] = (dest = obj[key]) ? utils$1.isArray(dest) ? [...dest, entry[1]] : [dest, entry[1]] : entry[1];
        }
        setHeaders(obj, valueOrRewrite);
      } else {
        header != null && setHeader(valueOrRewrite, header, rewrite);
      }
      return this;
    }
    get(header, parser) {
      header = normalizeHeader(header);
      if (header) {
        const key = utils$1.findKey(this, header);
        if (key) {
          const value = this[key];
          if (!parser) {
            return value;
          }
          if (parser === true) {
            return parseTokens(value);
          }
          if (utils$1.isFunction(parser)) {
            return parser.call(this, value, key);
          }
          if (utils$1.isRegExp(parser)) {
            return parser.exec(value);
          }
          throw new TypeError("parser must be boolean|regexp|function");
        }
      }
    }
    has(header, matcher) {
      header = normalizeHeader(header);
      if (header) {
        const key = utils$1.findKey(this, header);
        return !!(key && this[key] !== void 0 && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
      }
      return false;
    }
    delete(header, matcher) {
      const self2 = this;
      let deleted = false;
      function deleteHeader(_header) {
        _header = normalizeHeader(_header);
        if (_header) {
          const key = utils$1.findKey(self2, _header);
          if (key && (!matcher || matchHeaderValue(self2, self2[key], key, matcher))) {
            delete self2[key];
            deleted = true;
          }
        }
      }
      if (utils$1.isArray(header)) {
        header.forEach(deleteHeader);
      } else {
        deleteHeader(header);
      }
      return deleted;
    }
    clear(matcher) {
      const keys = Object.keys(this);
      let i = keys.length;
      let deleted = false;
      while (i--) {
        const key = keys[i];
        if (!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
          delete this[key];
          deleted = true;
        }
      }
      return deleted;
    }
    normalize(format) {
      const self2 = this;
      const headers = {};
      utils$1.forEach(this, (value, header) => {
        const key = utils$1.findKey(headers, header);
        if (key) {
          self2[key] = normalizeValue(value);
          delete self2[header];
          return;
        }
        const normalized = format ? formatHeader(header) : String(header).trim();
        if (normalized !== header) {
          delete self2[header];
        }
        self2[normalized] = normalizeValue(value);
        headers[normalized] = true;
      });
      return this;
    }
    concat(...targets) {
      return this.constructor.concat(this, ...targets);
    }
    toJSON(asStrings) {
      const obj = /* @__PURE__ */ Object.create(null);
      utils$1.forEach(this, (value, header) => {
        value != null && value !== false && (obj[header] = asStrings && utils$1.isArray(value) ? value.join(", ") : value);
      });
      return obj;
    }
    [Symbol.iterator]() {
      return Object.entries(this.toJSON())[Symbol.iterator]();
    }
    toString() {
      return Object.entries(this.toJSON()).map(([header, value]) => header + ": " + value).join("\n");
    }
    getSetCookie() {
      return this.get("set-cookie") || [];
    }
    get [Symbol.toStringTag]() {
      return "AxiosHeaders";
    }
    static from(thing) {
      return thing instanceof this ? thing : new this(thing);
    }
    static concat(first, ...targets) {
      const computed = new this(first);
      targets.forEach((target) => computed.set(target));
      return computed;
    }
    static accessor(header) {
      const internals = this[$internals] = this[$internals] = {
        accessors: {}
      };
      const accessors = internals.accessors;
      const prototype2 = this.prototype;
      function defineAccessor(_header) {
        const lHeader = normalizeHeader(_header);
        if (!accessors[lHeader]) {
          buildAccessors(prototype2, _header);
          accessors[lHeader] = true;
        }
      }
      utils$1.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);
      return this;
    }
  }
  AxiosHeaders.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent", "Authorization"]);
  utils$1.reduceDescriptors(AxiosHeaders.prototype, ({ value }, key) => {
    let mapped = key[0].toUpperCase() + key.slice(1);
    return {
      get: () => value,
      set(headerValue) {
        this[mapped] = headerValue;
      }
    };
  });
  utils$1.freezeMethods(AxiosHeaders);
  function transformData(fns, response) {
    const config = this || defaults;
    const context = response || config;
    const headers = AxiosHeaders.from(context.headers);
    let data = context.data;
    utils$1.forEach(fns, function transform(fn) {
      data = fn.call(config, data, headers.normalize(), response ? response.status : void 0);
    });
    headers.normalize();
    return data;
  }
  function isCancel(value) {
    return !!(value && value.__CANCEL__);
  }
  function CanceledError(message, config, request) {
    AxiosError.call(this, message == null ? "canceled" : message, AxiosError.ERR_CANCELED, config, request);
    this.name = "CanceledError";
  }
  utils$1.inherits(CanceledError, AxiosError, {
    __CANCEL__: true
  });
  function settle(resolve, reject, response) {
    const validateStatus2 = response.config.validateStatus;
    if (!response.status || !validateStatus2 || validateStatus2(response.status)) {
      resolve(response);
    } else {
      reject(new AxiosError(
        "Request failed with status code " + response.status,
        [AxiosError.ERR_BAD_REQUEST, AxiosError.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
        response.config,
        response.request,
        response
      ));
    }
  }
  function parseProtocol(url) {
    const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
    return match && match[1] || "";
  }
  function speedometer(samplesCount, min) {
    samplesCount = samplesCount || 10;
    const bytes = new Array(samplesCount);
    const timestamps = new Array(samplesCount);
    let head = 0;
    let tail = 0;
    let firstSampleTS;
    min = min !== void 0 ? min : 1e3;
    return function push(chunkLength) {
      const now = Date.now();
      const startedAt = timestamps[tail];
      if (!firstSampleTS) {
        firstSampleTS = now;
      }
      bytes[head] = chunkLength;
      timestamps[head] = now;
      let i = tail;
      let bytesCount = 0;
      while (i !== head) {
        bytesCount += bytes[i++];
        i = i % samplesCount;
      }
      head = (head + 1) % samplesCount;
      if (head === tail) {
        tail = (tail + 1) % samplesCount;
      }
      if (now - firstSampleTS < min) {
        return;
      }
      const passed = startedAt && now - startedAt;
      return passed ? Math.round(bytesCount * 1e3 / passed) : void 0;
    };
  }
  function throttle(fn, freq) {
    let timestamp = 0;
    let threshold = 1e3 / freq;
    let lastArgs;
    let timer;
    const invoke = (args, now = Date.now()) => {
      timestamp = now;
      lastArgs = null;
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      fn.apply(null, args);
    };
    const throttled = (...args) => {
      const now = Date.now();
      const passed = now - timestamp;
      if (passed >= threshold) {
        invoke(args, now);
      } else {
        lastArgs = args;
        if (!timer) {
          timer = setTimeout(() => {
            timer = null;
            invoke(lastArgs);
          }, threshold - passed);
        }
      }
    };
    const flush = () => lastArgs && invoke(lastArgs);
    return [throttled, flush];
  }
  const progressEventReducer = (listener, isDownloadStream, freq = 3) => {
    let bytesNotified = 0;
    const _speedometer = speedometer(50, 250);
    return throttle((e) => {
      const loaded = e.loaded;
      const total = e.lengthComputable ? e.total : void 0;
      const progressBytes = loaded - bytesNotified;
      const rate = _speedometer(progressBytes);
      const inRange = loaded <= total;
      bytesNotified = loaded;
      const data = {
        loaded,
        total,
        progress: total ? loaded / total : void 0,
        bytes: progressBytes,
        rate: rate ? rate : void 0,
        estimated: rate && total && inRange ? (total - loaded) / rate : void 0,
        event: e,
        lengthComputable: total != null,
        [isDownloadStream ? "download" : "upload"]: true
      };
      listener(data);
    }, freq);
  };
  const progressEventDecorator = (total, throttled) => {
    const lengthComputable = total != null;
    return [(loaded) => throttled[0]({
      lengthComputable,
      total,
      loaded
    }), throttled[1]];
  };
  const asyncDecorator = (fn) => (...args) => utils$1.asap(() => fn(...args));
  const isURLSameOrigin = platform.hasStandardBrowserEnv ? /* @__PURE__ */ ((origin2, isMSIE) => (url) => {
    url = new URL(url, platform.origin);
    return origin2.protocol === url.protocol && origin2.host === url.host && (isMSIE || origin2.port === url.port);
  })(
    new URL(platform.origin),
    platform.navigator && /(msie|trident)/i.test(platform.navigator.userAgent)
  ) : () => true;
  const cookies = platform.hasStandardBrowserEnv ? (
    // Standard browser envs support document.cookie
    {
      write(name2, value, expires, path, domain, secure) {
        const cookie = [name2 + "=" + encodeURIComponent(value)];
        utils$1.isNumber(expires) && cookie.push("expires=" + new Date(expires).toGMTString());
        utils$1.isString(path) && cookie.push("path=" + path);
        utils$1.isString(domain) && cookie.push("domain=" + domain);
        secure === true && cookie.push("secure");
        document.cookie = cookie.join("; ");
      },
      read(name2) {
        const match = document.cookie.match(new RegExp("(^|;\\s*)(" + name2 + ")=([^;]*)"));
        return match ? decodeURIComponent(match[3]) : null;
      },
      remove(name2) {
        this.write(name2, "", Date.now() - 864e5);
      }
    }
  ) : (
    // Non-standard browser env (web workers, react-native) lack needed support.
    {
      write() {
      },
      read() {
        return null;
      },
      remove() {
      }
    }
  );
  function isAbsoluteURL(url) {
    return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
  }
  function combineURLs(baseURL, relativeURL) {
    return relativeURL ? baseURL.replace(/\/?\/$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
  }
  function buildFullPath(baseURL, requestedURL, allowAbsoluteUrls) {
    let isRelativeUrl = !isAbsoluteURL(requestedURL);
    if (baseURL && (isRelativeUrl || allowAbsoluteUrls == false)) {
      return combineURLs(baseURL, requestedURL);
    }
    return requestedURL;
  }
  const headersToObject = (thing) => thing instanceof AxiosHeaders ? { ...thing } : thing;
  function mergeConfig(config1, config2) {
    config2 = config2 || {};
    const config = {};
    function getMergedValue(target, source, prop, caseless) {
      if (utils$1.isPlainObject(target) && utils$1.isPlainObject(source)) {
        return utils$1.merge.call({ caseless }, target, source);
      } else if (utils$1.isPlainObject(source)) {
        return utils$1.merge({}, source);
      } else if (utils$1.isArray(source)) {
        return source.slice();
      }
      return source;
    }
    function mergeDeepProperties(a, b, prop, caseless) {
      if (!utils$1.isUndefined(b)) {
        return getMergedValue(a, b, prop, caseless);
      } else if (!utils$1.isUndefined(a)) {
        return getMergedValue(void 0, a, prop, caseless);
      }
    }
    function valueFromConfig2(a, b) {
      if (!utils$1.isUndefined(b)) {
        return getMergedValue(void 0, b);
      }
    }
    function defaultToConfig2(a, b) {
      if (!utils$1.isUndefined(b)) {
        return getMergedValue(void 0, b);
      } else if (!utils$1.isUndefined(a)) {
        return getMergedValue(void 0, a);
      }
    }
    function mergeDirectKeys(a, b, prop) {
      if (prop in config2) {
        return getMergedValue(a, b);
      } else if (prop in config1) {
        return getMergedValue(void 0, a);
      }
    }
    const mergeMap = {
      url: valueFromConfig2,
      method: valueFromConfig2,
      data: valueFromConfig2,
      baseURL: defaultToConfig2,
      transformRequest: defaultToConfig2,
      transformResponse: defaultToConfig2,
      paramsSerializer: defaultToConfig2,
      timeout: defaultToConfig2,
      timeoutMessage: defaultToConfig2,
      withCredentials: defaultToConfig2,
      withXSRFToken: defaultToConfig2,
      adapter: defaultToConfig2,
      responseType: defaultToConfig2,
      xsrfCookieName: defaultToConfig2,
      xsrfHeaderName: defaultToConfig2,
      onUploadProgress: defaultToConfig2,
      onDownloadProgress: defaultToConfig2,
      decompress: defaultToConfig2,
      maxContentLength: defaultToConfig2,
      maxBodyLength: defaultToConfig2,
      beforeRedirect: defaultToConfig2,
      transport: defaultToConfig2,
      httpAgent: defaultToConfig2,
      httpsAgent: defaultToConfig2,
      cancelToken: defaultToConfig2,
      socketPath: defaultToConfig2,
      responseEncoding: defaultToConfig2,
      validateStatus: mergeDirectKeys,
      headers: (a, b, prop) => mergeDeepProperties(headersToObject(a), headersToObject(b), prop, true)
    };
    utils$1.forEach(Object.keys(Object.assign({}, config1, config2)), function computeConfigValue(prop) {
      const merge2 = mergeMap[prop] || mergeDeepProperties;
      const configValue = merge2(config1[prop], config2[prop], prop);
      utils$1.isUndefined(configValue) && merge2 !== mergeDirectKeys || (config[prop] = configValue);
    });
    return config;
  }
  const resolveConfig = (config) => {
    const newConfig = mergeConfig({}, config);
    let { data, withXSRFToken, xsrfHeaderName, xsrfCookieName, headers, auth } = newConfig;
    newConfig.headers = headers = AxiosHeaders.from(headers);
    newConfig.url = buildURL(buildFullPath(newConfig.baseURL, newConfig.url, newConfig.allowAbsoluteUrls), config.params, config.paramsSerializer);
    if (auth) {
      headers.set(
        "Authorization",
        "Basic " + btoa((auth.username || "") + ":" + (auth.password ? unescape(encodeURIComponent(auth.password)) : ""))
      );
    }
    let contentType;
    if (utils$1.isFormData(data)) {
      if (platform.hasStandardBrowserEnv || platform.hasStandardBrowserWebWorkerEnv) {
        headers.setContentType(void 0);
      } else if ((contentType = headers.getContentType()) !== false) {
        const [type2, ...tokens] = contentType ? contentType.split(";").map((token) => token.trim()).filter(Boolean) : [];
        headers.setContentType([type2 || "multipart/form-data", ...tokens].join("; "));
      }
    }
    if (platform.hasStandardBrowserEnv) {
      withXSRFToken && utils$1.isFunction(withXSRFToken) && (withXSRFToken = withXSRFToken(newConfig));
      if (withXSRFToken || withXSRFToken !== false && isURLSameOrigin(newConfig.url)) {
        const xsrfValue = xsrfHeaderName && xsrfCookieName && cookies.read(xsrfCookieName);
        if (xsrfValue) {
          headers.set(xsrfHeaderName, xsrfValue);
        }
      }
    }
    return newConfig;
  };
  const isXHRAdapterSupported = typeof XMLHttpRequest !== "undefined";
  const xhrAdapter = isXHRAdapterSupported && function(config) {
    return new Promise(function dispatchXhrRequest(resolve, reject) {
      const _config = resolveConfig(config);
      let requestData = _config.data;
      const requestHeaders = AxiosHeaders.from(_config.headers).normalize();
      let { responseType, onUploadProgress, onDownloadProgress } = _config;
      let onCanceled;
      let uploadThrottled, downloadThrottled;
      let flushUpload, flushDownload;
      function done() {
        flushUpload && flushUpload();
        flushDownload && flushDownload();
        _config.cancelToken && _config.cancelToken.unsubscribe(onCanceled);
        _config.signal && _config.signal.removeEventListener("abort", onCanceled);
      }
      let request = new XMLHttpRequest();
      request.open(_config.method.toUpperCase(), _config.url, true);
      request.timeout = _config.timeout;
      function onloadend() {
        if (!request) {
          return;
        }
        const responseHeaders = AxiosHeaders.from(
          "getAllResponseHeaders" in request && request.getAllResponseHeaders()
        );
        const responseData = !responseType || responseType === "text" || responseType === "json" ? request.responseText : request.response;
        const response = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config,
          request
        };
        settle(function _resolve(value) {
          resolve(value);
          done();
        }, function _reject(err) {
          reject(err);
          done();
        }, response);
        request = null;
      }
      if ("onloadend" in request) {
        request.onloadend = onloadend;
      } else {
        request.onreadystatechange = function handleLoad() {
          if (!request || request.readyState !== 4) {
            return;
          }
          if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf("file:") === 0)) {
            return;
          }
          setTimeout(onloadend);
        };
      }
      request.onabort = function handleAbort() {
        if (!request) {
          return;
        }
        reject(new AxiosError("Request aborted", AxiosError.ECONNABORTED, config, request));
        request = null;
      };
      request.onerror = function handleError() {
        reject(new AxiosError("Network Error", AxiosError.ERR_NETWORK, config, request));
        request = null;
      };
      request.ontimeout = function handleTimeout() {
        let timeoutErrorMessage = _config.timeout ? "timeout of " + _config.timeout + "ms exceeded" : "timeout exceeded";
        const transitional2 = _config.transitional || transitionalDefaults;
        if (_config.timeoutErrorMessage) {
          timeoutErrorMessage = _config.timeoutErrorMessage;
        }
        reject(new AxiosError(
          timeoutErrorMessage,
          transitional2.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED,
          config,
          request
        ));
        request = null;
      };
      requestData === void 0 && requestHeaders.setContentType(null);
      if ("setRequestHeader" in request) {
        utils$1.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
          request.setRequestHeader(key, val);
        });
      }
      if (!utils$1.isUndefined(_config.withCredentials)) {
        request.withCredentials = !!_config.withCredentials;
      }
      if (responseType && responseType !== "json") {
        request.responseType = _config.responseType;
      }
      if (onDownloadProgress) {
        [downloadThrottled, flushDownload] = progressEventReducer(onDownloadProgress, true);
        request.addEventListener("progress", downloadThrottled);
      }
      if (onUploadProgress && request.upload) {
        [uploadThrottled, flushUpload] = progressEventReducer(onUploadProgress);
        request.upload.addEventListener("progress", uploadThrottled);
        request.upload.addEventListener("loadend", flushUpload);
      }
      if (_config.cancelToken || _config.signal) {
        onCanceled = (cancel) => {
          if (!request) {
            return;
          }
          reject(!cancel || cancel.type ? new CanceledError(null, config, request) : cancel);
          request.abort();
          request = null;
        };
        _config.cancelToken && _config.cancelToken.subscribe(onCanceled);
        if (_config.signal) {
          _config.signal.aborted ? onCanceled() : _config.signal.addEventListener("abort", onCanceled);
        }
      }
      const protocol = parseProtocol(_config.url);
      if (protocol && platform.protocols.indexOf(protocol) === -1) {
        reject(new AxiosError("Unsupported protocol " + protocol + ":", AxiosError.ERR_BAD_REQUEST, config));
        return;
      }
      request.send(requestData || null);
    });
  };
  const composeSignals = (signals, timeout) => {
    const { length } = signals = signals ? signals.filter(Boolean) : [];
    if (timeout || length) {
      let controller = new AbortController();
      let aborted;
      const onabort = function(reason) {
        if (!aborted) {
          aborted = true;
          unsubscribe();
          const err = reason instanceof Error ? reason : this.reason;
          controller.abort(err instanceof AxiosError ? err : new CanceledError(err instanceof Error ? err.message : err));
        }
      };
      let timer = timeout && setTimeout(() => {
        timer = null;
        onabort(new AxiosError(`timeout ${timeout} of ms exceeded`, AxiosError.ETIMEDOUT));
      }, timeout);
      const unsubscribe = () => {
        if (signals) {
          timer && clearTimeout(timer);
          timer = null;
          signals.forEach((signal2) => {
            signal2.unsubscribe ? signal2.unsubscribe(onabort) : signal2.removeEventListener("abort", onabort);
          });
          signals = null;
        }
      };
      signals.forEach((signal2) => signal2.addEventListener("abort", onabort));
      const { signal } = controller;
      signal.unsubscribe = () => utils$1.asap(unsubscribe);
      return signal;
    }
  };
  const streamChunk = function* (chunk, chunkSize) {
    let len = chunk.byteLength;
    if (len < chunkSize) {
      yield chunk;
      return;
    }
    let pos = 0;
    let end;
    while (pos < len) {
      end = pos + chunkSize;
      yield chunk.slice(pos, end);
      pos = end;
    }
  };
  const readBytes = async function* (iterable, chunkSize) {
    for await (const chunk of readStream(iterable)) {
      yield* streamChunk(chunk, chunkSize);
    }
  };
  const readStream = async function* (stream) {
    if (stream[Symbol.asyncIterator]) {
      yield* stream;
      return;
    }
    const reader = stream.getReader();
    try {
      for (; ; ) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        yield value;
      }
    } finally {
      await reader.cancel();
    }
  };
  const trackStream = (stream, chunkSize, onProgress, onFinish) => {
    const iterator2 = readBytes(stream, chunkSize);
    let bytes = 0;
    let done;
    let _onFinish = (e) => {
      if (!done) {
        done = true;
        onFinish && onFinish(e);
      }
    };
    return new ReadableStream({
      async pull(controller) {
        try {
          const { done: done2, value } = await iterator2.next();
          if (done2) {
            _onFinish();
            controller.close();
            return;
          }
          let len = value.byteLength;
          if (onProgress) {
            let loadedBytes = bytes += len;
            onProgress(loadedBytes);
          }
          controller.enqueue(new Uint8Array(value));
        } catch (err) {
          _onFinish(err);
          throw err;
        }
      },
      cancel(reason) {
        _onFinish(reason);
        return iterator2.return();
      }
    }, {
      highWaterMark: 2
    });
  };
  const isFetchSupported = typeof fetch === "function" && typeof Request === "function" && typeof Response === "function";
  const isReadableStreamSupported = isFetchSupported && typeof ReadableStream === "function";
  const encodeText = isFetchSupported && (typeof TextEncoder === "function" ? /* @__PURE__ */ ((encoder) => (str) => encoder.encode(str))(new TextEncoder()) : async (str) => new Uint8Array(await new Response(str).arrayBuffer()));
  const test = (fn, ...args) => {
    try {
      return !!fn(...args);
    } catch (e) {
      return false;
    }
  };
  const supportsRequestStream = isReadableStreamSupported && test(() => {
    let duplexAccessed = false;
    const hasContentType = new Request(platform.origin, {
      body: new ReadableStream(),
      method: "POST",
      get duplex() {
        duplexAccessed = true;
        return "half";
      }
    }).headers.has("Content-Type");
    return duplexAccessed && !hasContentType;
  });
  const DEFAULT_CHUNK_SIZE = 64 * 1024;
  const supportsResponseStream = isReadableStreamSupported && test(() => utils$1.isReadableStream(new Response("").body));
  const resolvers = {
    stream: supportsResponseStream && ((res) => res.body)
  };
  isFetchSupported && ((res) => {
    ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((type2) => {
      !resolvers[type2] && (resolvers[type2] = utils$1.isFunction(res[type2]) ? (res2) => res2[type2]() : (_, config) => {
        throw new AxiosError(`Response type '${type2}' is not supported`, AxiosError.ERR_NOT_SUPPORT, config);
      });
    });
  })(new Response());
  const getBodyLength = async (body) => {
    if (body == null) {
      return 0;
    }
    if (utils$1.isBlob(body)) {
      return body.size;
    }
    if (utils$1.isSpecCompliantForm(body)) {
      const _request = new Request(platform.origin, {
        method: "POST",
        body
      });
      return (await _request.arrayBuffer()).byteLength;
    }
    if (utils$1.isArrayBufferView(body) || utils$1.isArrayBuffer(body)) {
      return body.byteLength;
    }
    if (utils$1.isURLSearchParams(body)) {
      body = body + "";
    }
    if (utils$1.isString(body)) {
      return (await encodeText(body)).byteLength;
    }
  };
  const resolveBodyLength = async (headers, body) => {
    const length = utils$1.toFiniteNumber(headers.getContentLength());
    return length == null ? getBodyLength(body) : length;
  };
  const fetchAdapter = isFetchSupported && (async (config) => {
    let {
      url,
      method,
      data,
      signal,
      cancelToken,
      timeout,
      onDownloadProgress,
      onUploadProgress,
      responseType,
      headers,
      withCredentials = "same-origin",
      fetchOptions
    } = resolveConfig(config);
    responseType = responseType ? (responseType + "").toLowerCase() : "text";
    let composedSignal = composeSignals([signal, cancelToken && cancelToken.toAbortSignal()], timeout);
    let request;
    const unsubscribe = composedSignal && composedSignal.unsubscribe && (() => {
      composedSignal.unsubscribe();
    });
    let requestContentLength;
    try {
      if (onUploadProgress && supportsRequestStream && method !== "get" && method !== "head" && (requestContentLength = await resolveBodyLength(headers, data)) !== 0) {
        let _request = new Request(url, {
          method: "POST",
          body: data,
          duplex: "half"
        });
        let contentTypeHeader;
        if (utils$1.isFormData(data) && (contentTypeHeader = _request.headers.get("content-type"))) {
          headers.setContentType(contentTypeHeader);
        }
        if (_request.body) {
          const [onProgress, flush] = progressEventDecorator(
            requestContentLength,
            progressEventReducer(asyncDecorator(onUploadProgress))
          );
          data = trackStream(_request.body, DEFAULT_CHUNK_SIZE, onProgress, flush);
        }
      }
      if (!utils$1.isString(withCredentials)) {
        withCredentials = withCredentials ? "include" : "omit";
      }
      const isCredentialsSupported = "credentials" in Request.prototype;
      request = new Request(url, {
        ...fetchOptions,
        signal: composedSignal,
        method: method.toUpperCase(),
        headers: headers.normalize().toJSON(),
        body: data,
        duplex: "half",
        credentials: isCredentialsSupported ? withCredentials : void 0
      });
      let response = await fetch(request, fetchOptions);
      const isStreamResponse = supportsResponseStream && (responseType === "stream" || responseType === "response");
      if (supportsResponseStream && (onDownloadProgress || isStreamResponse && unsubscribe)) {
        const options = {};
        ["status", "statusText", "headers"].forEach((prop) => {
          options[prop] = response[prop];
        });
        const responseContentLength = utils$1.toFiniteNumber(response.headers.get("content-length"));
        const [onProgress, flush] = onDownloadProgress && progressEventDecorator(
          responseContentLength,
          progressEventReducer(asyncDecorator(onDownloadProgress), true)
        ) || [];
        response = new Response(
          trackStream(response.body, DEFAULT_CHUNK_SIZE, onProgress, () => {
            flush && flush();
            unsubscribe && unsubscribe();
          }),
          options
        );
      }
      responseType = responseType || "text";
      let responseData = await resolvers[utils$1.findKey(resolvers, responseType) || "text"](response, config);
      !isStreamResponse && unsubscribe && unsubscribe();
      return await new Promise((resolve, reject) => {
        settle(resolve, reject, {
          data: responseData,
          headers: AxiosHeaders.from(response.headers),
          status: response.status,
          statusText: response.statusText,
          config,
          request
        });
      });
    } catch (err) {
      unsubscribe && unsubscribe();
      if (err && err.name === "TypeError" && /Load failed|fetch/i.test(err.message)) {
        throw Object.assign(
          new AxiosError("Network Error", AxiosError.ERR_NETWORK, config, request),
          {
            cause: err.cause || err
          }
        );
      }
      throw AxiosError.from(err, err && err.code, config, request);
    }
  });
  const knownAdapters = {
    http: httpAdapter,
    xhr: xhrAdapter,
    fetch: fetchAdapter
  };
  utils$1.forEach(knownAdapters, (fn, value) => {
    if (fn) {
      try {
        Object.defineProperty(fn, "name", { value });
      } catch (e) {
      }
      Object.defineProperty(fn, "adapterName", { value });
    }
  });
  const renderReason = (reason) => `- ${reason}`;
  const isResolvedHandle = (adapter) => utils$1.isFunction(adapter) || adapter === null || adapter === false;
  const adapters = {
    getAdapter: (adapters2) => {
      adapters2 = utils$1.isArray(adapters2) ? adapters2 : [adapters2];
      const { length } = adapters2;
      let nameOrAdapter;
      let adapter;
      const rejectedReasons = {};
      for (let i = 0; i < length; i++) {
        nameOrAdapter = adapters2[i];
        let id;
        adapter = nameOrAdapter;
        if (!isResolvedHandle(nameOrAdapter)) {
          adapter = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];
          if (adapter === void 0) {
            throw new AxiosError(`Unknown adapter '${id}'`);
          }
        }
        if (adapter) {
          break;
        }
        rejectedReasons[id || "#" + i] = adapter;
      }
      if (!adapter) {
        const reasons = Object.entries(rejectedReasons).map(
          ([id, state]) => `adapter ${id} ` + (state === false ? "is not supported by the environment" : "is not available in the build")
        );
        let s = length ? reasons.length > 1 ? "since :\n" + reasons.map(renderReason).join("\n") : " " + renderReason(reasons[0]) : "as no adapter specified";
        throw new AxiosError(
          `There is no suitable adapter to dispatch the request ` + s,
          "ERR_NOT_SUPPORT"
        );
      }
      return adapter;
    },
    adapters: knownAdapters
  };
  function throwIfCancellationRequested(config) {
    if (config.cancelToken) {
      config.cancelToken.throwIfRequested();
    }
    if (config.signal && config.signal.aborted) {
      throw new CanceledError(null, config);
    }
  }
  function dispatchRequest(config) {
    throwIfCancellationRequested(config);
    config.headers = AxiosHeaders.from(config.headers);
    config.data = transformData.call(
      config,
      config.transformRequest
    );
    if (["post", "put", "patch"].indexOf(config.method) !== -1) {
      config.headers.setContentType("application/x-www-form-urlencoded", false);
    }
    const adapter = adapters.getAdapter(config.adapter || defaults.adapter);
    return adapter(config).then(function onAdapterResolution(response) {
      throwIfCancellationRequested(config);
      response.data = transformData.call(
        config,
        config.transformResponse,
        response
      );
      response.headers = AxiosHeaders.from(response.headers);
      return response;
    }, function onAdapterRejection(reason) {
      if (!isCancel(reason)) {
        throwIfCancellationRequested(config);
        if (reason && reason.response) {
          reason.response.data = transformData.call(
            config,
            config.transformResponse,
            reason.response
          );
          reason.response.headers = AxiosHeaders.from(reason.response.headers);
        }
      }
      return Promise.reject(reason);
    });
  }
  const VERSION = "1.10.0";
  const validators$1 = {};
  ["object", "boolean", "number", "function", "string", "symbol"].forEach((type2, i) => {
    validators$1[type2] = function validator2(thing) {
      return typeof thing === type2 || "a" + (i < 1 ? "n " : " ") + type2;
    };
  });
  const deprecatedWarnings = {};
  validators$1.transitional = function transitional(validator2, version2, message) {
    function formatMessage(opt, desc) {
      return "[Axios v" + VERSION + "] Transitional option '" + opt + "'" + desc + (message ? ". " + message : "");
    }
    return (value, opt, opts) => {
      if (validator2 === false) {
        throw new AxiosError(
          formatMessage(opt, " has been removed" + (version2 ? " in " + version2 : "")),
          AxiosError.ERR_DEPRECATED
        );
      }
      if (version2 && !deprecatedWarnings[opt]) {
        deprecatedWarnings[opt] = true;
        console.warn(
          formatMessage(
            opt,
            " has been deprecated since v" + version2 + " and will be removed in the near future"
          )
        );
      }
      return validator2 ? validator2(value, opt, opts) : true;
    };
  };
  validators$1.spelling = function spelling(correctSpelling) {
    return (value, opt) => {
      console.warn(`${opt} is likely a misspelling of ${correctSpelling}`);
      return true;
    };
  };
  function assertOptions(options, schema, allowUnknown) {
    if (typeof options !== "object") {
      throw new AxiosError("options must be an object", AxiosError.ERR_BAD_OPTION_VALUE);
    }
    const keys = Object.keys(options);
    let i = keys.length;
    while (i-- > 0) {
      const opt = keys[i];
      const validator2 = schema[opt];
      if (validator2) {
        const value = options[opt];
        const result = value === void 0 || validator2(value, opt, options);
        if (result !== true) {
          throw new AxiosError("option " + opt + " must be " + result, AxiosError.ERR_BAD_OPTION_VALUE);
        }
        continue;
      }
      if (allowUnknown !== true) {
        throw new AxiosError("Unknown option " + opt, AxiosError.ERR_BAD_OPTION);
      }
    }
  }
  const validator = {
    assertOptions,
    validators: validators$1
  };
  const validators = validator.validators;
  class Axios {
    constructor(instanceConfig) {
      this.defaults = instanceConfig || {};
      this.interceptors = {
        request: new InterceptorManager(),
        response: new InterceptorManager()
      };
    }
    /**
     * Dispatch a request
     *
     * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
     * @param {?Object} config
     *
     * @returns {Promise} The Promise to be fulfilled
     */
    async request(configOrUrl, config) {
      try {
        return await this._request(configOrUrl, config);
      } catch (err) {
        if (err instanceof Error) {
          let dummy = {};
          Error.captureStackTrace ? Error.captureStackTrace(dummy) : dummy = new Error();
          const stack = dummy.stack ? dummy.stack.replace(/^.+\n/, "") : "";
          try {
            if (!err.stack) {
              err.stack = stack;
            } else if (stack && !String(err.stack).endsWith(stack.replace(/^.+\n.+\n/, ""))) {
              err.stack += "\n" + stack;
            }
          } catch (e) {
          }
        }
        throw err;
      }
    }
    _request(configOrUrl, config) {
      if (typeof configOrUrl === "string") {
        config = config || {};
        config.url = configOrUrl;
      } else {
        config = configOrUrl || {};
      }
      config = mergeConfig(this.defaults, config);
      const { transitional: transitional2, paramsSerializer, headers } = config;
      if (transitional2 !== void 0) {
        validator.assertOptions(transitional2, {
          silentJSONParsing: validators.transitional(validators.boolean),
          forcedJSONParsing: validators.transitional(validators.boolean),
          clarifyTimeoutError: validators.transitional(validators.boolean)
        }, false);
      }
      if (paramsSerializer != null) {
        if (utils$1.isFunction(paramsSerializer)) {
          config.paramsSerializer = {
            serialize: paramsSerializer
          };
        } else {
          validator.assertOptions(paramsSerializer, {
            encode: validators.function,
            serialize: validators.function
          }, true);
        }
      }
      if (config.allowAbsoluteUrls !== void 0) ;
      else if (this.defaults.allowAbsoluteUrls !== void 0) {
        config.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls;
      } else {
        config.allowAbsoluteUrls = true;
      }
      validator.assertOptions(config, {
        baseUrl: validators.spelling("baseURL"),
        withXsrfToken: validators.spelling("withXSRFToken")
      }, true);
      config.method = (config.method || this.defaults.method || "get").toLowerCase();
      let contextHeaders = headers && utils$1.merge(
        headers.common,
        headers[config.method]
      );
      headers && utils$1.forEach(
        ["delete", "get", "head", "post", "put", "patch", "common"],
        (method) => {
          delete headers[method];
        }
      );
      config.headers = AxiosHeaders.concat(contextHeaders, headers);
      const requestInterceptorChain = [];
      let synchronousRequestInterceptors = true;
      this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
        if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config) === false) {
          return;
        }
        synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
        requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
      });
      const responseInterceptorChain = [];
      this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
        responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
      });
      let promise;
      let i = 0;
      let len;
      if (!synchronousRequestInterceptors) {
        const chain = [dispatchRequest.bind(this), void 0];
        chain.unshift.apply(chain, requestInterceptorChain);
        chain.push.apply(chain, responseInterceptorChain);
        len = chain.length;
        promise = Promise.resolve(config);
        while (i < len) {
          promise = promise.then(chain[i++], chain[i++]);
        }
        return promise;
      }
      len = requestInterceptorChain.length;
      let newConfig = config;
      i = 0;
      while (i < len) {
        const onFulfilled = requestInterceptorChain[i++];
        const onRejected = requestInterceptorChain[i++];
        try {
          newConfig = onFulfilled(newConfig);
        } catch (error) {
          onRejected.call(this, error);
          break;
        }
      }
      try {
        promise = dispatchRequest.call(this, newConfig);
      } catch (error) {
        return Promise.reject(error);
      }
      i = 0;
      len = responseInterceptorChain.length;
      while (i < len) {
        promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
      }
      return promise;
    }
    getUri(config) {
      config = mergeConfig(this.defaults, config);
      const fullPath = buildFullPath(config.baseURL, config.url, config.allowAbsoluteUrls);
      return buildURL(fullPath, config.params, config.paramsSerializer);
    }
  }
  utils$1.forEach(["delete", "get", "head", "options"], function forEachMethodNoData(method) {
    Axios.prototype[method] = function(url, config) {
      return this.request(mergeConfig(config || {}, {
        method,
        url,
        data: (config || {}).data
      }));
    };
  });
  utils$1.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
    function generateHTTPMethod(isForm) {
      return function httpMethod(url, data, config) {
        return this.request(mergeConfig(config || {}, {
          method,
          headers: isForm ? {
            "Content-Type": "multipart/form-data"
          } : {},
          url,
          data
        }));
      };
    }
    Axios.prototype[method] = generateHTTPMethod();
    Axios.prototype[method + "Form"] = generateHTTPMethod(true);
  });
  class CancelToken {
    constructor(executor) {
      if (typeof executor !== "function") {
        throw new TypeError("executor must be a function.");
      }
      let resolvePromise;
      this.promise = new Promise(function promiseExecutor(resolve) {
        resolvePromise = resolve;
      });
      const token = this;
      this.promise.then((cancel) => {
        if (!token._listeners) return;
        let i = token._listeners.length;
        while (i-- > 0) {
          token._listeners[i](cancel);
        }
        token._listeners = null;
      });
      this.promise.then = (onfulfilled) => {
        let _resolve;
        const promise = new Promise((resolve) => {
          token.subscribe(resolve);
          _resolve = resolve;
        }).then(onfulfilled);
        promise.cancel = function reject() {
          token.unsubscribe(_resolve);
        };
        return promise;
      };
      executor(function cancel(message, config, request) {
        if (token.reason) {
          return;
        }
        token.reason = new CanceledError(message, config, request);
        resolvePromise(token.reason);
      });
    }
    /**
     * Throws a `CanceledError` if cancellation has been requested.
     */
    throwIfRequested() {
      if (this.reason) {
        throw this.reason;
      }
    }
    /**
     * Subscribe to the cancel signal
     */
    subscribe(listener) {
      if (this.reason) {
        listener(this.reason);
        return;
      }
      if (this._listeners) {
        this._listeners.push(listener);
      } else {
        this._listeners = [listener];
      }
    }
    /**
     * Unsubscribe from the cancel signal
     */
    unsubscribe(listener) {
      if (!this._listeners) {
        return;
      }
      const index = this._listeners.indexOf(listener);
      if (index !== -1) {
        this._listeners.splice(index, 1);
      }
    }
    toAbortSignal() {
      const controller = new AbortController();
      const abort = (err) => {
        controller.abort(err);
      };
      this.subscribe(abort);
      controller.signal.unsubscribe = () => this.unsubscribe(abort);
      return controller.signal;
    }
    /**
     * Returns an object that contains a new `CancelToken` and a function that, when called,
     * cancels the `CancelToken`.
     */
    static source() {
      let cancel;
      const token = new CancelToken(function executor(c) {
        cancel = c;
      });
      return {
        token,
        cancel
      };
    }
  }
  function spread(callback) {
    return function wrap(arr) {
      return callback.apply(null, arr);
    };
  }
  function isAxiosError(payload) {
    return utils$1.isObject(payload) && payload.isAxiosError === true;
  }
  const HttpStatusCode = {
    Continue: 100,
    SwitchingProtocols: 101,
    Processing: 102,
    EarlyHints: 103,
    Ok: 200,
    Created: 201,
    Accepted: 202,
    NonAuthoritativeInformation: 203,
    NoContent: 204,
    ResetContent: 205,
    PartialContent: 206,
    MultiStatus: 207,
    AlreadyReported: 208,
    ImUsed: 226,
    MultipleChoices: 300,
    MovedPermanently: 301,
    Found: 302,
    SeeOther: 303,
    NotModified: 304,
    UseProxy: 305,
    Unused: 306,
    TemporaryRedirect: 307,
    PermanentRedirect: 308,
    BadRequest: 400,
    Unauthorized: 401,
    PaymentRequired: 402,
    Forbidden: 403,
    NotFound: 404,
    MethodNotAllowed: 405,
    NotAcceptable: 406,
    ProxyAuthenticationRequired: 407,
    RequestTimeout: 408,
    Conflict: 409,
    Gone: 410,
    LengthRequired: 411,
    PreconditionFailed: 412,
    PayloadTooLarge: 413,
    UriTooLong: 414,
    UnsupportedMediaType: 415,
    RangeNotSatisfiable: 416,
    ExpectationFailed: 417,
    ImATeapot: 418,
    MisdirectedRequest: 421,
    UnprocessableEntity: 422,
    Locked: 423,
    FailedDependency: 424,
    TooEarly: 425,
    UpgradeRequired: 426,
    PreconditionRequired: 428,
    TooManyRequests: 429,
    RequestHeaderFieldsTooLarge: 431,
    UnavailableForLegalReasons: 451,
    InternalServerError: 500,
    NotImplemented: 501,
    BadGateway: 502,
    ServiceUnavailable: 503,
    GatewayTimeout: 504,
    HttpVersionNotSupported: 505,
    VariantAlsoNegotiates: 506,
    InsufficientStorage: 507,
    LoopDetected: 508,
    NotExtended: 510,
    NetworkAuthenticationRequired: 511
  };
  Object.entries(HttpStatusCode).forEach(([key, value]) => {
    HttpStatusCode[value] = key;
  });
  function createInstance(defaultConfig) {
    const context = new Axios(defaultConfig);
    const instance = bind(Axios.prototype.request, context);
    utils$1.extend(instance, Axios.prototype, context, { allOwnKeys: true });
    utils$1.extend(instance, context, null, { allOwnKeys: true });
    instance.create = function create(instanceConfig) {
      return createInstance(mergeConfig(defaultConfig, instanceConfig));
    };
    return instance;
  }
  const axios = createInstance(defaults);
  axios.Axios = Axios;
  axios.CanceledError = CanceledError;
  axios.CancelToken = CancelToken;
  axios.isCancel = isCancel;
  axios.VERSION = VERSION;
  axios.toFormData = toFormData;
  axios.AxiosError = AxiosError;
  axios.Cancel = axios.CanceledError;
  axios.all = function all(promises) {
    return Promise.all(promises);
  };
  axios.spread = spread;
  axios.isAxiosError = isAxiosError;
  axios.mergeConfig = mergeConfig;
  axios.AxiosHeaders = AxiosHeaders;
  axios.formToJSON = (thing) => formDataToJSON(utils$1.isHTMLForm(thing) ? new FormData(thing) : thing);
  axios.getAdapter = adapters.getAdapter;
  axios.HttpStatusCode = HttpStatusCode;
  axios.default = axios;
  const DEFAULT_PROMPT = `# Role: 验证码识别专家

## Profile
- language: 中文
- description: 一个专为高精度识别验证码而设计的AI模型。能够快速、准确地从复杂的图像中提取字符或计算数学表达式的结果，并能有效对抗常见的干扰元素。
- background: 基于海量、多样的验证码图像数据集进行深度训练，精通各种字符扭曲、粘连、遮挡和背景干扰的识别技术，具备强大的泛化能力。
- personality: 精确、高效、客观、直接。只关注任务本身，不产生任何与结果无关的额外信息。
- expertise: 计算机视觉、高级光学字符识别（OCR）、图像预处理与去噪、模式识别、基础算术逻辑。
- target_audience: 需要自动化处理验证码的开发者、自动化测试工程师、数据科学家。

## Skills

1. 核心识别能力
   - 高精度字符识别: 准确识别大小写英文字母、数字，并能精确区分外形相似的字符（如：0和O，1和l，g和9）。
   - 数学运算处理: 识别并解析图片中的数学算式（如：3+5*2），并计算出最终的数值结果。
   - 强抗干扰能力: 自动过滤和忽略图像中的干扰线、噪点、斑块、背景纹理等非关键信息。
   - 字符分割技术: 即使在字符粘连、重叠或间距不等的情况下，也能有效地将其分离以便独立识别。

2. 辅助处理能力
   - 图像预处理: 自动对输入图像进行灰度化、二值化、去噪等操作，以提升识别的准确率。
   - 快速响应: 以极低的延迟返回识别结果，满足实时性要求。
   - 结果格式化: 严格按照指定的格式输出，确保输出的纯净性，便于程序调用。
   - 鲁棒性: 对于不同字体、大小、颜色、角度的字符组合均有较高的识别成功率。

## Rules

1. 基本原则：
   - 结果唯一: 输出内容必须是且仅是验证码的识别结果。
   - 绝对精确: 尽最大努力确保字符识别的大小写和数值计算的准确性。
   - 任务聚焦: 仅处理验证码内容，忽略图像中的任何其他元素。
   - 保持静默: 除最终结果外，不输出任何提示、标签、解释或说明。

2. 行为准则：
   - 直接输出结果: 若为字符型验证码，直接返回字符串；若为计算题，直接返回计算后的数字。
   - 严格区分大小写: 必须准确识别并返回字符的原始大小写形式（例如'W'和'w'是不同字符）。
   - 精准区分易混淆字符: 必须对数字“0”和字母“O”、数字“1”和字母“l”等易混淆字符进行准确区分。
   - 自动执行运算: 遇到数学表达式时，必须完成计算并仅返回最终的阿拉伯数字结果。

3. 限制条件：
   - 禁止任何解释: 不得对识别过程、结果的置信度或遇到的困难进行任何说明。
   - 禁止附加文本: 返回的最终结果前后不能有任何空格、引号、标签或“答案是：”等引导性词语。
   - 禁止互动: 不得向用户提问或请求更清晰的图片。
   - 禁止失败提示: 即使无法完全识别，也应根据已识别内容尽力输出，而不是返回“无法识别”之类的自然语言。

## Workflows

- 目标: 接收一张验证码图片，精准、快速地返回其内容或计算结果。
- 步骤 1: 接收图像并进行分析，判断验证码类型（字符型或数学计算型）。
- 步骤 2: 应用图像预处理技术，对图像进行降噪、增强和二值化，以凸显关键字符，强制消除干扰线和背景。
- 步骤 3: 对处理后的图像进行字符分割，然后逐一识别。对于数学题，则识别数字和运算符。
- 步骤 4: 整合识别结果。如果是字符，则按顺序拼接成字符串；如果是数学题，则执行运算。
- 步骤 5: 输出最终结果。确保输出内容绝对纯净，符合Rules中的所有规定。
- 预期结果: 一个不包含任何多余信息的字符串（如“aB5fG”）或一个数字（如“28”）。


## Initialization
作为验证码识别专家，你必须遵守上述Rules，按照Workflows执行任务。`;
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main = {
    data() {
      return {
        packageJson,
        // 导入的常量
        DEFAULT_PROMPT,
        // API 测试状态
        apiTestStatus: {
          openai: "",
          // 可能的值：'', 'loading', 'success', 'error'
          gemini: "",
          // 可能的值：'', 'loading', 'success', 'error'
          qwen: ""
          // 可能的值：'', 'loading', 'success', 'error'
        },
        // 验证码规则配置
        rules: [],
        // 规则加载状态
        rulesLoadStatus: "",
        // 可能的值：'', 'loading', 'success', 'error'
        // 设置项
        settings: {
          apiType: "openai",
          // openai, gemini, qwen
          // OpenAI 设置
          openaiKey: "",
          openaiApiUrl: "",
          openaiModel: "",
          openaiPrompt: DEFAULT_PROMPT,
          // 自定义提示词，默认填充
          // Gemini 设置
          geminiKey: "",
          geminiApiUrl: "",
          geminiModel: "",
          geminiPrompt: DEFAULT_PROMPT,
          // 自定义提示词，默认填充
          // 通义千问设置
          qwenKey: "",
          qwenApiUrl: "",
          qwenModel: "",
          qwenPrompt: DEFAULT_PROMPT,
          // 自定义提示词，默认填充
          // 自动识别设置
          autoRecognize: false,
          // 是否启用自动识别
          // 剪贴板设置
          copyToClipboard: true,
          // 是否自动复制到剪贴板
          // 通知设置
          showNotification: true,
          // 是否显示右上角通知，默认开启
          // 云端规则设置
          autoFetchCloudRules: false,
          // 是否每日首次运行时自动获取云端规则，默认关闭
          // 自定义选择器
          customCaptchaSelectors: [],
          customInputSelectors: [],
          // 禁用域名列表
          disabledDomains: "",
          // 不启用验证码功能的网站域名列表，支持正则和通配符
          // 规则 URL
          rulesUrl: "https://raw.githubusercontent.com/anghunk/UserScript/main/CAPTCHA-automatic-recognition/rules.json"
          // 规则文件 URL
        },
        // 是否显示设置面板
        showSettings: false,
        // 当前激活的设置标签页
        activeSettingTab: "ai",
        // 配置选项
        config: {
          // 验证码图片选择器
          captchaSelectors: [
            'img[src*="captcha"]',
            'img[src*="verify"]',
            'img[alt*="验证码"]',
            'img[title*="验证码"]',
            'img[alt*="captcha"]',
            'img[id="captchaPic"]',
            ".validate-code img",
            'img[style="z-index: 2; position: absolute; bottom: -11px; left: 206px; width: 88px; height: 40px;"]',
            '.authcode img[id="authImage"]',
            'img[class="verification-img"]',
            'img[name="imgCaptcha"]'
          ],
          // 相关输入框选择器 (通常在验证码图片附近的输入框)
          inputSelectors: [
            'input[name*="captcha"]',
            'input[name*="verify"]',
            'input[placeholder="请输入图片验证码"]',
            'input[id="authcode"]',
            'input[placeholder*="captcha"]',
            'input[placeholder*="验证码"]:not([placeholder*="短信"])'
          ]
        },
        // 用于在模板中访问环境变量
        process: {
          env: {
            NODE_ENV: "production"
          }
        }
      };
    },
    methods: {
      /**
       * 获取 API 类型名称
       * @param {string} apiType - API 类型
       * @returns {string} - 名称
       */
      getApiTypeName(apiType) {
        switch (apiType) {
          case "openai":
            return "OpenAI";
          case "gemini":
            return "Google Gemini";
          case "qwen":
            return "阿里云通义千问";
          default:
            return "未知";
        }
      },
      /**
       * 加载用户设置
       */
      loadSettings() {
        try {
          if (typeof GM_getValue !== "undefined") {
            const savedSettings = GM_getValue("captchaSettings");
            if (savedSettings) {
              const parsedSettings = JSON.parse(savedSettings);
              this.settings = { ...this.settings, ...parsedSettings };
            }
            const savedRules = GM_getValue("captchaRules");
            if (savedRules) {
              this.rules = JSON.parse(savedRules);
            } else {
              this.loadRules();
            }
          } else {
            const localSettings = localStorage.getItem("captchaSettings");
            if (localSettings) {
              const parsedSettings = JSON.parse(localSettings);
              this.settings = { ...this.settings, ...parsedSettings };
            }
            const localRules = localStorage.getItem("captchaRules");
            if (localRules) {
              this.rules = JSON.parse(localRules);
            } else {
              this.loadRules();
            }
          }
        } catch (error) {
          console.error("加载设置失败：", error);
        }
      },
      /**
       * 加载验证码规则
       */
      async loadRules() {
        try {
          this.rulesLoadStatus = "loading";
          let rulesData;
          const rulesUrl = this.settings.rulesUrl || "https://raw.githubusercontent.com/anghunk/UserScript/main/CAPTCHA-automatic-recognition/rules.json";
          const response = await this.request({
            method: "GET",
            url: rulesUrl,
            responseType: "json"
          });
          if (response && response.data) {
            rulesData = response.data;
            if (typeof GM_setValue !== "undefined") {
              GM_setValue("captchaRules", JSON.stringify(rulesData));
            } else {
              localStorage.setItem("captchaRules", JSON.stringify(rulesData));
            }
            this.rules = rulesData;
            this.rulesLoadStatus = "success";
            this.showToast("规则加载成功！", "success");
          } else {
            this.rulesLoadStatus = "error";
            this.showToast("规则加载失败，请稍后重试", "error");
          }
        } catch (error) {
          console.error("加载规则失败：", error);
          this.rulesLoadStatus = "error";
          this.showToast("规则加载失败：" + (error.message || "未知错误"), "error");
        }
      },
      /**
       * 重新加载验证码规则
       */
      async reloadRules() {
        await this.loadRules();
      },
      /**
       * 显示设置面板
       */
      openSettings() {
        document.body.classList.add("captcha-settings-open");
        this.showSettings = true;
      },
      /**
       * 关闭设置面板
       */
      closeSettings() {
        document.body.classList.remove("captcha-settings-open");
        this.showSettings = false;
      },
      /**
       * 保存用户设置
       */
      saveSettings() {
        try {
          if (typeof GM_setValue !== "undefined") {
            GM_setValue("captchaSettings", JSON.stringify(this.settings));
          } else {
            localStorage.setItem("captchaSettings", JSON.stringify(this.settings));
          }
          this.closeSettings();
          this.showToast("设置已保存！", "success");
        } catch (error) {
          console.error("保存设置失败：", error);
          this.showToast("保存设置失败，请查看控制台获取更多信息。", "error");
        }
      },
      /**
       * 使用 AI 识别验证码
       * @param {string} base64Image - 验证码图片的 base64 编码
       * @returns {Promise<string>} - 识别结果
       */
      async recognizeCaptcha(base64Image) {
        if (!this.isApiConfigured()) {
          console.error("未配置验证码识别 API");
          this.showToast("请先配置验证码识别 API", "error");
          this.openSettings();
          return "";
        }
        let result = "";
        try {
          this.showToast("正在识别验证码...", "info");
          switch (this.settings.apiType) {
            case "openai":
              result = await this.recognizeWithOpenAI(base64Image);
              break;
            case "gemini":
              result = await this.recognizeWithGemini(base64Image);
              break;
            case "qwen":
              result = await this.recognizeWithQwen(base64Image);
              break;
            default:
              this.showToast(`未知的 API 类型：${this.settings.apiType}`, "error");
              return "";
          }
          if (result) {
            this.showToast(`识别成功：${result}`, "success");
          } else {
            console.error("验证码识别结果为空");
            this.showToast("识别结果为空", "error");
          }
          return result;
        } catch (error) {
          console.error("验证码识别失败：", error);
          this.showToast("识别失败：" + (error.message || "未知错误"), "error");
          return "";
        }
      },
      /**
       * 检查 API 是否配置
       * @param {string} specificType - 指定要检查的 API 类型，不传则检查当前选中的 API
       * @returns {boolean} - API 是否已配置
       */
      isApiConfigured(specificType) {
        const typeToCheck = specificType || this.settings.apiType;
        switch (typeToCheck) {
          case "openai":
            return !!this.settings.openaiKey;
          case "gemini":
            return !!this.settings.geminiKey;
          case "qwen":
            return !!this.settings.qwenKey;
          default:
            return false;
        }
      },
      /**
       * 将图片或 canvas 转换为 base64 格式
       * @param {HTMLImageElement|HTMLCanvasElement} element - 图片或 canvas 元素
       * @returns {Object} - 返回包含成功状态和数据的对象
       */
      imageToBase64(element) {
        try {
          if (element.tagName === "CANVAS") {
            try {
              const base64Data2 = element.toDataURL("image/png").split(",")[1];
              if (!base64Data2 || base64Data2.length < 100) {
                console.error("生成的canvas base64数据无效或过短");
                return {
                  success: false,
                  message: "Canvas数据转换失败或内容为空。请刷新验证码后重试。"
                };
              }
              return {
                success: true,
                data: base64Data2
              };
            } catch (e) {
              console.error("从Canvas获取数据失败:", e);
              return {
                success: false,
                message: "无法从Canvas获取数据，可能是跨域限制。" + (e.message || "")
              };
            }
          }
          const imgSrc = element.src;
          if (!element.complete || !element.naturalWidth) {
            return {
              success: false,
              message: "图片尚未加载完成，请稍后重试"
            };
          }
          if (!imgSrc.startsWith("data:image") && !this.isSameOrigin(imgSrc)) {
            if (element.crossOrigin !== "anonymous") {
              element.crossOrigin = "anonymous";
              const timestamp = (/* @__PURE__ */ new Date()).getTime();
              const separator = imgSrc.includes("?") ? "&" : "?";
              element.src = `${imgSrc}${separator}_t=${timestamp}`;
              return {
                success: false,
                message: "正在处理跨域图片，请稍后重试"
              };
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = element.naturalWidth || element.width;
          canvas.height = element.naturalHeight || element.height;
          const ctx = canvas.getContext("2d");
          try {
            ctx.drawImage(element, 0, 0);
            ctx.getImageData(0, 0, 1, 1);
          } catch (e) {
            console.error("绘制图片到Canvas失败:", e);
            return {
              success: false,
              message: "无法读取图片数据，可能是跨域限制。请尝试手动下载验证码图片后识别。"
            };
          }
          const base64Data = canvas.toDataURL("image/png").split(",")[1];
          if (!base64Data || base64Data.length < 100) {
            console.error("生成的base64数据无效或过短");
            return {
              success: false,
              message: "图片转换失败或内容为空。请刷新验证码后重试。"
            };
          }
          return {
            success: true,
            data: base64Data
          };
        } catch (error) {
          console.error("图片转base64失败:", error);
          return {
            success: false,
            message: "图片转换失败: " + (error.message || "未知错误")
          };
        }
      },
      /**
       * 检查URL是否与当前页面同源
       * @param {string} url - 要检查的URL
       * @returns {boolean} - 是否同源
       */
      isSameOrigin(url) {
        try {
          const currentOrigin = window.location.origin;
          const urlObj = new URL(url, currentOrigin);
          return urlObj.origin === currentOrigin;
        } catch (e) {
          return false;
        }
      },
      /**
       * 格式化OpenAI API URL，如果只提供了前缀，自动补全'/v1/chat/completions'
       * @param {string} url - 原始URL
       * @returns {string} - 格式化后的URL
       */
      formatOpenAIUrl(url) {
        if (!url) {
          return "https://api.openai.com/v1/chat/completions";
        }
        if (url.endsWith("#")) {
          return url.slice(0, -1);
        }
        if (url.endsWith("/chat/completions")) {
          return url;
        }
        if (!url.endsWith("/v1/chat/completions")) {
          url = url.replace(/\/+$/, "");
          url = `${url}/v1/chat/completions`;
        }
        return url;
      },
      /**
       * 使用OpenAI API识别验证码
       */
      async recognizeWithOpenAI(base64Image) {
        const apiUrl = this.formatOpenAIUrl(this.settings.openaiApiUrl);
        const model = this.settings.openaiModel || "gpt-4.1-mini";
        const prompt = this.settings.openaiPrompt || DEFAULT_PROMPT;
        const response = await this.request({
          method: "POST",
          url: apiUrl,
          data: {
            model,
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: prompt
                  },
                  {
                    type: "image_url",
                    image_url: {
                      url: `data:image/png;base64,${base64Image}`
                    }
                  }
                ]
              }
            ],
            max_tokens: 300
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.settings.openaiKey}`
          }
        });
        const content = response.data.choices[0].message.content.trim();
        return content.replace(/[^a-zA-Z0-9\-]/g, "");
      },
      /**
       * 使用Google Gemini API识别验证码
       */
      async recognizeWithGemini(base64Image) {
        var _a, _b, _c, _d;
        const model = this.settings.geminiModel || "gemini-2.5-flash-lite";
        const baseApiUrl = this.settings.geminiApiUrl || "https://generativelanguage.googleapis.com/v1beta/models";
        const apiUrl = `${baseApiUrl}/${model}:generateContent`;
        const prompt = this.settings.geminiPrompt || DEFAULT_PROMPT;
        const response = await this.request({
          method: "POST",
          url: `${apiUrl}?key=${this.settings.geminiKey}`,
          data: {
            contents: [
              {
                parts: [
                  {
                    inline_data: {
                      mime_type: "image/png",
                      data: base64Image
                    }
                  },
                  {
                    text: prompt
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0
            }
          },
          headers: {
            "Content-Type": "application/json"
          }
        });
        const parts = (_d = (_c = (_b = (_a = response == null ? void 0 : response.data) == null ? void 0 : _a.candidates) == null ? void 0 : _b[0]) == null ? void 0 : _c.content) == null ? void 0 : _d.parts;
        if (!Array.isArray(parts) || parts.length === 0) {
          return "";
        }
        let fullText = "";
        for (const part of parts) {
          if (typeof (part == null ? void 0 : part.text) === "string" && part.text && !part.thought) {
            fullText += part.text;
          }
        }
        if (!fullText) {
          return "";
        }
        const cleanText = fullText.replace(/<think>[\s\S]*?<\/think>/gi, "");
        return cleanText.replace(/[^a-zA-Z0-9\-]/g, "");
      },
      /**
       * 使用通义千问 API 识别验证码（新版 API 格式，messages/content 结构）
       */
      async recognizeWithQwen(base64Image) {
        const apiUrl = this.settings.qwenApiUrl || "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";
        const model = this.settings.qwenModel || "qwen-vl-max-2025-04-02";
        const prompt = this.settings.qwenPrompt || DEFAULT_PROMPT;
        const response = await this.request({
          method: "POST",
          url: apiUrl,
          data: {
            model,
            messages: [
              {
                role: "user",
                content: [
                  { type: "text", text: prompt },
                  {
                    type: "image_url",
                    image_url: { url: `data:image/png;base64,${base64Image}` }
                  }
                ]
              }
            ],
            temperature: 0.1,
            top_p: 1,
            stream: false
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.settings.qwenKey}`
          }
        });
        if (response.data && response.data.choices && response.data.choices.length > 0) {
          const text = response.data.choices[0].message.content;
          return text.replace(/[^a-zA-Z0-9\-]/g, "");
        }
        return "";
      },
      /**
       * 获取合并后的选择器字符串
       * @param {Array} selectors - 选择器数组
       * @returns {string} - 合并后的选择器字符串
       */
      getCombinedSelector(selectors) {
        let allSelectors = [...selectors];
        if (selectors === this.config.captchaSelectors && this.settings.customCaptchaSelectors) {
          allSelectors = [
            ...allSelectors,
            ...this.settings.customCaptchaSelectors.filter((s) => s.trim())
          ];
        }
        if (selectors === this.config.inputSelectors && this.settings.customInputSelectors) {
          allSelectors = [
            ...allSelectors,
            ...this.settings.customInputSelectors.filter((s) => s.trim())
          ];
        }
        return allSelectors.join(", ");
      },
      /**
       * 检测页面上的验证码图片
       */
      detectCaptchas() {
        if (this.captchaCheckInterval) {
          clearInterval(this.captchaCheckInterval);
        }
        this.captchaCheckInterval = setInterval(() => {
          const currentUrl = window.location.href;
          if (this.isCurrentDomainDisabled()) {
            return;
          }
          let captchaSelectors = [...this.config.captchaSelectors];
          if (Array.isArray(this.settings.customCaptchaSelectors)) {
            captchaSelectors = captchaSelectors.concat(
              this.settings.customCaptchaSelectors.filter((s) => s && s.trim())
            );
          }
          let inputSelectors = [...this.config.inputSelectors];
          if (Array.isArray(this.settings.customInputSelectors)) {
            inputSelectors = inputSelectors.concat(
              this.settings.customInputSelectors.filter((s) => s && s.trim())
            );
          }
          if (Array.isArray(this.rules) && this.rules.length > 0) {
            for (const rule of this.rules) {
              if (!rule.captcha_image_selector) {
                continue;
              }
              let isUrlMatch = false;
              if (!rule.url_pattern || rule.url_pattern === "*") {
                isUrlMatch = true;
              } else if (rule.url_pattern.startsWith("/") && rule.url_pattern.endsWith("/")) {
                try {
                  const regexPattern = rule.url_pattern.substring(
                    1,
                    rule.url_pattern.length - 1
                  );
                  const regex = new RegExp(regexPattern);
                  isUrlMatch = regex.test(currentUrl);
                } catch (e) {
                  console.error("无效的正则表达式规则：", rule.url_pattern, e);
                }
              } else if (rule.url_pattern.includes("*")) {
                const escapedPattern = rule.url_pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*");
                const regex = new RegExp(`^${escapedPattern}$`);
                isUrlMatch = regex.test(currentUrl);
              } else {
                isUrlMatch = currentUrl.includes(rule.url_pattern);
              }
              if (isUrlMatch) {
                if (rule.captcha_image_selector && !captchaSelectors.includes(rule.captcha_image_selector)) {
                  captchaSelectors.push(rule.captcha_image_selector);
                }
                if (rule.captcha_input_selector && !inputSelectors.includes(rule.captcha_input_selector)) {
                  inputSelectors.push(rule.captcha_input_selector);
                }
              }
            }
          }
          try {
            let elements = [];
            captchaSelectors.forEach((selector) => {
              if (!selector || !selector.trim()) return;
              try {
                const captchaImgs = document.querySelectorAll(selector);
                captchaImgs.forEach((captchaElement) => {
                  if (captchaElement.tagName !== "IMG" && captchaElement.tagName !== "CANVAS") {
                    return;
                  }
                  if (captchaElement.tagName === "IMG" && !captchaElement.src) {
                    return;
                  }
                  if (captchaElement.nextElementSibling && captchaElement.nextElementSibling.classList.contains(
                    "captcha-recognition-icon"
                  )) {
                    return;
                  }
                  let inputField = this.findInputFieldForCaptcha(
                    captchaElement,
                    inputSelectors
                  );
                  this.addRecognitionIcon(captchaElement, inputField);
                  elements.push({
                    captchaImg: captchaElement,
                    inputField
                  });
                });
              } catch (error) {
                console.error(`选择器 '${selector}' 执行出错:`, error);
              }
            });
            if (elements.length > 0) {
              this.showToast(
                `检测到 ${elements.length} 个验证码，点击识别图标开始识别`,
                "info"
              );
              if (this.settings.autoRecognize) {
                elements.forEach(({ captchaImg, inputField }) => {
                  let icon = captchaImg.nextElementSibling;
                  if (icon && icon.classList.contains("captcha-recognition-icon")) {
                    const base64Result = this.imageToBase64(captchaImg);
                    if (base64Result.success) {
                      this.processCaptcha(captchaImg, inputField, icon, base64Result);
                    }
                  }
                });
              }
            }
          } catch (error) {
            console.error("检测验证码时出错：", error);
          }
        }, 500);
      },
      /**
       * 计算两个元素之间的距离
       */
      getDistance(el1, el2) {
        const rect1 = el1.getBoundingClientRect();
        const rect2 = el2.getBoundingClientRect();
        const x1 = rect1.left + rect1.width / 2;
        const y1 = rect1.top + rect1.height / 2;
        const x2 = rect2.left + rect2.width / 2;
        const y2 = rect2.top + rect2.height / 2;
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
      },
      /**
       * 在验证码图片旁添加识别图标
       */
      addIconsToCaptchas() {
        if (this.isCurrentDomainDisabled()) {
          return;
        }
        try {
          const elements = this.findCaptchaElements();
          elements.forEach(({ captchaImg, inputField }) => {
            const existingIcon = captchaImg.nextElementSibling;
            if (existingIcon && existingIcon.classList.contains("captcha-recognition-icon")) {
              return;
            }
            const icon = document.createElement("div");
            icon.classList.add("captcha-recognition-icon");
            icon.title = "点击识别验证码";
            if (captchaImg.nextSibling) {
              captchaImg.parentNode.insertBefore(icon, captchaImg.nextSibling);
            } else {
              captchaImg.parentNode.appendChild(icon);
            }
            icon.addEventListener("click", async (event) => {
              event.preventDefault();
              event.stopPropagation();
              this.processCaptcha(captchaImg, inputField, icon);
            });
          });
        } catch (error) {
          console.error("添加验证码识别图标时出错：", error);
        }
      },
      /**
       * 处理验证码识别
       * @param {HTMLImageElement} captchaImg - 验证码图片元素
       * @param {HTMLInputElement} inputField - 输入框元素
       * @param {HTMLElement} icon - 识别图标元素
       * @param {Object} checkedBase64 - 可选，已经预先检查过的 base64 结果
       */
      async processCaptcha(captchaImg, inputField, icon, checkedBase64) {
        if (this.isCurrentDomainDisabled()) {
          this.showToast("当前网站已设置为不启用验证码识别功能", "info");
          return;
        }
        try {
          icon.classList.add("captcha-recognition-loading");
          let base64Result;
          if (checkedBase64) {
            base64Result = checkedBase64;
          } else {
            if (captchaImg.tagName === "CANVAS") {
              base64Result = this.optimizeCanvasImage(captchaImg);
              if (!base64Result.success) {
                base64Result = this.imageToBase64(captchaImg);
              }
            } else {
              base64Result = this.imageToBase64(captchaImg);
            }
            if (!base64Result.success) {
              console.error("验证码转换失败：", base64Result.message);
              this.showToast(base64Result.message, "error");
              icon.classList.remove("captcha-recognition-loading");
              icon.classList.add("captcha-recognition-error");
              setTimeout(() => {
                icon.classList.remove("captcha-recognition-error");
              }, 2e3);
              return;
            }
          }
          const text = await this.recognizeCaptcha(base64Result.data);
          if (!text) {
            console.error("验证码识别结果为空");
            icon.classList.remove("captcha-recognition-loading");
            icon.classList.add("captcha-recognition-error");
            setTimeout(() => {
              icon.classList.remove("captcha-recognition-error");
            }, 2e3);
            return;
          }
          if (!inputField) {
            inputField = this.findInputFieldForCaptcha(captchaImg);
            if (!inputField) {
              console.warn("仍未找到验证码输入框");
              this.showToast(`验证码已识别：${text}，但未找到输入框`, "warning");
              if (this.settings.copyToClipboard) {
                try {
                  await navigator.clipboard.writeText(text);
                  this.showToast(`已将验证码复制到剪贴板：${text}`, "success");
                } catch (clipboardError) {
                  console.error("使用 Clipboard API 失败，尝试传统方法", clipboardError);
                  const textarea = document.createElement("textarea");
                  textarea.value = text;
                  textarea.style.position = "fixed";
                  textarea.style.opacity = "0";
                  document.documentElement.appendChild(textarea);
                  textarea.select();
                  document.execCommand("copy");
                  document.documentElement.removeChild(textarea);
                  this.showToast(`验证码已识别：${text} (已复制到剪贴板)`, "success");
                }
              }
              icon.classList.remove("captcha-recognition-loading");
              icon.classList.add("captcha-recognition-success");
              setTimeout(() => {
                icon.classList.remove("captcha-recognition-success");
              }, 2e3);
              return;
            }
          }
          inputField.value = text;
          inputField.dispatchEvent(new Event("input", { bubbles: true }));
          inputField.dispatchEvent(new Event("change", { bubbles: true }));
          if (this.settings.copyToClipboard) {
            try {
              await navigator.clipboard.writeText(text);
              this.showToast(`已将验证码复制到剪贴板`, "success");
            } catch (clipboardError) {
              console.error("使用 Clipboard API 失败，尝试传统方法", clipboardError);
              const textarea = document.createElement("textarea");
              textarea.value = text;
              textarea.style.position = "fixed";
              textarea.style.opacity = "0";
              document.documentElement.appendChild(textarea);
              textarea.select();
              document.execCommand("copy");
              document.documentElement.removeChild(textarea);
              this.showToast(`验证码已识别：${text} (已复制到剪贴板)`, "success");
            }
          } else {
            this.showToast(`验证码已识别：${text}`, "success");
          }
          icon.classList.remove("captcha-recognition-loading");
          icon.classList.add("captcha-recognition-success");
          setTimeout(() => {
            icon.classList.remove("captcha-recognition-success");
          }, 2e3);
        } catch (error) {
          console.error("验证码识别处理失败：", error);
          icon.classList.remove("captcha-recognition-loading");
          icon.classList.add("captcha-recognition-error");
          setTimeout(() => {
            icon.classList.remove("captcha-recognition-error");
          }, 2e3);
          this.showToast("处理验证码失败：" + (error.message || "未知错误"), "error");
        }
      },
      /**
       * 监听 DOM 变化，自动为新添加的验证码添加识别图标
       */
      setupMutationObserver() {
        if (this.isCurrentDomainDisabled()) {
          return;
        }
        const observer = new MutationObserver((mutations) => {
          let hasNewCaptcha = false;
          let newCaptchaElements = [];
          const captchaSelector = this.getCombinedSelector(this.config.captchaSelectors);
          mutations.forEach((mutation) => {
            if (mutation.type === "childList" && mutation.addedNodes.length) {
              mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                  const captchas = node.querySelectorAll(captchaSelector);
                  if (captchas.length > 0) {
                    hasNewCaptcha = true;
                    captchas.forEach((captcha) => {
                      newCaptchaElements.push(captcha);
                    });
                  }
                  if (node.matches && node.matches(captchaSelector)) {
                    hasNewCaptcha = true;
                    newCaptchaElements.push(node);
                  }
                }
              });
            }
            if (mutation.type === "attributes" && mutation.attributeName === "src" && mutation.target.matches && mutation.target.matches(captchaSelector)) {
              hasNewCaptcha = true;
              newCaptchaElements.push(mutation.target);
            }
          });
          if (hasNewCaptcha) {
            this.addIconsToCaptchas();
            if (this.settings.autoRecognize) {
              setTimeout(() => {
                const elements = this.findCaptchaElements();
                const newElements = elements.filter(
                  ({ captchaImg }) => newCaptchaElements.includes(captchaImg)
                );
                const unrecognizableImages = [];
                newElements.forEach(({ captchaImg }) => {
                  const base64Result = this.imageToBase64(captchaImg);
                  if (!base64Result.success) {
                    unrecognizableImages.push({
                      img: captchaImg,
                      message: base64Result.message
                    });
                  }
                });
                if (unrecognizableImages.length > 0) {
                  this.showToast(
                    `检测到 ${unrecognizableImages.length} 个新验证码图片无法识别：${unrecognizableImages[0].message}`,
                    "error"
                  );
                }
                const recognizableElements = newElements.filter(({ captchaImg }) => {
                  const base64Result = this.imageToBase64(captchaImg);
                  return base64Result.success;
                });
                if (recognizableElements.length > 0) {
                  recognizableElements.forEach(({ captchaImg, inputField }) => {
                    let icon;
                    const existingIcon = captchaImg.nextElementSibling;
                    if (existingIcon && existingIcon.classList.contains("captcha-recognition-icon")) {
                      icon = existingIcon;
                    } else {
                      icon = document.createElement("div");
                      icon.classList.add("captcha-recognition-icon");
                      if (captchaImg.nextSibling) {
                        captchaImg.parentNode.insertBefore(icon, captchaImg.nextSibling);
                      } else {
                        captchaImg.parentNode.appendChild(icon);
                      }
                    }
                    const base64Result = this.imageToBase64(captchaImg);
                    this.processCaptcha(captchaImg, inputField, icon, base64Result);
                  });
                } else if (newElements.length > 0) {
                  this.showToast(
                    `检测到 ${newElements.length} 个新验证码，但均无法自动识别`,
                    "error"
                  );
                }
              }, 500);
            }
          }
        });
        observer.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ["src"]
          // 只监听 src 属性变化
        });
      },
      /**
       * 注册油猴菜单
       */
      registerMenuCommands() {
        if (typeof GM_registerMenuCommand !== "undefined") {
          GM_registerMenuCommand("验证码识别设置", () => {
            this.openSettings();
          });
        }
      },
      /**
       * 初始化插件
       */
      init() {
        this.registerMenuCommands();
        this.loadSettings();
        this.checkAndFetchCloudConfig();
        if (this.isCurrentDomainDisabled()) {
          return;
        }
        const initPlugin = () => {
          try {
            this.addIconsToCaptchas();
            this.setupMutationObserver();
            this.detectCaptchas();
            const elements = this.findCaptchaElements();
            if (elements.length > 0) {
              const unrecognizableImages = [];
              elements.forEach(({ captchaImg }) => {
                const base64Result = this.imageToBase64(captchaImg);
                if (!base64Result.success) {
                  unrecognizableImages.push({
                    img: captchaImg,
                    message: base64Result.message
                  });
                }
              });
              if (unrecognizableImages.length > 0) {
                console.warn(
                  `${unrecognizableImages.length} 个验证码图片无法识别：${unrecognizableImages[0].message}`
                );
                this.showToast(
                  `检测到 ${unrecognizableImages.length} 个验证码图片无法识别：${unrecognizableImages[0].message}`,
                  "error"
                );
              }
              if (this.settings.autoRecognize) {
                const recognizableElements = elements.filter(({ captchaImg }) => {
                  const base64Result = this.imageToBase64(captchaImg);
                  return base64Result.success;
                });
                if (recognizableElements.length > 0) {
                  this.showToast(
                    `检测到 ${recognizableElements.length} 个可识别的验证码，正在自动识别...`,
                    "info"
                  );
                  recognizableElements.forEach(({ captchaImg, inputField }) => {
                    let icon;
                    const existingIcon = captchaImg.nextElementSibling;
                    if (existingIcon && existingIcon.classList.contains("captcha-recognition-icon")) {
                      icon = existingIcon;
                    } else {
                      icon = document.createElement("div");
                      icon.classList.add("captcha-recognition-icon");
                      if (captchaImg.nextSibling) {
                        captchaImg.parentNode.insertBefore(icon, captchaImg.nextSibling);
                      } else {
                        captchaImg.parentNode.appendChild(icon);
                      }
                    }
                    const base64Result = this.imageToBase64(captchaImg);
                    this.processCaptcha(captchaImg, inputField, icon, base64Result);
                  });
                } else if (elements.length > 0) {
                  console.warn(`检测到 ${elements.length} 个验证码，但均无法自动识别`);
                  this.showToast(
                    `检测到 ${elements.length} 个验证码，但均无法自动识别`,
                    "error"
                  );
                }
              } else {
                this.showToast(
                  `检测到 ${elements.length} 个验证码，点击识别图标开始识别`,
                  "info"
                );
              }
            }
          } catch (error) {
            console.error("初始化验证码识别功能失败：", error);
            this.showToast(
              `初始化验证码识别功能失败：${error.message || "未知错误"}`,
              "error"
            );
          }
        };
        if (document.readyState === "complete") {
          setTimeout(initPlugin, 1e3);
        } else {
          window.addEventListener("load", () => {
            setTimeout(initPlugin, 1e3);
          });
        }
      },
      /**
       * 通用请求函数，自动根据环境使用 GM_xmlhttpRequest 或 axios
       * @param {Object} config - 请求配置
       * @returns {Promise} - 请求结果
       */
      request(config) {
        if (typeof GM_xmlhttpRequest !== "undefined") {
          return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
              method: config.method || "GET",
              url: config.url,
              data: config.data ? typeof config.data === "string" ? config.data : JSON.stringify(config.data) : void 0,
              headers: config.headers || {},
              responseType: config.responseType || "json",
              onload: (response) => {
                if (response.status >= 200 && response.status < 300) {
                  let responseData;
                  try {
                    responseData = config.responseType === "json" && typeof response.response === "string" ? JSON.parse(response.response || response.responseText) : response.response || response.responseText;
                  } catch (e) {
                    responseData = response.response || response.responseText;
                  }
                  resolve({ data: responseData });
                } else {
                  reject(new Error(`请求失败，状态码: ${response.status}`));
                }
              },
              onerror: (error) => {
                reject(error);
              }
            });
          });
        } else {
          const safeHeaders = { ...config.headers };
          const unsafeHeaders = ["Host", "Origin", "Referer", "Cookie"];
          unsafeHeaders.forEach((header) => {
            if (safeHeaders[header]) {
              delete safeHeaders[header];
            }
          });
          return axios({
            method: config.method || "GET",
            url: config.url,
            data: config.data,
            params: config.params,
            headers: safeHeaders,
            responseType: config.responseType
          });
        }
      },
      /**
       * 显示 Toast 提示
       * @param {string} message - 提示信息
       * @param {string} type - 提示类型 (success, error, info)
       */
      showToast(message, type2 = "info") {
        if (this.settings.showNotification === false) {
          return;
        }
        let toastContainer = document.getElementById("captcha-toast-container");
        if (!toastContainer) {
          toastContainer = document.createElement("div");
          toastContainer.id = "captcha-toast-container";
          document.documentElement.appendChild(toastContainer);
        }
        const toast = document.createElement("div");
        toast.className = `captcha-toast captcha-toast-${type2}`;
        toast.textContent = message;
        if (toastContainer.firstChild) {
          toastContainer.insertBefore(toast, toastContainer.firstChild);
        } else {
          toastContainer.appendChild(toast);
        }
        setTimeout(() => {
          toast.classList.add("captcha-toast-show");
        }, 10);
        setTimeout(() => {
          toast.classList.remove("captcha-toast-show");
          toast.classList.add("captcha-toast-hide");
          setTimeout(() => {
            if (toast.parentNode) {
              toast.parentNode.removeChild(toast);
            }
          }, 300);
        }, 3e3);
      },
      /**
       * 测试 API 连通性
       * @param {string} apiType - API 类型，'openai'或'gemini'
       */
      async testApiConnection(apiType) {
        try {
          if (!this.isApiConfigured(apiType)) {
            this.apiTestStatus[apiType] = "error";
            setTimeout(() => {
              this.apiTestStatus[apiType] = "";
            }, 3e3);
            return;
          }
          this.apiTestStatus[apiType] = "loading";
          const testBase64Image = "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";
          if (apiType === "openai") {
            const apiUrl = this.formatOpenAIUrl(this.settings.openaiApiUrl);
            const model = this.settings.openaiModel || "gpt-4.1-mini";
            const response = await this.request({
              method: "POST",
              url: apiUrl,
              data: {
                model,
                messages: [
                  {
                    role: "user",
                    content: [
                      {
                        type: "text",
                        text: "这是一个验证码图片，请识别其中的字符"
                      },
                      {
                        type: "image_url",
                        image_url: {
                          url: `data:image/png;base64,${testBase64Image}`
                        }
                      }
                    ]
                  }
                ]
              },
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.settings.openaiKey}`
              }
            });
            if (response && response.data) {
              this.apiTestStatus[apiType] = "success";
            }
          } else if (apiType === "gemini") {
            const model = this.settings.geminiModel || "gemini-2.5-flash-lite";
            const baseApiUrl = this.settings.geminiApiUrl || "https://generativelanguage.googleapis.com/v1beta/models";
            const apiUrl = `${baseApiUrl}/${model}:generateContent`;
            const response = await this.request({
              method: "POST",
              url: `${apiUrl}?key=${this.settings.geminiKey}`,
              data: {
                contents: [
                  {
                    parts: [
                      {
                        text: "这是一个验证码图片，请识别其中的字符"
                      },
                      {
                        inline_data: {
                          mime_type: "image/png",
                          data: testBase64Image
                        }
                      }
                    ]
                  }
                ]
              },
              headers: {
                "Content-Type": "application/json"
              }
            });
            if (response && response.data) {
              this.apiTestStatus[apiType] = "success";
            }
          } else if (apiType === "qwen") {
            const apiUrl = this.settings.qwenApiUrl || "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";
            const model = this.settings.qwenModel || "qwen-vl-max-2025-04-02";
            const response = await this.request({
              method: "POST",
              url: apiUrl,
              data: {
                model,
                messages: [
                  {
                    role: "user",
                    content: [
                      {
                        type: "text",
                        text: "这是一个验证码图片，请识别其中的字符"
                      },
                      {
                        type: "image_url",
                        image_url: {
                          url: `data:image/png;base64,${testBase64Image}`
                        }
                      }
                    ]
                  }
                ]
              },
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.settings.qwenKey}`
              }
            });
            if (response && response.data) {
              this.apiTestStatus[apiType] = "success";
            }
          }
          setTimeout(() => {
            this.apiTestStatus[apiType] = "";
          }, 3e3);
        } catch (error) {
          console.error("API 连接测试失败：", error);
          this.apiTestStatus[apiType] = "error";
          setTimeout(() => {
            this.apiTestStatus[apiType] = "";
          }, 3e3);
        }
      },
      /**
       * 检查域名是否在禁用列表中
       * @param {string} domain - 要检查的域名
       * @returns {boolean} - 如果域名在禁用列表中返回 true，否则返回 false
       */
      isDisabledDomain(domain) {
        if (!this.settings.disabledDomains) {
          return false;
        }
        const disabledDomainsList = this.settings.disabledDomains.split("\n").map((line) => line.trim()).filter((line) => line !== "");
        for (const disabledDomain of disabledDomainsList) {
          try {
            if (disabledDomain.startsWith("/") && disabledDomain.endsWith("/")) {
              const regexPattern = disabledDomain.substring(1, disabledDomain.length - 1);
              const regex = new RegExp(regexPattern);
              if (regex.test(domain)) {
                return true;
              }
            } else if (disabledDomain.includes("*")) {
              const escapedPattern = disabledDomain.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*");
              const regex = new RegExp(`^${escapedPattern}$`);
              if (regex.test(domain)) {
                return true;
              }
            } else if (domain.includes(disabledDomain)) {
              return true;
            }
          } catch (error) {
            console.error(`检查禁用域名时出错 (${disabledDomain}):`, error);
          }
        }
        return false;
      },
      /**
       * 添加自定义选择器
       * @param {string} type - 选择器类型，'captcha'或'input'
       */
      addSelector(type2) {
        if (type2 === "captcha") {
          this.settings.customCaptchaSelectors.push("");
        } else if (type2 === "input") {
          this.settings.customInputSelectors.push("");
        }
      },
      /**
       * 删除自定义选择器
       * @param {string} type - 选择器类型，'captcha'或'input'
       * @param {number} index - 要删除的选择器索引
       */
      removeSelector(type2, index) {
        if (type2 === "captcha") {
          this.settings.customCaptchaSelectors.splice(index, 1);
        } else if (type2 === "input") {
          this.settings.customInputSelectors.splice(index, 1);
        }
      },
      /**
       * 检查当前网站是否在禁用域名列表中
       * @returns {boolean} - 如果当前网站在禁用列表中，则返回 true
       */
      isCurrentDomainDisabled() {
        if (!this.settings.disabledDomains) {
          return false;
        }
        const currentDomain = window.location.hostname;
        const disabledDomainsList = this.settings.disabledDomains.split("\n").map((line) => line.trim()).filter((line) => line !== "");
        for (const domain of disabledDomainsList) {
          if (domain.startsWith("/") && domain.endsWith("/")) {
            try {
              const regexPattern = domain.substring(1, domain.length - 1);
              const regex = new RegExp(regexPattern);
              if (regex.test(currentDomain)) {
                return true;
              }
            } catch (e) {
              console.error("无效的正则表达式：", domain, e);
            }
            continue;
          }
          if (domain.includes("*")) {
            const regexPattern = domain.replace(/\./g, "\\.").replace(/\*/g, ".*");
            try {
              const regex = new RegExp(`^${regexPattern}$`);
              if (regex.test(currentDomain)) {
                return true;
              }
            } catch (e) {
              console.error("无效的通配符模式：", domain, e);
            }
            continue;
          }
          if (domain === currentDomain) {
            return true;
          }
        }
        return false;
      },
      /**
       * 为验证码元素 (图片或 canvas) 添加识别图标
       * @param {HTMLImageElement|HTMLCanvasElement} captchaElement - 验证码元素 (图片或 canvas)
       * @param {HTMLInputElement} inputField - 输入框元素
       */
      addRecognitionIcon(captchaElement, inputField) {
        const existingIcon = captchaElement.nextElementSibling;
        if (existingIcon && existingIcon.classList.contains("captcha-recognition-icon")) {
          return;
        }
        const icon = document.createElement("div");
        icon.classList.add("captcha-recognition-icon");
        icon.title = "点击识别验证码";
        if (captchaElement.nextSibling) {
          captchaElement.parentNode.insertBefore(icon, captchaElement.nextSibling);
        } else {
          captchaElement.parentNode.appendChild(icon);
        }
        icon.addEventListener("click", async () => {
          this.processCaptcha(captchaElement, inputField, icon);
        });
      },
      /**
       * 查找页面上的验证码图片和相关输入框
       * @returns {Array} - 包含验证码图片和相关输入框的对象数组
       */
      findCaptchaElements() {
        let captchaSelectors = [...this.config.captchaSelectors];
        if (Array.isArray(this.settings.customCaptchaSelectors)) {
          captchaSelectors = captchaSelectors.concat(
            this.settings.customCaptchaSelectors.filter((s) => s && s.trim())
          );
        }
        let inputSelectors = [...this.config.inputSelectors];
        if (Array.isArray(this.settings.customInputSelectors)) {
          inputSelectors = inputSelectors.concat(
            this.settings.customInputSelectors.filter((s) => s && s.trim())
          );
        }
        const currentUrl = window.location.href;
        if (Array.isArray(this.rules) && this.rules.length > 0) {
          for (const rule of this.rules) {
            if (!rule.captcha_image_selector) {
              continue;
            }
            let isUrlMatch = false;
            if (!rule.url_pattern || rule.url_pattern === "*") {
              isUrlMatch = true;
            } else if (rule.url_pattern.startsWith("/") && rule.url_pattern.endsWith("/")) {
              try {
                const regexPattern = rule.url_pattern.substring(
                  1,
                  rule.url_pattern.length - 1
                );
                const regex = new RegExp(regexPattern);
                isUrlMatch = regex.test(currentUrl);
              } catch (e) {
                console.error("无效的正则表达式规则：", rule.url_pattern, e);
              }
            } else if (rule.url_pattern.includes("*")) {
              const escapedPattern = rule.url_pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*");
              const regex = new RegExp(`^${escapedPattern}$`);
              isUrlMatch = regex.test(currentUrl);
            } else {
              isUrlMatch = currentUrl.includes(rule.url_pattern);
            }
            if (isUrlMatch) {
              if (rule.captcha_image_selector && !captchaSelectors.includes(rule.captcha_image_selector)) {
                captchaSelectors.push(rule.captcha_image_selector);
              }
              if (rule.captcha_input_selector && !inputSelectors.includes(rule.captcha_input_selector)) {
                inputSelectors.push(rule.captcha_input_selector);
              }
            }
          }
        }
        const elements = [];
        captchaSelectors.forEach((selector) => {
          if (!selector || !selector.trim()) return;
          try {
            const captchaImgs = document.querySelectorAll(selector);
            captchaImgs.forEach((captchaElement) => {
              if (captchaElement.tagName !== "IMG" && captchaElement.tagName !== "CANVAS") {
                return;
              }
              if (captchaElement.tagName === "IMG" && !captchaElement.src) {
                return;
              }
              let inputField = this.findInputFieldForCaptcha(
                captchaElement,
                inputSelectors
              );
              if (inputField) {
              } else {
              }
              elements.push({
                captchaImg: captchaElement,
                inputField
              });
            });
          } catch (error) {
            console.error(`选择器 '${selector}' 执行出错:`, error);
          }
        });
        return elements;
      },
      /**
       * 为验证码图片查找对应的输入框
       * @param {HTMLImageElement} captchaImg - 验证码图片元素
       * @param {Array} [customSelectors] - 自定义输入框选择器列表，可选
       * @returns {HTMLInputElement|null} - 找到的输入框元素，或 null
       */
      findInputFieldForCaptcha(captchaImg, customSelectors) {
        const baseFilter = ':not([type="hidden"])';
        let inputSelectors = customSelectors || [...this.config.inputSelectors];
        inputSelectors = inputSelectors.map((selector) => {
          if (selector.includes(':not([type="hidden"])')) {
            return selector;
          }
          return `${selector}${baseFilter}`;
        });
        if (!customSelectors && Array.isArray(this.settings.customInputSelectors)) {
          const filteredCustomSelectors = this.settings.customInputSelectors.map(
            (selector) => {
              if (!selector) return "";
              if (selector.includes(':not([type="hidden"])')) {
                return selector;
              }
              return `${selector}${baseFilter}`;
            }
          );
          inputSelectors = inputSelectors.concat(filteredCustomSelectors.filter((s) => s));
        }
        const currentUrl = window.location.href;
        if (Array.isArray(this.rules) && this.rules.length > 0) {
          for (const rule of this.rules) {
            if (!rule.captcha_input_selector) {
              continue;
            }
            let isUrlMatch = false;
            if (!rule.url_pattern || rule.url_pattern === "*") {
              isUrlMatch = true;
            } else if (rule.url_pattern.startsWith("/") && rule.url_pattern.endsWith("/")) {
              try {
                const regexPattern = rule.url_pattern.substring(
                  1,
                  rule.url_pattern.length - 1
                );
                const regex = new RegExp(regexPattern);
                isUrlMatch = regex.test(currentUrl);
              } catch (e) {
                console.error("Invalid regex pattern:", rule.url_pattern);
              }
            } else if (rule.url_pattern.includes("*")) {
              const escapedPattern = rule.url_pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*");
              const regex = new RegExp(`^${escapedPattern}$`);
              isUrlMatch = regex.test(currentUrl);
            } else {
              isUrlMatch = currentUrl.includes(rule.url_pattern);
            }
            if (isUrlMatch && rule.captcha_input_selector && !inputSelectors.includes(rule.captcha_input_selector)) {
              inputSelectors.push(rule.captcha_input_selector);
            }
          }
        }
        let inputField = null;
        const parentElement = captchaImg.parentElement;
        if (parentElement) {
          for (const selector of inputSelectors) {
            try {
              const inputs = parentElement.querySelectorAll(selector);
              if (inputs.length > 0) {
                inputField = inputs[0];
                break;
              }
            } catch (e) {
              console.error(`选择器 ${selector} 执行出错:`, e);
            }
          }
        }
        if (!inputField && parentElement) {
          let form = parentElement;
          while (form && form.tagName !== "FORM" && form !== document.body) {
            form = form.parentElement;
          }
          if (form && form.tagName === "FORM") {
            for (const selector of inputSelectors) {
              try {
                const inputs = form.querySelectorAll(selector);
                if (inputs.length > 0) {
                  inputField = inputs[0];
                  break;
                }
              } catch (e) {
                console.error(`选择器 ${selector} 执行出错:`, e);
              }
            }
          }
        }
        if (!inputField) {
          for (const selector of inputSelectors) {
            try {
              const inputs = document.querySelectorAll(selector);
              if (inputs.length > 0) {
                inputField = inputs[0];
                break;
              }
            } catch (e) {
              console.error(`选择器 ${selector} 执行出错:`, e);
            }
          }
        }
        if (!inputField) {
          const inputs = document.querySelectorAll('input:not([type="hidden"])');
          if (inputs.length > 0) {
            for (const input of inputs) {
              const name2 = input.name ? input.name.toLowerCase() : "";
              const id = input.id ? input.id.toLowerCase() : "";
              const placeholder = input.placeholder ? input.placeholder.toLowerCase() : "";
              if (name2.includes("captcha") || name2.includes("verif") || id.includes("captcha") || id.includes("verif") || placeholder.includes("captcha") || placeholder.includes("验证码")) {
                inputField = input;
                break;
              }
            }
            if (!inputField) {
              for (const input of inputs) {
                if (input.type !== "hidden") {
                  inputField = input;
                  break;
                }
              }
            }
          }
        }
        return inputField;
      },
      /**
       * 检查并自动获取云端配置（每天首次使用）
       */
      async checkAndFetchCloudConfig() {
        try {
          if (!this.settings.autoFetchCloudRules) {
            return;
          }
          const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
          let lastConfigUpdate;
          if (typeof GM_getValue !== "undefined") {
            lastConfigUpdate = GM_getValue("lastConfigUpdate");
          } else {
            lastConfigUpdate = localStorage.getItem("lastConfigUpdate");
          }
          if (!lastConfigUpdate || lastConfigUpdate !== today) {
            this.showToast("正在获取最新云端配置...", "info");
            await this.loadRules();
            if (typeof GM_setValue !== "undefined") {
              GM_setValue("lastConfigUpdate", today);
            } else {
              localStorage.setItem("lastConfigUpdate", today);
            }
            this.showToast("云端配置更新完成", "success");
          }
        } catch (error) {
          console.error("自动获取云端配置失败：", error);
        }
      },
      /**
       * 优化 Canvas 验证码图像
       * @param {HTMLCanvasElement} canvasElement - canvas 元素
       * @returns {Object} - 返回包含成功状态和数据的对象
       */
      optimizeCanvasImage(canvasElement) {
        try {
          const ctx = canvasElement.getContext("2d");
          if (!ctx) {
            return {
              success: false,
              message: "无法获取 Canvas 上下文"
            };
          }
          const imageData = ctx.getImageData(
            0,
            0,
            canvasElement.width,
            canvasElement.height
          );
          const data = imageData.data;
          const optimizedCanvas = document.createElement("canvas");
          optimizedCanvas.width = canvasElement.width;
          optimizedCanvas.height = canvasElement.height;
          const optimizedCtx = optimizedCanvas.getContext("2d");
          optimizedCtx.putImageData(imageData, 0, 0);
          const base64Data = optimizedCanvas.toDataURL("image/png").split(",")[1];
          if (!base64Data || base64Data.length < 100) {
            return {
              success: false,
              message: "优化Canvas数据失败或内容为空"
            };
          }
          return {
            success: true,
            data: base64Data
          };
        } catch (error) {
          console.error("优化Canvas图像失败:", error);
          return {
            success: false,
            message: "优化Canvas图像失败: " + (error.message || "未知错误")
          };
        }
      }
    },
    mounted() {
      try {
        this.loadSettings();
        this.showSettings = false;
        if (typeof GM_registerMenuCommand !== "undefined") {
          GM_registerMenuCommand("验证码识别设置", () => {
            this.openSettings();
          });
        } else {
        }
        this.init();
      } catch (error) {
        console.error("验证码识别插件挂载失败：", error);
      }
    },
    created() {
      try {
        if (window.location.host == "nportal.ntut.edu.tw") {
          const observer = new MutationObserver(function(mutations) {
            const authcodeElement = document.querySelector(".authcode.co");
            if (authcodeElement) {
              const captchaIcon = document.querySelector(".captcha-recognition-icon");
              if (captchaIcon) {
                captchaIcon.parentNode.removeChild(captchaIcon);
                authcodeElement.appendChild(captchaIcon);
                observer.disconnect();
              }
            }
          });
          observer.observe(document.body, { childList: true, subtree: true });
        }
        if (window.location.host == "www.luogu.com.cn") {
          const styleluogu = document.createElement("style");
          styleluogu.textContent = `
          .l-form-layout .img .captcha-recognition-icon {
            display: none !important;
          }
        `;
          document.head.appendChild(styleluogu);
          const observer = new MutationObserver(function(mutations) {
            const authcodeElement = document.querySelector(".l-form-layout .img");
            if (authcodeElement) {
              const captchaIcon = document.querySelector(".captcha-recognition-icon");
              if (captchaIcon) {
                captchaIcon.parentNode.removeChild(captchaIcon);
                authcodeElement.parentNode.insertBefore(
                  captchaIcon,
                  authcodeElement.nextSibling
                );
                observer.disconnect();
              }
            }
          });
          observer.observe(document.body, { childList: true, subtree: true });
        }
      } catch (error) {
        console.error("验证码识别插件创建阶段出错：", error);
      }
    }
  };
  const _hoisted_1 = { class: "captcha-recognition-container" };
  const _hoisted_2 = /* @__PURE__ */ vue.createElementVNode("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    width: "24",
    height: "24"
  }, [
    /* @__PURE__ */ vue.createElementVNode("path", {
      fill: "currentColor",
      d: "M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"
    })
  ], -1);
  const _hoisted_3 = [
    _hoisted_2
  ];
  const _hoisted_4 = { class: "captcha-settings-content" };
  const _hoisted_5 = { class: "settings-nav" };
  const _hoisted_6 = { class: "settings-content" };
  const _hoisted_7 = {
    key: 0,
    class: "settings-content-tab"
  };
  const _hoisted_8 = { class: "settings-card" };
  const _hoisted_9 = { class: "settings-card-title" };
  const _hoisted_10 = /* @__PURE__ */ vue.createElementVNode("span", null, "AI 服务商设置", -1);
  const _hoisted_11 = { class: "api-type" };
  const _hoisted_12 = { class: "captcha-settings-item" };
  const _hoisted_13 = /* @__PURE__ */ vue.createElementVNode("label", null, "API 类型：", -1);
  const _hoisted_14 = /* @__PURE__ */ vue.createElementVNode("option", { value: "openai" }, "OpenAI", -1);
  const _hoisted_15 = /* @__PURE__ */ vue.createElementVNode("option", { value: "gemini" }, "Google Gemini", -1);
  const _hoisted_16 = /* @__PURE__ */ vue.createElementVNode("option", { value: "qwen" }, "阿里云通义千问", -1);
  const _hoisted_17 = [
    _hoisted_14,
    _hoisted_15,
    _hoisted_16
  ];
  const _hoisted_18 = { key: 0 };
  const _hoisted_19 = { class: "captcha-settings-item" };
  const _hoisted_20 = /* @__PURE__ */ vue.createElementVNode("label", null, "OpenAI API Key:", -1);
  const _hoisted_21 = { class: "input-with-button" };
  const _hoisted_22 = { key: 0 };
  const _hoisted_23 = { key: 1 };
  const _hoisted_24 = { key: 2 };
  const _hoisted_25 = { key: 3 };
  const _hoisted_26 = { class: "captcha-settings-item" };
  const _hoisted_27 = /* @__PURE__ */ vue.createElementVNode("label", null, "自定义 API 地址 (可选):", -1);
  const _hoisted_28 = /* @__PURE__ */ vue.createElementVNode("small", null, "留空使用默认地址", -1);
  const _hoisted_29 = { class: "captcha-settings-item" };
  const _hoisted_30 = /* @__PURE__ */ vue.createElementVNode("label", null, "模型 (可选):", -1);
  const _hoisted_31 = /* @__PURE__ */ vue.createElementVNode("small", null, "留空使用默认模型", -1);
  const _hoisted_32 = { class: "captcha-settings-item" };
  const _hoisted_33 = /* @__PURE__ */ vue.createElementVNode("label", null, "自定义提示词 (可选):", -1);
  const _hoisted_34 = { class: "textarea-with-button" };
  const _hoisted_35 = /* @__PURE__ */ vue.createElementVNode("small", null, "留空使用默认提示词", -1);
  const _hoisted_36 = { key: 1 };
  const _hoisted_37 = { class: "captcha-settings-item" };
  const _hoisted_38 = /* @__PURE__ */ vue.createElementVNode("label", null, "Google Gemini API Key:", -1);
  const _hoisted_39 = { class: "input-with-button" };
  const _hoisted_40 = { key: 0 };
  const _hoisted_41 = { key: 1 };
  const _hoisted_42 = { key: 2 };
  const _hoisted_43 = { key: 3 };
  const _hoisted_44 = { class: "captcha-settings-item" };
  const _hoisted_45 = /* @__PURE__ */ vue.createElementVNode("label", null, "自定义 API 地址 (可选):", -1);
  const _hoisted_46 = /* @__PURE__ */ vue.createElementVNode("small", null, "留空使用默认地址", -1);
  const _hoisted_47 = { class: "captcha-settings-item" };
  const _hoisted_48 = /* @__PURE__ */ vue.createElementVNode("label", null, "模型 (可选):", -1);
  const _hoisted_49 = /* @__PURE__ */ vue.createElementVNode("small", null, "留空使用默认模型", -1);
  const _hoisted_50 = { class: "captcha-settings-item" };
  const _hoisted_51 = /* @__PURE__ */ vue.createElementVNode("label", null, "自定义提示词 (可选):", -1);
  const _hoisted_52 = { class: "textarea-with-button" };
  const _hoisted_53 = /* @__PURE__ */ vue.createElementVNode("small", null, "留空使用默认提示词", -1);
  const _hoisted_54 = { key: 2 };
  const _hoisted_55 = { class: "captcha-settings-item" };
  const _hoisted_56 = /* @__PURE__ */ vue.createElementVNode("label", null, "阿里云通义千问 API Key:", -1);
  const _hoisted_57 = { class: "input-with-button" };
  const _hoisted_58 = { key: 0 };
  const _hoisted_59 = { key: 1 };
  const _hoisted_60 = { key: 2 };
  const _hoisted_61 = { key: 3 };
  const _hoisted_62 = { class: "captcha-settings-item" };
  const _hoisted_63 = /* @__PURE__ */ vue.createElementVNode("label", null, "自定义 API 地址 (可选):", -1);
  const _hoisted_64 = /* @__PURE__ */ vue.createElementVNode("small", null, "留空使用默认地址", -1);
  const _hoisted_65 = { class: "captcha-settings-item" };
  const _hoisted_66 = /* @__PURE__ */ vue.createElementVNode("label", null, "模型 (可选):", -1);
  const _hoisted_67 = /* @__PURE__ */ vue.createElementVNode("small", null, "留空使用默认模型", -1);
  const _hoisted_68 = { class: "captcha-settings-item" };
  const _hoisted_69 = /* @__PURE__ */ vue.createElementVNode("label", null, "自定义提示词 (可选):", -1);
  const _hoisted_70 = { class: "textarea-with-button" };
  const _hoisted_71 = /* @__PURE__ */ vue.createElementVNode("small", null, "留空使用默认提示词", -1);
  const _hoisted_72 = {
    key: 1,
    class: "settings-content-tab"
  };
  const _hoisted_73 = { class: "settings-card" };
  const _hoisted_74 = /* @__PURE__ */ vue.createElementVNode("div", { class: "settings-card-title" }, [
    /* @__PURE__ */ vue.createElementVNode("span", null, "功能设置")
  ], -1);
  const _hoisted_75 = { class: "captcha-settings-item" };
  const _hoisted_76 = { style: { "display": "flex", "align-items": "center" } };
  const _hoisted_77 = /* @__PURE__ */ vue.createElementVNode("label", {
    for: "autoRecognize",
    style: { "margin-bottom": "0" }
  }, "验证码图片变化时自动识别", -1);
  const _hoisted_78 = { class: "captcha-settings-item" };
  const _hoisted_79 = { style: { "display": "flex", "align-items": "center" } };
  const _hoisted_80 = /* @__PURE__ */ vue.createElementVNode("label", {
    for: "copyToClipboard",
    style: { "margin-bottom": "0" }
  }, "自动复制到剪贴板", -1);
  const _hoisted_81 = { class: "captcha-settings-item" };
  const _hoisted_82 = { style: { "display": "flex", "align-items": "center" } };
  const _hoisted_83 = /* @__PURE__ */ vue.createElementVNode("label", {
    for: "showNotification",
    style: { "margin-bottom": "0" }
  }, "显示右上角通知提示", -1);
  const _hoisted_84 = { class: "captcha-settings-item" };
  const _hoisted_85 = { style: { "display": "flex", "align-items": "center" } };
  const _hoisted_86 = /* @__PURE__ */ vue.createElementVNode("label", {
    for: "autoFetchCloudRules",
    style: { "margin-bottom": "0" }
  }, "每日首次运行时自动获取云端规则", -1);
  const _hoisted_87 = {
    key: 2,
    class: "settings-content-tab"
  };
  const _hoisted_88 = { class: "settings-card" };
  const _hoisted_89 = /* @__PURE__ */ vue.createElementVNode("div", { class: "settings-card-title" }, [
    /* @__PURE__ */ vue.createElementVNode("span", null, "禁用域名列表")
  ], -1);
  const _hoisted_90 = { class: "captcha-settings-item" };
  const _hoisted_91 = /* @__PURE__ */ vue.createElementVNode("small", null, [
    /* @__PURE__ */ vue.createTextVNode(" 在这些域名下将不启用验证码识别功能 "),
    /* @__PURE__ */ vue.createElementVNode("br"),
    /* @__PURE__ */ vue.createTextVNode(" 多个配置请使用换行显示 ")
  ], -1);
  const _hoisted_92 = {
    key: 3,
    class: "settings-content-tab"
  };
  const _hoisted_93 = { class: "settings-card" };
  const _hoisted_94 = /* @__PURE__ */ vue.createElementVNode("div", { class: "settings-card-title" }, [
    /* @__PURE__ */ vue.createElementVNode("span", null, [
      /* @__PURE__ */ vue.createTextVNode("高级设置 "),
      /* @__PURE__ */ vue.createElementVNode("a", {
        href: "https://github.com/anghunk/UserScript/tree/main/CAPTCHA-automatic-recognition/docs/advanced-settings.md",
        target: "_blank",
        class: "tutorial-link"
      }, "教程")
    ])
  ], -1);
  const _hoisted_95 = /* @__PURE__ */ vue.createElementVNode("div", { class: "advanced-settings-warning" }, " ⚠️ 警告：如果您不了解 CSS 选择器，请不要修改这些设置，可能导致识别功能失效 ", -1);
  const _hoisted_96 = { class: "captcha-settings-item" };
  const _hoisted_97 = /* @__PURE__ */ vue.createElementVNode("label", null, "自定义验证码图片选择器：", -1);
  const _hoisted_98 = { class: "custom-selectors" };
  const _hoisted_99 = ["onUpdate:modelValue"];
  const _hoisted_100 = ["onClick"];
  const _hoisted_101 = { class: "captcha-settings-item" };
  const _hoisted_102 = /* @__PURE__ */ vue.createElementVNode("label", null, "自定义输入框选择器：", -1);
  const _hoisted_103 = { class: "custom-selectors" };
  const _hoisted_104 = ["onUpdate:modelValue"];
  const _hoisted_105 = ["onClick"];
  const _hoisted_106 = { class: "captcha-settings-item" };
  const _hoisted_107 = /* @__PURE__ */ vue.createElementVNode("label", null, "验证码规则管理：", -1);
  const _hoisted_108 = { class: "rules-management" };
  const _hoisted_109 = { class: "rules-url-input" };
  const _hoisted_110 = /* @__PURE__ */ vue.createElementVNode("small", null, "规则文件 URL，留空则使用默认 URL：https://raw.githubusercontent.com/anghunk/UserScript/main/CAPTCHA-automatic-recognition/rules.json", -1);
  const _hoisted_111 = { key: 0 };
  const _hoisted_112 = { key: 1 };
  const _hoisted_113 = { key: 2 };
  const _hoisted_114 = { key: 3 };
  const _hoisted_115 = /* @__PURE__ */ vue.createElementVNode("small", null, "从远程加载最新的验证码识别规则", -1);
  const _hoisted_116 = { class: "captcha-settings-buttons" };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
      $data.process.env.NODE_ENV === "development" && !$data.showSettings ? (vue.openBlock(), vue.createElementBlock("div", {
        key: 0,
        class: "dev-settings-button",
        onClick: _cache[0] || (_cache[0] = (...args) => $options.openSettings && $options.openSettings(...args))
      }, _hoisted_3)) : vue.createCommentVNode("", true),
      $data.showSettings ? (vue.openBlock(), vue.createElementBlock("div", {
        key: 1,
        class: "captcha-settings-overlay",
        onClick: _cache[1] || (_cache[1] = (...args) => $options.closeSettings && $options.closeSettings(...args))
      })) : vue.createCommentVNode("", true),
      $data.showSettings ? (vue.openBlock(), vue.createElementBlock("div", {
        key: 2,
        class: vue.normalizeClass(["captcha-settings-modal", { show: $data.showSettings }]),
        onClick: _cache[36] || (_cache[36] = vue.withModifiers(() => {
        }, ["stop"]))
      }, [
        vue.createElementVNode("div", _hoisted_4, [
          vue.createElementVNode("h3", null, [
            vue.createTextVNode(" 验证码识别设置 "),
            vue.createElementVNode("span", null, vue.toDisplayString($data.packageJson.version), 1)
          ]),
          vue.createElementVNode("div", _hoisted_5, [
            vue.createElementVNode("div", {
              class: vue.normalizeClass(["settings-nav-item", { active: $data.activeSettingTab === "ai" }]),
              onClick: _cache[2] || (_cache[2] = ($event) => $data.activeSettingTab = "ai")
            }, " AI 服务商 ", 2),
            vue.createElementVNode("div", {
              class: vue.normalizeClass(["settings-nav-item", { active: $data.activeSettingTab === "function" }]),
              onClick: _cache[3] || (_cache[3] = ($event) => $data.activeSettingTab = "function")
            }, " 功能设置 ", 2),
            vue.createElementVNode("div", {
              class: vue.normalizeClass(["settings-nav-item", { active: $data.activeSettingTab === "domain" }]),
              onClick: _cache[4] || (_cache[4] = ($event) => $data.activeSettingTab = "domain")
            }, " 禁用域名 ", 2),
            vue.createElementVNode("div", {
              class: vue.normalizeClass(["settings-nav-item", { active: $data.activeSettingTab === "advanced" }]),
              onClick: _cache[5] || (_cache[5] = ($event) => $data.activeSettingTab = "advanced")
            }, " 高级设置 ", 2)
          ]),
          vue.createElementVNode("div", _hoisted_6, [
            $data.activeSettingTab === "ai" ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_7, [
              vue.createElementVNode("div", _hoisted_8, [
                vue.createElementVNode("div", _hoisted_9, [
                  _hoisted_10,
                  vue.createElementVNode("span", _hoisted_11, vue.toDisplayString($options.getApiTypeName($data.settings.apiType)), 1)
                ]),
                vue.createElementVNode("div", _hoisted_12, [
                  _hoisted_13,
                  vue.withDirectives(vue.createElementVNode("select", {
                    "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $data.settings.apiType = $event)
                  }, _hoisted_17, 512), [
                    [vue.vModelSelect, $data.settings.apiType]
                  ])
                ]),
                $data.settings.apiType === "openai" ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_18, [
                  vue.createElementVNode("div", _hoisted_19, [
                    _hoisted_20,
                    vue.createElementVNode("div", _hoisted_21, [
                      vue.withDirectives(vue.createElementVNode("input", {
                        type: "text",
                        "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $data.settings.openaiKey = $event),
                        placeholder: "sk-..."
                      }, null, 512), [
                        [vue.vModelText, $data.settings.openaiKey]
                      ]),
                      vue.createElementVNode("button", {
                        type: "button",
                        class: vue.normalizeClass(["test-api-button", {
                          "test-loading": $data.apiTestStatus.openai === "loading",
                          "test-success": $data.apiTestStatus.openai === "success",
                          "test-error": $data.apiTestStatus.openai === "error"
                        }]),
                        onClick: _cache[8] || (_cache[8] = ($event) => $options.testApiConnection("openai"))
                      }, [
                        $data.apiTestStatus.openai === "" ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_22, "测试连接")) : $data.apiTestStatus.openai === "loading" ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_23)) : $data.apiTestStatus.openai === "success" ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_24, "成功")) : $data.apiTestStatus.openai === "error" ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_25, "失败")) : vue.createCommentVNode("", true)
                      ], 2)
                    ])
                  ]),
                  vue.createElementVNode("div", _hoisted_26, [
                    _hoisted_27,
                    vue.withDirectives(vue.createElementVNode("input", {
                      type: "text",
                      "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => $data.settings.openaiApiUrl = $event),
                      placeholder: "https://api.openai.com/v1/chat/completions"
                    }, null, 512), [
                      [vue.vModelText, $data.settings.openaiApiUrl]
                    ]),
                    _hoisted_28
                  ]),
                  vue.createElementVNode("div", _hoisted_29, [
                    _hoisted_30,
                    vue.withDirectives(vue.createElementVNode("input", {
                      type: "text",
                      "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => $data.settings.openaiModel = $event),
                      placeholder: "gpt-4.1-mini"
                    }, null, 512), [
                      [vue.vModelText, $data.settings.openaiModel]
                    ]),
                    _hoisted_31
                  ]),
                  vue.createElementVNode("div", _hoisted_32, [
                    _hoisted_33,
                    vue.createElementVNode("div", _hoisted_34, [
                      vue.withDirectives(vue.createElementVNode("textarea", {
                        "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => $data.settings.openaiPrompt = $event),
                        placeholder: "输入自定义提示词，或点击右侧按钮使用默认提示词",
                        rows: "3"
                      }, null, 512), [
                        [vue.vModelText, $data.settings.openaiPrompt]
                      ]),
                      vue.createElementVNode("button", {
                        type: "button",
                        class: "use-default-prompt",
                        onClick: _cache[12] || (_cache[12] = ($event) => $data.settings.openaiPrompt = $data.DEFAULT_PROMPT)
                      }, " 使用默认 ")
                    ]),
                    _hoisted_35
                  ])
                ])) : vue.createCommentVNode("", true),
                $data.settings.apiType === "gemini" ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_36, [
                  vue.createElementVNode("div", _hoisted_37, [
                    _hoisted_38,
                    vue.createElementVNode("div", _hoisted_39, [
                      vue.withDirectives(vue.createElementVNode("input", {
                        type: "text",
                        "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => $data.settings.geminiKey = $event),
                        placeholder: "输入Gemini API Key"
                      }, null, 512), [
                        [vue.vModelText, $data.settings.geminiKey]
                      ]),
                      vue.createElementVNode("button", {
                        type: "button",
                        class: vue.normalizeClass(["test-api-button", {
                          "test-loading": $data.apiTestStatus.gemini === "loading",
                          "test-success": $data.apiTestStatus.gemini === "success",
                          "test-error": $data.apiTestStatus.gemini === "error"
                        }]),
                        onClick: _cache[14] || (_cache[14] = ($event) => $options.testApiConnection("gemini"))
                      }, [
                        $data.apiTestStatus.gemini === "" ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_40, "测试连接")) : $data.apiTestStatus.gemini === "loading" ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_41)) : $data.apiTestStatus.gemini === "success" ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_42, "成功")) : $data.apiTestStatus.gemini === "error" ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_43, "失败")) : vue.createCommentVNode("", true)
                      ], 2)
                    ])
                  ]),
                  vue.createElementVNode("div", _hoisted_44, [
                    _hoisted_45,
                    vue.withDirectives(vue.createElementVNode("input", {
                      type: "text",
                      "onUpdate:modelValue": _cache[15] || (_cache[15] = ($event) => $data.settings.geminiApiUrl = $event),
                      placeholder: "https://generativelanguage.googleapis.com/v1beta/models"
                    }, null, 512), [
                      [vue.vModelText, $data.settings.geminiApiUrl]
                    ]),
                    _hoisted_46
                  ]),
                  vue.createElementVNode("div", _hoisted_47, [
                    _hoisted_48,
                    vue.withDirectives(vue.createElementVNode("input", {
                      type: "text",
                      "onUpdate:modelValue": _cache[16] || (_cache[16] = ($event) => $data.settings.geminiModel = $event),
                      placeholder: "gemini-2.5-flash-lite"
                    }, null, 512), [
                      [vue.vModelText, $data.settings.geminiModel]
                    ]),
                    _hoisted_49
                  ]),
                  vue.createElementVNode("div", _hoisted_50, [
                    _hoisted_51,
                    vue.createElementVNode("div", _hoisted_52, [
                      vue.withDirectives(vue.createElementVNode("textarea", {
                        "onUpdate:modelValue": _cache[17] || (_cache[17] = ($event) => $data.settings.geminiPrompt = $event),
                        placeholder: "输入自定义提示词，或点击右侧按钮使用默认提示词",
                        rows: "3"
                      }, null, 512), [
                        [vue.vModelText, $data.settings.geminiPrompt]
                      ]),
                      vue.createElementVNode("button", {
                        type: "button",
                        class: "use-default-prompt",
                        onClick: _cache[18] || (_cache[18] = ($event) => $data.settings.geminiPrompt = $data.DEFAULT_PROMPT)
                      }, " 使用默认 ")
                    ]),
                    _hoisted_53
                  ])
                ])) : vue.createCommentVNode("", true),
                $data.settings.apiType === "qwen" ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_54, [
                  vue.createElementVNode("div", _hoisted_55, [
                    _hoisted_56,
                    vue.createElementVNode("div", _hoisted_57, [
                      vue.withDirectives(vue.createElementVNode("input", {
                        type: "text",
                        "onUpdate:modelValue": _cache[19] || (_cache[19] = ($event) => $data.settings.qwenKey = $event),
                        placeholder: "API Key"
                      }, null, 512), [
                        [vue.vModelText, $data.settings.qwenKey]
                      ]),
                      vue.createElementVNode("button", {
                        type: "button",
                        class: vue.normalizeClass(["test-api-button", {
                          "test-loading": $data.apiTestStatus.qwen === "loading",
                          "test-success": $data.apiTestStatus.qwen === "success",
                          "test-error": $data.apiTestStatus.qwen === "error"
                        }]),
                        onClick: _cache[20] || (_cache[20] = ($event) => $options.testApiConnection("qwen"))
                      }, [
                        $data.apiTestStatus.qwen === "" ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_58, "测试连接")) : $data.apiTestStatus.qwen === "loading" ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_59)) : $data.apiTestStatus.qwen === "success" ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_60, "成功")) : $data.apiTestStatus.qwen === "error" ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_61, "失败")) : vue.createCommentVNode("", true)
                      ], 2)
                    ])
                  ]),
                  vue.createElementVNode("div", _hoisted_62, [
                    _hoisted_63,
                    vue.withDirectives(vue.createElementVNode("input", {
                      type: "text",
                      "onUpdate:modelValue": _cache[21] || (_cache[21] = ($event) => $data.settings.qwenApiUrl = $event),
                      placeholder: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions"
                    }, null, 512), [
                      [vue.vModelText, $data.settings.qwenApiUrl]
                    ]),
                    _hoisted_64
                  ]),
                  vue.createElementVNode("div", _hoisted_65, [
                    _hoisted_66,
                    vue.withDirectives(vue.createElementVNode("input", {
                      type: "text",
                      "onUpdate:modelValue": _cache[22] || (_cache[22] = ($event) => $data.settings.qwenModel = $event),
                      placeholder: "qwen-vl-max-2025-04-02"
                    }, null, 512), [
                      [vue.vModelText, $data.settings.qwenModel]
                    ]),
                    _hoisted_67
                  ]),
                  vue.createElementVNode("div", _hoisted_68, [
                    _hoisted_69,
                    vue.createElementVNode("div", _hoisted_70, [
                      vue.withDirectives(vue.createElementVNode("textarea", {
                        "onUpdate:modelValue": _cache[23] || (_cache[23] = ($event) => $data.settings.qwenPrompt = $event),
                        placeholder: "输入自定义提示词，或点击右侧按钮使用默认提示词",
                        rows: "3"
                      }, null, 512), [
                        [vue.vModelText, $data.settings.qwenPrompt]
                      ]),
                      vue.createElementVNode("button", {
                        type: "button",
                        class: "use-default-prompt",
                        onClick: _cache[24] || (_cache[24] = ($event) => $data.settings.qwenPrompt = $data.DEFAULT_PROMPT)
                      }, " 使用默认 ")
                    ]),
                    _hoisted_71
                  ])
                ])) : vue.createCommentVNode("", true)
              ])
            ])) : vue.createCommentVNode("", true),
            $data.activeSettingTab === "function" ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_72, [
              vue.createElementVNode("div", _hoisted_73, [
                _hoisted_74,
                vue.createElementVNode("div", _hoisted_75, [
                  vue.createElementVNode("div", _hoisted_76, [
                    vue.withDirectives(vue.createElementVNode("input", {
                      type: "checkbox",
                      "onUpdate:modelValue": _cache[25] || (_cache[25] = ($event) => $data.settings.autoRecognize = $event),
                      id: "autoRecognize",
                      style: { "width": "auto", "margin-right": "8px !important" }
                    }, null, 512), [
                      [vue.vModelCheckbox, $data.settings.autoRecognize]
                    ]),
                    _hoisted_77
                  ])
                ]),
                vue.createElementVNode("div", _hoisted_78, [
                  vue.createElementVNode("div", _hoisted_79, [
                    vue.withDirectives(vue.createElementVNode("input", {
                      type: "checkbox",
                      "onUpdate:modelValue": _cache[26] || (_cache[26] = ($event) => $data.settings.copyToClipboard = $event),
                      id: "copyToClipboard",
                      style: { "width": "auto", "margin-right": "8px !important" }
                    }, null, 512), [
                      [vue.vModelCheckbox, $data.settings.copyToClipboard]
                    ]),
                    _hoisted_80
                  ])
                ]),
                vue.createElementVNode("div", _hoisted_81, [
                  vue.createElementVNode("div", _hoisted_82, [
                    vue.withDirectives(vue.createElementVNode("input", {
                      type: "checkbox",
                      "onUpdate:modelValue": _cache[27] || (_cache[27] = ($event) => $data.settings.showNotification = $event),
                      id: "showNotification",
                      style: { "width": "auto", "margin-right": "8px !important" }
                    }, null, 512), [
                      [vue.vModelCheckbox, $data.settings.showNotification]
                    ]),
                    _hoisted_83
                  ])
                ]),
                vue.createElementVNode("div", _hoisted_84, [
                  vue.createElementVNode("div", _hoisted_85, [
                    vue.withDirectives(vue.createElementVNode("input", {
                      type: "checkbox",
                      "onUpdate:modelValue": _cache[28] || (_cache[28] = ($event) => $data.settings.autoFetchCloudRules = $event),
                      id: "autoFetchCloudRules",
                      style: { "width": "auto", "margin-right": "8px !important" }
                    }, null, 512), [
                      [vue.vModelCheckbox, $data.settings.autoFetchCloudRules]
                    ]),
                    _hoisted_86
                  ])
                ])
              ])
            ])) : vue.createCommentVNode("", true),
            $data.activeSettingTab === "domain" ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_87, [
              vue.createElementVNode("div", _hoisted_88, [
                _hoisted_89,
                vue.createElementVNode("div", _hoisted_90, [
                  vue.withDirectives(vue.createElementVNode("textarea", {
                    "onUpdate:modelValue": _cache[29] || (_cache[29] = ($event) => $data.settings.disabledDomains = $event),
                    placeholder: "每行一个域名，支持正则和通配符，例如：\nexample.com\n*.example.org\nexample.*.com\n/^(www\\.)?example\\.com$/",
                    rows: "6",
                    class: "domain-textarea"
                  }, null, 512), [
                    [vue.vModelText, $data.settings.disabledDomains]
                  ]),
                  _hoisted_91
                ])
              ])
            ])) : vue.createCommentVNode("", true),
            $data.activeSettingTab === "advanced" ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_92, [
              vue.createElementVNode("div", _hoisted_93, [
                _hoisted_94,
                _hoisted_95,
                vue.createElementVNode("div", _hoisted_96, [
                  _hoisted_97,
                  vue.createElementVNode("div", _hoisted_98, [
                    (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($data.settings.customCaptchaSelectors, (selector, index) => {
                      return vue.openBlock(), vue.createElementBlock("div", {
                        key: "captcha-" + index,
                        class: "selector-item"
                      }, [
                        vue.withDirectives(vue.createElementVNode("input", {
                          type: "text",
                          "onUpdate:modelValue": ($event) => $data.settings.customCaptchaSelectors[index] = $event,
                          placeholder: "例如: img[src*='captcha']"
                        }, null, 8, _hoisted_99), [
                          [vue.vModelText, $data.settings.customCaptchaSelectors[index]]
                        ]),
                        vue.createElementVNode("button", {
                          type: "button",
                          class: "remove-selector",
                          onClick: ($event) => $options.removeSelector("captcha", index)
                        }, " × ", 8, _hoisted_100)
                      ]);
                    }), 128)),
                    vue.createElementVNode("button", {
                      type: "button",
                      class: "add-selector",
                      onClick: _cache[30] || (_cache[30] = ($event) => $options.addSelector("captcha"))
                    }, " 添加选择器 ")
                  ])
                ]),
                vue.createElementVNode("div", _hoisted_101, [
                  _hoisted_102,
                  vue.createElementVNode("div", _hoisted_103, [
                    (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($data.settings.customInputSelectors, (selector, index) => {
                      return vue.openBlock(), vue.createElementBlock("div", {
                        key: "input-" + index,
                        class: "selector-item"
                      }, [
                        vue.withDirectives(vue.createElementVNode("input", {
                          type: "text",
                          "onUpdate:modelValue": ($event) => $data.settings.customInputSelectors[index] = $event,
                          placeholder: "例如: input[name*='captcha']"
                        }, null, 8, _hoisted_104), [
                          [vue.vModelText, $data.settings.customInputSelectors[index]]
                        ]),
                        vue.createElementVNode("button", {
                          type: "button",
                          class: "remove-selector",
                          onClick: ($event) => $options.removeSelector("input", index)
                        }, " × ", 8, _hoisted_105)
                      ]);
                    }), 128)),
                    vue.createElementVNode("button", {
                      type: "button",
                      class: "add-selector",
                      onClick: _cache[31] || (_cache[31] = ($event) => $options.addSelector("input"))
                    }, " 添加选择器 ")
                  ])
                ]),
                vue.createElementVNode("div", _hoisted_106, [
                  _hoisted_107,
                  vue.createElementVNode("div", _hoisted_108, [
                    vue.createElementVNode("div", _hoisted_109, [
                      vue.withDirectives(vue.createElementVNode("input", {
                        type: "text",
                        "onUpdate:modelValue": _cache[32] || (_cache[32] = ($event) => $data.settings.rulesUrl = $event),
                        placeholder: "https://raw.githubusercontent.com/anghunk/UserScript/main/CAPTCHA-automatic-recognition/rules.json"
                      }, null, 512), [
                        [vue.vModelText, $data.settings.rulesUrl]
                      ]),
                      _hoisted_110
                    ]),
                    vue.createElementVNode("button", {
                      type: "button",
                      class: vue.normalizeClass(["reload-rules-button", {
                        "test-loading": $data.rulesLoadStatus === "loading",
                        "test-success": $data.rulesLoadStatus === "success",
                        "test-error": $data.rulesLoadStatus === "error"
                      }]),
                      onClick: _cache[33] || (_cache[33] = (...args) => $options.reloadRules && $options.reloadRules(...args))
                    }, [
                      $data.rulesLoadStatus === "" ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_111, "重新加载规则")) : $data.rulesLoadStatus === "loading" ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_112)) : $data.rulesLoadStatus === "success" ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_113, "加载成功")) : $data.rulesLoadStatus === "error" ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_114, "加载失败")) : vue.createCommentVNode("", true)
                    ], 2),
                    _hoisted_115
                  ])
                ])
              ])
            ])) : vue.createCommentVNode("", true)
          ]),
          vue.createElementVNode("div", _hoisted_116, [
            vue.createElementVNode("button", {
              onClick: _cache[34] || (_cache[34] = (...args) => $options.saveSettings && $options.saveSettings(...args))
            }, "保存设置"),
            vue.createElementVNode("button", {
              onClick: _cache[35] || (_cache[35] = (...args) => $options.closeSettings && $options.closeSettings(...args))
            }, "取消")
          ])
        ])
      ], 2)) : vue.createCommentVNode("", true)
    ]);
  }
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
  const app = vue.createApp(App);
  app.mount(
    (() => {
      const appDiv = document.createElement("div");
      document.documentElement.append(appDiv);
      return appDiv;
    })()
  );

})(Vue);