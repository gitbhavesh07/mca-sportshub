import { BrowserRouter } from "react-router-dom";
import { MockedProvider } from "@apollo/client/testing";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../login";
import "@testing-library/jest-dom/extend-expect";
import { toast } from "react-toastify";
import { LOGIN_USER,CONFIRM_REGISTERATION,RESEND_CONFIRM_REGISTERATION } from "../../../../../Graphql/Query/Querys";

const navigate = jest.mock();

jest.mock("../../../../../App", () => ({
  useUserContext: () => ({
    generateCaptcha: jest.fn(),
    handleReloadCaptcha: jest.fn(),
    captchaValue: "ABCDEF",
    setProfile: jest.fn(),
    setId: jest.fn(),
  }),
}));

const mockedUsedNavigate = jest.fn();
    jest.mock("react-router-dom", () => ({
      ...jest.requireActual("react-router-dom"),
      useNavigate: ()=> mockedUsedNavigate,
    }));

// jest.mock('react-router-dom', () => ({
//   ...jest.requireActual('react-router-dom'), // Use the actual implementation of react-router-dom
//   useNavigate: jest.fn(),
// }));

// jest.mock("react-toastify", () => ({
//   toast: {
//     isSuccess: jest.fn(),
//     isError: jest.fn(),
//   },
// }));

// jest.mock('toast', () => ({
//   success: jest.fn(),
//   error: jest.fn(),
// }));

const mockData = [
  {
    request: {
      query: LOGIN_USER,
      variables: {
        logininputs: {
          username: "nithishkumar121212m@gmail.com",
          password: "nithishkumar",
        },
      },
    },
    result: {
      data: {
        login: {
          AccessToken:
            "eyJraWQiOiJ2VVdaZXdVckg4N0ZEcFFMMFwvU2dsWFltZURqMjduc3huOFgzclwvSm92WFU9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiI3ODMyNzcxMS1jMzkwLTQzMjUtYTY5Mi1mNTJkMDMyMTMyZjUiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9CMFdGVXR2MUQiLCJjbGllbnRfaWQiOiIyYWF0MDBqdXB1bzhrNzFqYWxyNHU5MmU3ZCIsIm9yaWdpbl9qdGkiOiJmMjg1YzZjMS1iMDAxLTQzMTgtOTVhMC02ZWEwYjdlMzUyNDkiLCJldmVudF9pZCI6ImJhZTNkZWIzLWM1MjMtNDZjMC05ZDg5LTM1Nzc5ZmE2MzM1YSIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE2OTQ1ODI3NjIsImV4cCI6MTY5NDU4NjM2MiwiaWF0IjoxNjk0NTgyNzYyLCJqdGkiOiJlYmJiY2YyMy0wYWU5LTQ0MWUtOGM1ZS04MjNhNDRiZjU5YjciLCJ1c2VybmFtZSI6Ijc4MzI3NzExLWMzOTAtNDMyNS1hNjkyLWY1MmQwMzIxMzJmNSJ9.Y0NyR9fKNCLeSxUVfWJJpPgcG1whwwl3uNdom1ju5puvNykzKWXwwKaS1unMHWKd534mlXP4VBpOZi8_Ha7OFMNWuluZ9SN57tuklSTgwXluOLrWhxe-C-6FhBLcHouyefJISCmh1HmPPMUqdhDFLv90N5oW57rmJ7LOHZQYFCTe_5z0mqMm1YyfKQX46JCSNxqne708JY2HPdd_uL433v-43biwa_5NyQdyNNmCh_yEyWRTE5LG0Rc5N4eZ5eA037wmi58Dea3dwMgxR1-PgFcjj2DxM6_YJpF95DQhNe4bVUIw73V12jeJ-t2gZiHqs6gDLfFQghTjw21wqPfGYA",
          userName: "NITHISH KUMAR",
          userId: "b2deab99-beb3-4a43-81ba-e475b32463d9",
          RefreshToken:
            "eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAifQ.bO-nyfrtpJ3kS0AamG7hL8ABXJxBZq39M0cyaNSwNt1nVmvc7OSfsV5q_hqeM_-nj8QTClVUBC0TMgIAohlrP0YwMoekYRCKU-t_4nEhoZDb-aFvXLKXW0YRnDz_JbRqJcAk0gBTSFoDdUy2nEbUFnJcBv0f55J8FHZn458RIfjI57vqMz6BK-oYOkFPHdCKT1Oc0SVYbq4WchvkWEkio5OzPN6v6K4d4VRJyEC01WMSQEOWylpKhF-_p3gws5g_NFYl_EcsZzroFu-ZYE1_E8SqULppkPYJ8aJgUDbVpBmO3syZJhKMDOO6ldBRNqDpV2yJn9n7o7nBJ7mPwpTqQQ.xkvlI1aZjq_ondcm.OTnPrNZlwBKKAPMdmP_xP-cVWCnISngZ6QLl76W0pRFoowGc1Xtq9zDRe6ZWQoLLeLYnYbwYlZUNlV5AujuBamdFRcs1KUZMbeRkBqPD9p849iy9GC6RA9GLY2OP2-Q68nnanmPwVYENmyg7vIo2Z9l4mKUQ8wJuKRhFlffKo-qvOugbn4gEKKN_2kokg8XFk7Dx5BNgWm6r7lu0lUafym6c7rq7Nb-Xfigh-9OI1wijMyD8KDWqyysSvmlbwmyO9NHZuZaVCEiDlV7ROG3QmORX0WP1i6xwJYwwqrWnB1ggspxcYVZtDii7DbDANIlLK4d0WqcoLvV7bKdba8bozcZovR8me6LIY8yf7a6umlO7pigLWGsLzxfOyAXbKLEy1nAJIaAWVwsSz0o33cI2y6_2074K1OoPaBGytLqMuAfbioBPi4_8yhE6PY4_tZ9q6J6k3dqCRWZtqRPtzbft66jBtToWvw1i97LAIRaRisefudyy68qUeKRUKCcKBZBB698u3l6IIShK_CukrOnkkQ61Q8g-oAZvfHsJ6gE80lp-ZamNlvGKP2Yy7RdTqbk3g4j_uaDqjZItfSrV2mMMtWGv-wkC1gOLB9Q6d5ll-RTuDL7FfvQhgJ8_rN7XMh4yAprNsahtSewKDMkNh7SulW8fSRsfLwGLtuzINEGdXntHlmzluyBmaTHcAKCqUUWLmHYMgjB9kPxnPrhd1nyRTtgzlWCc15GPmtdRimgpa_Tq9aA8hHtodxjqTzHL6VTkF_aKeW3vifK-AF16qBSZXr47ToHOf0do-rXv1HwijTMPaXYZcwVl7Mbd2_TKaiRuJJvLbjIZos48GaI4e2Xd5t5VJL5toYXfkMS51wToRmIqruIqv44m-Yat0UZryLDUlvgCRcXACu_UjkuNORO5p_GXF53aGqWbgfdgU2osVglCyeQLWoCVKh2xQil9H1Px4SGuU0EdhIQVq_dDSfY1tQv7Yfeoxo1yHUvL8N1HUnhlXIg_9KjkC3Bh-YHcZkAEu3cgYAfI5IZ6g2a5dyr1VIc78eXWMbn_sZWBNKG7izwvj71FKKIJwJfrD3nrsdVFO83AyGsxDiJQGKH9-aMi-EWXXhomYXLD4yZIZ6Bi3c0m2zUL4FNExf1ph7W4iZnnHMKkjgZV4hocHuSK7v84POoCO_HxQa2UbmEdERZPADXF1tMvxg4NAZzizFdbv4Mt1zzL9ubVXA-UnLupvVRt8VXx9Z8vSR6cT5VHNGr8e0F7FQJ3_TwQ6F3Q4TkTcPCTaDs_F7qcLM3292z0y6Zx8fQWOwi37S6RtH3IwTrZmonRrYIq8a-PecLfjw.-nlT-93id8jZcvx2JAnXtA",
          __typename: "TokenResponse",
        },
      },
    },
  },
];

const errorMockData = [
  {
    request: {
      query: LOGIN_USER,
      variables: {
        logininputs: {
          username: "nithishkumar121212m@gmail.com",
          password: "mohanraj",
        },
      },
    },
    result: {
      errors: [
        {
          message: "Incorrect username or password.",
          locations: [
            {
              line: 2,
              column: 3,
            },
          ],
          path: ["login"],
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            stacktrace: [
              "Error: Incorrect username or password.",
              "    at AuthService.login (C:\\Users\\Tringapps-User25\\Desktop\\clone\\sports-hub-server\\src\\auth\\auth.service.ts:102:13)",
              "    at processTicksAndRejections (node:internal/process/task_queues:95:5)",
              "    at target (C:\\Users\\Tringapps-User25\\Desktop\\clone\\sports-hub-server\\node_modules\\@nestjs\\core\\helpers\\external-context-creator.js:74:28)",
              "    at Object.login (C:\\Users\\Tringapps-User25\\Desktop\\clone\\sports-hub-server\\node_modules\\@nestjs\\core\\helpers\\external-proxy.js:9:24)",
            ],
          },
        },
      ],
      data: null,
    },
  },
];

const errorForUser = [
  {
    request: {
      query: LOGIN_USER,
      variables: {
        logininputs: {
          username: "nithishkumar121212m@gmail.com",
          password: "mohanraj",
        },
      },
    },
    result: {
      errors: [
        {
          message: "User is not confirmed.",
          locations: [
            {
              line: 2,
              column: 3
            }
          ],
          path: [
            "login"
          ],
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            stacktrace: [
              "Error: User is not confirmed.",
              "    at AuthService.<anonymous> (C:\\Users\\Tringapps-User25\\Desktop\\clone\\sports-hub-server\\src\\auth\\auth.service.ts:101:13)",
              "    at Generator.throw (<anonymous>)",
              "    at rejected (C:\\Users\\Tringapps-User25\\Desktop\\clone\\sports-hub-server\\dist\\auth\\auth.service.js:15:65)",
              "    at processTicksAndRejections (node:internal/process/task_queues:95:5)"
            ]
          }
        }
      ],
      data: null
    },
  },
  {
    request:{
      query:CONFIRM_REGISTERATION,
        variables: {
          confirmationCode: "403432",
          username: "madasamysanthosh@mailinator.com"
        }
    },
    result:{
      data: {
        confirmEmail: true
      }
    }
  }
];

const errorForUserCompleted = [
  {
    request: {
      query: LOGIN_USER,
      variables: {
        logininputs: {
          username: "nithishkumar121212m@gmail.com",
          password: "mohanraj",
        },
      },
    },
    result: {
      errors: [
        {
          message: "User is not confirmed.",
          locations: [
            {
              line: 2,
              column: 3
            }
          ],
          path: [
            "login"
          ],
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            stacktrace: [
              "Error: User is not confirmed.",
              "    at AuthService.<anonymous> (C:\\Users\\Tringapps-User25\\Desktop\\clone\\sports-hub-server\\src\\auth\\auth.service.ts:101:13)",
              "    at Generator.throw (<anonymous>)",
              "    at rejected (C:\\Users\\Tringapps-User25\\Desktop\\clone\\sports-hub-server\\dist\\auth\\auth.service.js:15:65)",
              "    at processTicksAndRejections (node:internal/process/task_queues:95:5)"
            ]
          }
        }
      ],
      data: null
    },
  },
  {
    request:{
      query:CONFIRM_REGISTERATION,
        variables: {
          confirmationCode: "403432",
          username: "nithishkumar121212m@gmail.com"
        }
    },
    result:{
      data: {
        confirmEmail: true
      }
    }
  },
  {
    request:{
      query: RESEND_CONFIRM_REGISTERATION,
      variables:{
          username: "nithishkumar121212m@gmail.com"
      }
    },
    result:{
        data: {
          resendConfirmationCode: true
        }
    }
  }
];


describe("Login", () => {
  test("user not confirmed error part covered for resend confirmation completed", async () => {
    const toastSuccessSpy = jest.spyOn(toast, "success");
    const toastErrorSpy = jest.spyOn(toast, "error");

    render(
      <BrowserRouter>
        <MockedProvider mocks={errorForUserCompleted} addTypename={false}>
          <Login />
        </MockedProvider>
      </BrowserRouter>
    );

    screen.debug(undefined, Infinity);

    const emailInput = screen.getByPlaceholderText("Enter email");
    const passwordInput = screen.getByPlaceholderText("Enter password");
    const captchaInput = screen.getByPlaceholderText("Fill Captcha");
    const loginButton = screen.getByRole("button", { name: "Login" });
    expect(loginButton).toBeInTheDocument();

    fireEvent.change(emailInput, {
      target: { value: "nithishkumar121212m@gmail.com" },
    });
    fireEvent.change(passwordInput, { target: { value: "mohanraj" } });
    fireEvent.change(captchaInput, { target: { value: "ABCDEF" } });

    fireEvent.click(loginButton);
    await waitFor( async () => {
      expect(toastErrorSpy).toHaveBeenCalledWith(
        "User is not confirmed.",
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
    const resendButton = screen.getByText("Resend");
    fireEvent.click(resendButton);
    await waitFor(()=>{
      expect(toastSuccessSpy).toHaveBeenCalledWith(
        "OTP resended Sucessfully",
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
  test("user not confirmed on completed covered", async () => {
    const toastErrorSpy = jest.spyOn(toast, "error");

    render(
      <BrowserRouter>
        <MockedProvider mocks={errorForUserCompleted} addTypename={false}>
          <Login />
        </MockedProvider>
      </BrowserRouter>
    );

    screen.debug(undefined, Infinity);

    const emailInput = screen.getByPlaceholderText("Enter email");
    const passwordInput = screen.getByPlaceholderText("Enter password");
    const captchaInput = screen.getByPlaceholderText("Fill Captcha");
    const loginButton = screen.getByRole("button", { name: "Login" });
    expect(loginButton).toBeInTheDocument();

    fireEvent.change(emailInput, {
      target: { value: "nithishkumar121212m@gmail.com" },
    });
    fireEvent.change(passwordInput, { target: { value: "mohanraj" } });
    fireEvent.change(captchaInput, { target: { value: "ABCDEF" } });

    fireEvent.click(loginButton);
    await waitFor( async () => {
      expect(toastErrorSpy).toHaveBeenCalledWith(
        "User is not confirmed.",
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
    const otpInput = screen.getByPlaceholderText("Enter OTP");
    const submitButton = screen.getByRole("button", { name: "Submit" });
    expect(submitButton).toBeInTheDocument();
    fireEvent.change(otpInput, { target: { value: "403432" } }); 
    fireEvent.click(submitButton);
    await waitFor(()=>{
      screen.debug();
    expect(screen.getByRole("button",{name: "Login"})).toBeInTheDocument();
    }) 
  });
  test("Login sucess", async () => {
    
    render(
      <BrowserRouter>
        <MockedProvider mocks={mockData} addTypename={false}>
          <Login />
        </MockedProvider>
      </BrowserRouter>
    );
    screen.debug(undefined, Infinity);

    const emailInput = screen.getByPlaceholderText("Enter email");
    const passwordInput = screen.getByPlaceholderText("Enter password");
    const captchaInput = screen.getByPlaceholderText("Fill Captcha");
    const loginButton = screen.getByRole("button", { name: "Login" });
    const passwordIcon = screen.getByTestId('toggleNPasswordVisibility')
    fireEvent.click(passwordIcon)
    expect(passwordInput).toHaveAttribute('type', 'text');


    expect(loginButton).toBeInTheDocument();

    fireEvent.change(emailInput, {
      target: { value: "nithishkumar121212m@gmail.com" },
    });
    fireEvent.change(passwordInput, { target: { value: "nithishkumar" } });
    fireEvent.change(captchaInput, { target: { value: "ABCDEF" } });

     fireEvent.click(loginButton);
    
    await waitFor(()=>{
      expect(mockedUsedNavigate).toHaveBeenCalled(); 
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/dashboard/'); 
      
    })
    screen.debug(undefined,Infinity)
    
   });

  test("wrong user info", async () => {
    const toastErrorSpy = jest.spyOn(toast, "error");

    render(
      <BrowserRouter>
        <MockedProvider mocks={errorMockData} addTypename={false}>
          <Login />
        </MockedProvider>
      </BrowserRouter>
    );

    screen.debug(undefined, Infinity);

    const emailInput = screen.getByPlaceholderText("Enter email");
    const passwordInput = screen.getByPlaceholderText("Enter password");
    const captchaInput = screen.getByPlaceholderText("Fill Captcha");
    const loginButton = screen.getByRole("button", { name: "Login" });
    expect(loginButton).toBeInTheDocument();

    fireEvent.change(emailInput, {
      target: { value: "nithishkumar121212m@gmail.com" },
    });
    fireEvent.change(passwordInput, { target: { value: "mohanraj" } });
    fireEvent.change(captchaInput, { target: { value: "ABCDEF" } });

    fireEvent.click(loginButton);
    await waitFor(() => {
      expect(toastErrorSpy).toHaveBeenCalledWith(
        "Incorrect username or password.",
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

  test("user not confirmed error part covered", async () => {
    const toastErrorSpy = jest.spyOn(toast, "error");
    render(
      <BrowserRouter>
        <MockedProvider mocks={errorForUser} addTypename={false}>
          <Login />
        </MockedProvider>
      </BrowserRouter>
    );

    screen.debug(undefined, Infinity);

    const emailInput = screen.getByPlaceholderText("Enter email");
    const passwordInput = screen.getByPlaceholderText("Enter password");
    const captchaInput = screen.getByPlaceholderText("Fill Captcha");
    const loginButton = screen.getByRole("button", { name: "Login" });
    expect(loginButton).toBeInTheDocument();

    fireEvent.change(emailInput, {
      target: { value: "nithishkumar121212m@gmail.com" },
    });
    fireEvent.change(passwordInput, { target: { value: "mohanraj" } });
    fireEvent.change(captchaInput, { target: { value: "ABCDEF" } });

    fireEvent.click(loginButton);
    await waitFor( async () => {
      expect(toastErrorSpy).toHaveBeenCalledWith(
        "User is not confirmed.",
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
    const otpInput = screen.getByPlaceholderText("Enter OTP");
    const submitButton = screen.getByRole("button", { name: "Submit" });
    expect(submitButton).toBeInTheDocument();
    fireEvent.change(otpInput, { target: { value: "403432" } }); 
    fireEvent.click(submitButton);
    await waitFor(()=>{
    expect(loginButton).not.toBeInTheDocument();
    }) 
  });


  test("Login sucess captcha invalid", async () => {
    
    render(
      <BrowserRouter>
        <MockedProvider mocks={mockData} addTypename={false}>
          <Login />
        </MockedProvider>
      </BrowserRouter>
    );
    screen.debug(undefined, Infinity);

    const emailInput = screen.getByPlaceholderText("Enter email");
    const passwordInput = screen.getByPlaceholderText("Enter password");
    const captchaInput = screen.getByPlaceholderText("Fill Captcha");
    const loginButton = screen.getByRole("button", { name: "Login" });
    const passwordIcon = screen.getByTestId('toggleNPasswordVisibility')
    fireEvent.click(passwordIcon)
    expect(passwordInput).toHaveAttribute('type', 'text');


    expect(loginButton).toBeInTheDocument();

    fireEvent.change(emailInput, {
      target: { value: "nithishkumar121212m@gmail.com" },
    });
    fireEvent.change(passwordInput, { target: { value: "nithishkumar" } });
    fireEvent.change(captchaInput, { target: { value: "ABCDEK" } });

     fireEvent.click(loginButton);
    await new Promise(resolve=>{
      setTimeout(resolve,4000)
    })
    // await waitFor(()=>{
    //   expect(mockedUsedNavigate).toHaveBeenCalled(); 
    //   expect(mockedUsedNavigate).toHaveBeenCalledWith('/dashboard/'); 
      
    // })
    fireEvent.change(captchaInput, { target: { value: "ABCDEF" } });
    fireEvent.click(loginButton);
    screen.debug(undefined,Infinity)
    
   });

   test("user not confirmed error otp validation", async () => {
    const toastErrorSpy = jest.spyOn(toast, "error");

    render(
      <BrowserRouter>
        <MockedProvider mocks={errorForUserCompleted} addTypename={false}>
          <Login />
        </MockedProvider>
      </BrowserRouter>
    );

    screen.debug(undefined, Infinity);

    const emailInput = screen.getByPlaceholderText("Enter email");
    const passwordInput = screen.getByPlaceholderText("Enter password");
    const captchaInput = screen.getByPlaceholderText("Fill Captcha");
    const loginButton = screen.getByRole("button", { name: "Login" });
    expect(loginButton).toBeInTheDocument();

    fireEvent.change(emailInput, {
      target: { value: "nithishkumar121212m@gmail.com" },
    });
    fireEvent.change(passwordInput, { target: { value: "mohanraj" } });
    fireEvent.change(captchaInput, { target: { value: "ABCDEF" } });

    fireEvent.click(loginButton);
    await waitFor( async () => {
      expect(toastErrorSpy).toHaveBeenCalledWith(
        "User is not confirmed.",
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
    const otpInput = screen.getByPlaceholderText("Enter OTP");
    const submitButton = screen.getByRole("button", { name: "Submit" });
    expect(submitButton).toBeInTheDocument();
    fireEvent.change(otpInput, { target: { value: "" } }); 
    fireEvent.click(submitButton);
    await waitFor(()=>{
      screen.debug();
    // expect(screen.getByRole("button",{name: "Login"})).toBeInTheDocument();
    }) 
    fireEvent.change(otpInput, { target: { value: "456765" } }); 
    fireEvent.click(submitButton);

  });

  // test("MailId Password Validate", async () => {
    
  //   render(
  //     <BrowserRouter>
  //       <MockedProvider mocks={mockData} addTypename={false}>
  //         <Login />
  //       </MockedProvider>
  //     </BrowserRouter>
  //   );
  //   screen.debug(undefined, Infinity);

  //   const emailInput = screen.getByPlaceholderText("Enter email");
  //   const passwordInput = screen.getByPlaceholderText("Enter password");
  //   const captchaInput = screen.getByPlaceholderText("Fill Captcha");
  //   const loginButton = screen.getByRole("button", { name: "Login" });
  //   const passwordIcon = screen.getByTestId('toggleNPasswordVisibility')
  //   fireEvent.click(passwordIcon)
  //   expect(passwordInput).toHaveAttribute('type', 'text');


  //   expect(loginButton).toBeInTheDocument();

  //   fireEvent.change(emailInput, {
  //     target: { value: "nithishkumar121212m" },
  //   });
  //   fireEvent.change(passwordInput, { target: { value: "nithis" } });
  //   fireEvent.change(captchaInput, { target: { value: "ABCDEF" } });
    
  //   await waitFor(()=>{
  //     // expect(mockedUsedNavigate).toHaveBeenCalled(); 
  //     // expect(mockedUsedNavigate).toHaveBeenCalledWith('/dashboard/'); 
      
  //   })
  //   screen.debug(undefined,Infinity)
    
  //  });
});
