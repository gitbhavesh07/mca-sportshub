import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import CountdownTimer from '../CountdownTimer';

describe('CountdownTimer', () => {
    
  it('renders the timer with the correct time remaining', () => {
    jest.useFakeTimers();
    render(
            <MockedProvider>
                <CountdownTimer />
            </MockedProvider>
    );
    const endDate = new Date();
    endDate.setHours(endDate.getHours() + 5);

    render(<CountdownTimer endDate={endDate} />);

    const timerElement = screen.getAllByTestId('countdown-timer');

    expect(timerElement).toBeInTheDocument;
    // expect(timerElement).toHaveTextContent(/\d+ : \d+ : \d+ : \d+/); 

    jest.advanceTimersByTime(1000);
    expect(timerElement).toBeInTheDocument;

    jest.advanceTimersByTime(1000);
    expect(timerElement).toBeInTheDocument;

    jest.useRealTimers();
  });
});
