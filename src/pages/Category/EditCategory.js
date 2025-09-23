import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CategoryFormBase from "./CategoryFormBase";
import { apiClient } from "../../lib/api-client";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const EditCategory = () => {
  const methods = useForm();
  const Navigation = useNavigate();
  const param = useParams();
  const categoryId = param.id;

  useEffect(() => {
    const fetchData = async () => {
      const res = await apiClient.get(`/api/category/${categoryId}`);
      methods.reset({
        ...res.data[0],
        slug: res.data[0].uid,
        // image: res.data[0].image
        //   ? [
        //       {
        //         file: "https://res.cloudinary.com/dtidgvjlt/image/upload/v1754897645/categories/gsuj1pm6qx35snwkyiol.webp", // No actual file since it's from server
        //         altText: res.data[0].imageAlt || "",
        //         preview: `${process.env.REACT_APP_API_URL}/${res.data[0].image}`,
        //       },
        //     ]
        //   : [],
      });
    };
    fetchData();
  }, [categoryId]);

  const onSubmit = async (data) => {
    try {
     await apiClient.put(`/api/category/${categoryId}`, data);
      Navigation("/category");
      toast.success("Category Updated successfully")
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <CategoryFormBase
      methods={methods}
      onSubmit={onSubmit}
      isEdit
      defaultImage={methods.watch("image")}
    />
  );
};

export default EditCategory;
