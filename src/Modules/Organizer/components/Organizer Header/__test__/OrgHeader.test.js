import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import OrgHeader from '../OrgHeader';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';


describe('<OrgHeader>', () => {

    test('renders or not', () => {
        render(
            <BrowserRouter>
                <MockedProvider>
                    <OrgHeader />
                </MockedProvider>
            </BrowserRouter>
        );
        screen.debug(undefined, Infinity);

        const logoElement = screen.getByAltText('Project Logo');
        expect(logoElement).toBeInTheDocument();

        const menu = screen.getByTitle('Bars', { name: 'Open Menu' });
        expect(menu).toHaveClass('bars-close');

        const barClose = screen.getByTestId('barClose');
        fireEvent.click(barClose);
        expect(menu).toHaveClass('bars');

        const barOpen = screen.getByTestId('barOpen');
        fireEvent.click(barOpen);
        expect(menu).toHaveClass('bars-close');

        const DashBoard = screen.getByText('DashBoard');
        fireEvent.click(DashBoard);

        const CreateAuctions = screen.getByText('Create Auctions');
        fireEvent.click(CreateAuctions);

        const MyAuctions = screen.getByText('My Auctions');
        fireEvent.click(MyAuctions);

        const Logout = screen.getByText('Log out');
        fireEvent.click(Logout);
    });
});