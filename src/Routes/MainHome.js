import { Route, Routes } from 'react-router-dom';
import Register from '../Modules/Home/components/Register/Register';
import Home from '../Modules/Home/Home';
import Header from '../Modules/Home/components/Header/Header';
import Login from '../Modules/Home/components/Login/login';
import Footer from '../Modules/Home/components/Footer/Footer';
import FindAuctions from '../Modules/Home/components/FindAuctions/FindAuctions';
import Headroom from 'react-headroom';
import ShowAuctionTeamList from '../Modules/Home/components/TodayAuctions/ShowAuctionTeamList';
import { AnimatePresence } from 'framer-motion';
import ForgotPassword from '../Modules/Home/components/Forgot Password/ForgotPassword';

const MainHome = () => {

    return (
        <>
                <Headroom>
                    <Header />
                </Headroom>
                <AnimatePresence wait>
                    <Routes>
                        <Route exact path='/' element={<Home />} />
                        <Route exact path='/showauctionteamlist/:auctionId' element={<ShowAuctionTeamList />} />
                        <Route exact path='/findAuctions' element={<FindAuctions />} />
                        <Route exact path='/register' element={<Register />} />
                        <Route exact path='/login' element={<Login/>} />
                        <Route exact path='/Forgot-Password' element={<ForgotPassword />}></Route>
                    </Routes>
                </AnimatePresence>
                <Footer />
        </>
    );

};

export default MainHome;
