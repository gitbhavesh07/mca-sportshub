import { render, screen, fireEvent } from "@testing-library/react";
import { MockedProvider } from '@apollo/client/testing';
import GoBack from '../GoBack';
import { MemoryRouter } from "react-router-dom";
import '@testing-library/jest-dom/extend-expect';

describe('<GoBack>',()=>{
    test('renders or not', () => {
        render(
            <MemoryRouter>
                <MockedProvider>
                    <GoBack />
                </MockedProvider>
            </MemoryRouter>
        );
        screen.debug(undefined, Infinity);
        const goBackButton = screen.getByTestId('FaArrowLeft');
        expect(goBackButton).toBeInTheDocument();

        fireEvent.click(goBackButton);
    });
});