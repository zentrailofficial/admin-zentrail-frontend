import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import CategoryFormBase from "./CategoryFormBase";
import { apiClient } from "../../lib/api-client";
import { useParams, useNavigate } from "react-router-dom";
const EditCategory = () => {
  const methods = useForm();
  const Navigation = useNavigate();
  const param = useParams();
  const categoryId = param.id;
  console.log(methods.watch("image"));
  useEffect(() => {
    const fetchData = async () => {
      const res = await apiClient.get(`/api/category/${categoryId}`);
      methods.reset({
        ...res.data,
        image: res.data.image
          ? [
              {
                file: "https://res.cloudinary.com/dtidgvjlt/image/upload/v1754897645/categories/gsuj1pm6qx35snwkyiol.webp", // No actual file since it's from server
                altText: res.data.imageAlt || "",
                preview: `${process.env.REACT_APP_API_URL}/${res.data.image}`,
              },
            ]
          : [],
      });
    };
    fetchData();
  }, [categoryId]);

  const onSubmit = async (data) => {
    await apiClient.put(`/api/category/${categoryId}`, data);
    Navigation("/category");
  };

  return (
    <CategoryFormBase
      methods={methods}
      onSubmit={onSubmit}
      isEdit
      // defaultImage={methods.watch("image")}
    />
  );
};

export default EditCategory;
