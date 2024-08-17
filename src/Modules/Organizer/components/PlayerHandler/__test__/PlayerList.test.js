import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import PlayerList from '../PlayerList';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { DELETE_PLAYER, FIND_AUCTION, GET_PRESIGNED_URL } from '../../../../../Graphql/Query/Querys';
import { toast } from 'react-toastify';
import "@testing-library/jest-dom/extend-expect";
import axios from "axios";
import { BulkUploadPlayers } from '../../../../../Graphql/Mutation/Mutations';

jest.mock("axios");

const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockedUsedNavigate,
}));

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

jest.mock("moment", () => {
    return () => jest.requireActual("moment")("2022-09-13T00:00:00.000Z");
});
jest.mock("uuid", () => ({ v4: () => "03dfa218-ce39-48e5-a4db-94c199ce5b8a" }));

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
            query: DELETE_PLAYER,
            variables: {
                id: '441',
            },
        },
        result: {
            data: {
                deletePlayer: 'Player Delete Sucessfully',
            },
        },
    },
    {
        request: {
            query: GET_PRESIGNED_URL,
            variables: {
                filename: 'images/1663027200-03dfa218-ce39-48e5-a4db-94c199ce5b8a',
            },
        },
        result: {
            data: {
                getSignerUrlForUpload: 'https://sports-hub-images-bucket.s3.amazonaws.com/images/1663027200-03dfa218-ce39-48e5-a4db-94c199ce5b8a?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAWR5YOL66PTUTW2OW%2F20230921%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20230921T111246Z&X-Amz-Expires=3600&X-Amz-Signature=50b10de8c57f45db06e5974c6ae509b31872ca3aff7aba3f277e350cffbc9a5b&X-Amz-SignedHeaders=host',
            },
        },
    },
    {
        request: {
            query: BulkUploadPlayers,
            variables: {
                fileUrl: "images/1663027200-03dfa218-ce39-48e5-a4db-94c199ce5b8a",
                auction_id: '5a71defd-ae16-4412-a405-8b128b3b9f66',
                filename: 'iplPlayers.xlsx',
            },
        },
        result: {
            data: {
                bulkUploadPlayers: 'Bulk Upload Sucessfully',
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
            query: DELETE_PLAYER,
            variables: {
                id: '440',
            },
        },
        result: {
            errors: {
                message: 'Invalid playerId',
            },
        },
    },
    {
        request: {
            query: BulkUploadPlayers,
            variables: {
                fileUrl: "images/1663027200-03dfa218-ce39-48e5-a4db-94c199ce5b8a",
                auction_id: '661',
                filename: 'iplPlayers.xlsx',
            },
        },
        result: {
            errors: {
                message: 'Invalid auction_id',
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
                    player: []
                }
            }
        },
    }
]


const mockPagination = [
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
                        {
                            id: '442',
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
                        {
                            id: '443',
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
                        {
                            id: '444',
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
                        {
                            id: '445',
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
                        {
                            id: '446',
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
                        {
                            id: '447',
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
                        {
                            id: '448',
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
                        {
                            id: '449',
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
                        {
                            id: '450',
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
                        {
                            id: '451',
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

const toastSuccesSpy = jest.spyOn(toast, 'success');
const toastErrorSpy = jest.spyOn(toast, 'error');


describe('<PlayerList>', () => {

    test('renders or not', () => {
        render(
            <BrowserRouter>
                <MockedProvider mocks={mocks}>
                    <PlayerList />
                </MockedProvider>
            </BrowserRouter>
        );
        screen.debug(undefined, Infinity);
    });

    test('Player Details', async () => {
        render(
            <BrowserRouter>
                <MockedProvider mocks={mocks}>
                    <PlayerList />
                </MockedProvider>
            </BrowserRouter>
        );
        screen.debug(undefined, Infinity);

        await waitFor(() => {
            expect(screen.getByText('Kayleigh Runolfsdottir')).toBeInTheDocument();
        })
    });

    test('Edit Player', async () => {
        render(
            <BrowserRouter>
                <MockedProvider mocks={mocks}>
                    <PlayerList />
                </MockedProvider>
            </BrowserRouter>
        );
        screen.debug(undefined, Infinity);

        await waitFor(() => {
            const EditPlayer = screen.getByTestId('EditPlayer');
            fireEvent.click(EditPlayer);
        })
    });

    test('Delete Player and success Toast', async () => {
        render(
            <BrowserRouter>
                <MockedProvider mocks={mocks}>
                    <PlayerList />
                </MockedProvider>
            </BrowserRouter>
        );
        screen.debug(undefined, Infinity);

        // await new Promise(resolve => setTimeout(resolve, 2000));
        await waitFor(() => {
            const handleDelete = screen.getByTestId('handleDelete');
            fireEvent.click(handleDelete);
        })

        await waitFor(() => {
            expect(toastSuccesSpy).toHaveBeenCalledWith('Player Delete Sucessfully', {
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

    test('Delete Player and error Toast', async () => {
        render(
            <BrowserRouter>
                <MockedProvider mocks={mockError}>
                    <PlayerList />
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
                    <PlayerList />
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
                    <PlayerList />
                </MockedProvider>
            </BrowserRouter>
        );
        screen.debug(undefined, Infinity);

        await waitFor(() => {
            const searchButton = screen.getByText('Search');
            fireEvent.click(searchButton);
        });

        const invalidsearchInput = screen.getByPlaceholderText('Enter PlayerName..');
        fireEvent.change(invalidsearchInput, { target: { value: 'nithish' } });

        const invalidsearchButton = screen.getByText('Search');
        fireEvent.click(invalidsearchButton);
        
        const searchInput = screen.getByPlaceholderText('Enter PlayerName..');
        fireEvent.change(searchInput, { target: { value: 'Kayleigh Runolfsdottir' } });

        const searchButton = screen.getByText('Search');
        fireEvent.click(searchButton);

        const BulkUpload = screen.getByRole('button', { name: 'Bulk Upload' });
        fireEvent.click(BulkUpload);

        const UploadHistroy = screen.getByText('Upload History');
        fireEvent.click(UploadHistroy);

        const BsPlusSquareFill = screen.getByTestId('BsPlusSquareFill');
        fireEvent.click(BsPlusSquareFill);
    });

    test('Upload Dialog validate file', async () => {
        render(
            <BrowserRouter>
                <MockedProvider mocks={mocks}>
                    <PlayerList />
                </MockedProvider>
            </BrowserRouter>
        );
        screen.debug(undefined, Infinity);

        await waitFor(() => {
            const BulkUpload = screen.getByRole('button', { name: 'Bulk Upload' });
            fireEvent.click(BulkUpload);
        });

        window.URL.createObjectURL = jest.fn().mockImplementation(() => "url");
        const handleImageChangeInvalid = screen.getByTestId("handleImageChange");
        const invalidFile = new File(["iplPlayers"], "iplPlayers.xlsx", { type: "image/png" });
        Object.defineProperty(handleImageChangeInvalid, "files", {
            value: [invalidFile],
        });

        fireEvent.change(handleImageChangeInvalid);

        const Cancel = screen.getByText('Cancel');
        fireEvent.click(Cancel);

        window.URL.createObjectURL = jest.fn().mockImplementation(() => "url");
        const handleImageChangeRequired = screen.getByTestId("handleImageChange");
        fireEvent.change(handleImageChangeRequired, { target: { value: '' } });

    }, 10000);

    test('Upload Dialog success toast', async () => {
        render(
            <BrowserRouter>
                <MockedProvider mocks={mocks}>
                    <PlayerList />
                </MockedProvider>
            </BrowserRouter>
        );
        screen.debug(undefined, Infinity);

        await waitFor(() => {
            const BulkUpload = screen.getByRole('button', { name: 'Bulk Upload' });
            fireEvent.click(BulkUpload);
        });

        window.URL.createObjectURL = jest.fn().mockImplementation(() => "url");
        const handleImageChange = screen.getByTestId("handleImageChange");
        const file = new File(["iplPlayers"], "iplPlayers.xlsx", { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        Object.defineProperty(handleImageChange, "files", {
            value: [file],
        });

        fireEvent.change(handleImageChange);
        const Upload = screen.getByText('Upload');
        fireEvent.click(Upload);

        axios.put.mockResolvedValue({ status: 200 });

        await waitFor(() => {
            expect(toastSuccesSpy).toHaveBeenCalledWith('Bulk Upload Sucessfully', {
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

        await new Promise((resolve) => setTimeout(resolve, 4000));
        screen.debug(undefined, Infinity);

        const BulkUpload = screen.getByRole('button', { name: 'Bulk Upload' });
        fireEvent.click(BulkUpload);

        const Cancel = screen.getByText('Cancel');
        fireEvent.click(Cancel);

    }, 10000);

    test('Upload Dialog error Toast', async () => {
        render(
            <BrowserRouter>
                <MockedProvider mocks={mockError}>
                    <PlayerList />
                </MockedProvider>
            </BrowserRouter>
        );
        screen.debug(undefined, Infinity);

        await waitFor(() => {
            const BulkUpload = screen.getByRole('button', { name: 'Bulk Upload' });
            fireEvent.click(BulkUpload);
        });

        window.URL.createObjectURL = jest.fn().mockImplementation(() => "url");
        const handleImageChange = screen.getByTestId("handleImageChange");
        const file = new File(["iplPlayers"], "iplPlayers.xlsx", { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        Object.defineProperty(handleImageChange, "files", {
            value: [file],
        });

        fireEvent.change(handleImageChange);
        const Upload = screen.getByText('Upload');
        fireEvent.click(Upload);

        axios.put.mockResolvedValue({ status: 200 });

        await waitFor(() => {
            expect(toastErrorSpy).toBeCalledTimes(1);
        });

        await new Promise((resolve) => setTimeout(resolve, 4000));
    }, 10000);

    test('Pagination Button', async () => {
        render(
            <BrowserRouter>
                <MockedProvider mocks={mockPagination}>
                    <PlayerList />
                </MockedProvider>
            </BrowserRouter>
        );
        screen.debug(undefined, Infinity);

        await waitFor(() => {
            const pageRight = screen.getByTestId('pageRight');
            fireEvent.click(pageRight);
        });

        const pageLeft = screen.getByTestId('pageLeft');
        fireEvent.click(pageLeft);
    });
});