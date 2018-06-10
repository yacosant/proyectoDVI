# PROYECTO FINAL DVI

## EL JUEGO: Ghosts 'n Goblins
![Logo](/md/ghost-and-goblins.jpg)

## Descripción
Fue creado por Capcom.
El jugador controla a un caballero, llamado **Sir Arthur**, que tiene la habilidad de arrojar lanzas, dagas, antorchas, hachas y otras armas con las que debe derrotar a zombis, demonios y otras criaturas fantasmagóricas para poder salvar a la princesa Prin-Prin.


## Objetivo del juego
El objetivo del juego consiste en superar los niveles y rescatar a la princesa.
* Se **gana** al llegar al final del mapa y vencer al Boss que ha tiene cautiva a la princesa.
* Al recibir un toque enemigo se pierde la armadura y su protección, al siguiente toque Arthur **morirá**.

## Principales mecánicas
* Utilizar tu arma principal para derrotar enemigos 
* Derrotar enemigos mientras avanzas  recolectando objetos que te darán puntos y armas nuevas.
* Llegar al final del juego y derrotar al jefe final.

## Personajes

**Sir Arthur**: Personaje principal, es el caballero que se enfrenta a las legiones de los muertos vivientes y varias otras criaturas sobrenaturales. Arturo ha enfrentado valientemente a poderosos señores demonios, como Astaroth, Lucifer y Sardius, y vivió para contarlo.

**Princesa** Prin-Prin, que ha de ser rescatada para superar el juego.

*Enemigos*


**Zombie:** El enemigo común en toda la aventura. Muy débil. Muere con un impacto de lanza. Aparecen de la nada resurgiendo del suelo cuando menos te lo esperas.


**Cuervos:** Los azules vuelan en círculos y los rojos directamente hacia ti. 


**Mago:** Mago alado que se aparecerá ante nosotros con el objetivo de convertirnos en *rana* lanzandonos un hechizo.


**Planta:** Vegetal inmovil que nos hará la vida imposible lanzandonos bolas.


**Caballero Volador:** Enemigo con armadura que intentará cortarnos el paso surcando los cielos siguiendo una trayectoria oscilante.

**Fantasma:** Tenebroso enemigo que se desplaza volando en horizontal y nos atacará con su lanza.

*Jefes*

**Demonio rojo:** Es quien secuestra a nuestra amada princesa. Es fuerte, rápido y nos lanzará shurikens voladores. Debes seguir de cerca su vuelo para poder atacar en el momento preciso.


### NIVELES 
![niveles](/md/niveles.gif)

Nuestro juego se desarrolla en uno de los siete niveles que dispone el juego original,  el cementerio y el bosque.
 
**El cementerio y el bosque**
En el cementerio lucharás contra zombies que salen del suelo, contra plantas que te lanzan ojos y contra gárgolas voladoras que te harán las cosas difíciles. 

Una vez en el bosque, lucharás contra caballeros oscuros, espectros armados con arpones y contra el Cíclope, el malo final que tendrás que vencer para pasar al siguiente nivel.

## IMPLEMENTACIÓN
La implementación se ha hecho mediante el motor de videojuegos *Quintus*.

Sigue el siguiente *flujo*:
* Carga de QUINTUS (audio,sheets,etc)
* Carga del menú principal
* Carga del nivel 1
* Bucle de juego
1. Si el jugador muere pero le quedan vidas: Carga el la pantalla del mapa y después reinicia el nivel en el último punto de salvado
2. Si no le quedan vidas: Carga la pantalla de fin de partida dando la posibilidad de volver al menú principal
3. Si el jugador llega al final de nivel: Se carga la pantalla del victoria

### ELEMENTOS PRINCIPALES
1. **Arthur**

2. **Enemigos** explicados previamente

3. **Armas:** 
	* Lanza
	* Daga 
	* Antorcha
	* Hacha
	
4. **Otros elementos:**
	* Proyectiles de enemigos
	* Chispas
	* Sangre 
	* Plataforma
	* Tumbas
	
5. **Elementos generados:**
	* Bustos
	* Items de Armas
	* Vida extra
	* Armadura
	
### MEJORAS LLEVADAS A CABO DESDE LA PRESENTACIÓN
1. Añadir nuevos enemigos:
	* Caballero con armadura
	* Fantasma
	* Mago que nos convierte en rana

2. Añadir HUD original

3. Inclusion de Font original

4. Extension del mapa 

5. Inclusion de trucos ocultos para facilitar la partida

6. Corrección de bugs

7. Mejora de mecanicas existentes

## TRUCOS
Teclas para activarlos:
```	
		1-4:armas
		5:armadura
		6:vida
		X:modo rana
```
## DESARROLLADORES
* **Andrea Martin** *(Carga del 32%)*

	- Desarrollo de las armas
	- Desarrollo del HUD
	- Creación de mapa
	- Desarrollo del generador de premios y de los respectivos elementos de premio
	
* **Jose Luis Sánchez Gárcia** *(Carga del 34%)*

	- Desarrollo total del personaje Arthur, su hoja de sprites, sus animaciones, y todas sus funcionabilidades.
	- Diseño de las tiles del mapa y su posterior creación
	- Organización general del flujo
	- Parte visual: css y fonts
	
* **Yaco Alejandro Santiago Pérez** *(Carga del 34%)*

	- Desarrollo de la totalidad de los enemigos del juego junto con sus respectivos sprites, animaciones, comportamientos y componentes.
	- Desarrollo de todas las armas enemigas y sus respectivos sheets y comportamientos.
	- Desarrollo completo de elemntos adicionales como lanza, brillos, sangre, plataforma movil, proyectiles enemigos.
	- Pequeñas gestiones y planificaciones
	
	

## RECURSOS Y FUENTES
Sprites obtenidos de la web www.spriters-resources.com y de screenshots de gameplays y juego original.
