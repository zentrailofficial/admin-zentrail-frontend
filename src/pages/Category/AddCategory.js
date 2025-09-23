import React from "react";
import { useForm } from "react-hook-form";
import CategoryFormBase from "./CategoryFormBase";
import { apiClient } from "../../lib/api-client";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddCategory = () => {
  const navigate = useNavigate();
  const methods = useForm({
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      metaTitle: "",
      metaDescription: "",
      image: "",
      isblog: false,
      faq: [{ question: "", answer: "" }],
    },
  });
  

  const onSubmit = async (data) => {
    try {
      console.log(data?.image);
      if(!data?.image){
        return toast.error("image is required")
      }
      const formData = new FormData();
      formData.append("name", data?.name);
      formData.append("uid", data.slug);
      formData.append("description", data?.description);
      formData.append("metaTitle", data?.metaTitle);
      formData.append("metaDescription", data?.metaDescription);
      formData.append("metaKeyword", data?.metaKeyword);
      formData.append("faq", JSON.stringify(data?.faq));
      formData.append("isblog", data?.isblog);
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
     toast.success("Create Successful")
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message)
    }
  };

  return <CategoryFormBase methods={methods} onSubmit={onSubmit} />;
};

export default AddCategory;
