import { render,waitFor,waitForElementToBeRemoved, screen, fireEvent } from "@testing-library/react";
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import FindAuctions from "../FindAuctions";
import {SEARCH_AUCTIONS} from '../../../../../Graphql/Query/Querys';

jest.mock('../../../../../App', () => ({
    useUserContext: () => ({
        isError: jest.fn(),
    }),
}));
const mock=[
    {
        request: {
            query: SEARCH_AUCTIONS,
            variables: {
                auctionname: 'IPL',
            },
        },
        result: {
            data: {
                searchAuctions: {
                    id:'5a71defd-ae16-4412-a405-8b128b3b9f66',
                    auctionname:'IPL',
                    filename: 'images/1695188322707-iStock-642535368.jpg',
                    auctiondate:'2023-09-21',
                },
            },
        },
    },
]
describe('<FindAuctions>',()=>{
    test('renders or not', () => {
        render(
            <MockedProvider>
                <FindAuctions mock={mock} />
            </MockedProvider>
        );
        screen.debug(undefined, Infinity);
        expect(screen.getByText('Find Auctions')).toBeInTheDocument;
    });

    test('Find Auctions', async() => {
        const setSearchResults = jest.fn();
        const setIsLoading = jest.fn();
        render(
            <MockedProvider  mocks={mock}>
                <FindAuctions setSearchResults={setSearchResults}/>
            </MockedProvider>
        );
        screen.debug(undefined, Infinity);

        const searchInput = screen.getByPlaceholderText('Search auctions...');
        const searchButton = screen.getByTestId('search-button');

        expect(searchInput).toBeInTheDocument;
        fireEvent.change(searchInput, { target: { value: 'IPL' } });
        fireEvent.click(searchButton);
        screen.findByText('No auctions found!');

    });
    // test('data render ot not', () => {
    //     render(
    //         <MockedProvider>
    //             <FindAuctions mocks={mock}/>
    //         </MockedProvider>
    //     );
    //     screen.debug(undefined, Infinity);

    // });
    test('No auction found', () => {
        render(
            <MockedProvider>
                <FindAuctions mocks={mock}/>
            </MockedProvider>
        );
        screen.debug(undefined, Infinity);

        const searchInput = screen.getByPlaceholderText('Search auctions...');
        const searchButton= screen.getByRole('button',{name:'Search'})
        expect(searchInput).toBeInTheDocument;
        fireEvent.change(searchInput, { target: { value: '' } });
        fireEvent.click(searchButton);
        screen.findByText('No auctions found!');
    });
});