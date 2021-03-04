import React from "react";
import { StyleSheet } from "react-native";
import * as Yup from "yup";

import CategoryPickerItem from "../components/CategoryPickerItem";
import { AppForm, AppFormField, SubmitButton } from "../components/forms";
import AppFormImagePicker from "../components/forms/AppFormImagePicker";
import AppFormPicker from "../components/forms/AppFormPicker";
import Screen from "../components/Screen";
import useLocation from "../hooks/useLocation";
import listingsApi from "../api/listings";
import { useState } from "react";
import UploadScreen from "./UploadScreen";

const validationSchema = Yup.object().shape({
  title: Yup.string().required().min(1).label("Title"),
  price: Yup.number().required().min(1).max(10000).label("Price"),
  description: Yup.string().label("Description"),
  category: Yup.object().required().nullable().label("Category"),
  images: Yup.array().min(1, "Please select atleast one image."),
});

const categories = [
  {
    label: "Furniture",
    value: 1,
    backgroundColor: "red",
    icon: "floor-lamp",
  },
  { label: "Cars", value: 2, backgroundColor: "green", icon: "car" },
  { label: "Camera", value: 3, backgroundColor: "blue", icon: "camera" },
  { label: "Games", value: 4, backgroundColor: "red", icon: "cards" },
  {
    label: "Clothing",
    value: 5,
    backgroundColor: "green",
    icon: "shoe-heel",
  },
  { label: "Sports", value: 6, backgroundColor: "blue", icon: "basketball" },
  {
    label: "Books",
    value: 7,
    backgroundColor: "red",
    icon: "book-open-variant",
  },
  {
    label: "Movies & Music",
    value: 8,
    backgroundColor: "green",
    icon: "headphones",
  },
  {
    label: "Other",
    value: 9,
    backgroundColor: "blue",
    icon: "checkbox-blank-outline",
  },
];

function ListingEditScreen() {
  const location = useLocation();
  const [uploadVisible, setUploadVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (listing, { resetForm }) => {
    setProgress(0);
    setUploadVisible(true);
    const result = await listingsApi.addListing(
      { ...listing, location },
      (progress) => setProgress(progress)
    );

    if (!result.ok) {
      setUploadVisible(false);
      return alert("Could not save the listing.");
    }

    resetForm();
  };

  return (
    <Screen style={styles.container}>
      <UploadScreen
        onDone={() => setUploadVisible(false)}
        progress={progress}
        visible={uploadVisible}
      />
      <AppForm
        initialValues={{
          title: "",
          price: "",
          description: "",
          category: null,
          images: [],
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <AppFormImagePicker name="images" />
        <AppFormField maxLength={255} name="title" placeholder="Title" />
        <AppFormField
          keyboardType="numeric"
          maxLength={8}
          name="price"
          placeholder="Price"
          width={120}
        />
        <AppFormPicker
          items={categories}
          name="category"
          numberOfColumns={3}
          PickerItemComponent={CategoryPickerItem}
          placeholder="Category"
          width="50%"
        />
        <AppFormField
          maxLength={255}
          multiline
          name="description"
          numberOfLines={3}
          placeholder="Description"
        />
        <SubmitButton title="Post" />
      </AppForm>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default ListingEditScreen;
