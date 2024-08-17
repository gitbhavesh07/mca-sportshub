import { render, screen } from "@testing-library/react";
import { MockedProvider } from '@apollo/client/testing';
import Footer from "../Footer";

describe('<Footer>',()=>{
    test('renders or not', () => {
        render(
            <MockedProvider>
                <Footer />
            </MockedProvider>
        );
        screen.debug(undefined, Infinity);
    });
});