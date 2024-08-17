import { render, screen } from "@testing-library/react";
import { MockedProvider } from '@apollo/client/testing';
import About from "../About";

describe('<About>',()=>{
    test('renders or not', () => {
        render(
            <MockedProvider>
                <About />
            </MockedProvider>
        );
        screen.debug(undefined, Infinity);
        expect(screen.getByText('ABOUT SUPER PLAYER AUCTION')).toBeInTheDocument();
    });
});