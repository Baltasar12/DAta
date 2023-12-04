const { app, BrowserWindow, screen, ipcMain } = require('electron');
const fs = require('fs').promises;
const path = require('node:path')
let mainWindow;

app.whenReady().then(() => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    maxWidth: width,
    maxHeight: height,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    }
  });

  mainWindow.loadFile('index.html');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('guardar-en-archivo', async (event, variableRecibida) => {
  const { clientId, clientSecret, ...ProductData } = variableRecibida;
  const { sector, billTo, shipTo, formatReport, producto, productName, productOrch, configuration, customer, model, ...credenciales } = variableRecibida;
  guardarDatosEnArchivos('config', 'productData.json', ProductData);
  guardarDatosEnArchivos('config', 'credenciales.json', credenciales);
});

async function guardarDatosEnArchivos(ruta, nombreArchivo, DatoGuardar) {
  const projectFolderPath = app.getAppPath(); 
  const folderPath = path.join(projectFolderPath, ruta);
  const filePath = path.join(folderPath, nombreArchivo); 

  try {
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
