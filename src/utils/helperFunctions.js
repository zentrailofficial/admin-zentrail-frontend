const triggerDownload = (headers, rows, fileName) => {
  const data = [headers.join(","), rows.join(",\n")].join("\n");
  const blob = new Blob([data], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${fileName}.csv`;
  a.click();
};

export const handleDownloadCSV = (tableColumns, tableRows, fileName) => {
  const csvHeaders = tableColumns.reduce((acc, curr) => {
    acc.push(curr.headerName);
    return acc;
  }, []);

  const csvRows = tableRows.reduce((acc, rowCurr) => {
    const filteredValues = tableColumns.reduce((acc, colCurr) => {
      if (
        typeof rowCurr[colCurr.field] === "string" &&
        /^[+0-9]+$/.test(rowCurr[colCurr.field])
      ) {
        acc[colCurr.field] = `="${rowCurr[colCurr.field]}"`;
      } else {
        acc[colCurr.field] = rowCurr[colCurr.field];
      }
      return acc;
    }, {});

    const rowValues = Object.values(filteredValues);
    acc.push(rowValues.join(","));

    return acc;
  }, []);

  triggerDownload(csvHeaders, csvRows, fileName);
};

export const sanitizeSlug = (input) => {
  return input
    .toLowerCase()
    .replace(/&/g, "and") 
    .replace(/[^\w\s-]/g, "") 
    .replace(/\s+/g, "-") 
    .replace(/-+/g, "-") 
    .trim(); 
};

export const allowedPattern = /^[a-zA-Z0-9\s-]$/;

export const controlKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];

export const isAllowedKey = (key) => {
  return allowedPattern.test(key) || controlKeys.includes(key);
};
