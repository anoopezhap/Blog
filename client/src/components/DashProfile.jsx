import { Alert, Button, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useMutation } from "@tanstack/react-query";
import { updateUser } from "../api/userApi";
import { signInDetails } from "../redux/userSlice";

function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const [imageFile, setImagefile] = useState(null);
  const [imageFileUrl, setImagefileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [imageFileUploading, setImageFileUploading] = useState(false);

  const { mutate, isError, isPending, error, isSuccess } = useMutation({
    mutationFn: ({ userId, username, password, profilePicture }) =>
      updateUser(userId, username, password, profilePicture),
    onSuccess: (data) => {
      dispatch(signInDetails(data));
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  const filePickerRef = useRef();

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      setImagefile(file);
      setImagefileUrl(URL.createObjectURL(file));
    }
  }

  function handleChange(e) {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (Object.keys(formData).length === 0) {
      return;
    }
    const body = { ...formData, userId: currentUser._id };

    if (imageFileUploading) {
      return;
    }

    mutate(body);
  }

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  async function uploadImage() {
    setImageFileUploading(true);
    const storage = getStorage(app);

    const fileName = new Date().getTime() + imageFile.name;

    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    setImageFileUploadError(null);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progess = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progess.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          "Could not upload the image. File must be less than 2mb"
        );
        setImageFileUploadProgress(null);
        setImagefile(null);
        setImagefileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImagefileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  }
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className="w-32 h-32 self-center cursor-pointer relative"
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${
                    imageFileUploadProgress / 100
                  })`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="profilepicture"
            className="rounded-full w-full h-full border-8 border-[lightgray] object-cover"
          />
        </div>
        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}
        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
          disabled
        />
        <TextInput
          type="password"
          id="password"
          placeholder="password"
          onChange={handleChange}
        />
        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          outline
          disabled={
            imageFileUploading ||
            isPending ||
            Object.keys(formData).length === 0
          }
        >
          Update
        </Button>
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span>Delete Account</span>
        <span>Signout</span>
      </div>
      {isSuccess && (
        <Alert color="success" className="mt-3">
          User updated successfully
        </Alert>
      )}
      {isError && (
        <Alert color="failure" className="mt-3">
          {error?.response?.data?.message}
        </Alert>
      )}
    </div>
  );
}

export default DashProfile;
