const fs = require('fs');

async function splitData(txtFile, csvFile) {
  try {
    const lines = await fs.promises.readFile(txtFile, 'utf8');
    const linesArray = lines.split('\n');

    const regex = /^(\w{3} \w{3} \d{2} \d{4} \d{2}:\d{2}:\d{2}) GMT\+\d{4} \(.*?\):{"devID"\s*:\s*"(\w+)",\s*"data"\s*:\s*"(\d+)"}/;

    const result = {};
    const devIds = [];
    const initialValues = {};
    const firstOccurrences = {}; 
    linesArray.forEach((line) => {
      const match = line.match(regex);
      if (match) {
        const [, datetime, devId, data] = match;
        if (!result[devId]) {
          result[devId] = { dateTime: datetime };
          devIds.push(devId);
          initialValues[devId] = data.trim() || '0'; 

          if (!firstOccurrences[devId]) {
            firstOccurrences[devId] = data.trim() || '0';
          }
        }
        result[devId].data = data.trim();
      }
    });

    const header = `date,${devIds.join(',')}`;
    const rows = [];
    const previousRowData = devIds.map((devId) => result[devId].data || initialValues[devId] || '0');
    const firstOccurrenceIndices = {};
    linesArray.forEach((line, index) => {
      const match = line.match(regex);
      if (match) {
        const [, datetime, devId, data] = match;
        const rowData = devIds.map((id, i) => {
          if (id === devId) {
            if (data.trim() !== '0' && !firstOccurrences[devId]) {
              firstOccurrences[devId] = data.trim(); 
              firstOccurrenceIndices[devId] = index; 
            }
            return data.trim();
          } else {
            if (id === devId && firstOccurrences[devId]) {
              
              return firstOccurrences[devId];
            } else if (id === devId && index < firstOccurrenceIndices[devId]) {
            
              let firstNonZeroValue = '0';
              for (let j = index + 1; j < linesArray.length; j++) {
                const lineData = linesArray[j].match(regex);
                if (lineData) {
                  const [, , currentDevId, data] = lineData;
                  if (currentDevId === devId && data.trim() !== '0') {
                    firstNonZeroValue = data.trim();
                    break;
                  }
                }
              }
              return firstNonZeroValue || previousRowData[i] || result[devId].data || initialValues[id] || '0';
            } else {
              return previousRowData[i] || initialValues[id] || '0'; 
            }
          }
        });
        rows.push(`${datetime},${rowData.join(',')}`);
        previousRowData.splice(0, previousRowData.length, ...rowData);

        if (firstOccurrenceIndices[devId] !== undefined && index < firstOccurrenceIndices[devId]) {
          for (let i = index + 1; i <= firstOccurrenceIndices[devId]; i++) {
            const lineData = linesArray[i].match(regex);
            if (lineData) {
              const [, , , data] = lineData;
              rows[i] = rows[i].replace(/,[^,]+$/, `,${data.trim()}`);
            }
          }
        }
      }
    });

    const csvContent = `${header}\n${rows.join('\n')}`;
    await fs.promises.writeFile(csvFile, csvContent);
    console.log('CSV file created successfully.');


    for (const devId in firstOccurrences) {
      console.log(`First occurring data for devID "${devId}": ${firstOccurrences[devId]}`);
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

const txtFile = 'log_june2.txt';
const csvFile = 'sohanso.csv';
splitData(txtFile, csvFile);