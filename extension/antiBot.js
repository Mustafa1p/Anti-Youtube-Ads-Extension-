/**
 * Anti-Bot Detection Script
 * 
 * This script MUST run before any other scripts to spoof browser fingerprints
 * and hide automation/extension indicators that YouTube uses to detect bots.
 * 
 * Runs at document_start in MAIN world.
 */
(() => {
    "use strict";

    // ============================================
    // 1. WEBDRIVER DETECTION BYPASS
    // ============================================

    // Hide navigator.webdriver (set by automation tools and sometimes extensions)
    try {
        Object.defineProperty(navigator, 'webdriver', {
            get: () => undefined,
            configurable: true
        });
    } catch (e) {
        // Fallback: delete if possible
        delete navigator.webdriver;
    }

    // ============================================
    // 2. AUTOMATION PROPERTY HIDING
    // ============================================

    // Properties that indicate automation tools
    const automationProps = [
        'callPhantom', '_phantom', '__nightmare', 'phantom',
        'domAutomation', 'domAutomationController',
        '_selenium', '_Selenium_IDE_Recorder',
        '__webdriver_script_fn', '__driver_evaluate',
        '__webdriver_evaluate', '__lastWatirAlert',
        '__lastWatirConfirm', '__lastWatirPrompt',
        '_WEBDRIVER_ELEM_CACHE', 'ChromeDriverw',
        '__$webdriverAsyncExecutor', 'webdriver',
        '__webdriver_unwrapped', '__isWebDriverActive',
        '$cdc_asdjflasutopfhvcZLmcfl_', '$chrome_asyncScriptInfo',
        '__driver_unwrapped', 'calledSelenium',
        '$wdc_', 'spawned', '__nightmare'
    ];

    automationProps.forEach(prop => {
        try {
            if (prop in window) {
                delete window[prop];
            }
            Object.defineProperty(window, prop, {
                get: () => undefined,
                set: () => { },
                configurable: true
            });
        } catch (e) {
            // Some properties can't be modified
        }
    });

    // Hide document automation properties
    const docProps = ['$cdc_asdjflasutopfhvcZLmcfl_', '__webdriver_script_fn'];
    docProps.forEach(prop => {
        try {
            Object.defineProperty(document, prop, {
                get: () => undefined,
                configurable: true
            });
        } catch (e) { }
    });

    // ============================================
    // 3. CHROME DETECTION SPOOFING
    // ============================================

    // Ensure chrome object looks normal (not headless/automated)
    if (window.chrome) {
        try {
            // Make sure chrome.runtime exists and looks normal
            if (!window.chrome.runtime) {
                window.chrome.runtime = {};
            }

            // Spoof chrome.csi (timing info)
            if (!window.chrome.csi) {
                window.chrome.csi = function () {
                    return {
                        onloadT: Date.now(),
                        startE: Date.now() - Math.floor(Math.random() * 1000),
                        pageT: Math.random() * 1000 + 500,
                        tran: 15
                    };
                };
            }

            // Spoof chrome.loadTimes (deprecated but still checked)
            if (!window.chrome.loadTimes) {
                window.chrome.loadTimes = function () {
                    return {
                        commitLoadTime: Date.now() / 1000,
                        connectionInfo: "h2",
                        finishDocumentLoadTime: Date.now() / 1000,
                        finishLoadTime: Date.now() / 1000,
                        firstPaintAfterLoadTime: 0,
                        firstPaintTime: Date.now() / 1000 - Math.random(),
                        navigationType: "Other",
                        npnNegotiatedProtocol: "h2",
                        requestTime: Date.now() / 1000 - Math.random() * 2,
                        startLoadTime: Date.now() / 1000 - Math.random() * 3,
                        wasAlternateProtocolAvailable: false,
                        wasFetchedViaSpdy: true,
                        wasNpnNegotiated: true
                    };
                };
            }
        } catch (e) { }
    }

    // ============================================
    // 4. NAVIGATOR PROPERTIES SPOOFING
    // ============================================

    // Spoof plugins to look like a real browser
    try {
        const mockPlugins = {
            0: { name: 'Chrome PDF Viewer', filename: 'internal-pdf-viewer', description: 'Portable Document Format' },
            1: { name: 'Chrome PDF Plugin', filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai', description: 'Portable Document Format' },
            2: { name: 'Native Client', filename: 'internal-nacl-plugin', description: '' },
            length: 3,
            item: function (index) { return this[index] || null; },
            namedItem: function (name) {
                for (let i = 0; i < this.length; i++) {
                    if (this[i].name === name) return this[i];
                }
                return null;
            },
            refresh: function () { }
        };

        Object.defineProperty(navigator, 'plugins', {
            get: () => mockPlugins,
            configurable: true
        });
    } catch (e) { }

    // Spoof languages
    try {
        Object.defineProperty(navigator, 'languages', {
            get: () => ['en-US', 'en'],
            configurable: true
        });
    } catch (e) { }

    // Spoof hardwareConcurrency (don't expose real CPU count)
    try {
        const cores = [4, 8, 12, 16][Math.floor(Math.random() * 4)];
        Object.defineProperty(navigator, 'hardwareConcurrency', {
            get: () => cores,
            configurable: true
        });
    } catch (e) { }

    // Spoof deviceMemory to common value
    try {
        Object.defineProperty(navigator, 'deviceMemory', {
            get: () => 8,
            configurable: true
        });
    } catch (e) { }

    // ============================================
    // 5. PERMISSIONS API SPOOFING
    // ============================================

    // Make permissions.query return normal-looking responses
    if (navigator.permissions && navigator.permissions.query) {
        const originalQuery = navigator.permissions.query.bind(navigator.permissions);
        navigator.permissions.query = function (parameters) {
            // Return 'prompt' for notification (bots often have 'denied')
            if (parameters.name === 'notifications') {
                return Promise.resolve({ state: 'prompt', onchange: null });
            }
            return originalQuery(parameters);
        };
    }

    // ============================================
    // 6. USER AGENT DATA SPOOFING (Client Hints)
    // ============================================

    if (navigator.userAgentData) {
        try {
            const brands = [
                { brand: "Google Chrome", version: "120" },
                { brand: "Chromium", version: "120" },
                { brand: "Not_A Brand", version: "8" }
            ];

            Object.defineProperty(navigator, 'userAgentData', {
                get: () => ({
                    brands: brands,
                    mobile: false,
                    platform: "Windows",
                    getHighEntropyValues: (hints) => {
                        return Promise.resolve({
                            brands: brands,
                            mobile: false,
                            platform: "Windows",
                            platformVersion: "15.0.0",
                            architecture: "x86",
                            bitness: "64",
                            model: "",
                            uaFullVersion: "120.0.6099.130",
                            fullVersionList: brands
                        });
                    },
                    toJSON: () => ({ brands, mobile: false, platform: "Windows" })
                }),
                configurable: true
            });
        } catch (e) { }
    }

    // ============================================
    // 7. CANVAS FINGERPRINT PROTECTION
    // ============================================

    // Add subtle noise to canvas to defeat fingerprinting while staying consistent
    const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
    const originalGetImageData = CanvasRenderingContext2D.prototype.getImageData;

    // Use session-stable noise seed
    const noiseSeed = Math.random() * 0.01;

    HTMLCanvasElement.prototype.toDataURL = function (...args) {
        const ctx = this.getContext('2d');
        if (ctx && this.width > 0 && this.height > 0) {
            try {
                // Add very subtle invisible noise
                const imageData = ctx.getImageData(0, 0, Math.min(this.width, 10), Math.min(this.height, 10));
                imageData.data[0] = (imageData.data[0] + Math.floor(noiseSeed * 256)) % 256;
                ctx.putImageData(imageData, 0, 0);
            } catch (e) {
                // Canvas may be tainted, ignore
            }
        }
        return originalToDataURL.apply(this, args);
    };

    // ============================================
    // 8. WEBGL FINGERPRINT PROTECTION
    // ============================================

    const getParameterProto = WebGLRenderingContext.prototype.getParameter;
    WebGLRenderingContext.prototype.getParameter = function (parameter) {
        // Spoof vendor and renderer to common values
        if (parameter === 37445) { // UNMASKED_VENDOR_WEBGL
            return 'Google Inc. (NVIDIA)';
        }
        if (parameter === 37446) { // UNMASKED_RENDERER_WEBGL
            return 'ANGLE (NVIDIA, NVIDIA GeForce GTX 1080 Direct3D11 vs_5_0 ps_5_0, D3D11)';
        }
        return getParameterProto.apply(this, arguments);
    };

    // Also handle WebGL2
    if (typeof WebGL2RenderingContext !== 'undefined') {
        const getParameter2Proto = WebGL2RenderingContext.prototype.getParameter;
        WebGL2RenderingContext.prototype.getParameter = function (parameter) {
            if (parameter === 37445) {
                return 'Google Inc. (NVIDIA)';
            }
            if (parameter === 37446) {
                return 'ANGLE (NVIDIA, NVIDIA GeForce GTX 1080 Direct3D11 vs_5_0 ps_5_0, D3D11)';
            }
            return getParameter2Proto.apply(this, arguments);
        };
    }

    // ============================================
    // 9. TIMING ATTACK PROTECTION
    // ============================================

    // Add micro-jitter to performance.now() to prevent timing analysis
    const originalPerformanceNow = performance.now.bind(performance);
    const jitterRange = 0.1; // Max jitter in ms

    performance.now = function () {
        const realTime = originalPerformanceNow();
        // Add consistent but varying jitter based on the time
        const jitter = (Math.sin(realTime * 0.001) + 1) * jitterRange * 0.5;
        return realTime + jitter;
    };

    // ============================================
    // 10. IFRAME/FRAME DETECTION PREVENTION
    // ============================================

    // Make sure we look like a top-level window
    try {
        if (window.self === window.top) {
            Object.defineProperty(window, 'frameElement', {
                get: () => null,
                configurable: true
            });
        }
    } catch (e) { }

    // ============================================
    // 11. SCREEN PROPERTIES NORMALIZATION
    // ============================================

    // Ensure screen properties look normal (headless browsers often have odd values)
    try {
        const screenProps = {
            availWidth: screen.width,
            availHeight: screen.height - 40, // Account for taskbar
            availLeft: 0,
            availTop: 0,
            colorDepth: 24,
            pixelDepth: 24
        };

        Object.keys(screenProps).forEach(prop => {
            try {
                Object.defineProperty(screen, prop, {
                    get: () => screenProps[prop],
                    configurable: true
                });
            } catch (e) { }
        });
    } catch (e) { }

    // ============================================
    // 12. MEDIA DEVICES SPOOFING
    // ============================================

    // Ensure mediaDevices.enumerateDevices returns something (bots often have empty)
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        const originalEnumerate = navigator.mediaDevices.enumerateDevices.bind(navigator.mediaDevices);
        navigator.mediaDevices.enumerateDevices = async function () {
            const devices = await originalEnumerate();
            // If no devices found, return fake ones
            if (devices.length === 0) {
                return [
                    { deviceId: 'default', groupId: 'default', kind: 'audioinput', label: '' },
                    { deviceId: 'default', groupId: 'default', kind: 'videoinput', label: '' },
                    { deviceId: 'default', groupId: 'default', kind: 'audiooutput', label: '' }
                ];
            }
            return devices;
        };
    }

    // ============================================
    // 13. BATTERY API PROTECTION
    // ============================================

    // Remove or spoof getBattery (used for fingerprinting)
    try {
        if (navigator.getBattery) {
            navigator.getBattery = function () {
                return Promise.resolve({
                    charging: true,
                    chargingTime: 0,
                    dischargingTime: Infinity,
                    level: 1.0,
                    addEventListener: () => { },
                    removeEventListener: () => { }
                });
            };
        }
    } catch (e) { }

    // ============================================
    // 14. ERROR STACK TRACE SANITIZATION
    // ============================================

    // YouTube may analyze error stacks to detect extensions
    const originalError = Error;
    window.Error = function (...args) {
        const error = new originalError(...args);
        // Clean extension-related paths from stack
        if (error.stack) {
            error.stack = error.stack.replace(/chrome-extension:\/\/[^\s]+/g, '');
        }
        return error;
    };
    window.Error.prototype = originalError.prototype;

    // ============================================
    // 15. MUTATION OBSERVER TIMING PROTECTION
    // ============================================

    // YouTube may detect how fast MutationObserver callbacks fire
    const OriginalMutationObserver = window.MutationObserver;
    window.MutationObserver = function (callback) {
        const wrappedCallback = function (mutations, observer) {
            // Add tiny random delay to look more human
            const delay = Math.random() * 2;
            if (delay > 1) {
                setTimeout(() => callback(mutations, observer), delay);
            } else {
                callback(mutations, observer);
            }
        };
        return new OriginalMutationObserver(wrappedCallback);
    };
    window.MutationObserver.prototype = OriginalMutationObserver.prototype;

    console.info('[IPTUBE-X] Anti-bot protections enabled');
})();
