import { render,userEvent, screen, waitFor, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import History from '../PlayerUploadHistory';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import {UPLOAD_HISTORY} from '../../../../../Graphql/Query/Querys';
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


const mocks = [
    {
        request: {
            query: UPLOAD_HISTORY,
            variables: {
                auctionId: '5da484e3-4dcb-4fb5-93fc-4ebc631bb87f',
            },
        },
        result: {
            
            data: {
                uploadHistory: {
                    id:'c12083ab-5265-421a-a027-71360dce2ee9',
                    fileName:'iplPlayers.xlsx',
                    status:'Sucess',
                    noOfSuccessRecords:98,
                    failedDataFilePath:'uploads/1695361308519-iplPlayers.xlsx-errorfilename.xlsx',
                    createdAt:'22/09/2023',
                    totalRecords:100,
                    auction_id:'5da484e3-4dcb-4fb5-93fc-4ebc631bb87f',
                },
            },
        },
    },
];


const toastSuccesSpy = jest.spyOn(toast, 'success');
const toastErrorSpy = jest.spyOn(toast, 'error');

describe('<PlayerUploadHistory>', () => {
    test('auctions option data', async() => {
        render(
            <BrowserRouter>
                <MockedProvider mocks={mocks}>
                    <History />
                </MockedProvider>
            </BrowserRouter>
        );
        screen.debug(undefined, Infinity);
        expect(screen.getByTestId('loading')).toBeInTheDocument();

});
test('renders with upload history data', async() => {
    render(
        <BrowserRouter>
                <MockedProvider mocks={mocks}>
                    <History />
                </MockedProvider>
            </BrowserRouter>
    );
   expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    jest.spyOn(React, 'useEffect').mockImplementationOnce((f) => f());
    await waitFor(()=>{
        expect(screen.getByText('file1.xlsx')).toBeInTheDocument();
        expect(screen.getByText('2023-09-23 12:34:56')).toBeInTheDocument();
        expect(screen.getByText('50/100 Uploaded')).toBeInTheDocument();
    
    })
     });
// test('getStatusTextClass returns the correct class for "Success"', () => {
//     const uploadStatus = 'Sucess';
//     const result = getStatusTextClass(uploadStatus);
//     expect(result).toBe('success-text');
//   });
  
//   test('getStatusTextClass returns the correct class for "Failed"', () => {
//     const uploadStatus = 'Failed';
//     const result = getStatusTextClass(uploadStatus);
//     expect(result).toBe('failed-text');
//   });
  
});