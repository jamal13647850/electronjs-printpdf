import {app , BrowserWindow,Menu,MenuItem} from 'electron';
import url from 'url';
import path from 'path';
import electronReload from 'electron-reload';
electronReload(__dirname);
import Devtron from 'devtron';


let menu = new Menu();
let menuitem1 = new MenuItem({
    label : 'File1',
    submenu : [
        {
            label : 'Exit',
            click(){
                app.quit();
            }
        }
    ]
});

menu.append(menuitem1)  ;

app.on('ready', () => {
    let mainWin = new BrowserWindow({
        width:400,
        height:600,
        x:100,
        y:100,
        resizable:false

        //backgroundColor : '#27ae60'
    });
    mainWin.loadURL(`file://${__dirname}/index.html`);


    Menu.setApplicationMenu(menu);
});