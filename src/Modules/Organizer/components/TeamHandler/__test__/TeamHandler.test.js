import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "@testing-library/jest-dom/extend-expect";
import TeamHandler from "../TeamHandler";
import { CREATE_TEAM, UPDATE_TEAM } from "../../../../../Graphql/Mutation/Mutations";
import {
  FIND_TEAM,
  GET_PRESIGNED_URL,
} from "../../../../../Graphql/Query/Querys";

jest.mock("axios");
jest.mock("../../../../../App", () => ({
  useUserContext: () => ({
    setHeader: jest.fn(),
    componentRef: jest.fn(),
  }),
}));

jest.mock("moment", () => {
  return () => jest.requireActual("moment")("2022-09-13T00:00:00.000Z");
});
jest.mock("uuid", () => ({ v4: () => "03dfa218-ce39-48e5-a4db-94c199ce5b8a" }));
const id = "5a71defd-ae16-4412-a405-8b128b3b9f66";
const mockData = [
  {
    request: {
      query: GET_PRESIGNED_URL,
      variables: {
        filename: "images/1663027200-03dfa218-ce39-48e5-a4db-94c199ce5b8a",
      },
    },
    result: {
      data: {
        getSignerUrlForUpload:
          "https://sports-hub-images-bucket.s3.amazonaws.com/images/1663027200-03dfa218-ce39-48e5-a4db-94c199ce5b8a?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAWR5YOL66PTUTW2OW%2F20230922%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20230922T065836Z&X-Amz-Expires=3600&X-Amz-Signature=98aa06a5d7028ff8862c1a10123a5040a9ab5af4e649f7e5822d4ec8b1a29d22&X-Amz-SignedHeaders=host",
      },
    },
  },
  {
    request: {
      query: CREATE_TEAM,
      variables: {
        createTeamInput: {
          teamname: "ChennaiSuperKings",
          teamfilename:
            "images/1663027200-03dfa218-ce39-48e5-a4db-94c199ce5b8a",
          teamshortcutkey: "C",
          teamshortname: "CSK",
          auction_id: "5a71defd-ae16-4412-a405-8b128b3b9f66",
        },
      },
    },
    result: {
      data: {
        createTeam: "Sucessfully Registered",
      },
    },
  },
];

const editMockData = [
  {
    request: {
      query: FIND_TEAM,
      variables: {
        id: "5a71defd-ae16-4412-a405-8b128b3b9f66",
      },
    },
    result: {
      data: {
        findTeam: {
          teamname: "fcgvbhnj",
          teamfilename:
            "images/1695384078-bb4ff2d1-c9a8-41b2-b70f-cffb0ac9d832",
          playercount: 0,
          teamshortname: "fgg",
          teamshortcutkey: "C",
          player: [],
          __typename: "Team",
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_TEAM,
      variables: {
        teamid: "5a71defd-ae16-4412-a405-8b128b3b9f66",
        updateTeamInput: {
          teamname: "fcgvbhnj",
          teamshortname: "fgg",
          teamfilename:
            "images/1695384078-bb4ff2d1-c9a8-41b2-b70f-cffb0ac9d832",
          teamshortcutkey: "C",
        },
      },
    },
    result: {
      data: {
        updateTeam: "Updated Sucessfully",
      },
    },
  },
];

const editImageChangeMockData = [
    {
        request: {
          query: GET_PRESIGNED_URL,
          variables: {
            filename: "images/1663027200-03dfa218-ce39-48e5-a4db-94c199ce5b8a",
          },
        },
        result: {
          data: {
            getSignerUrlForUpload:
              "https://sports-hub-images-bucket.s3.amazonaws.com/images/1663027200-03dfa218-ce39-48e5-a4db-94c199ce5b8a?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAWR5YOL66PTUTW2OW%2F20230922%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20230922T065836Z&X-Amz-Expires=3600&X-Amz-Signature=98aa06a5d7028ff8862c1a10123a5040a9ab5af4e649f7e5822d4ec8b1a29d22&X-Amz-SignedHeaders=host",
          },
        },
      },
      {
        request: {
          query: FIND_TEAM,
          variables: {
            id: "5a71defd-ae16-4412-a405-8b128b3b9f66",
          },
        },
        result: {
          data: {
            findTeam: {
              teamname: "fcgvbhnj",
              teamfilename:
                "images/1695384078-bb4ff2d1-c9a8-41b2-b70f-cffb0ac9d832",
              playercount: 0,
              teamshortname: "fgg",
              teamshortcutkey: "C",
              player: [],
              __typename: "Team",
            },
          },
        },
      },
      {
        request: {
          query: UPDATE_TEAM,
          variables: {
            teamid: "5a71defd-ae16-4412-a405-8b128b3b9f66",
            updateTeamInput: {
              teamname: "fcgvbhnj",
              teamshortname: "fgg",
              teamfilename:
                "images/1663027200-03dfa218-ce39-48e5-a4db-94c199ce5b8a",
              teamshortcutkey: "C",
            },
          },
        },
        result: {
          data: {
            updateTeam: "Updated Sucessfully",
          },
        },
      }
  ];

describe("<TeamHandler>", () => {
  const toastSuccessSpy = jest.spyOn(toast, "success");
  test("TeamHandler Create team sucess", async () => {
    render(
      <MemoryRouter initialEntries={[`/AddTeam/${id}`]}>
        <Routes>
          <Route
            path="/AddTeam/:id"
            element={
              <MockedProvider mocks={mockData}>
                <TeamHandler editMode={false} />
              </MockedProvider>
            }
          ></Route>
        </Routes>
      </MemoryRouter>
    );
    screen.debug(undefined, Infinity);
    expect(screen.getByRole("button", { name: "ADD TEAM" }));

    const teamname = screen.getByTestId("teamname");
    const teamshortname = screen.getByTestId("teamshortname");
    const shortcutkey = screen.getByTestId("shortcutkey");
    const submitbutton = screen.getByRole("button", { name: "ADD TEAM" });

    fireEvent.change(teamname, {
      target: { value: "ChennaiSuperKings" },
    });
    fireEvent.change(teamshortname, {
      target: { value: "CSK" },
    });
    fireEvent.mouseDown(shortcutkey);
    fireEvent.click(screen.getByText("C"));
    fireEvent.change(shortcutkey, {
      target: { value: "C" },
    });
    window.URL.createObjectURL = jest.fn().mockImplementation(() => "url");
    const photo = screen.getByTestId("photo");
    const file = new File(["sample"], "sample.png", { type: "image/png" });
    Object.defineProperty(photo, "files", {
      value: [file],
    });
    fireEvent.change(photo);
    fireEvent.click(submitbutton);

    axios.put.mockResolvedValue({ status: 200 });
    await new Promise((resolve) => setTimeout(resolve, 3000));

    await waitFor(() => {
      expect(toastSuccessSpy).toHaveBeenCalledWith("Team Created Sucessfully", {
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

  test("TeamHandler Edit team sucess", async () => {
    render(
      <MemoryRouter initialEntries={[`/EditTeam/${id}`]}>
        <Routes>
          <Route
            path="/EditTeam/:team_id"
            element={
              <MockedProvider mocks={editMockData} addTypename={false}>
                <TeamHandler editMode={true} />
              </MockedProvider>
            }
          ></Route>
        </Routes>
      </MemoryRouter>
    );
    screen.debug(undefined, Infinity);
    await new Promise(resolve => setTimeout(resolve,3000))
    expect(screen.getByRole("button", { name: "UPDATE TEAM" }));

    const submitbutton = screen.getByRole("button", { name: "UPDATE TEAM" });

    // window.URL.createObjectURL = jest.fn().mockImplementation(() => "url");
    // const photo = screen.getByTestId("photo");
    // const file = new File(["sample"], "sample.png", { type: "image/png" });
    // Object.defineProperty(photo, "files", {
    //   value: [file],
    // });
    // fireEvent.change(photo);
    fireEvent.click(submitbutton);

    // axios.put.mockResolvedValue({ status: 200 });
    // await new Promise(resolve => setTimeout(resolve,3000))

    await waitFor(() => {
      expect(toastSuccessSpy).toHaveBeenCalledWith(
        "Team Updated successfully!",
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
    });
  });

  test("TeamHandler Edit team sucess", async () => {
    render(
      <MemoryRouter initialEntries={[`/EditTeam/${id}`]}>
        <Routes>
          <Route
            path="/EditTeam/:team_id"
            element={
              <MockedProvider mocks={editImageChangeMockData} addTypename={false}>
                <TeamHandler editMode={true} />
              </MockedProvider>
            }
          ></Route>
        </Routes>
      </MemoryRouter>
    );
    screen.debug(undefined, Infinity);
    await new Promise(resolve => setTimeout(resolve,3000))
    expect(screen.getByRole("button", { name: "UPDATE TEAM" }));

    const submitbutton = screen.getByRole("button", { name: "UPDATE TEAM" });

    window.URL.createObjectURL = jest.fn().mockImplementation(() => "url");
    const photo = screen.getByTestId("photo");
    const file = new File(["sample"], "sample.png", { type: "image/png" });
    Object.defineProperty(photo, "files", {
      value: [file],
    });
    fireEvent.change(photo);
    axios.put.mockResolvedValue({ status: 200 });
    fireEvent.click(submitbutton);
    // await new Promise(resolve => setTimeout(resolve,3000))
    await waitFor(() => {
      expect(toastSuccessSpy).toHaveBeenCalledWith(
        "Team Updated successfully!",
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
    });
  });



});
