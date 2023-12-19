const { app, BrowserWindow, screen, ipcMain, autoUpdater } = require('electron');
const Swal = require('sweetalert2');
const fs = require('fs').promises;
const path = require('path');
autoUpdater.autoDownload = true;

let mainWindow;
let credenciales;
let productData;
let semaforo;
let jsonData;

const showUpdatingNotification = () => {
  Swal.fire({
    title: 'Actualizando',
    text: 'La aplicación se está actualizando. Por favor, espera...',
    icon: 'info',
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 5000
  });
};

const showNewUpdateNotification = () => {
  Swal.fire({
    title: '¡Nueva Actualización!',
    text: 'Hay una nueva versión disponible. La aplicación se actualizará automáticamente.',
    icon: 'info',
    showCancelButton: false,
    showConfirmButton: false,
    timer: 5000
  });
};

autoUpdater.setFeedURL({
  url: 'https://github.com/Baltasar12/DAta/releases'
});

autoUpdater.on('update-available', () => {
  showNewUpdateNotification();
});

autoUpdater.on('update-downloaded', () => {
  showUpdatingNotification();
  autoUpdater.quitAndInstall();
});

autoUpdater.on('error', (error) => {
  console.error('Error durante la actualización:', error);
});


app.whenReady().then(() => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width,
    height,
    maxWidth: width,
    maxHeight: height,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
    },
    autoHideMenuBar: true
  });

  mainWindow.loadFile('index.html');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.on('did-finish-load', async () => {
    try {
      credenciales = await LeerJsonDatos('config', 'credenciales.json');
      productData = await LeerJsonDatos('config', 'productData.json');
      semaforo = await LeerJsonDatos('config', 'semaforo.json');
      jsonData = await LeerJsonDatos('config', 'ultimaConsulta.json');
      mainWindow.webContents.send('enviarJsonData', jsonData);
      mainWindow.webContents.send('credenciales', credenciales);
      mainWindow.webContents.send('productData', productData);
      mainWindow.webContents.send('semaforo', semaforo);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  });
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow(); // ¿Necesitas realmente esta función?
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('solicitarConfig', async () => {
  const credencialesObjeto = await LeerJsonDatos('config', 'credenciales.json');
  const ProductDataObjeto = await LeerJsonDatos('config', 'productData.json');
  const semaforoGeneral = await LeerJsonDatos('config', 'semaforo.json');

  mainWindow.webContents.send('credenciales', credencialesObjeto);
  mainWindow.webContents.send('productData', ProductDataObjeto);
  mainWindow.webContents.send('semaforo', semaforoGeneral);
});

ipcMain.on('guardar-en-archivo', async (event, variableRecibida) => {
  try {
    const { clientId, clientSecret, ...ProductDataObjeto } = variableRecibida.productData;
    const { sector, billTo, shipTo, formatReport, producto, productName, productOrch, configuration, customer, model, ...credencialesObjeto } = variableRecibida.productData;

    await guardarDatosEnArchivos('config', 'productData.json', ProductDataObjeto);
    await guardarDatosEnArchivos('config', 'credenciales.json', credencialesObjeto);
    await guardarDatosEnArchivos('config', 'semaforo.json', variableRecibida.semaforo);

    mainWindow.webContents.send('credenciales', credencialesObjeto);
    mainWindow.webContents.send('productData', ProductDataObjeto);
    credenciales = credencialesObjeto;
    productData = ProductDataObjeto;

  } catch (error) {
    console.error('Error al guardar en el archivo:', error);
  }
});

ipcMain.on('guardarUltimaConsulta', async (event, variableRecibida) => {
  try {
    await guardarDatosEnArchivos('config', 'ultimaConsulta.json', variableRecibida);
  } catch (error) {
    console.error('Error al guardar en el archivo:', error);
  }
});

async function guardarDatosEnArchivos(ruta, nombreArchivo, DatoGuardar) {
  const projectFolderPath = app.getAppPath();
  const folderPath = path.join(projectFolderPath, ruta);

  try {
    await fs.mkdir(folderPath, { recursive: true });
    const filePath = path.join(folderPath, nombreArchivo);

    await fs.writeFile(filePath, JSON.stringify(DatoGuardar));
  } catch (err) {
    console.error('Error al guardar en el archivo:', err);
  }
}

async function LeerJsonDatos(rutaArchivo, archivo) {
  const projectFolderPath = app.getAppPath();
  const folderPath = path.join(projectFolderPath, rutaArchivo);
  const filePath = path.join(folderPath, archivo);

  try {
    const data = await fs.readFile(filePath, 'utf8');
    const parsedDataJson = JSON.parse(data);
    return parsedDataJson;
  } catch (err) {
    console.error('Error al leer el archivo:', err);
    return null;
  }
}
