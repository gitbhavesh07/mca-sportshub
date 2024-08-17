
import { Route, Routes } from 'react-router-dom';
import AllPlayers from '../Modules/Auction Panal/components/AuctionPlayerList/AllPlayers';
import Auction from '../Modules/Auction Panal/components/Auction/Auction';
import AuctionPanelHeader from '../Modules/Auction Panal/components/AuctionPanelHeader/AuctionPanelHeader';
import PlayerListHeader from '../Modules/Auction Panal/components/AuctionPlayerList/PlayerListHeader';
import AuctionTeamList from '../Modules/Auction Panal/components/AuctionTeamList/TeamList';
import IndividualTeamPlayers from '../Modules/Auction Panal/components/AuctionTeamList/IndividualTeamPlayers';
import MatchHost from '../Modules/Auction Panal/components/MatchHost/MatchHost';
import { useUserContext } from '../App';



const AuctionPanel = () => {
  const { playerPanel } = useUserContext();

  return (
    <>
      <AuctionPanelHeader />
      {!playerPanel && <PlayerListHeader />}
      <Routes>
        <Route exact path='/Auction' element={<Auction />} />
        <Route exact path='/AllPlayer' element={<AllPlayers />} />
        <Route exact path='/AvailablePlayer' element={<AllPlayers AvailablePlayer={true} key='available' />} />
        <Route exact path='/SoldPlayer' element={<AllPlayers SoldPlayer={true}  key='sold'/>} />
        <Route exact path='/UnsoldPlayer' element={<AllPlayers  UnSoldPlayer={true} key='unsold'/>} />
        <Route exact path='/auctionteamlist' element={<AuctionTeamList />} />
        <Route exact path='/individualteamplayer/:id' element={<IndividualTeamPlayers />} />
        <Route exact path='/matchhost' element={<MatchHost />} />
      </Routes>
    </>
  );
};

export default AuctionPanel;
