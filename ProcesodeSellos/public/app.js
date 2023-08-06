import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import {getDatabase, ref, set, child, get, onValue, update, push } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js"

 // TODO: Add SDKs for Firebase products that you want to use
      // https://firebase.google.com/docs/web/setup#available-libraries
    
      // Your web app's Firebase configuration
      const firebaseConfig = {
        apiKey: "AIzaSyAOiGV5JPppbGFjj0NPPJ9KKKY-xJkR0yw",
        authDomain: "proceso-de-sellos.firebaseapp.com",
        databaseURL: "https://proceso-de-sellos-default-rtdb.firebaseio.com",
        projectId: "proceso-de-sellos",
        storageBucket: "proceso-de-sellos.appspot.com",
        messagingSenderId: "122213800085",
        appId: "1:122213800085:web:6e8b2edae2b8bc76fea39c"
      };
    
      // Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

const botonGoogle = document.querySelector('#loginGoogle')
const starCountRef = [];
const inicia = document.querySelector('#iniciar');
let maquina = document.getElementById("maquinaMovi");
let cuboPeq = document.getElementById("cuboPeq");
let cuboGran = document.getElementById("cuboGran");
let sensores = document.getElementsByClassName("Sen");
let velocidad = 1;
let mTop=0;
let leftPeq=25;
let leftGran=10;
let comprobar_;
let dist=44;
let sensores_ = [];
let band=true;
var id1;
const dbRef = ref(db);

get(child(dbRef, `id/cont`)).then((snapshot) => {
    id1 = snapshot.val();

  }).catch((error) => {
    console.error(error);
  });



botonGoogle.addEventListener('click',async ()=>{  //login de google 
    
    const provider = new GoogleAuthProvider();

    try 
    {
        const credentials = await signInWithPopup(auth, provider)
        agregarUsuarioBD(credentials.user)
        $('#loginGoogle').hide();
        nombreUsuario(credentials.user.displayName)
        $('#iniciar').show()
    }
    catch (error) 
    {
        console. log (error)
    }
})

function agregarUsuarioBD(user) //agrega el usuario ingresado a la base de datos 
{ 
    set(ref(db, 'usuarios/' + user.uid), {
      username: user.displayName,
      email: user.email,
      profile_picture : user.photoURL
    });
  }

  
function nombreUsuario(nombreUsuario)  //agrega el nombre del Usuario
{
        var div =  document.getElementById("nombre")
        div.className = "nombreUsuario"
        var nombre = document.createElement("b")
        nombre.className = "textoNombre"
        var texto = document.createTextNode(nombreUsuario)  
        nombre.appendChild(texto)
        div.appendChild(nombre)
}

inicia.addEventListener('click',iniciar);

function iniciar(){
    if(band){
        setSen();
        inicializarSen();
        comprobar_ = setInterval(comprobar,100)
        let aux = id1 + 1;
        set(ref(db, 'id'), { cont: aux});
        band=false;
    }    
}
function setSen(){
    set(ref(db, 'Sensores'+id1+'/sensor1'), { sensor: false });
    set(ref(db, 'Sensores'+id1+'/sensor2'), {    sensor: false  });
    set(ref(db, 'Sensores'+id1+'/sensorA0'), {   sensor: true });
    set(ref(db, 'Sensores'+id1+'/sensorA1'), {  sensor: false });
    set(ref(db, 'Sensores'+id1+'/sensorA2'), { sensor: false });
    set(ref(db, 'Sensores'+id1+'/sensorD'), { sensor: false });
    set(ref(db, 'Sensores'+id1+'/sensorU'), { sensor: false });
    set(ref(db, 'Sensores'+id1+'/motor'), {  sensor: true  });    
}
function inicializarSen(){
    starCountRef[0] = ref(db, 'Sensores'+id1+'/sensor1');
    starCountRef[1] = ref(db, 'Sensores'+id1+'/sensor2');
    starCountRef[2] = ref(db, 'Sensores'+id1+'/sensorA0');
    starCountRef[3] = ref(db, 'Sensores'+id1+'/sensorA1');
    starCountRef[4] = ref(db, 'Sensores'+id1+'/sensorA2');
    starCountRef[5] = ref(db, 'Sensores'+id1+'/sensorD');
    starCountRef[6] = ref(db, 'Sensores'+id1+'/sensorU');
    starCountRef[7] = ref(db, 'Sensores'+id1+'/motor');
}
function comprobar(){       
    for(let i=0; i<8 ; i++){
        onValue(starCountRef[i], (snapshot) => {
            sensores_[i] = snapshot.val();
        });
    } 
    for(let i=0; i<8 ; i++){
        if(sensores_[i].sensor){
            sensores[i].style.backgroundColor = "red"
        }else{
            sensores[i].style.backgroundColor = "rgb(65, 65, 104)"
        }
    }    
    if(sensores_[0].sensor){
        if(!sensores_[4].sensor && sensores_[5].sensor){
            movAbj(52);
        }else{
            movArr()
        }        
    }else if(sensores_[1].sensor){
        if(!sensores_[3].sensor && sensores_[5].sensor){
            movAbj(23);
        }else{
            movArr()
        }
    }else{
        moverCubos(dist);
    }
}

function moverCubos(t){
    leftPeq +=velocidad-0.5;
    leftGran +=velocidad-0.5;
    if(leftPeq==t){
        set(ref(db, 'Sensores'+id1+'/sensor1'), {  sensor : true  });
        set(ref(db, 'Sensores'+id1+'/sensorA0'), {  sensor : false  });
        set(ref(db, 'Sensores'+id1+'/motor'), {  sensor : false  });
        set(ref(db, 'Sensores'+id1+'/sensorD'), {  sensor : true  });        
    }else if(leftGran==t) {
        set(ref(db, 'Sensores'+id1+'/sensor2'), {  sensor : true  });
        set(ref(db, 'Sensores'+id1+'/sensorA0'), {  sensor : false  });
        set(ref(db, 'Sensores'+id1+'/motor'), {  sensor : false  });
        set(ref(db, 'Sensores'+id1+'/sensorD'), {  sensor : true  });        
    }else if(leftPeq==80){
        leftPeq=25;
        leftGran=10;
        cuboPeq.style.left = leftPeq + "%"; 
        cuboGran.style.left = leftGran + "%";
        dist=44;
    }
    else {
        cuboPeq.style.left = leftPeq + "%"; 
        cuboGran.style.left = leftGran + "%";
    }
}
function movAbj(t){  
    if(mTop<t){
        mTop += velocidad;
        maquina.style.marginTop = mTop +"px";
    }else {
        if(t==52){
            dist=42;
            set(ref(db, 'Sensores'+id1+'/sensorA2'), {  sensor : true  });
        }else{            
            set(ref(db, 'Sensores'+id1+'/sensorA1'), {  sensor : true  });
        }
        set(ref(db, 'Sensores'+id1+'/sensorD'), {  sensor : false  });
    }
}
function movArr(){  
    if(mTop>=1){
        mTop -= velocidad;
        maquina.style.marginTop = mTop +"px";
        set(ref(db, 'Sensores'+id1+'/sensorA1'), {  sensor : false  });
        set(ref(db, 'Sensores'+id1+'/sensorA2'), {  sensor : false  });
        set(ref(db, 'Sensores'+id1+'/sensorU'), {  sensor : true  });        
    }else {
        set(ref(db, 'Sensores'+id1+'/sensorA0'), {  sensor : true  });
        set(ref(db, 'Sensores'+id1+'/motor'), {  sensor : true  });
        set(ref(db, 'Sensores'+id1+'/sensor1'), {  sensor : false  });
        set(ref(db, 'Sensores'+id1+'/sensor2'), {  sensor : false  });
        set(ref(db, 'Sensores'+id1+'/sensorU'), {  sensor : false  });
    }
}