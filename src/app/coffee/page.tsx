import React from "react";
import Image from "next/image";
export interface Coffee {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    price: number;
    isBestSeller: boolean;
    customizations:{
        size:{
            type: 'radio';
            options: {label: string; price: number}[];
        };
        milk:{
            type: 'radio';
            options: {label: string; price: number}[];
        };
        sugar:{
            type: 'radio';
            options: {label: string; price: number}[];
        };
    };
}

const coffeeData : Coffee[] = [{
    id: '1',
    name: 'Classic Cappuccino',
    description: 'A rich and creamy cappuccino with a perfect balance of espresso, steamed milk, and froth.',
    imageUrl: './images/latte.png',
    price: 2.5,
    isBestSeller: true,
    customizations:{
        size: {
            type: 'radio',
            options: [
                { label: 'Small', price: 0 },
                { label: 'Medium', price: 0.5 },
                { label: 'Large', price: 1 }
            ],
        },
        milk: {
            type: 'radio',
            options: [
                { label: 'None', price: 0 },
                { label: 'Soy', price: 0.25 },
                { label: 'Almond', price: 0.5 }
            ],
        },
        sugar: {
            type: 'radio',
            options: [
                { label: 'None', price: 0 },
                { label: '1Spoon', price: 0.25 },
                { label: '2Spoon', price: 0.5 }
            ]
        },
    },  
},
{
    id: '2',
    name: 'Vanilla Latte', 
    description: 'A smooth latte infused with vanilla syrup, topped with a light layer of foam.',
    imageUrl: '/images/latte.png',
    price: 2.5,
    isBestSeller: false,
    customizations:{
        size: {
            type: 'radio',
            options: [
                { label: 'Small', price: 0 },
                { label: 'Medium', price: 0.5 },
                { label: 'Large', price: 1 }
            ],
        },
        milk: {
            type: 'radio',
            options: [
                { label: 'None', price: 0 },
                { label: 'Soy', price: 0.25 },
                { label: 'Almond', price: 0.5 }
            ], 
        },
        sugar: {
            type: 'radio',
            options: [
                { label: 'None', price: 0 },
                { label: '1Spoon', price: 0.25 },
                { label: '2Spoon', price: 0.5 }
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
    customizations:{
        size: {
            type: 'radio',
            options: [ 
                { label: 'Small', price: 0 },
                { label: 'Medium', price: 0.5 },
                { label: 'Large', price: 1 }
            ],
        },
        milk: {
            type: 'radio',
            options: [
                { label: 'None', price: 0 },
                { label: 'Soy', price: 0.25 },
                { label: 'Almond', price: 0.5 }
            ],
        },
        sugar: {
            type: 'radio',
            options: [
                { label: 'None', price: 0 },
                { label: '1Spoon', price: 0.25 },
                { label: '2Spoon', price: 0.5 }
            ]
        }
    }
}
];

const CoffeePage = () => {
    const bestsellers = coffeeData.filter(coffee => coffee.isBestSeller);
    const others = coffeeData.filter(coffee => !coffee.isBestSeller);

    return (
        <main className="min-h-screen bg-white text-black ">
            <div className="container mx-auto px-4 py-12">
                <header className="mb-12 text-center">
                    <h1 className="text-5xl font-extrabold text-amber-900 font-serif">
                        Our Coffee Selections
                    </h1>
                    <p className="mt-4 text-lg text-gray-600">
                        HandCrafted with passion, brewed to perfection. Explore our exclusive range of coffees, each cup tells a story of dedication and flavor.
                    </p>
                </header>
                <section>
                    <h2 className="text-3xl font-bold mb-8 border-l-4 border-amber-500 pl-4">
                        Our Bestsellers
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {bestsellers.map(coffee => (
                            <div key={coffee.id} className="bg-white text-black p-4 rounded-lg shadow-md">
                                <p>{coffee.name}</p>
                            </div>
                        ))}
                    </div>
                </section>
                <section>
                    <h2 className="text-3xl font-bold mb-8 border-l-4 border-amber-500 pl-4">
                        Full Menu
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                         {others.map(coffee => (
                            <div key={coffee.id} className="bg-white text-black p-4 rounded-lg shadow-md">
                                <p>{coffee.name}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
};

export default CoffeePage;

