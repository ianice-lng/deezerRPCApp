const { app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const RPC = require('discord-rpc');
const client = new RPC.Client({ transport: 'ipc' });

const clientId = ''; // Your application client ID here


let mainWindow;
client.on('ready', () => {
app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        icon: "./assets/deezer.png",
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });
    mainWindow.setMenuBarVisibility(false);
    mainWindow.webContents.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    mainWindow.loadURL('https://www.deezer.com/');
    
   
    function trackChanges() {
        mainWindow.webContents.executeJavaScript(`
            (function() {
                function startObserver() {
                    const targetNode = document.querySelector('.css-1d4hfp6');
                    if (!targetNode) {
                        setTimeout(startObserver, 1000);
                        return;
                    }

                    

                    const observer = new MutationObserver(() => {
                        const title = document.querySelector('[data-testid="item_title"]')?.innerText || 'Inconnu';
                        const artist = document.querySelector('[data-testid="item_subtitle"]')?.innerText || 'Inconnu';
                        const elapsedTime = document.querySelector('[data-testid="elapsed_time"]')?.innerText || 'Inconnu';
                        const remainingTime = document.querySelector('[data-testid="remaining_time"]')?.innerText || 'Inconnu';
                        const image = document.querySelector('[data-testid="item_cover"] img')?.src || 'Inconnu';
                        const urlMusic = document.querySelector('[data-testid="item_title"] a')?.href || 'https://www.deezer.com/';

                        

                        window.electronAPI.trackUpdate({ title, artist, elapsedTime, remainingTime, image, urlMusic });
                    });

                    observer.observe(targetNode, { childList: true, subtree: true, characterData: true });
                }

                startObserver(); 
            })();
        `);
    }

ipcMain.on("trackUpdate", (event, trackInfo) => {
    
    const elapsed_time = timeToMilliseconds(trackInfo.elapsedTime);
    const remaining_time = timeToMilliseconds(trackInfo.remainingTime);
    const dateNow = Date.now();
        client.setActivity({
            details: trackInfo.title,
            largeImageKey: trackInfo.image,
            largeImageText: trackInfo.artist,
            smallImageText: "Deezer",
            smallImageKey: 'https://cdn-files.dzcdn.net/cache/images/common/favicon/favicon.5e8e3be4042b873a7358.ico',
            instance: false,
            startTimestamp: dateNow - elapsed_time,
            endTimestamp: dateNow + remaining_time - elapsed_time,
            buttons: [
                {
                    label: 'Listen on Deezer',
                    url: `${trackInfo.urlMusic}`
                }
            ]
        });
    
});

    mainWindow.webContents.once('did-finish-load', () => {
        trackChanges();
    });
});
});

client.login({ clientId }).catch((err) => {
    console.error('Error :', err);
});
function timeToMilliseconds(timeStr) {
    const [minutes, seconds] = timeStr.split(':').map(Number);
    const totalSeconds = (minutes * 60) + seconds;
    return totalSeconds * 1000;
}