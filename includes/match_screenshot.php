<?php




class MatchScreenshot{

    private $gameName;
    private $mid;

    private $players;

    public function __construct($mid, $gameName){

        $this->mid = $mid;
        $this->gameName = $gameName;



        $this->getPlayerData();
        $this->addPlayerNames();
        $this->getMatchInfo();


        
        

    }


    private function displayStyle(){

        
    }


    public function display(){


        return $this->getJavascript().'<br><table class="box" id="ss-h" width="720"  border="0" padding="0">
            <tbody>
                <tr>
                    <td class="heading" align="center">
                        Match Screenshot
                    </td>
                </tr>
                <tr>
                    <td class="grey">
                        <canvas id="m-sshot" width="720px" height="540px">
                            Your browser doesn\'t support HTML5 canvas, upgrade to a browser that isn\'t 100 years old
                        </canvas>
                    </td>
                </tr>
                <tr class="grey2" align="center">
                    <td>
                        Click Image to enlarge
                    </td>
                </tr>
            </tbody>
        </table>';

    }

    private function addPlayerNames(){

        for($i = 0; $i < count($this->players); $i++){

           

            $id = preg_replace("&\D&i","",$this->players[$i]['pid']);

       
            $query = "SELECT `name` FROM `uts_pinfo` WHERE `id`=".$id;
            
     
            $stmt = mysql_query($query);

 

             while($d = mysql_fetch_array($stmt)){
                 $this->players[$i]['name'] = $d['name'];

             }
           
        }

    }

    private function getMatchInfo(){


        
        $query = "SELECT * FROM `uts_match` WHERE `id`=".$this->mid;

        if($stmt = mysql_query($query)){

            if($d = mysql_fetch_array($stmt, MYSQL_ASSOC)){
                $this->matchData = $d;

               // echo '<pre>';
                //print_r($this->matchData);
                //echo '</pre>';
            }
        }else{
            die("MYSQL error (getMatchInfo())");
        }
    }

    
    public function getJavascript(){


        return '<script type="text/javascript" src="match_screenshot.js"></script><script> const _players = '.json_encode($this->players).'; const _match = '.json_encode($this->matchData).'</script>';
    }


    private function getPlayerData(){


        $query = "SELECT * FROM `uts_player` WHERE `matchid`=".$this->mid." order by `gamescore` DESC";

        $stmt = mysql_query($query);

        while($d = mysql_fetch_array($stmt,MYSQL_ASSOC)){
            
            $this->players[] = $d;
        }


       /// echo '<pre>';
       // print_r($this->players);
       // echo '</pre>';

        
        
    }
}