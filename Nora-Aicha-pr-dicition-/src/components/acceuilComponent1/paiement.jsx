import React from 'react';
import img1 from '../../assets/images/paiement5.jpg'
import img2 from '../../assets/images/paiement6.webp'
import img3 from '../../assets/images/paiement4.png'

const Paiement = () => {
    const plans = [
        {
            title: 'Le Plan Basique',
            image: img1,
            price: '0 DA',
            features: [
                'Lorem Ipsum Dolores Sonte',
                'Songe Lorem Ipsum Dol',
                'Matrios Venga Heptuss',
                'Denim Sriracha Kogi',
                'Digital Photography Awards',
            ],
        },
        {
            title: 'Le Plan Standard',
            image: img2,
            price: '6 000 DA',
            features: [
                'Lorem Ipsum Dolores Sonte',
                'Songe Lorem Ipsum Dol',
                'Matrios Venga Heptuss',
                'Denim Sriracha Kogi',
                'Digital Photography Awards',
            ],
        },
        {
            title: 'Le Plan Avancé',
            image:img3,
            price: '20 000 DA',
            features: [
                'Lorem Ipsum Dolores Sonte',
                'Songe Lorem Ipsum Dol',
                'Matrios Venga Heptuss',
                'Denim Sriracha Kogi',
                'Digital Photography Awards',
            ],
        },
    ];

    return (
        <section className="pricing-plans py-16 bg-gray-50" id="pricing-plans">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h4 className="text-3xl font-semibold text-gray-800">
                    Découvrez nos formules de prédiction et les récompenses associées  </h4>
                </div>
                <div className="flex flex-wrap justify-center ">
                    {plans.map((plan, index) => (
                        <div key={index} className="flex flex-col basis-full md:basis-1/2 lg:basis-1/3 px-2">
                            <div className="pricing-item bg-white p-6 rounded-lg shadow-lg">
                                <img src={plan.image} alt={plan.title} className="w-full h-48 object-cover rounded-t-lg" />
                                <h4 className="text-xl font-semibold mt-4">{plan.title}</h4>
                                <ul className="mt-4 space-y-2">
                                    {plan.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="text-sm text-gray-700">{feature}</li>
                                    ))}
                                </ul>
                                <span className="price text-xl font-bold mt-4 block">{plan.price}</span>
                                
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Paiement;
