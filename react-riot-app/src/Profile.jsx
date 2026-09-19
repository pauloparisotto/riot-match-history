import { useState } from 'react'
import main from './api/riot'

//Inicialização das variáveis 
function Profile(){
    const [nickname, setNickName] = useState('');
    const [tagline, setTagline] = useState('');
    const [region, setRegion] = useState('');
    const [matchList, setMatchList] = useState([]);

    //Função pro botão de pesquisa, cria objeto com os dados do input e executa main passando o argumento (nesse caso um object).
    async function handleClick(){
        const playerData = new Object();
        playerData.nickname = nickname
        playerData.tagline = tagline
        playerData.region = region

        //Cria um array das matches e atualiza pra poder renderizar posteriormente.
        const matchList = await main(playerData)
        setMatchList(matchList)
    }

    //Pra cada match em matchlist cria um elemento jsx com os dados.
    const eachMatch = matchList.map((match) =>
        <div key = {match.matchId} className="flex-box-all">
            <div>
                Win: {match.win.toString()}
            </div>
            <div>
                Champion: {match.champion}
            </div>
            <div>
                <strong>{match.kills}/</strong>
                <strong>{match.deaths}/</strong>
                <strong>{match.assists}</strong>
            </div>
        </div>);


    return (
        <>  
            <div className="playerInfo">
                {/*Evento onChange = toda vez que input mudar, chama setNickName e vai mudando pro valor do input */}
                <input value={nickname} placeholder="Enter your nickname" onChange={(e) => setNickName(e.target.value)}></input>
                <input value={tagline} placeholder="Enter your tag" onChange={(e) => setTagline(e.target.value)}></input>
                <select value={region} onChange={(e) => setRegion(e.target.value)}>
                    <option>Select Region</option>
                    <option value="americas">Americas</option>
                    <option value ="europe">Europe</option>
                    <option value="asia">Asia</option>
                </select>
            </div>
            <div className="button">
                <button onClick={handleClick}>GG</button>
            </div>
            <div>
                {eachMatch}
            </div>
        </>
    );
}

export default Profile

