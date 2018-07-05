import {app , BrowserWindow,Menu,MenuItem,globalShortcut,ipcMain} from 'electron';
import url from 'url';
import path from 'path';
import electronReload from 'electron-reload';
electronReload(__dirname);
import Devtron from 'devtron';


ipcMain.on('channelfromrender',(e,arg1,arg2)=>{
    console.log("run chanell");
    console.log(arg1,arg2);
    e.sender.send('channelfrommain','ok event');
});


let menu = new Menu();
let menuitem1 = new MenuItem(
    {
        label : 'File1',
        submenu : [
            {
                label : 'Exit',
                click(){
                    app.quit();
                },
                accelerator : 'CmdOrCtrl+q'
            }
        ]
    }
);
let menuitem2 = new MenuItem(

    {
        label : 'View',
            submenu : [
                { role : 'reload'},
                { role : 'toggledevtools'}
            ]
    }
);
let menuitem3 = new MenuItem(
    {
        label : 'Edit',
        submenu : [
            {
                label : 'View PDF',
                click(menuItem , browserWindow , event) {
                    browserWindow.webContents.send('menu' , 'VIEW_PDF')
                },
                accelerator : 'CmdOrCtrl+Shift+t',
            },
            {
                label : 'Save as PDF',
                click(menuItem , browserWindow , event) {
                    browserWindow.webContents.send('menu' , 'SAVE_AS_PDF')
                },
                accelerator : 'CmdOrCtrl+s',
            },
            {
                label : 'Print',
                click(menuItem , browserWindow , event) {
                    browserWindow.webContents.send('menu' , 'PRINT')
                },
                accelerator : 'CmdOrCtrl+p',
            }
        ],
    }
);

menu.append(menuitem1)  ;
menu.append(menuitem2)  ;
menu.append(menuitem3)  ;

app.on('ready', () => {
    Devtron.install();

    globalShortcut.register('CmdOrCtrl+w',()=>{
        console.log("wwwwwwwwwwwwwwww");
    });

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