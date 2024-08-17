import React from 'react';
import '../Features/Features.css';
import { BsCameraVideoFill, BsLaptop } from 'react-icons/bs';
import { ImHammer2 } from 'react-icons/im';
import { RiTeamFill } from 'react-icons/ri';

const Features = () => {
    return (
        <div className='feature-container'>
            <h2 className='feature-head'>ADVANCED FEATURES</h2>
            <div className='feature-underline'></div>
            <div className='feature-details'>
                <div className='details-box'>
                    <div className='box-icon'>
                        <BsCameraVideoFill />
                    </div>
                    <div className='box-details'>
                        <h2>Live streaming</h2>
                        <p>We provide live streaming overlay for youtube, facebook</p>
                    </div>
                </div>
                <div className='details-box'>
                    <div className='box-icon'>
                        <ImHammer2 />
                    </div>
                    <div className='box-details'>
                        <h2>Team Owner View</h2>
                        <p>All team owner can live view (points, player profile) on there mobiles</p>
                    </div>
                </div>
                <div className='details-box'>
                    <div className='box-icon'>
                        <BsLaptop />
                    </div>
                    <div className='box-details'>
                        <h2>Remotely Bid</h2>
                        <p>We provide remotely bidding system in this application for team owner take bid from their mobile or laptop</p>
                    </div>
                </div>
                <div className='details-box'>
                    <div className='box-icon'>
                        <RiTeamFill />
                    </div>
                    <div className='box-details'>
                        <h2>Player Registration</h2>
                        <p>Player can register own self from mobile app</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Features;
