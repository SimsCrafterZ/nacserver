<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
	$entityBody = file_get_contents('php://input');
	$obj = json_decode($entityBody,true);
	///decoding the json sent by the anime-channel app when accessing a file;
	if ($entityBody===""){
		$not_app_err='{
	"error":"Invalid request! Please try again later!"}';
	///Made to deter normal access, and to connect to it using only the 3DS's app to avoid errors.
	}
	else {
	$catalog_en = '
	"The test is successful, and your Nintendo 3DS reported with the following data:\n
	Device Country: ' . $obj["head"]["device"]["country"] . '\n
	Device Language: '. $obj["head"]["device"]["language"] . '"
	'; /// custom string that displays what it received, country and language.
	}
	if ($entityBody!="") $test = $obj["body"][0];
	if ($entityBody==="") echo($not_app_err); 
	///the request was not made from the app, and considered invalid
	else if (!empty($test["incViewCount"]) ) echo("{}"); 
	//when accessing a video, an incViewCount request is sent. We're returning an empty json to prevent error 403, and/or for refresh purposes
	
	else if (!empty($test["getNode"])){
		$rootCheck=$test["getNode"];
		if ($rootCheck["id"]===$rootCheck["type"] && $rootCheck["type"]==="root"){ //check if root === root in both type and id -> output the catalog
			
			echo '{"body":['; ///start of catalog
			
			///start of language check: if language exists, then output the proper language segment; else output the error one, which is still valid content
			$lang=array("en","fr","pt","es","de","nl","ru","it","jp","kr","cn");
			///Japanese, Korean, Chinese aren't languages implemented in the app, and I've put them here just in case someone wants to get funky
			
			$getCatalog = '<http_location>/catalog_';
			if (in_array($obj["head"]["device"]["language"] , $lang)) {
				$getCatalog = $getCatalog . $obj["head"]["device"]["language"] . '.json';
			}
			///Only catalog_en is present in this repository, for the sake of example.
			///Please add, remove or modify these files or listings on your own, for your own needs.
			else {
				$getCatalog = $getCatalog . 'error.json';
				///no language found? ok, just specify the error json instead.
			}
			echo file_get_contents($getCatalog);
			///and now we output the language catalog segment;
			
			echo file_get_contents('<http_location>/channel_1.json');
			echo file_get_contents('<http_location>/channel_2.json'); 
			//this one is just a copy, it is not added in the airing_shows json file, and you must do so on your own for each channel.
			
			///this outputs the channel to be displayed, as the order here does NOT matter. They can be ALL loaded in any order.
			echo '
            {
			"setNode": {
			"id": "root",
			"type": "root",
			"children": [';
			echo file_get_contents('<http_location>/airing_shows.json');
			///then we list the shows we want to see in the app. We can specify the order in this json
			
			echo ']}}]}';///end of catalog
		}
	}
}
///<http_location> is the location to your file(s) accessible from the internet. For example, http://google.com

?>
