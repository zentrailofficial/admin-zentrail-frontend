import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiClient } from "../../lib/api-client";
import ServiceFormBase from "./ServiceFormBase";

const EditService = () => {
  const { id } = useParams();
  const [defaultValues, setDefaultValues] = useState(null);
console.log(defaultValues , 'defaultValues')
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
              title: res.data?.whyPoornam[0]?.title || "",
              description: res.data?.whyPoornam[0]?.description || "",
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
  console.log(defaultValues, "defaultValues");

  if (!defaultValues) return <p>Loading...</p>;

  return (
    <ServiceFormBase defaultValues={defaultValues} mode="edit" serviceId={id} />
  );
};

export default EditService;
