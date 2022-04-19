const productos = []
class Producto {
    constructor(codigo, nombre, costoDolar, ganancia) {
        this.codigo = codigo;
        this.nombre = nombre;
        this.costoDolar = parseFloat(costoDolar);
        this.ganancia = ganancia;
        this.fecha = new Date()
    }
}

//Leemos el Json lo recorremos y cargamos cada producto en productos
//luego llamamos a la funcion cargarTabla para q cargue todos los productos en el DOM
function leerJson() {
    fetch("productos1.json")
        .then(response => {
            return response.json();
        })
        .then(jsonData => {
            jsonData.forEach(p => {
                //console.log("jsondata" + JSON.stringify(p.nombre));
                let productoNuevo = new Producto(p.codigo, p.nombre, p.costoDolar, p.ganancia);
                productos.push(productoNuevo);
            })
            cargarTabla()
        })
}

// async function leerJson() {
//     const res = await fetch("productos1.json")
//     const jsonData = await res.json()
//     jsonData.forEach(p => {
//         //console.log("jsondata" + JSON.stringify(p.nombre));
//         let productoNuevo = new Producto(p.codigo, p.nombre, p.costoDolar, p.ganancia);
//         productos.push(productoNuevo);
//     })
//     // console.log("leer json: " + productos)
//     cargarTabla()
// }

async function cargarTabla() {
    let tabla = document.getElementById("tablaProductos")
    //obtenemos el valor actual del dolar en pesos
    const dolarOficial = await valorDolar()
    //console.log(dolarOficial);

    tabla.innerHTML = ""
    productos.forEach(e => {
        tabla.innerHTML += `
        <tr>
        <td>${e.fecha.toLocaleDateString()}</td>
        <td>${e.codigo}</td>
        <td>${e.nombre}</td>
        <td class="text-center">$${e.costoDolar}</td>
        <td class="text-center">$${parseFloat(e.costoDolar * dolarOficial).toFixed(2)}</td>
        <td class="text-center">${e.ganancia + "%"}</td>
        <td class="text-center table-success fw-bold">$${parseFloat((e.costoDolar * ((e.ganancia*0.01)+1))).toFixed(2)}</td>
        <td class="text-center table-primary fw-bold">$${parseFloat((e.costoDolar * ((e.ganancia*0.01)+1)) * dolarOficial).toFixed(2)}</td>
        </tr>
    `
    });
}


function agregarProducto() {
    const codigo = document.getElementById("txtCodigo")
    const nombre = document.getElementById("txtNombre")
    const costoDolar = document.getElementById("txtCostoDolar")
    const ganancia = document.getElementById("txtGanancia")
    //controlo q ese codigo q me pasa no este en uso
    //console.log(nombre);
    var productoNuevo = new Producto(codigo.value, nombre.value, costoDolar.value, ganancia.value);
    productos.push(productoNuevo);
    alertOK(nombre.value)
}


function limpiarProductoHTML() {

    const nombre = document.getElementById("txtNombre")
    const costoDolar = document.getElementById("txtCostoDolar")
    const costoPeso = document.getElementById("txtCostoPeso")
    const ganancia = document.getElementById("txtGanancia")
    const txtPVentaPeso = document.getElementById("txtPVentaPeso")
    const txtPVentaDolar = document.getElementById("txtPVentaDolar")
    const botonGuardar = document.getElementById("btnGuardar")

    nombre.value = ""
    costoDolar.value = ""
    costoPeso.value = ""
    ganancia.value = ""
    txtPVentaDolar.value = ""
    txtPVentaPeso.value = ""
    botonGuardar.disabled = false
}



function fechaSesion() {
    let ultimaFecha = localStorage.getItem("VentaDiariasSesion")
    let fecha = new Date().toLocaleString()
    let fechaSesion = document.getElementById("fechaSesion")

    if (ultimaFecha !== null) {
        //console.log("Bienvenido! Su ultima visita fue: " + ultimaFecha);
        fechaSesion.innerText = "Hola! Tu ultima visita fue el: " + ultimaFecha
    } else {
        localStorage.setItem("VentaDiariasSesion", fecha)
        //console.log("Bienvenido por primera vez!");
        fechaSesion.innerText = "Bienvenido por primera vez!"
    }
    localStorage.setItem("VentaDiariasSesion", fecha)
}


function alertOK(nombre) {
    Swal.fire({
        title: 'Producto:',
        text: `${nombre} fue agregado correctamente`,
        icon: 'success',
        confirmButtonText: 'Aceptar'
    })
}




async function valorDolar() {
    const URL = "https://v6.exchangerate-api.com/v6/2c6d5773198e6e814665ccc0/latest/USD"
    // const URL = "https://www.dolarsi.com/api/api.php?type=valoresprincipales"
    const res = await fetch(URL)
    const data = await res.json()
    //console.log(data.conversion_rates.ARS);
    return parseFloat(data.conversion_rates.ARS)
}


async function dolarToPeso() {
    const dolar = await valorDolar()
    if (txtDolar.value > 0) {
        txtPeso.value = (parseFloat(txtDolar.value) * dolar).toFixed(2)
    } else {
        txtPeso.value = ""
    }
}
async function pesoToDolar() {
    const dolar = await valorDolar()
    if (txtPeso.value > 0) {
        txtDolar.value = (parseFloat(txtPeso.value) / dolar).toFixed(2)
    } else {
        txtDolar.value = ""
    }
}

function calcularPrecioVenta() {
    if (txtGanancia.value > 0) {
        txtPVentaDolar.value = (txtDolar.value * ((txtGanancia.value * 0.01) + 1)).toFixed(2)
        txtPVentaPeso.value = (txtPeso.value * ((txtGanancia.value * 0.01) + 1)).toFixed(2)
    } else {
        txtPVentaDolar.value = ""
        txtPVentaPeso.value = ""
    }
}



async function buscar() {
    let txtCodigo = document.getElementById("txtCodigo")
    const nombre = document.getElementById("txtNombre")
    const costoDolar = document.getElementById("txtCostoDolar")
    const costoPeso = document.getElementById("txtCostoPeso")
    const ganancia = document.getElementById("txtGanancia")
    let txtPVentaDolar = document.getElementById("txtPVentaDolar")
    let txtPVentaPeso = document.getElementById("txtPVentaPeso")
    let botonGuardar = document.getElementById("btnGuardar")
    const dolar = await valorDolar()
    const producto = productos.find(p => p.codigo == txtCodigo.value)

    if (producto != undefined) {
        console.log(producto);
        nombre.value = producto.nombre
        costoDolar.value = producto.costoDolar
        costoPeso.value = (producto.costoDolar * dolar).toFixed(2)
        ganancia.value = producto.ganancia
        calcularPrecioVenta()
        botonGuardar.disabled = true

    } else {
        limpiarProductoHTML()
    }

}

async function guardar() {
    const codigo = document.getElementById("txtCodigo")
    const nombre = document.getElementById("txtNombre")
    const costoDolar = document.getElementById("txtCostoDolar")
    const costoPeso = document.getElementById("txtCostoPeso")
    const ganancia = document.getElementById("txtGanancia")
    let incompletos = []

    codigo.value.length <= 0 ? incompletos.push("CODIGO") : ""
    nombre.value.length <= 0 ? incompletos.push("NOMBRE") : ""
    costoDolar.value.length <= 0 ? incompletos.push("COSTO EN DOLAR") : ""
    costoPeso.value.length <= 0 ? incompletos.push("COSTO EN PESO") : ""
    ganancia.value.length <= 0 ? incompletos.push("GANANCIA") : ""

    if (incompletos.length > 0) {
        //console.log(...incompletos)
        //console.log(incompletos.join(" - "));
        const faltantes = incompletos.join(" - ")
        Swal.fire({
            title: 'Completar Datos:',
            text: `Debe completar los siguientes campos: ${faltantes}`,
            icon: 'warning',
            confirmButtonText: 'Aceptar'
        })
    } else {
        console.log("Listo para GUARDAR")
        agregarProducto()
        cargarTabla()
        limpiarProductoHTML()
        codigo.value = ""
    }

}



leerJson()
fechaSesion()

//Agrego EventListener en los dos txt para q cuando cambie el valor ingresado se autoconvierta de Peso a Dolar y Viceversa.
let txtDolar = document.getElementById("txtCostoDolar")
let txtPeso = document.getElementById("txtCostoPeso")
let txtGanancia = document.getElementById("txtGanancia")
let txtPVentaDolar = document.getElementById("txtPVentaDolar")
let txtPVentaPeso = document.getElementById("txtPVentaPeso")

txtDolar.addEventListener("input", dolarToPeso)
txtPeso.addEventListener("input", pesoToDolar)
txtDolar.addEventListener("input", calcularPrecioVenta)
txtPeso.addEventListener("input", calcularPrecioVenta)
txtGanancia.addEventListener("input", calcularPrecioVenta)


let botonGuardar = document.getElementById("btnGuardar")
let txtCodigo = document.getElementById("txtCodigo")
txtCodigo.addEventListener("input", buscar)
botonGuardar.addEventListener("click", guardar)







// console.log(productos)
// console.log("entro: " + productos.find(p => p.codigo == "101020"));