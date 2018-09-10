# UTstats client side screenshots plugin

Utstats screenshots is a plugin for UTStats(Version 428) for the original Unreal Tournament, this plugin adds match screenshots for support gametypes on match report pages.





# Install

First install all the files in their correct places:
- match_screenshot.js goes in the utstats home directory (utstats/).
- pages/match_screenshot.php goes in the (utstats/pages/) directory,
- includes/screenshot.php goes in the (utstats/includes/) directory,
- sshots/ goes in the (utstats/images/) directory

Now to add the module to your pages/match_info.php file:

- Add this line before the last if statement on the file(~Line: 73)":
    require_once 'pages/match_screenshot.php';



# How to add screenshots
- To add new screenshots for different maps simply take a screenshot in game, convert it to a .jpg file and save it as the map files name in lowercase, e.g CTF-Face.unr will be ctf-face.jpg.
- Place the new image file into the images/sshots/ folder.





# Examples

![alt text](https://i.imgur.com/JKVDnGf.png)