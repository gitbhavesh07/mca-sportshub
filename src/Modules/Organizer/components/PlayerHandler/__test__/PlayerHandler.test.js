import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "@testing-library/jest-dom/extend-expect";
import PlayerHandler from "../PlayerHandler";
import { CREATE_PLAYER, UPDATE_PLAYER } from "../../../../../Graphql/Mutation/Mutations";
import { FIND_AUCTION, FIND_ONE_PLAYER, GET_PRESIGNED_URL } from "../../../../../Graphql/Query/Querys";

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
      query: FIND_AUCTION,
      variables: {
        id: "5a71defd-ae16-4412-a405-8b128b3b9f66"
      }
    },
    result: {
      data: {
        findAuction: {
          id: "5a71defd-ae16-4412-a405-8b128b3b9f66",
          auctiontype: "cricket",
          auctionname: "EPL",
          auctiondate: "2023-10-05",
          pointsperteam: 12332,
          minbid: 120,
          bidincrease: 108,
          playerperteam: 12,
          filename: "images/1695373656-15e988c6-4925-479e-9f8b-78440fad4b55",
          category: [
            "Batting"
          ],
          user_id: "01caed56-3b26-486d-b320-f0ce9965c0c5",
          team: [],
          player: [],
          __typename: "Auction"
        }
      }
    }
  },
  {
    request: {
      query: GET_PRESIGNED_URL,
      variables: {
        filename: "uploads/1663027200-03dfa218-ce39-48e5-a4db-94c199ce5b8a",
      },
    },
    result: {
      data: {
        getSignerUrlForUpload:
          "https://sports-hub-images-bucket.s3.amazonaws.com/uploads/1663027200-03dfa218-ce39-48e5-a4db-94c199ce5b8a?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAWR5YOL66PTUTW2OW%2F20230922%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20230922T065836Z&X-Amz-Expires=3600&X-Amz-Signature=98aa06a5d7028ff8862c1a10123a5040a9ab5af4e649f7e5822d4ec8b1a29d22&X-Amz-SignedHeaders=host",
      },
    },
  },
  {
    request: {
      query: CREATE_PLAYER,
      variables: {
        createPlayerInput: {
          playername: "testing",
          address: "test",
          playercategory: "Batting",
          fathername: "test",
          mobilenumber: 8787656789,
          playerage: 25,
          playerfilename: "uploads/1663027200-03dfa218-ce39-48e5-a4db-94c199ce5b8a",
          trousersize: "M",
          tshirtsize: "M",
          auction_id: "5a71defd-ae16-4412-a405-8b128b3b9f66"
        }
      }
    },
    result: {
      data: {
        createPlayer: "Sucessfully Registered"
      }
    }
  }

]


const editMockData = [
  {
    request: {
      query: FIND_AUCTION,
      variables: {
        id: "5a71defd-ae16-4412-a405-8b128b3b9f66"
      }
    },
    result: {
      data: {
        findAuction: {
          id: "5a71defd-ae16-4412-a405-8b128b3b9f66",
          auctiontype: "cricket",
          auctionname: "EPL",
          auctiondate: "2023-10-05",
          pointsperteam: 12332,
          minbid: 120,
          bidincrease: 108,
          playerperteam: 12,
          filename: "images/1695373656-15e988c6-4925-479e-9f8b-78440fad4b55",
          category: [
            "Batting"
          ],
          user_id: "01caed56-3b26-486d-b320-f0ce9965c0c5",
          team: [],
          player: [],
          __typename: "Auction"
        }
      }
    }
  },
  {
    request: {
      query: FIND_ONE_PLAYER,
      variables: {
        id: "5a71defd-ae16-4412-a405-8b128b3b9f66",
      },
    },
    result: {
      data: {
        findOnePlayer: {
          playername: "test",
          address: "gvbhnjkm",
          playercategory: "Batting",
          fathername: "gvbhnj",
          mobilenumber: 9876545678,
          playerage: 23,
          playerfilename: "uploads/1695399201-67325634-6229-4bdd-96c7-a8078b8796e3",
          trousersize: "M",
          tshirtsize: "M",
          __typename: "Player"
        }
      }
    },
  },
  {
    request: {
      query: UPDATE_PLAYER,
      variables: {
        playerid: "5a71defd-ae16-4412-a405-8b128b3b9f66",
        updatePlayerInput: {
          playername: "test",
          address: "gvbhnjkm",
          playercategory: "Batting",
          fathername: "gvbhnj",
          mobilenumber: 9876545678,
          playerage: 23,
          playerfilename: "uploads/1695399201-67325634-6229-4bdd-96c7-a8078b8796e3",
          trousersize: "M",
          tshirtsize: "M",
          auction_id: "5a71defd-ae16-4412-a405-8b128b3b9f66"
        }
      },
    },
    result: {
      data: {
        updatePlayer: "Update Sucessfully"
      }
    },
  },
];

const editImageChangeMockData = [
  {
    request: {
      query: GET_PRESIGNED_URL,
      variables: {
        filename: "uploads/1663027200-03dfa218-ce39-48e5-a4db-94c199ce5b8a",
      },
    },
    result: {
      data: {
        getSignerUrlForUpload:
          "https://sports-hub-images-bucket.s3.amazonaws.com/uploads/1663027200-03dfa218-ce39-48e5-a4db-94c199ce5b8a?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAWR5YOL66PTUTW2OW%2F20230922%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20230922T065836Z&X-Amz-Expires=3600&X-Amz-Signature=98aa06a5d7028ff8862c1a10123a5040a9ab5af4e649f7e5822d4ec8b1a29d22&X-Amz-SignedHeaders=host",
      },
    },
  },
  {
    request: {
      query: FIND_AUCTION,
      variables: {
        id: "5a71defd-ae16-4412-a405-8b128b3b9f66"
      }
    },
    result: {
      data: {
        findAuction: {
          id: "5a71defd-ae16-4412-a405-8b128b3b9f66",
          auctiontype: "cricket",
          auctionname: "EPL",
          auctiondate: "2023-10-05",
          pointsperteam: 12332,
          minbid: 120,
          bidincrease: 108,
          playerperteam: 12,
          filename: "images/1695373656-15e988c6-4925-479e-9f8b-78440fad4b55",
          category: [
            "Batting"
          ],
          user_id: "01caed56-3b26-486d-b320-f0ce9965c0c5",
          team: [],
          player: [],
          __typename: "Auction"
        }
      }
    }
  },
  {
    request: {
      query: FIND_ONE_PLAYER,
      variables: {
        id: "5a71defd-ae16-4412-a405-8b128b3b9f66",
      },
    },
    result: {
      data: {
        findOnePlayer: {
          playername: "test",
          address: "gvbhnjkm",
          playercategory: "Batting",
          fathername: "gvbhnj",
          mobilenumber: 9876545678,
          playerage: 23,
          playerfilename: "uploads/1663027200-03dfa218-ce39-48e5-a4db-94c199ce5b8a",
          trousersize: "M",
          tshirtsize: "M",
          __typename: "Player"
        }
      }
    },
  },
  {
    request: {
      query: UPDATE_PLAYER,
      variables: {
        playerid: "5a71defd-ae16-4412-a405-8b128b3b9f66",
        updatePlayerInput: {
          playername: "test",
          address: "gvbhnjkm",
          playercategory: "Batting",
          fathername: "gvbhnj",
          mobilenumber: 9876545678,
          playerage: 23,
          playerfilename: "uploads/1663027200-03dfa218-ce39-48e5-a4db-94c199ce5b8a",
          trousersize: "M",
          tshirtsize: "M",
          auction_id: "5a71defd-ae16-4412-a405-8b128b3b9f66"
        }
      },
    },
    result: {
      data: {
        updatePlayer: "Update Sucessfully"
      }
    },
  },
];

describe("<PlayerHandler>", () => {
  const toastSuccessSpy = jest.spyOn(toast, "success");
  test("PlayerHandler Create Player sucess", async () => {
    render(
      <MemoryRouter initialEntries={[`/AddPlayer/${id}`]}>
        <Routes>
          <Route
            path="/AddPlayer/:id"
            element={
              <MockedProvider mocks={mockData}>
                <PlayerHandler editMode={false} />
              </MockedProvider>
            }
          ></Route>
        </Routes>
      </MemoryRouter>
    );
    screen.debug(undefined, Infinity);

    expect(screen.getByRole("button", { name: "ADD PLAYER" }));

    const playerName = screen.getByTestId("playerName");
    const mobileNo = screen.getByTestId("mobileNo");
    const playerFatherName = screen.getByTestId("playerFatherName");
    const age = screen.getByTestId("age");
    const category = screen.getAllByRole("combobox");
    const address = screen.getByTestId("address");
    const submitbutton = screen.getByRole("button", { name: "ADD PLAYER" });

    fireEvent.change(playerName, { target: { value: "testing" } });
    fireEvent.change(mobileNo, { target: { value: "8787656789" } });
    fireEvent.change(playerFatherName, { target: { value: "test" } });
    fireEvent.change(age, { target: { value: "25" } });
    fireEvent.change(address, { target: { value: "test" } });
    await new Promise(resolve => setTimeout(resolve, 2000))
    fireEvent.mouseDown(category[0]);
    fireEvent.click(screen.getByText("Batting"));
    fireEvent.change(category[0], { target: { value: "WicketKeeperBatsman" } })
    fireEvent.click(screen.getByText(`Create "WicketKeeperBatsman"`));
    fireEvent.mouseDown(category[1]);
    fireEvent.change(category[1], {
      target: { value: "M" },
    });
    fireEvent.mouseDown(category[2]);
    fireEvent.change(category[2], {
      target: { value: "M" },
    });
    window.URL.createObjectURL = jest.fn().mockImplementation(() => "url");
    const photo = screen.getByTestId("photo");
    const file = new File(["sample"], "sample.png", { type: "image/png" });
    Object.defineProperty(photo, "files", {
      value: [file],
    });
    fireEvent.change(photo);
    axios.put.mockResolvedValue({ status: 200 });
    fireEvent.click(submitbutton);
    await waitFor(() => {
      expect(toastSuccessSpy).toHaveBeenCalledWith("Player Added Sucessfully", {
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

  test("PlayerHandler Edit Player sucess", async () => {
    render(
      <MemoryRouter initialEntries={[`/EditPlayer/${id}/${id}`]}>
        <Routes>
          <Route
            path="/EditPlayer/:playerid/:id"
            element={
              <MockedProvider mocks={editMockData}>
                <PlayerHandler editMode={true} />
              </MockedProvider>
            }
          ></Route>
        </Routes>
      </MemoryRouter>
    );
    screen.debug(undefined, Infinity);
    await new Promise(resolve => setTimeout(resolve, 4000))
    const submitbutton = screen.getByRole("button", { name: "UPDATE PLAYER" });
    fireEvent.click(submitbutton);
    await waitFor(() => {
      expect(toastSuccessSpy).toHaveBeenCalledWith("Player Updated Successfully!", {
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

  test("PlayerHandler Edit Player sucess with image change", async () => {
    render(
      <MemoryRouter initialEntries={[`/EditPlayer/${id}/${id}`]}>
        <Routes>
          <Route
            path="/EditPlayer/:playerid/:id"
            element={
              <MockedProvider mocks={editImageChangeMockData}>
                <PlayerHandler editMode={true} />
              </MockedProvider>
            }
          ></Route>
        </Routes>
      </MemoryRouter>
    );
    screen.debug(undefined, Infinity);
    await new Promise(resolve => setTimeout(resolve, 2000))
    const submitbutton = screen.getByRole("button", { name: "UPDATE PLAYER" });
    window.URL.createObjectURL = jest.fn().mockImplementation(() => "url");
    const photo = screen.getByTestId("photo");
    const file = new File(["sample"], "sample.png", { type: "image/png" });
    Object.defineProperty(photo, "files", {
      value: [file],
    });
    fireEvent.change(photo);
    axios.put.mockResolvedValue({ status: 200 });
    fireEvent.click(submitbutton);
    await waitFor(() => {
      expect(toastSuccessSpy).toHaveBeenCalledWith("Player Updated Successfully!", {
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


})