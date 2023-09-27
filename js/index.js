"use strict"
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
//<Initialize variables>//
const coinList = document.querySelector("#results");
const filterWindow = document.querySelector('#filterWindow')
const myCoinsCollection = document.querySelector('#myCoinsCollection')
const dropDownSelect = document.querySelector("#chrono")
const coinAndGraphDiv = document.querySelector('#coinAndGraphDiv')
const addCoinButton = document.querySelector('#addCoinButton')
const resetCoins = document.querySelector("#reset")
// const cookie = document.cookie
// console.log(cookie)
//<Variable to decide when to load mycoins tab>//
let isDoneLoading = false
//<Variable to store current coin>//
let currentCoin;
//<Variables to store top coins and myCoins>//
let topFiveCoins = []
let myCoins = []

//<Get all data for all coins and return arr in promise form>//
const fetchAllCoins = () => {
    return fetch("https://api.coincap.io/v2/assets/")
        .then((resp) => resp.json())
        .then((body) => body.data)
        .catch(e => {notify("Error fetching data, please reload","error")})
};

//<Using above function, find coin based off id, name, or symbol and return coin obj>//
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


//<Get coin history given a coin name, returns arr of coin history in promise form>//
const fetchCoinHistory = (coinName, interval = "m1") => {
    const url = `https://api.coincap.io/v2/assets/${coinName}/history?interval=${interval}`;
    return fetch(url)
        .then((resp) => resp.json())
        .then((body) => body.data)
        .catch(e => {notify("Error fetching graph, please reload","error")})
};

//<Gets coin images from local json file, returns logo in png>//
const fetchCoinImages = (coin) => {
    return fetch('src/CoinAssets.json')
        .then(resp => resp.json())
        .then(data => {
            return data.find(coin => coin['asset_id'] === requestedCoin.symbol)
        })
}

// ! ---- Render/Populate Functions ----

//<Renders a list item for a coin in the search area>//
const renderLi = (coin) => {
    const listedCoin = document.createElement("li");
    listedCoin.classList.add("listedCoin");
    listedCoin.dataset.id = coin.id;
    listedCoin.textContent = `${coin.name} -- ${coin.symbol}`;
    listedCoin.addEventListener('click', () => {
        dropDownSelect.selectedIndex = 0 
        displayFeaturedCoin(coin) 
    });
    coinList.appendChild(listedCoin);
};

//<Appends multiple list items into search area>//
const populateCoinList = (coinsObj) => {
    for (let coin of coinsObj) {
        renderLi(coin);
    }
    return coinsObj;
};

const populateFilter = (coinsObj) => {
    coinsObj.forEach((coin) => {
        const newCoin = createCoinBadge(coin)
        filterWindow.appendChild(newCoin)
    })
}

const populateMyCoins = () => {
    console.log(myCoins)
    myCoins.forEach((coin) => {
        const newCoin = createCoinBadge(coin)
        const deleteButton = document.createElement('button')
        deleteButton.textContent = 'X'
        deleteButton.classList.add('deleteButton')
        // Store newCoin as a property of the deleteButton
        deleteButton.newCoin = newCoin;
        deleteButton.addEventListener('click', e => {
            // Access newCoin via e.target.newCoin
            myCoins.forEach(myCoin => {
                if (myCoin.symbol === e.target.newCoin.querySelector('h3').textContent) {
                    myCoins.splice(myCoins.indexOf(coin), 1)
                }
            })
            e.target.parentNode.remove()
        })
        newCoin.appendChild(deleteButton)
        myCoinsCollection.appendChild(newCoin)
    })
}

const renderCoinBadge = () => {
    const coinBadge = document.createElement('span')
    const badgeSymbol = document.createElement('h3')
    const badgeImg = document.createElement('img')
    const badgePrice = document.createElement('p')
    badgePrice.classList.add('price')
    const badgeChange = document.createElement('p')
    badgeChange.classList.add('change')
    coinBadge.append(badgeSymbol, badgeImg, badgePrice, badgeChange)
    return coinBadge
}

const createCoinBadge = (coin) => {
    const newCoinBadge = renderCoinBadge()
    newCoinBadge.classList.add('coinBadge')
    newCoinBadge.querySelector('h3').textContent = coin.symbol        
    newCoinBadge.querySelector('img').alt = coin.symbol
    newCoinBadge.querySelector('.price').textContent = formatPrice(coin.priceUsd)
    const renderedChange = newCoinBadge.querySelector('.change')
    renderedChange.textContent = formatDailyChange(coin.changePercent24Hr)
    renderedChange.textContent.startsWith('↑') ? renderedChange.classList.add('changeUp') : renderedChange.classList.add('changeDown')
    fetchCoinImages(coin)
    .then(coinObj => {
        (coinObj) ? newCoinBadge.querySelector('img').src = coinObj.url : newCoinBadge.querySelector('img').src = 'src/download.jpeg'
    })     
    return newCoinBadge
}

const displayFeaturedCoin = (coin) => {
    const coinSymbol = document.querySelector("#featuredSymbol")
    const coinName = document.querySelector("#featuredName")
    const image = document.querySelector("#featuredImage")
    const priceChange = document.querySelector("#featuredChange")
    const coinPrice = document.querySelector('#featuredPrice')
    const coinCap = document.querySelector("#featuredCoinCap > p")
    const coinVolume = document.querySelector("#featuredCoinVolume > p")
    const coinRank = document.querySelector("#featuredCoinRank > p")
    coinSymbol.textContent = coin.symbol
    coinName.textContent = coin.name;
    coinPrice.textContent = formatPrice(coin.priceUsd)
    priceChange.textContent = formatDailyChange(coin.changePercent24Hr)
    priceChange.className = ""
    priceChange.textContent.startsWith('↑') ? priceChange.classList.add('changeUp') : priceChange.classList.add('changeDown')
    coinCap.textContent = formatLargeNum(coin.marketCapUsd)
    coinVolume.textContent = formatLargeNum(coin.volumeUsd24Hr)
    coinRank.textContent = coin.rank

    currentCoin = coin

    fetchCoinImages(coin)
    .then(coinObj => {
        (coinObj) ? image.src = coinObj.url : image.src = 'src/download.jpeg'
    })     
    .then(displayCoinGraph(coin))
}

addCoinButton.addEventListener("click", () => {
    if(!myCoins.includes(currentCoin) && myCoins.length<5){
        myCoinsCollection.innerHTML = ''
        myCoins.push(currentCoin)
        populateMyCoins(myCoins)      
    }else{
        console.log("test")
        notify("You already have 5 personal coins","error")
    }
})

// ! ---- Filter Functions ----

const populateFilter = (coinsObj) => {
    coinsObj.forEach((coin) => {
        const newCoin = createCoinBadge(coin)
        filterWindow.appendChild(newCoin)
    })
}

const populateMyCoins = () => {
    console.log(myCoins)
    myCoins.forEach((coin) => {
        const newCoin = createCoinBadge(coin)
        const deleteButton = document.createElement('button')
        deleteButton.textContent = 'X'
        deleteButton.classList.add('deleteButton')
        // Store newCoin as a property of the deleteButton
        deleteButton.newCoin = newCoin;
        deleteButton.addEventListener('click', e => {
            // Access newCoin via e.target.newCoin
            myCoins.forEach(myCoin => {
                if (myCoin.symbol === e.target.newCoin.querySelector('h3').textContent) {
                    myCoins.splice(myCoins.indexOf(coin), 1)
                }
            })
            e.target.parentNode.remove()
        })
        newCoin.appendChild(deleteButton)
        myCoinsCollection.appendChild(newCoin)
    })
}

const renderCoinBadge = () => {
    const coinBadge = document.createElement('span')
    const badgeSymbol = document.createElement('h3')
    const badgeImg = document.createElement('img')
    const badgePrice = document.createElement('p')
    badgePrice.classList.add('price')
    const badgeChange = document.createElement('p')
    badgeChange.classList.add('change')
    coinBadge.append(badgeSymbol, badgeImg, badgePrice, badgeChange)
    return coinBadge
}

const createCoinBadge = (coin) => {
    const newCoinBadge = renderCoinBadge()
    newCoinBadge.classList.add('coinBadge')
    newCoinBadge.querySelector('h3').textContent = coin.symbol        
    newCoinBadge.querySelector('img').alt = coin.symbol
    newCoinBadge.querySelector('.price').textContent = formatPrice(coin.priceUsd)
    const renderedChange = newCoinBadge.querySelector('.change')
    renderedChange.textContent = formatDailyChange(coin.changePercent24Hr)
    renderedChange.textContent.startsWith('↑') ? renderedChange.classList.add('changeUp') : renderedChange.classList.add('changeDown')
    fetchCoinImages(coin)
    .then(coinObj => {
        (coinObj) ? newCoinBadge.querySelector('img').src = coinObj.url : newCoinBadge.querySelector('img').src = 'src/download.jpeg'
    })     
    return newCoinBadge
}

const displayFeaturedCoin = (coin) => {
    const coinSymbol = document.querySelector("#featuredSymbol")
    const coinName = document.querySelector("#featuredName")
    const image = document.querySelector("#featuredImage")
    const priceChange = document.querySelector("#featuredChange")
    const coinPrice = document.querySelector('#featuredPrice')
    const coinCap = document.querySelector("#featuredCoinCap > p")
    const coinVolume = document.querySelector("#featuredCoinVolume > p")
    const coinRank = document.querySelector("#featuredCoinRank > p")
    coinSymbol.textContent = coin.symbol
    coinName.textContent = coin.name;
    coinPrice.textContent = formatPrice(coin.priceUsd)
    priceChange.textContent = formatDailyChange(coin.changePercent24Hr)
    priceChange.className = ""
    priceChange.textContent.startsWith('↑') ? priceChange.classList.add('changeUp') : priceChange.classList.add('changeDown')
    coinCap.textContent = formatLargeNum(coin.marketCapUsd)
    coinVolume.textContent = formatLargeNum(coin.volumeUsd24Hr)
    coinRank.textContent = coin.rank

    currentCoin = coin

    fetchCoinImages(coin)
    .then(coinObj => {
        (coinObj) ? image.src = coinObj.url : image.src = 'src/download.jpeg'
    })     
    .then(displayCoinGraph(coin))
}

addCoinButton.addEventListener("click", () => {
    if(!myCoins.includes(currentCoin) && myCoins.length<5){
        myCoinsCollection.innerHTML = ''
        myCoins.push(currentCoin)
        populateMyCoins(myCoins)      
    }else{
        console.log("test")
        notify("You already have 5 personal coins","error")
    }
})

// ! ---- Filter Functions ----

//<Given an array of coins, sorts them alphabetically>//
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

//<Given a array of coins, sorts them by 24 Gain/loss>//
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

//<Given an array of coins, sorts them by price high/low>//
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

//<Given coin name, id, or symbol, search for coin in list of all coins>//
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

// ! ---- Formatting Functions ----

//<Given price, formats it into currency format and changes decimals depending on number>//
const formatPrice = (price) => {
    return parseFloat(price).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: (price > 1) ? 2 : 8,
    });
}

//<Given large num, format number with no decimals>//
const formatLargeNum = (price) =>{
    const newPrice = parseFloat(price).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
    })
    return newPrice.slice(0,newPrice.length-3)
}

const fetchDailyChange = (coinName) => {
    return fetchCoin(coinName)
        .then(coin => {
            formatDailyChange(coin.changePercent24Hr)
            return coin.changePercent24Hr
        })
}

const formatDailyChange = (priceChange) => {
    const slice = priceChange.slice(0, 4);
    const noNegativeSlice = priceChange.replace("-", "").slice(0, 4)
    if (slice > 0) {
        const newSlice = '↑' + noNegativeSlice + "%";
        return newSlice;
    } else {
        const newSlice = '↓' + noNegativeSlice + "%";
        return newSlice;
    }
};

//<D3.js function to create graph>//
const createLineGraph = (data, divId) => {
    const parentDiv = document.querySelector(divId);
    //variable that lets the graph know how low it needs to start
    const minYValue = d3.min(data, d => d.priceUsd);
    //first and last prices of the day to check if price was 
    //positive or negative for the day
    const firstPoint = data[0].priceUsd
    const lastPoint = data[data.length - 1].priceUsd
    //function to update graph dimensions on window resize
    //updateDimensions() -> Void
    const updateDimensions = () => {
        //use requestAnimationFrame to redraw graphs every frame of resize
        window.requestAnimationFrame(() => {
            const parentWidth = parentDiv.clientWidth;
            const parentHeight = parentDiv.clientHeight;
            const svgWidth = 100; 
            const svgHeight = 100;

            //if svg exists, delete so we can redraw
            if (parentDiv.querySelector("svg")) parentDiv.querySelector("svg").remove()
            //create SVG to draw graph on inside of div
            const svg = d3.select(divId)
                .append('svg')
                .attr('width', parentWidth)
                .attr('height', parentHeight)
                .append('g')

            //creates x axis scalar given time
            const xScale = d3.scaleTime()
                .domain(d3.extent(data, d => new Date(d.time))) // Use d3.extent to get the min and max dates
                .range([0, parentWidth]);

            //creates y axis scalar given data points
            const yScale = d3.scaleLinear()
                .domain([minYValue, d3.max(data, d => d.priceUsd)])
                .range([parentHeight, 0]);

            //draw line with given x and y data points
            const line = d3.line()
                .x(d => xScale(new Date(d.time)))
                .y(d => yScale(d.priceUsd));

            //append line to svg with css styling attributes
            svg.append('path')
                .datum(data)
                .attr('class', 'line')
                .attr('d', line)
                .attr('fill', 'none')
                //turn graph green/red depending on beginning and ending price
                .attr('stroke', (lastPoint > firstPoint ? "green" : "red"))
                .attr('stroke-width', 2);

        });
    }

    //initial call to scale/create graph
    updateDimensions();
    //event listener to call resize function on window resize
    window.addEventListener('resize', updateDimensions);
}

//<Function to display graph onto main graph div with varying interval>//
const displayCoinGraph = (coin,interval="m1") => {
    //Get coin history and append graph to div
    fetchCoinHistory(coin.id.toLowerCase(),interval).then(data => {
        createLineGraph(data, "#graph")
    })
}
//<Event listener for filter options to switch between filters>//
document.querySelector("#filter").addEventListener("change", (e) => {
    coinList.innerHTML = "";
    switch (e.target.value) {
        case "default":
            fetchAllCoins().then(populateCoinList).then(populateFilter);
            break;
        case "alphabetical":
            fetchAllCoins().then(filterByAZ).then(populateCoinList).then(populateFilter);
            break;

        case "biggestDailyGains":
            fetchAllCoins()
                .then((coinsObj) => {
                    return filterByGains(coinsObj, 0);
                })
                .then(populateCoinList).then(populateFilter);
            break;

        case "biggestDailyLosses":
            fetchAllCoins()
                .then((coinsObj) => {
                    return filterByGains(coinsObj, 1);
                })
                .then(populateCoinList).then(populateFilter);
            break;

        case "priceHighest":
            fetchAllCoins()
                .then((coinsObj) => {
                    return filterByPrice(coinsObj, 0);
                })
                .then(populateCoinList).then(populateFilter);
            break;

        case "priceLowest":
            fetchAllCoins()
                .then((coinsObj) => {
                    return filterByPrice(coinsObj, 1);
                })
                .then(populateCoinList).then(populateFilter);
            break;
    }
});


document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault()
    //Run submission text through search func
    filterByName(e.target.Name.value)
})

//<Event listener for graph interval change>//
dropDownSelect.addEventListener("change",(e)=>{
    const selection = e.target.value
    //Case for every value of dropdown to change api call for interval of graph (D,M,Y)
    switch(selection){
      case "day":
        displayCoinGraph(currentCoin,"m1")
        break
      case "month":
        displayCoinGraph(currentCoin,"h1")
        break
      case "year":
        displayCoinGraph(currentCoin,"d1")
        break
    }
  })

// ! Page Load functions --

fetchAllCoins()
    .then((coinsObj) => {
        //Display all coin info given coins array
        populateCoinList(coinsObj)
        populateMyCoins(myCoins)
        populateFilter(coinsObj)
        displayFeaturedCoin(coinsObj[0])
})

resetCoins.addEventListener('click',()=>{myCoins = []; myCoinsCollection.innerHTML=""})
