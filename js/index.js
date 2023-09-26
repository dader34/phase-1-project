"use strict"
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

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
    listedCoin.addEventListener('click', () => {displayCoin(coin)});
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
    document.querySelector("#featuredCoinSpan > h2").textContent = coin.symbol
    document.querySelector("#featuredCoinSpan > h4").textContent = coin.name;
    
    // const title = document.querySelector("#coinName")
    // const price = document.querySelector("#coinPrice")
    const image = document.querySelector("#coinImg")
    const priceChange = document.querySelector("#featuredChange")
    // title.textContent = coin.symbol
    document.querySelector('#featuredPrice').textContent = formatPrice(coin.priceUsd)
    fetchDailyChange(coin.name).then(data => priceChange.textContent = formatDailyChange(data))
    if (priceChange.textContent.includes('↑')) {
        priceChange.style.color = 'green'
      } else {
        priceChange.style.color = 'red'
        console.log('red')
      }
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

const displayCoinGraph = (coin) =>{
    fetchCoinHistory(coin.id.toLowerCase()).then(data => {
        createLineGraph(data, "#displayCoinGraphDiv")
        console.log(data)
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

// ! Page Load functions --

// fetchAllCoins().then(populateCoinList)

// // fetchCoin("BTC").then(console.log)

// // getCoinHistory("bitcoin").then(console.log)

// fetchAllCoins().then(coins => displayCoin(coins[0]))

// fetchAllCoins().then(coinsObj => populateTopCoins(coinsObj))

fetchAllCoins()
.then((coinsObj) => {
  populateCoinList(coinsObj)
  displayCoin(coinsObj[0])
  populateTopCoins(coinsObj)
})

// ! -- Connor's Code --

const renderCoinBadge = () => {
  document.createElement('span');
  const coinBadge = document.createElement('span')
  coinBadge.classList.add('coinSpan')
  const leftBadge = document.createElement('div')
  leftBadge.classList.add('leftCoinBadge')
  const rightBadge = document.createElement('div')
  rightBadge.classList.add('rightCoinBadge')
  const badgeSymbol = document.createElement('h3')
  // const badgeDelete = document.createElement('span')
  // badgeDelete.classList.add('delete')
  // // badgeDelete.addEventListener('click', deleteCoin)
  const badgeImg = document.createElement('img')
  const badgePrice = document.createElement('p')
  const badgeChange = document.createElement('p')

  leftBadge.append(badgeImg, badgeSymbol)
  rightBadge.append(badgePrice, badgeChange)

  coinBadge.append(leftBadge, rightBadge)
  document.querySelector("#fiveCoins").appendChild(coinBadge)
  return coinBadge;
}

const populateTopCoins = (coinsObj) => {
    const topFive = filterByPrice(coinsObj, 0).slice(0, 5)
    topFive.forEach((topCoin) => {
      const newBadge = renderCoinBadge()
      newBadge.querySelector('h3').textContent = topCoin.symbol
      newBadge.querySelector('p:nth-child(1)').textContent = formatPrice(topCoin.priceUsd)
      const newBadgeChange = newBadge.querySelector('p:nth-child(2)')
      newBadgeChange.textContent = formatDailyChange(topCoin.changePercent24Hr)
      if (newBadgeChange.textContent.startsWith('↑')) {
        newBadgeChange.style.color = 'green'
      } else {
        newBadgeChange.style.color = 'red'
      }
      
      newBadge.querySelector('img')
      document.querySelector('#fiveCoins').appendChild(newBadge)

      fetchCoinImages(topCoin)
        .then(coinObj => {
            if (coinObj) {
              newBadge.querySelector('img').src = coinObj.url
            } else {
                newBadge.querySelector('img').src = 'src/download.jpeg'
            }
            newBadge.querySelector('img').alt = coinObj.symbol
        })
      })
  }


// const addCoinToNav = () => {
//         return fetchCoin(document.querySelector('#featuredCoinName').textContent.toLowerCase())
//         .then((coin) => {
//           const coinBadge = document.createElement('span')
//           coinBadge.classList.add('coinSpan')
//           const leftBadge = document.createElement('div')
//           leftBadge.classList.add('leftCoinBadge')
//           const rightBadge = document.createElement('div')
//           rightBadge.classList.add('rightCoinBadge')
//           const badgeSymbol = document.createElement('h3')
//           const badgeDelete = document.createElement('span')
//           badgeDelete.classList.add('delete')
//           // badgeDelete.addEventListener('click', deleteCoin)
//           const badgeImg = document.createElement('img')
//           const badgePrice = document.createElement('p')
//           const badgeChange = document.createElement('p')

//           badgePrice.textContent = formatPrice(coin.priceUsd)
          

//           leftBadge.append(badgeSymbol, badgeDelete, badgeImg)
//           rightBadge.append(badgePrice, badgeChange)
//           coinBadge.append(leftBadge, rightBadge)

//           fetchCoinImages(coin)
//           .then(coinObj => {
//               if (coinObj) {
//                   badgeImg.src = coinObj.url
//               } else {
//                   badgeImg.src = 'src/download.jpeg'
//               }
//               badgeImg.alt = coin.symbol
//           })



//           document.querySelector('#fiveCoins').appendChild(coinBadge)
//           })
//         }
// const watchedCoins = addCoinToNav()

const addCoinButton = document.querySelector('#addCoinButton')
// addCoinButton.addEventListener('click', addCoinToNav)
