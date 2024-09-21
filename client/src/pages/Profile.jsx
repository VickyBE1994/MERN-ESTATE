import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRef } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserSuccuss,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccuss,
  deleteUserFailure,
  signoutUserFailure,
  signoutUserStart,
  signInFailure,
  signoutUserSuccuss,
} from "../redux/user/userSlice.js";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

//  firebase storageBucket      allow read;
// allow write:if
// request.resource.size <2 * 1024 &&
// request.resource.contentType.matches('image/.*')

const Profile = () => {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [fileperc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updatesuccuss, setUpdateSuccuss] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState({});
  const disPatch = useDispatch();

  //console.log(formData);

  //console.log(fileperc);

  //console.log(file);
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uplaodTask = uploadBytesResumable(storageRef, file);

    uplaodTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uplaodTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };
  const handleChange = async (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      disPatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = res.json();
      if (data.success === false) {
        disPatch(updateUserFailure(data.message));
        return;
      }
      disPatch(updateUserSuccuss(data));
      disPatch(setUpdateSuccuss(true));
    } catch (error) {
      disPatch(updateUserFailure(error.message));
    }
  };
  const handleDeleteUser = async () => {
    try {
      disPatch(deleteUserStart());

      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = res.json();
      if (data.success === false) {
        disPatch(deleteUserFailure(data.message));
        return;
      }
      disPatch(deleteUserSuccuss(data));
    } catch (error) {
      disPatch(deleteUserFailure(error.message));
    }
  };
  const handleSignoutUser = async () => {
    try {
      disPatch(signoutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = res.json();
      if (data.success === false) {
        disPatch(signInFailure(data.message));
        return;
      }
      disPatch(signoutUserSuccuss(data));
    } catch (error) {
      disPatch(signoutUserFailure(data.message));
    }
  };
  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };
  const handleListingDelete = async(listingId) =>{
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`,{
        method:"DELETE",
      })
      const data = await res.data()
      if(data.success === false){
        console.log(data.message);
        return
      }
      setUserListings((prev)=>
      prev.filter((listing)=> listing._id !== listingId))
    } catch (error) {
      error.message
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center my-7 font-semibold">profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
          src={formData.avatar || currentUser.avatar}
          alt="profile"
        />
        <p className="text-sm text-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error image upload(image must be less than 2 mb )
            </span>
          ) : fileperc > 0 && fileperc < 100 ? (
            <span className="text-slate-700">{`uploading ${fileperc}%`}</span>
          ) : fileperc === 100 ? (
            <span className="text-green-600">Image upload succuessfully</span>
          ) : (
            " "
          )}
        </p>
        <input
          type="text"
          placeholder="username"
          id="username"
          defaultValue={currentUser.username}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          defaultValue={currentUser.email}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="rounded-lg bg-slate-700 text-white p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "loading..." : "update"}
        </button>
        <Link
          className="bg-green-700 p-3 text-center uppercase rounded-lg text-white hover:opacity-95"
          to={"/create-listing"}
        >
          create listing
        </Link>
      </form>
      <div className="flex justify-between mt-3">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          delete account
        </span>
        <span
          onClick={handleSignoutUser}
          className="text-red-700 cursor-pointer"
        >
          sign out
        </span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      <p className="text-green-700 mt-5">
        {updatesuccuss ? "user is updated succussfully" : ""}
      </p>
      <button onClick={handleShowListings} className="text-green-700 w-full">
        show listings
      </button>
      <p className="text-red-700 mt-5">
        {showListingsError ? "Error showing listing" : ""}
      </p>
      {userListings &&
        userListings.length > 0 &&
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">your listings</h1>
        {  userListings.map((listing) => (
          <div
            key={listing._id}
            className=" border rounded-lg p-3 flex justify-between items-center gap-4"
          >
            <Link to={`/listing/${listing._id}`}>
              <img
                src={listing.imageUrls[0]}
                alt="listing cover"
                className="h-16 w-16 object-contain "
              />
            </Link>
            <Link
              className="flex-1 text-slate-800 font-semibold   hover:underline truncate"
              to={`/listing/${listing._id}`}
            >
              <p>{listing.name}</p>
            </Link>
            <div className="flex flex-col items-center">
             
              <button onClick={()=>handleListingDelete(listing._id)} className="text-red-700 uppercase">delete</button>
              <Link to={`/update-listing/${listing._id}`}>
              <button className="text-green-700 uppercase"> edit</button>
              </Link>
   
            </div>
          </div>
        ))}
        </div>}
    </div>
  );
};

export default Profile;
