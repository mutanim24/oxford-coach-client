import React from 'react';
import AboutHero from './Sections/AboutHero';
import OurMission from './Sections/OurMission';
import WhyChooseUs from '../Home/components/WhyChooseUs';
import Testimonials from '../Home/components/Testimonials';
import Partners from '../Home/components/Partners';
import OurJourney from './Sections/OurJourney';
import OurValues from './Sections/OurValues';
import MeetTheTeam from './Sections/MeetTheTeam';

const AboutUs = () => {
    return (
        <div>
            <AboutHero />
            
            <OurMission /> 
            <OurJourney />
            <WhyChooseUs />
            <OurValues />
            <MeetTheTeam />
            <Testimonials />
            <Partners />
            {/* etc. */}
        </div>
    );
};

export default AboutUs;