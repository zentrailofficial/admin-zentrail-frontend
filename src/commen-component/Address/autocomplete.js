import React, { useId, useState } from "react";
import { IoLocationSharp } from "react-icons/io5";
import {
  InputAdornment,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import useGoogle from "react-google-autocomplete/lib/usePlacesAutocompleteService";

const LocationSearch = ({ onSelect , value }) => {
  const uniqueId = useId();
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [locationData, setLocationData] = useState({
    formatted_address: "",
    country: "",
    state: "",
    city: "",
    route: "",
  });

  const { placesService, placePredictions, getPlacePredictions } = useGoogle({
    debounce: 500,
    language: "en",
    apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const handleAddressChange = (e, value) => {
    if (placesService && value?.place_id) {
      placesService.getDetails({ placeId: value.place_id }, (placeDetails) => {
        if (!placeDetails || !placeDetails.address_components) return;

        const address = placeDetails.formatted_address || "";
        const components = placeDetails.address_components;

        const data = {
          formatted_address: address,
          country: "",
          state: "",
          city: "",
          route: "",
        };

        components.forEach((comp) => {
          if (comp.types.includes("country")) data.country = comp.long_name;
          if (comp.types.includes("administrative_area_level_1"))
            data.state = comp.long_name;
          if (comp.types.includes("locality")) data.city = comp.long_name;
          if (comp.types.includes("sublocality") && !data.city)
            data.city = comp.long_name;
          if (comp.types.includes("route")) data.route = comp.long_name;
        });

        setLocationData(data);
        setInputValue(address);
          if (onSelect) onSelect(data);
      });
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);

    getPlacePredictions({
      input: val,
      componentRestrictions: { country: "in" },
      types: ["tourist_attraction"],
    });

    setOpen(true);
  };
  return (
    <Box>
      <Autocomplete
        id={`autocomplete-${uniqueId}`}

        freeSolo
        disableClearable
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        options={placePredictions || []}
        inputValue={inputValue}
        onChange={(e, value) => handleAddressChange(e, value)}
        getOptionLabel={(option) => option?.description || ""}
        renderOption={(props, option) => (
          <li {...props} key={option.place_id}>
            <IoLocationSharp style={{ marginRight: 8 }} />
            {option.description}
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            aria-label="Search location"
            onChange={handleInputChange}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <IoLocationSharp />
                </InputAdornment>
              ),
            }}
          />
        )}
      />
    </Box>
  );
};

export default LocationSearch;
