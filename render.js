const {remote,ipcRenderer} = require('electron');
const  {dialog} = require('electron').remote;
const {BrowserWindow} = remote;
const {shell} = require('electron')
const fs = require('fs');


let printWin;
let savePdfPath;

ipcRenderer.on('menu',(e,arg)=>{
    switch (arg) {
        case 'VIEW_PDF':
            viewPDF();
            break;
        case 'SAVE_AS_PDF':
            savePDF();
            break;
        case 'PRINT':
            print();
            break;
    }
});



ipcRenderer.send('channelfromrender','jamal','ghasemi');

ipcRenderer.on('channelfrommain',(e,arg)=>{
    console.log(arg);
});

function getPDFPrintSetting(){
    let options ={
        landscape : false,
        marginsType : 0,
        printBackground : false,
        pageSize : "A4"
    };

    let layoutsetting = document.getElementById("layout-setting");

    options.landscape = layoutsetting.options[layoutsetting.selectedIndex].value === "1" ;

    let pagesizesetting = document.getElementById("page-size-setting");
    options.pageSize = pagesizesetting.options[pagesizesetting.selectedIndex].value;


    let marginsetting = document.getElementById("margin-setting");
    options.marginsType = parseInt(marginsetting.options[marginsetting.selectedIndex].value) ;

    let printbackground = document.getElementById("print-background");
    options.printBackground = printbackground.checked ;


    return options;
}

function savePDF(){
    if(!printWin){
        dialog.showErrorBox('error','the printing window is not created')
        return;
    }
    dialog.showSaveDialog(printWin,{},(file_path)=>{
        if(file_path){
            printWin.webContents.printToPDF(getPDFPrintSetting(),(err,data)=>{
                if(err){
                    dialog.showErrorBox('error',err);
                    return;
                }
                fs.writeFile(file_path,data,(err)=>{
                    dialog.showErrorBox('error',err)
                });
                savePdfPath = file_path;

                document.getElementById('log').innerHTML=`<p>Wrtie PDF: ${savePdfPath}</p>`;
            });
        }
    });
}

function viewPDF(){
    if(! savePdfPath){
        dialog.showErrorBox('ERROR','You should save the pdf before viewing it')
        return;
    }
    console.log('this a test');
    shell.openItem(savePdfPath);
}
function print(){
    if(printWin){
        printWin.webContents.print();
    }
}

document.addEventListener('DOMContentLoaded',()=>{
        printWin = new BrowserWindow({
            autoHideMenuBar: true,
            show: false
        });
        printWin.loadURL(`file://${__dirname}/print.html`);
        printWin.show();


        printWin.webContents.on('did-finish-load', () => {
            document.getElementById('printbtn').addEventListener('click', () => {
                print();
            });
            document.getElementById('savepdfbtn').addEventListener('click', () => {
                savePDF();
            });
            document.getElementById('viewpdfbtn').addEventListener('click', () => {
                viewPDF();
            });
        });

        printWin.on('close', () => {
           printWin = null;
        })
});