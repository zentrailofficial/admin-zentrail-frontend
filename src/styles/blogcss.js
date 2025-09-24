const addBlogStyle = {
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
  box: {
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
  stackBlog: {
    display: "flex",
    p: 3,
    borderRadius: 4,
    mt: 2,
    // display:"flex",
    //  direction:"col",
    //   alignItems:"center", 
    //   spacing: 2,
    //    mb:1,
  },
};

export default addBlogStyle;
