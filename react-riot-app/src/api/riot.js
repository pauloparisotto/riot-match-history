
const api_key = "YOUR_RIOT_API_KEY"

// Recebe o argumento que foi passado como parâmetro na execução do código. 
async function main(playerData) {
    
    const url = getPlayerApiUrl(playerData)

    const response = await fetch(url)
    const playerPuuid = await response.json()
    const puuid = playerPuuid.puuid

    const matchHistory = await getPlayerMatchHistory(playerData, puuid)

    const playerGames = await getPlayerMatches(playerData, matchHistory)

    const gamesResults = await gameResults(puuid, playerGames)

    const gamesInfo = await gameInfo(gamesResults, matchHistory)
    
    return (gamesInfo)
}

//Recebe playerData diretamente dos inputs e monta a url pra dar fetch. 
function getPlayerApiUrl(playerData){
    
    /* Substitui dinamicamente as variáveis para cada userInput diferente */
    const url = (`https://${playerData.region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${playerData.nickname}/${playerData.tagline}?api_key=${api_key}`)

    return url
}

async function getPlayerPuuid(playerData){
    /* Determina o valor da variável para o url que será feito o fetch */
    const api_url = getPlayerApiUrl(playerData)

    /* Utiliza o await para esperar o fetch, após voltar como objeto playerData é determinado o valor de puuid. */
    const response = await fetch(api_url)
    const uniqueId = await response.json()
    const puuid = uniqueId.puuid

    return(puuid)
}

//Recebe playerData pra poder fazer o fetch.
async function getPlayerMatchHistory(playerData, puuid){
    /* Passa os dados do usuário e puuid e retorna um array de matches */
    const matchhistory = await fetch(`https://${playerData.region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=20&api_key=${api_key}`)
    const matches = await matchhistory.json()

    return(matches)
}     

async function getPlayerMatches(playerData, matches) {
    /* Atribui os dados do usuário e array de matches */
    const results = [];

    // Loopa por cada match, adiciona e guarda os valores de cada match em um array.
    for (let i = 0; i < matches.length; i++){
        const lastMatch = await fetch(`https://${playerData.region}.api.riotgames.com/lol/match/v5/matches/${matches[i]}?api_key=${api_key}`)
        const lastGame = await lastMatch.json()

        results.push(lastGame)

    }
    return(results)
}

async function gameResults(puuid, results) {

    const participants = [];
    const pIndex = [];
    const userGameResults = [];

    //Pra cada partida no array, pegue os participantes, coloque em um array, depois pegue o index do player pesquisado em cada partida e coloque no array de index.
    for (let i = 0; i < results.length; i++){
        participants.push(results[i].metadata.participants)
        pIndex.push(participants[i].indexOf(puuid))
    }

    // Loopa o todas as partidas do usuário pelo seu player index e as coloca em um array apenas com as partidas do usuário.
    for (let i = 0; i < 20; i++){
        userGameResults.push(results[i].info.participants[pIndex[i]])
    }

    return(userGameResults)
 
}

async function gameInfo(userGamesResults, matches) {
    /* Array de objetos é separado com map, para cada objeto, retorne um novo objeto com apenas determinadas variáveis detro de um array.
    Também é esperado pela função o array com as match_ids, para cada componente ter seu id) */
    const gamesData = userGamesResults.map((game, index) => {
        return {
            champion: game.championName,
            kills: game.kills,
            deaths: game.deaths,
            assists: game.assists,
            win: game.win,
            matchId: matches[index]
        };
    });

    return(gamesData)
}

export default main;

