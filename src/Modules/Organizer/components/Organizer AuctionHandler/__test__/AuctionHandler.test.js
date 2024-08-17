import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router-dom";
import AuctionHandler from "../AuctionHandler";
import {
  FIND_AUCTION,
  GET_PRESIGNED_URL,
} from "../../../../../Graphql/Query/Querys";
import { CREATE_AUCTION, UPDATE_AUCTION } from "../../../../../Graphql/Mutation/Mutations";
import { toast } from "react-toastify";
import axios from "axios";
jest.mock("axios");

jest.mock("../../../../../App", () => ({
  useUserContext: () => ({
    setHeader: jest.fn(),
    componentRef: jest.fn(),
    userId: "b2deab99-beb3-4a43-81ba-e475b32463d9",
  }),
}));

jest.mock("moment", () => {
  return () => jest.requireActual("moment")("2022-09-13T00:00:00.000Z");
});
jest.mock("uuid", () => ({ v4: () => "03dfa218-ce39-48e5-a4db-94c199ce5b8a" }));
// jest.spyOn(global, 'Date').mockReturnValue({now:jest.fn().mockReturnValue('1632268800000')});
// jest.spyOn(Date, () => {
//     return () => jest.requireActual(Date)('1632268800000');
//     });
// Date.now = jest.fn(()=>1632268800000)
const id = "4245b74e-27d5-4da9-8d7b-49ae8b0ece4b";

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
      query: CREATE_AUCTION,
      variables: {
        createAuctionInput: {
          auctiondate: "2023-12-31",
          auctionname: "IPL",
          auctiontype: "cricket",
          bidincrease: 122,
          filename: "images/1663027200-03dfa218-ce39-48e5-a4db-94c199ce5b8a",
          minbid: 200,
          playerperteam: 12,
          pointsperteam: 12345,
          category: ["Batting"],
          user_id: "b2deab99-beb3-4a43-81ba-e475b32463d9",
        },
      },
    },
    result: {
      data: {
        createAuction: "Sucessfully Registered",
      },
    },
  },
];

const editMockData = [
  {
    request: {
      query: FIND_AUCTION,
      variables: {
        id: "4245b74e-27d5-4da9-8d7b-49ae8b0ece4b",
      },
    },
    result: {
      data: {
        findAuction: {
          id: "4245b74e-27d5-4da9-8d7b-49ae8b0ece4b",
          auctiontype: "cricket",
          auctionname: "EPL",
          auctiondate: "2023-10-05",
          pointsperteam: 12332,
          minbid: 120,
          bidincrease: 108,
          playerperteam: 12,
          filename: "images/1695373656-15e988c6-4925-479e-9f8b-78440fad4b55",
          category: ["Batting"],
          user_id: "b2deab99-beb3-4a43-81ba-e475b32463d9",
          team: [],
          player: [],
          __typename: "Auction",
        },
      },
    },
  },
  {
    request:{
        query:UPDATE_AUCTION,
        variables:{
            auctionid: "4245b74e-27d5-4da9-8d7b-49ae8b0ece4b",
            updateAuctionInput: {
              auctiondate: "2023-10-05",
              auctionname: "EPL",
              auctiontype: "cricket",
              bidincrease: 108,
              filename: "images/1695373656-15e988c6-4925-479e-9f8b-78440fad4b55",
              minbid: 120,
              playerperteam: 12,
              pointsperteam: 12332,
              category: [
                "Batting"
              ]
            }
          }
    },
    result:{
        data: {
          updateAuction: "Updated Sucessfully"
        }
      }
  }
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
        query: FIND_AUCTION,
        variables: {
          id: "4245b74e-27d5-4da9-8d7b-49ae8b0ece4b",
        },
      },
      result: {
        data: {
          findAuction: {
            id: "4245b74e-27d5-4da9-8d7b-49ae8b0ece4b",
            auctiontype: "cricket",
            auctionname: "EPL",
            auctiondate: "2023-10-05",
            pointsperteam: 12332,
            minbid: 120,
            bidincrease: 108,
            playerperteam: 12,
            filename: "images/1695373656-15e988c6-4925-479e-9f8b-78440fad4b55",
            category: ["Batting"],
            user_id: "b2deab99-beb3-4a43-81ba-e475b32463d9",
            team: [],
            player: [],
            __typename: "Auction",
          },
        },
      },
    },
    {
      request:{
          query:UPDATE_AUCTION,
          variables:{
              auctionid: "4245b74e-27d5-4da9-8d7b-49ae8b0ece4b",
              updateAuctionInput: {
                auctiondate: "2023-10-05",
                auctionname: "EPL",
                auctiontype: "cricket",
                bidincrease: 108,
                filename: "images/1663027200-03dfa218-ce39-48e5-a4db-94c199ce5b8a",
                minbid: 120,
                playerperteam: 12,
                pointsperteam: 12332,
                category: [
                  "Batting"
                ]
              }
            }
      },
      result:{
          data: {
            updateAuction: "Updated Sucessfully"
          }
        }
    }
  ];

describe("<AuctionHandler>", () => {
  test("AuctionHandler create auction sucess", async () => {
    const toastSuccessSpy = jest.spyOn(toast, "success");
    render(
      <BrowserRouter>
        <MockedProvider mocks={mockData}>
          <AuctionHandler />
        </MockedProvider>
      </BrowserRouter>
    );
    screen.debug(undefined, Infinity);
    expect(screen.getByRole("button", { name: "ADD AUCTION" }));
    const auctionname = screen.getByTestId("auctionname");
    const auctiondate = screen.getByTestId("auctiondate");
    const pointsperteam = screen.getByTestId("pointsperteam");
    const minimumbid = screen.getByTestId("minimumbid");
    const bidincreaseby = screen.getByTestId("bidincreaseby");
    const playerperteam = screen.getByTestId("playerperteam");
    const category = screen.getAllByRole("combobox");
    const submitbutton = screen.getByRole("button", { name: "ADD AUCTION" });

   
    fireEvent.change(auctiondate, { target: { value: "2023-09-29" } });
   
    fireEvent.mouseDown(category[1]);
    fireEvent.click(screen.getByText("Batting"));
    fireEvent.change(category[1],{target:{value:"WicketKeeperBatsman"}})
    fireEvent.click(screen.getByText(`Create "WicketKeeperBatsman"`));
    screen.debug(undefined, Infinity);
    fireEvent.change(auctionname, {
      target: { value: "IPL" },
    });
    fireEvent.change(auctiondate, {
      target: { value: "2023-12-31" },
    });
    fireEvent.change(pointsperteam, {
      target: { value: "12345" },
    });
    fireEvent.change(minimumbid, {
      target: { value: "200" },
    });
    fireEvent.change(bidincreaseby, {
      target: { value: "122" },
    });
    fireEvent.change(playerperteam, {
      target: { value: "12" },
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

    await waitFor(() => {
      expect(toastSuccessSpy).toHaveBeenCalledWith(
        "Auction Created Successfully",
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

    await new Promise((resolve) => setTimeout(resolve, 5000));
    screen.debug(undefined, Infinity);
  }, 10000);

  test("AuctionHandler edit auction sucess", async () => {
    const toastSuccessSpy = jest.spyOn(toast, "success");
    render(
      <MemoryRouter initialEntries={[`/EditAuctions/${id}`]}>
        <Routes>
          <Route
            path="/EditAuctions/:id"
            element={
              <MockedProvider mocks={editMockData} addTypename={false}>
                <AuctionHandler editMode={true} />
              </MockedProvider>
            }
          ></Route>
        </Routes>
      </MemoryRouter>
    );
    screen.debug(undefined, Infinity);
      await new Promise(resolve => setTimeout(resolve,9000))
      const submitbutton = screen.getByRole('button',{name:"UPDATE AUCTION"});
    expect(screen.getByRole('button',{name:"UPDATE AUCTION"}));

    fireEvent.click(submitbutton)
    //   axios.put.mockResolvedValue({ status: 200 });

      await waitFor(()=>{

        expect(toastSuccessSpy).toHaveBeenCalledWith(
            "Auction Updated Successfully!",
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
  }, 10000);

  test("AuctionHandler edit auction sucess with image change", async () => {
    const toastSuccessSpy = jest.spyOn(toast, "success");
    render(
      <MemoryRouter initialEntries={[`/EditAuctions/${id}`]}>
        <Routes>
          <Route
            path="/EditAuctions/:id"
            element={
              <MockedProvider mocks={editImageChangeMockData} addTypename={false}>
                <AuctionHandler editMode={true} />
              </MockedProvider>
            }
          ></Route>
        </Routes>
      </MemoryRouter>
    );
    screen.debug(undefined, Infinity);
      await new Promise(resolve => setTimeout(resolve,3000))
      const submitbutton = screen.getByRole('button',{name:"UPDATE AUCTION"});
    expect(screen.getByRole('button',{name:"UPDATE AUCTION"}));
    window.URL.createObjectURL = jest.fn().mockImplementation(() => "url");
    const photo = screen.getByTestId("photo");
    const file = new File(["sample"], "sample.png", { type: "image/png" });
    Object.defineProperty(photo, "files", {
      value: [file],
    });
    fireEvent.change(photo);
    axios.put.mockResolvedValue({ status: 200 });
    fireEvent.click(submitbutton)
   
      await waitFor(()=>{

        expect(toastSuccessSpy).toHaveBeenCalledWith(
            "Auction Updated Successfully!",
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
});
