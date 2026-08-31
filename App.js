const button = document.getElementById("search");
const api_key = "RIOT_API_KEY"


async function main() {
    const playerData = userInputData()

    const url = getPlayerApiUrl()
    console.log(url)

    const response = await fetch(url)
    const playerPuuid = await response.json()
    const puuid = playerPuuid.puuid
    console.log(puuid)

    const matchHistory = await getPlayerMatchHistory()
    console.log(matchHistory)

    const playerGames = await getPlayerMatches()
    console.log(playerGames)

    const gamesResults = await gameResults()
    console.log(gamesResults)

    const gamesInfo = await gameInfo()
    console.log(gamesInfo)
}

function userInputData(){
    const playerData = new Object()
    
    /* Pega os dados do HTML */
    const nickname = document.getElementById("nickname").value
    const tagline = document.getElementById("tagline").value
    const region = document.getElementById("region").value
    
    /* Seta os dados do objeto*/
    playerData.nickname = nickname
    playerData.tagline = tagline
    playerData.region = region

    return playerData
}

function getPlayerApiUrl(){
    /* Determina o valor da variável para o resultado da função que pega o input do usuário. */
    const playerData = userInputData() 
    
    /* Substitui dinamicamente as variáveis para cada userInput diferente */
    const url = (`https://${playerData.region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${playerData.nickname}/${playerData.tagline}?api_key=${api_key}`)

    return url
}

async function getPlayerPuuid(){
    /* Determina o valor da variável para o url que será feito o fetch */
    const api_url = getPlayerApiUrl()

    /* Utiliza o await para esperar o fetch, após voltar como objeto playerData é determinado o valor de puuid. */
    const response = await fetch(api_url)
    const playerData = await response.json()
    const puuid = playerData.puuid

    return(puuid)
}

async function getPlayerMatchHistory(){
    /* Atribui os dados do usuário e puuid */
    const playerData = userInputData()
    const puuid = await getPlayerPuuid()

    /* Passa os dados do usuário e puuid e retorna um array de matches */
    const matchhistory = await fetch(`https://${playerData.region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=20&api_key=${api_key}`)
    const matches = await matchhistory.json()

    return(matches)
}     

async function getPlayerMatches() {
    /* Atribui os dados do usuário e array de matches */
    const playerData = userInputData()
    const matches = await getPlayerMatchHistory()
    const results = [];

    // Loopa por cada match, adiciona e guarda os valores de cada match em um array.
    for (i = 0; i < matches.length; i++){
        const lastMatch = await fetch(`https://${playerData.region}.api.riotgames.com/lol/match/v5/matches/${matches[i]}?api_key=${api_key}`)
        const lastGame = await lastMatch.json()

        results.push(lastGame)

    }
    return(results)
}

async function gameResults() {
    const results = await getPlayerMatches()
    const puuid = await getPlayerPuuid()

    const participants = [];
    const pIndex = [];
    const userGameResults = [];

    //Pra cada partida no array, pegue os participantes, coloque em um array, depois pegue o index do player em cada partida e coloque no array de index
    for (i = 0; i < results.length; i++){
        participants.push(results[i].metadata.participants)
        pIndex.push(participants[i].indexOf(puuid))
    }

    // Loopa o todas as partidas do usuário pelo seu player index e as coloca em um array apenas com as partidas do usuário.
    for (i = 0; i < 20; i++){
        userGameResults.push(results[i].info.participants[pIndex[i]])
    }

    return(userGameResults)
 
}

async function gameInfo() {
    const userGamesResults = await gameResults()

    // Array de objetos é separado com map, para cada objeto, retorne um novo objeto com apenas determinadas variáveis detro de um array.
    const gamesData = userGamesResults.map((game) => {
        return {
            champion: game.championName,
            kills: game.kills,
            deaths: game.deaths,
            assists: game.assists,
            win: game.win
        };
    });

    return(gamesData)
}


button.addEventListener('click', main)