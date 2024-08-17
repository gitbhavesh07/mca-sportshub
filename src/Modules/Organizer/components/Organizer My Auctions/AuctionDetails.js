import { React, useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { BsPlusSquareFill, BsArrowRightCircleFill } from 'react-icons/bs';
import { BiSolidEdit } from 'react-icons/bi';
import '../../../Organizer/components/Organizer My Auctions/AuctionDetails.css';
import { FIND_AUCTION } from '../../../../Graphql/Query/Querys';
import { useLazyQuery } from '@apollo/client';
import ReactLoading from 'react-loading';
import { useUserContext } from '../../../../App';


const AuctionDetails = () => {

    useEffect(() => {
        const head = componentRef.current?.id;
        setHeader(head);
    });

    const { setHeader, componentRef, setPlayerPanel } = useUserContext();
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [auctionDetails, setAuctionDetails] = useState({});
    const [isAuctionOpen, setIsAuctionOpen] = useState(false);
    const [teamCount, setTeamCount] = useState(0);

    const [findAuction] = useLazyQuery(FIND_AUCTION, {
        onCompleted: data => {
            const res = data.findAuction;
            if (res) {
                setLoading(false);
                setAuctionDetails(res);
                const currentDate = new Date();
                const auctionDate = new Date(res.auctiondate);
                const areDatesEqual =
                    currentDate.getFullYear() === auctionDate.getFullYear() &&
                    currentDate.getMonth() === auctionDate.getMonth() &&
                    currentDate.getDate() === auctionDate.getDate();
                setIsAuctionOpen(areDatesEqual);
            }
            if (res.team) {
                setTeamCount(res.team.length);
            }
        }});

    useEffect(() => {
        findAuction({
            variables:{
                id}});
    }, [id]);

    if (loading) {
        return <div className='loading'>
        <ReactLoading type="bars" color="rgb(255, 196, 0)"
          height={100} width={50} />
       </div>;
      }
    return (
        <div className='auctionDetails-container' id='My Auction Details' ref={componentRef}>
            <div className='detail-header'>
                <div><Link to={`/dashboard/TeamList/${auctionDetails.id}`} className='team-link' data-testId='open-button' onClick={() => setHeader('Team List')}>T</Link></div>
                <div><Link to={`/dashboard/PlayerList/${auctionDetails.id}`} className='team-link' data-testId='open-button' onClick={() => setHeader('Player List')}>P</Link></div>
                <div> <Link to={`/dashboard/EditAuctions/${auctionDetails.id}`} className='team-link' data-testId='open-button' onClick={() => setHeader('Edit Auction')}>
                    <BiSolidEdit />
                </Link></div>
                <div className='addauction'><button data-testId='open-button' onClick={() => { setHeader('Create Auction'); navigate('/dashboard/CreateAuctions'); }}>
                    <BsPlusSquareFill />
                </button></div>
            </div>
            <div className='detail-body'>
                <div className='detail-body-left'>
                    <div className='detail-underline'>{auctionDetails.auctionname}</div>
                    <div className='detail-underline'>{auctionDetails.pointsperteam} <span>Point/Team</span></div>
                    <div className='detail-underline'>{auctionDetails.minbid} <span>Minimum Bid</span></div>
                    <div className='detail-underline'>{auctionDetails.bidincrease} <span>Bid Increase</span></div>
                    <div className='detail-underline'>{auctionDetails.playerperteam} <span>Players/Team</span></div>
                    <div className='detail-underline'><Link to={`/dashboard/TransferPlayer/${auctionDetails.id}`} className='auction-link' data-testId='open-button' onClick={() => setHeader('Transfer Player')}>Transfer Player</Link></div>
                </div>
                <div className='detail-body-right'>
                    <div className='detail-underline'><Link to={`/dashboard/TeamList/${auctionDetails.id}`} className='auction-link' data-testId='open-button' onClick={() => setHeader('Team List')}>Team List</Link></div>
                    <div className='detail-underline'><Link to={`/dashboard/PlayerList/${auctionDetails.id}`} className='auction-link' data-testId='open-button' onClick={() => setHeader('Player List')}>Player List</Link></div>
                    <div ><button data-testId='open-button' className={`openauction-button ${(isAuctionOpen && teamCount >= 2) ? '' : 'disabled'}`} onClick={() => { if (isAuctionOpen && teamCount >= 2) {  navigate(`/openpanal/${auctionDetails.id}`);localStorage.setItem('Auction_id',id); } setPlayerPanel(true);}} ><div >Open Auction Panel</div><div><BsArrowRightCircleFill ></BsArrowRightCircleFill></div></button></div>
                    <div className='detail-underline'>Helpline:(Call/WhatsApp)</div>
                    <div className='detail-underline'><Link to={`/dashboard/transferTeam/${auctionDetails.id}`} className='auction-link' data-testId='open-button' onClick={() => setHeader('Transfer Team')}>Transfer Team</Link></div>

                </div>
            </div>
        </div >
    );
};
export default AuctionDetails;

