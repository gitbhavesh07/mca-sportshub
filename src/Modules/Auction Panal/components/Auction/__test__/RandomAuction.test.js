import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter } from "react-router-dom";
import Auction from "../Auction";
import { FIND_AUCTION } from '../../../../../Graphql/Query/Querys';
import "@testing-library/jest-dom/extend-expect";
import { toast } from 'react-toastify';
import { UPDATE_SOLD_PLAYER, UPDATE_UNSOLD_PLAYER } from '../../../../../Graphql/Mutation/Mutations';
import { act } from 'react-dom/test-utils';

jest.useFakeTimers();

jest.mock('../../../../../App', () => ({
    useUserContext: () => ({
        auctionId: '5a71defd-ae16-4412-a405-8b128b3b9f66',
        userOption: 'random',
    }),
}));

const cryptoMock = {
    getRandomValues: jest.fn().mockReturnValueOnce(new Uint32Array([123456789])),
};

global.crypto = cryptoMock;

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
            query: UPDATE_SOLD_PLAYER,
            variables: {
                UpdatePlayerInput: {
                    id: '441',
                    team_id: '1814d380-9ec6-4875-887a-869fb955f406',
                    playerstatus: 'SOLD'
                },
                UpdateTeamInput: {
                    id: '1814d380-9ec6-4875-887a-869fb955f406',
                    playercount: 1,
                    availablepoints: 2000
                }
            },
        },
        result: {
            data: {
                updateSoldPlayer: 'Kayleigh Runolfsdottir sold to CSK',
            },
        },
    },
    {
        request: {
            query: UPDATE_UNSOLD_PLAYER,
            variables: {
                UpdatePlayerInput: {
                    id: '441',
                    playerstatus: 'UNSOLD'
                },
            },
        },
        result: {
            data: {
                updateUnsoldPlayer: 'Kayleigh Runolfsdottir unSold',
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
            query: UPDATE_SOLD_PLAYER,
            variables: {
                UpdatePlayerInput: {
                    id: '441',
                    team_id: '1814d380-9ec6-4875-887a-869fb955f406',
                    playerstatus: ''
                },
                UpdateTeamInput: {
                    id: '1814d380-9ec6-4875-887a-869fb955f406',
                    playercount: 1,
                    availablepoints: 2000
                }
            },
        },
        result: {
            errors: {
                message: 'PlayerStatus is required',
            },
        },
    },
    {
        request: {
            query: UPDATE_UNSOLD_PLAYER,
            variables: {
                UpdatePlayerInput: {
                    id: '441',
                    playerstatus: ''
                },
            },
        },
        result: {
            errors: {
                message: 'PlayerStatus is required',
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
                            playerstatus: 'SOLD',
                            team_id: null,
                            playerfilename: null
                        },
                    ]
                }
            }
        },
    },
]

const toastSuccesSpy = jest.spyOn(toast, 'success');
const toastErrorSpy = jest.spyOn(toast, 'error');

describe('<Auction>', () => {

    test('renders or not', async () => {
        render(
            <BrowserRouter>
                <MockedProvider mocks={mocks}>
                    <Auction />
                </MockedProvider>
            </BrowserRouter>
        );

        await waitFor(() => {
            screen.debug(undefined, Infinity);
        });
    });

    test('No Players Available.', async () => {
        render(
            <BrowserRouter>
                <MockedProvider mocks={mockDataError}>
                    <Auction />
                </MockedProvider>
            </BrowserRouter>
        );

        await waitFor(() => {
            const handleRandom = screen.getByText('New Player');
            fireEvent.click(handleRandom);
        })

        screen.debug(undefined, Infinity);

        await waitFor(() => {
            expect(toastErrorSpy).toHaveBeenCalledWith('No Players Available.', {
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

    test('handleRandom Player, sold the player and show sold toast', async () => {
        render(
            <BrowserRouter>
                <MockedProvider mocks={mocks}>
                    <Auction />
                </MockedProvider>
            </BrowserRouter>
        );

        await waitFor(() => {
            const handleRandom = screen.getByText('New Player');
            fireEvent.click(handleRandom);
        })

        screen.debug(undefined, Infinity);

        expect(screen.getByText('441')).toBeInTheDocument();
        expect(screen.getByDisplayValue('1000')).toBeInTheDocument();

        const unSelectTeamsoldButton = screen.getByText('SOLD');
        fireEvent.click(unSelectTeamsoldButton);

        expect(toastErrorSpy).toHaveBeenCalledWith('Please select Team', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'dark'
        });

        const cskButton = screen.getByRole('button', { name: 'CSK' });
        fireEvent.click(cskButton);

        expect(screen.getByDisplayValue('2000')).toBeInTheDocument();

        const soldButton = screen.getByText('SOLD');
        fireEvent.click(soldButton);

        await waitFor(() => {
            expect(toastSuccesSpy).toHaveBeenCalledWith('Kayleigh Runolfsdottir sold to CSK', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'dark'
            });
            expect(screen.getByTestId('sold')).toBeInTheDocument();
        });

        act(() => {
            jest.advanceTimersByTime(5000);
        });
    });

    test('handleRandom Player, sold the player and show error toast', async () => {

        render(
            <BrowserRouter>
                <MockedProvider mocks={mockError}>
                    <Auction />
                </MockedProvider>
            </BrowserRouter>
        );

        await waitFor(() => {
            const handleRandom = screen.getByText('New Player');
            fireEvent.click(handleRandom);
        })

        screen.debug(undefined, Infinity);

        expect(screen.getByText('441')).toBeInTheDocument();
        expect(screen.getByDisplayValue('1000')).toBeInTheDocument();

        const cskButton = screen.getByRole('button', { name: 'CSK' });
        fireEvent.click(cskButton);

        expect(screen.getByDisplayValue('2000')).toBeInTheDocument();

        const unSoldButton = screen.getByText('SOLD');
        fireEvent.click(unSoldButton);

        await waitFor(() => {
            expect(toastErrorSpy).toBeCalledTimes(1);
        });
    });

    test('handleRandom Player, unsold the player and show unsold toast', async () => {

        render(
            <BrowserRouter>
                <MockedProvider mocks={mocks}>
                    <Auction />
                </MockedProvider>
            </BrowserRouter>
        );

        await waitFor(() => {
            const handleRandom = screen.getByText('New Player');
            fireEvent.click(handleRandom);
        })

        screen.debug(undefined, Infinity);

        expect(screen.getByText('441')).toBeInTheDocument();
        expect(screen.getByDisplayValue('1000')).toBeInTheDocument();

        const cskButton = screen.getByRole('button', { name: 'CSK' });
        fireEvent.click(cskButton);

        expect(screen.getByDisplayValue('2000')).toBeInTheDocument();

        const unSoldButton = screen.getByText('UNSOLD');
        fireEvent.click(unSoldButton);

        await waitFor(() => {
            expect(toastSuccesSpy).toHaveBeenCalledWith('Kayleigh Runolfsdottir unSold', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'dark'
            });
            expect(screen.getByTestId('sold')).toBeInTheDocument();
        });

        act(() => {
            jest.advanceTimersByTime(5000);
        });
    });

    test('handleRandom Player, unsold the player and show error toast', async () => {

        render(
            <BrowserRouter>
                <MockedProvider mocks={mockError}>
                    <Auction />
                </MockedProvider>
            </BrowserRouter>
        );

        await waitFor(() => {
            const handleRandom = screen.getByText('New Player');
            fireEvent.click(handleRandom);
        })

        screen.debug(undefined, Infinity);

        expect(screen.getByText('441')).toBeInTheDocument();
        expect(screen.getByDisplayValue('1000')).toBeInTheDocument();

        const cskButton = screen.getByRole('button', { name: 'CSK' });
        fireEvent.click(cskButton);

        expect(screen.getByDisplayValue('2000')).toBeInTheDocument();

        const unSoldButton = screen.getByText('UNSOLD');
        fireEvent.click(unSoldButton);

        await waitFor(() => {
            expect(toastErrorSpy).toBeCalledTimes(1);
        });
    });

    test('handleSearch Player, sold the player and show sold toast', async () => {
        render(
            <BrowserRouter>
                <MockedProvider mocks={mocks}>
                    <Auction />
                </MockedProvider>
            </BrowserRouter>
        );

        await waitFor(() => {
            const searchPlayer = screen.getByPlaceholderText('PNo');
            fireEvent.change(searchPlayer, { target: { value: '441' } })
            const handleRandom = screen.getByText('New Player');
            fireEvent.click(handleRandom);
        })

        screen.debug(undefined, Infinity);

        expect(screen.getByText('441')).toBeInTheDocument();
        expect(screen.getByDisplayValue('1000')).toBeInTheDocument();

        const unSelectTeamsoldButton = screen.getByText('SOLD');
        fireEvent.click(unSelectTeamsoldButton);

        expect(toastErrorSpy).toHaveBeenCalledWith('Please select Team', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'dark'
        });

        const cskButton = screen.getByRole('button', { name: 'CSK' });
        fireEvent.click(cskButton);

        expect(screen.getByDisplayValue('2000')).toBeInTheDocument();

        const soldButton = screen.getByText('SOLD');
        fireEvent.click(soldButton);

        await waitFor(() => {
            expect(toastSuccesSpy).toHaveBeenCalledWith('Kayleigh Runolfsdottir sold to CSK', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'dark'
            });
            expect(screen.getByTestId('sold')).toBeInTheDocument();
        });

        act(() => {
            jest.advanceTimersByTime(5000);
        });

        const searchPlayer = screen.getByPlaceholderText('PNo');
        fireEvent.change(searchPlayer, { target: { value: '442' } })
        const handleRandom = screen.getByText('New Player');
        fireEvent.click(handleRandom);

        await waitFor(() => {
            expect(toastErrorSpy).toHaveBeenCalledWith('No matching player found.', {
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
});