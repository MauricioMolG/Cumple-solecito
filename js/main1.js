//==================================
// CANVAS
//==================================

const canvas = document.getElementById("sky");
const gift = document.getElementById("gift");
const ctx = canvas.getContext("2d");
const balloons=document.getElementById("balloons");

const modal=document.getElementById("modal");
const modalBody=document.getElementById("modal-body");
const closeModal=document.getElementById("close-modal");

const popSound = new Audio("assets/audio/pop.mp3");
popSound.volume = 0.35;

let lastModal="";
const happyBirthday=new Audio("assets/audio/hb.mp3")
happyBirthday.volume=.45;

const candles = document.querySelectorAll(".candle");

let candlesOff = 0;

const photos=[

    {

        img:"assets/fotos/sol1.jpeg",

        text:"De cuando estabamos en proceso de graduarnos."

    },

    {

        img:"assets/fotos/sol2.jpeg",

        text:"Creo que esta es de la vez que nos hicimos los pircings de la ceja."

    },

    {

        img:"assets/fotos/sol3.jpeg",

        text:"Una de cuando ibamos a comer helado a las bancas del unico."

    },

    {

        img:"assets/fotos/sol4.jpeg",

        text:"De aqui pa delante son de tu ultima visita."

    },

    {

        img:"assets/fotos/sol5.jpeg",

        text:"Que lindotes que nos vemos juntos, por eso la vida te mando lejos pana."

    },

    {

        img:"assets/fotos/sol6.jpeg",

        text:"Esta me gusta :3 ."

    }

];

let currentPhoto=0;

canvas.width = window.innerWidth;

canvas.height = window.innerHeight;


//==================================
// CONFIGURACIÓN
//==================================

const stars = [];

const colors = [

    "#FFFFFF",
    "#F8FBFF",
    "#FFFDF7",
    "#EAF6FF",
    "#DDEEFF"

];

const TOTAL_STARS = 220;


//==================================
// CONSTELACIÓN
//==================================

const constellationStars=[

    {x:.73,y:.08},
    {x:.76,y:.14},
    {x:.78,y:.21},
    {x:.84,y:.25},
    {x:.75,y:.30}

];

const constellationConnections=[

    [0,1],
    [1,2],
    [2,3],
    [2,4]

];

let lineOpacity=0;

let giftShown = false;

let giftOpened = false;

let constellationSparkle=[true,false,true,false,true];

let sparkleTimer=0;

//==================================
// CREAR ESTRELLAS
//==================================

function generateStars(){

    stars.length=0;

    for(let i=0;i<TOTAL_STARS;i++){

        stars.push({

            x:Math.random()*canvas.width,

            y:Math.random()*canvas.height,

            radius:Math.random()*2.5+.5,

            brightness:Math.random()*10,

            color:colors[Math.floor(Math.random()*colors.length)],

            sparkle:Math.random()<.35,

            timer:20+Math.random()*50

        });

    }

}
//==================================
// DESTELLO
//==================================

function drawSparkle(x,y,size,color){

    ctx.strokeStyle=color;

    ctx.lineWidth=1;

    ctx.beginPath();

    ctx.moveTo(x-size,y);
    ctx.lineTo(x+size,y);

    ctx.moveTo(x,y-size);
    ctx.lineTo(x,y+size);

    ctx.moveTo(x-size,y-size);
    ctx.lineTo(x+size,y+size);

    ctx.moveTo(x+size,y-size);
    ctx.lineTo(x-size,y+size);

    ctx.stroke();

}

function drawStar(x,y,radius,color,brightness,sparkle){

    ctx.beginPath();

    ctx.fillStyle=color;

    ctx.shadowBlur=brightness;

    ctx.shadowColor=color;

    ctx.arc(x,y,radius,0,Math.PI*2);

    ctx.fill();

    if(sparkle){

        drawSparkle(x,y,4,color);

    }

}
//==================================
// CONSTELACIÓN
//==================================

function drawConstellation(){

    ctx.strokeStyle=`rgba(255,255,255,${lineOpacity})`;

    ctx.lineWidth=1;

    for(let connection of constellationConnections){

        let start=constellationStars[connection[0]];

        let end=constellationStars[connection[1]];

        ctx.beginPath();

        ctx.moveTo(

            start.x*canvas.width,
            start.y*canvas.height

        );

        ctx.lineTo(

            end.x*canvas.width,
            end.y*canvas.height

        );

        ctx.stroke();

    }

    sparkleTimer++;

    if(sparkleTimer>30){

        sparkleTimer=0;

        for(let i=0;i<constellationSparkle.length;i++){

            constellationSparkle[i]=Math.random()<.35;

        }

    }

    for(let i=0;i<constellationStars.length;i++){

        let star=constellationStars[i];

        drawStar(

            star.x*canvas.width,

            star.y*canvas.height,

            3,

            "#FFD84D",

            14,

            constellationSparkle[i]

        );

    }

}

//==================================
// DIBUJAR CIELO
//==================================

function drawSky(){

    ctx.clearRect(

        0,
        0,
        canvas.width,
        canvas.height

    );

    for(let star of stars){

        star.timer--;

        if(star.timer<=0){

            star.sparkle=Math.random()<.35;

            star.timer=20+Math.random()*50;

        }

        drawStar(

            star.x,

            star.y,

            star.radius,

            star.color,

            star.brightness,

            star.radius>2 && star.sparkle

        );

    }

    drawConstellation();

}

//==================================
// REGALO
//==================================

function openGift(){

    if(giftOpened){

        return;

    }

    giftOpened=true;

    gift.classList.add("open");
    setTimeout(showBalloons,700);

}

function createBalloon(icon,color,endX,endY,delay){

    setTimeout(()=>{

        const balloon=document.createElement("div");

        balloon.className="balloon";

        balloon.innerHTML=icon;

        balloon.dataset.type=icon;

        balloon.addEventListener("click",popBalloon);

        balloon.style.background=color;

        const rect=gift.getBoundingClientRect();

        // Nace dentro de la caja
        balloon.style.left=(rect.left+rect.width/2-37)+"px";

        balloon.style.top=(rect.top+55)+"px";

        // Detrás del regalo
        balloon.style.zIndex="15";

        balloons.appendChild(balloon);

        requestAnimationFrame(()=>{

            balloon.style.opacity=1;

            balloon.style.left=(rect.left+rect.width/2-37+endX)+"px";

            balloon.style.top=(rect.top+55+endY)+"px";

        });

        // Cuando ya salió de la caja pasa al frente
        setTimeout(()=>{

            balloon.style.zIndex="25";

        },450);

        // Empieza a flotar
        setTimeout(()=>{

            balloon.style.animation="balloonFloat 3s ease-in-out infinite";

        },1000);

    },delay);

}

function showBalloons(){

    createBalloon(

        "1",

        "#7B2CBF",

        -170,

        -170,

        300

    );

    createBalloon(

        "3",

        "#C1121F",

        170,

        -170,

        1000

    );

    createBalloon(

        "2",

        "#111111",

        0,

        -240,

        1700

    );

}

function popBalloon(e){

    const balloon=e.currentTarget;

    popSound.currentTime=0;

    popSound.play();

    balloon.classList.add("pop");

    balloon.style.pointerEvents="none";

    setTimeout(()=>{

        const type=balloon.dataset.type;

        balloon.remove();

        openModal(type);

    },350);

}

function showPhoto(index){

    const img=document.getElementById("gallery-image");

    const text=document.getElementById("gallery-text");

    const counter=document.getElementById("gallery-counter");

    img.src=photos[index].img;

    text.textContent=photos[index].text;

    counter.textContent=(index+1)+" / "+photos.length;

}

function nextPhoto(){

    currentPhoto++;

    if(currentPhoto>=photos.length){

        currentPhoto=0;

    }

    showPhoto(currentPhoto);

}

function previousPhoto(){

    currentPhoto--;

    if(currentPhoto<0){

        currentPhoto=photos.length-1;

    }

    showPhoto(currentPhoto);

}

function openModal(type){

    lastModal = type;

    modal.classList.add("show");

    switch(type){

        case "1":

            modalBody.innerHTML=`

                <h2>Tu canción favorita</h2>

                <br>

                <div class="letter">
                    Esta canción la quería poner de fondo mientras recorrías la página, pero sentí que Marilyn Manson no combinaba con un cumpleaños, entonces la metí en este globito.
                    <div class="song-card">
                        <img
                            src="https://img.youtube.com/vi/QUvVdTlA23w/maxresdefault.jpg"
                            alt="Sweet Dreams">
                        <a
                            href="https://www.youtube.com/watch?v=QUvVdTlA23w"
                            target="_blank">
                            ▶ Escuchar en YouTube
                        </a>
                    </div>
                    <hr>

                    Y como aquí está tu canción favorita, me tomé el atrevimiento de poner el link de una canción que me gusta,tiene un pedacito que me recordó un poco a nuestra amistad.
                    <i>
                        "Cada vez que yo no me encuentro en mí,<br>
                        voy a vos para revivir.<br>
                        Yo voy a estar ahí,<br>
                        siempre podés venir."
                    </i>
                    Entonces me pareció chévere ponerla aquí, espero que te guste la canción y si no te gusta... pues pailas jasdjasd.
                    <a
                        href="https://youtu.be/c3aN6Tv4WLA?list=RDc3aN6Tv4WLA"
                        target="_blank">

                        La parte que te digo suena desde el 0:31 hasta el 0:42.
                    </a>

                </div>

            `;

        break;

        case "3":

            modalBody.innerHTML=`

                <h2> Para Solecito </h2>

                <br>

                <div class= "letter">

Hola, solecito. 

Como es tu cumpleaños quería darte un detallito. Sabes que vives lejos y un envío me sale carísimo jsjsjs, así que pensé que sería bonito hacerte una página con algunos de nuestros recuerdos y con tu canción favorita, presentada ahí toda exótica jsjsjs. Con ayuda de ChatGPT salió esto, espero que te guste.

Ahora sí, lo importante.

Quería decirte que nuestra amistad es algo que aprecio muchísimo. Me has visto llorar, y hace unos días yo te vi a ti. Eso, aunque suene raro, me hizo sentir más cercano a ti, porque me permitiste verte en un momento de vulnerabilidad. Obviamente no me alegra que estuvieras triste ni bajoneada jsjsjs, pero sentí que fue uno de esos momentos en los que uno conoce un poquito más a las personas.

También amo cuando vemos películas o series juntos, aunque a veces te miro por la videollamada y ya estás luchando por no quedarte dormida... o a veces soy yo el que termina cabeceando jsjsjs. Amo nuestras conversaciones, poder contarte tantas cosas y escuchar las tuyas. De hecho, a veces siento que hablo demasiado de mí, así que también me gustaría conocer más de ti, de lo que piensas, de lo que sueñas y de cómo te va con todo.

Ojalá algún día se nos dé vernos en Alemania y podamos compartir nuestros logros en persona. No todo puede ser quejarse de la vida jsjsjs.

Hay algo que admiro mucho de ti: eres una persona que sigue adelante incluso cuando las cosas no están saliendo bien. A veces pienso que eres un poquito masoquista porque siempre te vuelves a levantar y lo intentas otra vez jsjsjs, pero también creo que esa fortaleza es una de las cosas que más te caracteriza.

Y bueno, también hay cosas que siempre me han gustado de ti. Tu sonrisa, tus ojos y esa forma tan tuya de reírte y tu estilo. Pero, sobre todo, tu sentido del humor. Creo que una de las razones por las que disfruto tanto hablar contigo es que siempre terminamos riéndonos de cualquier cosa.

Pues eso, te quiero mucho, eres una parte importante de mi vida y pues...

Feliz cumpleaños, te quiero mucho solecito.

P. D.: Pico en la frente :3 .                    

                </div>

            `;

        break;

        case "2":

            modalBody.innerHTML=`

                <h2> Algunos recuerdos, queria poner un pantallaso de las video, pero no encontre </h2>

                <br>

                <div class="gallery">

                    <img id="gallery-image">
                    <p id="gallery-text"></p>
                    <div class="gallery-buttons">
                        <button onclick="previousPhoto()">

                            ◀
                        </button>

                        <span id="gallery-counter"></span>
                    
                        <button onclick="nextPhoto()">

                            ▶
                    
                        </button>

                    </div>
                
                </div>

            `;
            currentPhoto = 0;
            showPhoto(currentPhoto);

        break;

    }

}

function startBirthday(){

    happyBirthday.currentTime = 0;

    happyBirthday.play();

    gift.classList.add("fade");

    setTimeout(()=>{

        gift.style.display = "none";

        document.getElementById("birthday").classList.add("show");

    },800);

}

//==================================
// ANIMACIÓN
//==================================

function animate(){

    if(lineOpacity<1){

        lineOpacity+=0.004;

    }

    else if(!giftShown){

        giftShown=true;

        gift.classList.add("show");

    }

    drawSky();

    requestAnimationFrame(animate);

}

generateStars();

animate();

gift.addEventListener("click",openGift);

closeModal.addEventListener("click",()=>{

    modal.classList.remove("show");

    if(lastModal=="3"){

        startBirthday();

    }

});

window.addEventListener("resize",()=>{

    canvas.width=window.innerWidth;

    canvas.height=window.innerHeight;

    generateStars();

});

//velas
candles.forEach(candle=>{

    candle.addEventListener("click",()=>{

        const flame = candle.querySelector(".flame");

        if(flame.classList.contains("off")) return;

        flame.classList.add("off");

    });

});
