import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import Header from '../AuctionPanelHeader';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import "@testing-library/jest-dom/extend-expect";


jest.mock('../../../../../App', () => ({
    useUserContext: () => ({
        auctionId: '01caed56-3b26-486d-b320-f0ce9965c0c5',
        setPlayerPanel: jest.fn(),
        componentRef: { current: null },
        setUserOption: jest.fn(),
    }),
}));

describe('<Header>', () => {

    test('Header', async() => {
        render(
            <BrowserRouter>
                <MockedProvider>
                    <Header />
                </MockedProvider>
            </BrowserRouter>
        );
        screen.debug(undefined, Infinity);
        await waitFor(() => {
            const openButtons = screen.getAllByTestId('button');
            openButtons.forEach((button) => {
                fireEvent.click(button);
            });        })
       
    });
    it('on mouse leave', () => {
       render(
        <BrowserRouter>
        <Header />
        </BrowserRouter>
        ); 
        const mouse = screen.getByTestId('mouse');
        fireEvent.mouseLeave(mouse);
      });
});