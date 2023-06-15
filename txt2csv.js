const fs = require('fs');

function splitData(txtFile, csvFile) {
  const lines = fs.readFileSync(txtFile, 'utf8').split('\n');
  const regex = /^(\w{3} \w{3} \d{2} \d{4} \d{2}:\d{2}:\d{2}) GMT\+\d{4} \(.*?\):{"devID"\s*:\s*"(\w+)",\s*"data"\s*:\s*"(\d+)"}/;
  const result = lines.reduce((acc, line) => {
    const match = line.match(regex);
    if (match) {
      const [, dateTime, devID, data] = match;
      if (!acc[devID]) {
        acc[devID] = { dateTime };
      }
      acc[devID].data = data;
    }
    return acc;
  }, {});

  const devIDs = Object.keys(result).sort();
  const header = `date,${devIDs.join(',')}`;
  const rows = [];
  const columnValues = {}; 
  const firstOccurrence = {}; 
  for (const line of lines) {
    const match = line.match(regex);
    if (match) {
      const [, dateTime, devID, data] = match;
      if (!firstOccurrence[devID]) {
        firstOccurrence[devID] = data;
      }
      const rowData = devIDs.map(id => {
        if (id === devID) {
          columnValues[id] = data;
          return data;
        }
      
        if (columnValues[id]) {
          return columnValues[id];
        }
        
        if (data === firstOccurrence[id]) {
          columnValues[id] = data;
          return data;
        }
        
        if (!columnValues[id] && data !== '') {
          columnValues[id] = firstOccurrence[id];
          return firstOccurrence[id];
        }
        return '';
      });
      rows.push(`${dateTime},${rowData.join(',')}`);
    }
  }
  
  
  const firstRow = rows[0].split(',');
  for (let i = 1; i < firstRow.length; i++) {
    if (firstRow[i] === '') {
      firstRow[i] = firstOccurrence[devIDs[i - 1]];
    }
  }
  rows[0] = firstRow.join(',');
  

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i].split(',');
    for (let j = 1; j < row.length; j++) {
      if (row[j] === '') {
        row[j] = firstOccurrence[devIDs[j - 1]];
      }
    }
    rows[i] = row.join(',');
  }

  const csvContent = [header, ...rows].join('\n');
  fs.writeFileSync(csvFile, csvContent);
}

const txtFile = 'log_june1.txt';
const csvFile = 'qoy1.csv';
splitData(txtFile, csvFile);
