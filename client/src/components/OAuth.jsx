import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase";
import { useMutation } from "@tanstack/react-query";
import { googleAuth, signIn } from "../api/userApi";
import { useDispatch } from "react-redux";
import { signInDetails } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  async function handleGoogleClick() {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      const body = {
        username: resultsFromGoogle.user.displayName,
        email: resultsFromGoogle.user.email,
        googlePhotoUrl: resultsFromGoogle.user.photoURL,
      };
      mutate(body);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  }

  const { mutate, isError, isPending, error } = useMutation({
    mutationFn: ({ email, username, googlePhotoUrl }) =>
      googleAuth(email, username, googlePhotoUrl),
    onSuccess: (data) => {
      dispatch(signInDetails(data));
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return (
    <Button
      type="button"
      gradientDuoTone="pinkToOrange"
      outline
      onClick={handleGoogleClick}
    >
      <AiFillGoogleCircle className="w-6 h-6 mr-2" />
      Continue with Google
    </Button>
  );
}

export default OAuth;
