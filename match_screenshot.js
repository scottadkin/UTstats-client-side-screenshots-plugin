
(function(){

    const teamWidth = 37;
    const headerHeight = 4.4;
    
    const playerBox = 10.11;
    const teamOffsetY = 10.64;
    const padding = 1.38;


    const teamIconSize = 2.962;
    const teamIconX = 1.09;
    const teamIconY = 0.74;
    const fragPointsOffset = 33.25;
    const fragsPointsFont = 1.79;
    const nameOffsetX = 0.8729;
    const scoreOffsetX = 32.81; 
    const effFont = 0.648;
    const pingFont = 0.8;
    const smartCtfTextX = 1.944;
    const smartCtfFont = 1.018;
    const smartCtfTextPadding = 0.37;
    //const smartCtfValueOffset = 3.59;
    const smartCtfBarOffset = 0.52;
    const smartCtfBarMaxWidth = 11.77;
    const smartCtfBarHeight = 0.37;
    const smartCtfTextOffset2 = 16.406;
    const smartCtfFlagOffset = 0.25;
    const smartCtfFlagSize = 1;
    const smartCtfFlagX = 0.25;
    const smartCtfTeamScoreOffset = 1;
    const smartCtfBottomFont = 1.11;
    const smartCtfBottomOffset = 92.77;
    const textMessageFont = 1.2;

    const smartCTFValueOffset = 2.2;

    const winnerMessageY = 3.73;
    const winnerFont = 2.12;

    const blue = "rgb(11,125,239)";
    const grey = "rgb(220,220,220)";



    bLoading = true;
    bFailedBackgroundImage = false;
    bFinishedBackgroundImage = false;

    function bImageExist(url){

        const xmlhttp = new XMLHttpRequest();


        const handler = function(){

           // console.log("loaded");
            if(this.status == 200){
                //bLoading = false;
               // console.log("found Image");
                bFinishedBackgroundImage = true;
            }else if(this.status == 404){
                //set default background
                bFailedBackgroundImage = true;
                bFinishedBackgroundImage = true;
                //bFinishedBackgroundImage = true;
            }
        }

        
        xmlhttp.open('HEAD', url, false);
        xmlhttp.onload = handler;
        xmlhttp.send();
        

        console.log("checking "+url);

       
            
        
    }

    class Player{


        constructor(data){

            this.data = data;
            //console.log(this.data);

            this.minPing = 0;
            this.maxPing = 0;
            this.pingRange = 0;
            this.currentPing = 0;

            this.image = new Image();
            this.flag = new Image();

            this.createPingRange();
            this.setPlayerIcon();
            this.setMiscData();

            this.ticksSinceUpdate = 0;

        }


        setMiscData(){

            this.time = (this.data.gametime / 60).toFixed(0);
            this.eff = parseFloat(this.data.eff);
            this.eff = this.eff.toFixed(0);
        }

        

        setPlayerIcon(){

            const dir = "images/icons/";
            const ext = ".png";

            let r = 1 + (Math.floor(Math.random() * 26));
            this.image.src = dir+r+ext;
           // console.log(this.image.src);


            let country = this.data.country;

            if(country == "" || country == "eu"){
                country = "xx";
            }

            //console.log("images/flags/"+country+".png");
            

            this.flag.src = "images/flags/"+country+".png";
           // console.log(this.flag);
        }


        createPingRange(){

            this.minPing = parseInt(this.data.lowping);
            this.maxPing = parseInt(this.data.avgping);


            this.pingRange = this.maxPing - this.minPing;

            console.log(this.minPing+" - "+this.maxPing);


        }


        updatePing(){


            let r =  Math.floor(Math.random() * this.pingRange);

            this.currentPing = this.minPing + r;

        }

        tick(){

            //console.log(this.data.name+" just updated");
            this.ticksSinceUpdate++;
            if(this.ticksSinceUpdate >= 15){
                this.ticksSinceUpdate = 0;
                this.updatePing();
            }

        }
    }

    class MatchScreenshot{


        constructor(canvas,data,matchInfo){


            
            this.canvas = document.getElementById(canvas);
            this.context = this.canvas.getContext("2d");
            this.data = data;
            this.matchInfo = matchInfo;
            this.gameType = this.matchInfo.gamename.toLowerCase();
            //console.log(this.gameType);
            

            this.redTeamIcon = new Image();
            this.redTeamIcon.src = "images/redteam.png";
            this.blueTeamIcon = new Image();
            this.blueTeamIcon.src = "images/blueteam.png";
            this.smartCtfHeaderBg = new Image();
            this.smartCtfHeaderBg.src = "images/smartctfbg.png";


            this.xSize = 0;
            this.ySize = 0;

            this.players = [];

            this.redTeam = [];
            this.blueTeam = [];
            this.greenTeam = [];
            this.yellowTeam = [];
            

            this.image = new Image();

            this.totalTeams = 0;

            this.setTotalTeams();

            
            this.setMaxTeamHeight();
            this.createPlayerObjects();
            this.setMaxBarValues();

            this.createFileName();
            this.createCanvasEvents();
            
            this.setUpBackgroundImage("images/sshots/"+this.mapFile+".jpg");

            this.main();
        }


        createCanvasEvents(){

            this.canvas.addEventListener("mousedown",()=>{

                if(this.canvas.requestFullscreen){
                    this.canvas.requestFullscreen();
                }

                if(this.canvas.webkitRequestFullscreen){
                    this.canvas.webkitRequestFullscreen();
                }

                if(this.canvas.mozRequestFullScreen()){
                    this.canvas.mozRequestFullScreen();
                }
            });
        }


        setTotalTeams(){

            if(this.matchInfo.t3 == 1){
                this.totalTeams = 4;
            }else if(this.matchInfo.t2 == 1){
               this.totalTeams = 3;
            }else if(this.matchInfo.t1 == 1){
                this.totalTeams = 2;
            }


            this.headerString = "";


            const sortByTeamScore = function (a,b){

                if(a[1] > b[1]){
                    return -1;
                }else if(a[1] < b[1]){
                    return 1;
                }

                return 0;
            }

            let tempTeamScore = [];

            tempTeamScore.push(["Red Team wins the match!", parseInt(this.matchInfo.t0score)]);
            tempTeamScore.push(["Blue Team wins the match!", parseInt(this.matchInfo.t1score)]);
            tempTeamScore.push(["Green Team wins the match!", parseInt(this.matchInfo.t2score)]);
            tempTeamScore.push(["Gold Team wins the match!",parseInt(this.matchInfo.t3score)]);

            console.log(tempTeamScore);
            tempTeamScore.sort(sortByTeamScore);
            console.log(tempTeamScore);

            this.headerString = tempTeamScore[0][0];
        }

        createFileName(){

            let file = this.matchInfo.mapfile.toLowerCase();
            
            this.mapFile = undefined;

            const reg = /^(.+)\.unr$/i

            if(reg.test(file)){

                let result = reg.exec(file);
                console.log(result);

                this.mapFile = result[1];
            }else{
                console.log("Failed reg exp");
            }
            
        }

        setUpBackgroundImage(url){

            
            let r = Math.floor(Math.random() * 100000000);

            this.imageURL = url;

            bImageExist(url);

        }

        //find the highest value for each of the smartCTFBars
        setMaxBarValues(){

            this.maxCaps = 0;
            this.maxGrabs = 0;
            this.maxAssists = 0;
            this.maxCovers = 0;
            this.maxDeaths = 0;
            this.maxFlagKills = 0;


            let teams = [this.redTeam,this.blueTeam];

            let currentPlayer = 0;


            let currentCaps = 0;
            let currentGrabs = 0;
            let currentAssists =0;
            let currentCovers = 0;
            let currentDeaths = 0;
            let currentFlagKills =0;

            for(let t = 0; t < teams.length; t++){
                console.log("team = "+t);
                for(let i = 0; i < teams[t].length; i++){

                    currentPlayer = teams[t][i].data;
                    //console.log(currentPlayer);


                    currentCaps = parseInt(currentPlayer.flag_capture);

                    if(currentCaps > this.maxCaps){
                        this.maxCaps = currentCaps;
                        //console.log("maxCaps = "+currentPlayer.flag_capture);
                    }

                    currentGrabs = parseInt(currentPlayer.flag_taken);

                    if(currentGrabs > this.maxGrabs){
                        this.maxGrabs = currentGrabs;
            
                    }

                    currentAssists = parseInt(currentPlayer.flag_assist);

                    if(currentAssists > this.maxAssists){
                        this.maxAssists = currentAssists;
                        
                    }

                    currentCovers = parseInt(currentPlayer.flag_cover);

                    if(currentCovers > this.maxCovers){
                        this.maxCovers = currentCovers;
                       
                    }

                    currentDeaths = parseInt(currentPlayer.deaths);

                    if(currentDeaths > this.maxDeaths){
                        this.maxDeaths = currentDeaths;
                        
                    }

                    currentFlagKills = parseInt(currentPlayer.flag_kill);

                    if(currentFlagKills > this.maxFlagKills){
                        this.maxFlagKills = currentFlagKills;
                    }

                }

            }

        }


        createPlayerObjects(){


            for(let i = 0; i < this.data.length; i++){
                //this.players.push(new Player(this.data[i]));

                if(this.gameType == "tournament deathmatch" || this.gameType == "tournament deathmatch (insta)" || this.gameType == "last man standing" || this.gameType == "last man standing (insta)"){

                    this.players.push(new Player(this.data[i]));
                    
                }else{

                    switch(this.data[i].team){

                        case "0": {     this.redTeam.push(new Player(this.data[i]));    } break;
                        case "1": {     this.blueTeam.push(new Player(this.data[i]));   } break;
                        case "2": {     this.greenTeam.push(new Player(this.data[i]));  } break;
                        case "3": {     this.yellowTeam.push(new Player(this.data[i])); } break;
                    }
                    
                }
            }


            this.players.sort((a,b) =>{
                console.log(this.gameType);
                if(this.gameType == "last man standing" || this.gameType == "last man standing (insta)"){
                    a = parseInt(a.data.gamescore);
                    b = parseInt(b.data.gamescore);
                }else{
                    a = parseInt(a.data.kills);
                    b = parseInt(b.data.kills);
                }
                if(a > b){
                    return -1;
                }else if(a  < b){
                    return 1;
                }else{
                    return 0;
                }
            });
        }


        setMaxTeamHeight(){

            this.maxTeam = 0;

            let red = 0;
            let blue = 0;


            for(let i = 0; i < this.data.length; i++){

                if(this.data[i].team == "0"){
                    red++;
                    
                }else{
                    blue++;
                }
            }

            if(red > blue){
                this.maxTeam = red;
                
            }else{
                this.maxTeam = blue;
                
            }

            if(this.maxTeam > 7){
                this.maxTeam = 7;
            }

            this.maxTeam++;

        }


        updatePlayers(){


            if(this.gameType == "tournament deathmatch" || this.gameType == "tournament deathmatch (insta)" || this.gameType == "last man standing" || this.gameType == "last man standing (insta)"){

                for(let i = 0; i < this.players.length; i++){
                    this.players[i].tick();
                }
                
            }else{
                
                for(let i = 0; i < this.redTeam.length; i++){
                    this.redTeam[i].tick();
                }

                for(let i = 0; i < this.blueTeam.length; i++){
                    this.blueTeam[i].tick();
                }

                for(let i = 0; i < this.greenTeam.length; i++){
                    this.greenTeam[i].tick();
                }

                for(let i = 0; i < this.yellowTeam.length; i++){
                    this.yellowTeam[i].tick();
                }
            }

            
        }

        main(){

            this.render();
            //if(this.gameType == "capture the flag"){
              //  this.renderSmartCTF();
            //}

            setInterval(()=>{
                //if(this.gameType == "capture the flag"){
                    this.render();
                //}
                this.updatePlayers();
            }, 33);
        }


        renderTeamSmartCTF(c,team){

            //0 = red 1 = blue

            let x = 0;
            let y = 0;
            let currentWidth = 0;
            let currentHeight = 0;
            let currentX = 0;
            let currentY = 0;

            let headerColor = (team == 0) ? "rgba(255,0,0,0.25)" :  "rgba(0,0,255,0.25)";
            let fontColor = (team == 0) ? "rgb(255,0,0)" :  blue;
            let teamIcon = (team == 0) ? this.redTeamIcon : this.blueTeamIcon;
            let teamScore = (team == 0) ? this.matchInfo.t0score : this.matchInfo.t1score;
            let players = 0;



            if(team == "0"){
                players = this.redTeam;
            }else if(team == "1"){
                players = this.blueTeam;
            }else if(team == "2"){
                players = this.greenTeam;
            }else if(team == "3"){
                players = this.yellowTeam;
            }

            //make background color of team area darker so its easier for the users to read text
            c.fillStyle = "rgba(0,0,0,0.65)";


            y = this.ySize * teamOffsetY;

            if(team == 0){
                x = this.xSize * 8; 
            }else{
                x = this.xSize * 58;
            }

            //draw background
            c.fillRect(x, y, teamWidth * this.xSize, (this.maxTeam * playerBox) * this.ySize);

            //draw Teamheadeer

            currentWidth = teamWidth * this.xSize;
            currentHeight = headerHeight * this.ySize;

            c.fillStyle = headerColor;
            c.fillRect(x,y,currentWidth, currentHeight);

            // draw header pattern
            c.globalAlpha = 0.4;
            c.drawImage(this.smartCtfHeaderBg,x,y,currentWidth, currentHeight);
            c.globalAlpha = 1;

            //drawTeamIcon
            c.strokeStyle = grey;
           // c.fillRect();
            currentX = x + (teamIconX * this.xSize);
            currentY = y + (teamIconY * this.ySize);
            c.drawImage(teamIcon, currentX, currentY, teamIconSize * this.ySize, teamIconSize * this.ySize);

            //draw score
            c.fillStyle = fontColor;
            c.font = (teamIconSize * this.ySize)+"px arial";
            c.fillText(teamScore,x + (teamIconSize * this.xSize),y + ((teamIconSize + 0.25) * this.ySize));

            c.textAlign = "right";
            c.font = "bold "+(fragsPointsFont * this.ySize)+"px arial";
            c.fillText("Frags / Pts",x + ((teamIconSize + fragPointsOffset) * this.xSize),y + ((teamIconSize + 0.25) * this.ySize));


            c.textAlign = "left";



            //draw players


            const startY = y + ((headerHeight + 3) * this.ySize );
            
            c.font = "bold "+(fragsPointsFont * this.ySize)+"px arial";


         

            let textOffset = 0;

            let totalPlayers = 0;

            if(players.length > 7){
                totalPlayers = 7;
            }else{
                totalPlayers = players.length;
            }

            for(let i = 0; i < totalPlayers; i++){

                c.font = "bold "+(fragsPointsFont * this.ySize)+"px arial";
                c.fillStyle = fontColor;

                currentY = startY + ((playerBox * this.ySize )* i);
                currentX = x + ((teamIconSize + 0.5) * this.xSize);


                c.fillText(players[i].data.name, currentX,currentY);

                textOffset = c.measureText(players[i].data.name+"  ").width;

                c.font = (pingFont * this.ySize)+"px monospace";
                c.fillStyle = grey;
                c.fillText("TM:"+players[i].time+" EFF:"+players[i].eff+"%", currentX + textOffset, currentY);


                //playerscore
                c.font = "bold "+(fragsPointsFont * this.ySize)+"px arial";
                c.fillStyle = fontColor;
                c.textAlign = "right";

                currentX = x + ((fragPointsOffset + teamIconSize) * this.xSize);
                c.fillText(players[i].data.kills+"/"+players[i].data.gamescore, currentX,currentY);
                c.textAlign = "left";

                currentX = x + (teamIconX * this.xSize);
                c.strokeStyle = grey;
                c.lineWidth = 0.05 * this.ySize;
                c.drawImage(players[i].image, currentX, currentY - (2.1 * this.ySize), teamIconSize * this.ySize, teamIconSize * this.ySize );
                c.strokeRect( currentX, currentY - (2.1 * this.ySize), teamIconSize * this.ySize, teamIconSize * this.ySize );

                //user flag

                c.drawImage(players[i].flag,currentX + (this.xSize * 0.3),currentY + (this.ySize * 1.25), this.xSize * 1, this.ySize * 1);
                //ping packetloss

                c.font = (pingFont * this.ySize)+"px monospace";
                c.fillStyle = grey;
                c.textAlign = "left";
                c.fillText("PI:"+players[i].currentPing, currentX, currentY + (3.15 * this.ySize));
                c.fillText("PI:0%", currentX, currentY + ((3.15 + pingFont) * this.ySize));


                c.textAlign = "left";


                //smartCTF bars

                
                c.font = (smartCtfFont * this.ySize)+"px arial";
                c.fillStyle = "white";

                currentX = x + ((teamIconSize + 0.5) * this.xSize);
                currentY = currentY + (this.ySize * 1.5);


                //caps
                this.drawBar(players[i].data ,currentX, currentY, 0);
                //grabs
                this.drawBar(players[i].data ,currentX, currentY, 1);
                //assists
                this.drawBar(players[i].data, currentX, currentY, 2);

                //set it up for the second coloum
                currentX = currentX + (this.xSize * 17);
                //covers
                this.drawBar(players[i].data, currentX, currentY, 3);
                //deaths
                this.drawBar(players[i].data, currentX, currentY, 4);
                //flagkills
                this.drawBar(players[i].data, currentX, currentY, 5);

 
            }
            
        }


        //draws the player data and rows caps: x ===============
        drawBar(p,x,y,type){

            const c = this.context;

            let labelString = "";
            let labelValue = 0;
            let offsetY = 0;
    
            let maxValue = 0;

            const rowHeight = 1.5 * this.ySize;

            

            switch(type){
                case 0: {
                    labelString = "Caps:";
                    labelValue = p.flag_capture;
                    maxValue = this.maxCaps;
                } break;
                case 1: {
                    labelString = "Grabs:";
                    labelValue = p.flag_taken;
                    offsetY = rowHeight;
                    maxValue = this.maxGrabs;
                } break;
                case 2: {
                    labelString = "Assists:";
                    labelValue = p.flag_assist;
                    offsetY = rowHeight * 2;
                    maxValue = this.maxAssists;
                } break;
                case 3: {
                    labelString = "Covers:";
                    labelValue = p.flag_cover;
                    maxValue = this.maxCovers;
                } break;
                case 4: {
                    labelString = "Deaths:";
                    labelValue = p.deaths;
                    offsetY = rowHeight;
                    maxValue = this.maxDeaths;
                } break;
                case 5: {
                    labelString = "FlagKills:";
                    labelValue = p.flag_kill;
                    offsetY = rowHeight * 2;
                    maxValue = this.maxFlagKills;
                } break;
            }


            c.fillText(labelString, x, y + offsetY);


            c.fillText(labelValue, x  + (this.xSize * smartCTFValueOffset) + (this.xSize * 0.5), y + offsetY);

            c.fillStyle = "green";


            //set up the bar
            const barX = x + (this.xSize * (smartCTFValueOffset + 1.7));
            const barHeight = this.ySize * 0.4;
            const barWidth = 12 * this.xSize;

            y = y - barHeight;

            //bar bit is the bar divided by the max value
            let barBit = 0;

            let r = 0;
            let g = 255;
            let b = 0;

            if(maxValue > 0){
                barBit = barWidth / maxValue;
                r = 255 / maxValue;
                b = 255 / maxValue;

                r = 255 - (r * labelValue);
                b = 255 - (b * labelValue);

                //r = r.toFixed(0);
                b = b.toFixed(0);
                r = r.toFixed(0);
                g = g.toFixed(0);
            }
            let currentWidth = 0;
           // console.log("rgb("+r+","+g+","+b+");");
            c.fillStyle = "rgb("+r+","+g+","+b+")";
            c.fillRect(barX,y + offsetY,barBit * labelValue,barHeight);

            c.fillStyle = "white";
        }



        renderFooter(c){

            

            c.fillStyle = "yellow";
            c.font = (this.ySize * smartCtfBottomFont)+"px arial";


            let seconds = parseInt(this.matchInfo.gametime);
            seconds = seconds.toFixed(0);
            let minutes = (seconds / 60).toFixed(0);
            let hours = (minutes / 60).toFixed(0);

            if(seconds < 10){
                seconds = "0"+seconds;
            }

            if(minutes < 10){
                minutes = "0"+minutes;
            }

            if(hours < 10){
                hours = "0"+hours;
            }


            let currentTime = this.matchInfo.time;
            let currentYear = currentTime.substring(0,4);
            let currentMonth = currentTime.substring(4,6);
            let currentDay = currentTime.substring(6,8);
            let currentHours = currentTime.substring(8,10);
            let currentMinutes = currentTime.substring(10,12);
            //console.log(currentYear+" "+currentMonth+" "+currentDay + " "+currentHours+" "+currentMinutes);

            let currentDate = new Date(currentYear, currentMonth - 1, currentDay);
            let day = currentDate.getDay();
            
            let string1 = "[ SmartCTF 4E | {PiN}Kev | {DnF2}SiNiSTeR | [es]Rush | adminthis & The_Cowboy & Sp0ngeb0b ]";
            let string2 = "Current Time:  "+this.getDay(day-1)+" "+day+" "+this.getMonth(currentMonth)+" "+currentHours+":"+currentMinutes+" | Elapsed Time: "+hours+":"+minutes+":"+(seconds%60);
            let string3 = "Playing CTF-"+this.matchInfo.mapname+" on "+this.matchInfo.servername;

            c.textAlign = "center";
            c.fillText(string1, 50 * this.xSize, 96 * this.ySize);
            c.fillStyle = "white";
            c.fillText(string2, 50 * this.xSize, 97.25 * this.ySize);
            c.fillText(string3, 50 * this.xSize, 98.5 * this.ySize);
        }

        getMonth(value){

            value = parseInt(value);
            
            switch(value){
                case 0: {   return "Jan"; } break;
                case 1: {   return "Feb"; } break;
                case 2: {   return "Mar"; } break;
                case 3: {   return "Apr"; } break;
                case 4: {   return "May"; } break;
                case 5: {   return "Jun"; } break;
                case 6: {   return "Jul"; } break;
                case 7: {   return "Aug"; } break;
                case 8: {   return "Sep"; } break;
                case 9: {   return "Oct"; } break;
                case 10: {   return "Nov"; } break;
                case 11: {   return "Dec"; } break;
            }
        }

        getDay(value){

            switch(value){
                case 0: {   return "Monday"; } break;
                case 1: {   return "Tuesday"; } break;
                case 2: {   return "Wednesday"; } break;
                case 3: {   return "Thursday"; } break;
                case 4: {   return "Friday"; } break;
                case 5: {   return "Saturday"; } break;
                case 6: {   return "Sunday"; } break;
            }
        }

        render(){

            
            const c = this.context;
            c.textBaseline = "top";
            this.canvas.width = window.innerWidth * 0.8;
            //force 16:9 aspect ratio
            this.canvas.height = this.canvas.width * 0.5625;

            this.xSize = this.canvas.width / 100;
            this.ySize = this.canvas.height / 100;
            
            
            if(bLoading && bFinishedBackgroundImage && bFailedBackgroundImage){
                this.image.src = "images/sshots/blank.jpg";
               
                console.log("check 1");

                bLoading = false;
            }

            if(bLoading && bFinishedBackgroundImage && !bFailedBackgroundImage){
                console.log("check 2");
                this.image.src = this.imageURL;
                
                console.log(this.imageURL);
                bLoading = false;
            }
            
            

           // console.log("bLoading ");

            if(!bLoading && bFinishedBackgroundImage){
                
                
                
                
                

                c.drawImage(this.image,0,0,this.canvas.width, this.canvas.height);

                if(this.gameType == "capture the flag" || this.gameType == "capture the flag (insta)"){
                    this.renderSmartCTF();
                }else if(this.gameType == "tournament team game (insta)" || this.gameType == "tournament team game" ||
                 this.gameType == "assault " || this.gameType == "assault (insta)" || this.gameType == "domination" || this.gameType == "domination (insta)"){

                    this.renderTDM();
                }else if(this.gameType == "tournament deathmatch (insta)" || this.gameType == "tournament deathmatch" || 
                    this.gameType == "last man standing" || this.gameType == "last man standing (insta)"){
                    this.renderDM();
                }
            }
        }


        renderDM(){


            let bLastManStanding = false;

            if(this.gameType == "last man standing" || this.gameType == "last man standing (insta)"){
                bLastManStanding = true;
            }

            const c = this.context;

            console.log("render dm");

            const nameOffset = 16 * this.xSize;;
            const fragOffset = 60 * this.xSize;
            const deathOffset = 80 * this.xSize;

            const headerOffset = 17 * this.ySize;

            const firstPlayerOffset = 20;

            const nameColor = "rgb(0,128,255)";
            const scoreColor = "rgb(128,255,255)";

            c.fillStyle = "yellow";

            c.textAlign = "center";
            c.font = (this.ySize * 3)+"px arial";
            //console.log(this.players);
            c.fillText(this.players[0].data.name+" wins the match!", this.xSize * 50, this.ySize * 10);


            c.textAlign = "left";

            c.fillStyle = "white";

            c.font = (2 * this.ySize)+"px arial";

            c.textAlign = "left";
            c.fillText("Player", nameOffset, headerOffset);
            c.textAlign = "right";
            if(!bLastManStanding){
                c.fillText("Frags", fragOffset, headerOffset);
                c.fillText("Deaths", deathOffset, headerOffset);
            }else{
                c.fillText("Lives", fragOffset, headerOffset);
                c.fillText("Ping", deathOffset, headerOffset);
            }

            //const players = [this.redTeam, this.blueTeam, this.greenTeam, this.yellowTeam, this.noneTeam];

            //currentPlayer
            let p = 0;

            c.font = (1.8 * this.ySize)+"px arial";
            const rowHeight = 2.4;

            let playedTime = 0;
            let fph = 0;
            let fpm = 0;

            for(let i = 0; i < this.players.length; i++){
                p = this.players[i];
                fph = 0;

                c.font = (1.8 * this.ySize)+"px arial";
                c.textAlign = "left";
                c.fillStyle = nameColor;
                c.fillText(p.data.name, nameOffset, (firstPlayerOffset + (rowHeight * i)) * this.ySize);

                c.textAlign = "right";
                c.fillStyle = scoreColor;
                if(!bLastManStanding){
                    c.fillText(p.data.kills, fragOffset, (firstPlayerOffset + (rowHeight * i)) * this.ySize);
                    c.fillText(p.data.deaths, deathOffset, (firstPlayerOffset + (rowHeight * i)) * this.ySize);
                }else{
                    c.fillText(p.data.gamescore, fragOffset, (firstPlayerOffset + (rowHeight * i)) * this.ySize);
                    c.fillText(p.currentPing, deathOffset, (firstPlayerOffset + (rowHeight * i)) * this.ySize);
                }

                c.textAlign = "left";
                c.fillStyle = "white";
                c.font = (0.8 * this.ySize)+"px arial";
                
                playedTime = Math.ceil(p.data.gametime / 60);

                if(p.data.kills > 0 && p.data.gametime > 0){
                    fph = (p.data.kills / playedTime) * 60;
                }

                if(!bLastManStanding){
                    c.fillText("Time: "+playedTime, deathOffset + (2 * this.xSize), (firstPlayerOffset - 1 + (rowHeight * i)) * this.ySize);
                    c.fillText("FPH: "+ fph, deathOffset + (2 * this.xSize), (firstPlayerOffset  + (rowHeight * i)) * this.ySize);
                    c.fillText("Ping: "+p.currentPing, deathOffset + (4 * this.xSize), (firstPlayerOffset - 1 + (rowHeight * i)) * this.ySize);
                }
                //c.fillText("Ping:");
               // c.fillText("FPH:");
                
            }



            this.renderDefaultFooter();
        }


        renderTDMTeam(team){

            const c = this.context;

            console.log("render tdm");

            let teamColor = "";
            let teamOffsetX = 0;
            let teamOffsetY = 0;
            let maxPlayersToDisplay = 0;
            let players = 0;
            const scoreOffset = 30;

            let teamString = "";
            let teamScore = "";

            //set up team variables
            if(team == 0){

                teamColor = "red";
                teamOffsetX = 8;
                teamOffsetY = 18;
                maxPlayersToDisplay = 14;
                players = this.redTeam;
                teamString = "Red Team";
                teamScore = this.matchInfo.t0score;

                if(this.totalTeams > 2){
                    maxPlayersToDisplay = 4;
                }

            }else if(team == 1){
                teamColor = blue;
                teamOffsetX = 58;
                teamOffsetY = 18;
                maxPlayersToDisplay = 14;
                players = this.blueTeam;
                teamString = "Blue Team";
                teamScore = this.matchInfo.t1score;

                if(this.totalTeams == 4){
                    maxPlayersToDisplay = 4;
                }

            }else if(team == 2){

                teamColor = "rgb(0,255,0)";
                teamOffsetX = 8;
                maxPlayersToDisplay = 4;
                teamOffsetY = 50;
                players = this.greenTeam;
                teamString = "Green Team";
                teamScore = this.matchInfo.t2score;

            }else{

                teamColor = "rgb(205,205,0)";
                teamOffsetX = 58;
                maxPlayersToDisplay = 4;
                teamOffsetY = 50;
                players = this.yellowTeam;
                teamString = "Gold Team";
                teamScore = this.matchInfo.t3score;
            }

            c.fillStyle = teamColor;


            const startX = teamOffsetX;
            const startY = teamOffsetY;
            const rowHeight =  4.7;
            const normalFont = 2.2;
            const pingFont = 0.95;

            let currentX = 0;
            let currentY = 0;

            let totalPlayers = players.length;

          
            let limit = 0;

            let playerOverflow = 0;

            if(players.length > maxPlayersToDisplay){
                
                limit = maxPlayersToDisplay;

                playerOverflow = players.length - maxPlayersToDisplay;
                
                
            }else{
                limit = players.length;
            }

            let orderString = "";
            const pingOffset = 3.5;
            const pingRow = 1.5;


            console.log(players.length);

            for(let i = -1; i < limit; i++){

                c.textAlign = "left";
                c.font = (normalFont * this.ySize)+"px arial";


                currentX = startX * this.xSize;
                currentY = (startY + (rowHeight * i)) * this.ySize;
                if(i == -1){
                    
                    c.fillText(teamString,currentX,(startY - 3.5) * this.ySize);
                    c.textAlign = "right";
                    c.fillText(teamScore,currentX + ( scoreOffset * this.xSize),(startY - 3.5) * this.ySize);
                }else{

                    //ping time
                    c.fillStyle = "white";
                    c.font = (pingFont * this.ySize)+"px arial";

                    c.fillText("PING: "+players[i].currentPing, currentX - (pingOffset * this.xSize), currentY);
                    c.fillText("TIME: "+(Math.ceil(players[i].data.gametime / 60)), currentX - (pingOffset * this.xSize), currentY + (pingRow * this.ySize));
                    //main stuff

                    c.fillStyle = teamColor;
                    c.font = (normalFont * this.ySize)+"px arial";
                    c.fillText(players[i].data.name, currentX, currentY);
                    c.textAlign = "right";
                    c.fillText(players[i].data.gamescore,currentX + ( scoreOffset* this.xSize),currentY);

                    c.textAlign = "left";
                    c.font = (pingFont * this.ySize)+"px arial";
                    if(players[i].data.isabot == "1"){
                        orderString = "ATTACKING";
                    }else{
                        orderString = "*HUMAN*";
                    }
                    c.fillText("Orders: "+orderString , currentX, currentY + (3 * this.ySize));

                    if(i == limit - 1 && playerOverflow >= 1){

                        c.fillText(playerOverflow+" Player[s] not shown.", currentX, currentY + (rowHeight * this.ySize));
                    }
                }

            }
        }


        renderDefaultFooter(){

            const c = this.context;

            c.textAlign = "center";
            c.font = (1.2 * this.ySize)+"px arial";


            c.fillStyle = "rgb(0,255,0)";

            c.fillText("The match has ended.", this.canvas.width/2, this.ySize * 88);

            c.fillStyle = "white";

            let gameName = "Tournament Team Game in ";

            if(this.gameType == "tournament deathmatch" || this.gameType == "tournamen deathmatch (insta)"){
                gameName = "Tournament Deathmatch in ";
            }else if(this.gameType == "last man standing" || this.gameType == "last man standing (insta)"){
                gameName = "Last man standing in ";
            }else if(this.gameType == "domination" || this.gameType == "domination (insta)"){
                gameName = "Domination in ";
            }
            
            
            c.fillText(gameName+this.matchInfo.mapname,this.canvas.width/2, this.ySize * 96.5);


            const time = this.matchInfo.gametime;

            let seconds = (time % 60).toFixed(0);
            let minutes = (time / 60).toFixed(0);
            let hours = (minutes / 3600).toFixed(0);

            if(hours < 10){
                hours = "0"+hours;
            }

            if(minutes < 10){
                minutes = "0"+minutes;
            }

            if(seconds < 10){
                seconds = "0"+seconds;
            }

            c.fillText("Time Elapsed: "+hours+":"+minutes+":"+seconds,this.canvas.width/2, this.ySize * 98.24);
            c.textAlign = "left";
        }

        renderTDM(){

            //console.log("render tdm");

            const c = this.context;

            c.fillStyle = "rgba(0,0,0,0.65)";
            c.fillRect(0,0,this.canvas.width, this.canvas.height);
            c.fillStyle = "yellow";
            c.font = "20px arial";
            c.textBaseline = "top";

            c.textAlign = "center";
            //console.log(45 * this.ySize);
            c.fillText(this.headerString,this.canvas.width / 2, 5 * this.ySize);
           // c.fillText("Tournament Team Game", this.canvas.width / 2, 5 * this.ySize);
           

            c.textAlign = "left";


            this.renderTDMTeam(0);
            this.renderTDMTeam(1);
            if(this.totalTeams >= 3){
                this.renderTDMTeam(2);
            }
            if(this.totalTeams >= 4){
                this.renderTDMTeam(3);
            }


            


            this.renderDefaultFooter(0);

        }

        renderSmartCTF(){

            const c = this.context;
            
            //console.log("render");

            //header

            c.fillStyle = "yellow";

            c.textAlign = "center";

            c.font = (3 * this.ySize)+"px Arial";

            
            this.headerString = "Red wins the match!";
            if(this.matchInfo.t1score > this.matchInfo.t0score){
                this.headerString = "Blue wins the match!";
            }
            
            c.fillText(this.headerString, 50 * this.xSize, 5 * this.ySize);

            c.textAlign = "left";

            //red team
            this.renderTeamSmartCTF(c,0);
            //blueTeam
            this.renderTeamSmartCTF(c,1);


            this.renderFooter(c);
        }
    }

    window.onload = () =>{

        const s1 = new MatchScreenshot("m-sshot",_players,_match);

    }

    
}());