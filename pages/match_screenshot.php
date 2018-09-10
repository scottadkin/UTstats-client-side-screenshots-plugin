<?php

$match_id = preg_replace('/\D/', '', $_GET['mid']);

require_once 'includes/match_screenshot.php';

$real_gamename = strtolower($real_gamename);


$supportedGametypes = [
    "tournament team game",
    "tournament team game (insta)",
    "tournament deathmmatch",
    "tournament deathmatch (insta)",
    "last man standing",
    "last man standing (insta)",
    "domination",
    "domination (insta)",
    "capture the flag",
    "capture the flag (insta)",
    "assault",
    "assault (insta)"
];
if(in_array($real_gamename, $supportedGametypes)){
    $screenshot = new MatchScreenshot($match_id, $real_gamename);

    echo $screenshot->display();
}

