import File from "./File";

export default class Install2IssFile extends File {
    constructor() {
        super()
        this.write('[InstallShield Silent]')
        this.write('Version=v7.00')
        this.write('File=Response File')
        this.write('[File Transfer]')
        this.write('OverwrittenReadOnly=NoToAll')
        this.write('[{E230488C-B49D-4A8C-B90D-7133982390E8}-DlgOrder]')
        this.write('Dlg0={E230488C-B49D-4A8C-B90D-7133982390E8}-AskYesNo-0')
        this.write('Count=2')
        this.write('Dlg1={E230488C-B49D-4A8C-B90D-7133982390E8}-SdFinish-0')
        this.write('[{E230488C-B49D-4A8C-B90D-7133982390E8}-AskYesNo-0]')
        this.write('Result=1')
        this.write('[{E230488C-B49D-4A8C-B90D-7133982390E8}-SdFinish-0]')
        this.write('Result=1')
        this.write('bOpt1=0')
        this.write('bOpt2=0')
    }
}