
import { React, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../Organizer My Auctions/TransferPlayer.css';
import { useLazyQuery, useMutation } from '@apollo/client';
import { FIND_USER_AUCTION } from '../../../../Graphql/Query/Querys';
import { TRANSFER_PLAYER } from '../../../../Graphql/Mutation/Mutations';
import { useUserContext } from '../../../../App';
import ToastMessage from '../../../../toast';

const TransferPlayer = () => {

    const { isSuccess, isError } = ToastMessage();
    const { setHeader, componentRef, userId } = useUserContext();
    const { id } = useParams();
    const [auctions, setAuction] = useState({});
    const [selectedAuctionId, setSelectedAuctionId] = useState('');

    useEffect(() => {
        const head = componentRef.current?.id;
        setHeader(head);
    });

    const [findUserAuctions] = useLazyQuery(FIND_USER_AUCTION, {
        onCompleted: data => {
            setAuction(data.findUserAuctions);
        }});

    useEffect(() => {
        const fetchAuctions = async () => {
            findUserAuctions({
                variables: {
                    'user_id': userId}});
        };
        fetchAuctions();
    }, [userId]);

    const [transferPlayerMutation] = useMutation(TRANSFER_PLAYER, {
        onCompleted: data => {
            if (data.transferPlayer) {
                isSuccess('Player Transferred Successfully!');
            } else {
                isError('Failed to transfer players!');
            }
        },
        onError: error => {
            isError(error.message);
            console.error('Error transferring player:', error);
        }});
    const transferData = { sourceAuctionId: id, targetAuctionId: selectedAuctionId };
    const submitForm = async e => {
        e.preventDefault();
        try {
             await transferPlayerMutation({
                variables: {
                    transferData}});
        } catch (error) {
            isError('Failed to transfer players!');
            console.error('Error transferring player:', error);
        }
    };

    return (
        <div className='transferplayer-container' id='Transfer Player' ref={componentRef}>
            <div className='transferplayer-inner-container'>
                <div className='transferplayer-title'><h3>Transfer Player From Other Auction</h3></div>
                <div className='transferplayer-underline'> </div>
                <form className='tranferplayer-form'>
                    <div><label for="transferplayer-select">Select Auction</label></div>
                    <div>
                        <select id="transferplayer-select" name="options"
                            value={selectedAuctionId}
                            onChange={e => setSelectedAuctionId(e.target.value)}
                            data-testid="transferplayer-select">
                            <option value=''>Select an auction...</option>
                            {Object.values(auctions).length > 1 ? (
                                Object.values(auctions).map((auction, index) =>
                                    auction.id !== id && (
                                        <option key={auction.id} value={auction.id}>
                                            {auction.auctionname}
                                        </option>
                                    )
                                )
                            ) : (
                                <option disabled value="">
                                    No auction available
                                </option>
                            )}
                        </select>
                    </div>
                    <div className='transferplayer-button'>
                        <div><button data-TestId='transfer-button'onClick={submitForm} disabled={!selectedAuctionId}>Transfer</button></div>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default TransferPlayer;

