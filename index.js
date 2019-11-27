const bluetooth = require("luna-node-bluetooth");
const path = require("path");
const os = require("os");
const { Luna } = require("escpos-luna");


const getPrinters = async () => {
    const device = new bluetooth.DeviceINQ();
    return new Promise((resolve) => {
        device.listPairedDevices(resolve);
  });
};

const print = async (address, lines, logo, openCashDrawer) => {
    const imgDir = path.join(os.homedir(), "Documents", "LunaData", "images");
  const escpos = new Luna();
  await escpos.addText("");
  if (logo) {
    const logoPath = path.join(imgDir, logo);
    await escpos.addLogo(logoPath);
}

await escpos.addLines(lines);
  await escpos.addText("");
  await escpos.addText("");
  await escpos.cutPaper();

  if (openCashDrawer) {
    await escpos.openCashDrawer();
    await escpos.openCashDrawer2();
  }
  const bufferData = await escpos.getBuffer();
  return new Promise((resolve, reject) => {
    bluetooth.connect(address, 1, (error, connection) => {
        reject(error);
      if (connection) {
          connection.write(bufferData, () => {
              connection.close();
              resolve(true);
            });
        }
    });
});
};

// const address = "66-12-57-95-dc-64";
// printText(address, ["tes\n1\n2\n3"], "logo.png", true)
// .then(console.log)
//   .catch(console.log);
  

module.exports ={
    getPrinters, print
}
