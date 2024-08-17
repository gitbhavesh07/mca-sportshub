import { BrowserRouter } from "react-router-dom";
import ApDashboard from "../ApDashboard";
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { FIND_AUCTION } from "../../../Graphql/Query/Querys";

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
        id: '5a71defd-ae16-4412-a405-8b128b3b9f66'
    })
}));

jest.mock('../../../App', () => ({
    useUserContext: () => ({
        setStart: jest.fn(),
        setAuctionId: jest.fn(),
        setAuctionPanel: jest.fn(),
        setUserOption: jest.fn(),
        userOption: 'random'
    }),
}));

const mocks = [
    {
        request: {
            query: FIND_AUCTION,
            variables: {
                id: '5a71defd-ae16-4412-a405-8b128b3b9f66',
            },
        },
        result: {
            data: {
                findAuction: {
                    id: '5a71defd-ae16-4412-a405-8b128b3b9f66',
                    auctiontype: 'cricket',
                    auctionname: 'IPL',
                    auctiondate: '2023-09-21',
                    pointsperteam: 5000000,
                    minbid: 1000,
                    bidincrease: 1000,
                    playerperteam: 12,
                    filename: 'images/1695188322707-iStock-642535368.jpg',
                    category: [
                        'Batting',
                        'Bowling',
                        'Wicketkeeper',
                        'AllRounder',
                        'Marquee',
                        'WicketKeeperBatsman',
                        'WicketKeeperBowler'
                    ],
                    user_id: '01caed56-3b26-486d-b320-f0ce9965c0c5',
                    team: [
                        {
                            id: '1814d380-9ec6-4875-887a-869fb955f406',
                            teamname: 'CHENNAI SUPER KINGS',
                            teamshortname: 'CSK',
                            teamshortcutkey: 'C',
                            availablepoints: 5000000,
                            no_of_players: 12,
                            playercount: 0,
                            teamfilename: 'images/1695189320993-wp4166483.PNG',
                            auction_id: '5a71defd-ae16-4412-a405-8b128b3b9f66'
                        },
                    ],
                    player: [
                        {
                            id: '441',
                            playername: 'Kayleigh Runolfsdottir',
                            mobilenumber: 6873998533,
                            fathername: null,
                            playerage: null,
                            playercategory: 'Wicketkeeper',
                            trousersize: null,
                            address: null,
                            auction_id: '5a71defd-ae16-4412-a405-8b128b3b9f66',
                            playerstatus: null,
                            team_id: null,
                            playerfilename: null
                        },
                    ]
                }
            }
        },
    },
]

const mockError = [
    {
        request: {
            query: FIND_AUCTION,
            variables: {
                id: '5a71defd-ae16-4412-a405-8b128b3b9f65',
            },
        },
        result: {
            errors: {
                message: 'Invalid id',
            },
        },
    },
]

describe('<ApDashboard>', () => {
    test('renders or not', async () => {
        render(
            <BrowserRouter>
                <MockedProvider mocks={mocks}>
                    <ApDashboard />
                </MockedProvider>
            </BrowserRouter>
        );

        await new Promise(resolve => setTimeout(resolve, 2000));
        screen.debug(undefined, Infinity);
    });

    test('Fetch Error', async () => {
        render(
            <BrowserRouter>
                <MockedProvider mocks={mockError}>
                    <ApDashboard />
                </MockedProvider>
            </BrowserRouter>
        );

        await new Promise(resolve => setTimeout(resolve, 2000));
        screen.debug(undefined, Infinity);
    });

    test('handleOption Button', async () => {
        render(
            <BrowserRouter>
                <MockedProvider mocks={mocks}>
                    <ApDashboard />
                </MockedProvider>
            </BrowserRouter>
        );
        screen.debug(undefined, Infinity);

        await waitFor(() => {
            const RandomPlayers = screen.getByText('Random Players');
            fireEvent.click(RandomPlayers);
        });

        const CategoryPlayers = screen.getByText('Category Players');
        fireEvent.click(CategoryPlayers);

        const startAuction = screen.getByText('START AUCTION');
        fireEvent.click(startAuction);
    });
});