// notify(api_key,"error")

// ! -- Connor's Code --

const coinList = document.querySelector('#results')

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
};

const renderLi = (coin) => {
    const listedCoin = document.createElement('li');
    listedCoin.classList.add('listedCoin');
    listedCoin.dataset.id = coin.id;
    listedCoin.textContent = `${coin.name} -- ${coin.symbol}`;
    // listedCoin.addEventListener('click', displayCoinToWindow);
    coinList.appendChild(listedCoin);
};

const populateCoinList = (coinsObj) => {
    for (coin of coinsObj) {
        renderLi(coin)
    }
}

const filterByAZ = (coinsObj) => {
        const toBeSorted = []
        for (coin of coinsObj) {
        toBeSorted.push(coin)
        }
        toBeSorted.sort((a, b) => {
        return a.name.localeCompare(b.name)
        })
        return toBeSorted;
}

document.querySelector('#filter').addEventListener('change', (e) => {
    coinList.innerHTML = ''
    switch (e.target.value) {
        case 'default':
            fetchAllCoins()
            .then(populateCoinList)
            break;
        case 'alphabetical':
            fetchAllCoins()
            .then(filterByAZ)
            .then(populateCoinList)
            break;
    }
})



// fetchCoin("BTC").then(console.log)

// getCoinHistory("bitcoin").then(console.log)