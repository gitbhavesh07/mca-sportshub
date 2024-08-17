import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import Contacts from "../Contacts";
import { toast } from 'react-toastify';
import { SEND_CONTACT_FORM } from '../../../../../Graphql/Mutation/Mutations';
import "@testing-library/jest-dom/extend-expect";


jest.mock('../../../../../App', () => ({
    useUserContext: () => ({
        generateCaptcha: jest.fn(),
        handleReloadCaptcha: jest.fn(),
        captchaValue: 'ABCDEF',
    }),
}));

const mocks = [
    {
        request: {
            query: SEND_CONTACT_FORM,
            variables: {
                createContactusInput: {
                    username: 'nithish',
                    email: 'nithish@gmail.com',
                    phonenumber: 9597512667,
                    message: 'HIII'
                }
            }
        },
        result: {
            data: {
                createContact: 'Your message send Successfully...',
            },
        },
    },
]

describe('<Contacts>', () => {
    const toastErrorSpy = jest.spyOn(toast, 'error');
    const toastSuccessSpy = jest.spyOn(toast, 'success');

    test('render and required error', async () => {
        const errors = { 
            name: {message: ''},
            email: {message:''},
            phoneNumber: {message: ''},
            message: {message: ''},
        };
        render(
            <MockedProvider>
                <Contacts errors={errors}/>
            </MockedProvider>
        );
        screen.debug(undefined, Infinity);

        const nameInput = screen.getByPlaceholderText('Your Name');
        const emailInput = screen.getByPlaceholderText('Your Email');
        const phoneInput = screen.getByPlaceholderText('Mobile No');
        const messageInput = screen.getByPlaceholderText('Message');
        // const captchaInput = screen.getByPlaceholderText('Fill Captcha');
        const sendButton = screen.getByText('Send Message');

        fireEvent.change(nameInput, { target: { value: '' } });
        fireEvent.change(emailInput, { target: { value: '' } });
        fireEvent.change(phoneInput, { target: { value: '' } });
        fireEvent.change(messageInput, { target: { value: '' } });
        // fireEvent.change(captchaInput, { target: { value: '' } });

        fireEvent.click(sendButton);

        // await waitFor(() => {
            const error = screen.getAllByText('*');
            error.forEach(text=>{
                expect(text).toBeInTheDocument();
            // })
        });
    });

    test('Display the captcha error toast', async () => {
        render(
            <MockedProvider>
                <Contacts />
            </MockedProvider>
        );
        screen.debug(undefined, Infinity);

        const nameInput = screen.getByPlaceholderText('Your Name');
        const emailInput = screen.getByPlaceholderText('Your Email');
        const phoneInput = screen.getByPlaceholderText('Mobile No');
        const messageInput = screen.getByPlaceholderText('Message');
        const captchaInput = screen.getByPlaceholderText('Fill Captcha');
        const sendButton = screen.getByText('Send Message');

        fireEvent.change(nameInput, { target: { value: 'nithish' } });
        fireEvent.change(emailInput, { target: { value: 'nithish@gmail.com' } });
        fireEvent.change(phoneInput, { target: { value: '9597512667' } });
        fireEvent.change(messageInput, { target: { value: 'HIII' } });
        fireEvent.change(captchaInput, { target: { value: 'abcdgf' } });
        expect(captchaInput.value).toBe('ABCDGF');

        fireEvent.click(sendButton);

        await waitFor(() => {
            expect(toastErrorSpy).toHaveBeenCalledWith('Captcha not matched, Please try Again!', {
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

    test('Display the api success toast', async () => {
        render(
            <MockedProvider mocks={mocks}>
                <Contacts />
            </MockedProvider>
        );
        screen.debug(undefined, Infinity);

        const reloadCaptcha = screen.getByText('click here');
        fireEvent.click(reloadCaptcha);

        const nameInput = screen.getByPlaceholderText('Your Name');
        const emailInput = screen.getByPlaceholderText('Your Email');
        const phoneInput = screen.getByPlaceholderText('Mobile No');
        const messageInput = screen.getByPlaceholderText('Message');
        const captchaInput = screen.getByPlaceholderText('Fill Captcha');
        const sendButton = screen.getByText('Send Message');

        fireEvent.change(nameInput, { target: { value: 'nithish' } });
        fireEvent.change(emailInput, { target: { value: 'nithish@gmail.com' } });
        fireEvent.change(phoneInput, { target: { value: '9597512667' } });
        fireEvent.change(messageInput, { target: { value: 'HIII' } });
        fireEvent.change(captchaInput, { target: { value: 'ABCDEF' } });

        fireEvent.click(sendButton);

        await waitFor(() => {
            expect(toastSuccessSpy).toHaveBeenCalledWith('Your message send Successfully...', {
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

        await new Promise(resolve => setTimeout(resolve, 3000));

        await jest.requireMock('@emailjs/browser').sendForm.mockResolvedValue();

        await waitFor(() => {
            expect(toastSuccessSpy).toBeCalledTimes(1);
        });
    });
});