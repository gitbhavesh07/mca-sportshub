import { React, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../Organizer My Auctions/TransferPlayer.css';
import { useLazyQuery, useMutation } from '@apollo/client';
import { FIND_USER_AUCTION } from '../../../../Graphql/Query/Querys';
import { TRANSFER_TEAM } from '../../../../Graphql/Mutation/Mutations';
import { useUserContext } from '../../../../App';
import ToastMessage from '../../../../toast';

const TransferTeam = () => {

    const { isSuccess, isError } = ToastMessage();
    const { setHeader, componentRef, userId } = useUserContext();
    const { id } = useParams();
    const [data, setData] = useState({});
    const [selectedAuctionId, setSelectedAuctionId] = useState('');

    useEffect(() => {
        const head = componentRef.current?.id;
        setHeader(head);
    });

    const [findUserAuctions] = useLazyQuery(FIND_USER_AUCTION, {
        onCompleted: data => {
            setData(data.findUserAuctions);
        }});

    useEffect(() => {
        const fetchAuctions = async () => {
            findUserAuctions({
                variables: {
                    'user_id': userId}});
        };
        fetchAuctions();
    }, [userId]);

    const [transferTeamMutation] = useMutation(TRANSFER_TEAM, {
        onCompleted: data => {
            if (data.transferTeam) {
                isSuccess('Team Transferred Successfully!');
            }
        },
        onError: error => {
            isError(error.message);
            console.error('Error transferring teams:', error);
        }});

    const transferData = { sourceAuctionId: id, targetAuctionId: selectedAuctionId };

    const submitForm = async e => {
        e.preventDefault();
        try {
           await transferTeamMutation({
                variables: {
                    transferData}});
        } catch (error) {
            isError('Failed to transfer teams!');
            console.error('Error transferring teams:', error);
        }
    };

    return (
        <div className='transferplayer-container' id='Transfer Team' ref={componentRef}>
            <div className='transferplayer-inner-container'>
                <div className='transferplayer-title'><h3>Transfer Team From Other Auction</h3></div>
                <div className='transferplayer-underline'> </div>
                <form className='tranferplayer-form'>
                    <div><label for="transferplayer-select">Select Auction</label></div>
                    <div>
                        <select id="transferplayer-select" name="options"
                            value={selectedAuctionId}
                            data-TestId='transferplayer-select'
                            onChange={e => setSelectedAuctionId(e.target.value)}
                        >
                            <option value=''>Select an auction...</option>
                            {Object.values(data).length > 1 ? (
                                Object.values(data).map((auction, index) => (
                                    auction.id !== id && (
                                        <option key={auction.id} value={auction.id}>
                                            {auction.auctionname}
                                        </option>
                                    )
                                ))) : (
                                <option disabled value="">
                                    No auction available
                                </option>
                            )}
                        </select>
                    </div>
                    <div className='transferplayer-button'>
                        <div><button data-TestId='team-transfer' onClick={submitForm} disabled={!selectedAuctionId}>Transfer</button></div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransferTeam;

