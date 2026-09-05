// Compiles a dart2wasm-generated main module from `source` which can then
// be instantiated via the `instantiate` method.
//
// `source` needs to be a `Response` object (or promise thereof) e.g. created
// via the `fetch()` JS API.
export async function compileStreaming(source) {
  const builtins = {builtins: ['js-string']};
  return new CompiledApp(
      await WebAssembly.compileStreaming(source, builtins), builtins);
}

// Compiles a dart2wasm-generated wasm module from `bytes` which is then
// instantiable via the `instantiate` method.
export async function compile(bytes) {
  const builtins = {builtins: ['js-string']};
  return new CompiledApp(await WebAssembly.compile(bytes, builtins), builtins);
}

class CompiledApp {
  constructor(module, builtins) {
    this.module = module;
    this.builtins = builtins;
  }

  // The second argument is an options object containing:
  // `loadDeferredModules` is a JS function that takes an array of module names
  //   matching wasm files produced by the dart2wasm compiler. It also takes a
  //   callback that should be invoked for each loaded module with 2 arguments:
  //   (1) the module name, (2) the loaded module in a format supported by
  //   `WebAssembly.compile` or `WebAssembly.compileStreaming`. The callback
  //   returns a Promise that resolves when the module is instantiated.
  //   loadDeferredModules should return a Promise that resolves when all the
  //   modules have been loaded and the callback promises have resolved.
  // `loadDeferredId` is a JS function that takes load ID produced by the
  //   compiler when the `use-load-ids` option is passed. Each load ID maps to
  //   one or more wasm files as specified in the emitted JSON file. It also
  //   takes a callback that should be invoked for each loaded module with 2
  //   arguments: (1) the module name, (2) the loaded module in a format
  //   supported by `WebAssembly.compile` or `WebAssembly.compileStreaming`.
  //   The callback returns a Promise that resolves when the module is
  //   instantiated.
  //   loadDeferredId should return a Promise that resolves when all the
  //   modules have been loaded and the callback promises have resolved.
  async instantiate(additionalImports, {loadDeferredModules, loadDeferredId} = {}) {
    let dartInstance;

    // Prints to the console
    function printToConsole(value) {
      if (typeof dartPrint == "function") {
        dartPrint(value);
        return;
      }
      if (typeof console == "object" && typeof console.log != "undefined") {
        console.log(value);
        return;
      }
      if (typeof print == "function") {
        print(value);
        return;
      }

      throw "Unable to print message: " + value;
    }

    // A special symbol attached to functions that wrap Dart functions.
    const jsWrappedDartFunctionSymbol = Symbol("JSWrappedDartFunction");

    function finalizeWrapper(dartFunction, wrapped) {
      wrapped.dartFunction = dartFunction;
      wrapped[jsWrappedDartFunctionSymbol] = true;
      return wrapped;
    }

    // Imports
    const dart2wasm = {
            AB: x0 => new Int16Array(x0),
      AC: (o, start, length) => new Uint8ClampedArray(o.buffer, o.byteOffset + start, length),
      AD: x0 => x0.screen,
      AE: x0 => new ResizeObserver(x0),
      AF: x0 => x0.key,
      AG: x0 => x0.hash,
      AH: (x0,x1) => x0.dispatchEvent(x1),
      AI: x0 => x0.fontFallbackBaseUrl,
      AJ: x0 => x0.frameCount,
      AK: x0 => x0.id,
      AL: x0 => x0.altKey,
      AM: (x0,x1) => { x0.crossOrigin = x1 },
      B: s => printToConsole(s),
      BB: x0 => new Uint16Array(x0),
      BC: (o, start, length) => new Uint8Array(o.buffer, o.byteOffset + start, length),
      BD: o => {
        if (o === null || o === undefined) return 0;
        if (typeof(o) === 'string') return 1;
        return 2;
      },
      BE: (x0,x1) => x0.getPropertyValue(x1),
      BF: x0 => x0.identifier,
      BG: x0 => x0.state,
      BH: (x0,x1) => x0.createEvent(x1),
      BI: x0 => new WeakRef(x0),
      BJ: x0 => x0.selectedTrack,
      BK: x0 => x0.offsetHeight,
      BL: x0 => x0.ctrlKey,
      BM: (x0,x1) => { x0.type = x1 },
      C: Function.prototype.call.bind(Number.prototype.toString),
      CB: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmI16ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      CC: (o, start, length) => new Int8Array(o.buffer, o.byteOffset + start, length),
      CD: x0 => x0.tabIndex,
      CE: x0 => globalThis.parseFloat(x0),
      CF: x0 => x0.touches,
      CG: (x0,x1) => x0.go(x1),
      CH: (x0,x1,x2,x3) => x0.initEvent(x1,x2,x3),
      CI: x0 => x0.deref(),
      CJ: x0 => x0.completed,
      CK: x0 => x0.offsetWidth,
      CL: x0 => x0.isComposing,
      CM: () => globalThis.document,
      D: Function.prototype.call.bind(BigInt.prototype.toString),
      DB: x0 => new Int32Array(x0),
      DC: (x0,x1) => x0.querySelector(x1),
      DD: (x0,x1) => x0.contains(x1),
      DE: (x0,x1) => x0.getComputedStyle(x1),
      DF: x0 => x0.pressure,
      DG: x0 => x0.parentElement,
      DH: x0 => x0.readText(),
      DI: () => globalThis.WeakRef,
      DJ: x0 => x0.ready,
      DK: x0 => x0.stopPropagation(),
      DL: x0 => x0.code,
      DM: (x0,x1) => globalThis.firebase_analytics.setAnalyticsCollectionEnabled(x0,x1),
      E: (exn) => {
        let stackString = exn.toString();
        let frames = stackString.split('\n');
        let drop = 4;
        if (frames[0].startsWith('Error')) {
            drop += 1;
        }
        return frames.slice(drop).join('\n');
      },
      EB: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmI32ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      EC: (x0,x1) => x0.item(x1),
      ED: x0 => x0.activeElement,
      EE: x0 => x0.documentElement,
      EF: x0 => x0.tiltY,
      EG: (x0,x1) => x0.querySelectorAll(x1),
      EH: x0 => x0.clipboard,
      EI: (o, offsetInBytes, lengthInBytes) => {
        var dst = new ArrayBuffer(lengthInBytes);
        new Uint8Array(dst).set(new Uint8Array(o, offsetInBytes, lengthInBytes));
        return new DataView(dst);
      },
      EJ: x0 => x0.tracks,
      EK: x0 => x0.disabled,
      EL: x0 => x0.repeat,
      EM: (x0,x1) => globalThis.firebase_analytics.initializeAnalytics(x0,x1),
      F: () => new Error().stack,
      FB: x0 => new Uint32Array(x0),
      FC: x0 => x0.length,
      FD: x0 => x0.parentNode,
      FE: x0 => x0.computedStyleMap(),
      FF: x0 => x0.tiltX,
      FG: (x0,x1) => x0.requestAnimationFrame(x1),
      FH: (x0,x1) => x0.writeText(x1),
      FI: (a, s, e) => a.slice(s, e),
      FJ: x0 => x0.close(),
      FK: (x0,x1) => { x0.min = x1 },
      FL: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      FM: (x0,x1,x2,x3) => globalThis.firebase_analytics.logEvent(x0,x1,x2,x3),
      G: s => JSON.stringify(s),
      GB: x0 => new Float32Array(x0),
      GC: (x0,x1) => x0.querySelectorAll(x1),
      GD: x0 => x0.tagName,
      GE: (x0,x1) => x0.get(x1),
      GF: x0 => x0.pointerType,
      GG: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      GH: x0 => x0.unlock(),
      GI: x0 => x0.protocol,
      GJ: (x0,x1) => ({frameIndex: x0,completeFramesOnly: x1}),
      GK: (x0,x1) => { x0.max = x1 },
      GL: x0 => x0.userAgent,
      GM: (x0,x1) => x0.querySelector(x1),
      H: Function.prototype.call.bind(Number.prototype.toString),
      HB: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmF32ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      HC: (x0,x1) => x0.getAttribute(x1),
      HD: x0 => x0.target,
      HE: (o, p) => p in o,
      HF: x0 => x0.pointerId,
      HG: x0 => x0.now(),
      HH: (x0,x1) => x0.lock(x1),
      HI: (x0,x1,x2) => x0.close(x1,x2),
      HJ: (x0,x1) => x0.decode(x1),
      HK: (x0,x1) => { x0.disabled = x1 },
      HL: x0 => x0.navigator,
      HM: (o, a) => o + a,
      I: Function.prototype.call.bind(String.prototype.indexOf),
      IB: x0 => new Float64Array(x0),
      IC: x0 => x0.remove(),
      ID: x0 => x0.clientY,
      IE: (x0,x1) => { x0.textContent = x1 },
      IF: x0 => x0.getCoalescedEvents(),
      IG: x0 => x0.performance,
      IH: x0 => x0.orientation,
      II: x0 => x0.close(),
      IJ: x0 => x0.displayHeight,
      IK: (x0,x1) => { x0.scrollLeft = x1 },
      IL: (x0,x1,x2,x3) => x0.open(x1,x2,x3),
      IM: x0 => x0.children,
      J: (s, p, i) => s.lastIndexOf(p, i),
      JB: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmF64ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      JC: (x0,x1) => x0.appendChild(x1),
      JD: x0 => x0.clientX,
      JE: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      JF: (x0,x1) => x0.getModifierState(x1),
      JG: (d, digits) => d.toFixed(digits),
      JH: (x0,x1) => x0.querySelector(x1),
      JI: (x0,x1) => x0.send(x1),
      JJ: x0 => x0.displayWidth,
      JK: (x0,x1) => { x0.spellcheck = x1 },
      JL: (x0,x1) => x0.key(x1),
      JM: (x0,x1) => { x0.id = x1 },
      K: (exn) => {
        if (exn instanceof Error) {
          return exn.stack;
        } else {
          return null;
        }
      },
      KB: x0 => new ArrayBuffer(x0),
      KC: (x0,x1) => x0.append(x1),
      KD: (x0,x1,x2) => x0.setAttribute(x1,x2),
      KE: x0 => x0.matches,
      KF: s => s.trimLeft(),
      KG: x0 => x0.maxHeight,
      KH: (x0,x1) => { x0.title = x1 },
      KI: () => new Array(),
      KJ: x0 => x0.duration,
      KK: (x0,x1) => { x0.disabled = x1 },
      KL: x0 => x0.length,
      KM: x0 => new Blob(x0),
      L: o => o === undefined,
      LB: (x0,x1,x2) => new Uint8Array(x0,x1,x2),
      LC: (x0,x1,x2,x3) => x0.setProperty(x1,x2,x3),
      LD: x0 => x0.getBoundingClientRect(),
      LE: (x0,x1) => x0.matchMedia(x1),
      LF: s => s.toUpperCase(),
      LG: x0 => x0.maxWidth,
      LH: (x0,x1) => x0.vibrate(x1),
      LI: (x0,x1) => new WebSocket(x0,x1),
      LJ: x0 => x0.image,
      LK: (x0,x1) => x0.getItem(x1),
      LL: x0 => x0.baseURI,
      LM: x0 => globalThis.URL.createObjectURL(x0),
      M: o => String(o),
      MB: (x0,x1,x2) => new DataView(x0,x1,x2),
      MC: x0 => x0.style,
      MD: (ms, c) =>
      setTimeout(() => dartInstance.exports.$invokeCallback(c),ms),
      ME: x0 => x0.matches,
      MF: (x0,x1) => x0[x1],
      MG: x0 => x0.minHeight,
      MH: x0 => x0.arrayBuffer(),
      MI: x0 => x0.reason,
      MJ: () => globalThis.window.ImageDecoder,
      MK: x0 => x0.localStorage,
      ML: x0 => x0.document,
      MM: x0 => x0.click(),
      N: (c) =>
      queueMicrotask(() => dartInstance.exports.$invokeCallback(c)),
      NB: (o, p) => o[p],
      NC: x0 => x0.debugShowSemanticsNodes,
      ND: s => new Date(s * 1000).getTimezoneOffset() * 60,
      NE: o => typeof o === 'function' && o[jsWrappedDartFunctionSymbol] === true,
      NF: x0 => x0.index,
      NG: x0 => x0.minWidth,
      NH: o => {
        if (o === null || o === undefined) return 0;
        if (o instanceof ArrayBuffer) return 1;
        if (globalThis.SharedArrayBuffer !== undefined &&
            o instanceof SharedArrayBuffer) {
          return 2;
        }
        return 3;
      },
      NI: x0 => x0.code,
      NJ: x0 => x0.decode(),
      NK: () => globalThis.window,
      NL: x0 => x0.measurementId,
      NM: x0 => globalThis.URL.revokeObjectURL(x0),
      O: (x0,x1) => x0.didCreateEngineInitializer(x1),
      OB: (o) => new DataView(o.buffer, o.byteOffset, o.byteLength),
      OC: o => o,
      OD: Date.now,
      OE: f => f.dartFunction,
      OF: x0 => x0.pop(),
      OG: (x0,x1) => x0.removeProperty(x1),
      OH: x0 => x0.status,
      OI: (x0,x1,x2,x3) => x0.addEventListener(x1,x2,x3),
      OJ: (x0,x1,x2,x3) => x0.open(x1,x2,x3),
      OK: (x0,x1,x2,x3) => x0.replaceState(x1,x2,x3),
      OL: x0 => x0.appId,
      OM: (x0,x1) => { x0.download = x1 },
      P: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      PB: Function.prototype.call.bind(Object.getOwnPropertyDescriptor(DataView.prototype, 'byteLength').get),
      PC: o => {
        if (o === undefined || o === null) return 0;
        if (typeof o === 'boolean') return 1;
        return 2;
      },
      PD: (handle) => clearTimeout(handle),
      PE: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      PF: x0 => x0.flags,
      PG: (x0,x1) => x0.add(x1),
      PH: (x0,x1) => x0.fetch(x1),
      PI: (x0,x1,x2,x3) => x0.removeEventListener(x1,x2,x3),
      PJ: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      PK: x0 => x0.history,
      PL: x0 => x0.messagingSenderId,
      PM: (x0,x1) => { x0.target = x1 },
      Q: (wasmFunction,f) => finalizeWrapper(f, function() { return wasmFunction(f,arguments.length) }),
      QB: o => o.byteOffset,
      QC: (x0,x1) => x0.warn(x1),
      QD: (x0,x1) => x0.closest(x1),
      QE: (wasmFunction,f) => finalizeWrapper(f, function(x0,x1) { return wasmFunction(f,arguments.length,x0,x1) }),
      QF: (a, s) => a.join(s),
      QG: x0 => x0.data,
      QH: x0 => x0.content,
      QI: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      QJ: (x0,x1,x2) => x0.addEventListener(x1,x2),
      QK: x0 => x0.href,
      QL: x0 => x0.authDomain,
      QM: (x0,x1) => { x0.href = x1 },
      R: (x0,x1) => ({initializeEngine: x0,autoStart: x1}),
      RB: o => o.buffer,
      RC: x0 => x0.console,
      RD: x0 => x0.bottom,
      RE: (p, s, f) => p.then(s, (e) => f(e, e === undefined)),
      RF: (x0,x1) => x0.error(x1),
      RG: (x0,x1) => { x0.scrollTop = x1 },
      RH: x0 => x0.document,
      RI: (o, t) => typeof o === t,
      RJ: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      RK: x0 => x0.location,
      RL: x0 => x0.projectId,
      RM: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      S: (wasmFunction,f) => finalizeWrapper(f, function(x0,x1) { return wasmFunction(f,arguments.length,x0,x1) }),
      SB: Function.prototype.call.bind(DataView.prototype.getUint8),
      SC: () => globalThis.window,
      SD: x0 => x0.top,
      SE: (o, i) => o[i],
      SF: () => globalThis.console,
      SG: (x0,x1,x2) => x0.setSelectionRange(x1,x2),
      SH: () => typeof dartUseDateNowForTicks !== "undefined",
      SI: x0 => x0.data,
      SJ: x0 => x0.send(),
      SK: (x0,x1) => x0.removeItem(x1),
      SL: x0 => x0.name,
      SM: (x0,x1,x2) => x0.addEventListener(x1,x2),
      T: x0 => new Promise(x0),
      TB: (b, o) => new DataView(b, o),
      TC: (o, c) => o instanceof c,
      TD: x0 => x0.right,
      TE: o => o.length,
      TF: s => s.trimRight(),
      TG: (x0,x1) => { x0.value = x1 },
      TH: () => Date.now(),
      TI: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      TJ: x0 => x0.status,
      TK: (x0,x1,x2) => x0.setItem(x1,x2),
      TL: x0 => x0.message,
      TM: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      U: (x0,x1,x2) => x0.call(x1,x2),
      UB: (b, o, l) => new DataView(b, o, l),
      UC: (x0,x1) => x0.exec(x1),
      UD: x0 => x0.left,
      UE: o => {
        if (o === undefined) return 1;
        var type = typeof o;
        if (type === 'boolean') return 2;
        if (type === 'number') return 3;
        if (type === 'string') return 4;
        if (o instanceof Array) return 5;
        if (ArrayBuffer.isView(o)) {
          if (o instanceof Int8Array) return 6;
          if (o instanceof Uint8Array) return 7;
          if (o instanceof Uint8ClampedArray) return 8;
          if (o instanceof Int16Array) return 9;
          if (o instanceof Uint16Array) return 10;
          if (o instanceof Int32Array) return 11;
          if (o instanceof Uint32Array) return 12;
          if (o instanceof Float32Array) return 13;
          if (o instanceof Float64Array) return 14;
          if (o instanceof DataView) return 15;
        }
        if (o instanceof ArrayBuffer) return 16;
        // Feature check for `SharedArrayBuffer` before doing a type-check.
        if (globalThis.SharedArrayBuffer !== undefined &&
            o instanceof SharedArrayBuffer) {
            return 17;
        }
        if (o instanceof Promise) return 18;
        return 19;
      },
      UF: x0 => x0.blur(),
      UG: (x0,x1,x2) => x0.setSelectionRange(x1,x2),
      UH: () => 1000 * performance.now(),
      UI: x0 => x0.readyState,
      UJ: x0 => x0.response,
      UK: (x0,x1) => x0.close(x1),
      UL: x0 => x0.code,
      UM: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      V: (constructor, args) => {
        const factoryFunction = constructor.bind.apply(
            constructor, [null, ...args]);
        return new factoryFunction();
      },
      VB: Function.prototype.call.bind(DataView.prototype.getFloat64),
      VC: x0 => x0.length,
      VD: x0 => x0.clientY,
      VE: x0 => x0.language,
      VF: x0 => x0.button,
      VG: (x0,x1) => { x0.value = x1 },
      VH: x0 => new Uint8Array(x0),
      VI: (x0,x1) => { x0.binaryType = x1 },
      VJ: (x0,x1,x2) => x0.setRequestHeader(x1,x2),
      VK: x0 => new BroadcastChannel(x0),
      VL: x0 => x0.name,
      VM: (x0,x1) => x0.removeChild(x1),
      W: x0 => new Array(x0),
      WB: o => {
        if (o === null || o === undefined) return 0;
        if (o instanceof Float64Array) return 1;
        return 2;
      },
      WC: (x0,x1) => { x0.lastIndex = x1 },
      WD: x0 => x0.clientX,
      WE: (x0,x1,x2,x3) => x0.register(x1,x2,x3),
      WF: x0 => x0.innerHeight,
      WG: s => {
        if (/[[\]{}()*+?.\\^$|]/.test(s)) {
            s = s.replace(/[[\]{}()*+?.\\^$|]/g, '\\$&');
        }
        return s;
      },
      WH: (x0,x1,x2) => x0.slice(x1,x2),
      WI: () => {
        return typeof process != "undefined" &&
               Object.prototype.toString.call(process) == "[object process]" &&
               process.platform == "win32"
      },
      WJ: (x0,x1) => { x0.responseType = x1 },
      WK: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      WL: (o) => {
        const typeofValue = typeof o;
        return (typeofValue === 'object') ||
            typeofValue === 'function';
      },
      WM: x0 => x0.firstChild,
      X: o => [o],
      XB: Function.prototype.call.bind(DataView.prototype.setFloat64),
      XC: (s, m) => {
        try {
          return new RegExp(s, m);
        } catch (e) {
          return String(e);
        }
      },
      XD: x0 => x0.changedTouches,
      XE: () => globalThis.window.FinalizationRegistry,
      XF: x0 => x0.innerWidth,
      XG: x0 => x0.value,
      XH: (x0,x1) => x0.decode(x1),
      XI: () => {
        // On browsers return `globalThis.location.href`
        if (globalThis.location != null) {
          return globalThis.location.href;
        }
        return null;
      },
      XJ: () => new XMLHttpRequest(),
      XK: x0 => x0.close(),
      XL: (x0,x1,x2,x3,x4,x5,x6,x7) => ({apiKey: x0,authDomain: x1,databaseURL: x2,projectId: x3,storageBucket: x4,messagingSenderId: x5,measurementId: x6,appId: x7}),
      XM: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      Y: (o0, o1) => [o0, o1],
      YB: (t, s) => t.set(s),
      YC: o => o instanceof RegExp,
      YD: x0 => x0.offsetY,
      YE: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      YF: x0 => x0.height,
      YG: x0 => x0.selectionDirection,
      YH: (x0,x1) => x0.adoptText(x1),
      YI: (x0,x1) => x0.getRandomValues(x1),
      YJ: x0 => x0.input,
      YK: (x0,x1) => x0.postMessage(x1),
      YL: (x0,x1) => globalThis.firebase_core.initializeApp(x0,x1),
      YM: (x0,x1,x2) => x0.removeEventListener(x1,x2),
      Z: (o0, o1, o2) => [o0, o1, o2],
      ZB: Function.prototype.call.bind(DataView.prototype.setFloat32),
      ZC: (string, times) => string.repeat(times),
      ZD: x0 => x0.offsetX,
      ZE: x0 => new window.FinalizationRegistry(x0),
      ZF: x0 => x0.width,
      ZG: x0 => x0.selectionStart,
      ZH: x0 => x0.first(),
      ZI: () => globalThis.crypto,
      ZJ: (o, p) => p in o,
      ZK: (x0,x1) => { x0.onmessage = x1 },
      ZL: x0 => x0.storageBucket,
      ZM: (x0,x1) => x0.item(x1),
      a: (o0, o1, o2, o3) => [o0, o1, o2, o3],
      aB: Function.prototype.call.bind(DataView.prototype.getFloat32),
      aC: x0 => x0.dotAll,
      aD: x0 => x0.type,
      aE: (x0,x1) => x0.unregister(x1),
      aF: x0 => x0.clientHeight,
      aG: x0 => x0.selectionEnd,
      aH: x0 => x0.next(),
      aI: l => new DataView(new ArrayBuffer(l)),
      aJ: x0 => x0.groups,
      aK: () => new AbortController(),
      aL: x0 => x0.databaseURL,
      aM: () => new FileReader(),
      b: (x0,x1,x2) => { x0[x1] = x2 },
      bB: o => {
        if (o === null || o === undefined) return 0;
        if (o instanceof Float32Array) return 1;
        return 2;
      },
      bC: x0 => x0.unicode,
      bD: x0 => x0.maxTouchPoints,
      bE: (x0,x1) => x0.contains(x1),
      bF: x0 => x0.clientWidth,
      bG: x0 => x0.value,
      bH: x0 => x0.current(),
      bI: x0 => x0.naturalHeight,
      bJ: () => globalThis.window.navigator.userAgent,
      bK: (x0,x1,x2,x3,x4,x5) => ({method: x0,headers: x1,body: x2,credentials: x3,redirect: x4,signal: x5}),
      bL: x0 => x0.apiKey,
      bM: (x0,x1) => x0.readAsArrayBuffer(x1),
      c: o => o,
      cB: Function.prototype.call.bind(DataView.prototype.getUint32),
      cC: x0 => x0.ignoreCase,
      cD: x0 => x0.platform,
      cE: (s) => +s,
      cF: (x0,x1) => { x0.content = x1 },
      cG: x0 => x0.selectionDirection,
      cH: (x0,x1) => new Intl.v8BreakIterator(x0,x1),
      cI: x0 => x0.naturalWidth,
      cJ: (a, l) => a.length = l,
      cK: (x0,x1) => globalThis.fetch(x0,x1),
      cL: x0 => x0.options,
      cM: x0 => ({type: x0}),
      d: (o, p) => o[p],
      dB: o => {
        if (o === null || o === undefined) return 0;
        if (o instanceof Uint32Array) return 1;
        return 2;
      },
      dC: x0 => x0.multiline,
      dD: x0 => x0.body,
      dE: s => {
        if (!/^\s*[+-]?(?:Infinity|NaN|(?:\.\d+|\d+(?:\.\d*)?)(?:[eE][+-]?\d+)?)\s*$/.test(s)) {
          return NaN;
        }
        return parseFloat(s);
      },
      dF: (x0,x1) => { x0.name = x1 },
      dG: x0 => x0.selectionStart,
      dH: x0 => x0.v8BreakIterator,
      dI: (x0,x1) => x0.createElement(x1),
      dJ: (x0,x1,x2,x3) => x0.putImageData(x1,x2,x3),
      dK: (x0,x1) => x0.get(x1),
      dL: x0 => globalThis.firebase_core.getApp(x0),
      dM: (x0,x1) => new Blob(x0,x1),
      e: () => globalThis,
      eB: Function.prototype.call.bind(DataView.prototype.getInt32),
      eC: (string, token) => string.split(token),
      eD: () => globalThis.document,
      eE: s => s.trim(),
      eF: x0 => x0.head,
      eG: x0 => x0.selectionEnd,
      eH: () => globalThis.Intl,
      eI: (x0,x1) => { x0.pointerEvents = x1 },
      eJ: x0 => x0.arrayBuffer(),
      eK: (wasmFunction,f) => finalizeWrapper(f, function(x0,x1,x2) { return wasmFunction(f,arguments.length,x0,x1,x2) }),
      eL: () => globalThis.firebase_core.getApp(),
      eM: x0 => x0.size,
      f: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      fB: o => {
        if (o === null || o === undefined) return 0;
        if (o instanceof Int32Array) return 1;
        return 2;
      },
      fC: o => o instanceof Array,
      fD: (x0,x1,x2) => x0.addEventListener(x1,x2),
      fE: x0 => x0.classList,
      fF: (x0,x1) => x0.removeChild(x1),
      fG: x0 => x0.keyCode,
      fH: (x0,x1) => x0.segment(x1),
      fI: (x0,x1) => { x0.height = x1 },
      fJ: (x0,x1) => x0.transferFromImageBitmap(x1),
      fK: (x0,x1) => x0.forEach(x1),
      fL: () => globalThis.firebase_core.SDK_VERSION,
      fM: x0 => x0.name,
      g: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      gB: o => o instanceof Uint16Array,
      gC: (a, i) => a[i],
      gD: x0 => x0.hasFocus(),
      gE: x0 => x0.preventDefault(),
      gF: x0 => x0.firstChild,
      gG: (x0,x1) => x0.scrollIntoView(x1),
      gH: x0 => x0.index,
      gI: (x0,x1) => { x0.width = x1 },
      gJ: x0 => x0.height,
      gK: x0 => x0.name,
      gL: (x0,x1,x2) => globalThis.firebase_core.registerVersion(x0,x1,x2),
      gM: x0 => x0.type,
      h: (x0,x1) => ({addView: x0,removeView: x1}),
      hB: Function.prototype.call.bind(DataView.prototype.getUint16),
      hC: a => a.length,
      hD: x0 => x0.relatedTarget,
      hE: x0 => x0.parent,
      hF: x0 => x0.viewConstraints,
      hG: x0 => x0.multiViewEnabled,
      hH: x0 => x0.next(),
      hI: x0 => x0.style,
      hJ: x0 => x0.width,
      hK: x0 => x0.statusText,
      hL: x0 => x0.sessionStorage,
      hM: x0 => x0.result,
      i: (l, r) => l === r,
      iB: o => o instanceof Int16Array,
      iC: (x0,x1) => x0.test(x1),
      iD: x0 => x0.shiftKey,
      iE: x0 => x0.timeStamp,
      iF: x0 => x0.hostElement,
      iG: (x0,x1) => x0.replaceWith(x1),
      iH: x0 => x0.value,
      iI: (x0,x1) => { x0.src = x1 },
      iJ: x0 => x0.rasterEndMilliseconds,
      iK: x0 => x0.url,
      iL: (x0,x1) => x0.createElement(x1),
      iM: x0 => x0.length,
      j: x0 => x0.random(),
      jB: Function.prototype.call.bind(DataView.prototype.getInt16),
      jC: x0 => x0.userAgent,
      jD: (decoder, codeUnits) => decoder.decode(codeUnits),
      jE: (x0,x1) => x0.hasAttribute(x1),
      jF: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      jG: (x0,x1) => { x0.type = x1 },
      jH: x0 => x0.done,
      jI: () => globalThis.document,
      jJ: x0 => x0.rasterStartMilliseconds,
      jK: x0 => x0.status,
      jL: (x0,x1) => x0.debug(x1),
      jM: x0 => x0.files,
      k: o => o,
      kB: o => o instanceof Uint8ClampedArray,
      kC: x0 => x0.navigator,
      kD: () => new TextDecoder("utf-8", {fatal: true}),
      kE: x0 => x0.buttons,
      kF: x0 => ({runApp: x0}),
      kG: (x0,x1) => { x0.className = x1 },
      kH: (o, m, a) => o[m].apply(o, a),
      kI: x0 => x0.src,
      kJ: x0 => x0.imageBitmaps,
      kK: x0 => x0.getReader(),
      kL: (wasmFunction,f) => finalizeWrapper(f, function(x0,x1) { return wasmFunction(f,arguments.length,x0,x1) }),
      kM: (x0,x1) => { x0.display = x1 },
      l: o => {
        if (o === undefined || o === null) return 0;
        if (typeof o === 'number') return 1;
        return 2;
      },
      lB: o => {
        if (o === null || o === undefined) return 0;
        if (o instanceof Uint8Array) return 1;
        return 2;
      },
      lC: Function.prototype.call.bind(String.prototype.toLowerCase),
      lD: () => new TextDecoder("utf-8", {fatal: false}),
      lE: x0 => x0.ctrlKey,
      lF: (handle) => clearInterval(handle),
      lG: (x0,x1) => { x0.tabIndex = x1 },
      lH: x0 => x0.iterator,
      lI: (x0,x1) => x0.revokeObjectURL(x1),
      lJ: (x0,x1) => { x0.height = x1 },
      lK: x0 => x0.read(),
      lL: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      lM: x0 => x0.style,
      m: () => globalThis.Math,
      mB: Function.prototype.call.bind(DataView.prototype.setInt32),
      mC: Object.is,
      mD: (a, i, v) => a[i] = v,
      mE: x0 => x0.y,
      mF: (ms, c) =>
      setInterval(() => dartInstance.exports.$invokeCallback(c), ms),
      mG: (x0,x1) => { x0.name = x1 },
      mH: () => globalThis.Symbol,
      mI: (x0,x1) => { x0.src = x1 },
      mJ: (x0,x1) => { x0.width = x1 },
      mK: x0 => x0.value,
      mL: (x0,x1) => ({createScript: x0,createScriptURL: x1}),
      mM: (x0,x1) => { x0.accept = x1 },
      n: (x0,x1) => x0.prepend(x1),
      nB: Function.prototype.call.bind(DataView.prototype.setUint32),
      nC: x0 => x0.vendor,
      nD: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmI8ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      nE: x0 => x0.x,
      nF: () => Date.now(),
      nG: (x0,x1) => { x0.placeholder = x1 },
      nH: (x0,x1) => new Intl.Segmenter(x0,x1),
      nI: (x0,x1,x2,x3,x4) => globalThis.createImageBitmap(x0,x1,x2,x3,x4),
      nJ: x0 => x0.convertToBlob(),
      nK: x0 => x0.done,
      nL: (x0,x1,x2) => x0.createPolicy(x1,x2),
      nM: (x0,x1) => { x0.multiple = x1 },
      o: (x0,x1,x2,x3) => x0.addEventListener(x1,x2,x3),
      oB: Function.prototype.call.bind(DataView.prototype.setInt16),
      oC: (x0,x1) => x0.createTextNode(x1),
      oD: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmI16ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      oE: x0 => x0.scrollTop,
      oF: Function.prototype.call.bind(DataView.prototype.getBigInt64),
      oG: (x0,x1) => { x0.autocomplete = x1 },
      oH: x0 => x0.Segmenter,
      oI: x0 => x0.naturalHeight,
      oJ: (x0,x1,x2) => new ImageData(x0,x1,x2),
      oK: x0 => x0.cancel(),
      oL: (x0,x1) => x0.createScriptURL(x1),
      oM: (x0,x1) => { x0.draggable = x1 },
      p: b => !!b,
      pB: Function.prototype.call.bind(DataView.prototype.setUint16),
      pC: (x0,x1) => { x0.id = x1 },
      pD: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmI32ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      pE: x0 => x0.offsetTop,
      pF: Function.prototype.call.bind(DataView.prototype.setBigInt64),
      pG: (x0,x1) => { x0.name = x1 },
      pH: x0 => x0.buffer,
      pI: x0 => x0.naturalWidth,
      pJ: (x0,x1) => x0.getContext(x1),
      pK: x0 => x0.body,
      pL: (x0,x1,x2) => x0.createScript(x1,x2),
      pM: (x0,x1) => { x0.type = x1 },
      q: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      qB: Function.prototype.call.bind(DataView.prototype.setUint8),
      qC: (x0,x1) => { x0.nonce = x1 },
      qD: x0 => x0.visibilityState,
      qE: x0 => x0.scrollLeft,
      qF: (o, start, length) => new BigInt64Array(o.buffer, o.byteOffset + start, length),
      qG: (x0,x1) => { x0.placeholder = x1 },
      qH: x0 => x0.wasmMemory,
      qI: x0 => x0.decode(),
      qJ: (x0,x1) => new OffscreenCanvas(x0,x1),
      qK: x0 => x0.headers,
      qL: (x0,x1) => x0.appendChild(x1),
      qM: x0 => x0.length,
      r: (x0,x1) => x0.focus(x1),
      rB: Function.prototype.call.bind(DataView.prototype.setInt8),
      rC: x0 => x0.nonce,
      rD: (x0,x1,x2) => x0.removeEventListener(x1,x2),
      rE: x0 => x0.offsetLeft,
      rF: (x0,x1,x2,x3) => x0.pushState(x1,x2,x3),
      rG: (x0,x1) => { x0.action = x1 },
      rH: () => globalThis.window._flutter_skwasmInstance,
      rI: (x0,x1) => { x0.decoding = x1 },
      rJ: x0 => x0.allocationSize(),
      rK: x0 => x0.signal,
      rL: (wasmFunction,f) => finalizeWrapper(f, function(x0) { return wasmFunction(f,arguments.length,x0) }),
      rM: x0 => x0.getReader(),
      s: () => ({}),
      sB: Function.prototype.call.bind(DataView.prototype.getInt8),
      sC: () => globalThis.window.flutterConfiguration,
      sD: x0 => x0.disconnect(),
      sE: x0 => x0.offsetParent,
      sF: x0 => x0.history,
      sG: (x0,x1) => { x0.method = x1 },
      sH: () => new TextDecoder(),
      sI: (x0,x1) => { x0.crossOrigin = x1 },
      sJ: (x0,x1) => x0.copyTo(x1),
      sK: x0 => x0.abort(),
      sL: (o, p) => delete o[p],
      sM: x0 => x0.value,
      t: (o, p, v) => o[p] = v,
      tB: o => {
        if (o === null || o === undefined) return 0;
        if (o instanceof Int8Array) return 1;
        return 2;
      },
      tC: (x0,x1) => x0.attachShadow(x1),
      tD: x0 => new Intl.Locale(x0),
      tE: (o, p, r) => o.replace(p, () => r),
      tF: x0 => x0.search,
      tG: (x0,x1) => { x0.noValidate = x1 },
      tH: (a, i) => a.splice(i, 1),
      tI: (x0,x1) => x0.createObjectURL(x1),
      tJ: (x0,x1) => { x0.height = x1 },
      tK: x0 => x0.canvasKitMaximumSurfaces,
      tL: (o, p, v) => o[p] = v,
      tM: x0 => x0.done,
      u: () => [],
      uB: (o, start, length) => new Float64Array(o.buffer, o.byteOffset + start, length),
      uC: (x0,x1) => x0.createElement(x1),
      uD: x0 => x0.region,
      uE: (o, p, r) => o.replaceAll(p, () => r),
      uF: x0 => x0.location,
      uG: (x0,x1) => x0.removeAttribute(x1),
      uH: a => a.pop(),
      uI: x0 => x0.URL,
      uJ: (x0,x1) => { x0.width = x1 },
      uK: x0 => x0.nextSibling,
      uL: (x0,x1) => { x0.text = x1 },
      uM: x0 => x0.read(),
      v: (a, i) => a.push(i),
      vB: (o, start, length) => new Float32Array(o.buffer, o.byteOffset + start, length),
      vC: x0 => x0.scale,
      vD: x0 => x0.script,
      vE: x0 => x0.deltaMode,
      vF: x0 => x0.pathname,
      vG: x0 => x0.isConnected,
      vH: (map, o, v) => map.set(o, v),
      vI: x0 => new Blob(x0),
      vJ: (x0,x1) => x0.toDataURL(x1),
      vK: (x0,x1) => x0.debug(x1),
      vL: x0 => x0.head,
      vM: x0 => x0.body,
      w: x0 => new Int8Array(x0),
      wB: (o, start, length) => new Uint32Array(o.buffer, o.byteOffset + start, length),
      wC: x0 => x0.visualViewport,
      wD: x0 => x0.language,
      wE: x0 => x0.deltaY,
      wF: (x0,x1,x2,x3) => x0.replaceState(x1,x2,x3),
      wG: x0 => x0.click(),
      wH: (map, o) => map.get(o),
      wI: (x0,x1,x2,x3,x4) => ({type: x0,data: x1,premultiplyAlpha: x2,colorSpaceConversion: x3,preferAnimation: x4}),
      wJ: (x0,x1,x2,x3) => x0.drawImage(x1,x2,x3),
      wK: x0 => x0.hostElement,
      wL: (x0,x1) => { x0.text = x1 },
      wM: x0 => x0.assetBase,
      x: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmI8ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      xB: (o, start, length) => new Int32Array(o.buffer, o.byteOffset + start, length),
      xC: x0 => x0.devicePixelRatio,
      xD: x0 => x0.languages,
      xE: x0 => x0.deltaX,
      xF: o => {
        const proto = Object.getPrototypeOf(o);
        return proto === Object.prototype || proto === null;
      },
      xG: (x0,x1) => x0.getElementsByClassName(x1),
      xH: () => new WeakMap(),
      xI: x0 => new window.ImageDecoder(x0),
      xJ: (x0,x1) => x0.getContext(x1),
      xK: x0 => x0.location,
      xL: x0 => x0.trustedTypes,
      xM: x0 => x0.loader,
      y: x0 => new Uint8Array(x0),
      yB: (o, start, length) => new Uint16Array(o.buffer, o.byteOffset + start, length),
      yC: x0 => x0.height,
      yD: (x0,x1) => x0.observe(x1),
      yE: x0 => x0.wheelDeltaY,
      yF: o => Object.keys(o),
      yG: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmF32ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      yH: x0 => x0.debugSkipFontRetryDelay,
      yI: x0 => x0.name,
      yJ: x0 => x0.format,
      yK: (x0,x1) => x0.getModifierState(x1),
      yL: () => globalThis.console,
      yM: () => globalThis._flutter,
      z: x0 => new Uint8ClampedArray(x0),
      zB: (o, start, length) => new Int16Array(o.buffer, o.byteOffset + start, length),
      zC: x0 => x0.width,
      zD: (wasmFunction,f) => finalizeWrapper(f, function(x0,x1) { return wasmFunction(f,arguments.length,x0,x1) }),
      zE: x0 => x0.wheelDeltaX,
      zF: x0 => x0.state,
      zG: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmF64ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      zH: (x0,x1,x2) => x0.set(x1,x2),
      zI: x0 => x0.repetitionCount,
      zJ: (x0,x1,x2) => x0.insertBefore(x1,x2),
      zK: x0 => x0.metaKey,
      zL: x0 => x0.trustedTypes,

    };

    const baseImports = {
      _: dart2wasm,
      Math: Math,
      Date: Date,
      Object: Object,
      Array: Array,
      Reflect: Reflect,
      WebAssembly: {
        JSTag: WebAssembly.JSTag,
      },
      "": new Proxy({}, { get(_, prop) { return prop; } }),

    };

    const jsStringPolyfill = {
      "charCodeAt": (s, i) => s.charCodeAt(i),
      "compare": (s1, s2) => {
        if (s1 < s2) return -1;
        if (s1 > s2) return 1;
        return 0;
      },
      "concat": (s1, s2) => s1 + s2,
      "equals": (s1, s2) => s1 === s2,
      "fromCharCode": (i) => String.fromCharCode(i),
      "length": (s) => s.length,
      "substring": (s, a, b) => s.substring(a, b),
      "fromCharCodeArray": (a, start, end) => {
        if (end <= start) return '';

        const read = dartInstance.exports.$wasmI16ArrayGet;
        let result = '';
        let index = start;
        const chunkLength = Math.min(end - index, 500);
        let array = new Array(chunkLength);
        while (index < end) {
          const newChunkLength = Math.min(end - index, 500);
          for (let i = 0; i < newChunkLength; i++) {
            array[i] = read(a, index++);
          }
          if (newChunkLength < chunkLength) {
            array = array.slice(0, newChunkLength);
          }
          result += String.fromCharCode(...array);
        }
        return result;
      },
      "intoCharCodeArray": (s, a, start) => {
        if (s === '') return 0;

        const write = dartInstance.exports.$wasmI16ArraySet;
        for (var i = 0; i < s.length; ++i) {
          write(a, start++, s.charCodeAt(i));
        }
        return s.length;
      },
      "test": (s) => typeof s == "string",
    };


    

    dartInstance = await WebAssembly.instantiate(this.module, {
      ...baseImports,
      ...additionalImports,
      
      "wasm:js-string": jsStringPolyfill,
    });

    return new InstantiatedApp(this, dartInstance);
  }
}

class InstantiatedApp {
  constructor(compiledApp, instantiatedModule) {
    this.compiledApp = compiledApp;
    this.instantiatedModule = instantiatedModule;
  }

  // Call the main function with the given arguments.
  invokeMain(...args) {
    this.instantiatedModule.exports.$invokeMain(args);
  }
}
