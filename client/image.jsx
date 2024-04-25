import React, { useEffect, useState } from "react";
import "./profile.css";
import { useSelector, useDispatch } from "react-redux";
import { logOutuser } from "../../Redux/apiCall";
import { useNavigate } from "react-router-dom";
import placeholder from "../../Images/placeholder.png";
import Loading from "../../components/Loading/Loading";
import { BlobServiceClient } from "@azure/storage-blob";
import { MdDelete } from "react-icons/md";

// Import environment variable

function Profile() {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user.user);
  console.log(userData);

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);

  // get last imageUrls from state
  const newProfilePic = imageUrls[imageUrls.length - 1];
  console.log(newProfilePic);

  let account = "taskminderimagestore";
  let sasToken = "the value of the token";

  const containerName = "imagestore";

  const dispatch = useDispatch();
  const hadleLogOut = () => {
    logOutuser(dispatch);
    navigate("/login");
    alert("logout success");
  };

  const fetchImages = async () => {
    try {
      setLoading(true);
      const blobServiceClient = new BlobServiceClient(
        `https://${account}.blob.core.windows.net`
      );
      const containerClient =
        blobServiceClient.getContainerClient(containerName);
      const blobItems = containerClient.listBlobsFlat();

      let urls = [];
      for await (const blob of blobItems) {
        console.log(blobServiceClient);
        const imageUrl = `${blobServiceClient.url}${containerName}/${blob.name}`;
        urls.push({ name: blob.name, url: imageUrl });
        // console.log(urls);
      }
      setImageUrls(urls);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      return alert("File not exist");
    } else {
      try {
        setLoading(true);
        const blobName = `${new Date().getTime()}-${file.name}`;
        const blobServiceClient = new BlobServiceClient(
          `https://${account}.blob.core.windows.net/?${sasToken}`
        );
        const containerClient =
          blobServiceClient.getContainerClient(containerName);
        const blobClient = containerClient.getBlockBlobClient(blobName);
        const result = await blobClient.uploadData(file, {
          blobHTTPHeaders: { blobContentType: file.type },
        });
        console.log(result);
        // Clear the imageUrls array before fetching the new images

        // setImageUrls([]);
        fetchImages();
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
  };

  const deleteImage = async () => {
    const blobServiceClient = new BlobServiceClient(
      `https://${account}.blob.core.windows.net/?${sasToken}`
    );
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlockBlobClient(blobName);
    const result = await blobClient.delete();
    // console.log(result);
  };

  return (
    <div className="profile_page">
      <h1 className="profile_title">Your Profile</h1>
      <div className="profile_wrapper">
        <div className="user_img">
          <form>
            <div className="file_upload">
              {file ? (
                <img
                  className=""
                  src={URL.createObjectURL(file)}
                  alt="no pic"
                />
              ) : newProfilePic ? (
                <img className="" src={newProfilePic.url} alt="profile pic" />
              ) : (
                <img className="displayImg" src={placeholder} alt="nopic" />
              )}
            </div>

            <div className="upload-form_inputs">
              <input
                type="file"
                id="fileInput"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <button
                type="submit"
                onClick={handleSubmit}
                className="uploadimage"
              >
                Upload
              </button>

              {/* button to delete image */}
              <button onClick={() => deleteImage(urls.name)} className="delbtn">
                <MdDelete className="del_profile" />
              </button>
            </div>
          </form>
        </div>

        <div className="user_data">
          <p>User ID: {userData?.user_id}</p>
          <p>User Name: {userData?.username} </p>
          <p>Email:{userData?.email} </p>
          <p>Role: {userData?.role} </p>
        </div>
        <button onClick={hadleLogOut} className="logout">
          Logout
        </button>
      </div>
    </div>
  );
}
export default Profile;
