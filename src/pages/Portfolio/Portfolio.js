import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardMedia,
  CircularProgress,
  Button,
} from "@mui/material";
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import CommonDropdown from "../../commen-component/CommonDropdown/CommonDropdown";
import { apiClient } from "../../lib/api-client";
import { portfoliostyle } from "../../styles/portfolio";
import ConfirmDelete from "../../commen-component/Modals/ConfirmDelete";

const PortfolioPage = () => {
  const methods = useForm({ defaultValues: { category: "all" } });
  const { watch } = methods;

  const navigate = useNavigate();

  const selectedCategory = watch("category");

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [allPortfolioData, setAllPortfolioData] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [IdtoDelete, setIdtoDelete] = useState("");
  const [loadingForDelete, setLoadingForDelete] = useState(false);

  // handle deletee
  const handleDelete = async () => {
    setLoadingForDelete(true);
    console.log(IdtoDelete);
    try {
      const res = await apiClient.delete(`api/portfolio/${IdtoDelete}`);
      console.log(res?.data);
      if (res?.data) {
        setAllPortfolioData(
          allPortfolioData?.filter((val) => val?._id !== IdtoDelete)
        );
        setLoadingForDelete(false);
        setDialogOpen(false);
        setIdtoDelete("");
      }
    } catch (error) {
      console.error("Error fetching categories", error);
      setLoadingForDelete(false);
      setDialogOpen(false);
      setIdtoDelete("");
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await apiClient.get("/api/category");
      const formatted = res.data.map((item) => ({
        value: item._id,
        label: item.name,
      }));
      setCategoryOptions([{ value: "all", label: "All" }, ...formatted]);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  // Fetch portfolio data
  const fetchPortfolio = async () => {
    try {
      const res = await apiClient.get("/api/portfolio");
      setAllPortfolioData(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching portfolio", error);
      setLoading(false);
    }
  };

  console.log(allPortfolioData);

  // Filter images on category change
  useEffect(() => {
    if (selectedCategory === "all") {
      // Flatten all images from all items
      const allImgs = allPortfolioData.flatMap((item) => item.images || []);
      setFilteredImages(allImgs);
    } else {
      const matchedItems = allPortfolioData.filter(
        (item) => item.category === selectedCategory
      );
      const imgs = matchedItems.flatMap((item) => item.images || []);
      setFilteredImages(imgs);
    }
  }, [selectedCategory, allPortfolioData]);

  useEffect(() => {
    fetchCategories();
    fetchPortfolio();
  }, []);

  const handlePhoto = () => {
    navigate("/addportfolio");
  };

  return (
    <FormProvider {...methods}>
      <Box>
        <Paper
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            mb: 2,
          }}
        >
          <Typography variant="h5">Portfolio Gallery</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handlePhoto}
          >
            Add Photos
          </Button>
        </Paper>

        {/* Dropdown Filter */}
        <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
          <CommonDropdown
            name="category"
            label="Filter by Category"
            options={categoryOptions}
          />
        </Paper>

        {/* Images Grid */}
        {loading ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box sx={{ width: "100%"}}>
              <ImageList variant="masonry" cols={3} gap={20}>
                {allPortfolioData.map((img) => (
                  <ImageListItem key={img.img} sx={{ position: "relative"}}>
                    <img
                      srcSet={`${img?.images[0]?.url}?w=248&fit=crop&auto=format&dpr=2 2x`}
                      src={`${img?.images[0]?.url}?w=248&fit=crop&auto=format`}
                      alt={"image portfolio"}
                      loading="lazy"
                    />
                      <Paper
                        elevation={10}
                        sx={portfoliostyle.deletewrap}
                        onClick={() => {
                          setDialogOpen(true);
                          setIdtoDelete(img?._id);
                        }}
                      >
                        <DeleteIcon sx={{ color: "red" }} />
                      </Paper>
                  </ImageListItem>
                ))}
              </ImageList>
            </Box>
            {/* <Grid container spacing={2}>
              {allPortfolioData.length > 0 ? (
                allPortfolioData.map((img) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={img._id}>
                    <Card
                      sx={{
                        height: 250,
                        position: "relative",
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={img?.images[0]?.url}
                        alt="portfolio"
                        sx={{ height: "100%", objectFit: "cover" }}
                      />
                      <Paper
                        elevation={10}
                        sx={portfoliostyle.deletewrap}
                        onClick={() => {
                          setDialogOpen(true);
                          setIdtoDelete(img?._id);
                        }}
                      >
                        <DeleteIcon sx={{ color: "red" }} />
                      </Paper>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Typography>No images found for this category.</Typography>
              )}
            </Grid> */}
          </>
        )}
      </Box>
      <ConfirmDelete
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setIdtoDelete("");
        }}
        onConfirm={handleDelete}
        title="Delete Item?"
        message="This action is permanent. Do you want to continue?"
        loading={loadingForDelete}
      />
    </FormProvider>
  );
};

export default PortfolioPage;
