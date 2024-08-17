import AuctionPanel from "../AuctionPanel";
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../../App', () => ({
    useUserContext: () => ({
        playerPanel: true
    }),
}));

describe('<AuctionPanel>', () => {

    test('renders or not', () => {
        render(
            <BrowserRouter>
                <MockedProvider>
                    <AuctionPanel />
                </MockedProvider>
            </BrowserRouter>
        );
        screen.debug(undefined, Infinity);
    });
});