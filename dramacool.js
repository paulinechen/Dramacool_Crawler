var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var Crawler = require("crawler").Crawler;
var csv = require("fast-csv");
var app = express();

// top layer
var drama_href = Array();
var drama_title = Array();

// middle layer
var urlArray = Array();
var titleArray0 = Array();
var titleArray = Array();


var linkCount=0;


var csvStream = csv.createWriteStream({headers: true}).transform(function(row){
        return {
           number: row.number,
           name: row.name,
           type: row.type,
           linkid: row.linkid
        };
    }),
writableStream = fs.createWriteStream("dramacoolcsv.csv");

writableStream.on("finish",function(){
	console.log("DONE!");
});		
csvStream.pipe(writableStream);	



app.get('/scrape', function(req,res){

var top = new Crawler({
	"maxConnections":1,
})


var middle = new Crawler({
	"maxConnections":100,
	"callback": function(error, result, $){
			var j=0;
			var type = $(".genre-detail-film").text().substring(7);
			if(type){
				type = $(".genre-detail-film").text().substring(7).replace("\n","").replace("\r","");
			}

	
			
			urlArray = new Array();
			titleArray = new Array();

			$(".country_s_az").filter(function(){
			var episode = $(this);
	try{	

			urlArray[j] = episode.next().attr("href").replace("\n","").replace("\r","");
			titleArray0[j] = episode.next().children().text();
			if(titleArray0[j]!=undefined){
			var index  = titleArray0[j].indexOf(" Episode 1");
			titleArray[j] = episode.next().children().text().substring(1,index);
			}			
			j++;
		}catch(err){
			console.log(err);
		}
			})
            // easy use for google doc
    try{	
            console.log(linkCount+".   "+titleArray[titleArray.length-1]+"  :  "+urlArray[urlArray.length-1]+ " : " +type);
            if(urlArray[urlArray.length-1]!=undefined){
            if(urlArray[urlArray.length-1].indexOf("episode-1")!=-1){
            if(titleArray[titleArray.length-1].indexOf("Movie")==-1){	
			csvStream.write({number: linkCount,name: titleArray[titleArray.length-1],type: type,linkid: urlArray[urlArray.length-1]});
			linkCount = linkCount + 1;
			}
			}
			}			
			if(linkCount==550){
			csvStream.write(null);
			}

		}catch(err){
			console.log(err);
		}

		}
})




top.queue([
    
    // Korean Drama
	{"url":"http://www.dramacool.com/category/korean-drama",
	 "callback": function(error, result, $){
	 	var i=0;	
	 	$(".col-md-10 > a").filter(function(){
	 		var koreanDrama = $(this);
	 		drama_href[i] = "http://www.dramacool.com/"+koreanDrama.attr("href");
 			drama_title[i] = koreanDrama.attr("title");
 			i++;
	 	})
	 	for(var a=0; a<drama_href.length;a++){	   	
	 		middle.queue(drama_href[a]);
	 	}     
	}
	},
	
	// Japanese Drama
	{
	 "url":"http://www.dramacool.com/category/japanese-drama",
	 "callback": function(error, result, $){
	 	drama_href = new Array();
	    drama_title = new Array();
	 	var i=0;	
	 	$(".col-md-10 > a").filter(function(){
	 		var japaneseDrama = $(this);
	 		drama_href[i] = "http://www.dramacool.com/"+japaneseDrama.attr("href");
 			drama_title[i] = japaneseDrama.attr("title");
 			i++;
	 	})
	 	for(var a=0; a<drama_href.length;a++){	   	
	 		
	 		middle.queue(drama_href[a]);
	 	}
	     
	}
	},


	// Taiwanese Drama
	{
	 "url":"http://www.dramacool.com/category/taiwanese-drama",
	 "callback": function(error, result, $){
	 	drama_href = new Array();
	    drama_title = new Array();
	 	var i=0;	
	 	$(".col-md-10 > a").filter(function(){
	 		var taiwaneseDrama = $(this);
	 		drama_href[i] = "http://www.dramacool.com/"+taiwaneseDrama.attr("href");
 			drama_title[i] = taiwaneseDrama.attr("title");
 			i++;
	 	})
	 	for(var a=0; a<drama_href.length;a++){	   		
	 		middle.queue(drama_href[a]);
	 	}
	}     
	},

	// Hong Kong Drama
	{
	 "url":"http://www.dramacool.com/category/hong-kong-drama",
	 "callback": function(error, result, $){
	 	drama_href = new Array();
	    drama_title = new Array();
	 	var i=0;	
	 	$(".col-md-10 > a").filter(function(){
	 		var HongKongDrama = $(this);
	 		drama_href[i] = "http://www.dramacool.com/"+HongKongDrama.attr("href");
 			drama_title[i] = HongKongDrama.attr("title");
 			i++;
	 	})
	 	for(var a=0; a<drama_href.length;a++){	   	
	 		middle.queue(drama_href[a]);
	 	}
	}     
	},

	// Chinese Drama
	{
	 "url":"http://www.dramacool.com/category/chinese-drama",
	 "callback": function(error, result, $){
	 	drama_href = new Array();
	    drama_title = new Array();
	 	var i=0;	
	 	$(".col-md-10 > a").filter(function(){
	 		var chineseDrama = $(this);
	 		drama_href[i] = "http://www.dramacool.com/"+chineseDrama.attr("href");
 			drama_title[i] = chineseDrama.attr("title");
 			i++;
	 	})
	 	for(var a=0; a<drama_href.length;a++){	   	
	 		middle.queue(drama_href[a]);
	 	}
	     
	}
	}

])



}) 
app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;


function httpResponse(response, data) {
        try {
                response.setHeader('Content-Length', Buffer.byteLength(data));
                response.setHeader('Content-Type', 'application/json; charset="utf-8"');
                response.write(data);
                response.end();
        } catch(err) {
                console.log(err);
        }

}

