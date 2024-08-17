import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import MatchHost from '../MatchHost';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LIVE, RESET_AUCTION_DATA } from '../../../../../Graphql/Mutation/Mutations';
import { FIND_PLAYER_STATISTICS, FIND_TEAM_STATISTICS, GET_LIVE } from '../../../../../Graphql/Query/Querys';
import { socket } from '../../../../../contexts/WebSocketContext';
import "@testing-library/jest-dom/extend-expect";
import { act } from 'react-dom/test-utils';
import { copyToClipboard } from '../MatchHost';

jest.useFakeTimers();

jest.mock('chart.js', () => {
    const originalModule = jest.requireActual('chart.js');
    return {
        ...originalModule,
        Chart: {
            ...originalModule.Chart,
            register: jest.fn(),
        },
    };
});

jest.mock('react-chartjs-2', () => ({
    Bar: jest.fn(),
}));

jest.mock('../../../../../contexts/WebSocketContext', () => ({
    socket: {
        emit: jest.fn(),
        connect: jest.fn(),
        disconnect: jest.fn(),
        on: jest.fn()
    }
}));

jest.mock('../../../../../App', () => ({
    useUserContext: () => ({
        auctionId: '5a71defd-ae16-4412-a405-8b128b3b9f66',
    }),
}));

const mocks = [
    {
        request: {
            query: FIND_TEAM_STATISTICS,
            variables: {
                id: '5a71defd-ae16-4412-a405-8b128b3b9f66',
            },
        },
        result: {
            data: {
                teamstatistics: [
                    {
                        teamname: 'CHENNAI SUPER KINGS',
                        playercount: 12,
                    },
                    {
                        teamname: 'MUMBAI INDIANS',
                        playercount: 12,
                    },
                ],
            },
        },
    },
    {
        request: {
            query: FIND_PLAYER_STATISTICS,
            variables: {
                id: '5a71defd-ae16-4412-a405-8b128b3b9f66',
            },
        },
        result: {
            data: {
                playerstatistics: [
                    {
                        playerstatus: 'SOLD',
                    },
                    {
                        playerstatus: 'SOLD',
                    },
                ],
            },
        },
    },
    {
        request: {
            query: RESET_AUCTION_DATA,
            variables: {
                id: '5a71defd-ae16-4412-a405-8b128b3b9f66',
            },
        },
        result: {
            data: {
                resetAuction: 'Auction Reset Successfully.'
            }
        }
    },
    {
        request: {
            query: LIVE,
            variables: {
                livestate: true,
                room_id: '5a71defd-ae16-4412-a405-8b128b3b9f66'
            },
        },
        result: {
            data: {
                updatelive: {
                    id: "913207db-5f58-4ed2-a3b1-2b8090e6a999",
                    livestate: true,
                    room_id: "5a71defd-ae16-4412-a405-8b128b3b9f66"
                }
            },
        },
    },
    {
        request: {
            query: LIVE,
            variables: {
                livestate: false,
                room_id: '5a71defd-ae16-4412-a405-8b128b3b9f66'
            },
        },
        result: {
            data: {
                updatelive: {
                    id: "913207db-5f58-4ed2-a3b1-2b8090e6a999",
                    livestate: false,
                    room_id: "5a71defd-ae16-4412-a405-8b128b3b9f66"
                }
            },
        },
    },
    {
        request: {
            query: GET_LIVE,
            variables: {},
        },
        result: {
            data: {
                getlive: [{
                    id: "913207db-5f58-4ed2-a3b1-2b8090e6a999",
                    livestate: true,
                    room_id: "5a71defd-ae16-4412-a405-8b128b3b9f66"
                }]
            },
        },
    },
]

const mockError = [
    {
        request: {
            query: FIND_TEAM_STATISTICS,
            variables: {
                id: '5a71defd-ae16-4412-a405-8b128b3b9f67',
            },
        },
        result: {
            errors: {
                message: 'Invalid id'
            },
        },
    },
    {
        request: {
            query: FIND_PLAYER_STATISTICS,
            variables: {
                id: '5a71defd-ae16-4412-a405-8b128b3b9f67',
            },
        },
        result: {
            errors: {
                message: 'Invalid id'
            },
        },
    },
    {
        request: {
            query: RESET_AUCTION_DATA,
            variables: {
                id: '',
            },
        },
        result: {
            errors: {
                message: 'Invalid id'
            },
        },
    },
    {
        request: {
            query: LIVE,
            variables: {
                livestate: true,
                room_id: '5a71defd-ae16-4412-a405-8b128b3b9f67'
            },
        },
        result: {
            errors: {
                message: 'Invalid id'
            },
        },
    },
    {
        request: {
            query: GET_LIVE,
            variables: {},
        },
        result: {
            data: {
                getlive: [{
                    id: "913207db-5f58-4ed2-a3b1-2b8090e6a999",
                    livestate: true,
                    room_id: "5a71defd-ae16-4412-a405-8b128b3b9f66"
                }]
            },
        },
    },
]

const toastSuccesSpy = jest.spyOn(toast, 'success');
const toastErrorSpy = jest.spyOn(toast, 'error');


describe('<MatchHost>', () => {

    test('renders or not', async () => {
        render(
            <BrowserRouter>
                <MockedProvider>
                    <MatchHost mocks={mocks} />
                </MockedProvider>
            </BrowserRouter>
        );
        screen.debug(undefined, Infinity);
    });

    // test('MatchHost Button and error toast', async () => {
    //     render(
    //         <BrowserRouter>
    //             <MockedProvider mocks={mockError}>
    //                 <MatchHost />
    //             </MockedProvider>
    //         </BrowserRouter>
    //     );
    //     screen.debug(undefined, Infinity);

    //     const TeamStatistics = screen.getByTestId('TeamStatistics');
    //     fireEvent.click(TeamStatistics);

    //     await waitFor(() => {
    //         expect(toastErrorSpy).toBeCalledTimes(1);
    //     });

    //     const PlayerStatistics = screen.getByTestId('PlayerStatistics');
    //     fireEvent.click(PlayerStatistics);

    //     await waitFor(() => {
    //         expect(toastErrorSpy).toBeCalledTimes(1);
    //     });
    // });

    // test('MatchHost Button', async () => {
    //     render(
    //         <BrowserRouter>
    //             <MockedProvider mocks={mocks}>
    //                 <MatchHost />
    //             </MockedProvider>
    //         </BrowserRouter>
    //     );

    //     screen.debug(undefined, Infinity);

    //     const TeamStatistics = screen.getByTestId('TeamStatistics');
    //     fireEvent.click(TeamStatistics);

    //     expect(screen.getByTestId('team-stats-bar')).toBeInTheDocument();

    //     const PlayerStatistics = screen.getByTestId('PlayerStatistics');
    //     fireEvent.click(PlayerStatistics);

    //     expect(screen.getByTestId('player-stats-bar')).toBeInTheDocument();

    //     const PlayerStatisticsClose = screen.getByTestId('PlayerStatistics');
    //     fireEvent.click(PlayerStatisticsClose);

    //     act(() => {
    //         jest.advanceTimersByTime(3000);
    //     });

    // });

    test('MatchHost Live Start and Stop Button', async () => {
        document.execCommand = jest.fn();
        render(
            <BrowserRouter>
                <MockedProvider mocks={mocks}>
                    <MatchHost />
                </MockedProvider>
            </BrowserRouter>
        );

        screen.debug(undefined, Infinity);

        await waitFor(() => {
            // const Reauction = screen.getByTestId('Reauction');
            // fireEvent.click(Reauction);
            const Reset = screen.getByTestId('Reset');
            fireEvent.click(Reset);
        });

        const TeamStatistics = screen.getByTestId('TeamStatistics');
        fireEvent.click(TeamStatistics);

        expect(screen.getByTestId('team-stats-bar')).toBeInTheDocument();

        const PlayerStatistics = screen.getByTestId('PlayerStatistics');
        fireEvent.click(PlayerStatistics);

        expect(screen.getByTestId('player-stats-bar')).toBeInTheDocument();

        const PlayerStatisticsClose = screen.getByTestId('PlayerStatistics');
        fireEvent.click(PlayerStatisticsClose);

        act(() => {
            jest.advanceTimersByTime(3000);
        });
        const StartLive = screen.getByText('Start Live');
        fireEvent.click(StartLive);

        await waitFor(() => {
            expect(socket.connect).toHaveBeenCalled();
            expect(socket.on).toHaveBeenCalled();
            expect(socket.emit).toHaveBeenCalledWith('start_live', expect.anything());
        });

        await waitFor(() => {
            screen.debug(undefined, Infinity);

            expect(screen.getByText('LIVE LINK')).toBeInTheDocument();

            const copyToClipboard = screen.getAllByText('Copy to Clipboard')
            copyToClipboard.forEach((copy) => {
                fireEvent.click(copy);
            });
        });

        act(() => {
            jest.advanceTimersByTime(4000);
        });

        const StopLive = screen.getByText('Stop Live');
        fireEvent.click(StopLive);

        await waitFor(() => {
            expect(socket.disconnect).toHaveBeenCalled();
        });

        expect(toastSuccesSpy).toBeCalledTimes(3);
    });

});