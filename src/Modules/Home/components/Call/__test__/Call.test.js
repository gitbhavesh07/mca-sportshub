import { render, screen } from "@testing-library/react";
import { MockedProvider } from '@apollo/client/testing';
import Call from "../Call";

describe('<Call>',()=>{
    test('renders or not', () => {
        render(
            <MockedProvider>
                <Call />
            </MockedProvider>
        );
        screen.debug(undefined, Infinity);
        expect(screen.getByText('CALL TO AUCTION')).toBeInTheDocument();
        expect(screen.getByText('If any query of this app please call us')).toBeInTheDocument();
        expect(screen.getByText('CALL')).toBeInTheDocument();
    });
});