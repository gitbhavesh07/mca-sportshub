import PlayerListHeader from "../PlayerListHeader";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { MockedProvider } from "@apollo/client/testing";

describe("<PlayerListHeader>", () => {
  test("Header", async () => {
    render(
      <BrowserRouter>
        <MockedProvider>
          <PlayerListHeader />
        </MockedProvider>
      </BrowserRouter>
    );
    expect(screen.getByText("All Players"));
    expect(screen.getByText("Available Players"));
    expect(screen.getByText("Sold Players"));
    expect(screen.getByText("Unsold Players"));
  });
});
