/*const fs = require('fs');

async function splitData(txtFile, csvFile) {
  try {
    const lines = await fs.promises.readFile(txtFile, 'utf8');
    const linesArray = lines.split('\n');

    const regex = /^(\w{3} \w{3} \d{2} \d{4} \d{2}:\d{2}:\d{2}) GMT\+\d{4} \(.*?\):{"devID"\s*:\s*"(\w+)",\s*"data"\s*:\s*"(\d+)"}/;

    const result = {};
    const devIds = [];
    const initialValues = {};
    const firstOccurrences = {}; // Store first occurrence for each devID

    linesArray.forEach((line) => {
      const match = line.match(regex);
      if (match) {
        const [, datetime, devId, data] = match;
        if (!result[devId]) {
          result[devId] = { dateTime: datetime };
          devIds.push(devId);
          initialValues[devId] = data; // Store initial non-zero value for each device ID

          // Store the first occurring data for each devID
          if (!firstOccurrences[devId]) {
            firstOccurrences[devId] = data;
          }
        }
        result[devId].data = data;
      }
    });

    const header = `date,${devIds.join(',')}`;
    const rows = [];
    const previousRowData = devIds.map((devId) => result[devId].data || initialValues[devId] || '0');
    const firstOccurrenceIndices = {}; // Store the row indices of the first occurrences

    linesArray.forEach((line, index) => {
      const match = line.match(regex);
      if (match) {
        const [, datetime, devId, data] = match;
        const rowData = devIds.map((id, i) => {
          if (id === devId) {
            if (data !== '0' && !firstOccurrences[devId]) {
              firstOccurrences[devId] = data; // Store the first occurring data for the devID
              firstOccurrenceIndices[devId] = index; // Store the row index of the first occurrence
            }
            return data;
          } else {
            if (id === devId && firstOccurrences[devId]) {
              // Replace with the first occurring data in the specific column
              return firstOccurrences[devId];
            } else if (id === devId && index < firstOccurrenceIndices[devId]) {
              // Replace the cells above the first occurrence with the first occurring data
              return firstOccurrences[devId];
            } else {
              return previousRowData[i] || initialValues[id] ; // Use previous or initial value for other columns
            }
          }
        });
        rows.push(`${datetime},${rowData.join(',')}`);
        previousRowData.splice(0, previousRowData.length, ...rowData);
      }
    });

    const csvContent = `${header}\n${rows.join('\n')}`;
    await fs.promises.writeFile(csvFile, csvContent);
    console.log('CSV file created successfully.');

    // Print the first occurring data for each devID
    for (const devId in firstOccurrences) {
      console.log(`First occurring data for devID "${devId}": ${firstOccurrences[devId]}`);
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

const txtFile = 'log_june2.txt';
const csvFile = 'm.csv';
splitData(txtFile, csvFile);*/

//.................................................................


const fs = require('fs');

async function splitData(txtFile, csvFile) {
  try {
    const lines = await fs.promises.readFile(txtFile, 'utf8');
    const linesArray = lines.split('\n');

    const regex = /^(\w{3} \w{3} \d{2} \d{4} \d{2}:\d{2}:\d{2}) GMT\+\d{4} \(.*?\):{"devID"\s*:\s*"(\w+)",\s*"data"\s*:\s*"(\d+)"}/;

    const result = {};
    const devIds = [];
    const initialValues = {};
    const firstOccurrences = {}; // Store first occurrence for each devID

    linesArray.forEach((line) => {
      const match = line.match(regex);
      if (match) {
        const [, datetime, devId, data] = match;
        if (!result[devId]) {
          result[devId] = { dateTime: datetime };
          devIds.push(devId);
          initialValues[devId] = data.trim() || '0'; // Trim whitespace and store initial non-zero value for each device ID

          // Store the first occurring data for each devID
          if (!firstOccurrences[devId]) {
            firstOccurrences[devId] = data.trim() || '0';
          }
        }
        result[devId].data = data.trim();
      }
    });
//.................
    const header = `date,${devIds.join(',')}`;
const rows = [];
const previousRowData = devIds.map((devId) => result[devId].data || initialValues[devId] || '0');
const firstOccurrenceIndices = {}; // Store the row indices of the first occurrences

linesArray.forEach((line, index) => {
  const match = line.match(regex);
  if (match) {
    const [, datetime, devId, data] = match;
    const rowData = devIds.map((id, i) => {
      if (id === devId) {
        if (data.trim() !== '0' && !firstOccurrences[devId]) {
          firstOccurrences[devId] = data.trim(); // Store the first occurring data for the devID
          firstOccurrenceIndices[devId] = index; // Store the row index of the first occurrence
        }
        return data.trim();
      } else {
        if (id === devId && firstOccurrences[devId]) {
          // Replace with the first occurring data in the specific column
          return firstOccurrences[devId];
        } 

       else if (id === devId && index < firstOccurrenceIndices[devId]) {
        // Replace the cells above the first occurrence with the first non-zero value below
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
      }
    
        else {
          return previousRowData[i] || initialValues[id] || '0'; // Use previous or initial value for other columns
        }
      }
    });
    rows.push(`${datetime},${rowData.join(',')}`);
    previousRowData.splice(0, previousRowData.length, ...rowData);

    // Update first occurring data in respective columns till the first occurrence cell
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

    // Print the first occurring data for each devID
    for (const devId in firstOccurrences) {
      console.log(`First occurring data for devID "${devId}": ${firstOccurrences[devId]}`);
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

const txtFile = 'log_june2.txt';
const csvFile = 'sohan.csv';
splitData(txtFile, csvFile);

