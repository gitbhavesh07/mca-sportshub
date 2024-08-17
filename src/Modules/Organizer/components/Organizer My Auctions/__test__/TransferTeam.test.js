import { render,userEvent, screen, waitFor, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import TransferTeam from '../TransferTeam';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import {FIND_USER_AUCTION } from '../../../../../Graphql/Query/Querys';
import {TRANSFER_TEAM } from '../../../../../Graphql/Mutation/Mutations';
import "@testing-library/jest-dom/extend-expect";
import { toast } from 'react-toastify';

jest.mock('../../../../../App', () => ({
    useUserContext: () => ({
        setHeader: jest.fn(),
        componentRef: { current: null },
        userId: 'b2deab99-beb3-4a43-81ba-e475b32463d9',
    }),
}));
const mockedUsedNavigate = jest.fn();
    jest.mock("react-router-dom", () => ({
      ...jest.requireActual("react-router-dom"),
      useNavigate: ()=> mockedUsedNavigate,
    }));
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
        id: '5da484e3-4dcb-4fb5-93fc-4ebc631bb87f'
    })
}));
const auctionsData=[{
    id: '5da484e3-4dcb-4fb5-93fc-4ebc631bb87f',
    auctiontype: 'cricket',
    auctionname: 'BPL',
    auctiondate: '2023-09-08',
    pointsperteam: 500000,
    minbid: 1000,
    bidincrease: 1000,
    playerperteam: 11,
    filename: 'images/1694149231917-iStock-642535368.jpg',
    user_id: 'b2deab99-beb3-4a43-81ba-e475b32463d9',

},
{
    id: '5da484e3-4dcb-4fb6-93fc-4ebc631bb87f',
    auctiontype: 'cricket',
    auctionname: 'IPL',
    auctiondate: '2023-09-08',
    pointsperteam: 500000,
    minbid: 1000,
    bidincrease: 1000,
    playerperteam: 11,
    filename: 'images/1694149231917-iStock-642535368.jpg',
    user_id: 'b2deab99-beb3-4a43-81ba-e475b32463d9',

},{
    id: '5da484e3-9dcb-4fb6-93fc-4ebc631bb87f',
    auctiontype: 'cricket',
    auctionname: 'SPL',
    auctiondate: '2023-09-08',
    pointsperteam: 500000,
    minbid: 1000,
    bidincrease: 1000,
    playerperteam: 11,
    filename: 'images/1694149231917-iStock-642535368.jpg',
    user_id: 'b2deab99-beb3-4a43-81ba-e475b32463d9',

}];
const transferData={
    sourceAuctionId: '5da484e3-4dcb-4fb5-93fc-4ebc631bb87f',
    targetAuctionId: '5da484e3-9dcb-4fb6-93fc-4ebc631bb87f',
}
const mocks = [
    {
        request: {
            query: FIND_USER_AUCTION,
            variables: {
                user_id: 'b2deab99-beb3-4a43-81ba-e475b32463d9',
            },
        },
        result: {
            data: {
                findUserAuctions: auctionsData,
            },
        },
    },
    {
        request: {
            query: TRANSFER_TEAM,
            variables:  transferData,
        },
        result: {
            data: {
                TransferTeam:true,
            },
        },
    },
];


const toastSuccesSpy = jest.spyOn(toast, 'success');
const toastErrorSpy = jest.spyOn(toast, 'error');

describe('<TransferTeam>', () => {
    test('renders or not', () => {
        render(
            <BrowserRouter>
                <MockedProvider>
                    <TransferTeam />
                </MockedProvider>
            </BrowserRouter>
        );
        screen.debug(undefined, Infinity);
    });

    test('auctions option data', async() => {
        render(
            <BrowserRouter>
                <MockedProvider mocks={mocks}>
                    <TransferTeam />
                </MockedProvider>
            </BrowserRouter>
        );
        screen.debug(undefined, Infinity);
        await waitFor(() => {
            expect(screen.getByText('IPL')).toBeInTheDocument();
            expect(screen.getByText('SPL')).toBeInTheDocument();
          });
});
test('check onchange', async() => {
    render(
        <BrowserRouter>
            <MockedProvider mocks={mocks}>
                <TransferTeam />
            </MockedProvider>
        </BrowserRouter>
    );
    screen.debug(undefined, Infinity);
    const selectElement = screen.getByTestId('transferplayer-select');
    fireEvent.change(selectElement, { target: { value: '5da484e3-4dcb-4fb6-93fc-4ebc631bb87f' } });

    await waitFor(() => {
        expect(selectElement).toHaveTextContent('SPL');
    });

    const transferButton =await screen.findByRole('button',{name:'Transfer'})
    fireEvent.click(transferButton);
    console.log(toastSuccesSpy.mock.calls);

    await waitFor(() => {
        expect(toastSuccesSpy).toHaveBeenCalledWith('Team Transferred Successfully!',
        {
         position: "top-right",
         autoClose: 5000,
         hideProgressBar: false,
         closeOnClick: true,
         pauseOnHover: true,
         draggable: true,
         progress: undefined,
         theme: "dark",
        });
    });
});
   
test('transfer button', async () => {
    render(
        <BrowserRouter>
            <MockedProvider mocks={mocks}>
                <TransferTeam/>
            </MockedProvider>
        </BrowserRouter>
    );
    screen.debug(undefined, Infinity);
    const selectElement = screen.getByTestId('transferplayer-select');
    fireEvent.change(selectElement, { target: { value: '5da484e3-4dcb-4fb6-93fc-4ebc631bb87f' } });

    await waitFor(() => {
        expect(selectElement).toHaveTextContent('SPL');
    });

    const transferButton =screen.getByTestId('team-transfer')
    fireEvent.click(transferButton);

    await waitFor(() => {
        expect(toastErrorSpy).toHaveBeenCalledWith('Failed to transfer teams!',
        {
         position: "top-right",
         autoClose: 5000,
         hideProgressBar: false,
         closeOnClick: true,
         pauseOnHover: true,
         draggable: true,
         progress: undefined,
         theme: "dark",
        });
    });
});
});