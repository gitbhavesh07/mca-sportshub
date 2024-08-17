import { gql } from '@apollo/client';



export const VERIFY_REGISTERATION = gql`
    query($code:String!,$username:String!){
      verifyRegistrationCode(code:$code,username:$username)
    }
`;

export const RESEND_VERIFY = gql`
    query($username:String!){
      resendVerificationCode(username:$username)
    }
`;
export const CONFIRM_REGISTERATION = gql`
    query($confirmationCode:String!,$username:String!){
      confirmEmail(confirmationCode:$confirmationCode,username:$username)
    }
`;

export const RESEND_CONFIRM_REGISTERATION = gql`
      query($username:String!){
        resendConfirmationCode(username:$username)
      }
`;
export const LOGIN_USER = gql`
  query($logininputs: LoginUserInputs!){
    login(logininputs:$logininputs){
      AccessToken
      userName
      userId 
      RefreshToken 
    }
  }
`;

export const REFRESH_TOKEN = `
  query($refreshToken: String!){
    refreshToken(refreshToken:$refreshToken){
        AccessToken
        RefreshToken
    }
  }
`;

export const FIND_USER = gql`
    query($username: String!){
        findUser(username: $username){
            id
            username
            email
        }
    }
`;

export const FIND_USER_BY_ID = gql`
    query($id: String!){
      findUserById(id: $id){
        id
        email
      }
    }
`;

export const VALID_EMAIL = gql`
query($email: String!){
  validEmail(email: $email){
    id
    username
    email
  }
}
`;

export const FIND_USER_AUCTION = gql`
    query($user_id: String!){
        findUserAuctions(user_id: $user_id){
            id
            auctiontype
            auctionname
            auctiondate
            pointsperteam
            minbid
            bidincrease
            playerperteam
            filename
            user_id
        }
    }
`;

export const FIND_AUCTION = gql`
    query($id: String!){
  findAuction(id: $id){
            id
            auctiontype
            auctionname
            auctiondate
            pointsperteam
            minbid
            bidincrease
            playerperteam
            filename
            category
            user_id
            team{
                id
                teamname
                teamshortname
                teamshortcutkey
                availablepoints
                no_of_players
                playercount
                teamfilename
                auction_id
            }
            player{
                id
                playername
                mobilenumber
                fathername
                playerage
                playercategory
                trousersize
                address
                auction_id
                playerstatus
                team_id
                playerfilename
            }
        }
    }
`;

export const FIND_TEAM = gql`
    query($id: String!){
      findTeam(id:$id){
        teamname
        teamfilename
        playercount
        teamshortname
        teamshortcutkey
       player{
        id
        playername
        playerage
        playerfilename
        playercategory
      }
    }
    }
`;

export const FIND_ONE_PLAYER = gql`
    query($id:String!){
      findOnePlayer(id:$id){
        playername
        address
        playercategory
        fathername
        mobilenumber
        playerage
        playerfilename
        trousersize
        tshirtsize
      }
    }
`;

export const DELETE_TEAM = gql`
    query($id: String!){
        deleteTeam(id: $id)
    }
`;

export const DELETE_PLAYER = gql`
    query($id: String!){
        deletePlayer(id: $id)
    }
`;

export const GET_ALL_CLIENTS = gql`
    query {
      getAllClients {
        id
        clientname
        clientlogo
      }
    }`;

export const SEARCH_AUCTIONS = gql`
  query SearchAuctions($auctionname: String!) {
    searchAuctions(auctionname: $auctionname) {
      id
      auctionname
      filename
      auctiondate
    }
  }`;

export const TODAY_AUCTIONS = gql`
query todayAuctions{
  todayAuctions{
  id
  auctionname
  filename
  auctiondate
  }
}`;

export const UPCOMING_AUCTIONS = gql`
query upcomingAuctions{
  upcomingAuctions{
  id
  auctionname
  filename
  auctiondate
  }
}`;

export const FIND_TEAM_STATISTICS = gql`
query($id: String!){
  teamstatistics(id: $id){
    teamname
    playercount
  }
}`;

export const FIND_PLAYER_STATISTICS = gql`
query($id: String!){
  playerstatistics(id: $id){
    playerstatus
  }
}`;

export const GET_LIVE = gql`
query{
  getlive{
     id
     livestate
     room_id
  }
}`;
export const GET_PRESIGNED_URL = gql`
  query($filename: String!){
    getSignerUrlForUpload(filename: $filename)
  }
`;


export const SHOW_TEAM=gql`
query($id: String!){
  showTeam(id:$id){
    id
    teamfilename
    teamshortname
    availablepoints
    playercount
  }
}`;

export const UPLOAD_HISTORY=gql`
query($auctionId: String!){
  uploadHistory(auctionId:$auctionId){
    id
    fileName
    status
    noOfSuccessRecords
    failedDataFilePath
    createdAt
    totalRecords
    auction_id
  }
}`;

export const UPLOAD_STATUS=gql`
query($id:String!){
  uploadStatus(id:$id){
    status
    totalRecords
  }
}`;
