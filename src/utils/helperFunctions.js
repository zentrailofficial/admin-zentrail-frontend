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

// export const sanitizeSlug = (input) => {
//   return input
//     .toLowerCase()
//     // .replace(/&/g, "and") 
//     .replace(/[^\w\s-]/g, "") 
//     .replace(/\s+/g, "-") 
//     .replace(/-+/g, "-") 
//     .replace(/[^a-z0-9\s-]/g, "") 
//     .trim(); 
// };
export const sanitizeSlug = (input) => {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "-") // remove everything except letters, numbers, spaces, and -
    .replace(/\s+/g, "-")         // spaces → -
    .replace(/-+/g, "-")          // collapse multiple -
    .replace(/^-|-$/g, "");       // trim leading/trailing -
};



export function modifystr(str) {
    if (typeof str !== 'string') {
       return ''
    }
    else {
        str = str?.replaceAll('.', '-');
        str = str?.replace(/[^a-zA-Z0-9/ ]/g, "-");
        str = str?.trim().replaceAll(' ', "-");
        let a = 0;
        while (a < 1) {
            if (str?.includes("--")) {
                str = str?.replaceAll("--", "-")
            } else if (str?.includes("//")) {
                str = str?.replaceAll("//", "/")
            } else if (str?.includes("//")) {
                str = str?.replaceAll("-/", "/")
            } else if (str?.includes("//")) {
                str = str?.replaceAll("/-", "/")
            }else if (str?.includes("/")) {
                str = str?.replaceAll("/", "-")
            }
             else {
                a++
            }
        }
        if (str.toLowerCase().slice(-1) === '-') {
            str = str.slice(0, -1); // Remove the trailing hyphen
          }
        return str.toLowerCase()
    }
}

export const allowedPattern = /^[a-zA-Z0-9\s-]$/;

export const controlKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];

export const isAllowedKey = (key) => {
  return allowedPattern.test(key) || controlKeys.includes(key);
};

export async function appendImagesToFormData(images, formData) {
  for (const imgObj of images) {
    const altText = imgObj.altText?.trim();

    if (!altText) {
      throw new Error("Image alt text is required for all images.");
    }

    if (imgObj.file instanceof File) {
      formData.append("image", imgObj.file);
      formData.append("imageAlt", altText);
    } else if (imgObj.url) {
      try {
        const response = await fetch(imgObj.url);
        const blob = await response.blob();

        const filename = imgObj.url.split("/").pop() || "image.jpg";
        const file = new File([blob], filename, { type: blob.type });

        formData.append("image", file);
        formData.append("imageAlt", altText);
      } catch (error) {
        console.error("Failed to fetch image:", imgObj.url, error);
        throw new Error("Failed to load image from URL.");
      }
    }
  }
}



