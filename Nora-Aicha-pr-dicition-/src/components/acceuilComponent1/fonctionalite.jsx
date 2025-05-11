// import React from 'react';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation, Pagination, Autoplay } from 'swiper/modules';
// import { Star } from 'lucide-react';
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';
// import imgSrc1 from '../../assets/images/acca.jpg';
// import imgSrc2 from '../../assets/images/acc16a.jpeg';
// import imgSrc3 from '../../assets/images/acc4a.jpg';
// // import imgSrc from '../../assets/images/featured-02.jpg';

// const slides = [
//     {
//         imgSrc: imgSrc1,
//         title: 'Comparez,  choisissez,  optimisez !',
//         text: 'Visualisez en un coup d&apos;œil les scores, les erreurs et les tendances pour prendre la meilleure décision.',
//     },
//     {
//         imgSrc: imgSrc2,
//         title: 'Vos données prennent vie ! ',
//         text: 'Graphiques dynamiques, tableaux interactifs et outils de visualisation puissants pour comprendre vos résultats en un clin d&apos;œil',
//     },
//     {
//         imgSrc: imgSrc3,
//         title: 'Simple, rapide et intuitif ',
//         text: 'Notre plate-forme est conçue pour vous offrir la meilleure expérience, que vous soyez débutant ou expert.',
//         titreS : ''
//     },

// ];

// export default function Fonctionalite() {
//     return (
//         <div className="w-full h-screen">
//             <Swiper
//                 modules={[Navigation, Pagination, Autoplay]}
//                 navigation
//                 pagination={{ clickable: true }}
//                 autoplay={{ delay: 3000 }}
//                 loop={true}
//                 spaceBetween={0}
//                 slidesPerView={1}
//                 className="h-full"
//             >
//                 {slides.map((slide, index) => (
//                     <SwiperSlide key={index} className="relative w-full h-full">
//                         <img
//                             src={slide.imgSrc}
//                             alt="Featured"
//                             className="w-full h-full object-cover"
//                         />

//                         <div className="absolute inset-0 flex flex-col justify-center items-center text-black bg-opacity-50 text-center p-4">
//                             <h2 className="text-3xl font-bold mb-4">{slide.title}</h2>
//                             <p className="text-lg max-w-xl">{slide.text}</p>
//                         </div>


//                     </SwiperSlide>
//                 ))}
//             </Swiper>
//         </div>
//     );
// }