let formHTMLRef = document.getElementById('formHTML');

formHTMLRef.addEventListener('submit', function (event) {
  event.preventDefault();
  //Obtener valores del formulario
  let formHTMLValue = new FormData(formHTMLRef);
  //Crear un Objeto Cliente el cul tiene todos los datos
  let _client = myDataClient(formHTMLValue);
  //Guradar datos en el localStorage
  updateDataClient(_client);
  cleanRegister();
  fillRegister(_client);
});

document.querySelector('#data_producto').addEventListener("click", function(event) {
  event.preventDefault();
  if(event.target.matches('.del')){
    //Obtener valores del formulario
    let formHTMLValue = new FormData(formHTMLRef);
    //Cliente
    let _client = myDataClient(formHTMLValue);
    //indice del producto
    var productIndex = event.target.parentNode.dataset.index_p;
    delete_ObjArray(_client, productIndex);
    cleanRegister();
    fillRegister(_client)
    event.target.parentNode.remove();
  }

  if(event.target.matches('.card-btn-cancel')){
    cleanRegister();
  }
});

function cleanRegister(){
    if (document.querySelector("#data-client")){
        //delete allchild that have old text
        let parentClient=document.getElementById("data-client");
        removeAllChildNodes(parentClient);
    }else{
	//Element not exist
	console.warn('Elements client not found and delete');
  }

  if (document.querySelector("#data_producto")){
    //delete allchild that have old text
    let parentProducto=document.getElementById("data_producto");
    removeAllChildNodes(parentProducto);
  }else{
  //Element not exist
  console.warn('Element producto not found');
  }

  function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
  }
}

function delete_ObjArray(objectClient, productNumber){
  //Obtener valores del localStorage en txt
  //Restart array OBJ
  let arrayRequest = JSON.parse(localStorage.getItem("Request")) || []; 
  //Data helpes
  let newArrayProduct = [], client; console.log('productNumber',productNumber);
  //Find client
  if (arrayRequest[0]!=undefined){
    client = arrayRequest.findIndex((element)=>{
      return element.IdentificationID === objectClient.IdentificationID; //'Find client for object property'
    }); 
      if (client!=-1 && arrayRequest[client].productos[0]!=undefined) {
        if (productNumber!=undefined){
          //Find product
          for (let x = 0; x < arrayRequest[client].productos.length; x++) {
            if (x != productNumber) { 
              newArrayProduct.push(arrayRequest[client].productos[x]); 
            }
          }
          //update arrayRequest
          arrayRequest[client].productos=newArrayProduct;
        }else{
          console.warn('ERROR WITH INDEX PRODUCT:',productNumber,'not fund');
        }
      }else{
        console.warn('2-> NOT EXIST THIS PRODUCT ON THE LIST.');
      }
  }else{
    console.warn('1-> SORRY, PROBLEMS WITH CLIENT OR REQUEST.');
    console.warn('List data client[', arrayRequest[0],'] | number request[',productNumber,']');
  }
    //Convertir en txt mi arreglo de objetos
    //Guardar arreglo de objetos en localStorage
     localStorage.setItem("Request", JSON.stringify(arrayRequest));
}

function myDataClient(formHTMLValue) {
  NameClient = formHTMLValue.get('NameClient'),
    IdentificationID = formHTMLValue.get('IdentificationID'),
    Phone = formHTMLValue.get('Phone'),
    email = formHTMLValue.get('email'),
    Categoria = formHTMLValue.get('Categoria')
    
  return {
    'NameClient': NameClient,
    'IdentificationID': IdentificationID,
    'Phone': Phone,
    'email': email,
    'Categoria': Categoria,
    "productos" : [{"nameProducto" : formHTMLValue.get('Producto'),
                    "Unidad_de_medida" : formHTMLValue.get('Unidad_de_medida'),
                     "Cantidad" : formHTMLValue.get('Cantidad')}]
  };
}

function updateDataClient(dataClient) {
  //Obtener valores del localStorage en txt
  //Restart array OBJ
  let arrayRequest = JSON.parse(localStorage.getItem("Request")) || []; 

  if (arrayRequest[0] == undefined) {
    arrayRequest.push(dataClient);
  } else {
    if ( dataClient.IdentificationID != '' && dataClient.NameClient != '' && dataClient.nameProducto != '') {
      var resIndexClient = arrayRequest.findIndex((element)=>{
        return element.IdentificationID == dataClient.IdentificationID;
      }); 
      if(resIndexClient!=-1){
        var resIndexProduct = arrayRequest[resIndexClient].productos.findIndex((element)=>{
          return element.nameProducto === dataClient.productos[0].nameProducto;
        }); 
        console.log('222-> resIndexProduct',resIndexProduct);
        if(resIndexProduct!=-1){
          console.warn('3-> THE REQUEST FOR THIS CLIENT EXIST. Not Update arrayRequest:[]');
        }else{
          arrayRequest[resIndexClient].productos.push( ...dataClient.productos);
          console.warn('3-> THE REQUEST FOR THIS CLIENT NOT EXIST. Update arrayRequest:[', arrayRequest[resIndexClient].productos[0],']');
        } 
      }else{
        arrayRequest.push(dataClient); //Insert data Client
        console.warn('2-> THE CLIENT NOT EXIST. Update request list[', arrayRequest,']');
      } 
       
    }else{
      arrayRequest.pop(dataClient);
      console.warn('1-> FIELDS EMPTY. delete data');
    }
  }

  //Convertir en txt mi arreglo de objetos
  //Guardar arreglo de objetos
  localStorage.setItem("Request", JSON.stringify(arrayRequest));
}

function fillRegister(dataClient){
    //Obtener valores del localStorage en txt
    //Restart OBJ
    let arrayRequest = JSON.parse(localStorage.getItem("Request"));

    var numberClient = arrayRequest.findIndex((element)=>{
    return element.IdentificationID === dataClient.IdentificationID; //'Buscar por propiedad del object'
    });

    if(numberClient!=-1 && arrayRequest[0]!=undefined){
    let myDataClient = arrayRequest[numberClient];

    //Hacer referencia o enlace al elemnto en el HTML
    let elementContainerProduct = document.getElementById("data_producto"),
    elementContainerClient = document.getElementById('data-client');
  
    //Escribir texto
    let name =document.createElement("p"),
    ci=document.createElement("p"),
    phone=document.createElement("p"),
    mail=document.createElement("p"),
    category=document.createElement("p");
    name.setAttribute('class','sheet');
    ci.setAttribute('class','sheet');
    phone.setAttribute('class','sheet');
    mail.setAttribute('class','sheet');
    category.setAttribute('class','sheet');
    elementContainerClient.append(myDataClient.NameClient, name);
    elementContainerClient.append(myDataClient.IdentificationID, ci);
    elementContainerClient.append(myDataClient.Categoria, category);
    elementContainerClient.append(myDataClient.Phone, phone);
    elementContainerClient.append(myDataClient.email, mail);
    
    for(let i=0; i<myDataClient.productos.length; i++){
      var TextProduct = document.createElement("p");
      TextProduct.setAttribute('class','seet');
      TextProduct.setAttribute('data-index_p',i); //products positoin
      TextProduct.innerHTML = 1+i +" "+myDataClient.productos[i].nameProducto+" "+myDataClient.productos[i].Cantidad+" "+myDataClient.productos[i].Unidad_de_medida+" "+"<span class='del'>X</span>";
      elementContainerProduct.appendChild(TextProduct);
    }
  }else{
    console.warn("OBJECT NOT FOUD", dataClient);
  } 
}


