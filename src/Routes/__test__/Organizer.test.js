import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter } from 'react-router-dom';
import Organizer from '../Organizer';

jest.mock('../../App', () => ({
    useUserContext: () => ({
        handleGoBack: jest.fn()
    }),
}));

describe('<Organizer>', () => {

    test('renders or not', () => {
        render(
            <BrowserRouter>
                <MockedProvider>
                    <Organizer />
                </MockedProvider>
            </BrowserRouter>
        );
        screen.debug(undefined, Infinity);
    });
});