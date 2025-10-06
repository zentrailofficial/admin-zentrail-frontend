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
    whiteSpace: "nowrap",
    "&:hover": {
      background: " linear-gradient(180deg, #5959b9be, #d24bff)",
    },
  },
   apptop: (theme) => ({
    position: "fixed",
    zIndex: 1201,
    color: "linear-gradient(135deg, #75d9e6ff, #c843ff, #ff7eff)",
   background:
      theme.palette.mode === "dark"
        ? "linear-gradient(135deg, #1e1e1e, #3a3a3a)" 
        : "white",
  }),
  iconbtn: {
    mr: 2,
    display: { xs: "none", sm: "inline-flex" },
    background: "linear-gradient(135deg, #75d9e6ff, #c843ff, #ff7eff)",
    color: "white",
    "&:hover": {
      background: "linear-gradient(135deg,  #c843ff, #ff7eff, #75d9e6ff)",
    },
  },
  iconbtn2: {
    mr: 2,
    display: { sm: "none" },
    background: "linear-gradient(135deg, #75d9e6ff, #c843ff, #ff7eff)",
    color: "white",
    "&:hover": {
      background: "linear-gradient(135deg,  #c843ff, #ff7eff, #75d9e6ff)",
    },
  },
  navtypography: {
    flexGrow: 1,
    display: "inline-block",
    background: "linear-gradient(90deg, #75d9e6, #c843ff, #ff7eff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    color: "transparent",
    fontWeight: 700,
    whiteSpace: "nowrap"
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
  mainbox: {
    minHeight: "100vh",
    py: 0,
    px: 0,
    // bgcolor: "dark" ? "white" : "#F7F7F9",
    transition: "background 0.3s",
  },
  grid1: {
    flexDirection: { xs: "column", md: "row" },
    alignItems: "stretch",
    gap: 2,
  },
  customBox1: {
    display: "flex",
    alignItems: "center",
    whiteSpace: "nowrap",
    gap: 1,
  },
  customBox2: {
    display: "flex",
    alignItems: 'center',
    gap: 1
  },
  metabox1: {
    display: "flex ",
    alignItems: "center",
    gap: 1
  },
  labelbox: {
    width: "120px"
  },
  tooltipbox: {
    width: "20px"
  },
  fieldbox: {
    width: "520px"
  },
  fieldbox1: {
    width: "630px"
  },
  listBox: {
    height: 680,
    width: "100%",
    p: 2,
  },

};

export default commoncss;

/* /////////////////// heading for h1 ///////////////////// */

// .responsive-heading {
//   font-family: "DM Sans", sans-serif;
//   font-size: 24px;
//   line-height: 1.3;
//   font-weight: 500;
// }
// @media (min-width: 640px) {
//   .responsive-heading {
//     font-size: 28px;
//   }
// }
// @media (min-width: 768px) {
//   .responsive-heading {
//     font-size: 32px;
//   }
// }
// @media (min-width: 992px) {
//   .responsive-heading {
//     font-size: 36px;
//   }
// }
// @media (min-width: 1280px) {
//   .responsive-heading {
//     font-size: 40px;
//   }
// }
// @media (min-width: 1536px) {
//   .responsive-heading {
//     font-size: 44px;
//   }
// }

/* /////////////////// heading for h2 ///////////////////// */

// .responsiveheading2 {
//   font-weight: 500;
//   font-size: 22px;
//   line-height: 30px;
// }

// @media (min-width: 640px) {
//   .responsiveheading2 {
//     font-size: 24px;
//     line-height: 32px;
//   }
// }

// @media (min-width: 768px) {
//   .responsiveheading2 {
//     font-size: 28px;
//     line-height: 32px;
//   }
// }

// @media (min-width: 1024px) {
//   .responsiveheading2 {
//     font-size: 32px;
//     line-height: 35px;
//   }
// }

/* /////////////////// heading for h3 ///////////////////// */


// .responsiveheading3 {
//   font-family: "DM Sans", sans-serif;
//   font-weight: 500;
//   font-size: 20px;
//   line-height: 32px;
// }

// @media (min-width: 640px) {
//   .responsiveheading3 {
//     font-size: 22px;
//     line-height: 36px;
//   }
// }

// @media (min-width: 768px) {
//   .responsiveheading3 {
//     font-size: 26px;
//     line-height: 40px;
//   }
// }

// @media (min-width: 1024px) {
//   .responsiveheading3 {
//     font-size: 30px;
//     line-height: 44px;
//   }
// }

////////// h4 //////////
// .responsive-h4 {
//   font-size: 18px;
//   @media (min-width: 640px) {
//     font-size: 24px;
//   }

//   @media (min-width: 768px) {
//     font-size: 28px;
//   }

//   @media (min-width: 1024px) {
//     font-size: 32px;
//   }
// }

////////// h5 /////////
//  .responsiveheading5 {
//   font-family: "DM Sans", sans-serif;
//   font-weight: 500;
//   font-size: 18px;
//   line-height: 32px;
// }

// @media (min-width: 640px) {
//   .responsiveheading5 {
//     font-size: 20px;
//   }
// }

// @media (min-width: 768px) {
//   .responsiveheading5 {
//     font-size: 22px;
//   }
// }

// @media (min-width: 1024px) {
//   .responsiveheading5 {
//     font-size: 24px;
//   }
// }

/////// h6 ///////////

// .responsiveheading6 {
//   font-family: "DM Sans", sans-serif;
//   font-weight: 500;
//   font-size: 18px;
//   line-height: 28px;
// }

// @media (min-width: 640px) {
//   .responsiveheading6 {
//     font-size: 20px;
//   }
// }

// @media (min-width: 768px) {
//   .responsiveheading6 {
//     font-size: 22px;
//   }
// }

// @media (min-width: 1024px) {
//   .responsiveheading6 {
//     font-size: 22px;
//   }
// }

/* //////////////////////// paragraph ///////////////////////// */

// .responsive-text {
//   font-family: "DM Sans", sans-serif;
//   font-weight: 400;
//   font-size: 16px;
//   line-height: 20px;
// }

// @media (min-width: 640px) {
//   .responsive-text {
//     font-size: 16px;
//     line-height: 20px;
//   }
// }

// @media (min-width: 768px) {
//   .responsive-text {
//     font-size: 18px;
//     line-height: 24px;
//   }
// }

// @media (min-width: 1024px) {
//   .responsive-text {
//     font-size: 18px;
//     line-height: 24px;
//   }
// }

/* .responsive-text {
  font-family: "DM Sans", sans-serif;
  font-weight: 500;
  line-height: 24px;
  font-size: 15px;

  @media (min-width: 640px) {
    font-size: 16px;
    line-height: 1.625rem;
  }

  @media (min-width: 768px) {
    font-size: 16px;
    line-height: 24px;
  }

  @media (min-width: 1024px) {
    font-size: 16px;
    line-height: 24px;
  }
} */











