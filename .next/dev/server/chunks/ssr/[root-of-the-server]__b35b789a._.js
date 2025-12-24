module.exports = [
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/app/coffee/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/PROJECTS/coffee-store/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
;
const coffeeData = [
    {
        id: '1',
        name: 'Classic Cappuccino',
        description: 'A rich and creamy cappuccino with a perfect balance of espresso, steamed milk, and froth.',
        imageUrl: './images/latte.png',
        price: 2.5,
        isBestSeller: true,
        customizations: {
            size: {
                type: 'radio',
                options: [
                    {
                        label: 'Small',
                        price: 0
                    },
                    {
                        label: 'Medium',
                        price: 0.5
                    },
                    {
                        label: 'Large',
                        price: 1
                    }
                ]
            },
            milk: {
                type: 'radio',
                options: [
                    {
                        label: 'None',
                        price: 0
                    },
                    {
                        label: 'Soy',
                        price: 0.25
                    },
                    {
                        label: 'Almond',
                        price: 0.5
                    }
                ]
            },
            sugar: {
                type: 'radio',
                options: [
                    {
                        label: 'None',
                        price: 0
                    },
                    {
                        label: '1Spoon',
                        price: 0.25
                    },
                    {
                        label: '2Spoon',
                        price: 0.5
                    }
                ]
            }
        }
    },
    {
        id: '2',
        name: 'Vanilla Latte',
        description: 'A smooth latte infused with vanilla syrup, topped with a light layer of foam.',
        imageUrl: '/images/latte.png',
        price: 2.5,
        isBestSeller: false,
        customizations: {
            size: {
                type: 'radio',
                options: [
                    {
                        label: 'Small',
                        price: 0
                    },
                    {
                        label: 'Medium',
                        price: 0.5
                    },
                    {
                        label: 'Large',
                        price: 1
                    }
                ]
            },
            milk: {
                type: 'radio',
                options: [
                    {
                        label: 'None',
                        price: 0
                    },
                    {
                        label: 'Soy',
                        price: 0.25
                    },
                    {
                        label: 'Almond',
                        price: 0.5
                    }
                ]
            },
            sugar: {
                type: 'radio',
                options: [
                    {
                        label: 'None',
                        price: 0
                    },
                    {
                        label: '1Spoon',
                        price: 0.25
                    },
                    {
                        label: '2Spoon',
                        price: 0.5
                    }
                ]
            }
        }
    },
    {
        id: '3',
        name: 'Mocha Frappe',
        description: 'A blended iced coffee drink with chocolate syrup, topped with whipped cream.',
        imageUrl: '/images/frappe.png',
        price: 3.0,
        isBestSeller: true,
        customizations: {
            size: {
                type: 'radio',
                options: [
                    {
                        label: 'Small',
                        price: 0
                    },
                    {
                        label: 'Medium',
                        price: 0.5
                    },
                    {
                        label: 'Large',
                        price: 1
                    }
                ]
            },
            milk: {
                type: 'radio',
                options: [
                    {
                        label: 'None',
                        price: 0
                    },
                    {
                        label: 'Soy',
                        price: 0.25
                    },
                    {
                        label: 'Almond',
                        price: 0.5
                    }
                ]
            },
            sugar: {
                type: 'radio',
                options: [
                    {
                        label: 'None',
                        price: 0
                    },
                    {
                        label: '1Spoon',
                        price: 0.25
                    },
                    {
                        label: '2Spoon',
                        price: 0.5
                    }
                ]
            }
        }
    }
];
const CoffeePage = ()=>{
    const bestsellers = coffeeData.filter((coffee)=>coffee.isBestSeller);
    const others = coffeeData.filter((coffee)=>!coffee.isBestSeller);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "min-h-screen bg-white text-black ",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container mx-auto px-4 py-12",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                    className: "mb-12 text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-5xl font-extrabold text-amber-900 font-serif",
                            children: "Our Coffee Selections"
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/app/coffee/page.tsx",
                            lineNumber: 138,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-4 text-lg text-gray-600",
                            children: "HandCrafted with passion, brewed to perfection. Explore our exclusive range of coffees, each cup tells a story of dedication and flavor."
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/app/coffee/page.tsx",
                            lineNumber: 141,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/app/coffee/page.tsx",
                    lineNumber: 137,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-3xl font-bold mb-8 border-l-4 border-amber-500 pl-4",
                            children: "Our Bestsellers"
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/app/coffee/page.tsx",
                            lineNumber: 146,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
                            children: bestsellers.map((coffee)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-white text-black p-4 rounded-lg shadow-md",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: coffee.name
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/app/coffee/page.tsx",
                                        lineNumber: 152,
                                        columnNumber: 33
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, coffee.id, false, {
                                    fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/app/coffee/page.tsx",
                                    lineNumber: 151,
                                    columnNumber: 29
                                }, ("TURBOPACK compile-time value", void 0)))
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/app/coffee/page.tsx",
                            lineNumber: 149,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/app/coffee/page.tsx",
                    lineNumber: 145,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-3xl font-bold mb-8 border-l-4 border-amber-500 pl-4",
                            children: "Full Menu"
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/app/coffee/page.tsx",
                            lineNumber: 158,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
                            children: others.map((coffee)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-white text-black p-4 rounded-lg shadow-md",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$PROJECTS$2f$coffee$2d$store$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: coffee.name
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/app/coffee/page.tsx",
                                        lineNumber: 164,
                                        columnNumber: 33
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, coffee.id, false, {
                                    fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/app/coffee/page.tsx",
                                    lineNumber: 163,
                                    columnNumber: 29
                                }, ("TURBOPACK compile-time value", void 0)))
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/app/coffee/page.tsx",
                            lineNumber: 161,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/app/coffee/page.tsx",
                    lineNumber: 157,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/app/coffee/page.tsx",
            lineNumber: 136,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/app/coffee/page.tsx",
        lineNumber: 135,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = CoffeePage;
}),
"[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/app/coffee/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/OneDrive/Desktop/PROJECTS/coffee-store/src/app/coffee/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__b35b789a._.js.map