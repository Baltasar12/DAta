const $ = require('jquery');
const { ipcRenderer } = require('electron');
let credenciales = null;
let productData = null;
let semaforo = null;

var jsonData = {
    "status": "APROBAR",
    "message": "Valida Identidad.",
    "datosConsultado": {
      "Documento": 20173288,
      "Nombre": "BALARDINI, JAVIER EDUARDO",
      "Edad": 55,
      "score_veraz": {
        "valor": 901,
        "estado": "bueno"
      },
      "income_predictor": "R1",
      "CMI": 323,
      "actividad_economica": {
        "TipoIngreso": "NS\/NC",
        "tipo_actividad": "",
        "antiguedad_laboral": "",
        "cuit_empleador": ""
      },
      "Poblacion": "ok",
      "Domicilios": [
        "PROVINCIA DE CORRIENTES-22- _ -4000-SAN MIGUEL DE TUCUMAN ",
        " PROVINCIA DE CORRIENTES-652- _ -4000-SAN MIGUEL DE TUCUMAN ",
        " PJE 1 DE MAYO-950- _ -4000-SAN MIGUEL DE TUCUMAN ",
        " CONGRESO-102- _ -4124-SAN PEDRO DE COLALAO"
      ],
      "Telefonos": [
        "0381155874610 ",
        " 03814308611 ",
        " 4308611 ",
        " 38143086"
      ]
    },
    "consulta": [
      {
        "id": "juiciosComerciales",
        "titulo": "Juicios comerciales",
        "descripcion": "Son los juicios comerciales que tiene el consultado en los ultimos meses",
        "estado": "bueno",
        "detalles": [
          {
            "titulo": "Ultimos 12 meses",
            "valor": 0
          },
          {
            "titulo": "Ultimos 24 meses",
            "valor": 0
          },
          {
            "titulo": "Ultimos 60 meses",
            "valor": 0
          }
        ]
      },
      {
        "id": "chequesSinFondo",
        "titulo": "Cheques sin fondo",
        "descripcion": "son los cheques sin fondo que pertenecen al consultado",
        "estado": "bueno",
        "detalles": [
          {
            "titulo": "Ultimos 3 meses",
            "cantidad": 0,
            "monto": 0
          },
          {
            "titulo": "Ultimos 6 meses",
            "cantidad": 0,
            "monto": 0
          },
          {
            "titulo": "Ultimos 12 meses",
            "cantidad": 0,
            "monto": 0
          },
          {
            "titulo": "Ultimos 24 meses",
            "cantidad": 0,
            "monto": 0
          }
        ]
      },
      {
        "id": "chequesSinFondoNoPagados",
        "titulo": "Cheques sin fondo no pagados",
        "descripcion": "son los cheques sin fondo que no se pagaron que pertenecen al consultado",
        "estado": "bueno",
        "detalles": [
          {
            "titulo": "Ultimos 3 meses",
            "cantidad": 0,
            "monto": 0
          },
          {
            "titulo": "Ultimos 6 meses",
            "cantidad": 0,
            "monto": 0
          },
          {
            "titulo": "Ultimos 12 meses",
            "cantidad": 0,
            "monto": 0
          },
          {
            "titulo": "Ultimos 24 meses",
            "cantidad": 0,
            "monto": 0
          }
        ]
      },
      {
        "id": "cantidadComQui",
        "titulo": "Cantidad de Concursos o Quiebras",
        "descripcion": "Cantidad de concursos o quiebras del consultado en el ultimo tiempo",
        "estado": "bueno",
        "detalles": [
          {
            "titulo": "Ultimos 12 meses",
            "cantidad": 0
          },
          {
            "titulo": "Ultimos 24 meses",
            "cantidad": 0
          },
          {
            "titulo": "Ultimos 60 meses",
            "cantidad": 0
          }
        ]
      },
      {
        "id": "cantidadCon",
        "titulo": "Consultas Financieras y no financieras",
        "descripcion": "Cantidad de consultas Financieras y no financieras",
        "estado": "bueno",
        "detalles": [
          {
            "titulo": "ultimos mes",
            "cantidad": 0
          },
          {
            "titulo": "ultimos 3 meses",
            "cantidad": 0
          }
        ]
      },
      {
        "id": "statusBcra",
        "titulo": "Peor estado en el BCRA",
        "descripcion": "Peor status en el BCRA en los siguientes plazos",
        "estado": "bueno",
        "detalles": [
          {
            "titulo": "Actual",
            "status": "1"
          },
          {
            "titulo": "ultimos 6 meses",
            "status": ""
          },
          {
            "titulo": "de 7 a 12 meses",
            "status": ""
          },
          {
            "titulo": "de 13 a 24 meses",
            "status": "1"
          },
          {
            "titulo": "Total de deuda",
            "monto": 0
          }
        ]
      },
      {
        "id": "statusBureau",
        "titulo": "Status en Bureau",
        "descripcion": "Situacion del consultado en bureau",
        "estado": "bueno",
        "detalles": [
          {
            "titulo": "Actual",
            "status": "1"
          }
        ]
      },
      {
        "id": "cantEntInfo",
        "titulo": "Entidades que informan",
        "descripcion": "Cantidad y montos de entidades que informaron del consultado",
        "estado": "bueno",
        "detalles": [
          {
            "titulo": "Situacion 1",
            "cantidad": 0,
            "monto": 0
          },
          {
            "titulo": "Situacion 2",
            "cantidad": 0,
            "monto": 0
          },
          {
            "titulo": "Situacion 3",
            "cantidad": 0,
            "monto": 0
          },
          {
            "titulo": "Situacion 4",
            "cantidad": 0,
            "monto": 0
          },
          {
            "titulo": "Situacion 5",
            "cantidad": 0,
            "monto": 0
          }
        ]
      },
      {
        "id": "obsVigBA",
        "titulo": "Observaciones vigentes en Base Abierta",
        "descripcion": "Observaciones y montos en Base Abierta",
        "estado": "bueno",
        "detalles": [
          {
            "titulo": "Cantidad en los ultimos 12 meses",
            "cantidad": 0
          },
          {
            "titulo": "Monto",
            "cantidad": 0
          }
        ],
        "Observaciones": null
      },
      {
        "id": "obsVigBC",
        "titulo": "Observaciones vigentes en Banco Central",
        "descripcion": "Observaciones y montos en Banco Central",
        "estado": "bueno",
        "detalles": [
          {
            "titulo": "Cantidad en los ultimos 12 meses",
            "cantidad": 0
          },
          {
            "titulo": "Monto",
            "cantidad": 0
          }
        ],
        "Observaciones": "-"
      }
    ]
  }

// Mostrar algunos datos en la consola
console.log("Nombre: " + jsonData.datosConsultado.Nombre);
console.log("Documento: " + jsonData.datosConsultado.Documento);
console.log("Edad: " + jsonData.datosConsultado.Edad);
console.log("Estado Veraz: " + jsonData.datosConsultado.score_veraz.estado);
console.log("Actividad Económica: " + jsonData.datosConsultado.actividad_economica.TipoIngreso);
// Mostrar Domicilios
console.log("Domicilios:");
jsonData.datosConsultado.Domicilios.forEach(function (domicilio) {
  console.log("- " + domicilio);
});

// Mostrar Teléfonos
console.log("Teléfonos:");
jsonData.datosConsultado.Telefonos.forEach(function (telefono) {
  console.log("- " + telefono);
});

// Mostrar información de consultas
console.log("Consultas:");
jsonData.consulta.forEach(function (consulta) {
  console.log("- " + consulta.titulo);
  console.log("  Descripción: " + consulta.descripcion);
  console.log("  Estado: " + consulta.estado);

  // Mostrar detalles de la consulta
  consulta.detalles.forEach(function (detalle) {
    console.log("  " + detalle.titulo + ": " + (detalle.cantidad || detalle.valor || detalle.status || detalle.monto));
  });
});
// Mostrar Observaciones vigentes en Base Abierta
console.log("Observaciones en Base Abierta:");
/* var obsVigBA = jsonData.consulta.find(function (consulta) {
  return consulta.id === "obsVigBA";
});
if (obsVigBA) {
  console.log("- Cantidad en los últimos 12 meses: " + obsVigBA.detalles[0].cantidad);
  console.log("- Monto: " + obsVigBA.detalles[1].cantidad);

  // Mostrar detalles de observaciones
  obsVigBA.Observaciones.forEach(function (obs) {
    console.log("  Observación: " + obs.obsDescripcion);
    console.log("    Monto: " + obs.obsMonto);
  });
} else {
  console.log("No hay observaciones en Base Abierta.");
}
 */


var juiciosTable = document.getElementById('juiciosTable');
var chequesTable = document.getElementById('chequesTable');

// Mostrar datos en el DOM
document.addEventListener('DOMContentLoaded', function () {
  mostrarDatos();
  actualizarInfoUsuario();
  actualizarStatusBureau();
  actualizarStatusBCRA();
});

function CrearTablaDinamica(nombreColumnas, datos) {

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
    nombreColumnas.forEach((columna) => {
      const celda = document.createElement('td');
      celda.textContent = filaDatos[columna];
      fila.appendChild(celda);
    });
    cuerpoTabla.appendChild(fila);
  });
  tabla.appendChild(cuerpoTabla);
  return tabla;
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
      totalBCRAElemento.textContent = 'Total BCRA: $' + (statusBCRAConsulta.detalles[0].monto || 'Desconocido');
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
      // Lógica para la tabla de Evolución
      $modalTable.html(`
                    <thead>
                        <tr>
                            <th>Periodo</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Contenido de la tabla de Evolución -->
                    </tbody>
                `);

      // Mostrar el contenedor de adquisiciones solo para Evolución
      $acquisitionsContainer.show();
    } else if (tableType === 'composicion') {
      // Lógica para la tabla de Composición
      $modalTable.html(`
                    <thead>
                        <tr>
                            <th>Situación</th>
                            <th>Entidad</th>
                            <th>Monto</th>
                            <th>Cantidad</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Contenido de la tabla de Composición -->
                        <tr>
                            <td>Composición 1</td>
                            <td>Entidad 1</td>
                            <td>Monto 1</td>
                            <td>Cantidad 1</td>
                        </tr>
                        <tr>
                            <td>Composición 2</td>
                            <td>Entidad 2</td>
                            <td>Monto 2</td>
                            <td>Cantidad 2</td>
                        </tr>
                        <!-- Agrega más filas según sea necesario -->
                    </tbody>
                `);

      // Ocultar el contenedor de adquisiciones solo para Composición
      $acquisitionsContainer.hide();
    }

    // Mostrar u ocultar el gráfico según el botón clicado
    if (showChart) {
      // Lógica para el gráfico (puedes ajustar según tus datos y necesidades)
      (async function () {
        const data = [
          { year: 2010, count: 10 },
          { year: 2011, count: 20 },
          { year: 2012, count: 15 },
          { year: 2013, count: 25 },
          { year: 2014, count: 22 },
          { year: 2015, count: 30 },
          { year: 2016, count: 28 },
        ];

        new Chart(
          $acquisitionsCanvas[0],
          {
            type: 'line',
            data: {
              labels: data.map(row => row.year),
              datasets: [
                {
                  label: 'Acquisitions by year',
                  data: data.map(row => row.count)
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

  $('#submitBtn').click(async (event) => {
    event.preventDefault();
    await ConsultaVeraz();
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
  }

  async function FetchConsultaVeraz(datosConsultado, semaforo, credenciales, productData) {
    try {
      const response = await $.ajax({
        url: 'http://localhost/api-consultas-veraz/endpoint/consulta.php',
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

  const waitForValue = (nombreEvento) => {
    return new Promise((resolve) => {
      ipcRenderer.on(nombreEvento, (event, value) => {
        resolve(value);
      });
    });
  };

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


