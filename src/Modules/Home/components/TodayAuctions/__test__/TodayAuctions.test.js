import { MemoryRouter } from "react-router";
import { MockedProvider } from "@apollo/client/testing";
import { fireEvent, render, screen,waitFor } from '@testing-library/react';
import TodayAuctions from '../TodayAuctions';
import '@testing-library/jest-dom/extend-expect';
import { TODAY_AUCTIONS } from "../../../../../Graphql/Query/Querys";

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'), // Use actual react-router-dom methods
    useNavigate: () => jest.fn(), // Mock useNavigate as a function
  }));

const mocks = [
    {
      request: {
        query: TODAY_AUCTIONS,
      },
      result: {
        data: {
          todayAuctions: [
            {
              id: 1,
              auctionname: 'Auction1',
              auctiondate: '2023-09-13',
              filename: '',
            },
          ],
        },
      },
    },
  ];
beforeAll(() => {
    window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: true,
        media: query,
    }));
});

describe('TodayAuctions', () => {
    test('data pass or not', async () => {

        render(
            <MemoryRouter>
                <MockedProvider mocks={mocks}>
                    <TodayAuctions />
                </MockedProvider>
            </MemoryRouter>

        );
        // screen.debug(undefined, Infinity);
        await waitFor(() => {
            const elements =document.getElementsByClassName('today-auction-name');
            expect(elements.length).toBe(mocks.length);
            for (let i = 0; i < elements.length; i++) {
                expect(elements[i]).toBeInTheDocument();
              }

        })
    })
    afterAll(() => {
        window.matchMedia.mockClear();
    });
    test('navigate button is clicked', async () => {
        render(
          <MemoryRouter>
            <MockedProvider mocks={mocks}>
              <TodayAuctions />
            </MockedProvider>
          </MemoryRouter>
        );
    
        await waitFor(() => {
          const button = screen.getByRole('button');
          expect(button).toBeInTheDocument();
          fireEvent.click(button);
        });
      });

      test('default profile found',async()=>{
        render(
            <MemoryRouter>
            <MockedProvider mocks={mocks}>
              <TodayAuctions />
            </MockedProvider>
          </MemoryRouter>
        );

        await waitFor(()=>{
            const ProfileImage = screen.getByRole('img');
            expect(ProfileImage).toBeInTheDocument();
                  
            const altname=screen.getByAltText('Auction1');
            expect(altname).toBeInTheDocument();
        })

      });

      test("displays all data when datas.length <= 3",async  () => {
        const { container } = render(
        <MemoryRouter>
            <MockedProvider mocks={mocks}>
                <TodayAuctions/>
                </MockedProvider>
          </MemoryRouter>);
          screen.debug(undefined, Infinity);
          await waitFor(()=>{
            expect(screen.getByTestId("div-tag")).toBeInTheDocument();
            fireEvent.click(screen.getByTestId("div-tag"));
          })
      });
});