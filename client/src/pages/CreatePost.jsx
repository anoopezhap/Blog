import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { createPost } from "../api/postApi";
import { useNavigate } from "react-router-dom";

function CreatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgess, setImageUploadProgess] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  function handleFormSubmit(e) {
    e.preventDefault();
    mutate(formData);
  }

  const { mutate, isError, isPending, error } = useMutation({
    mutationFn: (formData) => createPost(formData),
    onSuccess: (data) => {
      navigate(`/post/${data.data.savedPost.slug}`);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  async function handleUploadImage() {
    try {
      if (!file) {
        setImageUploadError("Please select an image");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progess =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgess(progess.toFixed(0));
        },
        (error) => {
          setImageUploadError(
            "Image upload failed. File should be less than 2mb"
          );
          setImageUploadProgess(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgess(null);
            setImageUploadError(null);

            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError("Image UploadFailed");
      setImageUploadProgess(null);
    }
  }

  return (
    <div className="pt-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a Post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
        <div className="flex flex-xol gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value="uncategorized">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="react">React.js</option>
            <option value="node">Node.js</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            onClick={handleUploadImage}
            disabled={imageUploadProgess}
          >
            {imageUploadProgess ? (
              <div className="w-16 h16">
                <CircularProgressbar
                  value={imageUploadProgess}
                  text={`${imageUploadProgess || 0}%`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}

        {formData.image && (
          <img
            src={formData.image}
            alt="upload"
            className="w-full h-72 object-cover"
          />
        )}
        <ReactQuill
          theme="snow"
          placeholder="Write Something...."
          className="h-72 mb-12"
          required
          onChange={(value) => setFormData({ ...formData, content: value })}
        />
        <Button
          type="submit"
          gradientDuoTone="purpleToPink"
          disabled={imageUploadProgess}
        >
          Publish
        </Button>
        {isError && (
          <Alert color="failure" className="mt-5">
            {error?.response?.data?.message}
          </Alert>
        )}
      </form>
    </div>
  );
}

export default CreatePost;
