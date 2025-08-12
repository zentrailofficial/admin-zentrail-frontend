import React from "react";
import { useForm } from "react-hook-form";
import CategoryFormBase from "./CategoryFormBase";
import { apiClient } from "../../lib/api-client";
import { useNavigate } from "react-router-dom";

const AddCategory = () => {
  const navigate = useNavigate();
  const methods = useForm({
    defaultValues: {
      name: "",
      description: "",
      metaTitle: "",
      metaDescription: "",
      image: "",
    },
  });

  //  name: {
  //   type: String,
  //   required: true,
  //   unique: true,
  //   trim: true,
  //   lowercase: true,
  // },
  // description: {
  //   type: String,
  //   default: '',
  //   trim: true,
  // },
  // metaTitle: {
  //   type: String,
  //   default: '',
  //   trim: true,
  // },
  // metaDescription: {
  //   type: String,
  //   default: '',
  //   trim: true,
  // },
  // image: {
  //   type: String,
  //   default: '',
  //   trim: true,
  // },

  const onSubmit = async (data) => {
    try {
      console.log(data.image[0].file);
      const formData = new FormData();
      formData.append("name", data?.name);
      formData.append("description", data?.description);
      formData.append("metaTitle", data?.metaTitle);
      formData.append("metaDescription", data?.metaDescription);
      // formData.append("image", data?.image);
      // if (data.image[0]?.file) {
      formData.append("image", data?.image[0]?.file);
      formData.append("imageAlt", data?.image[0]?.altText || "");
      // }
      await apiClient.post("/api/category", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      methods.reset();
      navigate("/category");
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message);
    }
  };

  return <CategoryFormBase methods={methods} onSubmit={onSubmit} />;
};

export default AddCategory;
