"use strict";

const placeholder = "../img/cocktail.png";
const searchUrl = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=";

const gNewsApiKey = "bc028917a1a4fb538af6454f0a64dd75";
const gNewsEndPoint = "https://gnews.io/api/v3/search";

const videosUrl = "https://www.googleapis.com/youtube/v3/search";
const videoApiKey = "AIzaSyBba0KfGoyDax9w-rzGM8KEmFSNQqSM4rk";

//function to get news related to cocktails
function getNews(searchTerm) {
  const url = `${gNewsEndPoint}?q=${searchTerm}&token=${gNewsApiKey}`;
//  displayNews(responseJson)
  fetch(url)
    .then((response) => {
      if (response.ok) {
        console.log(response);
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((responseJson) => {
      console.log({ responseJson });
      displayNews(responseJson);
    })
    .catch((err) => {
      $("#js-error-message").text(
        `Something went wrong news, Please try again: ${err.message}`
      );
    });
}

//function to display news
function displayNews(responseJson) {
  console.log(responseJson);
  $("#results3").empty();
  for (let i = 0; i < responseJson.articles.length; i++) {
    $("#results3").append(
      `<div class="newsBox">
         <ul class="nResults">
             <li><h4><a href="${responseJson.articles[i].url}"target="_blank">${
        responseJson.articles[i].title
      }</a></h4>
                <p class = "lineh">${responseJson.articles[i].source.name}</p>
                
                <img src='${
                  responseJson.articles[i].image || placeholder
                }' id="imgart" alt="${responseJson.articles[i].title}" />
                <p>${responseJson.articles[i].description}</p>
           </li>
        </ul>
      </div>`
    );
  }
}

//format the data
function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  return queryItems.join("&");
}

//function display recipe results
function displayResults(responseJson) {
  if (responseJson.drinks === null) {
    return $("#js-error-message").text(
      "No matches found. Please try searching again."
    );
  }

  $("#results").empty();
  //console.log("display results", responseJson.drinks.length);
  const ingredientMeasures = {};
  for (let i = 0; i < responseJson.drinks.length && i < 5; i++) {
    //prepare ingredients
    const ingredients = [];
    //console.log(ingredients.length);
    //preprare measure
    const measureKeys = [];

    //get all the object properties
    const objKeys = Object.keys(responseJson.drinks[i]);

    for (let j = 0; j < objKeys.length; j++) {
      if (
        objKeys[j].includes("strIngredient") &&
        responseJson.drinks[i][objKeys[j]] != null
      ) {
        ingredients.push(responseJson.drinks[i][objKeys[j]]);
      }
    }
    // console.log("ingredient list", ingredients);
    for (let z = 0; z < objKeys.length; z++) {
      if (
        objKeys[z].includes("strMeasure") &&
        responseJson.drinks[i][objKeys[z]] != null
      ) {
        measureKeys.push(responseJson.drinks[i][objKeys[z]]);
      }
      ingredientMeasures[ingredients[i]] = [measureKeys[i]];
    }
    // console.log(ingredients);

    $("#results").append(
      `<div class="recipeBox">
          <ul class="rResults">
            <li><h3>${responseJson.drinks[i].strDrink}</h3>
             <div id="imgingr"><img src="${responseJson.drinks[i].strDrinkThumb}" id="drinkpic" height="100" width="100" alt="${responseJson.drinks[i].strDrink}">
              <div class="ingredientContainer"></div> 
              </div>
              <h4>Instructions: </h4><p>${responseJson.drinks[i].strInstructions}</p></li>
          </ul>
        </div>`
    );

    for (let k = 0; k < ingredients.length; k++) {
      $("#results div:last-child .ingredientContainer").append(
        `<p><span>${ingredients[k]}</span>: <span>${measureKeys[k]}</span></p>`
      );
      //console.log("checking", ingredients[k]);
    }
    //console.log($(".ingredientContainer"));
  }
}

//function to get the recipe
function getRecipe(searchTerm) {
  const recipeSearch = searchUrl + searchTerm;
  // console.log(recipeSearch);
  fetch(recipeSearch)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((responseJson) => displayResults(responseJson))
    .catch((err) => {
      $("#js-error-message").text(
        `No matches found. Please try searching again: ${err.message}`
      );
    });
}

// function to display the videos
function displayVideos(responseJson) {
  $("#results2").empty();
  for (let item in responseJson.items) {
    let videoLink = "";
    let videoTitle = responseJson.items[item].snippet.title;

    //handles videoId returning undefined
    if (responseJson.items[item].id.videoId) {
      videoLink = `https://www.youtube.com/watch?v=${responseJson.items[item].id.videoId}`;
    } else {
      videoLink = `https://www.youtube.com/channel/${responseJson.items[item].snippet.channelId}`;
    }

    $("#results2").append(
      `<div class = "videoBox" id= "gradient1">
         <ul class = "vResults">
           <li class="video-result">
           <figure>
           <a href="${videoLink}" target="_blank"><img src="${
        responseJson.items[item].snippet.thumbnails.high.url
      }" id= "pic" alt="${responseJson.items[item].snippet.title}" /></a>
           <figcaption>${videoTitle.toLowerCase()}</figcaption>
           </figure></li>
        </ul>
      </div>`
    );
  }
}

//function to get youtube videos
function getVideos(searchTerm) {
  const params = {
    part: "snippet",
    maxResults: 5,
    q: `${"How to make a cocktail"}` + searchTerm,
    relevanceLanguage: "en",
    key: videoApiKey,
  };
  const queryString = formatQueryParams(params);
  const urlYoutube = videosUrl + "?" + queryString;

  fetch(urlYoutube)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((responseJson) => displayVideos(responseJson))
    .catch((err) => {
      $("#js-error-message").text(
        `No matches found. Please try searching again: ${err.message}`
      );
    });
}

//Get the button
let mybutton = document.getElementById("myBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
    mybutton.addEventListener('click', topFunction)
  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

//event listener
function watchForm() {
  //  $('#myBtn').topFunction()
  $("form").submit((event) => {
    event.preventDefault();
    $("#js-error-message").text("");
    this.searchTerm = $("#js-search-term").val();
    $("#show-results").show();
    $(".jor").show();
    $(".bich").show();
    $(".med").show();
    getVideos(this.searchTerm);
    getNews(this.searchTerm);
    getRecipe(this.searchTerm);
    $(".text-center").click(function () {
      event.preventDefault();
      $(".welcome").show();
      $("#show-results").hide();
    });
    $("#js-form")[0].reset();
  });
}

function setFooterYear() {
  const year = new Date().getFullYear();
  $(".footer-year").text(year);
}
$(watchForm);
