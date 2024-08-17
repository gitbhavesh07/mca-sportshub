import { render, screen } from "@testing-library/react";
import { MockedProvider } from '@apollo/client/testing';
import Features from "../Features";

describe('<Features>',()=>{
    test('renders or not', () => {
        render(
            <MockedProvider>
                <Features />
            </MockedProvider>
        );
        screen.debug(undefined, Infinity);
        expect(screen.getByText('ADVANCED FEATURES')).toBeInTheDocument();
        expect(screen.getByText('Live streaming')).toBeInTheDocument();
        expect(screen.getByText('We provide live streaming overlay for youtube, facebook')).toBeInTheDocument();
        expect(screen.getByText('Team Owner View')).toBeInTheDocument();
        expect(screen.getByText('All team owner can live view (points, player profile) on there mobiles')).toBeInTheDocument();
        expect(screen.getByText('Remotely Bid')).toBeInTheDocument();
        expect(screen.getByText('We provide remotely bidding system in this application for team owner take bid from their mobile or laptop')).toBeInTheDocument();
        expect(screen.getByText('Player Registration')).toBeInTheDocument();
        expect(screen.getByText('Player can register own self from mobile app')).toBeInTheDocument(); 
    });
});