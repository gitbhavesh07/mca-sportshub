import { render, screen, fireEvent } from "@testing-library/react";
import Header from "../Header";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import { MockedProvider } from '@apollo/client/testing';
import '@testing-library/jest-dom/extend-expect';

jest.mock('../../../../../App', () => ({
    useUserContext: () => ({
        profileName: 'MOHAN',
        header: 'DashBoard',
        setHeader: jest.fn(),
    }),
}));

const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockedUsedNavigate,
}));

describe('<Header>', () => {
    test('renders or not', () => {
        render(
            <MemoryRouter initialEntries={['/dashboard']}>
                <MockedProvider>
                    <Header />
                </MockedProvider>
            </MemoryRouter>
        );
        screen.debug(undefined, Infinity);

        const profile = screen.getAllByAltText('Profile');
        profile.forEach(image => {
            expect(image).toBeInTheDocument();
        })
    });

    test('toggles the menu is Open', () => {
        render(
            <MemoryRouter>
                <MockedProvider>
                    <Header />
                </MockedProvider>
            </MemoryRouter>
        );
        
        const faBarsIcon = screen.getByTitle('Bars');
        fireEvent.mouseLeave(faBarsIcon);

        const menu = screen.getByTestId('menu');
        expect(menu).toHaveClass('close');

        fireEvent.click(faBarsIcon);
        expect(menu).toHaveClass('open');

        fireEvent.click(faBarsIcon);
        expect(menu).toHaveClass('close');
    });

    test('check logout function', () => {
        render(
            <BrowserRouter>
                <MockedProvider>
                    <Header />
                </MockedProvider>
            </BrowserRouter>
        );

        const logout = screen.getByTestId('logout');
        fireEvent.click(logout);

        expect(mockedUsedNavigate).toHaveBeenCalled();
        expect(mockedUsedNavigate).toHaveBeenCalledWith('/login');
    });

    test('check logout function', () => {
        render(
            <BrowserRouter>
                <MockedProvider>
                    <Header />
                </MockedProvider>
            </BrowserRouter>
        );

        const changeValue1 = screen.getByTestId('changeValue1');
        fireEvent.click(changeValue1);

        const changeValue2 = screen.getByTestId('changeValue2');
        fireEvent.click(changeValue2);
        
        const changeValue3 = screen.getByTestId('changeValue3');
        fireEvent.click(changeValue3);

        const changeValue4 = screen.getByTestId('changeValue4');
        fireEvent.click(changeValue4);
    });
});