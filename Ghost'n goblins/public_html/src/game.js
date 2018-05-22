window.addEventListener("load",function() {
/*---------------------------CARGA DE QUINTUS---------------------------------*/
/* global Quintus */
var Q = window.Q = Quintus({ development:true,audioSupported: ['ogg','mp3'] })
                .include("Sprites, Scenes, Input, 2D, Anim,UI,TMX,Audio")//Librerias del quintus cargadas
                .setup({
                         width:   800,// Set the default width to 800 pixels
                         height:  600// Set the default height to 600 pixels
                })
                .controls()//Controles para PC
                .enableSound();//Habilita el uso de audio
Q.SPRITE_NONE=0;
Q.SPRITE_ENEMY = 4;
Q.SPRITE_PLAYER = 8;
Q.SPRITE_LANZA = 16;
Q.SPRITE_TUMBA = 32;
Q.SPRITE_PREMIO = 64;
Q.SPRITE_ANTORCHA = 128;
Q.SPRITE_DAGA = 256;
Q.SPRITE_EXPLOSION = 512;
//*-------------------------CARGA DE CONTENIDO--------------------------------*/
//Imagenes
Q.preload(["main_title.png","ArthurV2.png","zombie.png","crow.png","princess.png","burst.png", "spark.png","lance.png","plant.png", "grave0.png", "grave1.png", "grave2.png", "jar.png","marker.png","devil.png","bullet.png","shuriken.png","antorcha.png"]);
//JSON'S 
Q.preload(["ArthurV2.json", "zombie.json","crow.json", "princess.json","burst.json", "spark.json","plant.json","devil.json","bullet.json","shuriken.json","antorcha.json"]);
//Musica
Q.preload(["gngTheme.ogg","gngEndTheme.ogg","gameover.ogg","timer.ogg","insertCoin.ogg",//General
           "arthurRow.ogg","die.ogg","jumpEnd.ogg","jumpStart.ogg","putArmour.ogg","removeArmour.ogg",//Arthur
           "burst.ogg","hitGrave.ogg","doorOpen.ogg","lance.ogg","torch.ogg","treasurePickUp.ogg","weaponPickUp.ogg","extraLife.ogg",//Efectos sonoros
           "enemyHit.ogg","bossHit.ogg","bossDeath.ogg","zombieBorn.ogg","crow.ogg","crowDie.ogg"//Enemigos
       ]);
//Funcion de inicio
Q.preload(function(){
    //Compilacion del las sheets
    Q.compileSheets("ArthurV2.png","ArthurV2.json");
    //Enemigos
    Q.compileSheets("zombie.png", "zombie.json");
    Q.compileSheets("crow.png", "crow.json");
    Q.compileSheets("devil.png", "devil.json");
    Q.compileSheets("plant.png", "plant.json");
    //PNJ
    Q.compileSheets("princess.png", "princess.json");
    //Efectos
    Q.compileSheets("burst.png", "burst.json");
    Q.compileSheets("spark.png", "spark.json");
    Q.compileSheets("fire.png", "fire.json");
    //Proyectiles
    Q.compileSheets("bullet.png", "bullet.json");
    Q.compileSheets("antorcha.png", "antorcha.json");
    Q.compileSheets("shuriken.png", "shuriken.json");
    //Objetos
    Q.compileSheets("antorchaMov.png", "antorchaMov.json");
    Q.compileSheets("lanzaMov.png", "lanzaMov.json");
    Q.compileSheets("cuchilloMov.png", "cuchilloMov.png");

    //Estado global de juego
    Q.state.set({ score: 0, lives: 4, //Puntuaciones
                  level:1,maxLevel:2,respX:0,respY:0, //Nivel y punto del respawn
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
    X:"frog",
    SPACE:"fire"
});
//Modo de pausa del juego
Q.input.on("pausa",function() {
    if(Q.state.get("enJuego")){
        if(Q.state.get("pause")) {
            Q.audio.play("gngTheme.ogg",{loop:true});
            Q.state.set("pause",false);
            Q.stage().unpause();
            Q.stage(2).show(false);
            Q.clearStage(3);
        }else{
            Q.audio.stop();
            Q.stage(2).show(true);
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
    extend:{
        changeLevel:function(){
                Q.state.inc("level",1);
        },
        winScreen:function(){
            Q.stage(2).show(true);
            Q.loadTMX("finalscreen.tmx", function() {
                Q.stageScene("winScreen",{label:"Has ganado!"});
            });
        },
        loseScreen:function(){
            Q.stage(2).show(true);
            Q.loadTMX("loseScreen.tmx", function() {
                Q.stageScene("loseScreen",{label:"Game Over! \n Pulsa enter para volver al menu principal"});
            });
        },
        mapScreen:function(){
            Q.stage(2).show(true);
            if(Q.state.get("level")>Q.state.get("maxLevel")){
                this.winScreen();
            }else{
                Q.loadTMX("mapScreen.tmx", function() {
                   Q.stageScene("mapScreen");
               });
            }
        },
        loadLevel:function(){
            Q.loadTMX("level"+Q.state.get("level")+".tmx", function() {
               Q.stage(2).show();
               Q.stageScene("L"+Q.state.get("level"),Q("Player").first());
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
        maxTime:300,
        segDesc:1,
        descuento:1,
        prisa:false,
        stopTimer:false
      });
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
            }
        }
    },
    tiempoRest:function (){
            return Q.state.get("timer");
    }
});
//Generador de recompensas
Q.component("GeneradorPremios", {
        generar: function(x,y){
            var listaPremios = [{asset: "sacoMonedas", puntos: 200}, {asset: "escudo", puntos: 400}];
            var maxPremios = listaPremios.length - 1;
            var randomPremio = Math.floor(Math.random() * (5 - 0) + 0);
            if(randomPremio <= maxPremios){
                Q.Stage().insert(new Q.Premio({x: x, y: y, asset: listaPremios[randomPremio].asset, puntos: listaPremios[randomPremio].puntos}));
            }
        }
    });

/*-----------------------------ANIMACIONES------------------------------------*/
//Animacion de Arthur
Q.animations('Arthur', {
    //Movimiento basico
    run_right: { frames: [0,1,2,3], rate: 1/5}, 
    run_left: { frames: [4,5,6,7], rate:1/5 },
    stand_right:{ frames: [2], rate:1 },
    stand_left:{ frames: [6], rate:1 },
    //Salto
    jump_right:{ frames: [8,9], rate:1/2,loop:false},
    jump_left:{ frames: [15,14], rate:1/2,loop:false},
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
    zombieBorn: { frames: [0,1,2,3,4,5,6,7,8,9], next: 'zombie', trigger:"camina", rate: 1/2},
    zombieBye: { frames: [6,5,4,3,2,1,0],   next: 'zombie', trigger:"muerte", rate: 1/3}
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
//Animacion de la sangre
Q.animations('Burst', {
  burst: { frames: [0,1,2,3], next: 'burst', trigger:"muerte", rate: 1/5} 
});
//Animacion del fuego
Q.animations('Fire', {
  burning: { frames: [0,1,2,3], next: 'burning', trigger:"muerte", rate: 1/5} 
});
//Animacion de las chispas
Q.animations('Spark', {
    spark: { frames: [0,1,2], next: 'spark', trigger:"muerte", rate: 1/5} 
});
//Animacion de a princesa
Q.animations('Princess', {
    princess: { frames: [0,1,2,3], rate: 1/5} 
});
//Animacion giro antorcha
Q.animations('Torch', {
  girar: { frames: [0,1,2,3,4,5,6,7], rate: 1/5, loop:true} 
});
//Animacion de los abjetos de tipo arma
Q.animations('WeaponObj', {
  shine: { frames: [0,1,2,3],rate: 1/5,loop:true} 
});
//Animacion de los abjetos de tipo arma
Q.animations('Shuriken', {
    shuriken: { frames: [0,1],rate: 1/5,loop:true} 
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
            auto:false,//Estados
            muerto:false,
            frog:false,
            hit:false,
            jump:false,
            ArmoDestroy:false,
            armaEquipada: "lanza", //Armamento
            shootDelay:0.3,//Disparo
            shoot:0,
            frogTime:0,//Echizado
            frogMaxTime:5,
            onLadder: false,//Escaleras
            ladderX:0,
            ladderTile:0
            
        });
        this.add("2d,animation,tween");
        this.add("levelManager");
        
        this.add("Timer");
        this.p.jumpSpeed=-400;
        this.on("sensor.tile","subirEscalera");
        this.on("bump.bottom",this,"colMapa");
        this.on("dead",this,"respawn");
        this.on("nude",this,"armoDestroyed");
        this.on("bump.bottom",this,"colMapa");
        
        if(this.p.auto!==null){
            if(this.p.auto)
                this.add("aiBounce");
            else
                this.add("platformerControls");
        }
    },
    subirEscalera: function(colObj){
        if(colObj.p.ladder) { 
            this.p.onLadder = true;
            this.p.ladderX = colObj.p.x;
            this.p.ladderTile=colObj.tile;
        }      
    },
    step:function(dt){
        this.p.shoot+=dt; //Aumentamos el tiempo sin disparar
        this.Timer.step(dt);
        //Comprobamos el tiempo
        if(this.Timer.tiempoRest()<100 && !this.p.prisa)
            this.prisas();
        else if(this.Timer.tiempoRest()===0)
            this.muerto();
        if(!this.p.onLadder)
            this.p.gravity=1;
        if(!this.p.muerto){
            if(this.p.hit){
                this.animArmo();
            }else if(this.p.frog){
                this.p.jumpSpeed=-500;
                this.frogerizado(dt);//Animacion  
            }else if(this.p.onLadder){
                this.animEscalera();
                this.p.onLadder = false;
            }else{
                this.p.jumpSpeed=-400;
                this.animBase();//Animacion
            }
        }
        if(Q.inputs["fire"] && this.p.shoot>this.p.shootDelay && !this.p.frog){
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
                    if(this.p.vy!==0){
                        this.p.jump=true;
                        Q.audio.play("jumpStart.ogg",{debounce:1000});
                        this.play("jump_right");
                    }else
                        this.play("run_right");
                } else if(this.p.vx<0) {
                    if(this.p.vy!==0){
                        this.p.jump=true;
                        Q.audio.play("jumpStart.ogg",{debounce:1000});
                        this.play("jump_left");
                    }else
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
                this.play("arthurFrogRight");
        else if(this.p.vx<0) 
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
        if(collision.tile === 91)
            this.muerto();
    },
    fire:function(){
        if(this.p.armaEquipada === "lanza"){
            this.p.shoot=0;
            var vel=250;
            var mano=this.p.h/2;
            var conf=(this.p.direction ==="right")?{x:this.p.x+mano,y:this.p.y,vx:vel}:{x:this.p.x+mano,y:this.p.y,vx:-vel};
            Q.stage().insert(new Q.Lanza(conf));
        }else if(this.p.armaEquipada === "antorcha"){    
            this.p.shoot=0;
            var vel=200;
            var mano=this.p.h/2;
            //PRUEBA DE LAZAMIENTO DEL OBJCTO ANTORCHA
            var conf=(this.p.direction ==="right")?{x:this.p.x+mano,y:this.p.y,vx:vel,vy:-50,ax:0,ay:70 }:{x:this.p.x+mano,y:this.p.y,vy:-50,vx:-vel,ax:0,ay:70};
            Q.stage().insert(new Q.Antorcha(conf));
        }else if(this.p.armaEquipada === "daga"){    
            this.p.shoot=0;
            var vel=800;
            var mano=this.p.h/2;
            var conf=(this.p.direction ==="right")?{x:this.p.x+mano,y:this.p.y,vx:vel}:{x:this.p.x+mano,y:this.p.y,vx:-vel};
            Q.stage().insert(new Q.Daga(conf));
        }
    },
    hit:function(col){
        var ac=(this.p.vy>0)? {x: this.p.x-70,y:this.p.y-50}:{x: this.p.x-50};
        this.del("platformerControls");
        this.del("2d");
        this.p.type=Q.SPRITE_NONE;
        if(this.p.sheet==="arthurArmo" || this.p.sheet==="arthurArmoDuck"){
            this.p.hit=true;
            this.p.x -= col.separate[0];
            this.p.y -= col.separate[1];
            this.animate(ac,0.3);  
        }else if(this.p.sheet==="arthurNude" || this.p.sheet==="arthurNudeDuck" ||this.p.sheet==="arthurFrog")
            this.muerto();
    },
    muerto:function(){
        this.p.muerto=true;
        this.p.stopTimer=true;
        this.p.vx=0;
        this.p.type= Q.SPRITE_NONE;
        this.del("platformerControls");
        Q.audio.stop("gngTheme.ogg");
        Q.audio.play("die.ogg");
        this.p.sheet="arthurDie";
        if(this.p.direction ==="right")
                    this.play("dieArthurRight");
                else
                    this.play("dieArthurLeft");
    },
    respawn:function(){
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
        if(!this.p.frog){
            this.p.frog=true;
            this.p.speed=200;
        }
    },
    frogerizado:function(dt){
        if(this.p.frogTime>=this.p.frogMaxTime){
            this.p.frog=false;
            this.sheet("arthurNude",true);
            this.p.frogTime=0;
        }else{
            this.p.frogTime+=dt;
            this.animFrog();
        }
    },
    armoDestroyed:function(){
        Q.audio.play("removeArmour.ogg");
        this.sheet("arthurNude",true);
        this.add("platformerControls");
        this.add("2d");
        this.p.type=Q.SPRITE_PLAYER;
        this.p.hit=false;
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
            flip: "x",
            reload:0,
            timeReload:3,
            life:30,
            type: Q.SPRITE_ENEMY,
            collisionMask: Q.SPRITE_PLAYER | Q.SPRITE_DEFAULT
        }); 
        this.add("2d,aiBounce,animation");  
        this.on("bump.top,bump.down,bump.left,bump.right","matar");
        this.on("camina","camina");
        this.on("muerte","muerte");
        this.play("zombieBorn");
    },
    matar:function(collision){
        if(collision.obj.p.type===Q.SPRITE_PLAYER) 
            collision.obj.hit(collision);
        else if(collision.tile === 40){
            this.play("zombieBye");
            this.p.vx=0;
        }   
    },
    hit: function(damage){
        this.p.life=-damage;
        if(this.p.life<=0) this.muerte();
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
            life:60,
            type: Q.SPRITE_ENEMY,
            collisionMask: Q.SPRITE_PLAYER | Q.SPRITE_DEFAULT
        }); 
        this.add("2d,aiBounce,aiBounce2,animation");  
        this.on("bump.top,bump.down,bump.left,bump.right","matar");
        this.play("crow");
    },
    matar:function(collision){
        if(collision.obj.p.type===Q.SPRITE_PLAYER) 
            collision.obj.hit(collision);
    },
    hit: function(damage){
        this.p.life=-damage;
        if(this.p.life<=0) this.muerte();
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
//Planta
Q.Sprite.extend("Plant",{ 
    init: function(p) { 
        this._super(p, { 
            vx:0,
            sheet: "plant",
            sprite: "Plant",
            lengua: false,
            frame: 0,
            reload:0,
            timeReload:3,
            life:30,
            type: Q.SPRITE_ENEMY,
            collisionMask: Q.SPRITE_PLAYER | Q.SPRITE_DEFAULT
        }); 
        this.add("2d,animation");  
        this.on("bump.top,bump.down,bump.left,bump.right","matar");
        this.play("plant");
    },
    matar:function(collision){
        if(collision.obj.p.type===Q.SPRITE_PLAYER) 
            collision.obj.hit(collision);
    },
    hit: function(damage){
        this.p.life=-damage;
        this.play("plantL");
        this.p.lengua=true;
        this.p.reload=0;
        if(this.p.life<=0) this.muerte();
    },
    muerte:function() {
        this.destroy();
    },
    step:function(dt){
        this.p.reload+=dt;

        if(this.p.reload>this.p.timeReload){
            var art = Q("Player").last();
                Q.stage().insert(new Q.Bullet({xo:art.p.x-this.p.x,yo:art.p.y-this.p.y,x:this.p.x,y:this.p.y}));
            this.p.reload=0;
            if(this.p.lengua){
                this.p.timeReload+=2,75;
                this.play("plant");
                this.p.lengua=false;
                var art = Q("Player").last();
                Q.stage().insert(new Q.Bullet({xo:art.p.x-this.p.x,yo:art.p.y-this.p.y,x:this.p.x,y:this.p.y}));
            }
            else{
                this.p.timeReload-=2,75;
                this.play("plantL");
                this.p.lengua=true;
            } 
        }
    }
}); 
//Devil
Q.Sprite.extend("Devil",{ 
    init: function(p) { 
        this._super(p, { 
            vx:250,
            vy:100,
            xo:0,
            yo:0,
            gravity: 0,
            reload:0,
            timeReload:0.5,
            oculto:false,
            sheet: "devil",
            sprite: "Devil",
            frame: 0,
            flip: "x",
            life:120,
            type: Q.SPRITE_ENEMY,
            collisionMask: Q.SPRITE_PLAYER | Q.SPRITE_DEFAULT
        }); 
        this.add("2d,aiBounce,aiBounce2,animation");  
        this.on("bump.top,bump.down,bump.left,bump.right","matar");
        this.play("devil");
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
        this.destroy();
    },
    step:function(dt){
        this.p.reload+=dt;
        var art = Q("Player").last();
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
            Q.stage().insert(new Q.Shuriken({xo:art.p.x-this.p.x,yo:art.p.y-this.p.y,x:this.p.x,y:this.p.y}));
        }
        else if(2<rnd && rnd<5){ //Teletransporta
            if(this.p.xo<0) this.p.vx*=-1;  
            this.p.vy= this.p.vx*(this.p.yo/this.p.xo)+20;  
            this.play("devilFly");
        }
        else if(5<rnd && rnd<7){ //Oculta
            this.play("devilHide");
            this.p.oculto=true;
        }

       if(this.p.vx<0)this.p.flip=false;
       else this.p.flip='x';

       if(this.p.oculto) this.p.type=Q.SPRITE_DEFAULT;
       else this.p.type=Q.SPRITE_ENEMY;
    }
}); 
/*------------------------------ELEMENTOS--------------------------------------*/
//Lanza de Arthur
Q.Sprite.extend("Lanza",{
    init: function(p) {
        this._super(p, {
            asset: "lance.png",
            frame: 0, 
            gravity:0, 
            damage: 30,
            vx:201,         
            type: Q.SPRITE_LANZA,
            collisionMask: Q.SPRITE_TUMBA | Q.SPRITE_ENEMY 
        }); 
        this.add('2d');
        this.on("bump.top,bump.bottom,bump.left,bump.right","kill");
        Q.audio.play("lance.ogg");
        if(this.p.vx < 0){
            this.p.flip = "x";
        }                    
    },
    kill: function(collision){
        if(collision.obj.p.type===Q.SPRITE_ENEMY){
            Q.stage().insert(new Q.Burst({x:collision.obj.p.x,y:collision.obj.p.y}));
            collision.obj.hit(this.p.damage);
        } else if(collision.obj.p.type===Q.SPRITE_TUMBA) 
            Q.stage().insert(new Q.Spark({x:collision.obj.p.x,y:collision.obj.p.y}));

        this.destroy();
    }
 });
//Daga
Q.Sprite.extend("Daga",{
    init: function(p) {
        this._super(p, {
            asset: "cuchilloHUD.png",
            frame: 0, 
            gravity:0, 
            damage: 70,
            vx:201,         
            type: Q.SPRITE_DAGA,
            collisionMask: Q.SPRITE_TUMBA | Q.SPRITE_ENEMY 
        }); 
        this.add('2d');
        this.on("bump.top,bump.down,bump.left,bump.right","kill");
        Q.audio.play("lance.ogg");
        if(this.p.vx < 0){
            this.p.flip = "x";
        }                    
    },

    kill: function(collision){
        if(collision.obj.p.type===Q.SPRITE_ENEMY){
            Q.stage().insert(new Q.Burst({x:collision.obj.p.x,y:collision.obj.p.y}));
            collision.obj.hit(this.p.damage);
        } else if(collision.obj.p.type===Q.SPRITE_TUMBA) 
            Q.stage().insert(new Q.Spark({x:collision.obj.p.x,y:collision.obj.p.y}));

        this.destroy();
    }
 });
//Antorchas
Q.MovingSprite.extend ( "Antorcha" , {
    init: function(p) {
        this._super(p, {
            sheet: "antorcha",
            sprite: "Torch",
            gravity:0, 
            damage: 50,        
            type: Q.SPRITE_ANTORCHA,
            collisionMask: Q.SPRITE_TUMBA | Q.SPRITE_ENEMY | Q.SPRITE_DEFAULT
        }); 
        this.add('2d, animation');
        this.on("bump.top,bump.bottom,bump.left,bump.right","kill");
        Q.audio.play("torch.ogg");
        this.play('girar');
    },

    kill: function(collision){
        if(collision.obj.p.type===Q.SPRITE_ENEMY){
            Q.stage().insert(new Q.Fire({x:collision.obj.p.x,y:collision.obj.p.y}));
            collision.obj.hit(collision.obj.p);
        }else if(collision.obj.p.type !== Q.SPRITE_EXPLOSION){
            Q.stage().insert(new Q.Fire({x:this.p.x,y:this.p.y}));
        }

        this.destroy();
    }
});
//Tumbas saltables
/*Tamaños de las tuambas para calcular su centro y colocar la base en el suelo
 * grave0:44x40
 * grave1:36x40
 * grave2:38x42
 */
Q.Sprite.extend("Tumba",{
    init: function(p) {
        this._super(p, {
            asset: "grave0.png", 
            gravity: 0,
            type: Q.SPRITE_TUMBA,
            collisionMask: Q.SPRITE_PLAYER | Q.SPRITE_TILES
        }); 
        this.add('2d');
        this.p.static = true;                   
    }
 });
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
            gravity: 0,
            frame: 0,
            type: Q.SPRITE_EXPLOSION
        }); 
        this.add("2d,animation");  
        this.play("burning");
        this.on("muerte", "muerte");
    },

    muerte:function() {
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

    kill: function(collision){
        this.destroy();
        if(collision.obj.p.type===Q.SPRITE_PLAYER){
            Q.stage().insert(new Q.Burst({x:collision.obj.p.x,y:collision.obj.p.y}));
            collision.obj.hit(collision);
        } else if(collision.obj.p.type===Q.SPRITE_DEFAULT) 
            Q.stage().insert(new Q.Spark({x:collision.obj.p.x,y:collision.obj.p.y}));
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

    kill: function(collision){
        this.destroy();
        if(collision.obj.p.type===Q.SPRITE_PLAYER){
            Q.stage().insert(new Q.Burst({x:collision.obj.p.x,y:collision.obj.p.y}));
            collision.obj.hit(collision);
        } else if(collision.obj.p.type===Q.SPRITE_DEFAULT) 
            Q.stage().insert(new Q.Spark({x:collision.obj.p.x,y:collision.obj.p.y}));
    }
 });
/*----------------------------------Premios---------------------------------------*/
//Default de recompensa
Q.Sprite.extend("Premio",{
    init: function(p) {
        this._super(p, {
            asset: "", 
            puntos: 0,  
            gravity: 0,     
            type: Q.SPRITE_PREMIO,
            collisionMask: Q.SPRITE_PLAYER | Q.SPRITE_DEFAULT
        }); 
        this.add('2d'); 
        this.p.static = true;  
        this.on("bump.top,bump.down,bump.left,bump.right","take");                   
    },
    take: function(collision){
        if(collision.obj.p.type === Q.SPRITE_PLAYER){
           //actualizar puntos
           this.destroy();
        }
    }
 });

Q.Sprite.extend("ObjAntorcha",{
    init: function(p) {
        this._super(p, {
            sheet: "antorchaMov", 
            sprite: "WeaponObj",
            puntos: 0,  
            gravity: 0,     
            type: Q.SPRITE_PREMIO,
            collisionMask: Q.SPRITE_PLAYER | Q.SPRITE_DEFAULT
        }); 
        this.add('2d,animation'); 
        this.play("shine");
        this.p.static = true;  
        this.on("bump.top,bump.down,bump.left,bump.right","take");                   
    },
    take: function(collision){
        if(collision.obj.p.type === Q.SPRITE_PLAYER){
            collision.obj.p.armaEquipada = "antorcha";
            this.destroy();
        }
    }
 });

Q.Sprite.extend("ObjDaga",{
    init: function(p) {
        this._super(p, {
            sheet: "cuchilloMov", 
            sprite: "WeaponObj",
            puntos: 0,  
            gravity: 0,     
            type: Q.SPRITE_PREMIO,
            collisionMask: Q.SPRITE_PLAYER | Q.SPRITE_DEFAULT
        }); 
        this.add('2d,animation'); 
        this.play("shine");
        this.p.static = true;  
        this.on("bump.top,bump.down,bump.left,bump.right","take");                   
    },
    take: function(collision){
        if(collision.obj.p.type === Q.SPRITE_PLAYER){
            collision.obj.p.armaEquipada = "daga";
            this.destroy();
        }
    }
 });

Q.Sprite.extend("ObjLanza",{
    init: function(p) {
        this._super(p, {
            sheet: "", 
            sprite: "",
            puntos: 0,  
            gravity: 0,     
            type: Q.SPRITE_PREMIO,
            collisionMask: Q.SPRITE_PLAYER | Q.SPRITE_DEFAULT
        }); 
        this.add('2d,animation'); 
        this.play();
        this.p.static = true;  
        this.on("bump.top,bump.down,bump.left,bump.right","take");                   
    },
    take: function(collision){
        if(collision.obj.p.type === Q.SPRITE_PLAYER){
            collision.obj.p.armaEquipada = "lanza";
            this.destroy();
        }
    }
 });

Q.Sprite.extend("ObjArmadura",{
    init: function(p) {
        this._super(p, {
            asset: "armour.png",
            puntos: 0,  
            gravity: 0,     
            type: Q.SPRITE_PREMIO,
            collisionMask: Q.SPRITE_PLAYER | Q.SPRITE_DEFAULT
        }); 
        this.add('2d'); 
        this.p.static = true;  
        this.on("bump.top,bump.down,bump.left,bump.right","take");                   
    },
    take: function(collision){
        if(collision.obj.p.type === Q.SPRITE_PLAYER){
            collision.obj.p.sheet = "arthurArmo";
            this.destroy();
        }
    }
 });
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
  stage.show= function(state){
          this.hidden=state;
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
        Q.loadTMX("level2.tmx", function() {
            Q.stageScene("L1",Q("Player").first());
            Q.stageScene("HUD",2);
            Q.input.off("confirm");
        });
    });
});
//Pantalla de perdido
Q.scene("loseScreen",function(stage){
    Q.stage(2).show(true);
    Q.state.set("enJuego",false);
    Q.audio.stop();
    Q.audio.play("gameover.ogg");
    Q.stageTMX("loseScreen.tmx",stage);
    stage.insert(new Q.UI.Text({x:Q.width/2, y: Q.height/2-100,size:32,color: "#ffffff",label: stage.options.label }));
    Q.input.on("confirm",this,function(){
        Q.loadTMX("mainMenu.tmx", function() {
            Q.stageScene("initScreen");
        });
    });
});
//Pantalla de ganado
Q.scene("winScreen",function(stage){
    Q.state.set("enJuego",false);
    Q.stageTMX("finalscreen.tmx",stage);
    Q.audio.stop();
    Q.audio.play("gngEndTheme.ogg");
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
Q.scene("mapScreen",function(stage){
    var markerPos=[{},{x:(1*32)+16,y:15*32},{x:(3*32)+16,y:(14*32)+13},{x:(5*32)+14,y:(14*32)+11},{x:(6*32)+12,y:(14*32)+10},{x:(9*32)+6,y:(14*32)+10},{x:(10*32)+20,y:(14*32)+5},{x:(10*32)+20,y:(14*32)+5}];
    Q.stage(2).show(false);
    Q.state.set("enJuego",false);
    Q.stageTMX("mapScreen.tmx",stage);
    stage.insert(new Q.Marker(markerPos[Q.state.get("level")]));
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
// Create a new scene called level 1
Q.scene("L1",function(stage) {
  Q.stageTMX("level2.tmx",stage);
  Q.state.set("enJuego",true);
  //stage.insert(new Q.Devil({x:(25*32)+16,y:(15*32)+16}));
  stage.add("viewport").follow(Q("Player").first(),{x:true,y:true});
  stage.viewport.offset(0,204);
  Q.audio.play("gngTheme.ogg",{loop:true});
});
});
