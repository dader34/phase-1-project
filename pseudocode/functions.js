// ! ----- CONNOR'S CODE -----
// ! ______________________________________________________________________________________

// ! --- BODY FUNCTIONS ---
setHeaderAndFooter()
    //sets content of header slogan and footer details on page load.

setTitle()
    //sets content of title bar on page load.


// ! --- SIDEBAR FUNCTIONS ---
setSidebar()
    //populates the sidebar with logo, filter button, preset filters, search bar, coin-list, and disabled add coin and reset coin buttons.

    // ! -- logo functions --
    setLogo()
        //sets content of logo element on page load.
    
    // ! -- filter button functions --
    filterOptions()
        //either exposes a dropout element or modal to allow user to display coins in coin-list through certain filters.

        filterEnabledToggle()
            //toggled 'selected' state of filterOptionsBtn.

        filterOptionOne()
            //TODO Decide filters to offer user.

        filterOptionTwo()
            //TODO Decide filters to offer user.

        filterOptionThree()
            //TODO Decide filters to offer user.

        filterOptionFour()
            //TODO Decide filters to offer user.
    
    // ! -- presort filter functions --
    loadPresortFilters()
        //populates dropdown menu with a few presorted filtered lists to suggest to user.

        topPerformersList()
            //displays top 10(?) performing coins of the day in coin-list.
        
        biggestMoversList()
            //displays top 10(?) coins with biggest % price jumps on the day.
        
        thirdPresortList()
            //TODO Decide another suggested filtered list for user on page load.
    
    // ! -- coin search functions --
    searchCoins()
        //search API for coin by name or ticker symbol and populate coin-list with references to coin objects matching search.
    
    // ! -- coin list functions --
    renderListItem(foundCoins.forEach())
        //populate coin list with clickable <li>s with references to coin objects retrieved with searchCoins().
    
    displayCoinFromList(selectedCoin)
        //click on coin from coin list to populate featured coin element with details of selected coin.
    
    // ! -- add coin functions --
    addCoinToMyCoins(selectedCoinId)
        //store a clickable coin badge -- with a reference to the coin object selected in coin list -- in #my-coins nav.
        
        //if successful
        toggleResetCoinBtn()
            //enable resetCoinBtn when the first coin is added to myCoinsNav.
        
        //call displayCoinNav(myCoinsNav).
    
    toggleAddCoinBtn()
        //attach as event listener to <li>s in coin list to enable addCoinBtn when clicked.
    
    // ! -- reset coins functions --
    resetMyCoins(myCoins.forEach())
        //pass callback function to remove element from five coin nav
            //remove all coin badge elements from the #my-coins nav (whether stored globally or on database).

        //if successful
        toggleResetCoinBtn()
            //disable resetCoinBtn when the all coins are removed from myCoinsNav.


// ! --- NAV BAR FUNCTIONS ---
storeCoins()
    //open global arrays on page load to store references for #top-coins and #new-coins and an empty array to store references for #my-coins

displayFiveCoinNav(navBarDisplay)
    //render five coin badges into the #my-coins nav based on the toggle button user chooses. Default to #top-coins display on page load.
    //pass five coinObjs from global array or database -- based on nav-bar argument provided -- to renderCoinBadge().
    //attached as event listener to #top-coins-btn, #new-coins-btn, and #my-coins-btn
    //attach graphDisplayBtn to #five-coin-nav

    renderCoinBadge(e)
        //capture data-ids of five coins from e.target (the .nav-toggle-button #id)
        //populates one of five .coin-badge into #five-coin-nav.
        //if clicked button is myCoinsBtn
            //render a .coin-badge with deleteBtn
            //populate coin badge with name, icon, icon alt, priceIncrease, and price fetched from database (or from global array filled on addCoinToMyCoins() executing).
            //give coin the correct class (to display in red or green, and with up or down arrow)
            //attach displayCoinToWindow() to icon as event listener.
            //attach deleteMyCoin() to deleteBtn as a 'click' event listener.
        //else evaluate e.target's id
            //render a .coin-badge W/O deleteBtn.
            //populate coin badge with name, icon, icon alt, priceIncrease, and price fetched from database (or from global array provided by database on page load) using passed in id.
            //give coin the correct class (to display in red or green, and with up or down arrow)
            //attach displayCoinToWindow() to icon as event listener.

        deleteMyCoin(clickedCoin)
            //remove a .my-coin badge element from #five-coin-nav container -- and any associated reference to that coin if we're storing it in a global array.
    
    renderNavGraphBtn()
        //build and append graph button to fiveCoinNav.
        //attach displayGraphFromNav as an event listener for 'click' event.

        [STRETCH] displayGraphFromNav(navBarDisplay)
            //takes the coins currently displayed in the fiveCoinNav as arguments, and opens the graph modal and displays graph/graphs with their data.

// ! --- FEATURED COIN WINDOW FUNCTIONS ---
displayCoinToWindow(clickedCoin, chronoUnit='day')
    //call fetchOneCoin()
    //on success

    //assign .up or .down class to #featuredCoinWindow.
    toggleFeaturedCoinClass()
        //set colors and thumb of featured coin accordingly.

    renderCoinBadge()
        //capture data-id of selected or clicked coins from e.target (selectedCoin or clickedCoin)
            //populates one .featured-coin-badge into #featured-coin-window.
            //if clicked/selected coin id !== in myCoinsNav
                //render a .coin-badge with addFeaturedCoinBtn
                //populate coin badge with name, icon, icon alt, priceIncrease, and price fetched from database (or from global array filled on addCoinToMyCoins() executing).
                //give coin the correct class (to display in red or green, and with up or down arrow)
                //attach addCoinToMyCoins(clickedCoinBadgeId) as a 'click' event listener (defined on line 61).
            //else 
                //render a .coin-badge W/O addFeaturedCoinBtn.
                //populate coin badge with name, icon, icon alt, priceIncrease, and price fetched from database (or from global array provided by database on page load) using passed in id.
                //give coin the correct class (to display in red or green, and with up or down arrow)
                //give coin .owned class to display an OWNED stamp on the icon.

    renderCoinGraph(chronoUnit)
        //supplies featured coin's price movement in line graph form 
        //defaults to day, but this function is attached as a callback to the #chrono-toggle dropdown so it fires with the appropriate day/week/month/year on 'select'.

    buildChronoToggle()
        //define and render the dropdown element on the #featured-coin-window.
        //attach displayToFeaturedCoinWindow() as event listener on 'select' event, passes the argument 'day', 'week', 'month', or 'year' when event fires.

    buildStatBlock()
        //builds a <span> for bottom of featuredCoinWindow, where coin stats are displayed
        //account for different structure of DOM element for advisor block (img instead of <p>arrow</p> and <p>number</p>)

    renderStatBlocks(coinId)
        //render currentPrice()
            //call buildStatBlock()
            //populate content accordingly from fetched coinObj.
        //render averagePrice()
            //call buildStatBlock()
            //populate content accordingly from fetched coinObj.
        //render rank()
            //call buildStatBlock()
            //populate content accordingly from fetched coinObj.
        //render advisor()
            //call buildStatBlock()
            //populate content accordingly from fetched coinObj.
    renderGraphZoomer()
        //build and append magnifying glass button to #featured-coin-div.
        //attach to magnifying glass:
            //'mouseover' event listener to display graph modal (but only as long as pointer is on the element)
            //'click' event listener to fully pop out the graph modal.


    
// ! ---- CRUD FUNCTIONS ----

fetchAllCoins()

fetchTopFiveCoins()

fetchNewFiveCoins()

fetchOneCoin()

// ! ----- DANNER'S CODE -----
// ! ______________________________________________________________________________________


// ! ----- DOM'S CODE -----
// ! ______________________________________________________________________________________