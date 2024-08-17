const { render, screen } = require("@testing-library/react");
const { MockedProvider } = require('@apollo/client/testing');
import Pricing from "../Pricing";
import '@testing-library/jest-dom/extend-expect';

describe('<Pricing>', () => {
  test('renders or not', () => {
    render(
      <MockedProvider>
        <Pricing />
      </MockedProvider>
    );
    expect(screen.getByText('OUR PRICING')).toBeInTheDocument();
    const teams = screen.getAllByText('Teams')
    expect(teams[1]).toBeInTheDocument()
  });
});
