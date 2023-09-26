"use strict"
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const coinList = document.querySelector("#results");
const fiveCoins = document.querySelector('#fiveCoins')
const dropDownSelect = document.querySelector("#chrono")
const topCoinsBtn = document.querySelector('#topCoinsButton')
const myCoinsBtn = document.querySelector('#myCoinsButton')
const addCoinButton = document.querySelector('#addCoinButton')
const resetCoins = document.querySelector("#reset")
const cookie = document.cookie
let currentCoin;
console.log(document.cookie)
//
let topFiveCoins = []
let myCoins = []
//


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

const fetchCoinHistory = (coin, interval = "m1") => {
    const url = `https://api.coincap.io/v2/assets/${coin}/history?interval=${interval}`;
    return fetch(url)
        .then((resp) => resp.json())
        .then((body) => body.data);
};

const fetchCoinImages = (coin) => {
    return fetch('src/CoinAssets.json')
        .then(resp => resp.json())
        .then(data => {
            return data.find(element => element['asset_id'] === coin.symbol)
        })
}

const renderLi = (coin) => {
    const listedCoin = document.createElement("li");
    listedCoin.classList.add("listedCoin");
    listedCoin.dataset.id = coin.id;
    listedCoin.textContent = `${coin.name} -- ${coin.symbol}`;
    listedCoin.addEventListener('click', () => {
        dropDownSelect.selectedIndex = 0 
        displayCoin(coin) 
    });
    coinList.appendChild(listedCoin);
};

const populateCoinList = (coinsObj) => {
    for (let coin of coinsObj) {
        renderLi(coin);
    }
    return coinsObj
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

const formatPrice = (price) => {
    return parseFloat(price).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: (price > 1) ? 2 : 8,
    });
}

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


const displayCoin = (coin) => {
    const coinSymbol = document.querySelector("#featuredCoinSpan > h2")
    const coinName = document.querySelector("#featuredCoinSpan > h4")
    const image = document.querySelector("#coinImg")
    const priceChange = document.querySelector("#featuredChange")
    const coinPrice = document.querySelector('#featuredPrice')
    const coinCap = document.querySelector("#stats > span:nth-child(1) > p")
    const coinVolume = document.querySelector("#stats > span:nth-child(2) > p")
    const coinRank = document.querySelector("#stats > span:nth-child(3) > p")
    coinCap.textContent = formatLargeNum(coin.marketCapUsd)
    coinVolume.textContent = formatLargeNum(coin.volumeUsd24Hr)
    coinRank.textContent = coin.rank
    coinSymbol.textContent = coin.symbol
    coinName.textContent = coin.name;
    coinPrice.textContent = formatPrice(coin.priceUsd)
    fetchDailyChange(coin.name).then(data => {
        priceChange.textContent = formatDailyChange(data)
        if (priceChange.textContent.includes('↑')) {
            priceChange.style.color = 'green'
        } else {
            priceChange.style.color = 'red'
        }
    })
    currentCoin = coin

    fetchCoinImages(coin)
        .then(coinObj => {
            if (coinObj) {
                image.src = coinObj.url
            } else {
                image.src = 'src/download.jpeg'
            }
            image.alt = coin.symbol
        })

        .then(displayCoinGraph(coin))
}

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
            // const svgWidth = parentWidth; 
            // const svgHeight = parentHeight;

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

const displayCoinGraph = (coin,interval="m1") => {
    fetchCoinHistory(coin.id.toLowerCase(),interval).then(data => {
        createLineGraph(data, "#displayCoinGraphDiv")
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
    filterByName(e.target.Name.value)
})

dropDownSelect.addEventListener("change",(e)=>{
    const selection = e.target.value
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
        populateCoinList(coinsObj)
        displayCoin(coinsObj[0])
        populateTopCoins(coinsObj)
        filterByPrice(coinsObj, 0).slice(0, 5).forEach(topCoin => {
            topFiveCoins.push(topCoin)
        })
    })

const renderCoinBadge = () => {
    const coinBadge = document.createElement('span')
    const leftBadge = document.createElement('div')
    const rightBadge = document.createElement('div')
    const badgeSymbol = document.createElement('h3')
    const badgeImg = document.createElement('img')
    const badgePrice = document.createElement('p')
    const badgeChange = document.createElement('p')
    coinBadge.classList.add('coinSpan')
    rightBadge.classList.add('rightCoinBadge')
    leftBadge.classList.add('leftCoinBadge')
    leftBadge.append(badgeImg, badgeSymbol)
    rightBadge.append(badgePrice, badgeChange)
    coinBadge.append(leftBadge, rightBadge)
    fiveCoins.appendChild(coinBadge)
    return coinBadge;
}

const createTopCoin = (topCoin, loadingMyCoins = 0) => {
    const newBadge = renderCoinBadge()
    const coinSymbol = newBadge.querySelector('h3')
    const coinPrice = newBadge.querySelector('p:nth-child(1)')
    const newBadgeChange = newBadge.querySelector('p:nth-child(2)')
    coinSymbol.textContent = topCoin.symbol
    coinPrice.textContent = formatPrice(topCoin.priceUsd)
    newBadgeChange.textContent = formatDailyChange(topCoin.changePercent24Hr)
    if (newBadgeChange.textContent.startsWith('↑')) {
        newBadgeChange.style.color = 'green'
    } else {
        newBadgeChange.style.color = 'red'
    }
    if (loadingMyCoins === 1) {
        const deleteButton = document.createElement('button')
        deleteButton.addEventListener('click', e => {
            myCoins.forEach(coin => {
                if (coin.symbol === coinSymbol.textContent) {
                    myCoins.splice(myCoins.indexOf(coin), 1)
                }
            })
            e.target.parentNode.remove()
        })
        newBadge.appendChild(deleteButton)
    }
    fiveCoins.appendChild(newBadge)

    fetchCoinImages(topCoin)
    .then(coinObj => {
        if (coinObj) {
            newBadge.querySelector('img').src = coinObj.url
        } else {
            newBadge.querySelector('img').src = 'src/download.jpeg'
        }
        // newBadge.querySelector('img').alt = coinObj.symbol
    })
}

const removeMyCoin = (e) => {
    e.target.parentNode.remove()
    myCoins.forEach(element => {
        if (element.symbol === coinSymbol.textContent) {
        }
    })
}

const populateTopCoins = (coinsObj) => {
    fiveCoins.innerHTML=""
    const topFive = filterByPrice(coinsObj, 0).slice(0, 20)
    topFive.forEach((topCoin) => {
        createTopCoin(topCoin)
    })
}

const populateMyCoins = async (coinsObj) => {
    // Clear the existing content in the 'fiveCoins' container.
    fiveCoins.innerHTML = "";

    // Retrieve coin names from the 'myCoins' array and join them into a comma-separated string.
    const coinNames = myCoins.filter(coin => coin).map(coin => coin.name).join(",");

    // Update the 'cookie' with the updated list of coin names.
    updateCookie(coinNames);

    // Create coin badges for each coin in 'coinsObj'.
    coinsObj.forEach((myCoin) => {
        createTopCoin(myCoin, 1);
    });
};

const updateCookie = (coinNames) => {
    // Create a new cookie string with the updated list of coin names.
    const newCookie = "cookie=" + coinNames;

    // Update the 'cookie' in the document.
    document.cookie = newCookie;
};

const getCoinsFromCookie = (cook) => {
    // If the 'cookie' is not present, set an empty 'cookie'.
    if (!document.cookie) {
        document.cookie = "cookie=";
    }

    // Split the 'cookie' to retrieve the list of coin names.
    const beforeArray = cook.split("=");

    // If there are coin names in the 'cookie', fetch and add them to the 'myCoins' array.
    if (beforeArray.length > 1) {
        const coinsArray = beforeArray[1].split(",");
        coinsArray.forEach((coin) => {
            if (coin) {
                // Fetch coins using the parsed names from the cookie and add them to 'myCoins'.
                fetchCoin(coin).then((data) => {
                    console.log(data);
                    myCoins.push(data);
                });
            }
        });
    }
};

// Call 'getCoinsFromCookie' to retrieve coins from the cookie when the page loads.
getCoinsFromCookie(cookie);



addCoinButton.addEventListener("click", () => {
    if (!myCoins.includes(currentCoin)) {
        if( myCoins.length < 5){
            const existingCookie = document.cookie.split("cookie=")[1] || ""; // Parse the existing cookie or use an empty string.
            const existingCoins = existingCookie ? existingCookie.split(",") : [];
    
            // Add the new coin name to the array if it doesn't already exist.
            if (!existingCoins.includes(currentCoin.name)) {
                existingCoins.push(currentCoin.name);
    
                // only do if coins length less than 5
                if (existingCoins.length <= 5) {
                    // update the changed array back to a string and update the cookie.
                    const updatedCookie = "cookie=" + existingCoins.join(",");
                    document.cookie = updatedCookie;
    
                    // Update the myCoins array and UI.
                    myCoins.push(currentCoin);
                    populateMyCoins(myCoins);
                } 
            }
        }else {
            notify("You already have 5 coins chosen", "error");
            
        }
    } else {
        console.log("test");
        notify("You have already chose this coin", "warn");
    }
});

topCoinsBtn.addEventListener('click', () => populateTopCoins(topFiveCoins))
myCoinsBtn.addEventListener('click', () => populateMyCoins(myCoins))
resetCoins.addEventListener('click',()=>{document.cookie="cookie=";myCoins = [];populateCoinList(myCoins);fiveCoins.innerHTML=""})
// addCoinButton.addEventListener('click', addCoinToNav)
// getCoinsFromCookie(cookie)
// populateMyCoins(myCoins)
