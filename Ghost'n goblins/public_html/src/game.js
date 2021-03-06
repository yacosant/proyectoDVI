/* global Quintus, WebFont */
window.addEventListener("load",function() {
/*---------------------------CARGA DE QUINTUS---------------------------------*/
// global Quintus
var Q = window.Q = Quintus({ development:true,audioSupported: ['ogg','mp3'] })
                .include("Sprites, Scenes, Input, 2D, Anim,UI,TMX,Audio")//Librerias del quintus cargadas
                .setup({
                         width:   800,// Set the default width to 800 pixels
                         height:  600// Set the default height to 600 pixels
                })
                .controls()//Controles para PC
                .enableSound();//Habilita el uso de audio
//Mascaras de colision
Q.SPRITE_NONE=0;
Q.SPRITE_ENEMY = 4;
Q.SPRITE_PLAYER = 8;
Q.SPRITE_LANZA = 16;
Q.SPRITE_TUMBA = 32;
Q.SPRITE_PREMIO = 64;
Q.SPRITE_ANTORCHA = 128;
Q.SPRITE_DAGA = 256;
Q.SPRITE_EXPLOSION = 512;
Q.SPRITE_CRUZ=1024;
Q.SPRITE_PUERTA=2048;
Q.SPRITE_HACHA=4096;
Q.SPRITE_SPARKMAGO=8192;
//Colores Interfaz
Q.COLOR_RED="#ff0066";
Q.COLOR_BLUE="#88ffff";
Q.COLOR_YELLOW="#eecc00";
Q.COLOR_WHITE="#eeeedd";
Q.COLOR_LIGHT_RED="#ff8888";
//Fuente
Q.FONT_FAMILY="ghost";
Q.FONT_SIZE_SMALL=18;
Q.FONT_SIZE_MEDIUM=24;
Q.FONT_SIZE_LARGE=32;
//Top score
Q.TOPSCORE=0;
//*-------------------------CARGA DE CONTENIDO--------------------------------*/
//Imagenes
Q.preload(["main_title.png","ArthurV2.png","cuchilloMov.png","lanzaMov.png","antorchaMov.png","armour.png","zombie.png","crow.png","princess.png","burst.png", "spark.png","lance.png","plant.png", "grave0.png", "grave1.png", "grave2.png", "jar.png","marker.png","devil.png","bullet.png","shuriken.png","antorcha.png","movingPlatform.png","antorcha.png","cuchillo.png","fire.png","1up.png","items.png","cross.png","door.png", "lanceHUD.png", "cuadro.png", "cuchilloHUD.png", "antorchaHUD.png", "ghost.png", "ghostLance.png", "armorGhost.png","mago.png", "axe.png", "axeHUD.png", "axeMov.png", "live.png","movPlatUpDown.png"]);
//JSON'S 
Q.preload(["ArthurV2.json", "cuchilloMov.json", "lanzaMov.json","antorchaMov.json", "zombie.json","crow.json", "princess.json","burst.json", "spark.json","plant.json","devil.json","fire.json","bullet.json","shuriken.json","antorcha.json", "items.json","cross.json","door.json","ghost.json","armorGhost.json", "axeMov.json", "axe.json","mago.json"]);
//Musica
Q.preload(["level_1-2_theme.ogg","level_1-2_theme_boss.ogg",//back music
           "level_3-4_theme.ogg","level_3-4_theme_boss.ogg",
           "level_5-6_theme.ogg","level_5-6_theme_boss.ogg",
           "level_7_theme.ogg",
           "gngEndTheme.ogg","gameover.ogg","timer.ogg","insertCoin.ogg","endLevel.ogg",//General
           "arthurRow.ogg","die.ogg","jumpEnd.ogg","jumpStart.ogg","putArmour.ogg","removeArmour.ogg",//Arthur
           "burst.ogg","hitGrave.ogg","doorOpen.ogg","lance.ogg","torch.ogg","treasurePickUp.ogg","weaponPickUp.ogg","extraLife.ogg","frogerizer.ogg",//Efectos sonoros
           "enemyHit.ogg","bossHit.ogg","bossDeath.ogg","zombieBorn.ogg","crow.ogg","crowDie.ogg"//Enemigos
       ]);
//Funcion de inicio
Q.preload(function(){
    //var element = document.getElementById("loading_progress");
    //element.style.display = "none";
    //Compilacion del las sheets
    Q.compileSheets("ArthurV2.png","ArthurV2.json");
    //Enemigos
    Q.compileSheets("zombie.png", "zombie.json");
    Q.compileSheets("crow.png", "crow.json");
    Q.compileSheets("devil.png", "devil.json");
    Q.compileSheets("plant.png", "plant.json");
    Q.compileSheets("ghost.png", "ghost.json");
    Q.compileSheets("armorGhost.png", "armorGhost.json");
    Q.compileSheets("mago.png", "mago.json");
    //PNJ
    Q.compileSheets("princess.png", "princess.json");
    //Efectos
    Q.compileSheets("burst.png", "burst.json");
    Q.compileSheets("spark.png", "spark.json");
    Q.compileSheets("fire.png", "fire.json");
    //Proyectiles
    Q.compileSheets("antorcha.png", "antorcha.json");
    Q.compileSheets("axe.png", "axe.json");
    Q.compileSheets("bullet.png", "bullet.json");
    Q.compileSheets("shuriken.png", "shuriken.json");
    //Objetos
    Q.compileSheets("antorchaMov.png", "antorchaMov.json");
    Q.compileSheets("lanzaMov.png", "lanzaMov.json");
    Q.compileSheets("cuchilloMov.png", "cuchilloMov.json");
    Q.compileSheets("axeMov.png", "axeMov.json");
    Q.compileSheets("items.png","items.json");
    Q.compileSheets("cross.png","cross.json");
    Q.compileSheets("door.png","door.json");
/*-----------------------------ANIMACIONES------------------------------------*/
    //Animacion de Arthur
    Q.animations('Arthur', {
        //Movimiento basico
        run_right: { frames: [0,1,2,3], rate: 1/5}, 
        run_left: { frames: [4,5,6,7], rate:1/5 },
        stand_right:{ frames: [2], rate:1 },
        stand_left:{ frames: [6], rate:1 },
        //Salto
        jump_right:{ frames: [8,9], rate:1/3,loop:false},
        jump_left:{ frames: [15,14], rate:1/3,loop:false},
        jump_site_right:{ frames: [11], rate:1 },
        jump_site_left:{ frames: [12], rate:1 },
        //Agachado
        duck_right:{frames: [0], rate:1},
        duck_left:{frames: [1], rate:1},
        //Disparo
        shoot_right:{frames: [16,17], rate:1/5,loop:false},
        shoot_left:{frames: [23,22], rate:1/5,loop:false},
        shoot_duck_right:{frames: [2,3], rate:1/5,loop:false},
        shoot_duck_left:{frames: [5,4], rate:1/5,loop:false},
        //Muerte
        dieArthurRight:{frames:[1,2,3,8,9,10],rate:1/3,next: '',trigger:"dead",loop:false},
        dieArthurLeft:{frames:[6,5,4,8,9,10],rate:1/3,next: '',trigger:"dead",loop:false},
        //Trepar
        arthurClimb:{frames:[24,27],rate:1/3,loop:true},
        arthurClimbEnd:{frames:[25,26],rate:1/2,next: 'stand_right',loop:false},
        //Aux
        arthurVago:{frames:[12],rate:1},
        arthurWinner:{frames:[11],rate:1},
        //Rana
        arthurFrogRight:{frames:[0,1,2,3],rate:1/5},
        arthurFrogLeft:{frames:[7,6,5,4],rate:1/5},
        arthurFrogStandRight:{frames:[3],rate:1},
        arthurFrogStandLeft:{frames:[4],rate:1},
        arthurFrogJumpRight:{frames:[1],rate:1/5},
        arthurFrogJumpLeft:{frames:[6],rate:1/5},
        //Destruccion de la armadura
        destroyArmoRight:{frames:[0,1,2,3],rate:1/3,next: '',trigger:"nude",loop:false},
        destroyArmoLeft:{frames:[7,6,5,4],rate:1/3,next: '',trigger:"nude",loop:false}
    });
    //Animacion del Crow
    Q.animations('Crow', {
        crow: { frames: [0,1,2,3], next: 'crowFly', rate: 1/8},
        crowFly: { frames: [4,5,6,7], rate: 1/4}
    });
    //Animacion del zombie  
    Q.animations('Zombie', {
        zombie: { frames: [7,8,9], rate: 1/3},
        zombieBorn: { frames: [0,1,2,3,4,5,6,7,8], next: 'zombie', trigger:"camina", rate: 1/5},
        zombieBye: { frames: [6,5,4,3,2,1,0],   next: 'zombie', trigger:"bye", rate: 1/3}
    });
    //Animacion de la bullet
    Q.animations('Bullet', {
        bullet: { frames: [0,1,2,3], rate: 1/5}
    });
    //Animacion de Devil
    Q.animations('Devil', {
      devil: { frames: [0,1,2], rate: 1/8}, 
      devilHide: { frames: [4], rate:1/4 },
      devilFly: { frames: [3], rate:1/2 },
      devilPrincess:{ frames: [6], rate:1/2 }
    });
    //Animacion de la planta
    Q.animations('Plant', {
        plant: { frames: [0,1,2], rate: 1/5},
        plantL: { frames: [3,4], rate: 1/5}
    });
    //Animacion de ghost
    Q.animations('Ghost', {
        ghost: { frames: [0,1], rate:1/3}, 
        ghostAtack: { frames: [2], next: 'ghost', rate:1/2},
        ghostHide: { frames: [4,6,7,8], next: 'ghost',rate:1/5}
    });
    //Animacion de ghost con armadura
    Q.animations('ArmorGhost', {
        armorGhost: { frames: [0,1,2,3], rate:1/3, loop: true}
    });
    //Animacion de la sangre
    Q.animations('Burst', {
      burst: { frames: [0,1,2,3], next: 'burst', trigger:"muerte", rate: 1/5} 
    });
    //Animacion del fuego
    Q.animations('Fire', {
      burning: { frames: [0,1,2,3], rate: 1/5,loop:true} 
    });
    //Animacion de las chispas
    Q.animations('Spark', {
        spark: { frames: [0,1,2], next: 'spark', trigger:"muerte", rate: 1/5},
        sparkMago: { frames: [0,1,2],rate: 1/5} 
    });
    //Animacion de a princesa
    Q.animations('Princess', {
        princess: { frames: [0,1,2,3], rate: 1/5} 
    });
    //Animacion giro antorcha
    Q.animations('Torch', {
      girarIzq: { frames: [0,1,2,3,4,5,6,7], rate: 1/10, loop:true},
      girarDer: { frames: [7,6,5,4,3,2,1,0], rate: 1/10, loop:true} 
    });
    //Animacion giro antorcha
    Q.animations('Axe', {
      girarIzq: { frames: [0,1,2,3,4,5,6,7], rate: 1/8, loop:true},
      girarDer: { frames: [7,6,5,4,3,2,1,0], rate: 1/8, loop:true} 
    });
    //Animacion de los objetos de tipo arma
    Q.animations('WeaponObj', {
      shine: { frames: [0,1,2,3],rate: 1/2,loop:true} 
    });
    //Animacion de los objetos de tipo arma
    Q.animations('Shuriken', {
        shuriken: { frames: [0,1],rate: 1/5,loop:true} 
    });
    //Animacion de los premios
    Q.animations('Premio', {
        shine: { frames: [0,1],rate: 1/5,loop:true} 
    });
    //Animacion de la cruz
    Q.animations('Cross', {
        shine: { frames: [0,1,2,3],rate: 1/5,loop:true} 
    });
    //Animacion de la puerta
    Q.animations('Door', {
        open: { frames: [0,1,2],rate: 1/2,next: '',trigger:"opened",loop:false} 
    });
    //Animacion mago
    Q.animations('Mago',{
        "mago":{frames: [0],rate: 1},
        "magoOpen":{frames: [0],trigger:"return", next:'mago',rate: 1}
    });
    /*------------------------------------------------------------------------*/
    //Cojer topScore del localStorage
    if( window.localStorage.getItem("GnGTopScore"))
        Q.TOPSCORE=window.localStorage.getItem("GnGTopScore");
    else{
        window.localStorage.setItem("GnGTopScore",0);
    }
    //Estado global de juego
    Q.state.set({ score: 0, topScore:Number(Q.TOPSCORE), lives: 3,maxLives:5, //Puntuaciones
                  armaArthur: "lanza",
                  level:1,maxLevel:4, //Nivel
                  pause:false,enJuego:false
                });
    //Controlador de la musica de fondo
    backMusic= new Q.backMusic();
    //Carga del menu principal
    Q.loadTMX("mainMenu.tmx", function() {
        Q.stageScene("initScreen");
    },{
    progressCallback: function(loaded,total) {
        var element = document.getElementById("loading_progress");
        var canvas = document.getElementById("quintus");
        element.style.width = Math.floor(loaded/total*100) + "%";
        if (loaded === total) {
            document.getElementById("loading").remove();
            canvas.style.display="block";
            canvas.focus();
        }
    }
  });
});
/*-----------------------------COMPONENTES------------------------------------*/
//Asignacion de teclas
Q.input.keyboardControls({
    P: "pausa",
    SPACE:"fire",
    //Trucos:Activar solo en caso de corbardia
//    ONE:"arma1",
//    TWO:"arma2",
//    THREE:"arma3",
//    FOUR:"arma4",
//    FIVE:"armor",
//    SIX:"vida",
//    X:"frog"
});
//Trucos
Q.input.on("arma1",function() {
    if(Q.state.get("enJuego")){
        var art = Q("Player").first();
        Q.stage().insert(new Q.ObjLanza({x:art.p.x+32,y:art.p.y-32}));
    }
});
Q.input.on("arma2",function() {
    if(Q.state.get("enJuego")){
        var art = Q("Player").first();
        Q.stage().insert(new Q.ObjDaga({x:art.p.x+32,y:art.p.y-32}));
    }
});
Q.input.on("arma3",function() {
    if(Q.state.get("enJuego")){
        var art = Q("Player").first();
        Q.stage().insert(new Q.ObjAntorcha({x:art.p.x+32,y:art.p.y-32}));
    }
});
Q.input.on("arma4",function() {
    if(Q.state.get("enJuego")){
        var art = Q("Player").first();
        Q.stage().insert(new Q.ObjHacha({x:art.p.x+32,y:art.p.y-32}));
    }
});
Q.input.on("armor",function() {
    if(Q.state.get("enJuego")){
        var art = Q("Player").first();
        Q.stage().insert(new Q.ObjArmadura({x:art.p.x+32,y:art.p.y-32}));
    }
});
Q.input.on("vida",function() {
    if(Q.state.get("enJuego")){
        var art = Q("Player").first();
        Q.stage().insert(new Q.Vida({x:art.p.x+32,y:art.p.y-32}));
    }
});
Q.input.on("frog",function() {
    if(Q.state.get("enJuego")){
        var art = Q("Player").first();
        art.itsAFrog();
    }
});
//Modo de pausa del juego
Q.input.on("pausa",function() {
    if(Q.state.get("enJuego")){
        if(Q.state.get("pause")) {
            backMusic.playMusic();
            Q.state.set("pause",false);
            Q.stage().unpause();
            Q.stage(2).show(false);
            Q.stage(3).show(false);
            Q.clearStage(4);
        }else{
            Q.audio.stop();
            Q.stage(2).show(true);
            Q.stage(3).show(true);
            Q.state.set("pause",true);
            Q.audio.stop();
            Q.stage().pause();
            Q.stageScene("pauseMessage",4);
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
//IA plataforma UpDown
Q.component('aiPlatUpDown', {
  added: function() {
    Q._defaults(this.entity.p,{
      top:0
    });
    this.entity.on("bump.bottom",this,"goUp");
    this.entity.on("step",this,"moving");
  },
  setOptions:function(top){
        this.entity.p.top=top;
  },
  goUp: function(col) {
    this.entity.p.vy =-100;
    this.entity.p.dir="up";
  },
  moving:function(){
    var y=this.entity.p.y +(this.entity.p.h/2);
    if(this.entity.p.top>0 && y-this.entity.p.h<this.entity.p.top){
        this.entity.p.vy = 100;
        this.entity.p.dir="down";
    }
  }
});
Q.component("aiBounceDevil",{
    added: function() {
      Q._defaults(this.entity.p,{
        ground:0,
        top:0,
        limitLeft:0,
        limitRight:0
      });
      this.entity.on("bump.top",this,"goDown");
      this.entity.on("bump.bottom",this,"goUp");
      this.entity.on("bump.left",this,"goLeft");
      this.entity.on("bump.right",this,"goRight");
      this.entity.on("step",this,"moving");
    },
    setLimits:function(limits){
        this.entity.p.ground=limits.ground;
        this.entity.p.top=limits.top;
        this.entity.p.limitLeft=limits.left;
        this.entity.p.limiRight=limits.right;
    },
    goDown: function(col) {
       this.entity.p.vy = 200;
    },    
    goUp: function(col) {
      this.entity.p.vy = -200;
    },
     goLeft: function(col) {
      this.entity.p.vx = -200 ;
    },    
    goRight: function(col) {
      this.entity.p.vx = 200 ;
    },
    moving:function(){
        var x=this.entity.p.x +(this.entity.p.w/2);
        var y=this.entity.p.y +(this.entity.p.h/2);
        if(this.entity.p.ground>0 && y>this.entity.p.ground)
            this.entity.p.vy = -200;
        if(this.entity.p.top>0 && y-this.entity.p.h<this.entity.p.top)
            this.entity.p.vy = 200;
        if(this.entity.p.limitLeft>0 && x<this.entity.p.limitLeft)
            this.entity.p.vx = 200;
        if(this.entity.p.limiRight>0 && x-this.entity.p.w>this.entity.p.limiRight)
            this.entity.p.vx = -200;
    }
});
//Control musica principal
Q.Class.extend("backMusic", {
    playMusic:function(boss){
        Q.audio.stop();
        const lvl=Q.state.get("level");
        if(lvl===1 || lvl===2){
            if(!boss)
                Q.audio.play("level_1-2_theme.ogg",{loop:true});
            else
                Q.audio.play("level_1-2_theme_boss.ogg",{loop:true});
        }else if(lvl===3 || lvl===4){
            if(!boss)
                Q.audio.play("level_3-4_theme.ogg",{loop:true});
            else
                Q.audio.play("level_3-4_theme_boss.ogg",{loop:true});
        }else if(lvl===5 || lvl===6){
            if(!boss)
                Q.audio.play("level_5-6_theme.ogg",{loop:true});
            else
                Q.audio.play("level_5-6_theme_boss.ogg",{loop:true});
        }else
            Q.audio.play("level_7_theme.ogg",{loop:true});
    }
});
//Gestor de niveles
Q.component("levelManager",{
    extend:{
        changeLevel:function(){
                Q.state.inc("level",1);
        },
        winScreen:function(){
            Q.stage(2).show(true);
            Q.stage(3).show(true);
            Q.loadTMX("finalScreen.tmx", function() {
                Q.stageScene("winScreen",{label:"Has ganado!"});
            });
        },
        loseScreen:function(){
            Q.stage(2).show(true);
            Q.stage(3).show(true);
            Q.loadTMX("loseScreen.tmx", function() {
                Q.stageScene("loseScreen");
            });
        },
        mapScreen:function(){
            Q.stage(2).show(true);
            Q.stage(3).show(true);
            if(Q.state.get("level")>Q.state.get("maxLevel")){
                this.winScreen();
            }else{
                Q.loadTMX("mapScreen.tmx", function() {
                   Q.stageScene("mapScreen");
               });
            }
        },
        loadLevel:function(){
            var lvl=Q.state.get("level");
            if(lvl%2===0)
                lvl-=1;
            Q.loadTMX("stage"+lvl+".tmx", function() {
                if(Q.stageScene("HUD",2))
                   Q.stage(2).show();
                else
                   Q.stageScene("HUD",2);
               
                if(Q.stageScene("HUD2",3))
                   Q.stage(3).show();
                else
                   Q.stageScene("HUD2",3);
               Q.stageScene("L"+lvl,Q("Player").first());
            });
        }
    }
});
//Temporizador
Q.component("Timer",{
    added:function() {
      var props = this.entity.p; 
      Q._defaults(props,{
        cont:0,
        maxMin: 2,
        maxTime:30,
        segDesc:1,
        descuento:1,
        prisa:false,
        stopTimer:false
      });

      Q.state.set("timerM",props.maxMin);     
      Q.state.set("timer",props.maxTime);

    },
    step:function(dt){
        var prop = this.entity.p;
        prop.cont+=dt;
        //Por defecto cada 1 segundo
        if(!prop.stopTimer){
            if(prop.cont>prop.segDesc){
                prop.cont=0;
                Q.state.dec("timer",prop.descuento);
                if(Q.state.get("timer") === 0){
                    Q.state.dec("timerM",prop.descuento);  
                    Q.state.set("timer",59);
                }
            }
        }
    },
    tiempoRest:function (){
            var mint = Q.state.get("timerM");
            var segd = Q.state.get("timer");
            var tiempoTotal = (mint * 60) + segd;
            return tiempoTotal;
    }
});
//Generador de recompensas
Q.component("GeneradorPremios", {
    extend: {
        generar: function(x,y){
            var listaPremios = [{sheet: "busto", puntos: 200}, {sheet: "busto2", puntos: 400}];
            var maxPremios = listaPremios.length - 1;
            var randomNumber = Math.floor(Math.random() * (40 - 0) + 0);
            if(randomNumber <= 5){
                var randomPremio = Math.floor(Math.random() * (2 - 0) + 0);
                Q.stage().insert(new Q.Premio({x: x, y: y, sheet: listaPremios[randomPremio].sheet, puntos: listaPremios[randomPremio].puntos}));
            }else if(randomNumber > 5 && randomNumber <=7){
                if(Q.state.get("armaArthur") !== "antorcha"){
                    Q.stage().insert(new Q.ObjAntorcha({x: x, y: y}));
                }
            }
            else if(randomNumber > 7 && randomNumber <=9){
                if(Q.state.get("armaArthur") !== "lanza"){
                     Q.stage().insert(new Q.ObjLanza({x: x, y: y}));
                }
            }else if(randomNumber === 10){
                if(Q.state.get("armaArthur") !== "daga"){
                      Q.stage().insert(new Q.ObjDaga({x: x, y: y}));
                }
            }else if(randomNumber === 11){
               
                Q.stage().insert(new Q.ObjArmadura({x: x, y: y}));
                
            }else if(randomNumber === 12){
               
                Q.stage().insert(new Q.Vida({x: x, y: y}));
                
            }else if(randomNumber === 13){
                if(Q.state.get("armaArthur") !== "hacha"){
                      Q.stage().insert(new Q.ObjHacha({x: x, y: y}));
                }
            }
        }
    }
});
/*-------------------------------JUGADOR--------------------------------------*/
Q.Sprite.extend("Player",{
    init:function(p) {
        this._super(p, {
            sheet:"arthurArmo",
            sprite:"Arthur",
            frame:0,
            type:Q.SPRITE_PLAYER,//Colisiones
            collisionMask: Q.SPRITE_DEFAULT,
            muerto:false,//Estados
            victoria:false,
            frog:false,
            hit:false,
            jump:false,
            ArmoDestroy:false,
            jumpSpeed:-450,//Salto
            armaEquipada: "lanza", //Armamento
            shootDelay:0.3,//Disparo
            shoot:0,
            shootRange:1500,
            frogTime:0,//Echizado
            frogMaxTime:5,
            stateFrog:"",
            onLadder: false,//Escaleras
            ladderX:0,
            ladderTile:0,
            respawnPoints:[{x:0,y:0},//respawn
                           {x:(16*32)+16,y:(21*32)+16},//stage 1 point 1
                           {x:(132*32)+16,y:(21*32)+16},//stage 1 point 2 132x
                           {x:(18*32)+16,y:(94*32)+16},//stage 2 point 1 18px
                           {x:(221*32)+16,y:(94*32)+16}//stage 2 point 2  221px
                          ]
            
        });
        //add's
        this.add("2d,animation,tween,platformerControls");
        this.add("levelManager");
        this.add("Timer");
        //Posicion de salida
        this.p.x=this.p.respawnPoints[Q.state.get("level")].x;
        this.p.y=this.p.respawnPoints[Q.state.get("level")].y;
        //Triggers
        this.on("sensor.tile","subirEscalera");
        this.on("bump.bottom",this,"colMapa");
        this.on("dead",this,"respawn");
        this.on("nude",this,"armoDestroyed");
        this.on("bump.bottom",this,"colMapa");
    },
    subirEscalera: function(colObj){
        if(colObj.p.ladder && !this.p.muerto) { 
            this.p.onLadder = true;
            this.p.ladderX = colObj.p.x-18;
            this.p.ladderTile=colObj.tile;
        }      
    },
    step:function(dt){
        var xA = this.p.x;
        var yA = this.p.y;

        this.p.shoot+=dt; //Aumentamos el tiempo sin disparar
        this.Timer.step(dt);
        //Comprobamos el tiempo
        if(this.Timer.tiempoRest()<60 && !this.p.prisa)
            this.prisas();
        else if(this.Timer.tiempoRest()<=0)                    
            this.muerto();
        //Controlamos el paso por el punto de respawn
        var level=Q.state.get("level");
        if(level%2!==0 && this.p.x>this.p.respawnPoints[level+1].x && !this.p.victoria){
            Q.audio.play("insertCoin.ogg");
            Q.state.inc("level",1);
        }
        //No pisamos una escalera
        if(!this.p.onLadder)
            this.p.gravity=1;
        //Control de animacion
        if(!this.p.muerto){
            if(this.p.hit){
                this.animArmo();
            }else if(this.p.frog){
                this.p.jumpSpeed=-550;
                this.frogerizado(dt);//Animacion  
            }else if(this.p.onLadder){
                this.animEscalera();
                this.p.onLadder = false;
            }else{
                this.p.jumpSpeed=-450;
                this.animBase();//Animacion
            }
        }
        if(Q.inputs["fire"] && this.p.shoot>this.p.shootDelay && !this.p.frog && !this.p.muerto){
            this.fire();
        } 
    },
    animBase:function(){
        if(Q.inputs["down"]){
            if(this.p.sheet==="arthurArmo" || this.p.sheet==="arthurNude")
                this.sheet(this.p.sheet+"Duck",true);
            if(Q.inputs["left"] || Q.inputs["right"])
                this.p.speed=0;
            else
                this.p.speed=200;
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
            this.sheet(this.p.sheet.slice(0,10),true);
            if(Q.inputs["fire"]){
                this.p.speed=0;
                if(this.p.direction ==="right")
                    this.play("shoot_right");
                else
                    this.play("shoot_left");
            }else{
                this.p.speed=200;
                if(this.p.vx>0){
                    if(this.p.vy!==0 && !this.p.jump){
                        this.p.jump=true;
                        Q.audio.play("jumpStart.ogg",{debounce:1000});
                        this.play("jump_right");
                    }else if(!this.p.jump)
                        this.play("run_right");
                } else if(this.p.vx<0) {
                    if(this.p.vy!==0 && !this.p.jump){
                        this.p.jump=true;
                        Q.audio.play("jumpStart.ogg",{debounce:1000});
                        this.play("jump_left");
                    }else if(!this.p.jump)
                        this.play("run_left");
                }else{
                    if(this.p.direction ==="right"){
                        if(this.p.vy<0){
                            this.p.jump=true;
                            Q.audio.play("jumpStart.ogg",{debounce:1000});
                            this.play("jump_site_right");
                        }else
                            this.play("stand_right");
                    }else{
                        if(this.p.vy<0){
                            this.p.jump=true;
                            Q.audio.play("jumpStart.ogg",{debounce:1000});
                            this.play("jump_site_left");
                        }else
                            this.play("stand_left");
                    }
                }
            }
        }
    },
    animFrog:function(){
        if(this.p.sheet!=="arthurFrog")
            this.sheet("arthurFrog",true);
        if(this.p.vx>0)
            if(this.p.vy!==0)
                this.play("arthurFrogJumpRight");
            else
                this.play("arthurFrogRight");
        else if(this.p.vx<0)
            if(this.p.vy!==0)
                this.play("arthurFrogJumpLeft");
            else
                this.play("arthurFrogLeft");
        else{
            if(this.p.direction==="right")
                this.play("arthurFrogStandRight");
            else
                this.play("arthurFrogStandLeft");
        }
    },
    animArmo:function(){
        if(this.p.sheet!=="armoDest")
            this.sheet("armoDest",true);
        if(!this.p.ArmoDestroy){
            this.p.ArmoDestroy=true;
            this.p.frame=0;
            if(this.p.direction==="right")
                this.play("destroyArmoRight",3,0);
            else
                this.play("destroyArmoLeft",3,0);
        }
        if(this.p.frame===3)
            this.armoDestroyed();
    },
    animEscalera:function(){
        this.p.gravity = 0;
        if(Q.inputs['up']) {
          this.p.vy = -this.p.speed;
          this.p.x = this.p.ladderX;
          if(this.p.ladderTile===8 ||this.p.ladderTile===9)
            this.play("arthurClimbEnd");
          else
            this.play("arthurClimb");
        } else if(Q.inputs['down']) {
          this.p.vy = this.p.speed;
          this.p.x = this.p.ladderX;
          this.play("arthurClimb");
        } else {
            this.p.vy = 0;
            this.animBase();
        }
    },
    colMapa:function(collision){
        if(this.p.jump){
            Q.audio.play("jumpEnd.ogg");
            this.p.jump=false;
        }
        const level=Q.state.get("level");
        if((level===1 || level===2) && collision.tile === 91 && !this.p.muerto)
            this.muerto();
        else if( (level===3 || level===4) && collision.tile === 7 && !this.p.muerto)
            this.muerto();
    },
    fire:function(){
        if(Q.state.get("armaArthur") === "lanza"){
            this.p.shoot=0;
            var vel=400;
            var mano=this.p.h/2;
            var conf=(this.p.direction ==="right")?{x:this.p.x+mano,y:this.p.y,vx:vel,distance:this.p.shootRange+this.p.x}:{x:this.p.x+mano,y:this.p.y,vx:-vel,distance:this.p.shootRange+this.p.x};
            Q.stage().insert(new Q.Lanza(conf));
        }else if(Q.state.get("armaArthur") === "antorcha"){    
            this.p.shoot=0;
            var vel=200;
            var mano=this.p.h/2;
            var conf=(this.p.direction ==="right")?{x:this.p.x+mano,y:this.p.y,vx:vel,vy:-50,ax:0,ay:70,direction:this.p.direction}:{x:this.p.x+mano,y:this.p.y,vy:-50,vx:-vel,ax:0,ay:70,direction:this.p.direction};
            Q.stage().insert(new Q.Antorcha(conf));
        }else if(Q.state.get("armaArthur") === "daga"){    
            this.p.shoot=0;
            var vel=800;
            var mano=this.p.h/2;
            var conf=(this.p.direction ==="right")?{x:this.p.x+mano,y:this.p.y,vx:vel,distance:this.p.shootRange+this.p.x}:{x:this.p.x+mano,y:this.p.y,vx:-vel,distance:this.p.shootRange+this.p.x};
            Q.stage().insert(new Q.Daga(conf));
        }else if(Q.state.get("armaArthur") === "hacha"){    
            this.p.shoot=0;
            var vel=300;
            var mano=this.p.h/2;
            var conf=(this.p.direction ==="right")?{x:this.p.x+mano,y:this.p.y,vx:vel,vy:-50,ax:0,ay:70,direction:"right"}:{x:this.p.x+mano,y:this.p.y,vy:-50,vx:-vel,ax:0,ay:70,direction:"left"};
            Q.stage().insert(new Q.Hacha(conf));
        }
    },
    hit:function(col){
        if(!this.p.hit){
            var ac=(this.p.vy>0)? {x: this.p.x-70,y:this.p.y-50}:{x: this.p.x-50};
            this.del("platformerControls");
            if(this.p.sheet==="arthurArmo" || this.p.sheet==="arthurArmoDuck"){
                this.p.hit=true;
                Q.audio.play("removeArmour.ogg");
                this.p.x -= col.separate[0];
                this.p.y -= col.separate[1];
                this.animate(ac,0.3);  
            }else if(this.p.sheet==="arthurNude" || this.p.sheet==="arthurNudeDuck" ||this.p.sheet==="arthurFrog")
                this.muerto();
        }
    },
    muerto:function(){
        if(!this.p.muerto){
            this.p.muerto=true;
            Q.state.set("armaArthur","lanza");
            this.p.stopTimer=true;
            this.p.vx=0;
            this.p.type= Q.SPRITE_NONE;
            this.off("bump.bottom");
            this.del("platformerControls,2d");
            Q.audio.stop();
            Q.audio.play("die.ogg");
            this.p.sheet="arthurDie";
            if(this.p.direction ==="right")
                        this.play("dieArthurRight");
                    else
                        this.play("dieArthurLeft");
        }
    },
    respawn:function(){
        this.destroy();
        Q.state.dec("lives",1); 
        if( Q.state.get("lives")>0)
            this.mapScreen();
        else
            this.loseScreen();
    },
    prisas:function(){
        Q.audio.play("timer.ogg");
        this.p.prisa=true;
    },
    itsAFrog:function(){
        if(!this.p.frog && !this.p.muerto && !this.p.hit){
            this.p.frog=true;
            this.p.speed=200;
            this.p.stateFrog=this.p.sheet;
            Q.audio.play("frogerizer.ogg");
        }
    },
    frogerizado:function(dt){
        if(this.p.frogTime>=this.p.frogMaxTime){
            this.p.frog=false;
            this.sheet(this.p.stateFrog,true);
            this.p.frogTime=0;
            Q.audio.play("frogerizer.ogg");
        }else{
            this.p.frogTime+=dt;
            this.animFrog();
        }
    },
    armoDestroyed:function(){
        this.sheet("arthurNude",true);
        this.add("platformerControls");
        this.p.hit=false;
    },
    win:function(){
        this.p.x-=1;
        this.p.victoria=true;
        Q.state.set("armaArthur","lanza");
        this.del("platformerControls");
        this.p.vx=0;
    }
});
/*---------------------------------PNJ----------------------------------------*/
//Princess
Q.Sprite.extend("Princess",{ 
    init: function(p) { 
        this._super(p, { 
            vx:0,
            sheet: "princess",
            sprite: "Princess",
            frame: 0,
            type: Q.SPRITE_DEFAULT
        }); 
        this.play("princess");
    }
}); 
/*-------------------------------ENEMIGOS-------------------------------------*/
//Zombie
Q.Sprite.extend("Zombie",{ 
    init: function(p) { 
        this._super(p, { 
            vx:0,
            sheet: "zombie",
            sprite: "Zombie",
            frame: 0,
            flip: false,
            reload:0,
            activo:false,
            timeReload:3,
            life:30,
            hidden:true,
            type: Q.SPRITE_ENEMY,
            collisionMask: Q.SPRITE_PLAYER | Q.SPRITE_DEFAULT 
        }); 
        this.add("2d,animation,GeneradorPremios");  
        this.on("bump.top,bump.bottom,bump.left,bump.right","matar");
        this.on("camina","camina");
        this.on("bye","bye");
    },
    matar:function(collision){
        if(collision.obj.p.type===Q.SPRITE_PLAYER) 
            collision.obj.hit(collision);
       else if(collision.obj.p.type===Q.SPRITE_TUMBA){
           this.play("zombieBye");
           this.p.vx=0;
        }else if(collision.tile === 91 || collision.tile === 7)
            this.destroy();
    },
    hit: function(damage){
        this.p.life-=damage;
        if(this.p.life<=0) this.muerte();
    },
    muerte:function() {
        this.generar(this.p.x,this.p.y); 
        this.destroy();
    },
    step:function(dt){
        var art = Q("Player").first();
        if(!this.p.activo && art!==undefined && art.p.x+(10*32)>this.p.x){
            this.p.hidden=false;
            this.p.activo=true;
            this.add("aiBounce");
            this.play("zombieBorn");
            this.p.vx=-80;
        }
        if(this.p.activo && art!==undefined){
            if(art.p.vx!==0 && art.p.x<this.p.x) this.p.vx=-80;
            else if(art.p.vx!==0) this.p.vx=80;
            
            if(this.p.vx <0)  this.p.flip=false;
            else this.p.flip='x';
        }      
        
        
    },
    camina:function(){
        Q.audio.play("zombieBorn.ogg");
    },
    bye:function(){
        this.destroy();
    }
}); 
//Crow
Q.Sprite.extend("Crow",{ 
    init: function(p) { 
        this._super(p, { 
            vx:0,
            vy:0,
            gravity: 0,
            reload:0,
            timeReload:5,
            sheet: "crow",
            sprite: "Crow",
            activo: false,
            frame: 0,
            flip: "x",
            life:60,
            type: Q.SPRITE_ENEMY,
            collisionMask: Q.SPRITE_PLAYER | Q.SPRITE_DEFAULT
        }); 
        this.add("2d,animation,GeneradorPremios");  
        this.on("bump.top,bump.bottom,bump.left,bump.right","matar");
    },
    matar:function(collision){
        if(collision.obj.p.type===Q.SPRITE_PLAYER) 
            collision.obj.hit(collision);
    },
    hit: function(damage){
        this.p.life-=damage;
        if(this.p.life<=0) this.muerte();
    },
    muerte:function() {
        this.generar(this.p.x,this.p.y); 
        Q.audio.play("crowDie.ogg");
        this.destroy();
    },
    step:function(dt){
        var art = Q("Player").first();
        if(!this.p.activo && art!==undefined && art.p.x+(12*32)>this.p.x){
            this.p.activo=true;
            this.add("aiBounce, aiBounce2");
            this.play("crow");
            this.p.vx=50;
            this.p.vy=15;
        }
        if(this.p.activo && art!==undefined){
            this.p.reload+=dt;

            if(this.p.reload>this.p.timeReload){
                this.p.reload=0;
                Q.audio.play("crow.ogg");
                if(this.p.flip==='x'){
                    this.p.flip=false;
                    this.p.vx=-50;
                }
                else{
                    this.p.flip='x';
                    this.p.vx=50;
                } 
            }else{
                if(art.p.vx!==0 && art.p.x<this.p.x)this.p.vx=-60;
                else if(art.p.vx!==0)this.p.vx=60;
                     
                if(this.p.vx <0)  this.p.flip=false;
                else this.p.flip='x';
            }
        }   
    }
}); 
//Planta
Q.Sprite.extend("Plant",{ 
    init: function(p) { 
        this._super(p, { 
            vx:0,
            sheet: "plant",
            sprite: "Plant",
            lengua: false,
            activo:false,
            frame: 0,
            reload:0,
            timeReload:3,
            shootRange:1500,
            life:30,
            type: Q.SPRITE_ENEMY,
            collisionMask: Q.SPRITE_PLAYER | Q.SPRITE_DEFAULT
        }); 
        this.add("2d,animation,GeneradorPremios");  
        this.on("bump.top,bump.bottom,bump.left,bump.right","matar");
        this.play("plant");
    },
    matar:function(collision){
        if(collision.obj.p.type===Q.SPRITE_PLAYER) 
            collision.obj.hit(collision);
        else if(collision.tile === 91 || collision.tile === 7)
            this.destroy();
    },
    hit: function(damage){
        this.p.life-=damage;
        this.play("plantL");
        this.p.lengua=true;
        this.p.reload=0;
        if(this.p.life<=0) this.muerte();
    },
    muerte:function() {
        this.generar(this.p.x,this.p.y); 
        this.destroy();
    },
    step:function(dt){
        this.p.reload+=dt;
        var art = Q("Player").first();
        if(!this.p.activo && art!==undefined && art.p.x+(16*32)>this.p.x){
            this.p.activo=true;     
        }
        if(this.p.activo && this.p.reload>this.p.timeReload  && art!==undefined){
                Q.stage().insert(new Q.Bullet({xo:art.p.x-this.p.x,yo:art.p.y-this.p.y,x:this.p.x,y:this.p.y,distance:this.p.shootRange+this.p.x}));
            this.p.reload=0;
            if(this.p.lengua){
                this.p.timeReload+=2,75;
                this.play("plant");
                this.p.lengua=false;
                var art = Q("Player").first();
                Q.stage().insert(new Q.Bullet({xo:art.p.x-this.p.x,yo:art.p.y-this.p.y,x:this.p.x,y:this.p.y,distance:this.p.shootRange+this.p.x}));
            }
            else{
                this.p.timeReload-=2,75;
                this.play("plantL");
                this.p.lengua=true;
            } 
                  
            if(this.p.vx <0)  this.p.flip=false;
            else this.p.flip='x';
        }
    }
}); 
//Devil
Q.Sprite.extend("Devil",{ 
    init: function(p) { 
        this._super(p, { 
            xo:0,
            yo:0,
            gravity: 0,
            reload:0,
            timeReload:0.5,
            shoot:0,
            shootReload:1,
            shootRange:1500,
            oculto:false,
            activo:false,
            sheet: "devil",
            sprite: "Devil",
            frame: 0,
            flip: "x",
            life:120,
            puntos: 1000,
            type: Q.SPRITE_ENEMY,
            collisionMask: Q.SPRITE_PLAYER,
            limits:[{top:(14*32)+16,ground:(22*32)+16,left:247*32,right:284*32},//stage 1
                    {top:(86*32)+16,ground:(94*32)+16,left:354*32,right:382*32} //stage 2
            ]
        }); 
        this.add("2d,animation");  
        this.on("bump.top,bump.bottom,bump.left,bump.right","matar");
    },
    matar:function(collision){
        if(collision.obj.p.type===Q.SPRITE_PLAYER) 
            collision.obj.hit(collision);
    },

    hit: function(damage){
        this.p.life-=damage;
        if(this.p.life<=0) this.muerte();
    },
    muerte:function() {
        Q.audio.play("bossDeath.ogg");
        Q("Cross").first().show();
        Q.stageScene("keyMessage",5);
        this.destroy();
        Q.state.inc("score",this.p.puntos);
    },
    step:function(dt){
        var art = Q("Player").first();
        if(!this.p.activo && art!==undefined && art.p.x+(20*32)>this.p.x){
            this.p.activo=true;
            Q.audio.stop();
            backMusic.playMusic(true);
            this.p.vx=200;
            this.p.vy=200;
            this.add("aiBounceDevil");
            var stageLimits=0;
            if(Q.state.get("level")===1 || Q.state.get("level")===2)stageLimits=0;
            if(Q.state.get("level")===3 || Q.state.get("level")===4)stageLimits=1;
            this.aiBounceDevil.setLimits(this.p.limits[stageLimits]);
            this.play("devil");
        }
        if(this.p.activo  && art!==undefined){
            this.p.reload+=dt;
            this.p.shoot+=dt;
            this.p.xo=art.p.x-this.p.x;
            this.p.yo=art.p.y-this.p.y;

            var rnd= Math.floor((Math.random() * 100) + 1);

            if(this.p.reload>this.p.timeReload){
                this.p.reload=0;
                if( this.p.oculto){
                    this.p.oculto=false;
                }
            }

            if(0<rnd && rnd<2){ //Ataca
                this.play("devil");
                if(this.p.shoot>this.p.shootReload){
                    Q.stage().insert(new Q.Shuriken({xo:art.p.x-this.p.x,yo:art.p.y-this.p.y,x:this.p.x,y:this.p.y,distance:this.p.shootRange+this.p.x}));
                    this.p.shoot=0;
                }
            }
            /*else if(2<rnd && rnd<5){ //Teletransporta
                if(this.p.xo<0) this.p.vx*=-1;  
                this.p.vy= this.p.vx*(this.p.yo/this.p.xo)+20;  
                this.play("devilFly");
            }*/
            else if(5<rnd && rnd<7){ //Oculta
                this.play("devilHide");
                this.p.oculto=true;
            }

           if(this.p.vx<0)
               this.p.flip=false;
           else 
               this.p.flip='x';

           if(this.p.oculto) this.p.type=Q.SPRITE_DEFAULT;
           else this.p.type=Q.SPRITE_ENEMY;
        }
    }
}); 
//Ghost
Q.Sprite.extend("Ghost",{ 
    init: function(p) { 
        this._super(p, { 
            xo:0,
            yo:0,
            vx:0,
            vy:0,
            gravity: 0,
            reload:0,
            shoot:0,
            shootReload:1,
            shootRange:500,
            timeReload:5,
            sheet: "ghost",
            sprite: "Ghost",
            activo: false,
            frame: 0,
            flip: "x",
            life:80,
            type: Q.SPRITE_ENEMY,
            collisionMask: Q.SPRITE_PLAYER | Q.SPRITE_DEFAULT
        }); 
        this.add("2d,animation,GeneradorPremios");  
        this.on("bump.top,bump.bottom,bump.left,bump.right","matar");
        this.play("ghostHide");
    },
    matar:function(collision){
        if(collision.obj.p.type===Q.SPRITE_PLAYER) 
            collision.obj.hit(collision);
    },
    hit: function(damage){
        this.p.life-=damage;
        if(this.p.life<=0) this.muerte();
    },
    muerte:function() {
        this.generar(this.p.x,this.p.y); 
      //  Q.audio.play("xxx.ogg");
        this.destroy();
    },
    step:function(dt){
        var art = Q("Player").first();
        if(!this.p.activo && art!==undefined && art.p.x+(12*32)>this.p.x){
            this.p.activo=true;
            this.add("aiBounce, aiBounce2");
            this.play("ghost");
            this.p.vx=-50;
            this.p.vy=-65;
        }
        if(this.p.activo  && art!==undefined){
            this.p.reload+=dt;
            this.p.shoot+=dt;
            this.p.xo=art.p.x-this.p.x;
            this.p.yo=art.p.y-this.p.y;

            var rnd= Math.floor((Math.random() * 100) + 1);

            if(this.p.y <= (18*32)) this.p.vy*=-1;

            if(this.p.reload>this.p.timeReload){
                this.p.reload=0;
                if(art.p.vx !==0 && ((this.p.vx < 0 && this.p.x < art.p.x) || (this.p.vx > 0 && this.p.x > art.p.x))){ //Giro 
                    this.play("ghostHide");
                    this.p.vx*=-1;
                }
                
            }

            if(0<rnd && rnd<2){ //Ataca
                if(this.p.shoot>this.p.shootReload){
                    this.play("ghostAtack");
                    Q.stage().insert(new Q.GhostLance({x:this.p.x,y:this.p.y,d: this.p.vx,distance:this.p.shootRange+this.p.x}));
                    this.p.shoot=0;
                }
            }
    
           if(this.p.vx<0)
               this.p.flip=false;
           else 
               this.p.flip='x';  
    }
    }
});
//Ghost con armadura
Q.Sprite.extend("ArmorGhost",{ 
    init: function(p) { 
        this._super(p, { 
            vx:0,
            vy:0,
            t:0,
            gravity: 0,
            reload:0,
            timeReload:5,
            sheet: "armorGhost",
            sprite: "ArmorGhost",
            activo: false,
            frame: 0,
            distanceMax:400,
            life:80,
            A: -50, B: 0, C: 0, D:0, E: -7, F: -150, G: 3, H: 0,
            type: Q.SPRITE_ENEMY,
            collisionMask: Q.SPRITE_PLAYER | Q.SPRITE_DEFAULT
        }); 
        this.add("2d,animation,GeneradorPremios");  
        this.on("bump.top,bump.bottom,bump.left,bump.right","matar");
    },
    matar:function(collision){
        if(collision.obj.p.type===Q.SPRITE_PLAYER) 
            collision.obj.hit(collision);
        else if(collision.obj.p.type!==Q.SPRITE_DEFAULT && collision.obj.p.x>this.p.x){
            this.p.life-=collision.obj.p.damage;
            if(this.p.life<=0) this.muerte();
        }
        if(collision.tile === 43) this.destroy();
    },
    hit: function(damage){
       // this.p.life-=damage;
       // if(this.p.life<=0) this.muerte();
    },
    muerte:function() {
        this.generar(this.p.x,this.p.y); 
        this.destroy();
    },
    step:function(dt){
        var art = Q("Player").first();
        if(!this.p.activo && art!==undefined && art.p.x+(12*32)>this.p.x){
            this.p.activo=true;
            this.play("armorGhost");
            this.p.vx=-50;
            this.p.vy=-15;
        }
        if(this.p.activo && art!==undefined){
            this.p.t += dt;
            this.p.vx = this.p.A + this.p.B * Math.sin(this.p.C * this.p.t + this.p.D);
            this.p.vy = this.p.E + this.p.F * Math.sin(this.p.G * this.p.t + this.p.H);
            this.p.x += this.p.vx * dt;
            this.p.y += this.p.vy * dt;
            this.p.reload+=dt;
            if(this.p.reload>this.p.timeReload){
                this.p.reload=0;
            }
            if(art.p.x - this.p.x > this.p.distanceMax) this.destroy();
        }   
    }
}); 
//Mago
Q.Sprite.extend("Magician",{
    init: function(p) {
        this._super(p, {
            sheet: "mago",
            sprite: "Mago",
            frame: 0,
            gravity: 0,
            type: Q.SPRITE_ENEMY,
            vx:0,
            x:0, 
            reload:0,
            timeReload:2,
            life:60,
            activo: false,
            shootRange: 200,
            flip: 'x',
            hidden:true,
            collisionMask: Q.SPRITE_DEFAULT | Q.SPRITE_PLAYER
        }); 
        this.add('2d,GeneradorPremios,animation');
        this.on("bump.top,bump.bottom,bump.left,bump.right",this,"matar"); 
        this.on("return",this,"return");
        this.play("mago");         
    },
    hit: function(damage){
        this.p.life-=damage;
        if(this.p.life<=0) this.muerte();
    },
    matar:function(collision){
        if(collision.obj.p.type===Q.SPRITE_PLAYER) 
            collision.obj.hit(collision);
    },
    muerte:function() {
        this.generar(this.p.x,this.p.y); 
        this.destroy();
    },
    step:function(dt){
        this.p.reload+=dt;
        var art = Q("Player").first();
        if(!this.p.activo && art!==undefined && art.p.x+(7*32)>this.p.x){
            this.p.hidden=false;
            this.p.activo=true;   
        }
        if(this.p.activo && this.p.reload>this.p.timeReload  && art!==undefined){
            if(this.p.x < art.p.x)  this.p.flip=false;
            else this.p.flip='x';
           if(!art.p.frog){
               this.sheet("magoOpen",true);
               this.play("magoOpen");
                Q.stage().insert(new Q.MagicSpark({x: this.p.x-20, y: this.p.y-10, flip: this.p.flip, distance:this.p.shootRange+this.p.x}));
           }
            this.p.reload=0;             
        }
    },
    return: function() {
        this.sheet("mago",true);
        this.play("mago");
    }
  });
/*--------------------------------ARMAS---------------------------------------*/
//Lanza de Arthur
Q.Sprite.extend("Lanza",{
    init: function(p) {
        this._super(p, {
            asset: "lance.png",
            frame: 0, 
            gravity:0, 
            damage: 30,
            vx:300,
            distance:0,
            type: Q.SPRITE_LANZA,
            collisionMask: Q.SPRITE_TUMBA | Q.SPRITE_ENEMY
        }); 
        this.add('2d');
        this.on("bump.top,bump.bottom,bump.left,bump.right","kill");    
        Q.audio.play("lance.ogg");
        if(this.p.vx < 0){
            this.p.flip = "x";
        } 
        this.p.distace+=this.p.x;                   
    },
    step:function(){
        if(this.p.x>this.p.distance)
            this.destroy();
    },
    kill: function(collision){
        if(collision.obj.p.type===Q.SPRITE_ENEMY ){ 
            if(collision.obj.p.activo){
                Q.stage().insert(new Q.Burst({x:collision.obj.p.x,y:collision.obj.p.y}));
                collision.obj.hit(this.p.damage);
                Q.audio.play("enemyHit.ogg");
                this.destroy();
            }else{
                this.destroy();
            }     
        } else if(collision.obj.p.type===Q.SPRITE_TUMBA){
            Q.stage().insert(new Q.Spark({x:collision.obj.p.x,y:collision.obj.p.y}));
            Q.audio.play("hitGrave.ogg");
            this.destroy();
        }
    }
 });
//Daga
Q.Sprite.extend("Daga",{
    init: function(p) {
        this._super(p, {
            asset: "cuchillo.png",
            frame: 0, 
            gravity:0, 
            damage: 70,
            vx:201,
            distance:0,
            type: Q.SPRITE_DAGA,
            collisionMask: Q.SPRITE_TUMBA | Q.SPRITE_ENEMY 
        }); 
        this.add('2d');
        this.on("bump.top,bump.bottom,bump.left,bump.right","kill");
        this.p.distace+=this.p.x;
        Q.audio.play("lance.ogg");
        if(this.p.vx < 0){
            this.p.flip = "x";
        }                    
    },
    step:function(){
        if(this.p.x>this.p.distance)
            this.destroy();
    },
    kill: function(collision){
        if(collision.obj.p.type===Q.SPRITE_ENEMY){
            if(collision.obj.p.activo){
                Q.stage().insert(new Q.Burst({x:collision.obj.p.x,y:collision.obj.p.y}));
                collision.obj.hit(this.p.damage);
                Q.audio.play("enemyHit.ogg");
                this.destroy();
            }else{
                this.destroy();
            }  
        } else if(collision.obj.p.type===Q.SPRITE_TUMBA){ 
            Q.stage().insert(new Q.Spark({x:collision.obj.p.x,y:collision.obj.p.y}));
            Q.audio.play("hitGrave.ogg");
            this.destroy();
        }
    }
 });
//Antorchas
Q.MovingSprite.extend ( "Antorcha" , {
    init: function(p) {
        this._super(p, {
            sheet: "antorchaDer",
            sprite: "Torch",
            gravity:0, 
            damage: 50,        
            type: Q.SPRITE_ANTORCHA,
            collisionMask: Q.SPRITE_TUMBA | Q.SPRITE_ENEMY | Q.SPRITE_DEFAULT
        }); 
        this.add('2d, animation');
        this.on("bump.top,bump.bottom,bump.left,bump.right","kill");
        Q.audio.play("torch.ogg");
        if(this.p.direction==="right"){
            this.sheet("antorchaDer",true);
            this.play('girarIzq');
        }else{
            this.sheet("antorchaIzq",true);
            this.play('girarDer');
        }   
    },

    kill: function(collision){
        if(collision.obj.p.type===Q.SPRITE_ENEMY){
            Q.stage().insert(new Q.Fire({x:collision.obj.p.x,y:collision.obj.p.y}));
            collision.obj.hit(this.p.damage);
            Q.audio.play("enemyHit.ogg");
        }else if(collision.obj.p.type !== Q.SPRITE_EXPLOSION){
            Q.stage().insert(new Q.Fire({x:this.p.x,y:this.p.y}));
        }

        this.destroy();
    }
});
//Hachas
Q.MovingSprite.extend ( "Hacha" , {
    init: function(p) {
        this._super(p, {
            sheet: "axeDer",
            sprite: "Axe",
            direction: "right",
            gravity:0, 
            damage: 60,        
            numEnemiesDead: 0,
            type: Q.SPRITE_HACHA,
            collisionMask: Q.SPRITE_TUMBA | Q.SPRITE_ENEMY | Q.SPRITE_DEFAULT
        }); 
        this.add('2d, animation');
        this.on("bump.top,bump.bottom,bump.left,bump.right","kill");
        Q.audio.play("torch.ogg");
        if(this.p.direction==="right"){
            this.sheet("axeDer",true);
            this.play('girarIzq');
        }else{
            this.sheet("axeIzq",true);
            this.play('girarDer');
        }   
    },

    kill: function(collision){
         if(collision.obj.p.type===Q.SPRITE_ENEMY){
            if(this.p.direction === "right"){
                    this.p.vx = 300;
                    this.p.vy = -50;
                    this.p.ax = 0;
                    this.p.ay = 70;
                }else if(this.p.direction === "left"){
                    this.p.vx = -300;
                    this.p.vy = -50;
                    this.p.ax = 0;
                    this.p.ay = 70;
                }
            if(collision.obj.p.activo){
                this.p.numEnemiesDead++;
                Q.stage().insert(new Q.Burst({x:collision.obj.p.x,y:collision.obj.p.y}));
                collision.obj.hit(this.p.damage);
                Q.audio.play("enemyHit.ogg");
            }else{
                 Q.stage().insert(new Q.Spark({x:collision.obj.p.x,y:collision.obj.p.y}));
                 this.destroy();
            }

            if(this.p.numEnemiesDead > 2){
                this.destroy();
            }
        } else if(collision.obj.p.type===Q.SPRITE_TUMBA){ 
            Q.stage().insert(new Q.Spark({x:collision.obj.p.x,y:collision.obj.p.y}));
            Q.audio.play("hitGrave.ogg");
            this.destroy();
        }else{
            this.destroy();
        }
    }
});
/*------------------------------ELEMENTOS-------------------------------------*/
//Tumbas saltables
Q.Sprite.extend("Tumba",{
    init: function(p,defaults) {
        this._super(p,Q._defaults(defaults||{}, {
            asset: p.tipo, 
            gravity: 0,
            type: Q.SPRITE_TUMBA,
            collisionMask: Q.SPRITE_PLAYER 
        })); 
        this.add('2d');
        this.p.static = true;                   
    }
 });
 //Marador de posicion para la mapScreen
Q.Sprite.extend("Marker",{
    init: function(p) { 
        this._super(p, { 
            asset: "marker.png",
            timeWait:2,
            time:0,
            x:0,
            y:0  
        }); 
        this.add("levelManager");
    },
    step:function(dt){
        if(this.p.time>this.p.timeWait)
            this.loadLevel();
        else
            this.p.time+=dt;
    }
});
//Bala de Planta
Q.Sprite.extend("Bullet",{
    init: function(p) {
        this._super(p, {
            sheet: "bullet",
            sprite: "Bullet",
            frame: 0, 
            gravity:0, 
            xo:0,
            yo:0,
            x:0,
            y:0, 
            vx:350,
            vy:0,
            distance:1500,
            type: Q.SPRITE_ENEMY,
            collisionMask: Q.SPRITE_DEFAULT | Q.SPRITE_PLAYER
        }); 
        this.add('animation,2d');
        this.on("bump.top,bump.bottom,bump.left,bump.right","kill"); 
        if(this.p.vx < 0){
            this.p.flip = "x";
        }
        this.play("bullet"); 
        if(this.p.xo<0) this.p.vx*=-1;  
        this.p.vy= this.p.vx*(this.p.yo/this.p.xo);    
    },
    step:function(){
        if(this.p.x>this.p.distance)
            this.destroy();
    },
    kill: function(collision){
        this.destroy();
        if(collision.obj.p.type===Q.SPRITE_PLAYER){
            Q.stage().insert(new Q.Burst({x:collision.obj.p.x,y:collision.obj.p.y}));
            collision.obj.hit(collision);
        } else if(collision.obj.p.type===Q.SPRITE_DEFAULT) 
            Q.stage().insert(new Q.Spark({x:collision.obj.p.x,y:collision.obj.p.y}));
        else if(collision.tile === 91 || collision.tile === 7) 
            this.destroy();
    },
    hit: function(damage){
        this.destroy();
    }
 });
 //Shuriken de Devil
Q.Sprite.extend("Shuriken",{
    init: function(p) {
        this._super(p, {
            sheet: "shuriken",
            sprite: "Shuriken",
            frame: 0, 
            gravity:0, 
            xo:0,
            yo:0,
            x:0,
            y:0, 
            vx:350,
            vy:0,
            distance:1500,
            type: Q.SPRITE_ENEMY,
            collisionMask: Q.SPRITE_DEFAULT | Q.SPRITE_PLAYER
        }); 
        this.add('animation,2d');
        this.on("bump.top,bump.bottom,bump.left,bump.right","kill"); 
        if(this.p.vx < 0){
            this.p.flip = "x";
        }
        this.play("shuriken"); 
        if(this.p.xo<0) this.p.vx*=-1;  
        this.p.vy= this.p.vx*(this.p.yo/this.p.xo);    
    },
    step:function(){
        if(this.p.x>this.p.distance)
            this.destroy();
    },
    kill: function(collision){
        this.destroy();
        if(collision.obj.p.type===Q.SPRITE_PLAYER){
            Q.stage().insert(new Q.Burst({x:collision.obj.p.x,y:collision.obj.p.y}));
            collision.obj.hit(collision);
        } else if(collision.obj.p.type===Q.SPRITE_DEFAULT) 
            Q.stage().insert(new Q.Spark({x:collision.obj.p.x,y:collision.obj.p.y}));
    },
    hit: function(damage){
        this.destroy();
    }
 });
 //Lanza del Ghost
Q.Sprite.extend("GhostLance",{
    init: function(p) {
        this._super(p, {
            asset: "ghostLance.png", 
            gravity: 0,
            type: Q.SPRITE_ENEMY,
            vx:-150,
            x:0,
            d:0,
            distance:1500,
           collisionMask: Q.SPRITE_DEFAULT | Q.SPRITE_PLAYER
        }); 
        this.add('2d');      
        this.on("bump.top,bump.bottom,bump.left,bump.right","kill"); 
        if(this.p.d > 0){
            this.p.flip = "x";
            this.p.vx=150;
        }
    },
    step:function(){
        if(this.p.x>this.p.distance)
            this.destroy();
    },
    kill: function(collision){
        this.destroy();
        if(collision.obj.p.type===Q.SPRITE_PLAYER){
            Q.stage().insert(new Q.Burst({x:collision.obj.p.x,y:collision.obj.p.y}));
            collision.obj.hit(collision);
        } else if(collision.obj.p.type===Q.SPRITE_DEFAULT) 
            Q.stage().insert(new Q.Spark({x:collision.obj.p.x,y:collision.obj.p.y}));
    },
    hit: function(damage){
        this.destroy();
    }
  });
//Lanza del Ghost
Q.Sprite.extend("MagicSpark",{
    init: function(p) {
        this._super(p, {
            sheet: "spark",
            sprite: "Spark",
            frame: 0,
            gravity: 0,
            type: Q.SPRITE_SPARKMAGO,
            vx:100,
            x:0,
            y:0,
            distance:0,
           collisionMask:  Q.SPRITE_PLAYER
        }); 
        this.add('2d, animation');      
        this.on("bump.top,bump.bottom,bump.left,bump.right","kill"); 
        this.play("spark");    
       if(this.p.flip==='x') this.p.vx=-100;
    },
    kill: function(collision){
        if(collision.obj.p.type===Q.SPRITE_PLAYER){
            var art = Q("Player").first();
            art.itsAFrog();
        }
        this.destroy();
    },
    hit: function(damage){},
    step:function(){
        if(this.p.x>this.p.distance)
            this.destroy();
    }
  });
//Plataforma agua
Q.Sprite.extend("movingPlataform",{
  init: function(p) {
      this._super(p, {
          asset: "movingPlatform.png", 
          gravity: 0,
          type: Q.SPRITE_DEFAULT,
          vx:100,
          x:0,
          dir:'d',
         collisionMask: Q.SPRITE_DEFAULT
      }); 
      this.add('2d , aiBounce');        
      this.on("bump.top","col");    
  },

  col: function(collision){
      if(collision.obj.p.type===Q.SPRITE_PLAYER) collision.obj.p.x=this.p.x;
  }
});
//Plataforma stage 2
Q.Sprite.extend("MovPlatUpDown",{
  init: function(p) {
      this._super(p, {
          asset: "movPlatUpDown.png", 
          gravity: 0,
          type: Q.SPRITE_DEFAULT,
          x:0,
          collisionMask: Q.SPRITE_DEFAULT
      }); 
      this.add('2d , aiPlatUpDown');        
      this.on("bump.top","col");
      this.aiPlatUpDown.setOptions((80*32)+16);
  },

  col: function(collision){
        if(collision.obj.p.type===Q.SPRITE_PLAYER) {
            if(this.p.dir==="up"){
                collision.obj.p.y=this.p.y-47;
                this.p.vy=-100;
            }else{
                collision.obj.p.y=this.p.y-46;
                this.p.vy=100;
            }
        }
  }
});

 /*------------------------------EFECTOS--------------------------------------*/
//Burst
Q.Sprite.extend("Burst",{ 
    init: function(p) { 
        this._super(p, { 
            vx:0,
            vy:0,
            sheet: "burst",
            sprite: "Burst",
            frame: 0,
            type: Q.SPRITE_EXPLOSION
        }); 
        this.add("2d,animation");  
        this.play("burst");
        this.on("muerte", "muerte");
    },

    muerte:function(collision) {
        Q.audio.play("burst.ogg");
        this.destroy();
    }
}); 
//Fire
Q.Sprite.extend("Fire",{ 
    init: function(p) { 
        this._super(p, { 
            vx:0,
            vy:0,
            sheet: "fire",
            sprite: "Fire",
            frame: 0,
            time:0,
            maxTime:1,
            damage:100,
            type: Q.SPRITE_EXPLOSION,
            collisionMask: Q.SPRITE_DEFAULT | Q.SPRITE_ENEMY | Q.SPRITE_PLAYER
        }); 
        this.add("2d,animation");  
        this.play("burning");
        this.on("bump.top,bump.left,bump.right",this, "burn");
        this.on("muerte", "muerte");
    },
    step:function(dt){
        if(this.p.time<this.p.maxTime)
            this.p.time+=dt;
        else
            this.destroy();
    },
    burn:function(collision){
        if(collision.obj.p.type === Q.SPRITE_PLAYER)
            collision.obj.hit(collision);
        else if(collision.obj.p.type === Q.SPRITE_ENEMY)
            collision.obj.hit(this.p.damage);
        else if(collision.tile === 91 || collision.tile === 7)
            this.destroy();
    }
}); 
//Spark
Q.Sprite.extend("Spark",{ 
    init: function(p) { 
        this._super(p, { 
            vx:0,
            vy:0,
            sheet: "spark",
            sprite: "Spark",
            frame: 0,
            type: Q.SPRITE_EXPLOSION
        }); 
        this.add("2d,animation");  
        this.play("spark");
        this.on("muerte", "muerte");
    },

    muerte:function() {
        this.destroy();
    }
}); 
/*-----------------------------COLLECTABLES-----------------------------------*/
//Default de recompensa
Q.Sprite.extend("Premio",{
    init: function(p) {
        this._super(p, {
            sheet: "busto",
            sprite: "Premio",
            puntos: 0,     
            type: Q.SPRITE_PREMIO,
            collisionMask: Q.SPRITE_DEFAULT | Q.SPRITE_PLAYER 
        }); 
        this.add('2d,animation'); 
        this.on("bump.top,bump.bottom,bump.left,bump.right","take");
        this.play('shine');                   
    },
    take: function(collision){
        if(collision.obj.p.type === Q.SPRITE_PLAYER){
           Q.audio.play("treasurePickUp.ogg");
           Q.state.inc("score",this.p.puntos);
           this.destroy();
        }else if(collision.tile === 91 || collision.tile === 7)
            this.destroy();
    }
 });
//Arma antorcha
Q.Sprite.extend("ObjAntorcha",{
    init: function(p) {
        this._super(p, {
            sheet: "antorchaMov", 
            sprite: "WeaponObj",
            puntos: 100,    
            type: Q.SPRITE_PREMIO,
            collisionMask: Q.SPRITE_PLAYER | Q.SPRITE_DEFAULT
        }); 
        this.add('2d,animation'); 
        this.play("shine");
        this.on("bump.top,bump.bottom,bump.left,bump.right","take");                   
    },
    take: function(collision){
        if(collision.obj.p.type === Q.SPRITE_PLAYER){
            Q.audio.play("weaponPickUp.ogg");
            Q.state.set("armaArthur","antorcha");
            Q.state.inc("score",this.p.puntos);
            this.destroy();
        }else if(collision.tile === 91 || collision.tile === 7)
            this.destroy();
    }
 });
//Arma hacha
Q.Sprite.extend("ObjHacha",{
    init: function(p) {
        this._super(p, {
            sheet: "axeMov", 
            sprite: "WeaponObj",
            puntos: 100,    
            type: Q.SPRITE_PREMIO,
            collisionMask: Q.SPRITE_PLAYER | Q.SPRITE_DEFAULT
        }); 
        this.add('2d,animation'); 
        this.play("shine");
        this.on("bump.top,bump.bottom,bump.left,bump.right","take");                   
    },
    take: function(collision){
        if(collision.obj.p.type === Q.SPRITE_PLAYER){
            Q.audio.play("weaponPickUp.ogg");
            Q.state.set("armaArthur","hacha");
            Q.state.inc("score",this.p.puntos);
            this.destroy();
        }else if(collision.tile === 91 || collision.tile === 7)
            this.destroy();
    }
 });
//Arma Daga
Q.Sprite.extend("ObjDaga",{
    init: function(p) {
        this._super(p, {
            sheet: "cuchilloMov", 
            sprite: "WeaponObj",
            puntos: 200,  
            type: Q.SPRITE_PREMIO,
            collisionMask: Q.SPRITE_PLAYER | Q.SPRITE_DEFAULT
        }); 
        this.add('2d,animation'); 
        this.play("shine");
        this.on("bump.top,bump.bottom,bump.left,bump.right","take");                   
    },
    take: function(collision){
        if(collision.obj.p.type === Q.SPRITE_PLAYER){
           Q.audio.play("weaponPickUp.ogg");
           Q.state.set("armaArthur","daga");
           Q.state.inc("score",this.p.puntos);
            this.destroy();
        }else if(collision.tile === 91 || collision.tile === 7)
            this.destroy();
    }
 });
//Arma lanza
Q.Sprite.extend("ObjLanza",{
    init: function(p) {
        this._super(p, {
            sheet: "lanzaMov", 
            sprite: "WeaponObj",
            puntos: 100,  
            type: Q.SPRITE_PREMIO,
            collisionMask: Q.SPRITE_PLAYER | Q.SPRITE_DEFAULT
        }); 
        this.add('2d,animation'); 
        this.play();
        this.on("bump.top,bump.bottom,bump.left,bump.right","take");                   
    },
    take: function(collision){
        if(collision.obj.p.type === Q.SPRITE_PLAYER){
            Q.audio.play("weaponPickUp.ogg");
            Q.state.set("armaArthur","lanza");
            Q.state.inc("score",this.p.puntos);
            this.destroy();
        }else if(collision.tile === 91 || collision.tile === 7)
            this.destroy();
    }
 });
//Armadura
Q.Sprite.extend("ObjArmadura",{
    init: function(p) {
        this._super(p, {
            asset: "armour.png",
            puntos: 200,      
            type: Q.SPRITE_PREMIO,
            collisionMask: Q.SPRITE_PLAYER | Q.SPRITE_DEFAULT
        }); 
        this.add('2d'); 
        this.on("bump.top,bump.bottom,bump.left,bump.right","take");                   
    },
    take: function(collision){
        if(collision.obj.p.type === Q.SPRITE_PLAYER){
            if(collision.obj.p.sheet==="arthurNude"){
            Q.audio.play("putArmour.ogg");
            collision.obj.p.ArmoDestroy=false;
            collision.obj.sheet("arthurArmo",true);
            }else
                Q.audio.play("treasurePickUp.ogg");
            Q.state.inc("score",this.p.puntos);
            this.destroy();
        }else if(collision.tile === 91 || collision.tile === 7)
            this.destroy();
    }
 });
 //Vida
Q.Sprite.extend("Vida",{
    init: function(p) {
        this._super(p, {
            asset: "1up.png",
            puntos: 200,    
            type: Q.SPRITE_PREMIO,
            collisionMask: Q.SPRITE_PLAYER | Q.SPRITE_DEFAULT
        }); 
        this.add('2d,animation'); 
        this.on("bump.top,bump.bottom,bump.left,bump.right","take");                   
    },
    take: function(collision){
        if(collision.obj.p.type === Q.SPRITE_PLAYER){
            if(Q.state.get("lives")<Q.state.get("maxLives")){
                Q.state.inc("lives",1);
                Q.audio.play("extraLife.ogg");
            }else{
                Q.audio.play("treasurePickUp.ogg");
                Q.state.inc("score",this.p.puntos);
            }
            this.destroy();
        }else if(collision.tile === 91 || collision.tile === 7)
            this.destroy();
    }
 });
 //cruz(llave de la puerta)
 Q.Sprite.extend("Cross",{
    init: function(p) {
        this._super(p, {
            sheet: "cross", 
            sprite: "Cross",
            puntos: 10000,
            hidden:true,
            gravity:0,
            type: Q.SPRITE_CRUZ,
            collisionMask: Q.SPRITE_PLAYER | Q.SPRITE_DEFAULT
        }); 
        this.add('2d,animation'); 
        this.play("shine");
        this.on("bump.top,bump.bottom,bump.left,bump.right","take");                   
    },
    take: function(collision){
        if(collision.obj.p.type === Q.SPRITE_PLAYER){
            Q.audio.play("weaponPickUp.ogg");
            Q.state.inc("score",this.p.puntos);
            Q.state.set("armaArthur","cruz");
            Q.clearStage(5);
            Q("Door").first().unlock();
            this.destroy();
        }else if(collision.tile === 91 || collision.tile === 7)
            this.destroy();
    },
    show:function(){
        this.p.hidden=false;
        this.p.gravity=1;
    }
 });
 //Puerta
 Q.Sprite.extend("Door",{
    init: function(p) {
        this._super(p, {
            sheet: "door",
            sprite:"Door",
            frame:0,
            puntos: 200,
            gravity:0,
            static:true,
            type: Q.SPRITE_PUERTA,
            collisionMask:  Q.SPRITE_NONE
        }); 
        this.add('2d,animation,levelManager');
        this.on("bump.left",this,"open");
        this.on("opened",this,"nextLevel");
    },
    unlock:function(){
        this.p.collisionMask=Q.SPRITE_PLAYER;
    },
    open:function(collision){
        this.p.x -= collision.separate[0];
        this.p.y -= collision.separate[1];
        if(collision.obj.p.type === Q.SPRITE_PLAYER && Q.state.get("armaArthur")==="cruz" && !collision.obj.p.victoria){
            collision.obj.win();
            Q.audio.stop();
            Q.audio.play("doorOpen.ogg");
            this.play("open");
        }
    },
    nextLevel:function(){
        Q.state.inc("level",1);
        this.mapScreen();
    }
 });
 //temporizador
 Q.Sprite.extend("TimeSensor",{
     init: function(p) {
        this._super(p, {
            x:0,y:0,
            gravity:0,
            wait:0,
            time:0,
            action:""
        });
        this.add("levelManager");
    },
    step:function(dt){
        if(this.p.time<this.p.wait)
            this.p.time+=dt;
        else
           this.fin(); 
    },
    fin:function(){
            switch (this.p.action){
                case "loadLevel":
                    this.loadLevel();
                    break;
            }
    }
 });
/*------------------------------HUD SUPERIOR----------------------------------*/
//Puntuacion
Q.UI.Text.extend("Score",{
    init:function(p) {
        this._super({
            label: "0",    
            x: 110,
            y: 25,
            color: Q.COLOR_WHITE,
            size:Q.FONT_SIZE_MEDIUM,
            family: Q.FONT_FAMILY 
            });
        Q.state.on("change.score",this,"score");
    },
    score:function(score) {
        this.p.label = score.toString();
        if(score>Q.state.get("topScore")){
            Q.state.set("topScore",score);
        }
    }
});
//vidas
Q.UI.Text.extend("TopScore",{
    init:function(p) {
        this._super({
            label: "0",    
            x: 300,
            y: 25,
            color:Q.COLOR_WHITE,
            size:Q.FONT_SIZE_MEDIUM,
            family: Q.FONT_FAMILY 
            });
        Q.state.on("change.topScore",this,"topScore");
    },
    topScore:function(topScore) {
        this.p.label = topScore.toString();
    }
});
//Temporizador
Q.UI.Text.extend("Timer",{
    init:function(p) {
        this._super({
            label: "2:30",    
            x: 70,
            y: 75,                              
            color:Q.COLOR_WHITE,
            size:Q.FONT_SIZE_MEDIUM,
            family: Q.FONT_FAMILY 
            });
        Q.state.on("change.timer",this,"timer");
    },
    timer:function(time) {
        var minutes = Q.state.get("timerM");
        if(time < 10){
            segd = "0" + time;
        }else{
            segd = time;
        }
        this.p.label = minutes + ":" + segd;
    }
});
//HUD superior
Q.scene('HUD',function(stage) {
  var container = stage.insert(new Q.UI.Container({x:0, y: 1}));
  container.insert(new Q.UI.Text({x:70, y:0 ,size:Q.FONT_SIZE_MEDIUM,color: Q.COLOR_YELLOW,label: "Player", family: Q.FONT_FAMILY  }));
  container.insert(new Q.Score());
  container.insert(new Q.UI.Text({x:250, y:0,size:Q.FONT_SIZE_MEDIUM,color: Q.COLOR_RED,label: "Top score", family: Q.FONT_FAMILY  }));
  container.insert(new Q.TopScore());
  Q.state.inc("topScore",1);
  Q.state.dec("topScore",1);
  container.insert(new Q.UI.Text({x:70, y:50 ,size:Q.FONT_SIZE_MEDIUM,color: Q.COLOR_LIGHT_RED,label: "Time", family: Q.FONT_FAMILY  }));
  container.insert(new Q.Timer());
  container.fit(5,200);
  stage.show= function(state){
          this.hidden=state;
  };
});
/*-----------------------------HUD INFERIOR-----------------------------------*/
//vida HUD
Q.UI.Button.extend("Live",{
    init:function(p) {
        this._super({
            asset: "live.png",
            y:Q.height-15
            });
             Q.state.on("change.lives",this,"lives");
    },
    lives:function(){
        var i=0;
        var lives= Q.state.get("lives");
        Q("Live",3).each(function(){
            if(i<lives)
                this.p.hidden=false;
            else
                this.p.hidden=true;
            i++;
        });
    }
});
//cuadro
Q.UI.Button.extend("Cuadro",{
    init:function(p) {
        this._super({
            asset: "cuadro.png",    
            x: 400,
            y: 150
            });      
    }
});
//arma que Arthur tiene equipada
Q.UI.Button.extend("Arma",{
    init:function(p) {
        this._super({
            asset: "lanceHUD.png",     
            x: 400,
            y: 150
            });
        Q.state.on("change.armaArthur",this,"arma");
    },
    arma:function() {
        var armaEquipada = Q.state.get("armaArthur");
        if(armaEquipada === "lanza"){
            this.p.asset = "lanceHUD.png";
        }else if(armaEquipada === "daga"){
            this.p.asset = "cuchilloHUD.png";
        }else if(armaEquipada === "antorcha"){
            this.p.asset = "antorchaHUD.png";
        }else if(armaEquipada === "hacha"){
            this.p.asset = "axeHUD.png";
        }     
    }
});
//HUD inferior
Q.scene('HUD2',function(stage) {
    var container = stage.insert(new Q.UI.Container({x:0, y: Q.height-180}));
    container.insert(new Q.Cuadro());
    container.insert(new Q.Arma());
    const maxLives= Q.state.get("maxLives");
    const lives= Q.state.get("lives");
    var i=0;
    for(i=0;i<maxLives;i++)
          stage.insert(new Q.Live());
    i=0;
    Q("Live",3).each(function(){
        this.p.x=30+(40*i);
        if(i<lives)
            this.p.hidden=false;
        else
            this.p.hidden=true;
        i++;
    });
  container.fit(5,200);
  stage.show= function(state){
          this.hidden=state;
  };
});

/*------------------------------ESCENAS BASE----------------------------------*/
//Pantalla de inicio
Q.scene("initScreen",function(stage){
    Q.state.set("enJuego",false);
    Q.stageTMX("mainMenu.tmx",stage);
    stage.insert(new Q.UI.Text({x:Q.width/2, y: (Q.height/3)*2-80,size:Q.FONT_SIZE_MEDIUM,color: Q.COLOR_BLUE,label: "Pulsa enter para empezar", family: Q.FONT_FAMILY }));
    stage.insert(new Q.UI.Button({asset:"main_title.png",x:Q.width/2, y: (Q.height/3)}));
    Q.state.set({ score:0,topScore:Number(Q.TOPSCORE), lives:3,level:1,armaArthur:"lanza",pause:false,enJuego:false });
    //Musica principal del juego
   Q.input.on("confirm",this,function(){
        Q.audio.play("insertCoin.ogg");
        Q.stageScene("controlScreen");
        Q.input.off("confirm");
    });
});
//Pantalla de perdido
Q.scene("loseScreen",function(stage){
    Q.stage(2).show(true);
    Q.stage(3).show(true);
    Q.state.set("enJuego",false);
    Q.audio.stop();
    Q.audio.play("gameover.ogg");
    Q.stageTMX("loseScreen.tmx",stage);
    stage.insert(new Q.UI.Text({x:Q.width/2, y: Q.height/2-100,size:Q.FONT_SIZE_LARGE,color: Q.COLOR_RED,label: "Game over", family: Q.FONT_FAMILY  }));
    stage.insert(new Q.UI.Text({x:Q.width/2, y: Q.height/2-50,size:Q.FONT_SIZE_SMALL,color: Q.COLOR_LIGHT_RED,label: "Pulsa enter para volver al menu principal", family: Q.FONT_FAMILY  }));
    if(Q.state.get("topScore")>Q.TOPSCORE){
        Q.TOPSCORE=Q.state.get("topScore");
        window.localStorage.setItem("GnGTopScore",Q.TOPSCORE);
    }
    Q.input.on("confirm",this,function(){
        Q.loadTMX("mainMenu.tmx", function() {
            Q.stageScene("initScreen");
        });
    });
});
//Pantalla de ganado
Q.scene("winScreen",function(stage){
    Q.state.set("enJuego",false);
    Q.stageTMX("finalScreen.tmx",stage);
    Q.audio.stop();
    Q.audio.play("gngEndTheme.ogg");
    var container = stage.insert(new Q.UI.Container({x: Q.width/2, y: Q.height/5, fill: "rgba(255,136,136,0.2)"}));        
    container.insert(new Q.UI.Text({x:0, y: 10,size:Q.FONT_SIZE_LARGE,color:Q.COLOR_YELLOW,label:"Has ganado!", family: Q.FONT_FAMILY }));
    container.insert(new Q.UI.Text({x:0, y: 50,size:Q.FONT_SIZE_MEDIUM,color:Q.COLOR_LIGHT_RED,label:"Autores", family: Q.FONT_FAMILY }));
    container.insert(new Q.UI.Text({x:0, y: 80,size:Q.FONT_SIZE_MEDIUM,color:Q.COLOR_BLUE,label:"Jose Luis Sánchez Gárcia", family: Q.FONT_FAMILY }));
    container.insert(new Q.UI.Text({x:0, y: 110,size:Q.FONT_SIZE_MEDIUM,color:Q.COLOR_BLUE,label:"Yaco Alejandro Santiago Pérez", family: Q.FONT_FAMILY }));
    container.insert(new Q.UI.Text({x:0, y: 140,size:Q.FONT_SIZE_MEDIUM,color:Q.COLOR_BLUE,label:"Andrea Martín Arias", family: Q.FONT_FAMILY }));
    container.fit(20);
});
//Pantalla de siguiente nivel
Q.scene("mapScreen",function(stage){
    var markerPos=[{},{x:(1*32)+16,y:15*32},{x:(3*32)+16,y:(14*32)+13},{x:(5*32)+14,y:(14*32)+11},{x:(6*32)+12,y:(14*32)+10},{x:(9*32)+6,y:(14*32)+10},{x:(10*32)+20,y:(14*32)+5},{x:(10*32)+20,y:(14*32)+5}];
    Q.stage(2).show(false);
    Q.stage(3).show(false);
    Q.state.set("enJuego",false);
    Q.stageTMX("mapScreen.tmx",stage);
    stage.insert(new Q.UI.Text({x:Q.width/2, y: Q.height/3,size:Q.FONT_SIZE_LARGE,color:Q.COLOR_BLUE,label:"Player  one  ready!", family: Q.FONT_FAMILY }));
    stage.insert(new Q.Marker(markerPos[Q.state.get("level")]));
});
//Mensaje de juego pausado
Q.scene('pauseMessage',function(stage) {
  var container = stage.insert(new Q.UI.Container({x: Q.width/2, y: Q.height/2, fill: "rgba(255,136,136,0.2)"}));        
  container.insert(new Q.UI.Text({x:0, y: 10,size:Q.FONT_SIZE_MEDIUM,color:Q.COLOR_BLUE,label:"Juego pausado", family: Q.FONT_FAMILY }));
  // Expand the container to visibily fit it's contents
  // (with a padding of 20 pixels)
  container.fit(20);
});
//Mensaje de juego pausado
Q.scene('keyMessage',function(stage) {
  var container = stage.insert(new Q.UI.Container({x: Q.width/2, y: Q.height/3}));        
  container.insert(new Q.UI.Text({x:0, y: 10,size:Q.FONT_SIZE_LARGE,color:Q.COLOR_LIGHT_RED,label:"Coje la llave para abrir la puerta", family: Q.FONT_FAMILY }));
  // Expand the container to visibily fit it's contents
  // (with a padding of 20 pixels)
  container.fit(20);
});
//Pantalla de controles
Q.scene('controlScreen',function(stage) {   
  stage.insert(new Q.UI.Button({asset:"main_title.png",x:Q.width/2, y: 50}));
  stage.insert(new Q.UI.Text({x:Q.width/2, y: 120,size:Q.FONT_SIZE_LARGE,color:Q.COLOR_LIGHT_RED,label:"Controles", family: Q.FONT_FAMILY }));
  stage.insert(new Q.UI.Text({x:Q.width/2, y: 170,size:Q.FONT_SIZE_MEDIUM,color:Q.COLOR_BLUE,label:"Usa las teclas de cursor izquierda y derecha \n para mover a Arthur", family: Q.FONT_FAMILY }));
  stage.insert(new Q.UI.Text({x:Q.width/2, y: 250,size:Q.FONT_SIZE_MEDIUM,color:Q.COLOR_BLUE,label:"Usa la tecla de cursor superior para saltar \n y la inferior para agacharte", family: Q.FONT_FAMILY }));
  stage.insert(new Q.UI.Text({x:Q.width/2, y: 330,size:Q.FONT_SIZE_MEDIUM,color:Q.COLOR_BLUE,label:"Pulsa la barra espaciadora para disparar", family: Q.FONT_FAMILY }));
  stage.insert(new Q.UI.Text({x:Q.width/2, y: 380,size:Q.FONT_SIZE_MEDIUM,color:Q.COLOR_BLUE,label:'Pulsa la tecla "P"  para pausar la partida', family: Q.FONT_FAMILY }));
  stage.insert(new Q.UI.Text({x:Q.width/2, y: 480,size:Q.FONT_SIZE_LARGE,color:Q.COLOR_YELLOW,label:'Ready player One!', family: Q.FONT_FAMILY }));
  stage.insert(new Q.TimeSensor({wait:2,action:"loadLevel"}));
});
/*----------------------------------NIVELES-----------------------------------*/ 
// Stage 1
Q.scene("L1",function(stage) {
  Q.state.set("enJuego",true);
  var levelAssets = [
      //Cementerio P1
      ["Zombie",{x:(32*32)+16,y:(21*32)+16}],
      ["Zombie",{x:(34*32)+16,y:(21*32)+16}],
      ["Crow",{x:(39*32)+16,y:(18*32)+16}],
      ["Magician",{x:(40*32)+20,y:(20*32)-6}],
      //cementerio P2 Arriba
      ["Zombie",{x:(54*32)+16,y:(16*32)+16}],
      ["Zombie",{x:(60*32)+16,y:(16*32)+16}],
      ["Crow",{x:(62*32)+16,y:(14*32)+16}],
      ["Zombie",{x:(64*32)+16,y:(16*32)+16}],
      ["Zombie",{x:(66*32)+16,y:(16*32)+16}],
      ["Zombie",{x:(70*32)+16,y:(16*32)+16}],
      ["Zombie",{x:(76*32)+16,y:(16*32)+16}],
      ["Crow",{x:(76*32)+16,y:(13*32)+16}],
      //cementerio P2 Abajo
      ["Zombie",{x:(59*32)+16,y:(21*32)+16}],
      ["Zombie",{x:(64*32)+16,y:(21*32)+16}],
      ["Zombie",{x:(66*32)+16,y:(21*32)+16}],
      ["Zombie",{x:(70*32)+16,y:(21*32)+16}],
      //cementerio P3
      ["Zombie",{x:(92*32)+16,y:(21*32)+16}],
      ["Crow",{x:(92*32)+16,y:(18*32)+16}],
      ["Crow",{x:(100*32)+16,y:(18*32)+16}],
      ["Zombie",{x:(101*32)+16,y:(21*32)+16}],
      ["Zombie",{x:(105*32)+16,y:(21*32)+16}],
      ["Crow",{x:(107*32)+16,y:(19*32)+16}],
      //entrada bosque
      ["Zombie",{x:(140*32)+16,y:(21*32)+16}],
      ["Plant",{x:(145*32)+16,y:(21*32)+16}],
      ["ArmorGhost",{x:(164*32)+16,y:(19*32)+16}],
      ["ArmorGhost",{x:(168*32)+16,y:(19*32)+16}],
      ["Plant",{x:(169*32)+16,y:(21*32)+16}],
      ["ArmorGhost",{x:(186*32)+16,y:(19*32)+16}],
      ["ArmorGhost",{x:(190*32)+16,y:(19*32)+16}],
      ["ArmorGhost",{x:(210*32)+16,y:(19*32)+16}],
      ["ArmorGhost",{x:(214*32)+16,y:(19*32)+16}],
      //Bosque linde
      ["Crow",{x:(227*32)+16,y:(14*32)+16}],
      ["Crow",{x:(231*32)+16,y:(14*32)+16}],
      ["Crow",{x:(233*32)+16,y:(14*32)+16}],
      //Bosque
      ["Zombie",{x:(246*32)+16,y:(21*32)+16}],
      ["Zombie",{x:(248*32)+16,y:(21*32)+16}],
      ["Ghost",{x:(256*32)+16,y:(18*32)+16}],
      ["Zombie",{x:(261*32)+16,y:(21*32)+16}],
      ["Zombie",{x:(263*32)+16,y:(21*32)+16}],
      ["Ghost",{x:(270*32)+16,y:(18*32)+16}],
      ["Ghost",{x:(278*32)+16,y:(19*32)+16}],
      ["Zombie",{x:(297*32)+16,y:(21*32)+16}],
      ["Zombie",{x:(299*32)+16,y:(21*32)+16}],
      ["Ghost",{x:(294*32)+16,y:(18*32)+16}],
      ["Ghost",{x:(300*32)+16,y:(19*32)+16}],
      ["Ghost",{x:(308*32)+16,y:(19*32)+16}],
      ["Zombie",{x:(310*32)+16,y:(21*32)+16}],
      ["Zombie",{x:(312*32)+16,y:(21*32)+16}],
      ["Ghost",{x:(323*32)+16,y:(18*32)+16}],
      ["Ghost",{x:(335*32)+16,y:(19*32)+16}],
      ["Ghost",{x:(344*32)+16,y:(18*32)+16}],
      //Boss final
      ["Devil",{x:(371*32)+16,y:(15*32)+16}]
    ];
  Q.stageTMX("stage1.tmx",stage);
  stage.add("viewport").follow(Q("Player").first(),{x:true,y:true});
  stage.viewport.offset(0,204);
  backMusic.playMusic(false);
  stage.loadAssets(levelAssets);
});
// Satge 2
Q.scene("L3",function(stage) {
  Q.state.set("enJuego",true);
  var levelAssets = [
    //Hielo
    ["Zombie",{x:(28*32)+16,y:(86*32)+16}],
    ["Crow",{x:(29*32)+16,y:(91*32)+16}],
    ["Crow",{x:(32*32)+16,y:(82*32)+16}],
    ["Zombie",{x:(31*32)+16,y:(90*32)+16}],
    ["Zombie",{x:(36*32)+16,y:(75*32)+16}],
    //Alto lleno de premios
    ["Ghost",{x:(30*32)+16,y:(73*32)+16}],
    ["Plant",{x:(30*32)+16,y:(75*32)+16}],
    ["Premio",{x:(17*32)+16,y:(75*32)+16}],
    ["Premio",{x:(19*32)+16,y:(75*32)+16}],
    ["Premio",{x:(21*32)+16,y:(75*32)+16}],
    ["Premio",{x:(23*32)+16,y:(75*32)+16}],
    ["Premio",{x:(25*32)+16,y:(75*32)+16}],
    ["Crow",{x:(19*32)+16,y:(72*32)+16}],

    ["Zombie",{x:(36*32)+16,y:(84*32)+16}],
    ["Zombie",{x:(44*32)+16,y:(84*32)+16}],
    ["Ghost",{x:(42*32)+16,y:(73*32)+16}],
    ["Plant",{x:(48*32)+16,y:(74*32)+16}],
    ["Plant",{x:(48*32)+16,y:(79*32)+16}],
    ["Zombie",{x:(48*32)+16,y:(84*32)+16}],

    ["ArmorGhost",{x:(50*32)+16,y:(88*32)+16}],
    ["Ghost",{x:(55*32)+16,y:(88*32)+16}],
    ["Plant",{x:(41*32)+16,y:(93*32)+16}],


    ["Zombie",{x:(67*32)+16,y:(80*32)+16}],
    ["Zombie",{x:(70*32)+16,y:(80*32)+16}],
    ["Ghost",{x:(76*32)+16,y:(75*32)+16}],
    ["Plant",{x:(78*32)+16,y:(80*32)+16}],
    ["Plant",{x:(80*32)+16,y:(80*32)+16}],
    ["Zombie",{x:(82*32)+16,y:(80*32)+16}],
    ["Zombie",{x:(82*32)+16,y:(80*32)+16}],
    ["Zombie",{x:(86*32)+16,y:(80*32)+16}],
    ["Zombie",{x:(88*32)+16,y:(80*32)+16}],
    
    //Alto 
    ["Plant",{x:(102*32)+16,y:(83*32)+16}],
    ["Ghost",{x:(105*32)+16,y:(88*32)+16}],
    ["ArmorGhost",{x:(112*32)+16,y:(91*32)+16}],
    ["Crow",{x:(116*32)+16,y:(86*32)+16}],
    ["Crow",{x:(117*32)+16,y:(90*32)+16}],

    //Tierra firme
    ["Zombie",{x:(118*32)+16,y:(86*32)+16}],
    ["Crow",{x:(114*32)+16,y:(91*32)+16}],
    ["Zombie",{x:(119*32)+16,y:(94*32)+16}],
    ["Crow",{x:(120*32)+16,y:(82*32)+16}],
    ["Zombie",{x:(125*32)+16,y:(90*32)+16}],
    ["Zombie",{x:(127*32)+16,y:(75*32)+16}],

    //Ladrillos
    ["Crow",{x:(126*32)+16,y:(78*32)+16}],
    ["Zombie",{x:(135*32)+16,y:(94*32)+16}],
    ["Zombie",{x:(139*32)+16,y:(94*32)+16}],
    ["Zombie",{x:(132*32)+16,y:(94*32)+16}],
    ["Ghost",{x:(140*32)+16,y:(84*32)+16}],
    ["Zombie",{x:(145*32)+16,y:(94*32)+16}],
    ["Plant",{x:(146*32)+16,y:(94*32)+16}],
    ["ArmorGhost",{x:(154*32)+16,y:(94*32)+16}],

    //Edificio
    ["Zombie",{x:(162*32)+16,y:(93*32)+16}],
    ["Ghost",{x:(174*32)+16,y:(86*32)+16}],
    ["Ghost",{x:(178*32)+16,y:(84*32)+16}],
    ["Zombie",{x:(170*32)+16,y:(93*32)+16}],
    ["Zombie",{x:(180*32)+16,y:(93*32)+16}],
    ["Zombie",{x:(185*32)+16,y:(86*32)+16}],
    ["Zombie",{x:(190*32)+16,y:(86*32)+16}],
    ["Ghost",{x:(200*32)+16,y:(92*32)+16}],

    ["Crow",{x:(175*32)+16,y:(69*32)+16}],
    ["Premio",{x:(172*32)+16,y:(69*32)+16}],
    ["Plant",{x:(172*32)+16,y:(94*32)+16}],

    ["ArmorGhost",{x:(184*32)+16,y:(94*32)+16}],
    ["Plant",{x:(194*32)+16,y:(94*32)+16}],
    ["ArmorGhost",{x:(298*32)+16,y:(94*32)+16}],
    ["ArmorGhost",{x:(203*32)+16,y:(94*32)+16}],

    ["Crow",{x:(222*32)+16,y:(69*32)+16}],
    ["Vida",{x:(219*32)+16,y:(75*32)+16}],
    ["ObjHacha",{x:(224*32)+16,y:(75*32)+16}],

    //Edificio
    ["Crow",{x:(252*32)+16,y:(80*32)+16}],
    ["Crow",{x:(260*32)+16,y:(78*32)+16}],
    ["ObjArmadura",{x:(250*32)+16,y:(66*32)+16}],
    ["Zombie",{x:(250*32)+16,y:(86*32)+16}],
    ["Zombie",{x:(246*32)+16,y:(93*32)+16}],
    ["Zombie",{x:(252*32)+16,y:(93*32)+16}],
    ["Zombie",{x:(266*32)+16,y:(93*32)+16}],

    //Plataformas flotantes

    //Otra orilla
    ["Zombie",{x:(293*32)+16,y:(93*32)+16}],
    ["Ghost",{x:(294*32)+16,y:(86*32)+16}],
    ["Ghost",{x:(299*32)+16,y:(84*32)+16}],
    ["Zombie",{x:(300*32)+16,y:(93*32)+16}],
    ["Zombie",{x:(310*32)+16,y:(93*32)+16}],
    ["Zombie",{x:(293*32)+16,y:(86*32)+16}],
    ["Zombie",{x:(308*32)+16,y:(86*32)+16}],
    ["Ghost",{x:(317*32)+16,y:(92*32)+16}],
    //Llanura casas
    ["ArmorGhost",{x:(324*32)+16,y:(94*32)+16}],
    ["ArmorGhost",{x:(322*32)+16,y:(94*32)+16}],
    ["Plant",{x:(325*32)+16,y:(94*32)+16}],
    ["ArmorGhost",{x:(329*32)+16,y:(94*32)+16}],
    ["ArmorGhost",{x:(333*32)+16,y:(94*32)+16}],

    ["Crow",{x:(295*32)+16,y:(69*32)+16}],
    ["Premio",{x:(296*32)+16,y:(69*32)+16}],
    ["Plant",{x:(345*32)+16,y:(94*32)+16}],

    //Tierra antes del boss
    ["Zombie",{x:(359*32)+16,y:(94*32)+16}],
    ["Zombie",{x:(361*32)+16,y:(94*32)+16}],
     //Boss final
    ["Devil",{x:(380*32)+16,y:(92*32)+16}]
  ];
  Q.stageTMX("stage3.tmx",stage);
  stage.add("viewport").follow(Q("Player").first(),{x:true,y:true});
  stage.viewport.offset(0,120);
  backMusic.playMusic(false);
  stage.loadAssets(levelAssets);
});
});
