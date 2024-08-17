import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import ForgotPassword from '../ForgotPassword';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { FORGOT_PASSWORD, SET_PASSWORD } from '../../../../../Graphql/Mutation/Mutations';
import { toast } from 'react-toastify';
import '@testing-library/jest-dom/extend-expect';

const mocks = [
    {
        request: {
            query: FORGOT_PASSWORD,
            variables: {
                email: 'nithishkumar121212m@gmail.com',
            },
        },
        result: {
            data: {
                forgotPassword: true,
            },
        },
    },
    {
        request: {
            query: SET_PASSWORD,
            variables: {
                updatePasswordInputs: {
                    email: 'nithishkumar121212m@gmail.com',
                    newpassword: 'Nithish@03',
                    verifycode: '12345'
                }
            },
        },
        result: {
            data: {
                setPassword: true,
            },
        },
    },
    {
        request: {
            query: SET_PASSWORD,
            variables: {
                updatePasswordInputs: {
                    email: 'nithishkumar121212m@gmail.com',
                    newpassword: 'Nithish@03',
                    verifycode: '1234'
                }
            },
        },
        result: {
            errors: {
                message: "Cannot read properties of null (reading 'setPassword')",
            },
            data: null,
        },
    },
];

const toastSuccesSpy = jest.spyOn(toast, 'success');
const toastErrorSpy = jest.spyOn(toast, 'error');


describe('<ForgotPassword>', () => {
    test('required email', async () => {
        const error = { email: '' };
        render(
            <MemoryRouter>
                <MockedProvider error={error}>
                    <ForgotPassword />
                </MockedProvider>
            </MemoryRouter>
        );

        const emailInput = screen.getByPlaceholderText('E-Mail');
        const submitButton = screen.getByText('SUBMIT');

        fireEvent.change(emailInput, { target: { value: '' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            const emailError = screen.getByText('Email is required');
            expect(emailError).toBeInTheDocument();
            expect(emailError).toHaveClass('invalid-feedback');
        });
    });

    test('invalid email', async () => {
        const error = { email: '' };
        render(
            <MemoryRouter>
                <MockedProvider error={error}>
                    <ForgotPassword />
                </MockedProvider>
            </MemoryRouter>
        );

        const emailInput = screen.getByPlaceholderText('E-Mail');
        const submitButton = screen.getByText('SUBMIT');

        fireEvent.change(emailInput, { target: { value: 'test@gmail' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            const emailError = screen.getByText('Email is invalid');
            expect(emailError).toBeInTheDocument();
            expect(emailError).toHaveClass('invalid-feedback');
        });
    });

    test('submits email and required password', async () => {
        const errors = { 
            Npassword: {message: ''},
            Cpassword: {message: ''},
            verificationCode: {message: ''},
        };

        render(
            <MemoryRouter>
                <MockedProvider mocks={mocks} errors={errors}>
                    <ForgotPassword />
                </MockedProvider>
            </MemoryRouter>
        );

        const emailInput = screen.getByPlaceholderText('E-Mail');
        const submitButton = screen.getByText('SUBMIT');

        fireEvent.change(emailInput, { target: { value: 'nithishkumar121212m@gmail.com' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(toastSuccesSpy).toHaveBeenCalledWith('Mail Send Sucessfully', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'dark'
            });
        });

        const newPasswordPlaceHolder = screen.getByPlaceholderText('New Password');
        const conformPasswordPlaceHolder = screen.getByPlaceholderText('Conform Password');
        const otpPlaceHolder = screen.getByPlaceholderText('OTP');
        const passwordUpdateButton = screen.getByText('SUBMIT');

        fireEvent.change(newPasswordPlaceHolder, { target: { value: '' } });
        fireEvent.change(conformPasswordPlaceHolder, { target: { value: '' } });
        fireEvent.change(otpPlaceHolder, { target: { value: '' } });
        fireEvent.click(passwordUpdateButton);

        await waitFor(() => {
            const NpasswordError = screen.getByText('Npassword is required');
            expect(NpasswordError).toBeInTheDocument();
            expect(NpasswordError).toHaveClass('Npassword-box-visible');
        });
    });
    
    test('Resend OTP', async () => {
        render(
            <MemoryRouter>
                <MockedProvider mocks={mocks}>
                    <ForgotPassword />
                </MockedProvider>
            </MemoryRouter>
        );

        const emailInput = screen.getByPlaceholderText('E-Mail');
        const submitButton = screen.getByText('SUBMIT');

        fireEvent.change(emailInput, { target: { value: 'nithishkumar121212m@gmail.com' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(toastSuccesSpy).toHaveBeenCalledWith('Mail Send Sucessfully', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'dark'
            });
        });

        const handleReSend = screen.getByTestId('handleReSend');
        fireEvent.click(handleReSend);

        await waitFor(() => {
            expect(toastSuccesSpy).toHaveBeenCalledWith('Mail Send Sucessfully', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'dark'
            });
        });
    });

    test('submits password success toast', async () => {
        render(
            <MemoryRouter>
                <MockedProvider mocks={mocks}>
                    <ForgotPassword />
                </MockedProvider>
            </MemoryRouter>
        );

        const emailInput = screen.getByPlaceholderText('E-Mail');
        const submitButton = screen.getByText('SUBMIT');

        fireEvent.change(emailInput, { target: { value: 'nithishkumar121212m@gmail.com' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(toastSuccesSpy).toHaveBeenCalledWith('Mail Send Sucessfully', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'dark'
            });
        });

        const newPasswordPlaceHolder = screen.getByPlaceholderText('New Password');
        const toggleNPasswordVisibility = screen.getByTestId('toggleNPasswordVisibility');
        expect(newPasswordPlaceHolder).toHaveAttribute('type', 'password');
        fireEvent.click(toggleNPasswordVisibility);
        expect(newPasswordPlaceHolder).toHaveAttribute('type', 'text');

        const conformPasswordPlaceHolder = screen.getByPlaceholderText('Conform Password');
        const toggleCPasswordVisibility = screen.getByTestId('toggleCPasswordVisibility');
        expect(conformPasswordPlaceHolder).toHaveAttribute('type', 'password');
        fireEvent.click(toggleCPasswordVisibility);
        expect(newPasswordPlaceHolder).toHaveAttribute('type', 'text');

        const otpPlaceHolder = screen.getByPlaceholderText('OTP');
        const passwordUpdateButton = screen.getByText('SUBMIT');

        fireEvent.change(newPasswordPlaceHolder, { target: { value: 'Nithish@03' } });
        fireEvent.change(conformPasswordPlaceHolder, { target: { value: 'Nithish@03' } });
        fireEvent.change(otpPlaceHolder, { target: { value: '12345' } });
        fireEvent.click(passwordUpdateButton);

        await waitFor(() => {
            expect(toastSuccesSpy).toHaveBeenCalledWith('Password Changed Sucessfully', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'dark'
            });
        });
    });

    test('submits password error toast', async () => {
        render(
            <MemoryRouter>
                <MockedProvider mocks={mocks}>
                    <ForgotPassword />
                </MockedProvider>
            </MemoryRouter>
        );

        const emailInput = screen.getByPlaceholderText('E-Mail');
        const submitButton = screen.getByText('SUBMIT');

        fireEvent.change(emailInput, { target: { value: 'nithishkumar121212m@gmail.com' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(toastSuccesSpy).toHaveBeenCalledWith('Mail Send Sucessfully', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'dark'
            });
        });

        const newPasswordPlaceHolder = screen.getByPlaceholderText('New Password');
        const toggleNPasswordVisibility = screen.getByTestId('toggleNPasswordVisibility');
        expect(newPasswordPlaceHolder).toHaveAttribute('type', 'password');
        fireEvent.click(toggleNPasswordVisibility);
        expect(newPasswordPlaceHolder).toHaveAttribute('type', 'text');

        const conformPasswordPlaceHolder = screen.getByPlaceholderText('Conform Password');
        const toggleCPasswordVisibility = screen.getByTestId('toggleCPasswordVisibility');
        expect(conformPasswordPlaceHolder).toHaveAttribute('type', 'password');
        fireEvent.click(toggleCPasswordVisibility);
        expect(newPasswordPlaceHolder).toHaveAttribute('type', 'text');

        const otpPlaceHolder = screen.getByPlaceholderText('OTP');
        const passwordUpdateButton = screen.getByText('SUBMIT');

        fireEvent.change(newPasswordPlaceHolder, { target: { value: 'Nithish@03' } });
        fireEvent.change(conformPasswordPlaceHolder, { target: { value: 'Nithish@03' } });
        fireEvent.change(otpPlaceHolder, { target: { value: '1234' } });
        fireEvent.click(passwordUpdateButton);

        await waitFor(() => {
            expect(toastErrorSpy).toHaveBeenCalledWith("Cannot read properties of null (reading 'setPassword')", {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'dark'
            });
        });
    });
});