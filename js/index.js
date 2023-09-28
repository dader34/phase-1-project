"use strict"
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
//<Initialize variables>//
const coinList = document.querySelector("#results");
const fiveCoins = document.querySelector('#fiveCoins')
const dropDownSelect = document.querySelector("#chrono")
const topCoinsBtn = document.querySelector('#topCoinsButton')
const myCoinsBtn = document.querySelector('#myCoinsButton')
const addCoinButton = document.querySelector('#addCoinButton')
const resetCoins = document.querySelector("#reset")
//<Variables for featured coin elements>//
const coinSymbol = document.querySelector("#featuredCoinSpan > h2")
const coinName = document.querySelector("#featuredCoinSpan > h4")
const image = document.querySelector("#coinImg")
const priceChange = document.querySelector("#featuredChange")
const coinPrice = document.querySelector('#featuredPrice')
const mktCap = document.querySelector("#stats > span:nth-child(1) > p:nth-child(2)")
const vol = document.querySelector("#stats > span:nth-child(2) > p:nth-child(2)")
const rank = document.querySelector("#stats > span:nth-child(3) > p:nth-child(2)")
const compMktCap = document.querySelector("#compMktCap")
const compVol = document.querySelector("#compVol")
const compRank = document.querySelector("#compRank")
//<Variable to decide when to load mycoins tab>//
let isDoneLoading = false
//<Variable to store current coin>//
let currentCoin;
//<Variable to store myCoins>//
let myCoins = []

// ! ---- Fetch Functions ----

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
            return data.find(element => element['asset_id'] === coin.symbol)
        })
        .catch(e => notify(e,"error"))
}

// ! ---- Filter Functions ----

//<Given an array of coins, sorts them alphabetically>//
const filterByAZ = (coinsObj, upOrDown=0) => {
    const toBeSorted = [...coinsObj]
    toBeSorted.sort((a, b) => {
        return (upOrDown === 0) ? a.name.localeCompare(b.name) : a.symbol.localeCompare(b.symbol);
    });
    return toBeSorted;
};

//<Given a array of coins, sorts them by 24 Gain/loss>//
const filterByGains = (coinsObj, upOrDown) => {
    const toBeSorted = [...coinsObj]
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
    const toBeSorted = [...coinsObj]
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
                renderListedCoin(coin)
            }
        })
    })
}

// ! ---- Format Functions ----

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
        minimumFractionDigits: 2,
    })
    return newPrice.slice(0,newPrice.length-3)
}

//<Given daily change percent, returns arrow up or down + changed + %//>
const formatDailyChange = (priceChange) => {
    const slice = priceChange.slice(0, 4);
    const noNegativeSlice = priceChange.replace("-", "").slice(0, 4)
    return (slice > 0) ? '↑' + noNegativeSlice + "%" : '↓' + noNegativeSlice + "%";
};

const formatCurrency = (currencyStr) => {
    let temp = currencyStr.replace(/[^0-9.-]+/g, "");
    return parseFloat(temp);
}

// ! ---- Render/Populate Functions ----


//<Renders a list item for a coin in the search area>//
const renderListedCoin = (coin) => {
    const listedCoin = document.createElement("li");
    listedCoin.classList.add("listedCoin");
    listedCoin.textContent = `${coin.name} - ${coin.symbol}`;
    listedCoin.addEventListener('click', () => {
        dropDownSelect.selectedIndex = 0 
        displayCoin(coin) 
    });
    coinList.appendChild(listedCoin);
};

//<Appends multiple list items into search area>//
const populateCoinList = (coinsObj) => {
    for (let coin of coinsObj) {
        renderListedCoin(coin)
    }
    return coinsObj
};

//TODO Do we need all these divs?
//<Create default elements for coin badges>//
const renderCoinBadge = () => {
    //Element references
    const coinBadge = document.createElement('span')
    const leftBadge = document.createElement('div')
    const rightBadge = document.createElement('div')
    const badgeSymbol = document.createElement('h3')
    const badgeImg = document.createElement('img')
    const badgePrice = document.createElement('p')
    const badgeChange = document.createElement('p')
    //Set classes for styling
    coinBadge.classList.add('coinSpan')
    rightBadge.classList.add('rightCoinBadge')
    leftBadge.classList.add('leftCoinBadge')
    //Append to create html heirarchy
    leftBadge.append(badgeImg, badgeSymbol)
    rightBadge.append(badgePrice, badgeChange)
    coinBadge.append(leftBadge, rightBadge)
    fiveCoins.appendChild(coinBadge)
    //Returns finished element
    return coinBadge;
}

//<Apply color for increase or decrease over last 24 hrs>
const setColorForDailyChange = (topCoin) => {
    return topCoin.changePercent24Hr.split('')[0] === '-' ? 'red' : 'green'
}

//<Populate elements text with coin attributes>
const populateCoinBadge = (coinBadge, topCoin) => {
    coinBadge.querySelector('h3').textContent = topCoin.symbol
    coinBadge.querySelector('p:nth-child(1)').textContent = formatPrice(topCoin.priceUsd)
    coinBadge.querySelector('p:nth-child(2)').textContent = formatDailyChange(topCoin.changePercent24Hr)
    coinBadge.querySelector('p:nth-child(2)').style = `color: ${setColorForDailyChange(topCoin)}`
}

//<Adds delete button to coin badge>
const addDeleteButton = (badge, topCoin) => {
    const deleteButton = document.createElement('button');
    deleteButton.textContent = "X";
    deleteButton.classList.toggle("deleteButton");
    deleteButton.addEventListener('click', (e) => {
        myCoins.forEach(myCoin => {
            if (myCoin.symbol === e.target.parentNode.querySelector('h3').textContent) {
                myCoins.splice(myCoins.indexOf(myCoin), 1)
            }
        })  
        const coinsArray = document.cookie.split("=")[1].split(",") 
        console.log(document.cookie.split("=")[1])
        coinsArray.splice(coinsArray.indexOf(topCoin.name),1)
        document.cookie = "cookie=" + coinsArray.join(",")
        e.target.parentNode.remove()
    });
    badge.appendChild(deleteButton);
}

//<Attaches comparison event listeners to badge>
const attachComparers = (badge, topCoin) => {
    badge.addEventListener('mouseover', () => displayComparisons(topCoin));
    badge.addEventListener('mouseleave', () => {
            const color = 'color: rgba(23, 23, 26)'
            compMktCap.style = color
            compVol.style = color
            compRank.style = color
    })
}

//<Create a whole coin badge element with data for that coin>
const createCoinBadge = (topCoin, loadingMyCoins = 0) => {
    const badge = renderCoinBadge(topCoin);
    populateCoinBadge(badge, topCoin);
    if(loadingMyCoins === 1) addDeleteButton(badge, topCoin)
    attachComparers(badge, topCoin)
    fetchCoinImages(topCoin)
    .then(coinObj  => (coinObj) ? badge.querySelector('img').src = coinObj.url : badge.querySelector('img').src = 'src/penny.png')
    fiveCoins.appendChild(badge);
    return badge;
}

//<Given array of coins, populate top 5 coins on to top5 div>//
const populateFilterList = (coinsObj) => {
    fiveCoins.innerHTML=""
    document.querySelector('#reset').style = 'display: none'
    coinsObj.forEach((coin) => {
        createCoinBadge(coin, 0)
    })
}

//<Given array of coins, populate my coins and set cookie to my coins for persistance>//
const populateMyCoins = (coinsObj) => {
    fiveCoins.innerHTML=""
    document.querySelector('#reset').style = 'display: flex'
    let cookieCoins = []
        myCoins.forEach(coin =>{
            if(coin){
                cookieCoins.push(coin.name)
            }
        })
        const beforeCookie = cookieCoins.join(",")
        const newCookie = "cookie=" + beforeCookie
        document.cookie = newCookie
    coinsObj.forEach((myCoin) => {
        createCoinBadge(myCoin, 1)
    })
}

//<Given coin object, display coin onto main div with all of data, and creats graph>//
const displayCoin = (coin) => {
    //Set text value of elements to coin attributes
    mktCap.textContent = formatLargeNum(coin.marketCapUsd)
    vol.textContent = formatLargeNum(coin.volumeUsd24Hr)
    rank.textContent = coin.rank
    coinSymbol.textContent = coin.symbol
    coinName.textContent = coin.name;
    image.alt = coin.symbol
    coinPrice.textContent = formatPrice(coin.priceUsd)
    //get daily change and then run it through format for arrow and color
    priceChange.textContent = formatDailyChange(coin.changePercent24Hr)
    priceChange.style = `color: ${setColorForDailyChange(coin)}`
    currentCoin = coin
    //Gets coin images
    fetchCoinImages(coin)
        .then(coinObj  => (coinObj) ? image.src = coinObj.url : image.src = 'src/penny.png')
        //TODO I broke this
        .then(displayCoinGraph(coin))
}

// ! ---- Compare Functions ----

const displayComparisons = (coin) => {
    if (coin.name !== currentCoin.name) {
        compMktCap.textContent = formatLargeNum(coin.marketCapUsd)
        compVol.textContent = formatLargeNum(coin.volumeUsd24Hr)
        compRank.textContent = coin.rank
        
        formatCurrency(compMktCap.textContent) < formatCurrency(mktCap.textContent) ? compMktCap.style = 'color: red' : compMktCap.style = 'color: green'
        formatCurrency(compVol.textContent) < formatCurrency(vol.textContent) ? compVol.style = 'color: red' : compVol.style = 'color: green'
        formatCurrency(compRank.textContent) < formatCurrency(rank.textContent) ? compRank.style = 'color: green' : compRank.style = 'color: red'
    
    }
}

// ! ---- Graph Functions ----

//<D3.js function to create graph>//const createLineGraph = (data, divId) => {
const createLineGraph = (data, divId) => {
    const parentDiv = document.querySelector(divId);
    const minYValue = d3.min(data, d => d.priceUsd);
    const firstPoint = data[0].priceUsd;
    const lastPoint = data[data.length - 1].priceUsd;

    const updateDimensions = () => {
        window.requestAnimationFrame(() => {
            const parentWidth = parentDiv.clientWidth;
            const parentHeight = parentDiv.clientHeight - 15;

            if (parentDiv.querySelector("svg")) parentDiv.querySelector("svg").remove();

            const svg = d3.select(divId)
                .append('svg')
                .attr('width', parentWidth)
                .attr('height', parentHeight)
                .append('g');

            const xScale = d3.scaleTime()
                .domain(d3.extent(data, d => new Date(d.time)))
                .range([0, parentWidth]);

            const yScale = d3.scaleLinear()
                .domain([minYValue, d3.max(data, d => d.priceUsd)])
                .range([parentHeight, 0]);

            const line = d3.line()
                .x(d => xScale(new Date(d.time)))
                .y(d => yScale(d.priceUsd));

            svg.append('path')
                .datum(data)
                .attr('class', 'line')
                .attr('d', line)
                .attr('fill', 'none')
                .attr('stroke', (lastPoint > firstPoint ? "green" : "red"))
                .attr('stroke-width', 2);

            const tooltip = svg.append('g')
                .attr('class', 'tooltip')
                .style('display', 'none');

            tooltip.append('rect')
                .attr('width', 100)
                .attr('height', 30)
                .attr('fill', 'none')
                .attr('color', '#ffffff')
                .style('opacity', 0.7);

            tooltip.append('text')
                .attr('x', 60)
                .attr('y', 15)
                .style('text-anchor', 'middle')
                .attr('font-size', '12px');

                svg.selectAll('.dot')
                .data(data)
                .enter().append('circle')
                .attr('class', 'dot')
                .attr('cx', d => xScale(new Date(d.time)))
                .attr('cy', d => yScale(d.priceUsd))
                .attr('r', 7.5) // Increase the radius (size) of the dots to 8
                .on('mousemove', (event, d) => {
                    const [mouseX, mouseY] = d3.pointer(event);
            
                    tooltip.style('display', 'block');
                    tooltip.select('text').text(`Price: ${formatPrice(d.priceUsd)}`);
                })
                .on('mouseout',() => {
                    tooltip.style('display', 'none');
                });
        });
    }

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
}

//<Function to display graph onto main graph div with varying interval>//
const displayCoinGraph = (coin,interval="m1") => {
    //Get coin history and append graph to div
    fetchCoinHistory(coin.id.toLowerCase(),interval).then(data => {
        createLineGraph(data, "#displayCoinGraphDiv")
    })
}

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

// ! ---- Filter Dropdown Functions ----

//<Event listener for filter options to switch between filters>//
document.querySelector("#filter").addEventListener("change", (e) => {
    coinList.innerHTML = "";
    //Case for every value of filter dropdown, and respected filter function to filter efficiently
    switch (e.target.value) {
        case "default":
            fetchAllCoins().then(populateCoinList).then(populateFilterList);
            break;

        case "alphabeticalByName":
            fetchAllCoins()
            .then((coinsObj) => {
                return filterByAZ(coinsObj, 0);
            })
            .then(populateCoinList).then(populateFilterList)
            break;

        case "alphabeticalBySymbol":
            fetchAllCoins()
                .then((coinsObj) => {
                    return filterByAZ(coinsObj, 1);
                })
                .then(populateCoinList).then(populateFilterList)
                break;

        case "biggestDailyGains":
            fetchAllCoins()
                .then((coinsObj) => {
                    return filterByGains(coinsObj, 0);
                })
                .then(populateCoinList).then(populateFilterList);
            break;

        case "biggestDailyLosses":
            fetchAllCoins()
                .then((coinsObj) => {
                    return filterByGains(coinsObj, 1);
                })
                .then(populateCoinList).then(populateFilterList);
            break;

        case "priceHighest":
            fetchAllCoins()
                .then((coinsObj) => {
                    return filterByPrice(coinsObj, 0);
                })
                .then(populateCoinList).then(populateFilterList);
            break;

        case "priceLowest":
            fetchAllCoins()
                .then((coinsObj) => {
                    return filterByPrice(coinsObj, 1);
                })
                .then(populateCoinList).then(populateFilterList);
            break;
    }
});

// ! ---- Search Functions ----

//<Search event listener for submission so results can be filtered>//
document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault()
    //Run submission text through search func
    filterByName(e.target.Name.value)
})

// ! ---- Cookie Functions ----

//<Given cookie, parse coin names, find their object using fetchCoin, and append them to mycoins>//
const getCoinsFromCookie = (cook) =>{
    if(!document.cookie){
        document.cookie = "cookie="
    }
    const beforeArray = cook.split("=")
    if(beforeArray.length > 1){
        const coinsArray = beforeArray[1].split(",");
        const fetchPromises = []; // Store promises for fetching coins
        coinsArray.forEach(coin => {
            if (coin) {
                // Fetch and store the coin data
                const fetchPromise = fetchCoin(coin).then(data => {
                    if(data){
                        myCoins.push(data);
                    }
                });
                fetchPromises.push(fetchPromise);
            }
        });

        // Wait for all coin fetches to complete
        Promise.all(fetchPromises).then(() => {
            // Set isDoneLoading to true so it activates the my coins tab
            //there was a glitch where if you clicked on the my coins tab beforea ll promises loaded
            //then it would cut off the bottom of my coins and overwrite the cookie
            isDoneLoading = true;

        });
    }
}

getCoinsFromCookie(document.cookie)

// ! ---- Notify Functions ----

//<Event listener for add coin button that adds coin to cookie, and appends to my coins>//
addCoinButton.addEventListener("click",()=>{
    const coinExists = myCoins.some((coin) =>
    // Compare coins by their properties
    JSON.stringify(coin) === JSON.stringify(currentCoin)
);

if (!coinExists) {
    if (myCoins.length < 5) {
        fiveCoins.innerHTML = "";
        myCoins.push(currentCoin);
        populateMyCoins(myCoins, 1);
    } else {
    notify("You already have 5 personal coins", "error");
    }
} else {
notify("You have already chosen this coin", "warn");
}
})

// ! ---- Button Functions ----

//<Event listener for top coins button that switches to display top 5 coins>//
topCoinsBtn.addEventListener('click', () => {
    fetchAllCoins()
    .then(populateFilterList)
})
myCoinsBtn.addEventListener('click', () => {
    if(isDoneLoading){
    populateMyCoins(myCoins)
    }
})

//<Event listener for reset button that resets coins from myCoins, resets cookie, and resets fiveCoins div>//
resetCoins.addEventListener('click',()=>{document.cookie="cookie=";myCoins = [];populateCoinList(myCoins);fiveCoins.innerHTML=""})

// ! ---- Page Load functions ----

//<Fetch all coins and append them on page load>//
fetchAllCoins()
    .then((coinsObj) => {
        //Display all coin info given coins array
        populateCoinList(coinsObj)
        displayCoin(coinsObj[0])
        populateFilterList(coinsObj, 0)
    })