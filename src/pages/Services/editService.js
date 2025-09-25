import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiClient } from "../../lib/api-client";
import ServiceFormBase from "./ServiceFormBase";

const EditService = () => {
  const { id } = useParams();
  const [defaultValues, setDefaultValues] = useState(null);
  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await apiClient.get(
          `/api/service/getServicePageById/Admin/event/${id}`
        );
        const formattedData = {
          ...res.data,
          serviceCategory: res.data?.serviceCategory?.map((s) => s._id) || [],
          blogcategory: res.data?.blogcategory._id,
          whyPoornam: [
            {
              title: res.data?.whyPoornam[0]?.title || res.data?.whyPoornam?.title  || "",
              description: res.data?.whyPoornam[0]?.description || res.data?.whyPoornam?.description || "",
            },
          ],
          featuredImage:[res.data.featuredImage]
        };
        setDefaultValues(formattedData);
      } catch (err) {
        console.error("Error fetching service", err);
      }
    };
    fetchService();
  }, [id]);


  if (!defaultValues) return <p>Loading...</p>;

  return (
    <ServiceFormBase defaultValues={defaultValues} mode="edit" serviceId={id} />
  );
};

export default EditService;
