import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  CircularProgress,
} from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import CommonDropdown from "../../commen-component/CommonDropdown/CommonDropdown";
import ImageUpload from "../../commen-component/ImageUpload/ImageUpload";
import { apiClient } from "../../lib/api-client";
import { useNavigate } from "react-router-dom";
const AddPortfolioPage = () => {
  const methods = useForm({ defaultValues: { category: "", images: [] } });
  const { handleSubmit, reset } = methods;

  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await apiClient.get("/api/category");
      const formatted = res.data.map((cat) => ({
        value: cat._id,
        label: cat.name,
      }));
      setCategories(formatted);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("category", data.category);
      data.images.forEach((item, index) => {
        if (item.file) {
          formData.append("images", item.file);
        }
      });

      await apiClient.post("/api/portfolio", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      reset();
      navigate("/portfolio");
    } catch (err) {
      console.error("Error submitting portfolio:", err);
      alert("Failed to add portfolio.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <Box>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Add Portfolio
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Category Dropdown */}
            <CommonDropdown
              name="category"
              label="Select Category"
              options={categories}
              required={true}
            />

            {/* Image Upload */}
            <ImageUpload
              name="images"
              label="Upload Portfolio Images"
              multiple
              altText
            />

            <Box mt={3}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Add Portfolio"}
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </FormProvider>
  );
};

export default AddPortfolioPage;
