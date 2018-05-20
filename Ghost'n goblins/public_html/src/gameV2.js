
window.addEventListener("load",function() {

// Load and init audio files.
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
Q.SPRITE_NONE=0;
Q.SPRITE_ENEMY = 4;
Q.SPRITE_PLAYER = 8;
Q.SPRITE_LANZA = 16;
Q.SPRITE_TUMBA = 32;
Q.SPRITE_PREMIO = 64;
Q.SPRITE_ANTORCHA = 128;
Q.SPRITE_DAGA = 256;
Q.SPRITE_EXPLOSION = 512;

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
               Q.stageScene("L"+Q.state.get("level"),Q("Arthur").first());
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

Q.scene("level1",function(stage) {
  Q.stageTMX("level1.tmx",stage);

  stage.add("viewport").follow(Q("Player").first());
});

Q.Sprite.extend("Arthur",{
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
            ArmoDestroy:false,
            armaEquipada: "lanza", //Armamento
            shootDelay:0.3,//Disparo
            shoot:0,
            frogTime:0,//Echizado
            frogMaxTime:5,
            onLadder: false,
            ladderX:0
            
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
          }
    },
    step:function(dt){
        if(!this.p.subiendoEscalera){
            this.p.shoot+=dt; //Aumentamos el tiempo sin disparar
            this.Timer.step(dt);
            //Comprobamos el tiempo
            if(this.Timer.tiempoRest()<100 && !this.p.prisa)
                this.prisas();
            else if(this.Timer.tiempoRest()===0)
                this.muerto();
            if(this.p.onLadder) {
                this.p.gravity = 0;

                if(Q.inputs['up']) {
                  this.p.vy = -this.p.speed;
                  this.p.x = this.p.ladderX;
                  this.play("climb");
                } else if(Q.inputs['down']) {
                  this.p.vy = this.p.speed;
                  this.p.x = this.p.ladderX;
                  this.play("climb");
                } else {
                  this.p.vy = 0;
                  this.animBase();
                }
            }
            if(!this.p.muerto){
                if(this.p.hit){
                    this.animArmo();
                }else if(this.p.frog){
                    this.p.jumpSpeed=-500;
                    this.frogerizado(dt);//Animacion  
                }else if(this.p.subiendoEscalera){
                    this.animEscalera();
                }else{
                    this.p.jumpSpeed=-400;
                    this.animBase();//Animacion
                }
            }
            if(Q.inputs["fire"] && this.p.shoot>this.p.shootDelay && !this.p.frog){
                this.fire();
            }
        }
        this.p.subiendoEscalera = false;
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
                    if(this.p.vy!==0)
                        this.play("jump_right");
                    else
                        this.play("run_right");
                } else if(this.p.vx<0) {
                    if(this.p.vy!==0)
                        this.play("jump_left");
                    else
                        this.play("run_left");
                }else{
                    if(this.p.direction ==="right"){
                        if(this.p.vy<0)
                            this.play("jump_site_right");
                        else
                            this.play("stand_right");
                    }else{
                        if(this.p.vy<0)
                            this.play("jump_site_left");
                        else
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
        this.play("arthurClimb");
    },
    colMapa:function(collision){
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
        this.p.vx=0;
        this.p.type= Q.SPRITE_NONE;
        this.del("platformerControls");
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
        this.sheet("arthurNude",true);
        this.add("platformerControls");
        this.add("2d");
        this.p.type=Q.SPRITE_PLAYER;
        this.p.hit=false;
    }
});

Q.scene("L1",function(stage) {
    //Q.stage(2).show(false);
    Q.state.set("enJuego",true);
    if(Q.state.get("respX")===0 && Q.state.get("respY")===0){
        Q.state.set("respX",(17*32));
        Q.state.set("respY",15*32);
    }
    stage.add("viewport").follow(Q('Arthur').first());
});

Q.loadTMX("level1.tmx,main_title.png,ArthurV2.png,zombie.png,crow.png,princess.png,burst.png, spark.png,lance.png,plant.png,grave0.png,grave1.png, grave2.png, jar.png,marker.png,devil.png,bullet.png,shuriken.png,antorcha.png,ArthurV2.json, zombie.json,crow.json, princess.json,burst.json, spark.json,plant.json,devil.json,bullet.json,shuriken.json,antorcha.json", function() {
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
    arthurClimbEnd:{frames:[25,26],rate:1/3,next: 'stand_right',loop:false},
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
                
Q.stageScene("L1"); 
});
});