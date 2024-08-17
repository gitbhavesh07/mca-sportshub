import { render, screen, waitFor } from "@testing-library/react";
import { MockedProvider } from '@apollo/client/testing';
import OrgDashboard from "../OrgDashboard";
import { MemoryRouter } from "react-router-dom";
import { FIND_USER_AUCTION } from '../../../Graphql/Query/Querys';


jest.mock('../../../App', () => ({
    useUserContext: () => ({
        setHeader: jest.fn(),
        componentRef: jest.fn(),
        userId: 'b2deab99-beb3-4a43-81ba-e475b32463d9',
    }),
}));

const mocks = [
    {
        request: {
            query: FIND_USER_AUCTION,
            variables: {
                user_id: 'b2deab99-beb3-4a43-81ba-e475b32463d9'
            }
        },
        result: {
            data: {
                findUserAuctions: {
                    id : '5da484e3-4dcb-4fb5-93fc-4ebc631bb87f',
                    auctiontype: 'cricket',
                    auctionname: 'BPL',
                    auctiondate: '2023-09-08',
                    pointsperteam: 500000,
                    minbid: 1000,
                    bidincrease: 1000,
                    playerperteam: 11,
                    filename: 'images/1694149231917-iStock-642535368.jpg',
                    user_id: 'b2deab99-beb3-4a43-81ba-e475b32463d9'
                },
            },
        },
    },
]

describe('<OrgDashboard>', () => {
    test('renders or not', async () => {
        render(
            <MemoryRouter>
                <MockedProvider mocks={mocks}>
                    <OrgDashboard />
                </MockedProvider>
            </MemoryRouter>
        );
        screen.debug(undefined, Infinity);
        // await waitFor(() => {
        //     expect(screen.getByText('BPL')).toBeInTheDocument();
        // });
    });
});