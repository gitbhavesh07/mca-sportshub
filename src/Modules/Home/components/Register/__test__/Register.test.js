import { BrowserRouter } from "react-router-dom";
import { MockedProvider } from "@apollo/client/testing";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { toast } from "react-toastify";
import Register from "../Register";
import { REGISTER_USER } from "../../../../../Graphql/Mutation/Mutations";
import {
  RESEND_VERIFY,
  VERIFY_REGISTERATION,
} from "../../../../../Graphql/Query/Querys";

const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

const mockData = [
  {
    request: {
      query: REGISTER_USER,
      variables: {
        registerinputs: {
          username: "Nithish",
          email: "nithishkumar121212m@gmail.com",
          phonenumber: 8987678976,
          password: "Nithish@03",
        },
      },
    },
    result: {
      data: {
        register: true,
      },
    },
  },
  {
    request: {
      query: VERIFY_REGISTERATION,
      variables: {
        code: "079417",
        username: "nithishkumar121212m@gmail.com",
      },
    },
    result: { data: { verifyRegistrationCode: true } },
  },
];

const errorMockData = [
  {
    request: {
      query: REGISTER_USER,
      variables: {
        registerinputs: {
          username: "Nithish",
          email: "nithishkumar121212m@gmail.com",
          phonenumber: 8987678976,
          password: "Nithish@03",
        },
      },
    },
    result: {
      errors: [
        {
          message: "An account with the given email already exists.",
          locations: [
            {
              line: 2,
              column: 3,
            },
          ],
          path: ["register"],
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            stacktrace: [
              "Error: An account with the given email already exists.",
              "    at AuthService.<anonymous> (C:\\Users\\Tringapps-User25\\Desktop\\clone\\sports-hub-server\\src\\auth\\auth.service.ts:37:13)",
              "    at Generator.throw (<anonymous>)",
              "    at rejected (C:\\Users\\Tringapps-User25\\Desktop\\clone\\sports-hub-server\\dist\\auth\\auth.service.js:15:65)",
              "    at processTicksAndRejections (node:internal/process/task_queues:95:5)",
            ],
          },
        },
      ],
      data: null,
    },
  },
];

const sucessUserInvalidOtp = [
  {
    request: {
      query: REGISTER_USER,
      variables: {
        registerinputs: {
          username: "Nithish",
          email: "nithishkumar121212m@gmail.com",
          phonenumber: 8987678976,
          password: "Nithish@03",
        },
      },
    },
    result: {
      data: {
        register: true,
      },
    },
  },
  {
    request: {
      query: VERIFY_REGISTERATION,
      variables: {
        code: "079419",
        username: "nithishkumar121212m@gmail.com",
      },
    },
    result: {
      errors: [
        {
          message: "Verification code is invalid",
          locations: [
            {
              line: 2,
              column: 3,
            },
          ],
          path: ["verifyRegistrationCode"],
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            stacktrace: [
              "Error: Verification code is invalid",
              "    at AuthService.<anonymous> (C:\\Users\\Tringapps-User25\\Desktop\\clone\\sports-hub-server\\src\\auth\\auth.service.ts:54:13)",
              "    at Generator.throw (<anonymous>)",
              "    at rejected (C:\\Users\\Tringapps-User25\\Desktop\\clone\\sports-hub-server\\dist\\auth\\auth.service.js:15:65)",
              "    at processTicksAndRejections (node:internal/process/task_queues:95:5)",
            ],
          },
        },
      ],
      data: null,
    },
  },
];

const sucessUserResendOtp = [
  {
    request: {
      query: REGISTER_USER,
      variables: {
        registerinputs: {
          username: "Nithish",
          email: "nithishkumar121212m@gmail.com",
          phonenumber: 8987678976,
          password: "Nithish@03",
        },
      },
    },
    result: {
      data: {
        register: true,
      },
    },
  },
  {
    request: {
      query: RESEND_VERIFY,
      variables: {
        username: "nithishkumar121212m@gmail.com",
      },
    },
    result: { data: { resendVerificationCode: true } },
  },
];

describe("Register", () => {
  test(" Register Sucess", async () => {
    const toastSuccessSpy = jest.spyOn(toast, "success");
    const toastErrorSpy = jest.spyOn(toast, "error");
    render(
      <BrowserRouter>
        <MockedProvider mocks={mockData}>
          <Register />
        </MockedProvider>
      </BrowserRouter>
    );
    screen.debug(undefined, Infinity);

    const usernameInput = screen.getByPlaceholderText("Enter username");
    const passwordInput = screen.getByPlaceholderText("Enter password");
    const emailInput = screen.getByPlaceholderText("Enter email Id");
    const phonenumberInput = screen.getByPlaceholderText("Enter phone number");
    const RegisterButton = screen.getByRole("button", { name: "Submit" });
    const passwordIcon = screen.getByTestId("toggleNPasswordVisibility");
    fireEvent.click(passwordIcon);
    expect(passwordInput).toHaveAttribute("type", "text");

    expect(RegisterButton).toBeInTheDocument();
      fireEvent.change(usernameInput, {
        target: {
          value: "Nithish",
        },
      });
    fireEvent.change(emailInput, {
      target: { value: "nithishkumar121212m@gmail.com" },
    });
    fireEvent.change(passwordInput, { target: { value: "Nithish@03" } });
    fireEvent.change(phonenumberInput, { target: { value: "8987678976" } });


    fireEvent.click(RegisterButton);
    await waitFor(() => {
      expect(toastSuccessSpy).toHaveBeenCalledWith("Verification Code Sent", {
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
    const otpInput = screen.getByPlaceholderText("Enter OTP");
    const submitButton = screen.getByRole("button", { name: "Submit" });
    expect(submitButton).toBeInTheDocument();
    fireEvent.change(otpInput, { target: { value: "" } });
    fireEvent.click(submitButton);
    fireEvent.change(otpInput, { target: { value: "079417" } });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(toastSuccessSpy).toHaveBeenCalledWith(
        "User Registered Sucessfully",
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

  test("error register ", async () => {
    const toastSuccessSpy = jest.spyOn(toast, "success");
    const toastErrorSpy = jest.spyOn(toast, "error");
    render(
      <BrowserRouter>
        <MockedProvider mocks={errorMockData}>
          <Register />
        </MockedProvider>
      </BrowserRouter>
    );
    screen.debug(undefined, Infinity);

    const usernameInput = screen.getByPlaceholderText("Enter username");
    const passwordInput = screen.getByPlaceholderText("Enter password");
    const emailInput = screen.getByPlaceholderText("Enter email Id");
    const phonenumberInput = screen.getByPlaceholderText("Enter phone number");
    const RegisterButton = screen.getByRole("button", { name: "Submit" });
    const passwordIcon = screen.getByTestId("toggleNPasswordVisibility");
    fireEvent.click(passwordIcon);
    expect(passwordInput).toHaveAttribute("type", "text");

    expect(RegisterButton).toBeInTheDocument();

    fireEvent.change(usernameInput, {
      target: {
        value: "Nithish",
      },
    });
    fireEvent.change(emailInput, {
      target: { value: "nithishkumar121212m@gmail.com" },
    });

    fireEvent.change(passwordInput, { target: { value: "Nithish@03" } });
    fireEvent.change(phonenumberInput, { target: { value: "8987678976" } });

    fireEvent.click(RegisterButton);
    await waitFor(() => {
      expect(toastErrorSpy).toHaveBeenCalledWith(
        "An account with the given email already exists.",
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

  test(" Register Sucess wrong otp", async () => {
    const toastSuccessSpy = jest.spyOn(toast, "success");
    const toastErrorSpy = jest.spyOn(toast, "error");
    render(
      <BrowserRouter>
        <MockedProvider mocks={sucessUserInvalidOtp}>
          <Register />
        </MockedProvider>
      </BrowserRouter>
    );
    screen.debug(undefined, Infinity);

    const usernameInput = screen.getByPlaceholderText("Enter username");
    const passwordInput = screen.getByPlaceholderText("Enter password");
    const emailInput = screen.getByPlaceholderText("Enter email Id");
    const phonenumberInput = screen.getByPlaceholderText("Enter phone number");
    const RegisterButton = screen.getByRole("button", { name: "Submit" });
    const passwordIcon = screen.getByTestId("toggleNPasswordVisibility");
    fireEvent.click(passwordIcon);
    expect(passwordInput).toHaveAttribute("type", "text");

    expect(RegisterButton).toBeInTheDocument();

    fireEvent.change(usernameInput, {
      target: {
        value: "Nithish",
      },
    });
    fireEvent.change(emailInput, {
      target: { value: "nithishkumar121212m@gmail.com" },
    });

    fireEvent.change(passwordInput, { target: { value: "Nithish@03" } });
    fireEvent.change(phonenumberInput, { target: { value: "8987678976" } });

    fireEvent.click(RegisterButton);
    await waitFor(() => {
      expect(toastSuccessSpy).toHaveBeenCalledWith("Verification Code Sent", {
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
    const otpInput = screen.getByPlaceholderText("Enter OTP");
    const submitButton = screen.getByRole("button", { name: "Submit" });
    expect(submitButton).toBeInTheDocument();
    fireEvent.change(otpInput, { target: { value: "079419" } });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(toastErrorSpy).toHaveBeenCalledWith(
        "Verification code is invalid",
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

  test(" Register Sucess Resend OTP", async () => {
    const toastSuccessSpy = jest.spyOn(toast, "success");
    const toastErrorSpy = jest.spyOn(toast, "error");
    render(
      <BrowserRouter>
        <MockedProvider mocks={sucessUserResendOtp}>
          <Register />
        </MockedProvider>
      </BrowserRouter>
    );
    screen.debug(undefined, Infinity);

    const usernameInput = screen.getByPlaceholderText("Enter username");
    const passwordInput = screen.getByPlaceholderText("Enter password");
    const emailInput = screen.getByPlaceholderText("Enter email Id");
    const phonenumberInput = screen.getByPlaceholderText("Enter phone number");
    const RegisterButton = screen.getByRole("button", { name: "Submit" });
    const passwordIcon = screen.getByTestId("toggleNPasswordVisibility");
    fireEvent.click(passwordIcon);
    expect(passwordInput).toHaveAttribute("type", "text");

    expect(RegisterButton).toBeInTheDocument();

    fireEvent.change(usernameInput, {
      target: {
        value: "Nithish",
      },
    });
    fireEvent.change(emailInput, {
      target: { value: "nithishkumar121212m@gmail.com" },
    });

    fireEvent.change(passwordInput, { target: { value: "Nithish@03" } });
    fireEvent.change(phonenumberInput, { target: { value: "8987678976" } });

    fireEvent.click(RegisterButton);
    await waitFor(() => {
      expect(toastSuccessSpy).toHaveBeenCalledWith("Verification Code Sent", {
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
   screen.debug(undefined,Infinity)
    const ResendText = screen.getByText("Resend");
    fireEvent.click(ResendText)
    await waitFor(()=>{
        expect(toastSuccessSpy).toHaveBeenCalledWith("Resended OTP Sucessfully", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
    })
  });

  test(" Data Validation", async () => {
    render(
      <BrowserRouter>
        <MockedProvider>
          <Register />
        </MockedProvider>
      </BrowserRouter>
    );
    screen.debug(undefined, Infinity);

    const usernameInput = screen.getByPlaceholderText("Enter username");
    const passwordInput = screen.getByPlaceholderText("Enter password");
    const emailInput = screen.getByPlaceholderText("Enter email Id");
    const phonenumberInput = screen.getByPlaceholderText("Enter phone number");
    const RegisterButton = screen.getByRole("button", { name: "Submit" });
    const passwordIcon = screen.getByTestId("toggleNPasswordVisibility");
    fireEvent.click(passwordIcon);
    expect(passwordInput).toHaveAttribute("type", "text");

    expect(RegisterButton).toBeInTheDocument();

    fireEvent.change(usernameInput, {
        target: {
          value: "",
        },
      });
      fireEvent.change(emailInput, {
        target: { value: "" },
      });
      fireEvent.change(passwordInput, { target: { value: "" } });
      fireEvent.change(phonenumberInput, { target: { value: "" } });
      fireEvent.click(RegisterButton);
  });
});
