import { BrowserRouter } from "react-router-dom";
import { MockedProvider } from "@apollo/client/testing";
import { render, screen, waitFor} from "@testing-library/react";
import { SHOW_TEAM } from "../../../../../Graphql/Query/Querys";
import ShowAuctionTeamList from '../ShowAuctionTeamList';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    auctionId: "5a71defd-ae16-4412-a405-8b128b3b9f66",
  })
}));


const mockData = [
    {
        request:{
            query:SHOW_TEAM,
            variables:{
                id: "5a71defd-ae16-4412-a405-8b128b3b9f66"
              }
        },
        result:{
            data: {
                "showTeam": [
                        {
                            "id": "d0aa8d7c-a04a-4cde-afbc-2e2955086f23",
                            "teamfilename": "images/1695472540-e1128f11-3225-4995-a04e-ca677f27bf9a",
                            "teamshortname": "t1",
                            "availablepoints": 12332,
                            "playercount": 1,
                        },
                        {
                            "id": "653ce555-db3e-4dcd-b43f-d42d38eef4f5",
                            "teamfilename": "images/1695472559-6e6a2dcd-9d75-4401-b031-5802e61ffffe",
                            "teamshortname": "t2",
                            "availablepoints": 12332,
                            "playercount": 0,
                        },]
                      }
                    }
    }
]

const NoTeamMockData = [
    {
        request:{
            query:SHOW_TEAM,
            variables:{
                id: "5a71defd-ae16-4412-a405-8b128b3b9f66"
              }
        },
        result:{
            "data": {
                "showTeam": []
            }
        }
    }
]
describe("<ShowAuctionTeamList>", () => {
    test("Teams", async () => {
        render(
          <BrowserRouter>
            <MockedProvider mocks={mockData} addTypename={false}>
              <ShowAuctionTeamList />
            </MockedProvider>
          </BrowserRouter>
        );
        screen.debug(undefined, Infinity);
        await waitFor(()=>{
          expect(screen.getByText('t1')).toBeInTheDocument;
        })
      });
    
      test("No Teams", async () => {
        render(
          <BrowserRouter>
            <MockedProvider mocks={NoTeamMockData} addTypename={false}>
              <ShowAuctionTeamList />
            </MockedProvider>
          </BrowserRouter>
        );
        await waitFor(()=>{
      expect(screen.getByText("No data found")).toBeInTheDocument;
      });
    });
    });