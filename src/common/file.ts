const fs = require('fs');

interface fileParams {
  data: object,
  status: string,
  code: number | null,
  endPoint: string,
  message: string
}

class FS {
  static formatDate = () => {
    let date = new Date();
    return date.getFullYear() + "-" + (date.getMonth() + 1).toString().padStart(2, "0") + "-" + date.getDate().toString().padStart(2, "0");
  }

  static writeText(data: fileParams) {
    const status = data?.status === 'success' ? 'success' : 'failure'
    let filePath = `../logs/${status}/${this.formatDate()}.txt`
    filePath = filePath.replace("\\", "/");
    var directory = filePath.split("/").slice(0, -1);
    if (directory.length) {
      var proceed = true;
      for (var i = 1; i <= directory.length; i++) {
        if (!proceed) break;
        var path = directory.slice(0, i).join('/');
        if (fs.existsSync(path)) continue;
        proceed = fs.mkdirSync(path) == undefined;
      }
      if (proceed) this.writeFile(filePath, data);
    } else {
      this.writeFile(filePath, data);
    }
  }


  static writeFile(filePath: string, data: any) {
    data = JSON.stringify(data) + "\r\n\n";
    data += '===========\n\n'
    fs.appendFile(filePath, data, (err: any) => {
      if (err) throw err;
    });
  }
}


export default FS