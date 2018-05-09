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
Q.preload(["main_title.png","ArthurV2.png","zombie.png","crow.png"]);
//JSON'S 
Q.preload(["ArthurV2.json", "zombie.json","crow.json"]);
//Musica
Q.preload([]);
//Funcion de inicio
Q.preload(function(){
    //Compilacion del las sheets
    Q.compileSheets("ArthurV2.png","ArthurV2.json");
    Q.compileSheets("zombie.png", "zombie.json");
    Q.compileSheets("crow.png", "crow.json");
    //Estado global de juego
    Q.state.set({ score: 0, lives: 4, //Puntuaciones
                  level:1,respX:0,respY:0, //Nivel y punto del respawn
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
    SPACE:"fire"
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
 //rebote en eje Y
Q.component('aiBounce2', {
    added: function() {
      this.entity.on("bump.top",this,"goDown");
      this.entity.on("bump.bottom",this,"goUp");
    },

    goDown: function(col) {
      this.entity.p.vy = 20;
    },

    goUp: function(col) {
      this.entity.p.vy =-20;
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
        if(Q.state.get("level")>1){
            this.winScreen();
        }else{
            Q.loadTMX("nextLevel.tmx", function() {
               Q.stageScene("nextLevelScreen",{label:"Level "+Q.state.get("level")});
           });
        }
    },
    loadLevel:function(){
        Q.loadTMX("level"+Q.state.get("level")+".tmx", function() {
           Q.stage(2).show();    
           Q.stageScene("L"+Q.state.get("level"));
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
//Animacion de Arthur
Q.animations('Arthur', {
    run_right: { frames: [0,1,2,3], rate: 1/5}, 
    run_left: { frames: [4,5,6,7], rate:1/5 },
    stand_right:{ frames: [2], rate:1 },
    stand_left:{ frames: [6], rate:1 },
    jump_right:{ frames: [8,9], rate:1/2,loop:false},
    jump_left:{ frames: [15,14], rate:1/2,loop:false},
    jump_site_right:{ frames: [11], rate:1 },
    jump_site_left:{ frames: [12], rate:1 },
    duck_right:{frames: [10], rate:1},
    duck_left:{frames: [13], rate:1},
    shoot_right:{frames: [16,17], rate:1/5,loop:false},
    shoot_left:{frames: [23,22], rate:1/5,loop:false},
    shoot_duck_right:{frames: [18,19], rate:1/5,loop:false},
    shoot_duck_left:{frames: [21,20], rate:1/5,loop:false}  
});
//Animacion del Crow
Q.animations('Crow', {
    crow: { frames: [0,1,2,3], next: 'crowFly', rate: 1/8},
    crowFly: { frames: [4,5,6,7], rate: 1/4}
});
//Animacion del zombie  
Q.animations('Zombie', {
    zombie: { frames: [7,8,9], rate: 1/3},
    zombieBorn: { frames: [0,1,2,3,4,5,6,7,8,9], next: 'zombie', trigger:"camina", rate: 1/2},
    zombieBye: { frames: [6,5,4,3,2,1,0],   next: 'zombie', trigger:"muerte", rate: 1/3}
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
});
//Animacion del disparo
Q.animations('Burst', {
  burst: { frames: [0,1,2,3], rate: 1/5} 
});
//Animacion de a princesa
Q.animations('Princess', {
    princess: { frames: [0,1,2,3], rate: 1/5} 
});

/*-------------------------------JUGADOR--------------------------------------*/
Q.Sprite.extend("Arthur",{
    init:function(p) {
        this._super(p, {
            sheet:"arthurArmo",
            sprite:"Arthur",
            frame:0,
            auto:false,
            shootDelay:1,//En segundos
            shoot:0,
            type:SPRITE_PLAYER,
            collisionMask: SPRITE_DEFAULT
        });
        this.add("2d,animation,tween");
        this.add("levelManager");
        //this.add("Timer");
        this.p.jumpSpeed=-500;
        if(this.p.auto!==null){
            if(this.p.auto)
                this.add("aiBounce");
            else
                this.add("platformerControls");
        }
    },
    step:function(dt){
        var prop=this.p;
        prop.shoot+=dt;
        //Aumentamos el tiempo sin disparar
        this.animacion(prop);
        if(Q.inputs["fire"] && prop.shoot>prop.shootDelay)
            this.fire(prop);
    },
    animacion:function(prop){
        if(Q.inputs["down"]){
            if(Q.inputs["left"] || Q.inputs["right"])
                prop.speed=0;
            else
                prop.speed=200;
            if(this.p.direction ==="right"){
                if(Q.inputs["fire"])
                    this.play("shoot_duck_right");
                else
                    this.play("duck_right");
            }else{
                if(Q.inputs["fire"])
                    this.play("shoot_duck_left");
                else
                    this.play("duck_left");
           }
        }else if(!Q.inputs["down"]){
            if(Q.inputs["fire"]){
                prop.speed=0;
                if(this.p.direction ==="right")
                    this.play("shoot_right");
                else
                    this.play("shoot_left");
            }else{
                prop.speed=200;
                if(prop.vx>0){
                    if(prop.vy<0)
                        this.play("jump_right");
                    else
                        this.play("run_right");
                } else if(prop.vx<0) {
                    if(prop.vy<0)
                        this.play("jump_left");
                    else
                        this.play("run_left");
                }else{
                    if(this.p.direction ==="right"){
                        if(prop.vy<0)
                            this.play("jump_site_right");
                        else
                            this.play("stand_right");
                    }else{
                        if(prop.vy<0)
                            this.play("jump_site_left");
                        else
                            this.play("stand_left");
                    }
                }
            }
        }
    },
    fire:function(prop){
        prop.shoot=0;
        if(prop.sheet==="arthurNude")
            prop.sheet="arthurArmo";
        else
            prop.sheet="arthurNude";
    },
    hit:function(prop){
        if(prop.sheet==="arthurArmo"){
            this.animate({x: this.p.x-50},0.5); 
            prop.sheet="arthurNude";
        }else
            this.muerte();
    },
    muerte:function(){
        Q.state.dec("lives",1);
        if(Q.state.get("lives")>0)
            this.levelManager.loadLevel();
    }
});
/*---------------------------------PNJ----------------------------------------*/

/*-------------------------------ENEMIGOS-------------------------------------*/
//Zombie
Q.Sprite.extend("Zombie",{ 
    init: function(p) { 
        this._super(p, { 
            vx:0,
            sheet: "zombie",
            sprite: "Zombie",
            frame: 0,
            flip: "x",
            reload:0,
            timeReload:3,
            type: SPRITE_ENEMY,
            collisionMask: SPRITE_PLAYER | SPRITE_DEFAULT
        }); 
        this.add("2d,aiBounce,animation");  
        this.on("bump.top,bump.down,bump.left,bump.right","matar");
        this.on("camina","camina");
        this.on("muerte","muerte");
        this.play("zombieBorn");
    },
    matar:function(collision){
        if(collision.obj.p.type===SPRITE_PLAYER) 
            collision.obj.hit(collision.obj.p);
        else if(collision.tile === 40){
            this.play("zombieBye");
            this.p.vx=0;
        }
            
    },
    muerte:function() {
        this.destroy();
    },
    step:function(dt){
        if(this.p.vx<0)this.p.flip=false;
        else this.p.flip='x';
    },

    camina:function(){
        this.p. vx=80;
    }
}); 

//Crow
Q.Sprite.extend("Crow",{ 
    init: function(p) { 
        this._super(p, { 
            vx:50,
            vy:15,
            gravity: 0,
            reload:0,
            timeReload:5,
            sheet: "crow",
            sprite: "Crow",
            frame: 0,
            flip: "x",
            reload:0,
            timeReload:3,
            type: SPRITE_ENEMY,
            collisionMask: SPRITE_PLAYER | SPRITE_DEFAULT
        }); 
        this.add("2d,aiBounce,aiBounce2,animation");  
        this.on("bump.top,bump.down,bump.left,bump.right","matar");
        this.play("crow");
    },
    matar:function(collision){
        if(collision.obj.p.type===SPRITE_PLAYER) 
            collision.obj.hit(collision.obj.p);
    },
    muerte:function() {
        this.destroy();
    },
    step:function(dt){
        this.p.reload+=dt;

        if(this.p.reload>this.p.timeReload){
            this.p.reload=0;
            if(this.p.flip==='x'){
                this.p.flip=false;
                this.p.vx=-50;
            }
            else{
                this.p.flip='x';
                this.p.vx=50;
            } 
        }
        
        
    }
}); 
/*------------------------------ELEMENTOS--------------------------------------*/

  
/*----------------------------------HUD---------------------------------------*/
//Puntuacion
Q.UI.Text.extend("Score",{
    init:function(p) {
        this._super({
            label: "Puntos\n 0",    
            x: 200,
            y: 0,
            color:"#ffffff"
            });
        Q.state.on("change.score",this,"score");
    },
    score:function(score) {
        this.p.label = "Puntos\n " + score;
    }
});
//vidas
Q.UI.Text.extend("Lives",{
    init:function(p) {
        this._super({
            label: "vidas\n 4",    
            x: 400,
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
            x: 600,
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
        Q.loadTMX("level1.tmx", function() {
            Q.stageScene("HUD",2);
            Q.stageScene("L1");
            Q.input.off("confirm");
        });
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
    Q.state.set("enJuego",true);
    if(Q.state.get("respX")===0 && Q.state.get("respY")===0){
        Q.state.set("respX",(14*32)-16);
        Q.state.set("respY",15*32);
    }
    var arthur= new Q.Arthur({x:Q.state.get("respX"),y:Q.state.get("respY"),limInfMapa:17*32});
    Q.stageTMX("level1.tmx",stage);
    //Insertamos a Sir Arthur
    stage.insert(arthur);
    stage.insert(new Q.Zombie({x:(16*32)-17,y:12*32}));
    stage.insert(new Q.Crow({x:(16*32)-17,y:8*32}));
    stage.add("viewport").follow(arthur,{x:true,y:false});
});
/*----------------------------------TESTING-----------------------------------*/
Q.scene("testing",function(stage) {
    var arthur= new Q.Arthur({x:(14*32)-17,y:8*32,limInfMapa:17*34});
    Q.stageTMX("testing.tmx",stage);
    //Insertamos a Sir Arthur
    stage.insert(arthur);
    stage.insert(new Q.Zombie({x:(16*32)-17,y:12*32}));
    stage.insert(new Q.Crow({x:(16*32)-17,y:8*32}));
    stage.add("viewport").follow(arthur,{x:true,y:false});
    //stage.viewport.offsetY=-100;
});
