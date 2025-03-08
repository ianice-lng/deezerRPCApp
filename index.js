const { app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
let lastTrack = "";  // Déclarer ici pour qu'il soit accessible partout
const RPC = require('discord-rpc');
const client = new RPC.Client({ transport: 'ipc' });

const clientId = '1348067895879532554'; // Remplace par ton Client ID

let mainWindow;
let isPaused = false; // Flag pour savoir si la musique est en pause
let lastElapsedTime; // Dernier temps écoulé
client.on('ready', () => {
app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js') // Spécifiez le fichier de preload ici
        }
    });

    mainWindow.webContents.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    mainWindow.loadURL('https://www.deezer.com/');
    
    // Fonction qui surveille les changements de titre de musique
    function trackChanges() {
        console.log('trackChanges appelé');
        mainWindow.webContents.executeJavaScript(`
            (function() {
                function startObserver() {
                    const targetNode = document.querySelector('.css-1d4hfp6');
                    if (!targetNode) {
                        console.log("Aucun élément 'player' trouvé, tentative de nouveau dans 1 seconde");
                        setTimeout(startObserver, 1000);  // Essayer à nouveau après 1 seconde
                        return;
                    }

                    console.log("Élément 'player' trouvé", targetNode);

                    const observer = new MutationObserver(() => {
                        const title = document.querySelector('[data-testid="item_title"]')?.innerText || 'Inconnu';
                        const artist = document.querySelector('[data-testid="item_subtitle"]')?.innerText || 'Inconnu';
                        const elapsedTime = document.querySelector('[data-testid="elapsed_time"]')?.innerText || 'Inconnu';
                        const remainingTime = document.querySelector('[data-testid="remaining_time"]')?.innerText || 'Inconnu';
                        const image = document.querySelector('[data-testid="item_cover"] img')?.src || 'Inconnu';

                        console.log("Changement détecté:", { title, artist, elapsedTime, remainingTime, image });

                        window.electronAPI.trackUpdate({ title, artist, elapsedTime, remainingTime, image });
                    });

                    observer.observe(targetNode, { childList: true, subtree: true, characterData: true });
                }

                startObserver();  // Démarrer l'observateur
            })();
        `);
    }

    let isPaused = false; // Flag pour savoir si la musique est en pause
let lastTrack = "";

ipcMain.on("trackUpdate", (event, trackInfo) => {
    if (lastTrack !== trackInfo.title) {
        console.log('🎵 Nouveau titre :', trackInfo.title);
        console.log('🎤 Artiste :', trackInfo.artist);
        console.log('🖼️ Image :', trackInfo.image);
        lastTrack = trackInfo.title;
    }

    console.log(trackInfo.elapsedTime + ' / ' + trackInfo.remainingTime);
    if(trackInfo.elapsedTime === lastElapsedTime) {
        isPaused = true;
    }
    else {
        isPaused = false;
    }

    const elapsed_time = timeToMilliseconds(trackInfo.elapsedTime);
    const remaining_time = timeToMilliseconds(trackInfo.remainingTime);
    
        client.setActivity({
            details: trackInfo.title,
            state: trackInfo.artist,
            largeImageKey: trackInfo.image,
            instance: false,
            type: 2,
            startTimestamp: Date.now() - elapsed_time,
            endTimestamp: Date.now() + remaining_time
        });
    
});

    mainWindow.webContents.once('did-finish-load', () => {
        trackChanges();
    });
});
});

client.login({ clientId }).catch((err) => {
    console.error('Erreur de connexion :', err);
});
function timeToMilliseconds(timeStr) {
    const [minutes, seconds] = timeStr.split(':').map(Number);
    const totalSeconds = (minutes * 60) + seconds;
    return totalSeconds * 1000;
}