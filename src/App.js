import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { useState, useRef, useContext, createContext, useEffect } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, ApolloLink, createHttpLink, fromPromise } from '@apollo/client';
import MainHome from './Routes/MainHome';
import Organizer from './Routes/Organizer';
import ApDashboard from './Modules/Auction Panal/ApDashboard';
import AuctionPanel from './Routes/AuctionPanel';
import { onError } from '@apollo/client/link/error';
import Websocket from './Modules/Websocket/Websocket';
import { checkPeriod, generateRefresh, sessionExpired } from './RefreshTokenAccess';
import { ToastContainer } from 'react-toastify';

const UserContext = createContext();

function App() {
  const [profileName, setProfile] = useState(localStorage.getItem('name'));
  const [header, setHeader] = useState('DashBoard');
  const [auctionId, setAuctionId] = useState(localStorage.getItem('Auction_id'));
  const [playerPanel, setPlayerPanel] = useState(true);
  const componentRef = useRef();
  const [userId, setId] = useState(localStorage.getItem('id'));
  const [captchaValue, setCaptchaValue] = useState('');
  const [userOption, setUserOption] = useState(localStorage.getItem('category'));
  const [categoryValue, setCategoryValue] = useState([]);

  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  const captchaLength = 6;

  const generateCaptcha = () => {
    const randomValues = new Uint32Array(captchaLength);
    crypto.getRandomValues(randomValues);
    let captchaText = '';
    for (let i = 0; i < captchaLength; i++) {
      const randomIndex = randomValues[i] % characters.length;
      captchaText += characters[randomIndex];
    }
    setCaptchaValue(captchaText);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleReloadCaptcha = () => {
    generateCaptcha();
  };

  const handleGoBack = () => {
    let isValid = true;

    if (header === 'DashBoard') {
      isValid = false;
    }

    return isValid;
  };

  const httpLink = createHttpLink({
    uri: process.env.REACT_APP_NGROK_PORT});

  const authMiddleware = new ApolloLink((operation, forward) => {
    const accessToken = localStorage.getItem('token');
    const headers = { ...operation.getContext().headers };
    if (accessToken) {
      headers.authorization = `Bearer ${accessToken}`;
    } else {
      headers.authorization = '';
    }
    operation.setContext({ headers });
    return forward(operation);
  });

  const logout = onError(({ graphQLErrors, operation, forward }) => {
    const message = graphQLErrors?.[0]?.message || '';
    console.log("Message",message);
    if (message === 'ACCESS_TOKEN_EXPIRED' || message === 'Unauthorized') {
      const noOfDays = 5;
      const validSession = checkPeriod(noOfDays);
      if (validSession) {
        return fromPromise(
          generateRefresh().catch(e => {
            if (e) {
              sessionExpired();
            }
          })
        ).filter(value => Boolean(value))
          .flatMap(accessToken => {
            const oldHeaders = operation.getContext().headers;
            operation.setContext({
              headers: {
                ...oldHeaders,
                authorization: `Bearer ${accessToken}`}});
            return forward(operation);
          });
      } else {
        return sessionExpired();
      }
    } else {
      if (message === 'Invalid Token!') {
        return sessionExpired();
      }
      return forward(operation);
    }
  });

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([authMiddleware, logout, httpLink])});

  return (
    <>
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='dark'
      />
      <ApolloProvider client={client}>
        <BrowserRouter>
          <UserContext.Provider value={{
            setProfile,
            setId,
            handleGoBack,
            setHeader,
            setPlayerPanel,
            setAuctionId,
            generateCaptcha,
            handleReloadCaptcha,
            setCaptchaValue,
            setUserOption,
            setCategoryValue,
            header,
            profileName,
            userId,
            auctionId,
            playerPanel,
            characters,
            captchaValue,
            userOption,
            categoryValue,
            componentRef}}>
            <Routes>
              <Route exact path='/*' element={<MainHome />}></Route>
              <Route exact path='/dashboard/*' element={<Organizer />} />
              <Route exact path='/openpanal/:id' element={<ApDashboard />} />
              <Route exact path='/auctionpanel/*' element={<AuctionPanel />}></Route>
              <Route exact path='/websocket' element={<Websocket />}></Route>
            </Routes>
          </UserContext.Provider>
        </BrowserRouter>
      </ApolloProvider>
    </>
  );

}

export function useUserContext() {
  return useContext(UserContext);
}

export default App;
