import { IGameState } from '../types/game/index.js'
import { formatName } from './index.js'

function logGameInfo(gameState: IGameState, ckey: string) {
  const status = gameState.state.status;
  const currentRound = gameState?.state?.round;

  const playerTurn = gameState.players.bearer.is_player_turn;
  const playerPosition = gameState.players.bearer.position;
  const possibleMoves = gameState?.players?.bearer?.possible_moves || [];

  const mapSize = gameState.map.length;

  const tableData = [
    { Key: "Game Status", Value: status },
    { Key: "Current Round", Value: currentRound },
    { Key: "Player Turn", Value: playerTurn ? "Yes" : "No" },
    { Key: "Player Position", Value: `x: ${playerPosition.x}, y: ${playerPosition.y}` },
    { Key: "Map Size", Value: mapSize },
    { Key: "Possible Moves", Value: possibleMoves.map((move) => `[x: ${move.x}, y: ${move.y}]`).join(", ") },
  ];

  console.info(`--- Game Info: ${ckey} ---`);
  console.table(tableData);
  console.info('------------------');
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

  const responseStatus = response.status || "N/A";
  const responseData = response.data ? JSON.stringify(response.data, null, 2) : "No data";

  const errorDetails = [
    { Key: "Action", Value: action },
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
