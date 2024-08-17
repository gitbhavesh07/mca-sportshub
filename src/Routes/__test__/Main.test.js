import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter } from 'react-router-dom';
import MainHome from '../MainHome';

describe('<Main>', () => {

    test('renders or not', () => {
        render(
            <BrowserRouter>
                <MockedProvider>
                    <MainHome />
                </MockedProvider>
            </BrowserRouter>
        );
        screen.debug(undefined, Infinity);
    });
});