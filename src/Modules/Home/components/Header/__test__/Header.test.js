import { render, screen, fireEvent } from "@testing-library/react";
import Header from "../Header";
import { MemoryRouter } from "react-router-dom";
import { MockedProvider } from '@apollo/client/testing';
import '@testing-library/jest-dom/extend-expect';

describe('<Header>', () => {
    test('renders or not', () => {
        render(
            <MemoryRouter>
                <MockedProvider>
                    <Header />
                </MockedProvider>
            </MemoryRouter>
        );
        screen.debug(undefined, Infinity);
        const logoElement = screen.getByAltText('Project Logo');
        expect(logoElement).toBeInTheDocument();

        const homeLink = screen.getAllByText('Home');
        const findAuctionsLink = screen.getByText('Find Auctions');
        const loginButton = screen.getAllByText('Login');
        const registerButton = screen.getAllByText('Register');
        const barIcon = screen.getByTitle('Bars');

        expect(homeLink.length).toBeGreaterThan(0);
        expect(loginButton.length).toBeGreaterThan(0);
        expect(registerButton.length).toBeGreaterThan(0);

        homeLink.forEach((link) => {
            expect(link).toBeInTheDocument();
        });
        expect(findAuctionsLink).toBeInTheDocument();
        loginButton.forEach((button) => {
            expect(button).toBeInTheDocument();
        });
        registerButton.forEach((button) => {
            expect(button).toBeInTheDocument();
        });
        expect(barIcon).toBeInTheDocument();
    });

    test('toggles the menu is Open', () => {
        render(
            <MemoryRouter>
                <MockedProvider>
                    <Header />
                </MockedProvider>
            </MemoryRouter>
        );

        const menu = screen.getByTestId('menu');
        expect(menu).toHaveClass('close');

        const faBarsIcon = screen.getByTitle('Bars', { name: 'Open Menu' });
        fireEvent.click(faBarsIcon);

        expect(menu).toHaveClass('dropdown-nav open');

        fireEvent.click(faBarsIcon);

        expect(menu).toHaveClass('close');

        const hoverElement = screen.getByTestId('menu');

        fireEvent.mouseLeave(hoverElement);
        expect(hoverElement).toHaveClass('close');
    });
});