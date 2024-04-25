import React, { useEffect, useState } from "react";
import "./profile.css";
import { useSelector, useDispatch } from "react-redux";
import { logOutuser } from "../../Redux/apiCall";
import { useNavigate } from "react-router-dom";
import placeholder from "../../Images/placeholder.png";
import Loading from "../../components/Loading/Loading";
import { BlobServiceClient } from "@azure/storage-blob";
import { MdDelete } from "react-icons/md"; 
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastStyles } from "../../toastConfig";



function Profile() {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user.user);

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  const [userImageUrl, setUserImageUrl] = useState(null); 

  let account = "taskminderimagestore";
  let sasToken = import.meta.env.VITE_SAS_TOKEN;
  const containerName = "imagestore";

  const dispatch = useDispatch();
  const hadleLogOut = () => {
    logOutuser(dispatch);
    navigate("/login");
  };

  const fetchImages = async () => {
    try {
      setLoading(true);
      const blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net`);
      const containerClient = blobServiceClient.getContainerClient(containerName);
      const blobItems = containerClient.listBlobsFlat();

      let urls = []; //returns an array of objects with name and url
      for await (const blob of blobItems) {
        const imageUrl = `${blobServiceClient.url}${containerName}/${blob.name}`;
        urls.push({ name: blob.name, url: imageUrl });
      }
      setImageUrls(urls);
      setLoading(false);

      // Find the URL for the specific user and set it to the state
      const userImage = urls.find((url) => url.name === `${userData.user_id}.png`);
      if (userImage) {
        setUserImageUrl(userImage.url);
      } else {
        setUserImageUrl(null);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      return toast.error("Please select an image", toastStyles.error);
    } else {
      try {
        setLoading(true);
        const blobName = `${userData.user_id}.png`;
        const blobServiceClient = new BlobServiceClient(
          `https://${account}.blob.core.windows.net/?${sasToken}` 
        );
        //blobService Client is a class that allows us to interact with the blob storage
        const containerClient = blobServiceClient.getContainerClient(containerName); // Get the container client used to interact with the container
        const blobClient = containerClient.getBlockBlobClient(blobName); // Get the blob client used to interact with the blob
        const result = await blobClient.uploadData(file, {
          blobHTTPHeaders: { blobContentType: file.type },
        });

        toast.success("File uploaded successfully", toastStyles.success);
        fetchImages();
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
  };

  const deleteImage = async (blobName) => {
    const blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net/?${sasToken}`);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlockBlobClient(blobName);
    try {
      await blobClient.delete();
      toast.success("Image deleted successfully.", toastStyles.success);
      setUserImageUrl(null);
      await fetchImages();
      window.location.reload();
    } catch (error) {
      console.log("Error deleting image:", error);
    }
  };
  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="profile_page">
      {loading && <Loading />}
      <h1 className="profile_title">Your Profile</h1>
      <div className="profile_wrapper">
        <div className="user_img">
          <form>
            <div className="file_upload">
              {file ? <img className="" src={URL.createObjectURL(file)} alt="no pic" /> : userImageUrl ? <img className="" src={userImageUrl} alt="profile pic" /> : <img className="displayImg" src={placeholder} alt="nopic" />}
            </div>

            <div className="upload-form_inputs">
              <input
                type="file"
                id="fileInput"
                onChange={(e) => setFile(e.target.files[0])} // set the file to the state.
              />
              <button type="submit" onClick={handleSubmit} className="uploadimage">
                Save
              </button>

              {/* button to delete image */}
              {userImageUrl && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    deleteImage(userData.user_id + ".png");
                  }}
                  className="delbtn"
                >
                  <MdDelete className="del_profile" />
                </button>
              )}
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
