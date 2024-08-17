import { Route, Routes } from 'react-router-dom';
import OrgHeader from '../Modules/Organizer/components/Organizer Header/OrgHeader';
import OrgDashboard from '../Modules/Organizer/OrgDashboard';
import AuctionHandler from '../Modules/Organizer/components/Organizer AuctionHandler/AuctionHandler';
import MyAuctions from '../Modules/Organizer/components/Organizer My Auctions/MyAuctions';
import AuctionDetails from '../Modules/Organizer/components/Organizer My Auctions/AuctionDetails';
import CommonHeader from '../Modules/Organizer/components/Header/Header';
import TeamHandler from '../Modules/Organizer/components/TeamHandler/TeamHandler';
import TeamList from '../Modules/Organizer/components/TeamHandler/TeamList';
import PlayerHandler from '../Modules/Organizer/components/PlayerHandler/PlayerHandler';
import PlayerList from '../Modules/Organizer/components/PlayerHandler/PlayerList';
import PlayerUploadHistory from '../Modules/Organizer/components/PlayerHandler/PlayerUploadHistory';
import TransferPlayer from '../Modules/Organizer/components/Organizer My Auctions/TransferPlayer';
import TransferTeam from '../Modules/Organizer/components/Organizer My Auctions/TransferTeam';
import GoBack from '../Modules/Organizer/components/Go Back/GoBack';
import { useUserContext } from '../App';

const Organizer = () => {

  const { handleGoBack } = useUserContext();

  return (
    <>
      <OrgHeader>
        <CommonHeader />
        {handleGoBack() ? <GoBack /> : <></>}
        <Routes>
          <Route exact path='/' element={<OrgDashboard />} />
          <Route exact path='/MyAuctions' element={<MyAuctions />} />
          <Route exact path='/AddTeam/:id' element={<TeamHandler editMode={false} />} />
          <Route exact path='/TeamList/:id' element={<TeamList />} />
          <Route exact path='/AddPlayer/:id' element={<PlayerHandler editMode={false} key={`create`} />} />
          <Route exact path='/EditPlayer/:playerid/:id' element={<PlayerHandler editMode={true} key={`edit`} />} />
          <Route exact path='/PlayerList/:id' element={<PlayerList />} />
          <Route exact path='/PlayerUploadHistory/:id' element={<PlayerUploadHistory/>}></Route>
          <Route exact path='/CreateAuctions' element={<AuctionHandler editMode={false} key={`create`} />} />
          <Route exact path='/EditAuctions/:id' element={<AuctionHandler editMode={true} key={`edit`} />} />
          <Route exact path='/AuctionDetails/:id' element={<AuctionDetails />} />
          <Route exact path='/TransferPlayer/:id' element={<TransferPlayer />} />
          <Route exact path='/EditTeam/:team_id' element={<TeamHandler editMode={true} />} />
          <Route exact path='/transferTeam/:id' element={<TransferTeam />} />
        </Routes>
      </OrgHeader>
    </>
  );
};

export default Organizer;
