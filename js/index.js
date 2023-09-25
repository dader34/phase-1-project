// notify(api_key,"error")

const fetchAllCoins = () =>{
    return fetch("https://api.coincap.io/v2/assets/")
    .then(resp => resp.json())
    .then(body => body.data)
}

const fetchCoin = async (coinName) =>{
    const coins = await fetchAllCoins()
    for (let coin of coins){
        const lowerCoin = coinName.toLowerCase()
        if((lowerCoin === coin.id.toLowerCase())||(lowerCoin===coin.name.toLowerCase())||(lowerCoin===coin.symbol.toLowerCase())){
            return coin
        }
    }
}

const getCoinHistory = (coin,interval="m1") =>{
    const url=`https://api.coincap.io/v2/assets/${coin}/history?interval=${interval}`
    return fetch(url)
    .then(resp => resp.json())
    .then(body => body.data)
}

// fetchCoin("BTC").then(console.log)

// getCoinHistory("bitcoin").then(console.log)