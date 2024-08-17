import { MemoryRouter,Route,Routes } from "react-router-dom";
import { MockedProvider } from "@apollo/client/testing";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import IndividualTeamPlayers from "../IndividualTeamPlayers";
import { FIND_TEAM } from "../../../../../Graphql/Query/Querys";

const mockedUsedNavigate = jest.fn();
    jest.mock("react-router-dom", () => ({
      ...jest.requireActual("react-router-dom"),
      useNavigate: ()=> mockedUsedNavigate,
    }));

const mockData = [
  {
    request: {
      query: FIND_TEAM,
      variables: {
        id: "d0aa8d7c-a04a-4cde-afbc-2e2955086f23",
      },
    },
    result: {
      data: {
        findTeam: {
          teamname: "test1",
          teamfilename:
            "images/1695472540-e1128f11-3225-4995-a04e-ca677f27bf9a",
          playercount: 1,
          teamshortname: "t1",
          teamshortcutkey: "L",
          player: [
            {
              id: "2398",
              playername: "tset2",
              playerage: 12,
              playerfilename:
                "uploads/1695472478-f9e1222e-9a6b-4d84-9804-df4fa474114e",
              playercategory: "Batting",
              __typename: "Player",
            },
          ],
          __typename: "Team",
        },
      },
    },
  },
];

const NoPlayerMockData = [
    {
      request: {
        query: FIND_TEAM,
        variables: {
          id: "d0aa8d7c-a04a-4cde-afbc-2e2955086f23",
        },
      },
      result: {
        data: {
          findTeam: {
            teamname: "test1",
            teamfilename:
              "images/1695472540-e1128f11-3225-4995-a04e-ca677f27bf9a",
            playercount: 1,
            teamshortname: "t1",
            teamshortcutkey: "L",
            player: [],
            __typename: "Team",
          },
        },
      },
    },
  ];

const id = "d0aa8d7c-a04a-4cde-afbc-2e2955086f23";
describe("<IndividualTeamlayers>", () => {
  test("Individual Team Player List", async () => {
    render(
      <MemoryRouter initialEntries={[`/individualteamplayer/${id}`]}>
        <Routes>
          <Route
            path="/individualteamplayer/:id"
            element={
              <MockedProvider mocks={mockData}>
                <IndividualTeamPlayers />
              </MockedProvider>
            }
          ></Route>
        </Routes>
      </MemoryRouter>
    );
    screen.debug(undefined, Infinity);
    await new Promise(resolve => setTimeout(resolve,2000))
    expect(screen.getByRole("button", { name: "Go Back" }));
  });

  test("Individual Team No Player List", async () => {
    render(
      <MemoryRouter initialEntries={[`/individualteamplayer/${id}`]}>
        <Routes>
          <Route
            path="/individualteamplayer/:id"
            element={
              <MockedProvider mocks={NoPlayerMockData} addTypename={false}>
                <IndividualTeamPlayers />
              </MockedProvider>
            }
          ></Route>
        </Routes>
      </MemoryRouter>
    );
    screen.debug(undefined, Infinity);
    await new Promise(resolve => setTimeout(resolve,2000))
    expect(screen.getByRole("button", { name: "Go Back" }));
    const gobackbutton = screen.getByRole("button", { name: "Go Back" });
    expect(screen.getByText("No Players for this team"));
    fireEvent.click(gobackbutton);

    await waitFor(()=>{
        expect(mockedUsedNavigate).toHaveBeenCalled(); 
        expect(mockedUsedNavigate).toHaveBeenCalledWith(-1); 
        
      })
  });
});
