import { gql } from '@apollo/client';

export const SEND_CONTACT_FORM = gql`
    mutation($createContactusInput: CreateContactusInput!){
  createContact(createContactusInput:$createContactusInput)
}`;

export const REGISTER_USER = gql`
  mutation ($registerinputs: RegisterUserInputs!) {
    register(registerinputs: $registerinputs) 
  }`;

export const CREATE_AUCTION = gql`
mutation ($createAuctionInput: CreateAuctionInput!) {
  createAuction(createAuctionInput: $createAuctionInput)
}
`;

export const UPDATE_AUCTION = gql`
mutation ($auctionid:String! ,$updateAuctionInput: CreateAuctionInput!) {
  updateAuction(auctionid:$auctionid,updateAuctionInput: $updateAuctionInput)
}
`;

export const CREATE_TEAM = gql`
mutation ($createTeamInput: CreateTeamInput!) {
  createTeam(createTeamInput: $createTeamInput)
}
`;

export const UPDATE_TEAM = gql`
mutation ($teamid:String! ,$updateTeamInput: CreateTeamInput!) {
  updateTeam(teamid:$teamid,updateTeamInput: $updateTeamInput)
}
`;

export const CREATE_PLAYER = gql`
mutation ($createPlayerInput: CreatePlayerInput!) {
  createPlayer(createPlayerInput: $createPlayerInput)
}
`;

export const UPDATE_PLAYER = gql`
mutation ($playerid:String! ,$updatePlayerInput: CreatePlayerInput!) {
  updatePlayer(playerid:$playerid,updatePlayerInput: $updatePlayerInput)
}
`;

export const DELETE_AUCTION = gql`
  mutation($id: String!) {
    deleteAuction(id: $id)
  }
`;


export const FORGOT_PASSWORD = gql`
  mutation ($email: String!) {
    forgotPassword(email: $email)
  }
`;

export const SET_PASSWORD = gql`
  mutation ($updatePasswordInputs: UpdatePasswordInputs!) {
    setPassword(updatePasswordInputs: $updatePasswordInputs)
  }
`;

export const TRANSFER_PLAYER = gql`
mutation($transferData: TransferPlayerInput!) {
  transferPlayer(transferData: $transferData) 
}`;

export const TRANSFER_TEAM = gql`
mutation($transferData: TransferTeamInput!) {
  transferTeam(transferData: $transferData) 
}`;

export const RESET_AUCTION_DATA = gql`
mutation resetAuction($id: String!) {
  resetAuction(id: $id)
}`;

export const REAUCTION_FOR_UNSOLD = gql`
mutation unsoldReauction($id: String!) {
  unsoldReauction(id: $id)
}`;
export const UPDATE_SOLD_PLAYER = gql`
mutation( $UpdatePlayerInput: UpdatePlayerInput!
          $UpdateTeamInput: UpdateTeamInput!
        ){
            updateSoldPlayer(
              UpdatePlayerInput: $UpdatePlayerInput
              UpdateTeamInput: $UpdateTeamInput
            )
        }
`;

export const UPDATE_UNSOLD_PLAYER = gql`
mutation( $UpdatePlayerInput: UpdatePlayerInput!){
          updateUnsoldPlayer(
            UpdatePlayerInput: $UpdatePlayerInput
          )
        }
`;

export const LIVE=gql`
mutation UpdateLive($livestate: Boolean!, $room_id: String!) {
  updatelive(livestate: $livestate, room_id: $room_id) {
    id
    livestate
    room_id
  }
}`;

export const BulkUploadPlayers = gql`
mutation($fileUrl:String!,$auction_id:String!,$filename:String!){
  bulkUploadPlayers(fileUrl:$fileUrl,auction_id:$auction_id,filename:$filename)
}
`;
