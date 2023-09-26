//notify(api_key,"error")

"use strict"

// ! -- Connor's Code --

const coinList = document.querySelector("#results");

const fetchAllCoins = () => {
    return fetch("https://api.coincap.io/v2/assets/")
        .then((resp) => resp.json())
        .then((body) => body.data);
};

const fetchCoin = async (coinName) => {
    const coins = await fetchAllCoins();
    for (let coin of coins) {
        const lowerCoin = coinName.toLowerCase();
        if (
            lowerCoin === coin.id.toLowerCase() ||
            lowerCoin === coin.name.toLowerCase() ||
            lowerCoin === coin.symbol.toLowerCase()
        ) {
            return coin;
        }
    }
};

const getCoinHistory = (coin, interval = "m1") => {
    const url = `https://api.coincap.io/v2/assets/${coin}/history?interval=${interval}`;
    return fetch(url)
        .then((resp) => resp.json())
        .then((body) => body.data);
};

const renderLi = (coin) => {
    const listedCoin = document.createElement("li");
    listedCoin.classList.add("listedCoin");
    listedCoin.dataset.id = coin.id;
    listedCoin.textContent = `${coin.name} -- ${coin.symbol}`;
    listedCoin.addEventListener('click', () => displayCoin(coin));
    coinList.appendChild(listedCoin);
};

const populateCoinList = (coinsObj) => {
    for (let coin of coinsObj) {
        renderLi(coin);
    }
};

const filterByAZ = (coinsObj) => {
    const toBeSorted = [];
    for (let coin of coinsObj) {
        toBeSorted.push(coin);
    }
    toBeSorted.sort((a, b) => {
        return a.name.localeCompare(b.name);
    });
    return toBeSorted;
};

const filterByGains = (coinsObj, upOrDown) => {
    const toBeSorted = [];
    for (let coin of coinsObj) {
        toBeSorted.push(coin);
    }
    if (upOrDown === 0) {
        toBeSorted.sort((a, b) => {
            return parseFloat(b.changePercent24Hr) - parseFloat(a.changePercent24Hr);
        });
    } else {
        toBeSorted.sort((a, b) => {
            return parseFloat(a.changePercent24Hr) - parseFloat(b.changePercent24Hr);
        });
    }
    return toBeSorted;
};

const filterByPrice = (coinsObj, upOrDown) => {
    const toBeSorted = [];
    for (let coin of coinsObj) {
        toBeSorted.push(coin);
    }
    if (upOrDown === 0) {
        toBeSorted.sort((a, b) => {
            return parseFloat(b.priceUsd) - parseFloat(a.priceUsd);
        });
    } else {
        toBeSorted.sort((a, b) => {
            return parseFloat(a.priceUsd) - parseFloat(b.priceUsd);
        });
    }
    return toBeSorted;
}

const filterByName = (coinName) => {
    coinList.innerHTML = ""
    fetchAllCoins().then(coinsObj => {
        coinsObj.forEach(coin => {
            const lowerCoin = coinName.toLowerCase()
            if (coin.id.toLowerCase().startsWith(lowerCoin) ||
                coin.name.toLowerCase().startsWith(lowerCoin) ||
                coin.symbol.toLowerCase().startsWith(lowerCoin)) {
                renderLi(coin)
            }
        })
    })
}

const fetchCoinImages = (coin) => {
    return fetch('src/CoinAssets.json')
        .then(resp => resp.json())
        .then(data => {
            return data.find(element => element['asset_id'] === coin.symbol)
        })
}

const formatPrice = (price) => {
    return parseFloat(price).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: (price > 1) ? 2 : 8,
    });
}

const fetchDailyChange = (coinName) =>{
    return fetchCoin(coinName)
    .then(coin =>{
        formatDailyChange(coin.changePercent24Hr)
        return coin.changePercent24Hr
    })
}

const formatDailyChange = (priceChange) => {
    const slice = priceChange.slice(0, 4);
    const noNegativeSlice = priceChange.replace("-","").slice(0, 4)
    const arrowIcon = document.querySelector(".material-symbols-outlined");
    
    arrowIcon.classList.remove("upArrow", "downArrow");
    
    if (slice > 0) {
      arrowIcon.classList.add("upArrow");
      arrowIcon.textContent = "arrow_drop_up";
    } else {
      arrowIcon.classList.add("downArrow");
      arrowIcon.textContent = "arrow_drop_down";
    }
    console.log(slice)
    return noNegativeSlice + "%";
  };


const displayCoin = (coin) => {
    const title = document.querySelector("#coinName")
    const price = document.querySelector("#coinPrice")
    const image = document.querySelector("#coinImg")
    const priceChange = document.querySelector("#priceChange")
    title.textContent = coin.name
    price.textContent = formatPrice(coin.priceUsd)
    fetchDailyChange(coin.name).then(data => priceChange.textContent = formatDailyChange(data))
    fetchCoinImages(coin)
        .then(coinObj => {
            if (coinObj) {
                image.src = coinObj.url
            } else {
                image.src = 'src/download.jpeg'
                console.log(coin.symbol)
            }
            image.alt = coin.symbol
        })
}



document.querySelector("#filter").addEventListener("change", (e) => {
    coinList.innerHTML = "";
    switch (e.target.value) {
        case "default":
            fetchAllCoins().then(populateCoinList);
            break;

        case "alphabetical":
            fetchAllCoins().then(filterByAZ).then(populateCoinList);
            break;

        case "biggestDailyGains":
            fetchAllCoins()
                .then((coinsObj) => {
                    return filterByGains(coinsObj, 0);
                })
                .then(populateCoinList);
            break;

        case "biggestDailyLosses":
            fetchAllCoins()
                .then((coinsObj) => {
                    return filterByGains(coinsObj, 1);
                })
                .then(populateCoinList);
            break;

        case "priceHighest":
            fetchAllCoins()
                .then((coinsObj) => {
                    return filterByPrice(coinsObj, 0);
                })
                .then(populateCoinList);
            break;

        case "priceLowest":
            fetchAllCoins()
                .then((coinsObj) => {
                    return filterByPrice(coinsObj, 1);
                })
                .then(populateCoinList);
            break;
    }
});


document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault()
    // console.log(e.target.Name)
    filterByName(e.target.Name.value)
})

fetchAllCoins().then(populateCoinList)

// fetchCoin("BTC").then(console.log)

// getCoinHistory("bitcoin").then(console.log)
