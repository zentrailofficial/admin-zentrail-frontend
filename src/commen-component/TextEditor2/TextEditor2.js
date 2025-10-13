import React, { useEffect } from "react";
import { CKEditor } from "ckeditor4-react";
import { useFormContext, Controller } from "react-hook-form";
import "./TextEditor2.css";

const CustomCKEditor = ({ name, label, required, placeholder }) => {
  const { control } = useFormContext();

  // Hook CKEditor dialog definition for custom image upload
  useEffect(() => {
    const handleDialogDefinition = (evt) => {
      if (evt.data.name !== "image") return;

      const infoTab = evt.data.definition.getContents("info");
      const browseButton = infoTab.get("browse");

      if (browseButton) {
        browseButton.hidden = false;
        browseButton.onClick = function () {
          const fileInput = document.createElement("input");
          fileInput.type = "file";
          fileInput.accept = "image/*";
          fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = () => {
              const altText =
                prompt("Enter image description / alt text:", file.name) || "";
              infoTab.get("txtUrl").setValue(reader.result);
              infoTab.get("txtAlt").setValue(altText);
            };
            reader.readAsDataURL(file);
          };
          fileInput.click();
        };
      }
    };

    if (window.CKEDITOR) {
      window.CKEDITOR.on("dialogDefinition", handleDialogDefinition);
    }

    return () => {
      if (window.CKEDITOR) {
        window.CKEDITOR.removeListener("dialogDefinition", handleDialogDefinition);
      }
    };
  }, []);

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: required ? "This field is required" : false,
        minLength: {
          value: 30,
          message: "Description must be at least 30 characters long",
        },
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <div className="text-editor-container">
          {label && <label>{label}</label>}
          <CKEditor
            initData={value || ""}
            config={{
              height: 300,
              placeholder,
              removePlugins: "elementspath",
              extraPlugins: "image2",
              toolbar: [
                { name: "clipboard", items: ["Undo", "Redo"] },
                { name: "styles", items: ["Format"] },
                
                {
                  name: "basicstyles",
                  items: ["Bold", "Italic", "Underline", "Strike"],
                },
                { name: "colors", items: ["TextColor", "BGColor"] },
                {
                  name: "paragraph",
                  items: ["NumberedList", "BulletedList", "Blockquote"],
                },
                {
                  name: "insert",
                  items: ["Image", "Table", "HorizontalRule", "Link"],
                },
                { name: "tools", items: ["Maximize", "Source"] },
              ],
            }}
            onChange={(evt) => {
              const data = evt.editor.getData();
              onChange(data);
            }}
          />
          {error && (
            <p style={{ color: "red", marginTop: "4px" }}>{error.message}</p>
          )}
        </div>
      )}
    />
  );
};

export default CustomCKEditor;
