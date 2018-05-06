/*---------------------------CARGA DE QUINTUS---------------------------------*/
var SPRITE_NONE=0;
var SPRITE_DEFAULT=1;
var SPRITE_TILES = 2;
var SPRITE_ENEMY = 4;
var SPRITE_PLAYER = 8;
var backMusic;
/* global Quintus */
var Q = window.Q = Quintus({ development:true,audioSupported: ['ogg','mp3'] })
                .include("Sprites, Scenes, Input, 2D, Anim,UI,TMX,Audio")//Librerias del quintus cargadas
                .setup({
                         width:   800,// Set the default width to 800 pixels
                         height:  600// Set the default height to 600 pixels
                })
                .controls()//Controles para PC
                .enableSound();//Habilita el uso de audio
//*-------------------------CARGA DE CONTENIDO--------------------------------*/
//Imagenes
Q.preload(["main_title.png"]);
//JSON'S 
Q.preload([]);
//Musica
Q.preload([]);
//Funcion de inicio
Q.preload(function(){
    //Compilacion del las sheets

    //Estado global de juego
    Q.state.set({ score: 0, lives: 4, //Puntuaciones
                  level:1,world:1,
                  pause:false,enJuego:false
                });
    //Controlador de la musica de fondo
    //backMusic= new Q.backMusic();
    //Carga del menu principal
    Q.loadTMX("mainMenu.tmx", function() {
        Q.stageScene("initScreen");
    });
});
/*-----------------------------COMPONENTES------------------------------------*/
//Asignacion de teclas
Q.input.keyboardControls({
    P: "pausa",
    X:"",
    SPACE:"up"
});
//Modo de pausa del juego
Q.input.on("pausa",function() {
    if(Q.state.get("enJuego")){
        if(Q.state.get("pause")) {
            Q.state.set("pause",false);
            Q.stage().unpause();
            Q.stage(2).show();
            Q.clearStage(3);
        }else{
            Q.stage(2).show();
            Q.state.set("pause",true);
            Q.audio.stop();
            Q.stage().pause();
            Q.stageScene("pauseMessage",3);
        }
    }
  });
//Control musica principal
Q.Class.extend("backMusic", {
    playMusic:function(){
    }
});
//Gestor de niveles
Q.component("levelManager",{
    changeLevel:function(){
        if(Q.state.get("level")===4){
                Q.state.inc("world",1);
                Q.state.set("level",1);
        }else
            Q.state.inc("level",1);
    },
    winScreen:function(){ 
        Q.loadTMX("finalscreen.tmx", function() {
            Q.stageScene("winScreen",{label:"Has ganado!"});
        });
    },
    loseScreen:function(){
        Q.loadTMX("endGame.tmx", function() {
            Q.stageScene("loseScreen",{label:"Game Over \n Pulsa enter para volver al menu principal"});
        });
    },
    nextLevel:function(){
        if(Q.state.get("world")>Q.state.get("maxWorld")){
            this.winScreen();
        }else{
            Q.loadTMX("nextLevel.tmx", function() {
               Q.stageScene("nextLevelScreen",{label:"World "+Q.state.get("world")+" Level "+Q.state.get("level")});
           });
        }
    },
    loadLevel:function(){
        Q.loadTMX("world"+Q.state.get("world")+"level"+Q.state.get("level")+".tmx", function() {
           Q.stage(2).show();    
           Q.stageScene("W"+Q.state.get("world")+"L"+Q.state.get("level"));
       });
    }
});
//Temporizador
Q.component("Timer",{
    added:function() {
      var props = this.entity.p; 
      Q._defaults(props,{
        cont:0,
        maxTime:300,
        segDesc:1,
        descuento:1
      });
      Q.state.set("timer",props.maxTime);
    },
    step:function(dt){
        var prop = this.entity.p;
        prop.cont+=dt;
        //Por defecto cada 1 segundo
        if(prop.cont>prop.segDesc){
            prop.cont=0;
            Q.state.dec("timer",prop.descuento);
        }
    },
    tiempoRest:function (){
            return Q.state.get("timer");
    }
});
/*-----------------------------ANIMACIONES------------------------------------*/
//Animacion del Crow
Q.animations('Crow', {
    crow: { frames: [0,1,2,3], rate: 1/2 },
    crowFly: { frames: [4,5,6,7], rate: 1/3}
});

//Animacion del zombie  
Q.animations('Zombie', {
    zombie: { frames: [7,8,9], rate: 1/3},
    zombieBorn: { frames: [0,1,2,3,4,5,6], rate: 1/3}
});

//Animacion de la bullet
Q.animations('Bullet', {
    bullet: { frames: [0,1,2,3], rate: 1/2}
});

//Animacion de Devil
Q.animations('Devil', {
  devil: { frames: [0,1,2], rate: 1/5}, 
  devilHide: { frames: [4,5], rate:1/2 },
  devilFly: { frames: [4], rate:1/2 },
  devilPrincess:{ frames: [6], rate:1/2 }
});

//Animacion de la planta
Q.animations('Plant', {
    plant: { frames: [0,1,2,3,4], rate: 1/2}
})

//Animacion del disparo
Q.animations('Burst', {
  burst: { frames: [0,1,2,3], rate: 1/5} 
});

//Animacion de a princesa
Q.animations('Princess', {
    princess: { frames: [0,1,2,3], rate: 1/5} 
});

/*-------------------------------JUGADOR--------------------------------------*/

/*---------------------------------PNJ----------------------------------------*/

/*-------------------------------ENEMIGOS-------------------------------------*/

/*------------------------------ELEMENTOS--------------------------------------*/

/*----------------------------------HUD---------------------------------------*/
//Puntuacion
Q.UI.Text.extend("Score",{
    init:function(p) {
        this._super({
            label: "Mario\n 0",    
            x: 100,
            y: 0,
            color:"#ffffff"
            });
        Q.state.on("change.score",this,"score");
    },
    score:function(score) {
        this.p.label = "Mario\n " + score;
    }
});
//vidas
Q.UI.Text.extend("Lives",{
    init:function(p) {
        this._super({
            label: "vidas\n 4",    
            x: 500,
            y: 0,
            color:"#ffffff"
            });
        Q.state.on("change.lives",this,"lives");
    },
    lives:function(lives) {
        this.p.label = "vidas\n " + lives;
    }
});
//Temporizador
Q.UI.Text.extend("Timer",{
    init:function(p) {
        this._super({
            label: "Tiempo\n 300",    
            x: 700,
            y: 0,
            color:"#ffffff"
            });
        Q.state.on("change.timer",this,"timer");
    },
    timer:function(time) {
        this.p.label = "Tiempo\n " + time;
    }
});
//Escena del HUD
Q.scene('HUD',function(stage) {
  var container = stage.insert(new Q.UI.Container({x:0, y: 1, fill: "rgba(0,0,0,1)"}));
  container.insert(new Q.Score());
  container.insert(new Q.Lives());
  container.insert(new Q.Timer());
  container.fit(5,200);
  stage.show= function(){
      if(this.hidden)
          this.hidden=false;
      else
          this.hidden=true;
  };
});
/*------------------------------ESCENAS BASE----------------------------------*/
//Pantalla de inicio
Q.scene("initScreen",function(stage){
    Q.state.set("enJuego",false);
    Q.stageTMX("mainMenu.tmx",stage);
    stage.insert(new Q.UI.Text({x:Q.width/2, y: (Q.height/3)*2-80,size:32,color: "#ffffff",label: "Pulsa enter para empezar" }));
    stage.insert(new Q.UI.Button({asset:"main_title.png",x:Q.width/2, y: (Q.height/3)}));
    Q.state.set({ score:0, lives:4,level:1,world:1,pause:false,enJuego:false });
    //Musica principal del juego
    Q.input.on("confirm",this,function(){
        //Testing
        Q.loadTMX("testing.tmx", function() {
                Q.stageScene("testing");
                Q.input.off("confirm");
            });
        //Bueno
        /*Q.loadTMX("level1.tmx", function() {
            Q.stageScene("HUD",2);
            Q.stageScene("L1");
            Q.input.off("confirm");
        });*/
    });
});
//Pantalla de perdido
Q.scene("loseScreen",function(stage){
    Q.stage(2).show();
    Q.state.set("enJuego",false);
    Q.stageTMX("endGame.tmx",stage);
    stage.insert(new Q.UI.Text({x:Q.width/2, y: Q.height/2-100,size:32,color: "#ffffff",label: stage.options.label }));
    stage.insert(new Q.Goomba({x:(1*34),y:13*34,vx:80}));
    stage.insert(new Q.Goomba({x:(23*34),y:13*34,vx:-80}));
    Q.input.on("confirm",this,function(){
        Q.loadTMX("mainMenu.tmx", function() {
            Q.stageScene("initScreen");
        });
    });
});
//Pantalla de ganado
Q.scene("winScreen",function(stage){
    Q.stage(2).show();
    Q.state.set("enJuego",false);
    Q.stageTMX("finalscreen.tmx",stage);
    Q.audio.stop();
    Q.audio.play("music_win_game.ogg");
    var container = stage.insert(new Q.UI.Container({x: Q.width/2, y: Q.height/5, fill: "rgba(66,66,66,0.8)"}));        
    container.insert(new Q.UI.Text({x:0, y: 10,color:"#ffffff",label:"Has ganado!"}));
    container.insert(new Q.UI.Text({x:0, y: 50,color:"#ffffff",label:"Autores"}));
    container.insert(new Q.UI.Text({x:0, y: 80,color:"#ffffff",label:"Jose Luis Sánchez Gárcia"}));
    container.insert(new Q.UI.Text({x:0, y: 110,color:"#ffffff",label:"Yaco Alejandro Santiago Pérez"}));
    container.insert(new Q.UI.Text({x:0, y: 200,color:"#ffffff",label:"Dedicado a Shigeru Miyamoto"}));
    container.fit(20);
    stage.insert(new Q.Mario({x:(11*34)+17,y:(15*34)+17,auto:null,vx:0}));
    stage.insert(new Q.Princess({x:(12*34)+17,y:(15*34)+17}));
});
//Pantalla de siguiente nivel
Q.scene("nextLevelScreen",function(stage){
    Q.stage(2).show();
    Q.state.set("enJuego",false);
    Q.stageTMX("nextLevel.tmx",stage);
    stage.insert(new Q.UI.Text({x:Q.width/2, y: Q.height/2-100,size:32,color: "#ffffff",label: stage.options.label }));
    stage.insert(new Q.Mario({x:(1*34),y:13*34,limInfMapa:17*34,auto:true,vx:140}));
});
//Mensaje de juego pausado
Q.scene('pauseMessage',function(stage) {
  var container = stage.insert(new Q.UI.Container({x: Q.width/2, y: Q.height/2, fill: "rgba(66,66,66,0.5)"}));        
  container.insert(new Q.UI.Text({x:0, y: 10,color:"#ffffff",label:"Juego pausado"}));
  // Expand the container to visibily fit it's contents
  // (with a padding of 20 pixels)
  container.fit(20);
});
/*----------------------------------NIVELES-----------------------------------*/ 
/*Posicion de un objeto en el mapa
    * y= (numTileY*TamTile) + [tamTile/2]
    * x= (numTileX*TamTile) + [tamTile/2]
*/
//level 1
Q.scene("L1",function(stage) {
    
});
/*----------------------------------TESTING-----------------------------------*/
Q.scene("testing",function(stage) {
    Q.stageTMX("testing.tmx",stage);
});
