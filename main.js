const { app, BrowserWindow, screen, ipcMain } = require('electron');
const fs = require('fs').promises;
const path = require('path'); // Corregido el import de 'node:path'

let mainWindow;
let credenciales;
let productData;
let semaforo;

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
    createWindow(); // No se define la función 'createWindow', posiblemente deberías agregarla si es necesaria.
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

    // Envía los eventos después de guardar en los archivos
    mainWindow.webContents.send('credenciales', credencialesObjeto);
    mainWindow.webContents.send('productData', ProductDataObjeto);
    credenciales = credencialesObjeto;
    productData = ProductDataObjeto;

  } catch (error) {
    console.error('Error al guardar en el archivo:', error);
  }
});

async function guardarDatosEnArchivos(ruta, nombreArchivo, DatoGuardar) {
  const projectFolderPath = app.getAppPath();
  const folderPath = path.join(projectFolderPath, ruta);

  try {
    // Asegúrate de que el directorio exista antes de escribir en el archivo
    await fs.mkdir(folderPath, { recursive: true });
    const filePath = path.join(folderPath, nombreArchivo);

    // Guarda la variable en el archivo JSON
    await fs.writeFile(filePath, JSON.stringify(DatoGuardar));
  } catch (err) {
    console.error('Error al guardar en el archivo:', err);
  }
}

async function LeerJsonDatos(rutaArchivo, archivo) {
  const projectFolderPath = app.getAppPath(); // Obtiene la ubicación del proyecto
  const folderPath = path.join(projectFolderPath, rutaArchivo);
  const filePath = path.join(folderPath, archivo); // Ruta del archivo JSON

  try {
    const data = await fs.readFile(filePath, 'utf8');
    // Parsea el contenido del archivo JSON en un objeto JavaScript
    const parsedDataJson = JSON.parse(data);
    return parsedDataJson;
  } catch (err) {
    console.error('Error al leer el archivo:', err);
    return null;
  }
}
