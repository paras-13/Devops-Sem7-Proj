import React, { useState } from "react";
import "./update.scss";
import { makeRequest } from "../../axios";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const Update = ({ setOpenUpdate, user }) => {
  const [cover, setCover] = useState(null);
  const [profile, setProfile] = useState(null);
  const [texts, setTexts] = useState({
    name: "",
    city: "",
    website: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setTexts((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (user) => {
      return makeRequest.put("/users/", user);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
    },
  });

  const upload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err) {
      console.log("Error uploading image:", err);
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();

    let coverUrl = cover ? await upload(cover) : user.coverPic;
    let profileUrl = profile ? await upload(profile) : user.profilePic;

    const updatedData = {
      coverPic: coverUrl,
      profilePic: profileUrl,
    };

    if (texts.name.trim() !== "") updatedData.name = texts.name;
    else updatedData.name = user.name;

    if (texts.city.trim() !== "") updatedData.city = texts.city;
    else updatedData.city = user.city;

    if (texts.website.trim() !== "") updatedData.website = texts.website;
    else updatedData.website = user.website;

    if (texts.email && texts.email.trim() !== "")
      updatedData.email = texts.email;
    if (texts.password && texts.password.trim() !== "")
      updatedData.password = texts.password;

    mutation.mutate(updatedData);
    setOpenUpdate(false);
  };

  return (
    <div className="update">
      <div className="wrapper">
        <h1>Update Your Profile</h1>
        <form>
          <div className="files">
            <label htmlFor="cover">
              <span>Cover Picture</span>
              <div className="imgContainer">
                <img
                  src={
                    cover
                      ? URL.createObjectURL(cover)
                      : "/upload/" + user.coverPic
                  }
                  alt=""
                />
                <CloudUploadIcon className="icon" />
              </div>
            </label>
            <input
              type="file"
              id="cover"
              style={{ display: "none" }}
              onChange={(e) => setCover(e.target.files[0])}
            />

            <label htmlFor="profile">
              <span>Profile Picture</span>
              <div className="imgContainer">
                <img
                  src={
                    profile
                      ? URL.createObjectURL(profile)
                      : "/upload/" + user.profilePic
                  }
                  alt=""
                />
                <CloudUploadIcon className="icon" />
              </div>
            </label>
            <input
              type="file"
              id="profile"
              style={{ display: "none" }}
              onChange={(e) => setProfile(e.target.files[0])}
            />
          </div>

          <label>Email</label>
          <input
            type="text"
            value={texts.email}
            name="email"
            onChange={handleChange}
          />

          <label>Password</label>
          <input
            type="text"
            value={texts.password}
            name="password"
            onChange={handleChange}
          />

          <label>Name</label>
          <input
            type="text"
            value={texts.name}
            name="name"
            onChange={handleChange}
          />

          <label>Country / City</label>
          <input
            type="text"
            name="city"
            value={texts.city}
            onChange={handleChange}
          />

          <label>Website</label>
          <input
            type="text"
            name="website"
            value={texts.website}
            onChange={handleChange}
          />

          <button onClick={handleClick}>Update</button>
        </form>

        <button className="close" onClick={() => setOpenUpdate(false)}>
          close
        </button>
      </div>
    </div>
  );
};

export default Update;
