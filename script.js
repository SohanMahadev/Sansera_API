const fs = require('fs');

 

async function splitData(txtFile, csvFile) {
  try {
    const lines = await fs.promises.readFile(txtFile, 'utf8');
    const linesArray = lines.split('\n');

 

    const regex = /^(\w{3} \w{3} \d{2} \d{4} \d{2}:\d{2}:\d{2}) GMT\+\d{4} \(.*?\):{"devID"\s*:\s*"(\w+)",\s*"data"\s*:\s*"(\d+)"}/;

 

    const result = {};
    const devIds = [];

 

    linesArray.forEach((line) => {
      const match = line.match(regex);
      if (match) {
        const [, datetime, devId, data] = match;
        if (!result[devId]) {
          result[devId] = { dateTime: datetime };
          devIds.push(devId);
        }
        result[devId].data = data;
      }
    });

 

    devIds.sort();
    const header = `date,${devIds.join(',')}`;
    const rows = [];
    const previousRowData = devIds.map((devId) => result[devId].data || '0');

 

    linesArray.forEach((line) => {
      const match = line.match(regex);
      if (match) {
        const [, datetime, devId, data] = match;
        const rowData = devIds.map((id, i) => (id === devId ? data : previousRowData[i]));
        rows.push(`${datetime},${rowData.join(',')}`);
        previousRowData.splice(0, previousRowData.length, ...rowData);
      }
    });

 

    
    for (let i = 0; i < devIds.length; i++) {
      const devId = devIds[i];
      const firstOccurrence = result[devId].data;
      if (firstOccurrence !== '0') {
        const lastRowData = rows[rows.length - 1].split(',');
        if (lastRowData[i] === '0') {
          lastRowData[i] = firstOccurrence;
          rows[rows.length - 1] = lastRowData.join(',');
        }
      }
    }

 

    const csvContent = `${header}\n${rows.join('\n')}`;

 

    await fs.promises.writeFile(csvFile, csvContent);

 

    console.log('CSV file created successfully.');
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

 

const txtFile = 'log_june1.txt';
const csvFile = 'outputreal.csv';
splitData(txtFile, csvFile);