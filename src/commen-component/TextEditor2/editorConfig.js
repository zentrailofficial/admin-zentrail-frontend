export function InsertReelPlugin(editor) {
  editor.events.on("beforeInsertNode", (node) => {
    if (node.tagName === "IFRAME") {
      let src = node.getAttribute("src");

      // YOUTUBE SHORTS
      if (src.includes("youtube.com/shorts/")) {
        const id = src.split("/shorts/")[1].split("?")[0];
        node.setAttribute("src", `https://www.youtube.com/embed/${id}`);
      }

      // NORMAL YOUTUBE
      if (src.includes("watch?v=")) {
        const id = src.split("watch?v=")[1].split("&")[0];
        node.setAttribute("src", `https://www.youtube.com/embed/${id}`);
      }

      // INSTAGRAM REEL
      if (src.includes("instagram.com/reel/")) {
        const id = src.split("/reel/")[1].split("/")[0];
        node.setAttribute("src", `https://www.instagram.com/reel/${id}/embed`);
      }

      // TIKTOK VIDEO
      if (src.includes("tiktok.com/")) {
        node.setAttribute("src", src + "?embed=1");
      }
    }
  });
}

const editorConfig = {
  height: 450,
  toolbarSticky: false,

  buttons: [
    "source",
    "|",
    "bold",
    "italic",
    "underline",
    "|",
    "ul",
    "ol",
    "|",
    "fontsize",
    "paragraph",
    "brush",
    "|",
    "image",
    "file",
    "video",
    "link",
    "table",
    "|",
    'insertShortReel',
    '|',
    "hr",
    "eraser",
    "|",
    "fullsize"
  ],
iframe: {
  allowFullscreen: true,
  allow: "autoplay",
},

events: {
  beforeInsertNode: (node) => {
    if (node.tagName === "IFRAME") {
      let src = node.getAttribute("src");

      // Convert YouTube Shorts to embed format
      if (src.includes("youtube.com/shorts")) {
        const videoId = src.split("/shorts/")[1].split("?")[0];
        node.setAttribute("src", `https://www.youtube.com/embed/${videoId}`);
      }
    }
  }
},
  uploader: {
    insertImageAsBase64URI: true,
  },
  image: {
    edit: true,
    openOnDblClick: true,
    resize: true,
  },


  enterBlock: "p",

style: {
  h2: "font-size: 28px; font-weight: bold;",
  h3: "font-size: 24px; font-weight: bold;",
  h4: "font-size: 20px; font-weight: bold;",
  h5: "font-size: 18px; font-weight: bold;",
  h6: "font-size: 16px; font-weight: bold;",
}
};

export default editorConfig;
