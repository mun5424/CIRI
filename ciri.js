require("dotenv").config();
var keys = require('./keys.js');
var request = require("request");
var fs = require("fs");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');

var parameter1 = process.argv[2];
var parameter2 = process.argv[3];

executeCommand(parameter1, parameter2);

function executeCommand(command, argument) {
    switch (command) {
        case "my-tweets":
            display20tweets();
            break;
        case "spotify-this-song":
            var song = argument;
            spotifySong(song);
            break;
        case "movie-this":
            var movie = argument;
            movieInfo(movie);
            break;
        case "do-what-it-says":
            executeFile();
            break;
        default:
            console.log("That is not a valid command.");
    }
}


function display20tweets() {
    fs.appendFile('./log.txt', 'Command my-tweets\n', (err) => {
        if (err)
            throw err;
    });

    var client = new Twitter(keys.twitter);
    var params = { screen_name: "charlesoh9", count: 20 };
    client.get("statuses/user_timeline", params, function (error, tweets, response) {
        if (error)
            return;
        else {
            var output = "";
            for (var i = 0; i < tweets.length; i++) {
                output += "\n" + tweets[i].text + "\n" + "Created On: " + tweets[i].created_at + "\n";
            }
            fs.appendFile(".log.txt", "Twitter API Response: \n" + output + "\n", (error) => {
                if (error)
                    throw error;
            });
            console.log(output);
        }
    });
}

function spotifySong(song) {
    fs.appendFile('./log.txt', 'Command spotify-this-song\n', (error) => {
        if (error)
            throw error;
    });

    if (song == "")
        song = "The Sign Ace of Base";

    var spotify = new Spotify({
        id: keys.spotify.id,
        secret: keys.spotify.secret
    });

    spotify.search({ type: "track", query: song }, function (error, response) {
        if (error)
            return;
        else {
            var output = "";
            var songInfo = response.tracks.items[0];
            if (songInfo == undefined) {
                console.log("No song information for this track! Try something different. ");
            }
            else {
                output += "Song Information: \nSong Name: " + songInfo.name + "\nArtist(s): ";
                for (var i = 0; i < songInfo.artists.length; i++)
                    output += songInfo.artists[i].name + ", ";
                output += "\nAlbum: " + songInfo.album.name + "\nPreview Link: " + songInfo.preview_url + "\n";
            }

            fs.appendFile(".log.txt", "Spotify Response: \n" + output + "\n", (error) => {
                if (error)
                    throw error;
            });
            console.log(output);
        }
    });
}

function movieInfo(movie) {
    fs.appendFile('./log.txt', 'Command movie-this\n', (error) => {
        if (error)
            throw error;
    });


    if (movie == "") {
        movie = "Mr.Nobody";
    }

    request("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
        if (!error && response.statusCode === 200) {
            movieInfo = JSON.parse(body);

            if (movieInfo == undefined) {
                console.log("No movie information for this movie! Try something different. ");
            }
            else {
                var output = ""; 
                output += "Movie Information: \nTitle: " + movieInfo.Title +
                    "\nRated: " + movieInfo.Rated +
                    "\nIMDB Rating:" + movieInfo.imdbRating +
                    "\nRotten Tomatoes Rating : " + movieInfo.Ratings[1].Value +
                    "\nCountry of Origin: " + movieInfo.Country +
                    "\nLanguage: " + movieInfo.Language +
                    "\nPlot: " + movieInfo.Plot +
                    "\nActors: " + movieInfo.Actors;
                output += "\n";

                fs.appendFile(".log.txt", "OMDB Response: \n" + output + "\n", (error) => {
                    if (error)
                        throw error;
                });
                console.log(output);
            }
        }
    });

}

function executeFile(file) {

    fs.appendFile('./log.txt', 'do-what-it-says\n', (error) => {
        if (error)
            throw error;
    });

    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }

        var data = data.split(",");
        //could potentially turn it to something where it can do any command, not just spotify
        spotifySong(data[1]);

    });


}
