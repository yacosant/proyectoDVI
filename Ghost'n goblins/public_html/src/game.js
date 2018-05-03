/*---------------------------CARGA DE QUINTUS---------------------------------*/
var SPRITE_NONE=0;
var SPRITE_DEFAULT=1;
var SPRITE_TILES = 2;
var SPRITE_ENEMY = 4;
var SPRITE_FLAG = 8;
var SPRITE_COIN = 16;
var SPRITE_SENSOR = 32;
var SPRITE_PLAYER = 64;
var SPRITE_BOWSER = 128;
var SPRITE_PRINCESS = 256;
var SPRITE_AXE = 512;
var SPRITE_BOWSER_SHOOT=1024;
var backMusic;
/* global Quintus */
var Q = window.Q = Quintus({ development:true,audioSupported: ['ogg','mp3'] })
                .include("Sprites, Scenes, Input, 2D, Anim,UI,TMX,Audio")//Librerias del quintus cargadas
                .setup({
                         width:   800,// Set the default width to 800 pixels
                         height:  600,// Set the default height to 600 pixels
                         upsampleWidth:  420,// Double the pixel density of the
                         upsampleHeight: 320,// game if the w or h is 420x320
                         downsampleWidth: 1024,// Halve the pixel density if resolution
                         downsampleHeight: 768// is larger than or equal to 1024x768
                })
                .controls()//Controles para PC
                .enableSound();//Habilita el uso de audio
//*-------------------------CARGA DE CONTENIDO--------------------------------*/
//Imagenes
Q.preload(["bg.png","bloopa.png","coin.png","empty.png","goomba.png","main_title.png","mario_small.png","piranha.png","princess.png","flag.png","bowser.png","bowser_fireball.png","axe.png"]);
//JSON'S (falta crear el de piranha.png)
Q.preload(["mario_small.json","coin.json","bloopa.json","goomba.json","bowser.json","bowser_fireball.json","axe.json"]);
//Musica
Q.preload(["music_main.ogg","music_underground.ogg","music_dungeon.ogg","music_time_low.ogg","music_win_game.ogg","music_game_over.ogg","jump_small.ogg","kill_enemy.ogg","music_die.ogg","hit_head.ogg","coin.ogg","music_level_complete.ogg","pause.ogg","down_pipe.ogg","its.ogg","bowser_fireball.ogg"]);
//Funcion de inicio
Q.preload(function(){
    //Compilacion del las sheets
    Q.compileSheets("tiles.png","tiles.json");
    Q.compileSheets("mario_small.png","mario_small.json");
    Q.compileSheets("bloopa.png","bloopa.json");
    Q.compileSheets("goomba.png","goomba.json");
    Q.compileSheets("coin.png","coin.json");
    Q.compileSheets("bowser.png","bowser.json");
    Q.compileSheets("bowser_fireball.png","bowser_fireball.json");
    Q.compileSheets("axe.png","axe.json");
    //Estado global de juego
    Q.state.set({ score: 0, lives: 4,coins:0,coins1Up:100, //Puntuaciones
                  pause:false,enJuego:false,//Estados del juego
                  valCoin:10,valEnemy:100,valBandera:600,valFinNivel:400,//Puntos por accion
                  world:1,level:1,maxWorld:1,worldtype:"main"//Control de niveles
    });
    //Controlador de la musica de fondo
    backMusic= new Q.backMusic();
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
            backMusic.playMusic();
            Q.stage().unpause();
            Q.stage(2).show();
            Q.clearStage(3);
        }else{
            Q.stage(2).show();
            Q.state.set("pause",true);
            Q.audio.stop();
            Q.audio.play('pause.ogg',{debounce:500});
            Q.stage().pause();
            Q.stageScene("pauseMessage",3);
        }
    }
  });
//Control musica principal
Q.Class.extend("backMusic", {
    playMusic:function(){
        switch (Q.state.get("worldtype")) {
            case "main":
                 Q.audio.play('music_main.ogg',{ loop:true});
                break;
            case "underground":
                 Q.audio.play('music_underground.ogg',{ loop:true});
                break;
            case "dungeon":
                 Q.audio.play('music_dungeon.ogg',{ loop:true});
                break;
            default:
                 Q.audio.play('music_main.ogg',{ loop:true});
                break;
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
      this.entity.p.vy = 100;
    },

    goUp: function(col) {
      this.entity.p.vy =-100;
    }
  });
//IA Mario
Q.component("aiMario",{
    added: function() {
      this.entity.on("bump.right,bump.left",this,"goRight");
    },
    goRight: function(col) {
      this.entity.p.vx = col.impact;
      if(this.entity.p.defaultDirection === 'left')
          this.entity.p.flip = 'x';
      else
          this.entity.p.flip = false;
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
//Animacion de Mario
Q.animations('Mario', {
  run_right: { frames: [0,1,2], rate: 1/5}, 
  run_left: { frames: [15,16,17], rate:1/5 },
  fire_right: { frames: [9,10,10], next: 'stand_right', rate: 1/30, trigger: "fired" },
  fire_left: { frames: [20,21,21], next: 'stand_left', rate: 1/30, trigger: "fired" },
  stand_right: { frames: [0], rate: 1 },
  stand_left: { frames: [14], rate: 1},
  fall_right: { frames: [2], loop: false },
  fall_left: { frames: [14], loop: false },
  jump_right: { frames: [3,4,6], rate: 1/2,loop: false},
  jump_left: { frames: [18,19,20,21], rate: 1/2,loop: false},
  die:{ frames: [12], rate: 1/8}
});
//Animacion del Bloopa
Q.animations('Bloopa', {
    bloopa: { frames: [0,1], rate: 1/2 },
    bloopaDie: { frames: [2,3], rate: 1/3},
    bloopaDieStop: { frames: [2], rate: 1}
});
//Animacion del goomba  
Q.animations('Goomba', {
    goomba: { frames: [0,1], rate: 1/3},
    goombaDie: { frames: [1,2,3], rate: 1/3},
    goombaDieStop: { frames: [3], rate: 1}
});
//Animacion de la moneda
Q.animations('Coin', {
    coin: { frames: [0,1,2], rate: 1/2}
});
//Animacion de Bowser
Q.animations('Bowser', {
  run_right: { frames: [0,1,2,3], rate: 1/5}, 
  run_left: { frames: [4,5,6,7], rate:1/5 },
  die:{ frames: [0], rate:1/5 }
});
//Animacion del disparo de Bowser
Q.animations('Bowser_fireball', {
  shoot: { frames: [0,1], rate: 1/5} 
});
//Animacion del hacha
Q.animations('Axe', {
  shine: { frames: [0,1,2,3], rate: 1/5} 
});
/*-------------------------------JUGADOR--------------------------------------*/
Q.Sprite.extend("Mario",{
    init:function(p) {
        this._super(p, {
            sheet:"marioR",
            sprite:"Mario",
            frame:0,
            suelo:true,
            agachado:false,
            bandera:false,
            auto:false,
            prisa:false,
            muerto:false,
            type:SPRITE_PLAYER
        });
        this.add("2d,animation,tween");
        this.add("levelManager");
        this.add("Timer");
        if(this.p.auto!==null){
            if(this.p.auto)
                this.add("aiBounce");
            else
                this.add("platformerControls");
        }
        this.on("bump.bottom",this,"stompB");
        this.on("bump.right",this,"stompR");
        this.on("bump.left",this,"stompL");
        this.on("bump.top",this,"stompT");
    },
    stompB:function(collision) {
        if(collision.obj.p.type===SPRITE_ENEMY) {
           collision.obj.muerte();
           this.p.vy = -300;// make the player jump
        }else if(collision.obj.p.type===SPRITE_COIN)
            collision.obj.cojer();
        else if(collision.obj.isA("TileLayer")){
            this.p.suelo=true;
            this.colMapa(collision,"Down");
        }
    },
    stompR:function(collision) {
        if(collision.obj.p.type===SPRITE_ENEMY) 
            this.muerte();
        else if(collision.obj.p.type===SPRITE_COIN)
            collision.obj.cojer();
        else if(collision.obj.isA("TileLayer"))
            this.colMapa(collision,"Right");
    },
    stompL:function(collision) {
        if(collision.obj.p.type===SPRITE_ENEMY) 
            this.muerte();
        else if(collision.obj.p.type===SPRITE_COIN)
            collision.obj.cojer();
        else if(collision.obj.isA("TileLayer"))
            this.colMapa(collision,"Left");
    },
    stompT:function(collision) {
        if(collision.obj.p.type===SPRITE_ENEMY) 
            this.muerte();
        else if(collision.obj.p.type===SPRITE_COIN)
            collision.obj.cojer();
        else if(collision.obj.isA("TileLayer"))
            this.colMapa(collision,"top");
    },
    step:function(dt){
        //Control del Timer
        if(!this.p.auto){
            this.Timer.step(dt);
            //Comprobamos el tiempo
            if(this.Timer.tiempoRest()<100 && !this.p.prisa)
                this.prisas();
            else if(this.Timer.tiempoRest()===0)
                this.muerte();
        }
        //salto
        if(this.p.suelo){
            if(Q.inputs['up']) {
                this.p.gravity=0.4;
                this.p.suelo=false;
                Q.audio.play('jump_small.ogg',{debounce:500});
            } 
        }
        if(!Q.inputs['up']){
            this.p.gravity=1;
        }
        //Agacharse
        if(Q.inputs['down'] && !this.p.agachado)
            this.p.agachado=true;
        if(!Q.inputs['down'])
            this.p.agachado=false;
        //animacion movimiento
        if(this.p.vx > 0) {
            if(this.p.suelo===true)
                this.play("run_right");
            else
                this.play("jump_right");
        } else if(this.p.vx < 0) {
            if(this.p.suelo===true)
                this.play("run_left");
            else
                this.play("jump_left");
        } else {
            if(this.p.direction ==="right")
                this.play("stand_right");
            else 
                this.play("stand_left");
        }
        //Fin animacion movimiento
        //limite inferior mapa
        if(this.p.y>this.p.limInfMapa){
            if(this.p.vx > 0)
                this.play("fall_right");
            else if(this.p.vx < 0)
                this.play("fall_left");
            this.muerte();
        }
    },
    muerte:function(){
        this.p.sheet="marioDie";
        if(!this.p.muerto){
            this.p.muerto=true;
            this.del("2d");
            Q.audio.stop();
            Q.state.dec("lives",1);
            if(Q.state.get("lives")===0){
                Q.audio.play("music_game_over.ogg");
                this.animate({y: this.p.y-50},0.5).chain({y: this.p.y+50},0.5,{
                    callback:function(){
                        this.destroy();
                        this.levelManager.loseScreen();
                    }
                });     
            }else{
                Q.audio.play('music_die.ogg');
                this.animate({y: this.p.y-50},0.3,Q.Easing.Linear).chain({y: this.p.y+100},0.5,{
                    callback:function(){
                        this.destroy();
                        this.levelManager.nextLevel();
                    }
                });     
            }  
        }
    },
    colMapa:function(collision,tipo){
        if(collision.tile === 37 && tipo==="top") { //caja llena
                collision.obj.setTile(collision.tileX,collision.tileY, 24); 
                Q.audio.play('hit_head.ogg');
                Q.audio.play('coin.ogg');
                Q.state.inc("score",Q.state.get("valCoin"));
        }else if((collision.tile === 24 ||collision.tile === 44) && tipo==="top") { //Caja vacia
            Q.audio.play('hit_head.ogg');
        }else if(collision.tile === 38 ||collision.tile === 45) { //Mastil de la bandera     
            //Eliminamos la colision contra el mastil (tile = 0 es empty)
            this.p.bandera=true;
            Q("Flag").each(function() {
                this.p.goDown=true;
            });
            Q.state.inc("score",Q.state.get("valFinNivel"));
            collision.obj.setTile(collision.tileX,15, 0);
            collision.obj.setTile(collision.tileX,14, 0);
            collision.obj.setTile(collision.tileX,13, 0);
            collision.obj.setTile(collision.tileX,12, 0);
            collision.obj.setTile(collision.tileX,11, 0);
            collision.obj.setTile(collision.tileX,10, 0);
            collision.obj.setTile(collision.tileX,9, 0);
            collision.obj.setTile(collision.tileX,8, 0);
            collision.obj.setTile(collision.tileX,7, 0);
            this.p.vx=80;
            if(!this.p.auto)
                this.movFin(); 
        }else if(collision.tile === 39 && this.p.bandera) { //puerta castillo
            this.levelManager.changeLevel();
            this.levelManager.nextLevel();
        }else if(collision.tile === 39 && this.p.auto) { //puerta castillo nextLevel
            this.del("aiBounce");
            this.levelManager.loadLevel();
        }else if((collision.tile === 49 || collision.tile === 50) && tipo==="Down" && this.p.agachado){//Boca tuberia vertical
            var bandera=Q("Sensor");
            var that=this;
            Q.audio.stop();
            Q.state.set("worldtype","underground");
            backMusic.playMusic();
            bandera.each(function() {
                that.goDown(this.p.destX,this.p.destY);
            });
        }else if(collision.tile === 5 || collision.tile === 12 && tipo==="Right"){//Boca tuberia horizontal
            var bandera=Q("Sensor");
            var that=this;
            Q.audio.stop();
            Q.state.set("worldtype","main");
            backMusic.playMusic();
            bandera.each(function() {
                that.goDown(this.p.orX,this.p.orY);
            });
        }else if(collision.tile ===56)//Lava de dugeon
            this.muerte();
    },
    movFin:function(){
        Q.audio.stop();
        Q.audio.play('music_level_complete.ogg',{debounce:10000});
        this.del("platformerControls");
        this.add("aiMario");
        this.p.vx=80;
    },
    goDown:function(destX,destY){
        Q.audio.play('down_pipe.ogg',{debounce:100});
        this.p.x=destX;
        this.p.y=destY;
    },
    prisas:function(){
        this.p.prisa=true;
        Q.audio.stop();
        Q.audio.play("music_time_low.ogg",{debounce:10000});
        backMusic.playMusic();
    }
});
/*---------------------------------PNJ----------------------------------------*/
Q.Sprite.extend("Princess",{
    init: function(p) { 
        this._super(p, { 
            asset: "princess.png",
            type: SPRITE_PRINCESS,
           collisionMask: SPRITE_PLAYER | SPRITE_DEFAULT
        }); 
        this.add("2d");
        this.add("levelManager");
        this.on("bump.left",this,"beso");
    },
    beso:function(collision){
        if(collision.obj.p.type===SPRITE_PLAYER){
            this.levelManager.changeLevel();
            this.levelManager.nextLevel();
        }
    }
});
/*-------------------------------ENEMIGOS-------------------------------------*/
//Bloopa
Q.Sprite.extend("Bloopa",{ 
    init: function(p) { 
        this._super(p, { 
            sheet: "bloopa",
            sprite:"Bloopa",
            frame: 0,
            vy:100,
            gravity:0,
            die: false,
            muerteCont: 0,
            type: SPRITE_ENEMY,
            collisionMask: SPRITE_PLAYER | SPRITE_DEFAULT
        }); 
        this.add("2d,aiBounce2,animation");
        this.play("bloopa");
    },
    muerte:function() {
      Q.audio.play('kill_enemy.ogg');
      Q.state.inc("score",Q.state.get("valEnemy"));
      this.play("bloopaDie");
      this.die=true;
      this.muerteCont=0;
      this.del("aiBounce2");
      this.p.type=SPRITE_DEFAULT; //asi si toca  amrio no perdemos.
    },
    step:function(){

        if(this.die) 
            this.muerteCont++;
        if(this.muerteCont===15) this.play("bloopaDieStop");
        else if(this.muerteCont===25)
            this.destroy();
    }
}); 
//Goomba
Q.Sprite.extend("Goomba",{ 
    init: function(p) { 
        this._super(p, { 
            vx:100,
            sheet: "goomba",
            sprite: "Goomba",
            frame: 4,
            die: false,
            muerteCont:0,
            type: SPRITE_ENEMY,
            collisionMask: SPRITE_PLAYER |SPRITE_DEFAULT
        }); 
        this.add("2d,aiBounce,animation");  
        this.play("goomba");      
    },
    muerte:function() {
        Q.audio.play('kill_enemy.ogg');
        Q.state.inc("score",Q.state.get("valEnemy"));
        this.play("goombaDie");
        this.die=true;
        this.muerteCont=0;
        this.vx=0;
        this.p.vx=0;
        this.del("aiBounce");
        this.p.type=SPRITE_DEFAULT; //asi si toca  amrio no perdemos.
      },
      step:function(){
          if(this.die) 
              this.muerteCont++;
          if(this.muerteCont===20) this.play("goombaDieStop");
          else if(this.muerteCont===25)
                  this.destroy();
      }
}); 
//Bowser
Q.Sprite.extend("Bowser",{ 
    init: function(p) { 
        this._super(p, { 
            vx:80,
            sheet: "bowserR",
            sprite: "Bowser",
            frame: 0,
            reload:0,
            timeReload:2,
            die: false,
            muerteCont:0,
            type: SPRITE_BOWSER,
            collisionMask: SPRITE_PLAYER | SPRITE_DEFAULT
        }); 
        this.add("2d,aiBounce,animation");  
        this.on("bump.top,bump.down,bump.left,bump.right","matar");
    },
    fire:function(){
        Q.audio.play("bowser_fireball.ogg");
        if(this.p.vx>0)
            Q.stage().insert(new Q.Bowsershoot({x:this.p.x+20,y:this.p.y-10,vx:250}));
        else
            Q.stage().insert(new Q.Bowsershoot({x:this.p.x-20,y:this.p.y-10,vx:-250}));
    },
    matar:function(collision){
        if(collision.obj.p.type===SPRITE_PLAYER) 
            collision.obj.muerte();
    },
    muerte:function() {
        this.play("die");
        this.destroy();
    },
    step:function(dt){
        this.p.reload+=dt;
        //Por defecto cada 1 segundo
        if(this.p.reload>this.p.timeReload){
            this.p.reload=0;
            this.fire();
        }
        if(this.p.vx>0)
            this.play("run_right");
        else
            this.play("run_left");
    }
}); 
/*------------------------------ELEMENTOS--------------------------------------*/
//Bandera
Q.Sprite.extend("Flag",{ 
    init: function(p) { 
        this._super(p, { 
            asset: "flag.png",
            type: SPRITE_FLAG,
            goDown:false,
            limInf:0,
            gravity:0,
            vy:0,
            collisionMask: SPRITE_PLAYER
        });
        this.add("2d");
        this.on("bump.top,bump.left,bump.down",this,"captura");
    },
    step:function(){
        if(this.p.goDown && this.p.y<this.p.limInf){
                this.p.y+=5;
        }   
    },
    captura:function(collision){
        this.del("2d");
        this.p.goDown=true;
        collision.obj.p.bandera=true;
        Q.state.inc("score",Q.state.get("valBandera"));
        collision.obj.movFin();
    }
});
//Monedas
Q.Sprite.extend("Coin",{
    init:function(p){
        this._super(p,{
            sheet: "coin",
            sprite:"Coin",
            frame: 0,
            gravity:0,
            vy:0,
            type: SPRITE_COIN,
            collisionMask: SPRITE_PLAYER
        });
        this.add("2d,animation");
        this.play("coin");
        
    },
    cojer: function(){
        Q.audio.play('coin.ogg');
        Q.state.inc("score",Q.state.get("valCoin"));
        Q.state.inc("coins",1);
        this.contarMonedas();
        this.destroy();
    },
    contarMonedas:function(){
        if( Q.state.get("coins")===Q.state.get("coins1Up")){
            Q.state.inc("lives",1);
            Q.state.set("coins",0);
        }
    }
});
//Sensor de posicion
Q.Sprite.extend("Sensor",{
    init:function(p){
        this._super(p,{
            asset:"empty.png",
            x:0,
            y:0,
            //Posiciones del punto de origen
            orX:0,
            orY:0,
            //Posiciones del punto de destino
            destX:0,
            destY:0,
            hidden:false,
            type: SPRITE_SENSOR
        }); 
        this.add("2d");
        this.on("bump.bottom",this,"stomp");
        this.p.gravity=0;
    },
    stomp: function(collision) {
      this.p.vy = 0; // make the player jump
  }
});
//Disparo de Bowser
Q.Sprite.extend("Bowsershoot",{ 
    init: function(p) { 
        this._super(p, { 
            sheet: "bowser_fireball",
            sprite:"Bowser_fireball",
            frame: 0,
            type: SPRITE_BOWSER_SHOOT,
            gravity:0,
            vy:0,
            collisionMask: SPRITE_PLAYER | SPRITE_DEFAULT | SPRITE_AXE
        });
        this.add("2d,aiBounce,animation");
        this.play("shoot");
        this.on("bump.right,bump.left,bump.top,bump.down",this,"hit");
    },
    hit:function(collision){
        if(collision.obj.p.type===SPRITE_PLAYER) 
            collision.obj.muerte();
        else
            this.destroy();
    }
});
//Hacha de mario
Q.Sprite.extend("Axe",{ 
    init: function(p) { 
        this._super(p, { 
            sheet: "axe",
            sprite:"Axe",
            frame: 0,
            type: SPRITE_AXE,
            gravity:0,
            vy:0,
            collisionMask: SPRITE_PLAYER
        });
        this.add("2d,aiBounce,animation");
        this.play("shine");
        this.on("bump.top",this,"take");
    },
    take:function(collision){
        if(collision.obj.p.type===SPRITE_PLAYER){
            collision.obj.movFin();
            this.destroy();
            Q("Bowser").first().muerte();
        }
    }
});
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
//Monedas
Q.UI.Text.extend("Coins",{
    init:function(p) {
        this._super({
            label: "monedas\n 0",    
            x: 300,
            y: 0,
            color:"#ffffff"
            });
        Q.state.on("change.coins",this,"coins");
    },
    coins:function(coins) {
        this.p.label = "monedas\n " + coins;
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
  container.insert(new Q.Coins());
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
    stage.insert(new Q.Mario({x:(3*34),y:13*34,limInfMapa:17*34,auto:true,vx:80}));
    Q.state.set({ score:0, lives:4,coins:0,level:1,world:1,pause:false,enJuego:false });
    //Musica principal del juego
    Q.input.on("confirm",this,function(){
            Q.audio.play('its.ogg');
            Q.loadTMX("world1level1.tmx", function() {
                Q.stageScene("HUD",2);
                Q.stageScene("W1L1");
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
//World 1 level 1
Q.scene("W1L1",function(stage) {
    var mario= new Q.Mario({x:(14*34)+17,y:(15*34)+17,limInfMapa:17*34});
    //Sprites a insertar en el mapa
    var levelAssets = [
        ["Flag", {x:(120*34)+1, y: (8*34)+17,limInf:(14*34)+14}],
        //Sensor de la tuberia a la cueva
        ["Sensor", {orX:53*34,orY:12*34,destX:(160*34)-17,destY:9*34}],
        //Enemigos
        ["Bloopa", {x: (68*34)+17, y: (13*34)+17}],
        ["Goomba", {x: (30*34)+17, y: (15*34)+17}],
        ["Goomba", {x: (50*34)+17, y: (15*34)+17}],
        ["Goomba", {x: (51*34)+17, y: (15*34)+17}],
        ["Goomba", {x: (54*34)+17, y: (15*34)+17}],
        ["Goomba", {x: (55*34)+17, y: (15*34)+17}],
        ["Goomba", {x: (84*34)+17, y: (15*34)+17}],
        ["Goomba", {x: (85*34)+17, y: (15*34)+17}],
        //Cueva del tesoro
        //Grupo arriba
                //fila 1
                ["Coin", {x: (162*34)+17, y: (7*34)+17}],
                ["Coin", {x: (163*34)+17, y: (7*34)+17}], 
                ["Coin", {x: (164*34)+17, y: (7*34)+17}], 
                ["Coin", {x: (165*34)+17, y: (7*34)+17}], 
                ["Coin", {x: (166*34)+17, y: (7*34)+17}], 
                ["Coin", {x: (167*34)+17, y: (7*34)+17}],
                //fila 2
                ["Coin", {x: (162*34)+17, y: (8*34)+17}],
                ["Coin", {x: (163*34)+17, y: (8*34)+17}], 
                ["Coin", {x: (164*34)+17, y: (8*34)+17}], 
                ["Coin", {x: (165*34)+17, y: (8*34)+17}], 
                ["Coin", {x: (166*34)+17, y: (8*34)+17}], 
                ["Coin", {x: (167*34)+17, y: (8*34)+17}],
                //fila 3
                ["Coin", {x: (162*34)+17, y: (9*34)+17}],
                ["Coin", {x: (163*34)+17, y: (9*34)+17}], 
                ["Coin", {x: (164*34)+17, y: (9*34)+17}], 
                ["Coin", {x: (165*34)+17, y: (9*34)+17}], 
                ["Coin", {x: (166*34)+17, y: (9*34)+17}], 
                ["Coin", {x: (167*34)+17, y: (9*34)+17}],
                //Grupo abajo
                //fila 1
                ["Coin", {x: (162*34)+17, y: (11*34)+17}],
                ["Coin", {x: (163*34)+17, y: (11*34)+17}], 
                ["Coin", {x: (164*34)+17, y: (11*34)+17}], 
                ["Coin", {x: (165*34)+17, y: (11*34)+17}], 
                ["Coin", {x: (166*34)+17, y: (11*34)+17}], 
                ["Coin", {x: (167*34)+17, y: (11*34)+17}],
                //fila 2
                ["Coin", {x: (162*34)+17, y: (12*34)+17}],
                ["Coin", {x: (163*34)+17, y: (12*34)+17}], 
                ["Coin", {x: (164*34)+17, y: (12*34)+17}], 
                ["Coin", {x: (165*34)+17, y: (12*34)+17}], 
                ["Coin", {x: (166*34)+17, y: (12*34)+17}], 
                ["Coin", {x: (167*34)+17, y: (12*34)+17}],
                //fila 3
                ["Coin", {x: (162*34)+17, y: (13*34)+17}],
                ["Coin", {x: (163*34)+17, y: (13*34)+17}], 
                ["Coin", {x: (164*34)+17, y: (13*34)+17}], 
                ["Coin", {x: (165*34)+17, y: (13*34)+17}], 
                ["Coin", {x: (166*34)+17, y: (13*34)+17}], 
                ["Coin", {x: (167*34)+17, y: (13*34)+17}]
    ];
    Q.state.set("enJuego",true);
    Q.audio.stop();
    Q.state.set("worldtype","main");
    backMusic.playMusic();
    //Cargamos el mapa
    Q.stageTMX("world1level1.tmx",stage);
    //Insertamos todos los sprites del nivel
    stage.loadAssets(levelAssets);
    //Insertamos a mario
    stage.insert(mario);
    stage.add("viewport").follow(mario,{x:true,y:false});
    stage.viewport.offsetY=240;
});
//World 1 level 2
Q.scene("W1L2",function(stage) {
    var mario= new Q.Mario({x:(15*34)-17,y:15*34,limInfMapa:17*34});
    //Sprites a insertar en el mapa
    var levelAssets = [
        ["Flag", {x:(160*34)+1, y: (8*34)+17,limInf:(14*34)+14}],
        //Sensor de la tuberia a la cueva
        //No hay
        //Enemigos
        ["Bloopa", {x: (34*34)+17, y: 13*34}],
        ["Bloopa", {x: (41*34)+17, y: 11*34}],
        ["Bloopa", {x: (81*34)+17, y: 12*34}],
        ["Bloopa", {x: (104*34)+17, y: 11*34}],
        ["Goomba", {x: (67*34)+17, y: (13*34)+17}],
        ["Goomba", {x: (74*34)+17, y: (13*34)+17}],
        //Monedas
        ["Coin", {x: (47*34)+17, y: (12*34)+17}],
        ["Coin", {x: (47*34)+17, y: (13*34)+17}],
        ["Coin", {x: (47*34)+17, y: (14*34)+17}],
        ["Coin", {x: (48*34)+17, y: (12*34)+17}],
        ["Coin", {x: (48*34)+17, y: (13*34)+17}],
        ["Coin", {x: (48*34)+17, y: (14*34)+17}],
        ["Coin", {x: (88*34)+17, y: (13*34)+17}],
        ["Coin", {x: (88*34)+17, y: (14*34)+17}]
    ];
    Q.state.set("enJuego",true);
    Q.audio.stop();
    Q.state.set("worldtype","main");
    backMusic.playMusic();
    //Cargamos el mapa
    Q.stageTMX("world1level2.tmx",stage);
    //Insertamos todos los sprites del nivel
    stage.loadAssets(levelAssets);
    //Insertamos a mario
    stage.insert(mario);
    stage.add("viewport").follow(mario,{x:true,y:false});
    stage.viewport.offsetY=100;
});
//World 1 level 3
Q.scene("W1L3",function(stage) {
    var mario= new Q.Mario({x:(15*34)-17,y:15*34,limInfMapa:17*34});
    //Sprites a insertar en el mapa
    var levelAssets = [
        ["Flag", {x:(218*34)+1, y: (8*34)+17,limInf:(14*34)+14}],
        //Sensor de entrada/salida de la cueva
        ["Sensor", {orX:195*34,orY:13*34,destX:(51*34)-17,destY:12*34}],
        //Enemigos
        ["Bloopa", {x: (84*34)+17, y: 15*34}],
        ["Bloopa", {x: (89*34)+17, y: 15*34}],
        ["Bloopa", {x: (114*34)+17, y: 15*34}],
        ["Bloopa", {x: (117*34)+17, y: 15*34}],
        ["Goomba", {x: (69*34)+17, y: 15*34,sheet: "goombaCave"}],
        ["Goomba", {x: (70*34)+17, y: 15*34,sheet: "goombaCave"}],
        ["Goomba", {x: (106*34)+17, y: 15*34,sheet: "goombaCave"}],
        ["Goomba", {x: (105*34)+17, y: 15*34,sheet: "goombaCave"}],
        ["Goomba", {x: (136*34)+17, y: 15*34,sheet: "goombaCave"}],
        ["Goomba", {x: (140*34)+17, y: 15*34,sheet: "goombaCave"}],
        ["Goomba", {x: (157*34)+17, y: 15*34,sheet: "goombaCave"}],
        //Monedas
        ["Coin", {x: (85*34)+17, y: (10*34)+17}],
        ["Coin", {x: (86*34)+17, y: (10*34)+17}],
        ["Coin", {x: (87*34)+17, y: (10*34)+17}],
        ["Coin", {x: (88*34)+17, y: (10*34)+17}],
        ["Coin", {x: (115*34)+17, y: (11*34)+17}],
        ["Coin", {x: (116*34)+17, y: (11*34)+17}],
        ["Coin", {x: (159*34)+17, y: (9*34)+17}],
        ["Coin", {x: (160*34)+17, y: (8*34)+17}],
        ["Coin", {x: (161*34)+17, y: (8*34)+17}],
        ["Coin", {x: (162*34)+17, y: (8*34)+17}],
        ["Coin", {x: (163*34)+17, y: (9*34)+17}]
    ];
    Q.state.set("enJuego",true);
    Q.audio.stop();
    Q.state.set("worldtype","main");
    backMusic.playMusic();
    //Cargamos el mapa
    Q.stageTMX("world1level3.tmx",stage);
    //Insertamos todos los sprites del nivel
    stage.loadAssets(levelAssets);
    //Insertamos a mario
    stage.insert(mario);
    stage.add("viewport").follow(mario,{x:true,y:false});
    stage.viewport.offsetY=240;
});
//World 1 level 4
Q.scene("W1L4",function(stage) {
    var mario= new Q.Mario({x:(15*34)-17,y:15*34,limInfMapa:17*34});
    //Sprites a insertar en el mapa
    var levelAssets = [
        //Hacha
        ["Axe", {x: (183*34)+17, y: (10*34)+17}],
        //Bowser
        ["Bowser", {x: (180*34)+17, y: 12*34}],
        //Princesa
        ["Princess", {x: (188*34)+17, y: (11*34)}],
        //Enemigos
        ["Bloopa", {x: (58*34)+17, y: 15*34}],
        ["Bloopa", {x: (63*34)+17, y: 15*34}],
        ["Bloopa", {x: (68*34)+17, y: 15*34}],
        ["Bloopa", {x: (73*34)+17, y: 15*34}],
        ["Goomba", {x: (33*34)+17, y: 15*34,sheet: "goombaCastle"}],
        ["Goomba", {x: (43*34)+17, y: 15*34,sheet: "goombaCastle"}],
        ["Goomba", {x: (123*34)+17, y: 15*34,sheet: "goombaCastle"}],
        ["Goomba", {x: (125*34)+17, y: 4*34,sheet: "goombaCastle"}],
        ["Goomba", {x: (131*34)+17, y: 15*34,sheet: "goombaCastle"}],
        ["Goomba", {x: (139*34)+17, y: 15*34,sheet: "goombaCastle"}],
        ["Goomba", {x: (146*34)+17, y: 15*34,sheet: "goombaCastle"}],
        //Monedas
        ["Coin", {x: (115*34)+17, y: (4*34)+17}],
        ["Coin", {x: (115*34)+17, y: (5*34)+17}],
        ["Coin", {x: (115*34)+17, y: (6*34)+17}],
        ["Coin", {x: (115*34)+17, y: (7*34)+17}],
        ["Coin", {x: (116*34)+17, y: (4*34)+17}],
        ["Coin", {x: (116*34)+17, y: (5*34)+17}],
        ["Coin", {x: (116*34)+17, y: (6*34)+17}],
        ["Coin", {x: (116*34)+17, y: (7*34)+17}],
        ["Coin", {x: (131*34)+17, y: (2*34)+17}],
        ["Coin", {x: (131*34)+17, y: (3*34)+17}],
        ["Coin", {x: (131*34)+17, y: (4*34)+17}],
        ["Coin", {x: (113*34)+17, y: (13*34)+17}],
        ["Coin", {x: (113*34)+17, y: (14*34)+17}],
        ["Coin", {x: (113*34)+17, y: (15*34)+17}],
        ["Coin", {x: (114*34)+17, y: (13*34)+17}],
        ["Coin", {x: (114*34)+17, y: (14*34)+17}],
        ["Coin", {x: (114*34)+17, y: (15*34)+17}],
        ["Coin", {x: (138*34)+17, y: (2*34)+17}],
        ["Coin", {x: (139*34)+17, y: (2*34)+17}],
        ["Coin", {x: (140*34)+17, y: (2*34)+17}],
        ["Coin", {x: (141*34)+17, y: (2*34)+17}],
        ["Coin", {x: (138*34)+17, y: (3*34)+17}],
        ["Coin", {x: (139*34)+17, y: (3*34)+17}],
        ["Coin", {x: (140*34)+17, y: (3*34)+17}],
        ["Coin", {x: (141*34)+17, y: (3*34)+17}],
        ["Coin", {x: (138*34)+17, y: (4*34)+17}],
        ["Coin", {x: (139*34)+17, y: (4*34)+17}],
        ["Coin", {x: (140*34)+17, y: (4*34)+17}],
        ["Coin", {x: (141*34)+17, y: (4*34)+17}]
    ];
    Q.state.set("enJuego",true);
    Q.audio.stop();
    Q.state.set("worldtype","dungeon");
    backMusic.playMusic();
    //Cargamos el mapa
    Q.stageTMX("world1level4.tmx",stage);
    //Insertamos todos los sprites del nivel
    stage.loadAssets(levelAssets);
    //Insertamos a mario
    stage.insert(mario);
    stage.add("viewport").follow(mario,{x:true,y:false});
    stage.viewport.offsetY=240;
});
