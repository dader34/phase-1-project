# **Get Your Day Started Right — Don't Wake Up Virtually Broke!**

## Welcome to Cha-Ching Dannor Dom, your go-to cryptocurrency exchange platform designed to ensure you're financially prepared for the day ahead.

> **What Can You Do with Cha-Ching Dannor Dom?**

* *Buy Crypto with Ease*: Purchase cryptocurrency in quantities that suit your needs.
* *Effortless Tracking*: Keep an eye on your investments without lifting a finger.
* *Real-Time Market Insights*: Display an extensive range of cryptocurrencies, complete with real-time market prices.
* *Social Media Pulse*: Get actionable insights by pulling data from major social media platforms to inform your next purchase.

All this is possible through our dynamic website, powered by cutting-edge API's.

# Installation Instructions

> **Ready to dodge financial pitfalls? Here's how to get started.**


* Fork and Clone: Fork this repository and copy the SSH key from your forked repo.> 

* Navigate: Open the directory where you wish to clone the repo.
To create a new directory, type mkdir "your-new-directory-name".

* Clone: Inside your directory, type git clone followed by pasting the SSH key you copied.

* Launch: Navigate into the git folder with cd, then type Code . to launch the editor.

* Mac Users:
Launch the HTML file using your preferred method.

* WSL or Windows Users
Open Ubuntu or the platform you used to create the directory.
Type explorer.exe index.html to open Cha-Ching Dannor Dom.



## Visual Operations

1.
2.
3.
4.
5.
etc if more.



## Authors

1. [Dominic DeCelle](https://www.linkedin.com/in/dominic-decelle-376b02292/)
2. Connor Adams <hyperlink for LinkedIn
<small photo image of you Connor>
3. Danner Baumgartner <hyperlink for LinkedIn
<Small photo of you Danner>


## Outstanding API's
* **API 1.**
* **API 2.** 





## **Licenses**




<>

<!-- Crypto tracker as name?
A crypto currency display and search website with filtering options, and graphs.

<!-- Returned collection from JSON server or API -->
Coin tracker w/ separate Objects for each coin (BTC, ETH, etc.)
Attributes to fetch for each Object:
currentPrice <!-- Simply retrieves an integer from database. -->
maxPrice <!-- Write a function that fetches all currentPrice values and returns highest one. -->
minPrice <!-- Same as above but lowest. -->
weeklyAvg <!-- Write a function that takes a set of currentPrice values and returns their avg. -->
monthlyAvg <!-- Same as above but monthly. -->
yearlyAvg <!-- Same as above but yearly. --><!-- We could write a higher order timespanAverager function that takes a different timespan (week, mo, year) and returns the average of currentPrice over that timespan, like the fareMultiplier func in the taxi lab. -->
buyOrSell <!-- Based on minimal variables obtained from above functions, return a buy or sell recommendation to user.>

<!-- Possible Event Listeners -->
Buttons that react to click by fetching currentPrice, avgs, etc.
Buttons that sort/refilter graphs by week, month, year
Input element (search box) that take a str in the form of 'BTC', 'ETH', etc and returns currentPrice (or other attributes)
A server-sent event to update currentPrice every 60 secs?
A form that lets you submit coins and add them to your "bank" (a form element in the style of the TaskLister, w/ .preventDefault()).
Use cookies to persist this data.

<!-- Array Iteration -->
Iterate through array of coins and return one with highest value, biggest price swing, etc.
Iterate through a stored database (Array Object with key=dates and values=avgPrice) of each coin's daily value and return the date with highest or lowest price.

<!-- Other Sexy Ideas -->
Line graphs displaying one coin's price over time
Bar graphs displaying current price of each coin
Add the graphs to the page dynamically as HTML elements when someone clicks BTC Graph button, for instance
Demonstrate use of closures to keep the user's "bank" secure
The user's bank is a hidden modal that pops up on a click event, allows user to buy and sell within the modal's form, and persists the data from buyying and selling to the db.


<!-- DIVISION OF TASKS -->
Styling

<!-- TO DO LIST -->
Find out what kind of data is available on crypto API, what the data structure of it is, and determine which data we want to pull.
Layout HTML/CSS skeleton for page (wireframing)git
Functions
clickCoinForGraph() creates an element in the front z-index which includes info/graphs for that coin
exitX() removes a created element from the index.html when the user presses the X
updatePrice() fires every second?minute? fetches new values from the db and updates data displayed to the user
viewBank() opens the users bank
buyCoin() takes a certain coin as an argument and adds it to the user's "bank"
sellCoin() removes a coin from the user's bank -->
-

-test

<!-- Requirements -->
1. HTML/CSS/JS frontend that accesses an API. check
2. Single page. check
3. 3 Event listeners:
    - 'click': open bank
    - 'change': dropdown selector on graphs
    - ''

<!-- Credits -->
**Credit to giphy.com for our embed GIF! 
If you would like to add GIF to your README or blog, website, you can check them out!