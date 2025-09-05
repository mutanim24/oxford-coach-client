import React from 'react';
import AboutHero from './Sections/AboutHero';
import OurMission from './Sections/OurMission';
import WhyChooseUs from '../Home/components/WhyChooseUs';
import Testimonials from '../Home/components/Testimonials';
import Partners from '../Home/components/Partners';

const AboutUs = () => {
    return (
        <div>
            <AboutHero />
            
            <OurMission /> 
            {/* <OurJourney /> */}
            <WhyChooseUs />
            <Testimonials />
            <Partners />
            {/* etc. */}
        </div>
    );
};

export default AboutUs;