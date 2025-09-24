import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CategoryFormBase from "./CategoryFormBase";
import { apiClient } from "../../lib/api-client";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { appendImagesToFormData } from "../../utils/helperFunctions";
const EditCategory = () => {
  const [formKey, setFormKey] = useState(0);
  const methods = useForm({
    defaultValues: {
      image: [],
    },
  });
  const Navigation = useNavigate();
  const param = useParams();
  const categoryId = param.id;

  useEffect(() => {
    const fetchData = async () => {
      const res = await apiClient.get(`/api/category/${categoryId}`);
      methods.reset({
        ...res.data[0],
        slug: res.data[0].uid,
        image: res?.data[0]?.image
          ? [
            {
              url: res?.data[0]?.image,
              altText: res?.data[0]?.imageAlt || "",
            },
          ]
          : [],
      });
      setFormKey(prev => prev + 1);
    };
    fetchData();
  }, [categoryId]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("slug", data.slug);
      formData.append("description", data.description || "");
      formData.append("isblog", data.isblog ? "true" : "false");
      // SEO fields
      formData.append("metaTitle", data.metaTitle || "");
      formData.append("metaDescription", data.metaDescription || "");
      formData.append("metaKeyword", data.metaKeyword || "");
      // Handle image uploads (only upload new files)
      try {
        if (Array.isArray(data.image)) {
          await appendImagesToFormData(data.image, formData);
        }
      } catch (imageError) {
        toast.error(imageError.message || "Please provide alt text for all images.");
        return; // Stop submission
      }

      // if (Array.isArray(data.image)) {
      //   data.image.forEach((imgObj, index) => {
      //     if (imgObj.file instanceof File) {
      //       formData.append("image", imgObj.file);
      //       formData.append(`imageAlt`, imgObj.altText || "");
      //       console.log("1");

      //     } else if (imgObj.url) {
      //       appendImagesToFormData(imgObj?.url, formData)
      //       // formData.append("image", imgObj.url);
      //       // formData.append(`imageAlt`, imgObj.altText || "");
      //       console.log("2");

      //     }
      //   });
      // }

      // Handle FAQQ list 
      if (Array.isArray(data.faq)) {
        formData.append("faq", JSON.stringify(data.faq));
      }

      await apiClient.put(`/api/category/${categoryId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Category Updated successfully");
      Navigation("/category");
    } catch (error) {
      toast.error(error?.response?.data?.message||"Failed to update category.");
    }
  };


  return (
    <CategoryFormBase
      key={formKey}
      methods={methods}
      onSubmit={onSubmit}
      isEdit
      defaultImage={methods.watch("image")}
    />
  );
};

export default EditCategory;
