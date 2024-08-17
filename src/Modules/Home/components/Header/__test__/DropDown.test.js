import { fireEvent, render, screen } from "@testing-library/react";
import Dropdown from '../DropDown';
import { MockedProvider } from '@apollo/client/testing';

describe('<Dropdown>', () => {
    test('renders or not', () => {
        render(
            <MockedProvider>
                <Dropdown />
            </MockedProvider>
        );
        screen.debug(undefined, Infinity);
    });

    test('dropDown menu Clicked', () => {
        render(
            <MockedProvider>
                <Dropdown />
            </MockedProvider>
        );

        const clickLink = screen.getAllByTitle('link', { name: 'Open Menu' });

        expect(clickLink.length).toBeGreaterThan(0);
        clickLink.forEach((link) => {
            fireEvent.click(link);
        })
    });
});