// ! ----- CONNOR'S CODE -----
// ! ______________________________________________________________________________________

let currentlyReferencedCoin = coinDataId;
    //the coin being displayed in the featured-coin window.

let selectedCoin = coinDataId;
    //the coin selected in the #coin-list.
    //passed to currentlyReferencedCoin?

let clickedCoin = coinDataId;
    //the coin clicked in the #five-coin-nav.
    //passed to currentlyReferencedCoin?

let currentlyDisplayedNav;
    //one of the three nav display options in the #five-coin-nav (topCoins, newCoins, myCoins).

let currentlyDisplayedNavCoins;
    //references to the five coins currently on display in the nav

let currentlyFeaturedCoin;
    //a reference for the element consisting of the #featured-coin-badge, #featured-coin-graph, #featured-coin-current-price, #featured-coin-average-price, #featured-coin-rank, and #featured-coin-advisor.

let modalSwitch = false;
    //toggles hidden class of graph modal.

let currentPrice;

let averagePrice;

let topPrice;

// ! ----- DANNER'S CODE -----
// ! ______________________________________________________________________________________

// ! ----- DOM'S CODE -----
// ! ______________________________________________________________________________________