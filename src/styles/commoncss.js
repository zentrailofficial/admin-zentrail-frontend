import { colors } from "@mui/material";

const commoncss = {
  paperShadow: {
    p: 3,
    borderRadius: 4,
    mt: 2,
  },
  faqBox: {
    maxHeight: 300,
    overflowY: "auto",
    pr: 1,
    colors: 'linear-gradient(180deg, #00ffe5be, #d24bff)'
  },

  commonBtn: {
    background: " linear-gradient(to right , #0095ffbe, #d24bff, #d24bff)",
    color: "#fff",
    fontWeight: "600",
    textTransform: "none",
    "&:hover": {
      background: " linear-gradient(180deg, #5959b9be, #d24bff)",
    },
   },

    cardlineargradient: {
      position: 'relative',
      borderRadius: 3,
      mb: 2,
      p: 3,
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: '6px',
        borderTopLeftRadius: 'inherit',
        borderBottomLeftRadius: 'inherit',
        backgroundImage: 'linear-gradient(180deg, #00ffe5be, #d24bff)',

      }
    },
    leftGrid: {
      width: { xs: "100%", md: "50%" },
      display: "flex",
      flexDirection: "column",
    },
    rightGrid: {
      width: { xs: "100%", md: "45%" },
      display: "flex",
      flexDirection: "column",
    },
    meta: {
      borderRadius: 3,
      padding: { xs: 3, md: 2 }
    },
    faq: {
      border: "1px solid #ddd",
      borderRadius: 2,
      p: 2,
      mb: 2,
    },
  };

  export default commoncss;
