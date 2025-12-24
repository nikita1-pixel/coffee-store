(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/ssr/[root-of-the-server]__61b293b1._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[turbopack]/browser/dev/hmr-client/hmr-client.ts [app-edge-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/// <reference path="../../../shared/runtime-types.d.ts" />
/// <reference path="../../runtime/base/dev-globals.d.ts" />
/// <reference path="../../runtime/base/dev-protocol.d.ts" />
/// <reference path="../../runtime/base/dev-extensions.ts" />
__turbopack_context__.s([
    "connect",
    ()=>connect,
    "setHooks",
    ()=>setHooks,
    "subscribeToUpdate",
    ()=>subscribeToUpdate
]);
function connect({ addMessageListener, sendMessage, onUpdateError = console.error }) {
    addMessageListener((msg)=>{
        switch(msg.type){
            case 'turbopack-connected':
                handleSocketConnected(sendMessage);
                break;
            default:
                try {
                    if (Array.isArray(msg.data)) {
                        for(let i = 0; i < msg.data.length; i++){
                            handleSocketMessage(msg.data[i]);
                        }
                    } else {
                        handleSocketMessage(msg.data);
                    }
                    applyAggregatedUpdates();
                } catch (e) {
                    console.warn('[Fast Refresh] performing full reload\n\n' + "Fast Refresh will perform a full reload when you edit a file that's imported by modules outside of the React rendering tree.\n" + 'You might have a file which exports a React component but also exports a value that is imported by a non-React component file.\n' + 'Consider migrating the non-React component export to a separate file and importing it into both files.\n\n' + 'It is also possible the parent component of the component you edited is a class component, which disables Fast Refresh.\n' + 'Fast Refresh requires at least one parent function component in your React tree.');
                    onUpdateError(e);
                    location.reload();
                }
                break;
        }
    });
    const queued = globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS;
    if (queued != null && !Array.isArray(queued)) {
        throw new Error('A separate HMR handler was already registered');
    }
    globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS = {
        push: ([chunkPath, callback])=>{
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    };
    if (Array.isArray(queued)) {
        for (const [chunkPath, callback] of queued){
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    }
}
const updateCallbackSets = new Map();
function sendJSON(sendMessage, message) {
    sendMessage(JSON.stringify(message));
}
function resourceKey(resource) {
    return JSON.stringify({
        path: resource.path,
        headers: resource.headers || null
    });
}
function subscribeToUpdates(sendMessage, resource) {
    sendJSON(sendMessage, {
        type: 'turbopack-subscribe',
        ...resource
    });
    return ()=>{
        sendJSON(sendMessage, {
            type: 'turbopack-unsubscribe',
            ...resource
        });
    };
}
function handleSocketConnected(sendMessage) {
    for (const key of updateCallbackSets.keys()){
        subscribeToUpdates(sendMessage, JSON.parse(key));
    }
}
// we aggregate all pending updates until the issues are resolved
const chunkListsWithPendingUpdates = new Map();
function aggregateUpdates(msg) {
    const key = resourceKey(msg.resource);
    let aggregated = chunkListsWithPendingUpdates.get(key);
    if (aggregated) {
        aggregated.instruction = mergeChunkListUpdates(aggregated.instruction, msg.instruction);
    } else {
        chunkListsWithPendingUpdates.set(key, msg);
    }
}
function applyAggregatedUpdates() {
    if (chunkListsWithPendingUpdates.size === 0) return;
    hooks.beforeRefresh();
    for (const msg of chunkListsWithPendingUpdates.values()){
        triggerUpdate(msg);
    }
    chunkListsWithPendingUpdates.clear();
    finalizeUpdate();
}
function mergeChunkListUpdates(updateA, updateB) {
    let chunks;
    if (updateA.chunks != null) {
        if (updateB.chunks == null) {
            chunks = updateA.chunks;
        } else {
            chunks = mergeChunkListChunks(updateA.chunks, updateB.chunks);
        }
    } else if (updateB.chunks != null) {
        chunks = updateB.chunks;
    }
    let merged;
    if (updateA.merged != null) {
        if (updateB.merged == null) {
            merged = updateA.merged;
        } else {
            // Since `merged` is an array of updates, we need to merge them all into
            // one, consistent update.
            // Since there can only be `EcmascriptMergeUpdates` in the array, there is
            // no need to key on the `type` field.
            let update = updateA.merged[0];
            for(let i = 1; i < updateA.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateA.merged[i]);
            }
            for(let i = 0; i < updateB.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateB.merged[i]);
            }
            merged = [
                update
            ];
        }
    } else if (updateB.merged != null) {
        merged = updateB.merged;
    }
    return {
        type: 'ChunkListUpdate',
        chunks,
        merged
    };
}
function mergeChunkListChunks(chunksA, chunksB) {
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    return chunks;
}
function mergeChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted' || updateA.type === 'deleted' && updateB.type === 'added') {
        return undefined;
    }
    if (updateA.type === 'partial') {
        invariant(updateA.instruction, 'Partial updates are unsupported');
    }
    if (updateB.type === 'partial') {
        invariant(updateB.instruction, 'Partial updates are unsupported');
    }
    return undefined;
}
function mergeChunkListEcmascriptMergedUpdates(mergedA, mergedB) {
    const entries = mergeEcmascriptChunkEntries(mergedA.entries, mergedB.entries);
    const chunks = mergeEcmascriptChunksUpdates(mergedA.chunks, mergedB.chunks);
    return {
        type: 'EcmascriptMergedUpdate',
        entries,
        chunks
    };
}
function mergeEcmascriptChunkEntries(entriesA, entriesB) {
    return {
        ...entriesA,
        ...entriesB
    };
}
function mergeEcmascriptChunksUpdates(chunksA, chunksB) {
    if (chunksA == null) {
        return chunksB;
    }
    if (chunksB == null) {
        return chunksA;
    }
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeEcmascriptChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    if (Object.keys(chunks).length === 0) {
        return undefined;
    }
    return chunks;
}
function mergeEcmascriptChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted') {
        // These two completely cancel each other out.
        return undefined;
    }
    if (updateA.type === 'deleted' && updateB.type === 'added') {
        const added = [];
        const deleted = [];
        const deletedModules = new Set(updateA.modules ?? []);
        const addedModules = new Set(updateB.modules ?? []);
        for (const moduleId of addedModules){
            if (!deletedModules.has(moduleId)) {
                added.push(moduleId);
            }
        }
        for (const moduleId of deletedModules){
            if (!addedModules.has(moduleId)) {
                deleted.push(moduleId);
            }
        }
        if (added.length === 0 && deleted.length === 0) {
            return undefined;
        }
        return {
            type: 'partial',
            added,
            deleted
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'partial') {
        const added = new Set([
            ...updateA.added ?? [],
            ...updateB.added ?? []
        ]);
        const deleted = new Set([
            ...updateA.deleted ?? [],
            ...updateB.deleted ?? []
        ]);
        if (updateB.added != null) {
            for (const moduleId of updateB.added){
                deleted.delete(moduleId);
            }
        }
        if (updateB.deleted != null) {
            for (const moduleId of updateB.deleted){
                added.delete(moduleId);
            }
        }
        return {
            type: 'partial',
            added: [
                ...added
            ],
            deleted: [
                ...deleted
            ]
        };
    }
    if (updateA.type === 'added' && updateB.type === 'partial') {
        const modules = new Set([
            ...updateA.modules ?? [],
            ...updateB.added ?? []
        ]);
        for (const moduleId of updateB.deleted ?? []){
            modules.delete(moduleId);
        }
        return {
            type: 'added',
            modules: [
                ...modules
            ]
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'deleted') {
        // We could eagerly return `updateB` here, but this would potentially be
        // incorrect if `updateA` has added modules.
        const modules = new Set(updateB.modules ?? []);
        if (updateA.added != null) {
            for (const moduleId of updateA.added){
                modules.delete(moduleId);
            }
        }
        return {
            type: 'deleted',
            modules: [
                ...modules
            ]
        };
    }
    // Any other update combination is invalid.
    return undefined;
}
function invariant(_, message) {
    throw new Error(`Invariant: ${message}`);
}
const CRITICAL = [
    'bug',
    'error',
    'fatal'
];
function compareByList(list, a, b) {
    const aI = list.indexOf(a) + 1 || list.length;
    const bI = list.indexOf(b) + 1 || list.length;
    return aI - bI;
}
const chunksWithIssues = new Map();
function emitIssues() {
    const issues = [];
    const deduplicationSet = new Set();
    for (const [_, chunkIssues] of chunksWithIssues){
        for (const chunkIssue of chunkIssues){
            if (deduplicationSet.has(chunkIssue.formatted)) continue;
            issues.push(chunkIssue);
            deduplicationSet.add(chunkIssue.formatted);
        }
    }
    sortIssues(issues);
    hooks.issues(issues);
}
function handleIssues(msg) {
    const key = resourceKey(msg.resource);
    let hasCriticalIssues = false;
    for (const issue of msg.issues){
        if (CRITICAL.includes(issue.severity)) {
            hasCriticalIssues = true;
        }
    }
    if (msg.issues.length > 0) {
        chunksWithIssues.set(key, msg.issues);
    } else if (chunksWithIssues.has(key)) {
        chunksWithIssues.delete(key);
    }
    emitIssues();
    return hasCriticalIssues;
}
const SEVERITY_ORDER = [
    'bug',
    'fatal',
    'error',
    'warning',
    'info',
    'log'
];
const CATEGORY_ORDER = [
    'parse',
    'resolve',
    'code generation',
    'rendering',
    'typescript',
    'other'
];
function sortIssues(issues) {
    issues.sort((a, b)=>{
        const first = compareByList(SEVERITY_ORDER, a.severity, b.severity);
        if (first !== 0) return first;
        return compareByList(CATEGORY_ORDER, a.category, b.category);
    });
}
const hooks = {
    beforeRefresh: ()=>{},
    refresh: ()=>{},
    buildOk: ()=>{},
    issues: (_issues)=>{}
};
function setHooks(newHooks) {
    Object.assign(hooks, newHooks);
}
function handleSocketMessage(msg) {
    sortIssues(msg.issues);
    handleIssues(msg);
    switch(msg.type){
        case 'issues':
            break;
        case 'partial':
            // aggregate updates
            aggregateUpdates(msg);
            break;
        default:
            // run single update
            const runHooks = chunkListsWithPendingUpdates.size === 0;
            if (runHooks) hooks.beforeRefresh();
            triggerUpdate(msg);
            if (runHooks) finalizeUpdate();
            break;
    }
}
function finalizeUpdate() {
    hooks.refresh();
    hooks.buildOk();
    // This is used by the Next.js integration test suite to notify it when HMR
    // updates have been completed.
    // TODO: Only run this in test environments (gate by `process.env.__NEXT_TEST_MODE`)
    if (globalThis.__NEXT_HMR_CB) {
        globalThis.__NEXT_HMR_CB();
        globalThis.__NEXT_HMR_CB = null;
    }
}
function subscribeToChunkUpdate(chunkListPath, sendMessage, callback) {
    return subscribeToUpdate({
        path: chunkListPath
    }, sendMessage, callback);
}
function subscribeToUpdate(resource, sendMessage, callback) {
    const key = resourceKey(resource);
    let callbackSet;
    const existingCallbackSet = updateCallbackSets.get(key);
    if (!existingCallbackSet) {
        callbackSet = {
            callbacks: new Set([
                callback
            ]),
            unsubscribe: subscribeToUpdates(sendMessage, resource)
        };
        updateCallbackSets.set(key, callbackSet);
    } else {
        existingCallbackSet.callbacks.add(callback);
        callbackSet = existingCallbackSet;
    }
    return ()=>{
        callbackSet.callbacks.delete(callback);
        if (callbackSet.callbacks.size === 0) {
            callbackSet.unsubscribe();
            updateCallbackSets.delete(key);
        }
    };
}
function triggerUpdate(msg) {
    const key = resourceKey(msg.resource);
    const callbackSet = updateCallbackSets.get(key);
    if (!callbackSet) {
        return;
    }
    for (const callback of callbackSet.callbacks){
        callback(msg);
    }
    if (msg.type === 'notFound') {
        // This indicates that the resource which we subscribed to either does not exist or
        // has been deleted. In either case, we should clear all update callbacks, so if a
        // new subscription is created for the same resource, it will send a new "subscribe"
        // message to the server.
        // No need to send an "unsubscribe" message to the server, it will have already
        // dropped the update stream before sending the "notFound" message.
        updateCallbackSets.delete(key);
    }
}
}),
"[next]/internal/font/google/geist_a71539c9.module.css [app-edge-rsc] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "className": "geist_a71539c9-module__T19VSG__className",
  "variable": "geist_a71539c9-module__T19VSG__variable",
});
}),
"[next]/internal/font/google/geist_a71539c9.js [app-edge-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_a71539c9$2e$module$2e$css__$5b$app$2d$edge$2d$rsc$5d$__$28$css__module$29$__ = __turbopack_context__.i("[next]/internal/font/google/geist_a71539c9.module.css [app-edge-rsc] (css module)");
;
const fontData = {
    className: __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_a71539c9$2e$module$2e$css__$5b$app$2d$edge$2d$rsc$5d$__$28$css__module$29$__["default"].className,
    style: {
        fontFamily: "'Geist', 'Geist Fallback'",
        fontStyle: "normal"
    }
};
if (__TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_a71539c9$2e$module$2e$css__$5b$app$2d$edge$2d$rsc$5d$__$28$css__module$29$__["default"].variable != null) {
    fontData.variable = __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_a71539c9$2e$module$2e$css__$5b$app$2d$edge$2d$rsc$5d$__$28$css__module$29$__["default"].variable;
}
const __TURBOPACK__default__export__ = fontData;
}),
"[next]/internal/font/google/geist_mono_8d43a2aa.module.css [app-edge-rsc] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "className": "geist_mono_8d43a2aa-module__8Li5zG__className",
  "variable": "geist_mono_8d43a2aa-module__8Li5zG__variable",
});
}),
"[next]/internal/font/google/geist_mono_8d43a2aa.js [app-edge-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_mono_8d43a2aa$2e$module$2e$css__$5b$app$2d$edge$2d$rsc$5d$__$28$css__module$29$__ = __turbopack_context__.i("[next]/internal/font/google/geist_mono_8d43a2aa.module.css [app-edge-rsc] (css module)");
;
const fontData = {
    className: __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_mono_8d43a2aa$2e$module$2e$css__$5b$app$2d$edge$2d$rsc$5d$__$28$css__module$29$__["default"].className,
    style: {
        fontFamily: "'Geist Mono', 'Geist Mono Fallback'",
        fontStyle: "normal"
    }
};
if (__TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_mono_8d43a2aa$2e$module$2e$css__$5b$app$2d$edge$2d$rsc$5d$__$28$css__module$29$__["default"].variable != null) {
    fontData.variable = __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_mono_8d43a2aa$2e$module$2e$css__$5b$app$2d$edge$2d$rsc$5d$__$28$css__module$29$__["default"].variable;
}
const __TURBOPACK__default__export__ = fontData;
}),
"[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Navbar.tsx [app-edge-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/PROJECTS/coffee-store/node_modules/next/dist/compiled/react/jsx-dev-runtime.react-server.js [app-edge-rsc] (ecmascript)");
;
const Navbar = ()=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: "bg-white shadow-md",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container mx-auto px-6 py-4 flex items-center flex-nowrap",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container mx-auto px-6 py-4 flex items-center flex-nowrap",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center ",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: "/home",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: "/images/logo.png",
                                alt: "Logo",
                                width: "100",
                                height: "100"
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Navbar.tsx",
                                lineNumber: 12,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Navbar.tsx",
                            lineNumber: 11,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Navbar.tsx",
                        lineNumber: 10,
                        columnNumber: 18
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Navbar.tsx",
                    lineNumber: 9,
                    columnNumber: 12
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: " hidden md:flex items-center space-x-8 max-auto",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: "/",
                            className: "text-gray-600 hover:text-amber-700 transition-colors duration-300 font-medium",
                            children: "Home"
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Navbar.tsx",
                            lineNumber: 18,
                            columnNumber: 17
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: "/coffee",
                            className: "text-gray-600 hover:text-amber-700 transition-colors duration-300 font-medium",
                            children: "Coffee"
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Navbar.tsx",
                            lineNumber: 19,
                            columnNumber: 17
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: "/bakery",
                            className: "text-gray-600 hover:text-amber-700 transition-colors duration-300 font-medium",
                            children: "Bakery"
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Navbar.tsx",
                            lineNumber: 20,
                            columnNumber: 17
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: "/shop",
                            className: "text-gray-600 hover:text-amber-700 transition-colors duration-300 font-medium",
                            children: "Shop"
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Navbar.tsx",
                            lineNumber: 21,
                            columnNumber: 17
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: "/about",
                            className: "text-gray-600 hover:text-amber-700 transition-colors duration-300 font-medium",
                            children: "About"
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Navbar.tsx",
                            lineNumber: 22,
                            columnNumber: 17
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: "/ogin",
                            className: "px-4 py-2 bg-amber-600 text-white rounded-md hover:text-amber-700 transition-colors duration-300 font-medium",
                            children: "Login"
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Navbar.tsx",
                            lineNumber: 23,
                            columnNumber: 17
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Navbar.tsx",
                    lineNumber: 17,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center relative ml-auto",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "text",
                            placeholder: "Search..",
                            className: "pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Navbar.tsx",
                            lineNumber: 27,
                            columnNumber: 17
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400",
                            fill: "none",
                            stroke: "currentColor",
                            viewBox: "0 0 24 24",
                            xmlns: "http://www.w3.org/2000/svg",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeWidth: "2",
                                d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Navbar.tsx",
                                lineNumber: 39,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Navbar.tsx",
                            lineNumber: 32,
                            columnNumber: 17
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Navbar.tsx",
                    lineNumber: 26,
                    columnNumber: 14
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Navbar.tsx",
            lineNumber: 7,
            columnNumber: 12
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Navbar.tsx",
        lineNumber: 6,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = Navbar;
}),
"[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Footer.tsx [app-edge-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/PROJECTS/coffee-store/node_modules/next/dist/compiled/react/jsx-dev-runtime.react-server.js [app-edge-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$image$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/PROJECTS/coffee-store/node_modules/next/dist/esm/api/image.js [app-edge-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$image$2d$external$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/PROJECTS/coffee-store/node_modules/next/dist/esm/shared/lib/image-external.js [app-edge-rsc] (ecmascript)");
;
;
const Footer = ()=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
        className: "bg-white text-black p-8 mt-auto",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container mx-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-between items-start",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-shrink-0",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$image$2d$external$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                src: "/images/logo.png",
                                alt: "Coffee Store Logo",
                                width: 120,
                                height: 50
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Footer.tsx",
                                lineNumber: 13,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Footer.tsx",
                            lineNumber: 12,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex space-x-12",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "font-bold text-lg mb-4",
                                            children: "Privacy"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Footer.tsx",
                                            lineNumber: 19,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                            className: "space-y-2 text-sm text-gray-",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                        href: "/privacy-policy",
                                                        className: "hover:underline",
                                                        children: "Privacy Policy"
                                                    }, void 0, false, {
                                                        fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Footer.tsx",
                                                        lineNumber: 21,
                                                        columnNumber: 25
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Footer.tsx",
                                                    lineNumber: 21,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                        href: "/terms",
                                                        className: "hover:underline",
                                                        children: "Terms of Use"
                                                    }, void 0, false, {
                                                        fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Footer.tsx",
                                                        lineNumber: 22,
                                                        columnNumber: 25
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Footer.tsx",
                                                    lineNumber: 22,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                        href: "/cookies",
                                                        className: "hover:underline",
                                                        children: "Cookies"
                                                    }, void 0, false, {
                                                        fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Footer.tsx",
                                                        lineNumber: 23,
                                                        columnNumber: 25
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Footer.tsx",
                                                    lineNumber: 23,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Footer.tsx",
                                            lineNumber: 20,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Footer.tsx",
                                    lineNumber: 18,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "font-bold text-lg mb-4",
                                            children: "Services"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Footer.tsx",
                                            lineNumber: 27,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                            className: "space-y-2 text-sm text-gray-",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                        href: "/coffee",
                                                        className: "hover:underline",
                                                        children: "Our Coffees"
                                                    }, void 0, false, {
                                                        fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Footer.tsx",
                                                        lineNumber: 29,
                                                        columnNumber: 25
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Footer.tsx",
                                                    lineNumber: 29,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                        href: "/catering",
                                                        className: "hover:underline",
                                                        children: "Catering"
                                                    }, void 0, false, {
                                                        fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Footer.tsx",
                                                        lineNumber: 30,
                                                        columnNumber: 25
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Footer.tsx",
                                                    lineNumber: 30,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                        href: "/shop",
                                                        className: "hover:underline",
                                                        children: "Online Shop"
                                                    }, void 0, false, {
                                                        fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Footer.tsx",
                                                        lineNumber: 31,
                                                        columnNumber: 25
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Footer.tsx",
                                                    lineNumber: 31,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Footer.tsx",
                                            lineNumber: 28,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Footer.tsx",
                                    lineNumber: 26,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "font-bold text-lg mb-4",
                                            children: "About Us"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Footer.tsx",
                                            lineNumber: 35,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                            className: "space-y-2 text-sm text-gray-",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                        href: "/about",
                                                        className: "hover:underline",
                                                        children: "Our Story"
                                                    }, void 0, false, {
                                                        fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Footer.tsx",
                                                        lineNumber: 37,
                                                        columnNumber: 25
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Footer.tsx",
                                                    lineNumber: 37,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                        href: "/careers",
                                                        className: "hover:underline",
                                                        children: "Careers"
                                                    }, void 0, false, {
                                                        fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Footer.tsx",
                                                        lineNumber: 38,
                                                        columnNumber: 25
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Footer.tsx",
                                                    lineNumber: 38,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                        href: "/terms",
                                                        className: "hover:underline",
                                                        children: "Find a Location"
                                                    }, void 0, false, {
                                                        fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Footer.tsx",
                                                        lineNumber: 39,
                                                        columnNumber: 25
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Footer.tsx",
                                                    lineNumber: 39,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Footer.tsx",
                                            lineNumber: 36,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Footer.tsx",
                                    lineNumber: 34,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "font-bold text-lg mb-4",
                                            children: "Information"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Footer.tsx",
                                            lineNumber: 43,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                            className: "space-y-2 text-sm text-gray-",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                        href: "/plans",
                                                        className: "hover:underline",
                                                        children: "Plans & Pricing"
                                                    }, void 0, false, {
                                                        fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Footer.tsx",
                                                        lineNumber: 45,
                                                        columnNumber: 25
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Footer.tsx",
                                                    lineNumber: 45,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                        href: "/products",
                                                        className: "hover:underline",
                                                        children: "Sell your Products"
                                                    }, void 0, false, {
                                                        fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Footer.tsx",
                                                        lineNumber: 46,
                                                        columnNumber: 25
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Footer.tsx",
                                                    lineNumber: 46,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                        href: "/jobs",
                                                        className: "hover:underline",
                                                        children: "Jobs"
                                                    }, void 0, false, {
                                                        fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Footer.tsx",
                                                        lineNumber: 47,
                                                        columnNumber: 25
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Footer.tsx",
                                                    lineNumber: 47,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Footer.tsx",
                                            lineNumber: 44,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Footer.tsx",
                                    lineNumber: 42,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Footer.tsx",
                            lineNumber: 17,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "font-bold text-lg mb-4",
                                    children: "Follow Us"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Footer.tsx",
                                    lineNumber: 54,
                                    columnNumber: 18
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex space-x-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: "https://instagram.com",
                                            target: "_blank",
                                            rel: "noopener noreferrer",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$image$2d$external$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                                src: "/images/instaa.png",
                                                alt: "Instagram",
                                                width: 24,
                                                height: 24
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Footer.tsx",
                                                lineNumber: 57,
                                                columnNumber: 22
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Footer.tsx",
                                            lineNumber: 56,
                                            columnNumber: 20
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: "https://linkedin.com",
                                            target: "_blank",
                                            rel: "noopener noreferrer",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$image$2d$external$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                                src: "/images/linkedin.png",
                                                alt: "linkedin",
                                                width: 24,
                                                height: 24
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Footer.tsx",
                                                lineNumber: 60,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Footer.tsx",
                                            lineNumber: 59,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: "https://youtube.com",
                                            target: "_blank",
                                            rel: "noopener noreferrer",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$image$2d$external$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                                src: "/images/YouTube,.png",
                                                alt: "youtube",
                                                width: 24,
                                                height: 24
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Footer.tsx",
                                                lineNumber: 63,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Footer.tsx",
                                            lineNumber: 62,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: "https://telegram.com",
                                            target: "_blank",
                                            rel: "noopener noreferrer",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$image$2d$external$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                                src: "/images/Telegram.png",
                                                alt: "telegram",
                                                width: 24,
                                                height: 24
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Footer.tsx",
                                                lineNumber: 66,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Footer.tsx",
                                            lineNumber: 65,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Footer.tsx",
                                    lineNumber: 55,
                                    columnNumber: 18
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Footer.tsx",
                            lineNumber: 53,
                            columnNumber: 16
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Footer.tsx",
                    lineNumber: 9,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center mt-8 border-t border-gray-700 pt-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "© ",
                            new Date().getFullYear(),
                            " Coffee Store. All rights reserved."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Footer.tsx",
                        lineNumber: 75,
                        columnNumber: 15
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Footer.tsx",
                    lineNumber: 74,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Footer.tsx",
            lineNumber: 7,
            columnNumber: 12
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Footer.tsx",
        lineNumber: 6,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = Footer;
}),
"[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/AuthProvider.tsx [app-edge-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$server$2d$dom$2d$turbopack$2f$server$2e$edge$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/PROJECTS/coffee-store/node_modules/next/dist/compiled/react-server-dom-turbopack/server.edge.js [app-edge-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$server$2d$dom$2d$turbopack$2f$server$2e$edge$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/AuthProvider.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/AuthProvider.tsx <module evaluation>", "default");
}),
"[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/AuthProvider.tsx [app-edge-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$server$2d$dom$2d$turbopack$2f$server$2e$edge$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/PROJECTS/coffee-store/node_modules/next/dist/compiled/react-server-dom-turbopack/server.edge.js [app-edge-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$server$2d$dom$2d$turbopack$2f$server$2e$edge$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/AuthProvider.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/AuthProvider.tsx", "default");
}),
"[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/AuthProvider.tsx [app-edge-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$src$2f$components$2f$AuthProvider$2e$tsx__$5b$app$2d$edge$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/AuthProvider.tsx [app-edge-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$src$2f$components$2f$AuthProvider$2e$tsx__$5b$app$2d$edge$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/AuthProvider.tsx [app-edge-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$src$2f$components$2f$AuthProvider$2e$tsx__$5b$app$2d$edge$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/app/layout.tsx [app-edge-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RootLayout,
    "metadata",
    ()=>metadata
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/PROJECTS/coffee-store/node_modules/next/dist/compiled/react/jsx-dev-runtime.react-server.js [app-edge-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_a71539c9$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[next]/internal/font/google/geist_a71539c9.js [app-edge-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_mono_8d43a2aa$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[next]/internal/font/google/geist_mono_8d43a2aa.js [app-edge-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$src$2f$components$2f$Navbar$2e$tsx__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Navbar.tsx [app-edge-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$src$2f$components$2f$Footer$2e$tsx__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/Footer.tsx [app-edge-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$src$2f$components$2f$AuthProvider$2e$tsx__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/AuthProvider.tsx [app-edge-rsc] (ecmascript)");
;
;
;
;
;
;
;
const metadata = {
    title: "coffee-store",
    description: "A coffee store built with Next.js"
};
function RootLayout({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("html", {
        lang: "en",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("body", {
            className: `${__TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_a71539c9$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["default"].variable} ${__TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$geist_mono_8d43a2aa$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["default"].variable} antialiased`,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$src$2f$components$2f$AuthProvider$2e$tsx__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$src$2f$components$2f$Navbar$2e$tsx__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/app/layout.tsx",
                        lineNumber: 35,
                        columnNumber: 9
                    }, this),
                    children,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$src$2f$components$2f$Footer$2e$tsx__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/app/layout.tsx",
                        lineNumber: 37,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/app/layout.tsx",
                lineNumber: 34,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/app/layout.tsx",
            lineNumber: 31,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/app/layout.tsx",
        lineNumber: 30,
        columnNumber: 5
    }, this);
}
}),
"[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/app/layout.tsx [app-edge-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/app/layout.tsx [app-edge-rsc] (ecmascript)"));
}),
"[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/MiniMenu.tsx [app-edge-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/PROJECTS/coffee-store/node_modules/next/dist/compiled/react/jsx-dev-runtime.react-server.js [app-edge-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$image$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/PROJECTS/coffee-store/node_modules/next/dist/esm/api/image.js [app-edge-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$image$2d$external$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/PROJECTS/coffee-store/node_modules/next/dist/esm/shared/lib/image-external.js [app-edge-rsc] (ecmascript)");
;
;
const MiniMenu = ()=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex space-x-6  p-6 justify-center bg-white  backdrop-blur-sm",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                href: "/hot-coffee",
                className: "flex flex-col items-center px-4 py-3  text-amber-900 text-lg font-medium rounded-md shadow-md hover:bg-amber-600 transition-all duration-200",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$image$2d$external$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                        src: "/images/hotcoffee.png",
                        alt: "Hot Coffee Icon",
                        width: 64,
                        height: 64,
                        className: "mb-2"
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/MiniMenu.tsx",
                        lineNumber: 9,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    "Hot Coffee"
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/MiniMenu.tsx",
                lineNumber: 8,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                href: "/cold-coffee",
                className: "flex flex-col items-center px-4 py-3  text-amber-900 text-lg font-medium rounded-md shadow-md hover:bg-amber-600 transition-all duration-200",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$image$2d$external$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                        src: "/images/coldcoffee.png",
                        alt: "Cold Coffee Icon",
                        width: 64,
                        height: 64,
                        className: "mb-2"
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/MiniMenu.tsx",
                        lineNumber: 15,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    "Cold Coffee"
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/MiniMenu.tsx",
                lineNumber: 14,
                columnNumber: 11
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                href: "/cup-coffee",
                className: "flex flex-col items-center px-4 py-3  text-amber-900 text-lg font-medium rounded-md shadow-md hover:bg-amber-600 transition-all duration-200",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$image$2d$external$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                        src: "/images/cup coffee.png",
                        alt: "Cup Coffee Icon",
                        width: 64,
                        height: 64,
                        className: "mb-2"
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/MiniMenu.tsx",
                        lineNumber: 21,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    "Cup Coffee"
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/MiniMenu.tsx",
                lineNumber: 20,
                columnNumber: 11
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                href: "/dessert",
                className: "flex flex-col items-center px-4 py-3  text-amber-900 text-lg font-medium rounded-md shadow-md hover:bg-amber-600 transition-all duration-200",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$esm$2f$shared$2f$lib$2f$image$2d$external$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                        src: "/images/dessert.png",
                        alt: "Dessert Icon",
                        width: 64,
                        height: 64,
                        className: "mb-2"
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/MiniMenu.tsx",
                        lineNumber: 27,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "",
                        children: "Dessert"
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/MiniMenu.tsx",
                        lineNumber: 28,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/MiniMenu.tsx",
                lineNumber: 26,
                columnNumber: 11
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/MiniMenu.tsx",
        lineNumber: 5,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = MiniMenu;
}),
"[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/CardList.tsx [app-edge-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/PROJECTS/coffee-store/node_modules/next/dist/compiled/react/jsx-dev-runtime.react-server.js [app-edge-rsc] (ecmascript)");
;
// Placeholder data for our cards
const coffeeData = [
    {
        id: 1,
        title: "Espresso Con Panna",
        description: "A rich shot of espresso topped with a dollop of whipped cream.",
        image: "/images/conpana.png"
    },
    {
        id: 2,
        title: "Caramel Macchiato",
        description: "Steamed milk with vanilla, marked with espresso and caramel.",
        image: "/images/conpana.png"
    },
    {
        id: 3,
        title: "Iced Cold Brew",
        description: "Slow-steeped, super-smooth cold brew, served over ice.",
        image: "/images/conpana.png"
    },
    {
        id: 4,
        title: "Classic Tiramisu",
        description: "A coffee-flavoured Italian dessert. A true classic.",
        image: "/images/conpana.png"
    },
    {
        id: 5,
        title: "Cup of Coffee",
        description: "A simple, elegant cup of our finest house blend coffee.",
        image: "/images/conpana.png"
    },
    {
        id: 6,
        title: "Affogato",
        description: "A scoop of vanilla ice cream drowned in hot espresso.",
        image: "/images/conpana.png"
    }
];
const CardList = ()=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-white w-full py-12",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container mx-auto p-4  bg-amber-50 py-12",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-3xl font-bold text-center text-amber-800 mb-8",
                    children: "Our Suggested Items"
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/CardList.tsx",
                    lineNumber: 47,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center text-black",
                    children: coffeeData.map((coffee)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "card  w-96 shadow-md border border-amber-400 h-full fle   flex-col",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("figure", {
                                    className: "h-48 w-full overflow- text-black",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: coffee.image,
                                        alt: coffee.title,
                                        className: "w-full h-full object-cover"
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/CardList.tsx",
                                        lineNumber: 54,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/CardList.tsx",
                                    lineNumber: 53,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "card-body flex-grow justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "card-title text-xl",
                                            children: coffee.title
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/CardList.tsx",
                                            lineNumber: 61,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm flex-grow",
                                            children: coffee.description
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/CardList.tsx",
                                            lineNumber: 62,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "card-actions justify-end mt-4",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "btn btn-primary bg-amber-600 border-none text-white hover:bg-amber-700",
                                                children: "Order Now"
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/CardList.tsx",
                                                lineNumber: 65,
                                                columnNumber: 20
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/CardList.tsx",
                                            lineNumber: 64,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/CardList.tsx",
                                    lineNumber: 60,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, coffee.id, true, {
                            fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/CardList.tsx",
                            lineNumber: 51,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0)))
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/CardList.tsx",
                    lineNumber: 49,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/CardList.tsx",
            lineNumber: 46,
            columnNumber: 9
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/CardList.tsx",
        lineNumber: 45,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = CardList;
}),
"[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/app/(main)/layout.tsx [app-edge-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MainPagesLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/PROJECTS/coffee-store/node_modules/next/dist/compiled/react/jsx-dev-runtime.react-server.js [app-edge-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$src$2f$components$2f$MiniMenu$2e$tsx__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/MiniMenu.tsx [app-edge-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$src$2f$components$2f$CardList$2e$tsx__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/components/CardList.tsx [app-edge-rsc] (ecmascript)");
;
;
;
function MainPagesLayout({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
            children: [
                children,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$src$2f$components$2f$MiniMenu$2e$tsx__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/app/(main)/layout.tsx",
                    lineNumber: 15,
                    columnNumber: 10
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$src$2f$components$2f$CardList$2e$tsx__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/app/(main)/layout.tsx",
                    lineNumber: 16,
                    columnNumber: 10
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/app/(main)/layout.tsx",
            lineNumber: 12,
            columnNumber: 8
        }, this)
    }, void 0, false);
}
}),
"[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/app/(main)/layout.tsx [app-edge-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/app/(main)/layout.tsx [app-edge-rsc] (ecmascript)"));
}),
"[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/app/(main)/page.tsx [app-edge-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "dynamic",
    ()=>dynamic,
    "metadata",
    ()=>metadata,
    "preferredRegion",
    ()=>preferredRegion,
    "revalidate",
    ()=>revalidate,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/PROJECTS/coffee-store/node_modules/next/dist/compiled/react/jsx-dev-runtime.react-server.js [app-edge-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/PROJECTS/coffee-store/node_modules/next/dist/esm/api/navigation.react-server.js [app-edge-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/PROJECTS/coffee-store/node_modules/next/dist/esm/api/navigation.react-server.js [app-edge-rsc] (ecmascript)");
;
;
const handleNavigation = (path)=>{
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["useRouter"])();
    router.push(path);
};
;
const metadata = {
    title: "Coffee Store",
    description: "Discover the best coffee in town!"
};
const dynamic = "force-dynamic";
const revalidate = 0;
const runtime = "edge";
const preferredRegion = "auto";
const CoffeeStorePage = ()=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex min-h-screen flex-col items-center bg-[url('/images/espresso-bg.png')] bg-cover p-8",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
            className: "relative flex flex-col md:flex-row items-center px-12 py-16 max-w-7xl mx-auto min-h-[75vh]",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "z-10 w-full md:w-1/2 space-y-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-xs uppercase tracking-[0.3em] text-gray-400 block mb-2",
                            children: "Welcome"
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/app/(main)/page.tsx",
                            lineNumber: 37,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-5xl md:text-7xl font-serif leading-tight",
                            children: [
                                "We serve the ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/app/(main)/page.tsx",
                                    lineNumber: 39,
                                    columnNumber: 26
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "italic font-light",
                                    children: "richest coffee"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/app/(main)/page.tsx",
                                    lineNumber: 40,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                " in ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/app/(main)/page.tsx",
                                    lineNumber: 40,
                                    columnNumber: 74
                                }, ("TURBOPACK compile-time value", void 0)),
                                "the city!"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/app/(main)/page.tsx",
                            lineNumber: 38,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-400 max-w-sm leading-relaxed text-sm md:text-base",
                            children: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore."
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/app/(main)/page.tsx",
                            lineNumber: 43,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>handleNavigation('/order'),
                            className: "mt-4 px-10 py-3 bg-white text-black font-bold rounded-full hover:bg-amber-500 hover:text-white transition-all duration-300 shadow-xl",
                            children: "Order Now"
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/app/(main)/page.tsx",
                            lineNumber: 46,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/app/(main)/page.tsx",
                    lineNumber: 36,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute right-0 top-0 w-full h-full md:w-[60%] pointer-events-none",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$react$2d$server$2e$js__$5b$app$2d$edge$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: "/coffee-hero.png",
                        alt: "Latte art with coffee beans",
                        className: "w-full h-full object-contain object-right"
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/app/(main)/page.tsx",
                        lineNumber: 54,
                        columnNumber: 12
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/app/(main)/page.tsx",
                    lineNumber: 53,
                    columnNumber: 5
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/app/(main)/page.tsx",
            lineNumber: 34,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/app/(main)/page.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = CoffeeStorePage;
}),
"[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/app/(main)/page.tsx [app-edge-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/app/(main)/page.tsx [app-edge-rsc] (ecmascript)"));
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__61b293b1._.js.map