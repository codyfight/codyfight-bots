import { IGameState } from '../types/game/index.js'
import { formatName } from './utils.js'
import Position from '../entities/Position.js'

function logGameInfo(gameState: IGameState, ckey: string) {
  try{

    const status = gameState?.state?.status || 'NULL';
    const currentRound = gameState?.state?.round || 'NULL';

    const playerTurn = gameState?.players?.bearer?.is_player_turn || 'NULL';
    const playerPosition = gameState?.players?.bearer?.position || 'NULL';
    const possibleMoves = gameState?.players?.bearer?.possible_moves || [];

    const opponentName = gameState?.players?.opponent?.name || 'NULL';

    const mapSize = gameState?.map?.length || 'NULL';

    const tableData = [
      { Key: "Game Status", Value: status },
      { Key: "Current Round", Value: currentRound },
      { Key: "Opponent Name", Value: opponentName},
      { Key: "Player Turn", Value: playerTurn },
      { Key: "Player Position", Value: playerPosition },
      { Key: "Map Size", Value: mapSize },
      { Key: "Possible Moves", Value: possibleMoves.map((move ) => `[x: ${move.x}, y: ${move.y}]`).join(", ") },
    ];

    console.info(`--- Game Info: ${ckey} ---`);
    console.table(tableData);
    console.info('------------------');
  }catch(error){
    console.log("Logging Error", error)
  }

}


function logGameError(gameState: IGameState, error: any) {
  const playerName = formatName(gameState?.players?.bearer?.name)

  const status = error?.response?.status || error?.status
  const msg = error?.response?.data?.message || error?.message || String(error)

  console.error(`${playerName} - Error: [${status}] ${msg}`)
}

function logApiError(action: string, error: any): void {
  const response = error.response || {};
  const request = error.request || "N/A";
  const message = error.message || "No message provided";
  const errorCode = error.code || "N/A";

  const responseStatus = response.status || "N/A";
  const responseData = response.data ? JSON.stringify(response.data, null, 2) : "No data";

  const errorDetails = [
    { Key: "Action", Value: action },
    { Key: "Error Code", Value: errorCode },
    { Key: "Response Status", Value: responseStatus },
    { Key: "Response Data", Value: responseData },
    { Key: "Request", Value: request },
    { Key: "Message", Value: message },
  ];

  console.error(`--- API Error Log ---`);
  console.table(errorDetails);
  console.error('----------------------');
}



const log = {
  gameInfo: logGameInfo,
  gameError: logGameError,
  apiError: logApiError
}

export default log
