import { spyOn,fireEvent,render, screen, waitFor } from "@testing-library/react";
import { MockedProvider } from '@apollo/client/testing';
import MyAuction from '../MyAuctions';
import { MemoryRouter } from "react-router-dom";
import { FIND_USER_AUCTION } from '../../../../../Graphql/Query/Querys';
import {DELETE_AUCTION} from '../../../../../Graphql/Mutation/Mutations'
import {toast} from 'react-toastify'
jest.mock('../../../../../App', () => ({
    useUserContext: () => ({
        setHeader: jest.fn(),
        componentRef: jest.fn(),
        userId: 'b2deab99-beb3-4a43-81ba-e475b32463d9',
    }),
}));
const mockedUsedNavigate = jest.fn();
    jest.mock("react-router-dom", () => ({
      ...jest.requireActual("react-router-dom"),
      useNavigate: ()=> mockedUsedNavigate,
    }));

const moreauctionsData = [];
    for (let i = 0; i < 11; i++) {
        moreauctionsData.push({ 
        id: '9da484e3-4dcb-4fb5-93fc-4ebc631bb87f',
        auctiontype: 'cricket',
        auctionname: 'BPL',
        auctiondate: '2023-09-08',
        pointsperteam: 500000,
        minbid: 1000,
        bidincrease: 1000,
        playerperteam: 11,
        filename: 'images/1694149231917-iStock-642535368.jpg',
        user_id: 'b2deab99-beb3-4a43-81ba-e475b32463d9',
})
}

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

}];
const newmock=[
    {
        request: {
            query: FIND_USER_AUCTION,
            variables: {
                user_id: 'b2deab99-beb3-4a43-81ba-e475b32463d9',
            },
        },
        result: {
            data: {
                findUserAuctions: moreauctionsData,
            },
        },
    },
]
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
            query: DELETE_AUCTION,
            variables: {
                id: '5da484e3-4dcb-4fb5-93fc-4ebc631bb87f',
            },
        },
        result: {
            data: {
                deleteAuction: true,
            },
        },
    },
];
const deletemock = [
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
            query: DELETE_AUCTION,
            variables: {
                id: 'eda484e3-4dcb-4fb9-83fc-4ebc631bb87f',
            },
        },
        result: {
            data: {
                deleteAuction: false,
            },
        },
    },
];

const emptymock=[];
describe('<MyAuctions>', () => {
    test('renders or not', async () => {
        render(
            <MemoryRouter>
                <MockedProvider mocks={mocks}>
                    <MyAuction />
                </MockedProvider>
            </MemoryRouter>
        );
        // screen.debug(undefined, Infinity);

        await waitFor(() => {
            const element=screen.getByText('Auction Name');
            expect(element).toBeInTheDocument;
            expect(screen.findByText('BPL')).toBeInTheDocument;
            const button=screen.getByTestId('button');
            fireEvent.click(button);
        });
    });
    test('no data available check', async () => {
        render(
            <MemoryRouter>
                <MockedProvider mocks={emptymock}>
                    <MyAuction />
                </MockedProvider>
            </MemoryRouter>
        );
        // screen.debug(undefined, Infinity);
        await waitFor(() => {
            expect(screen.getByText('No data available.')).toBeInTheDocument;
        });
    });
    test('renders delete button and deletes auction', async () => {
        const toastSuccessSpy = jest.spyOn(toast, 'success'); 
       render(
            <MemoryRouter>
                <MockedProvider mocks={mocks}>
                    <MyAuction />
                </MockedProvider>
            </MemoryRouter>
        );

        const deleteButton = await screen.findByTestId('delete');
        fireEvent.click(deleteButton);

        await waitFor(()=>{
            expect(toastSuccessSpy).toHaveBeenCalledWith(
                'Auction Deleted Successfully!',
                      {
                       position: "top-right",
                       autoClose: 5000,
                       hideProgressBar: false,
                       closeOnClick: true,
                       pauseOnHover: true,
                       draggable: true,
                       progress: undefined,
                       theme: "dark",
                      }
                     );
        })
    });

    test('deletes auction error', async () => {
        const toastErrorSpy = jest.spyOn(toast, 'error');
       render(
            <MemoryRouter>
                <MockedProvider mocks={deletemock}>
                    <MyAuction />
                </MockedProvider>
            </MemoryRouter>
        );
        await new Promise(resolve => setTimeout(resolve, 2000));
        screen.debug(undefined, Infinity);
        const deleteButton = await screen.findByTestId('delete');
        fireEvent.click(deleteButton);

        await waitFor(()=>{
                     expect(toastErrorSpy).toHaveBeenCalledWith(
                     'Error deleting auction',
                      {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                       }
                    );
        })
    });

test('pagination', async () => {
   render(
        <MemoryRouter>
            <MockedProvider mocks={newmock}>
                <MyAuction />
            </MockedProvider>
        </MemoryRouter>
    );

    const nextButton = await screen.findByTestId('nextpage');
    fireEvent.click(nextButton);
    const prevButton = await screen.findByTestId('previouspage');
    fireEvent.click(prevButton);
});


    test('navigate to create auction page or not', async () => {
        render(
            <MemoryRouter>
                <MockedProvider mocks={mocks}>
                    <MyAuction />
                </MockedProvider>
            </MemoryRouter>
        );
        const addButton = await screen.findByTestId('addauction-nav');
        fireEvent.click(addButton);
        await waitFor(()=>{
            expect(mockedUsedNavigate).toHaveBeenCalledWith('/dashboard/CreateAuctions'); 

        })
    }); 
});