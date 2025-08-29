import React from 'react';
import { motion } from 'framer-motion';
import { FaQuoteLeft } from 'react-icons/fa';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';

// import required modules
import { EffectCoverflow, Pagination, Navigation, Autoplay } from 'swiper/modules';

// 1. Data for the testimonials
const testimonialsData = [
  {
    quote: "Booking with BusGo was incredibly easy and stress-free. The website is user-friendly, and I found the perfect trip in minutes. The bus was clean, comfortable, and right on time!",
    name: 'Sarah L.',
    trip: 'London to Manchester',
    avatarUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    quote: "As a frequent traveler, I've used many booking sites, but BusGo is now my go-to. The prices are competitive, and the 24/7 support is a lifesaver. Highly recommended!",
    name: 'Michael B.',
    trip: 'Frequent Traveler',
    avatarUrl: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    quote: "I was hesitant about bus travel, but my journey from Edinburgh to Glasgow was fantastic. The amenities were great, and the booking process was seamless. I'll definitely be using this service again.",
    name: 'Emily R.',
    trip: 'Edinburgh to Glasgow',
    avatarUrl: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
    {
    quote: "The mobile app is a game-changer! I booked my ticket on the go and had my e-ticket ready in seconds. The whole experience, from searching to boarding, was flawless.",
    name: 'David K.',
    trip: 'Birmingham to Bristol',
    avatarUrl: 'https://images.pexels.com/photos/837358/pexels-photo-837358.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
];

// 2. The main Testimonials component
const Testimonials = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800">
            Hear From Our Happy Travelers
          </h2>
          <p className="text-lg text-gray-500 mt-2">
            Real stories from passengers who love our service.
          </p>
        </motion.div>
        
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
        >
          <Swiper
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            loop={true}
            slidesPerView={'auto'}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 2.5,
              slideShadows: false,
            }}
            autoplay={{
                delay: 5000,
                disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
            navigation={true}
            modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
            className="w-full"
            breakpoints={{
                640: { slidesPerView: 1, spaceBetween: 20 },
                768: { slidesPerView: 2, spaceBetween: 30 },
                1024: { slidesPerView: 3, spaceBetween: 40 },
            }}
          >
            {testimonialsData.map((testimonial, index) => (
              <SwiperSlide key={index} className="pb-12">
                <div className="bg-white rounded-lg shadow-lg p-8 h-full flex flex-col justify-between">
                  <FaQuoteLeft className="text-5xl text-green-100 mb-4" />
                  <p className="text-gray-600 italic mb-6 flex-grow">"{testimonial.quote}"</p>
                  <div className="flex items-center">
                    <img src={testimonial.avatarUrl} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover mr-4" />
                    <div>
                      <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">{testimonial.trip}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;