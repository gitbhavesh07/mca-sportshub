import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import TeamList from '../TeamList';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { DELETE_TEAM, FIND_AUCTION } from '../../../../../Graphql/Query/Querys';
import "@testing-library/jest-dom/extend-expect";
import { toast } from 'react-toastify';


jest.mock('../../../../../App', () => ({
    useUserContext: () => ({
        userId: '01caed56-3b26-486d-b320-f0ce9965c0c5',
        setHeader: jest.fn(),
        componentRef: { current: null },
    }),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
        id: '5a71defd-ae16-4412-a405-8b128b3b9f66'
    })
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
    {
        request: {
            query: DELETE_TEAM,
            variables: {
                id: '1814d380-9ec6-4875-887a-869fb955f406',
            },
        },
        result: {
            data: {
                deleteTeam: 'Team Delete Sucessfully',
            },
        },
    },
]

const mockError = [
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
    {
        request: {
            query: DELETE_TEAM,
            variables: {
                id: '440',
            },
        },
        result: {
            errors: {
                message: 'Invalid teamId',
            },
        },
    },
]

const mockDataError = [
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
                    team: [],
                    player: []
                }
            }
        },
    }
]

const toastSuccesSpy = jest.spyOn(toast, 'success');
const toastErrorSpy = jest.spyOn(toast, 'error');

describe('<TeamList>', () => {
    test('renders or not', () => {
        render(
            <BrowserRouter>
                <MockedProvider>
                    <TeamList />
                </MockedProvider>
            </BrowserRouter>
        );
        screen.debug(undefined, Infinity);
    });

    test('Team Details', async() => {
        render(
            <BrowserRouter>
                <MockedProvider mocks={mocks}>
                    <TeamList />
                </MockedProvider>
            </BrowserRouter>
        );
        screen.debug(undefined, Infinity);

        await waitFor(() => {
            expect(screen.getByText('CHENNAI SUPER KINGS')).toBeInTheDocument();
        })
    });

    test('Edit Player', async () => {
        render(
            <BrowserRouter>
                <MockedProvider mocks={mocks}>
                    <TeamList />
                </MockedProvider>
            </BrowserRouter>
        );
        screen.debug(undefined, Infinity);

        await waitFor(() => {
            const EditTeam = screen.getByTestId('EditTeam');
            fireEvent.click(EditTeam);
        })
    });

    test('Delete Team and success Toast', async () => {
        render(
            <BrowserRouter>
                <MockedProvider mocks={mocks}>
                    <TeamList />
                </MockedProvider>
            </BrowserRouter>
        );
        screen.debug(undefined, Infinity);

        await waitFor(() => {
            const handleDelete = screen.getByTestId('handleDelete');
            fireEvent.click(handleDelete);
        })

        await waitFor(() => {
            expect(toastSuccesSpy).toHaveBeenCalledWith('Team Delete Sucessfully', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'dark'
            });
        });
    });

    test('Delete Team and error Toast', async () => {
        render(
            <BrowserRouter>
                <MockedProvider mocks={mockError}>
                    <TeamList />
                </MockedProvider>
            </BrowserRouter>
        );
        await new Promise(resolve => setTimeout(resolve, 2000));
        screen.debug(undefined, Infinity);

        await waitFor(() => {
            const handleDelete = screen.getByTestId('handleDelete');
            fireEvent.click(handleDelete);
        })

        await waitFor(() => {
            expect(toastErrorSpy).toBeCalledTimes(1);
        });
    });

    test('No Data found', async () => {
        render(
            <BrowserRouter>
                <MockedProvider mocks={mockDataError}>
                    <TeamList />
                </MockedProvider>
            </BrowserRouter>
        );
        await new Promise(resolve => setTimeout(resolve, 2000));
        screen.debug(undefined, Infinity);
    });

    test('Button Click', async () => {
        render(
            <BrowserRouter>
                <MockedProvider mocks={mocks}>
                    <TeamList />
                </MockedProvider>
            </BrowserRouter>
        );
        await new Promise(resolve => setTimeout(resolve, 2000));

        screen.debug(undefined, Infinity);

        const BsPlusSquareFill = screen.getByTestId('BsPlusSquareFill');
        fireEvent.click(BsPlusSquareFill);
    });
});