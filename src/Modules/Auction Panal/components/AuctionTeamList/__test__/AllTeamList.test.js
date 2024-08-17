import { BrowserRouter } from "react-router-dom";
import { MockedProvider } from "@apollo/client/testing";
import { render, screen} from "@testing-library/react";
import { FIND_AUCTION } from "../../../../../Graphql/Query/Querys";
import TeamList from "../TeamList";

jest.mock("../../../../../App", () => ({
    useUserContext: () => ({
      auctionId: "5a71defd-ae16-4412-a405-8b128b3b9f66",
    }),
  }));

const mockData = [
    {
        request:{
            query:FIND_AUCTION,
            variables:{
                id: "5a71defd-ae16-4412-a405-8b128b3b9f66"
              }
        },
        result:{
            "data": {
                "findAuction": {
                    "id": "5a71defd-ae16-4412-a405-8b128b3b9f66",
                    "auctiontype": "cricket",
                    "auctionname": "EPL",
                    "auctiondate": "2023-09-23",
                    "pointsperteam": 12332,
                    "minbid": 120,
                    "bidincrease": 108,
                    "playerperteam": 12,
                    "filename": "images/1695373656-15e988c6-4925-479e-9f8b-78440fad4b55",
                    "category": [
                        "Batting",
                        "Bowling"
                    ],
                    "user_id": "01caed56-3b26-486d-b320-f0ce9965c0c5",
                    "team": [
                        {
                            "id": "d0aa8d7c-a04a-4cde-afbc-2e2955086f23",
                            "teamname": "test1",
                            "teamshortname": "t1",
                            "teamshortcutkey": "L",
                            "availablepoints": 12332,
                            "no_of_players": 12,
                            "playercount": 1,
                            "teamfilename": "images/1695472540-e1128f11-3225-4995-a04e-ca677f27bf9a",
                            "auction_id": "4245b74e-27d5-4da9-8d7b-49ae8b0ece4b",
                            "__typename": "Team"
                        },
                        {
                            "id": "653ce555-db3e-4dcd-b43f-d42d38eef4f5",
                            "teamname": "test2",
                            "teamshortname": "t2",
                            "teamshortcutkey": "J",
                            "availablepoints": 12332,
                            "no_of_players": 12,
                            "playercount": 0,
                            "teamfilename": "images/1695472559-6e6a2dcd-9d75-4401-b031-5802e61ffffe",
                            "auction_id": "4245b74e-27d5-4da9-8d7b-49ae8b0ece4b",
                            "__typename": "Team"
                        }
                    ],
                    "player": [
                        {
                            "id": "2397",
                            "playername": "test",
                            "mobilenumber": 9876545678,
                            "fathername": "gvbhnj",
                            "playerage": 23,
                            "playercategory": "Batting",
                            "trousersize": "M",
                            "address": "gvbhnjkm",
                            "auction_id": "4245b74e-27d5-4da9-8d7b-49ae8b0ece4b",
                            "playerstatus": "SOLD",
                            "team_id": "653ce555-db3e-4dcd-b43f-d42d38eef4f5",
                            "playerfilename": "",
                            "__typename": "Player"
                        },
                        {
                            "id": "2398",
                            "playername": "tset2",
                            "mobilenumber": 7678987656,
                            "fathername": "test",
                            "playerage": 12,
                            "playercategory": "Batting",
                            "trousersize": "M",
                            "address": "test",
                            "auction_id": "4245b74e-27d5-4da9-8d7b-49ae8b0ece4b",
                            "playerstatus": null,
                            "team_id": null,
                            "playerfilename": "uploads/1695472478-f9e1222e-9a6b-4d84-9804-df4fa474114e",
                            "__typename": "Player"
                        },
                        {
                            "id": "2399",
                            "playername": "tset2",
                            "mobilenumber": 7678987656,
                            "fathername": "test",
                            "playerage": 12,
                            "playercategory": "Batting",
                            "trousersize": "M",
                            "address": "test",
                            "auction_id": "4245b74e-27d5-4da9-8d7b-49ae8b0ece4b",
                            "playerstatus": 'SOLD',
                            "team_id": null,
                            "playerfilename": "uploads/1695472478-f9e1222e-9a6b-4d84-9804-df4fa474114e",
                            "__typename": "Player"
                        },
                        {
                            "id": "2400",
                            "playername": "tset2",
                            "mobilenumber": 7678987656,
                            "fathername": "test",
                            "playerage": 12,
                            "playercategory": "Batting",
                            "trousersize": "M",
                            "address": "test",
                            "auction_id": "4245b74e-27d5-4da9-8d7b-49ae8b0ece4b",
                            "playerstatus": 'UNSOLD',
                            "team_id": null,
                            "playerfilename": "uploads/1695472478-f9e1222e-9a6b-4d84-9804-df4fa474114e",
                            "__typename": "Player"
                        }
                    ],
                    "__typename": "Auction"
                }
            }
        }
    }
]

const NoTeamMockData = [
    {
        request:{
            query:FIND_AUCTION,
            variables:{
                id: "5a71defd-ae16-4412-a405-8b128b3b9f66"
              }
        },
        result:{
            "data": {
                "findAuction": {
                    "id": "5a71defd-ae16-4412-a405-8b128b3b9f66",
                    "auctiontype": "cricket",
                    "auctionname": "EPL",
                    "auctiondate": "2023-09-23",
                    "pointsperteam": 12332,
                    "minbid": 120,
                    "bidincrease": 108,
                    "playerperteam": 12,
                    "filename": "images/1695373656-15e988c6-4925-479e-9f8b-78440fad4b55",
                    "category": [
                        "Batting",
                        "Bowling"
                    ],
                    "user_id": "01caed56-3b26-486d-b320-f0ce9965c0c5",
                    "team": [],
                    "player": [],
                    "__typename": "Auction"
                }
            }
        }
    }
]
describe("<ActionPanel AllPlayers>", () => {
    test("Unsold Players", async () => {
        render(
          <BrowserRouter>
            <MockedProvider mocks={mockData} addTypename={false}>
              <TeamList />
            </MockedProvider>
          </BrowserRouter>
        );
        screen.debug(undefined, Infinity);
        await new Promise(resolve => setTimeout(resolve,2000))
      });
    
      test("No Players", async () => {
        render(
          <BrowserRouter>
            <MockedProvider mocks={NoTeamMockData} addTypename={false}>
              <TeamList UnSoldPlayer={true} />
            </MockedProvider>
          </BrowserRouter>
        );
        screen.debug(undefined, Infinity);
        await new Promise(resolve => setTimeout(resolve,2000))
        expect(screen.findByText("No data found"));
      });
    });