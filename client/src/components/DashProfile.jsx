import { Alert, Button, Modal, TextInput } from "flowbite-react";
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
import { deleteUser, signoutUser, updateUser } from "../api/userApi";
import { signInDetails, deleteUserDetails } from "../redux/userSlice";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from "react-router-dom";

function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const [imageFile, setImagefile] = useState(null);
  const [imageFileUrl, setImagefileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  // console.log("image fill url", imageFileUrl);
  // console.log("current user", currentUser.profilePicture);

  const { mutate, isError, isPending, error, isSuccess } = useMutation({
    mutationFn: ({ userId, username, password, profilePicture }) =>
      updateUser(userId, username, password, profilePicture),
    onSuccess: (data) => {
      dispatch(signInDetails(data));
    },
    onError: (error) => {
      //console.log("error", error);
    },
  });

  const {
    mutate: deleteMutate,
    isError: deleteIsError,
    isPending: deleteIsPending,
    error: deleteError,
    isSuccess: deleteIsSuccess,
  } = useMutation({
    mutationFn: ({ userId }) => deleteUser(userId),
    onSuccess: (data) => {
      dispatch(deleteUserDetails());
    },
    onError: (error) => {
      setShowDeletePopup(false);
      console.log("error", error);
    },
  });

  const {
    mutate: signoutMutate,
    isError: signoutIserror,
    isPending: signoutIsPending,
    error: signoutError,
  } = useMutation({
    mutationFn: () => signoutUser(),
    onSuccess: () => {
      dispatch(deleteUserDetails());
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

  function handleSignout() {
    signoutMutate();
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

  function handleDeleteUser() {
    const body = { userId: currentUser._id };
    deleteMutate(body);
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
        {currentUser.isAdmin && (
          <Link to="/create-post">
            <Button
              type="button"
              gradientDuoTone="purpleToPink"
              className="w-full"
            >
              Create a Post
            </Button>
          </Link>
        )}
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span
          onClick={() => setShowDeletePopup(true)}
          className="cursor-pointer"
        >
          Delete Account
        </span>
        <span className="cursor-pointer" onClick={handleSignout}>
          Signout
        </span>
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
      {deleteIsError && (
        <Alert color="failure" className="mt-3">
          {deleteError?.response?.data?.message}
        </Alert>
      )}
      <Modal
        show={showDeletePopup}
        onClose={() => setShowDeletePopup(false)}
        popup
        size="md"
      >
        {" "}
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete your account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={handleDeleteUser}
                disabled={deleteIsPending}
              >
                Yes, I'm sure
              </Button>
              <Button
                color="gray"
                onClick={() => setShowDeletePopup(false)}
                disabled={deleteIsPending}
              >
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default DashProfile;
