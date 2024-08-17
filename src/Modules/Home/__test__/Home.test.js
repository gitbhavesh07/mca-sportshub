import { render } from "@testing-library/react";
import { MockedProvider } from '@apollo/client/testing';
import Home from "../Home";
import { MemoryRouter } from "react-router-dom";

describe('<Home>', () => {
    test('renders or not', () => {
        render(
            <MemoryRouter>
                <MockedProvider>
                    <Home />
                </MockedProvider>
            </MemoryRouter>

        );
        screen.debug(undefined, Infinity);
    });
});