const $ = require('jquery');
const { ipcRenderer } = require('electron');
const Swal = require('sweetalert2');
let credenciales = null;
let productData = null;
let semaforo = null;
const imgNombre = { bueno: 'controlar.png', revisar: 'excl2.png', malo: 'cruz.png', SC: 'inte.png' };
const waitForValue = (nombreEvento) => {
  return new Promise((resolve) => {
    ipcRenderer.on(nombreEvento, (event, value) => {
      resolve(value);
    });
  });
};

var jsonData;
var juiciosTable = document.getElementById('juiciosTable');
var chequesTable = document.getElementById('chequesTable');
// Mostrar datos en el DOM

function CrearTablaConsultas() {
  let tabla = CrearTablaDinamica(["Periodo", "Cantidad"], ["titulo", "cantidad"], jsonData.consulta.find(item => item.id == 'cantidadCon').detalles);
  tabla.classList.add('fl-table');
  const modalContainer = $("#modal_containerCon");
  const tableWrapperDiv = modalContainer.find(".table-wrapper");
  tableWrapperDiv.empty();
  tableWrapperDiv.append(tabla);
}

function CrearTablaObsBa() {
  let tabla = CrearTablaDinamica(["Periodo", "Cantidad"], ["titulo", "cantidad"], jsonData.consulta.find(item => item.id == 'obsVigBA').detalles);
  tabla.classList.add('fl-table');
  const modalContainer = $("#modal_containerObs");
  const tableWrapperDiv = modalContainer.find("#ctnTablaBa");
  tableWrapperDiv.empty();
  tableWrapperDiv.append(tabla);
}

function CrearTablaObsBc() {
  let tabla = CrearTablaDinamica(["Periodo", "Cantidad"], ["titulo", "cantidad"], jsonData.consulta.find(item => item.id == 'obsVigBC').detalles);
  tabla.classList.add('fl-table');
  const modalContainer = $("#modal_containerObs");
  const tableWrapperDiv = modalContainer.find("#ctnTablaBc");
  tableWrapperDiv.empty();
  tableWrapperDiv.append(tabla);
}

document.addEventListener('DOMContentLoaded', async function () {
  await waitForValue('enviarJsonData').then((valor) => { jsonData = valor; });
  mostrarDatos();
  actualizarInfoUsuario();
  actualizarStatusBureau();
  actualizarStatusBCRA();
  cambiarIconEstado();
  CrearTablaConsultas();
  CrearTablaObsBa();
  CrearTablaObsBc();
  llenarFormulario();
  CrearObsBaDetalle();
});

function CrearTablaDinamica(nombreColumnas, nombreDatos, datos) {
  // Crea la tabla y el encabezado
  const tabla = document.createElement('table');
  const encabezado = document.createElement('thead');
  const encabezadoFila = document.createElement('tr');
  nombreColumnas.forEach((titulo) => {
    const th = document.createElement('th');
    th.textContent = titulo;
    encabezadoFila.appendChild(th);
  });
  encabezado.appendChild(encabezadoFila);
  tabla.appendChild(encabezado);
  const cuerpoTabla = document.createElement('tbody');
  datos.forEach((filaDatos) => {
    const fila = document.createElement('tr');

    nombreDatos.forEach((nombreDato) => {
      const celda = document.createElement('td');
      celda.textContent = filaDatos[nombreDato] || '-';
      fila.appendChild(celda);
    });
    cuerpoTabla.appendChild(fila);
  });
  tabla.appendChild(cuerpoTabla);
  // Devuelve la tabla en lugar de agregarla al contenedor
  return tabla;
}

function cambiarIconEstado() {
  const rutaImg = './img/';
  $('#imagenEstado').attr('src', rutaImg + imgNombre[jsonData.datosConsultado.score_veraz.estado]);
  $('#imgEstadoCheques').attr('src', rutaImg + imgNombre[jsonData.consulta.find(item => item.id == 'chequesSinFondo').estado]);
  $('#imgEstadoJuicios').attr('src', rutaImg + imgNombre[jsonData.consulta.find(item => item.id == 'juiciosComerciales').estado]);
  $('#imgEstadoBcra').attr('src', rutaImg + imgNombre[jsonData.consulta.find(item => item.id == 'statusBcra').estado]);
  $('#imgEstadoBureau').attr('src', rutaImg + imgNombre[jsonData.consulta.find(item => item.id == 'statusBureau').estado]);
  $('#imgEstadoCon').attr('src', rutaImg + imgNombre[jsonData.consulta.find(item => item.id == 'cantidadCon').estado]);
}


function actualizarInfoUsuario() {
  // Identifica los elementos en el DOM
  var nombreElemento = document.querySelector('.info-u h1');
  var edadElemento = document.querySelector('.info-u p.edad');
  var sexoElemento = document.querySelector('.info-u p.sexo');
  var poblacionElemento = document.querySelector('.info-u p.poblacion');
  var scoreElemento = document.querySelector('.info-u p.score');
  // Actualiza los contenidos de los elementos
  if (nombreElemento) {
    nombreElemento.textContent = jsonData.datosConsultado.Nombre || 'Nombre Desconocido';
  }

  if (edadElemento) {
    edadElemento.textContent = 'Edad: ' + (jsonData.datosConsultado.Edad || 'Desconocida');
  }

  if (sexoElemento) {
    var sexoTexto = '';
    switch (jsonData.datosConsultado.Sexo) {
      case 'M':
        sexoTexto = 'Masculino';
        break;
      case 'F':
        sexoTexto = 'Femenino';
        break;
      case 'S':
        sexoTexto = 'Sociedad';
        break;
      default:
        sexoTexto = 'Desconocido';
    }
    sexoElemento.textContent = 'Sexo: ' + sexoTexto;
  }

  if (poblacionElemento) {
    poblacionElemento.textContent = 'Población: ' + (jsonData.datosConsultado.Poblacion || 'Desconocida');
  }
  if (scoreElemento) {
    scoreElemento.textContent = 'Score: ' + (jsonData.datosConsultado.score_veraz.valor || 'Desconocido');
  }
}
function mostrarDatos() {
  // Cheques
  var chequesData = jsonData.consulta.find(item => item.id === 'chequesSinFondo');
  // Juicios Comerciales
  var juiciosComerciales = jsonData.consulta.find(item => item.id === 'juiciosComerciales');
  // Cantidad Com Qui
  var cantidadComQuiData = jsonData.consulta.find(item => item.id === 'cantidadComQui');

  if (chequesData) {
    var chequesHTML = '<thead><tr><th>Rechazados</th><th>Monto</th><th>Cantidad</th></tr></thead><tbody>';
    chequesData.detalles.forEach(function (detalle) {
      chequesHTML += '<tr><td>' + detalle.titulo + '</td><td>' + detalle.monto + '</td><td>' + detalle.cantidad + '</td></tr>';
    });
    chequesHTML += '</tbody>';
    chequesTable.innerHTML = chequesHTML;
  }

  if (juiciosComerciales) {
    var juiciosHTML = '<thead><tr><th>Periodo</th><th>Monto</th></tr></thead><tbody>';
    juiciosComerciales.detalles.forEach(function (detalle) {
      juiciosHTML += '<tr><td>' + detalle.titulo + '</td><td>' + detalle.valor + '</td></tr>';
    });
    juiciosHTML += '</tbody>';
    juiciosTable.innerHTML = juiciosHTML;
  }

  if (cantidadComQuiData) {
    var cantidadComQuiHTML = '<thead><tr><th>Descripción</th><th>Cantidad</th></tr></thead><tbody>';
    cantidadComQuiData.detalles.forEach(function (detalle) {
      cantidadComQuiHTML += '<tr><td>' + detalle.titulo + '</td><td>' + detalle.cantidad + '</td></tr>';
    });
    cantidadComQuiHTML += '</tbody>';
    quiebraTable.innerHTML = cantidadComQuiHTML;
  }
}

// Función para llenar las secciones del formulario con la información del JSON
function llenarFormulario() {
  // Rellenar Income Predictor
  var incomePredictorContent = document.getElementById("incomePredictorContent");
  incomePredictorContent.textContent = jsonData.datosConsultado.income_predictor;
  // Rellenar CMI
  var cmiContent = document.getElementById("cmiContent");
  cmiContent.textContent = jsonData.datosConsultado.CMI;
  // Rellenar Actividad Económica en columnas sin estilos
  var actividadEconomicaContent = document.getElementById("actividadEconomicaContent");
  actividadEconomicaContent.innerHTML = ""; // Limpiar contenido existente
  var actividadEconomicaList = document.createElement("ul");
  var actividadEconomica = jsonData.datosConsultado.actividad_economica;
  // Crear elementos li para cada propiedad de actividad económica
  for (var propiedad in actividadEconomica) {
    if (actividadEconomica.hasOwnProperty(propiedad)) {
      var listItem = document.createElement("li");
      listItem.textContent = propiedad + ": " + actividadEconomica[propiedad];
      actividadEconomicaList.appendChild(listItem);
    }
  }

  // Agregar clase para quitar estilos predeterminados
  actividadEconomicaList.classList.add("sin-estilos");
  actividadEconomicaContent.appendChild(actividadEconomicaList);

  // Rellenar Domicilios en columnas
  var domiciliosContent = document.getElementById("domiciliosContent");
  domiciliosContent.innerHTML = ""; // Limpiar contenido existente

  var domiciliosList = document.createElement("ul");
  jsonData.datosConsultado.Domicilios.forEach(function (domicilio) {
    var listItem = document.createElement("li");
    listItem.textContent = domicilio;
    domiciliosList.appendChild(listItem);
  });
  domiciliosContent.appendChild(domiciliosList);

  // Rellenar Teléfonos en columnas sin estilos
  var telefonosContent = document.getElementById("telefonosContent");
  telefonosContent.innerHTML = ""; // Limpiar contenido existente

  var telefonosList = document.createElement("ul");
  jsonData.datosConsultado.Telefonos.forEach(function (telefono) {
    var listItem = document.createElement("li");
    listItem.textContent = telefono;
    telefonosList.appendChild(listItem);
  });

  // Agregar clase para quitar estilos predeterminados
  telefonosList.classList.add("sin-estilos");
  telefonosContent.appendChild(telefonosList);
}


// Función para actualizar la información de la sección main2
function actualizarStatusBureau() {
  // Identificar los elementos en el DOM
  var statusBureauTitulo = document.querySelector('.main2 h1');
  var situacionBureauElemento = document.querySelector('.main2 h2');

  // Buscar la consulta "statusBureau" en el objeto jsonData
  var statusBureauConsulta = jsonData.consulta.find(item => item.id === 'statusBureau');

  // Actualizar los contenidos de los elementos
  /*     if (statusBureauTitulo) {
        statusBureauTitulo.textContent = 'Peor status BUREAU actual: ' + (statusBureauConsulta.detalles[0].status || 'Desconocido');
      }
     */
  if (situacionBureauElemento) {
    situacionBureauElemento.textContent = 'Situación: ' + (statusBureauConsulta.detalles[0].status || 'Desconocida');
  }
}
function actualizarStatusBCRA() {
  // Identificar los elementos en el DOM para BCRA
  var statusBCRATitulo = document.querySelector('.main3 h1');
  var totalBCRAElemento = document.querySelector('.main3 h2:nth-child(2)');
  var situacionBCRAElemento = document.querySelector('.main3 h2:nth-child(3)');

  // Buscar la consulta "statusBCRA" en el objeto jsonData
  var statusBCRAConsulta = jsonData.consulta.find(item => item.id === 'statusBcra');

  // Actualizar los contenidos de los elementos para BCRA
  if (statusBCRATitulo) {
    statusBCRATitulo.textContent = 'Peor status BCRA actual:';
  }

  if (totalBCRAElemento) {
    // Puedes actualizar el contenido con datos específicos según tu estructura de datos
    // En este ejemplo, asumimos que hay un monto en el primer detalle
    totalBCRAElemento.textContent = 'Total BCRA: $' + (statusBCRAConsulta.detalles[4].monto || 'Desconocido');
  }

  if (situacionBCRAElemento) {
    situacionBCRAElemento.textContent = 'Situación: ' + (statusBCRAConsulta.detalles[0].status || 'Desconocida');
  }
}

/*Dropdown Menu*/
$('.dropdown').click(function () {
  $(this).attr('tabindex', 1).focus();
  $(this).toggleClass('active');
  $(this).find('.dropdown-menu').slideToggle(300);
});
$('.dropdown').focusout(function () {
  $(this).removeClass('active');
  $(this).find('.dropdown-menu').slideUp(300);
});
$('.dropdown .dropdown-menu li').click(function () {
  $(this).parents('.dropdown').find('span').text($(this).text());
  $(this).parents('.dropdown').find('input').attr('value', $(this).attr('id'));
});
/*End Dropdown Menu*/
$('.dropdown-menu li').click(function () {
  var input = '<strong>' + $(this).parents('.dropdown').find('input').val() + '</strong>',
    msg = '<span class="msg">Hidden input value: ';
  $('.msg').html(msg + input + '</span>');
});

//PopUp Cheque
const $open2 = $('.open2');
const $modal_container2 = $('#modal_container2');
const $close2 = $('#close2');
$open2.click(function () {
  $modal_container2.addClass('show2');
});
$close2.click(function () {
  $modal_container2.removeClass('show2');
});
//PopUp Juicios
const $open3 = $('.open3');
const $modal_container3 = $('#modal_container3');
const $close3 = $('#close3');
$open3.click(function () {
  $modal_container3.addClass('show3');
});
$close3.click(function () {
  $modal_container3.removeClass('show3');
});
//PopUp Detalles
const $open4 = $('.open4');
const $modal_container4 = $('#modal_container4');
const $close4 = $('#close4');
$open4.click(function () {
  $modal_container4.addClass('show4');
});
$close4.click(function () {
  $modal_container4.removeClass('show4');
});


//PopUp dinamico de evolucion y composicion
$(document).ready(function () {
  const $open = $('.open');
  const $modal_container = $('#modal_container');
  const $close = $('#close');
  const $modalTitle = $('#modalTitle');
  const $modalTable = $('#modalTable');
  const $acquisitionsContainer = $('#acquisitionsContainer');
  const $acquisitionsCanvas = $('#acquisitions');

  $open.click(function () {
    const title = $(this).data('title');
    const tableType = $(this).data('table');
    const showChart = $(this).data('show-chart');

    // Cambiar el título del modal
    $modalTitle.text(title);

    // Cambiar dinámicamente la estructura de la tabla
    if (tableType === 'evolucion') {
      let datos = jsonData.consulta.find(function (consulta) {
        return consulta.id === "statusBcra";
      });
      const tabla = CrearTablaDinamica(["Periodo", "estado"], ["titulo", "status"], datos.detalles.slice(0, -1));
      tabla.id = 'modalTable';
      tabla.classList.add('fl-table');
      $('#ctn-tabla').empty();
      $('#ctn-tabla').append(tabla);

      // Mostrar el contenedor de adquisiciones solo para Evolución
      $acquisitionsContainer.show();
    } else if (tableType === 'composicion') {
      // Lógica para la tabla de Composición
      let datos = jsonData.consulta.find(function (consulta) {
        return consulta.id === "cantEntInfo";
      });
      const tabla = CrearTablaDinamica(["Periodo", "Cantidad", "Monto"], ["titulo", "cantidad", "monto"], datos.detalles);
      tabla.id = 'modalTable';
      tabla.classList.add('fl-table');
      $('#ctn-tabla').empty();
      $('#ctn-tabla').append(tabla);
      // Ocultar el contenedor de adquisiciones solo para Composición
      $acquisitionsContainer.hide();
    }

    // Mostrar u ocultar el gráfico según el botón clicado
    if (showChart) {
      // Lógica para el gráfico (puedes ajustar según tus datos y necesidades)
      (async function () {
        let datos = jsonData.consulta.find(function (consulta) {
          return consulta.id === "statusBcra";
        });
        const data = datos.detalles.slice(0, -1).reverse();

        new Chart(
          $acquisitionsCanvas[0],
          {
            type: 'line',
            data: {
              labels: data.map(row => row.titulo),
              datasets: [
                {
                  label: 'estado',
                  data: data.map(row => row.status), // Invertir los datos del eje y
                }
              ]
            }
          }
        );
      })();
    } else {
      // Ocultar el contenedor de adquisiciones si no se muestra el gráfico
      $acquisitionsContainer.hide();
    }

    $modal_container.addClass('show');
  });

  $close.click(function () {
    $modal_container.removeClass('show');
  });

  $('.btn-cerrar').on('click', function () {
    const ctnModal = $(this).closest('.ctnModal');
    console.log(ctnModal);
    ctnModal.removeClass('show2');
  })

  $('.btnOpenModal').on('click', function () {
    console.log($(this).attr("idmodal"));
    const ctnModal = $('#' + $(this).attr('idmodal'));
    console.log(ctnModal);
    ctnModal.addClass('show2');
  })

  $('#submitBtn').click(async (event) => {
    event.preventDefault();
    if ((productData && checkConfig(productData)) && (credenciales && checkConfig(credenciales))) {
      mostrarLoader();
      const respuesta = await ConsultaVeraz();
      if (respuesta.status == 'APROBAR' || respuesta.status == 'success') {
        jsonData = respuesta;
        mostrarDatos();
        actualizarInfoUsuario();
        actualizarStatusBureau();
        actualizarStatusBCRA();
        cambiarIconEstado();
        CrearTablaConsultas();
        llenarFormulario();
        CrearTablaObsBa();
        CrearTablaObsBc();
        CrearObsBaDetalle();
        ipcRenderer.send('guardarUltimaConsulta', jsonData);
      } else {
        Swal.fire({
          title: respuesta.status,
          text: respuesta.message,
          icon: respuesta.status,
        });
      }
      ocultarLoader();
    } else {
      Swal.fire({
        title: 'Error de configuración',
        text: 'Faltan configuraciones importantes, configura ahora...',
        icon: 'error',
        showCancelButton: true,
        confirmButtonText: 'Configurar ahora',
        cancelButtonText: 'Aceptar',
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = 'secciones/configuracion/index.html';
        }
      });
    }    
  })

  async function ConsultaVeraz() {
    const dni = $('#numeroInput').val();
    const sexo = $('#sexoInput').val();
    const data = {
      primaryConsumer: {
        variablesDeEntrada: {
          documento: dni,
          nombre: '',
          sexo: sexo,
        },
        personalInformation: {
          documento: dni,
          nombre: '',
          sexo: sexo,
        },
      },
    }
    ipcRenderer.send('solicitarConfig');
    waitForValue('credenciales').then((valor) => {
      credenciales = valor;
      console.log(credenciales);
    });
    waitForValue('productData').then((valor) => {
      productData = valor;
      console.log(productData);
    });
    waitForValue('semaforo').then((valor) => {
      semaforo = valor;
      console.log(semaforo);
    });
    const respuesta = FetchConsultaVeraz(data, semaforo, credenciales, productData);
    console.log(respuesta);
    return respuesta;
  }

  // Función para mostrar el loader
  function mostrarLoader() {
    document.getElementById('loader').style.display = 'flex';
  }

  // Función para ocultar el loader
  function ocultarLoader() {
    document.getElementById('loader').style.display = 'none';
  }

  async function FetchConsultaVeraz(datosConsultado, semaforo, credenciales, productData) {
    try {
      const response = await $.ajax({
        url: 'https://sistemasjeb.com.ar/api-consultas-veraz/endpoint/consulta.php',
        type: 'POST',
        data: {
          datosConsultado: datosConsultado,
          semaforo: semaforo,
          credenciales: credenciales,
          productData: productData
        }
      });

      const json = JSON.parse(response);
      return json;
    } catch (error) {
      throw new Error("Error al hacer la consulta al servidor: " + error);
    }
  }

  waitForValue('credenciales').then((valor) => {
    credenciales = valor;
    console.log(credenciales);
  });

  waitForValue('productData').then((valor) => {
    productData = valor;
    console.log(productData);
  });

  waitForValue('semaforo').then((valor) => {
    semaforo = valor;
    console.log(semaforo);
  });


});

function CrearObsBaDetalle() {
  const ObsBa = jsonData.consulta.find(item => item.id == 'obsVigBA').Observaciones;
  let ctnObs = $('#ctnDetalleObsBa');
  ctnObs.empty();
  if (ObsBa != null) {
      ObsBa.forEach(function (obs) {
          const detalle = crearDetalleOb(obs.obsNombreAdh, obs.obsEstado, obs.obsDescripcion);
          ctnObs.append(detalle);
      });
  } else {
      // Agregar un elemento <p> que indique que no hay observaciones
      const mensajeNoObservaciones = $('<p>No hay observaciones.</p>');
      ctnObs.append(mensajeNoObservaciones);
  }
}

function crearDetalleOb(empresa, estado, descripciontotal) {
  // Crear el elemento div con la clase "detalleOb"
  var detalleOb = document.createElement('div');
  detalleOb.classList.add('detalleOb');
  // Crear el elemento div con la clase "cabeceraDetalleOb"
  var cabeceraDetalleOb = document.createElement('div');
  cabeceraDetalleOb.classList.add('cabeceraDetalleOb');
  // Crear los elementos p con los nombres "Empresa" y "estado"
  var pEmpresa = document.createElement('p');
  pEmpresa.textContent = empresa;
  var pEstado = document.createElement('p');
  pEstado.textContent = estado;
  // Agregar los elementos p a la cabeceraDetalleOb
  cabeceraDetalleOb.appendChild(pEmpresa);
  cabeceraDetalleOb.appendChild(pEstado);
  // Crear el elemento p con la descripción total
  var pDescripcionTotal = document.createElement('p');
  pDescripcionTotal.textContent = descripciontotal;
  // Agregar la cabeceraDetalleOb y pDescripcionTotal al detalleOb
  detalleOb.appendChild(cabeceraDetalleOb);
  detalleOb.appendChild(pDescripcionTotal);
  // Devolver el elemento div completo
  return detalleOb;
}

function checkConfig(objeto) {
  for (const propiedad in objeto) {
      if (propiedad != 'formatReport' && (objeto[propiedad] == undefined || objeto[propiedad] == null || objeto[propiedad] == '')) {
          return false;
      }
  }
  return true;
}


