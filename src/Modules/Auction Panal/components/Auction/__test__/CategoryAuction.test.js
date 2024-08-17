import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter } from "react-router-dom";
import Auction from "../Auction";
import { FIND_AUCTION } from '../../../../../Graphql/Query/Querys';
import "@testing-library/jest-dom/extend-expect";
import { toast } from 'react-toastify';
import { act } from 'react-dom/test-utils';
import { UPDATE_SOLD_PLAYER } from '../../../../../Graphql/Mutation/Mutations';

jest.useFakeTimers();

jest.mock('../../../../../App', () => ({
    useUserContext: () => ({
        auctionId: '5a71defd-ae16-4412-a405-8b128b3b9f66',
        userOption: 'category',
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
]

const toastSuccesSpy = jest.spyOn(toast, 'success');

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
            const Batting = screen.getByText('Batting');
            fireEvent.click(Batting);

            const Bowling = screen.getByText('Bowling');
            fireEvent.click(Bowling);
        })

        screen.debug(undefined, Infinity);
    });
});