import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { signoutUser } from "../api/userApi";
import { deleteUserDetails } from "../redux/userSlice";
import { useEffect, useState } from "react";

function Header() {
  // const [searchTerm, setSearchTerm] = useState("");
  // const location = useLocation();

  //console.log(searchTerm);

  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const currentParams = Object.fromEntries([...searchParams]);

  //const searchTerm = searchParams.get("searchTerm");

  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   const urlParams = new URLSearchParams(location.search);
  //   const searchTermFromUrl = urlParams.get("searchTerm");
  //   if (searchTermFromUrl) {
  //     setSearchTerm(searchTermFromUrl);
  //   }
  // }, [location.search]);

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

  function handleSignout(e) {
    signoutMutate();
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // const urlParams = new URLSearchParams(location.search);
    // urlParams.set("searchTerm", searchTerm);
    // const searchQuery = urlParams.toString();
    //searchParams.set("searchterm", e.target.value);
    const searchterm = searchParams.get("searchterm");
    //console.log(searchterm);
    //setSearchParams(searchParams);
    navigate(`/search?searchterm=${searchterm}`);
  };

  const path = useLocation().pathname;
  return (
    <Navbar className="border-b-2">
      <Link
        to="/"
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold"
      >
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
          Anoop's
        </span>
        Blog
      </Link>
      {/* <form onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
          //value={currentParams.searchterm}
          onChange={(e) => searchParams.set("searchterm", e.target.value)}
        />
      </form> */}
      <Button className="lg:hidden w-12 h-10" color="gray" pill>
        <AiOutlineSearch />
      </Button>
      <div className="flex gap-2 md:order-2">
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt="user" img={currentUser.profilePicture} rounded />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">@{currentUser.username}</span>
              <span className="block text-sm font-medium truncate">
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to={"/dashboard?tab=profile"}>
              <Dropdown.Item>Profile</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleSignout}>Sign Out</Dropdown.Item>
            </Link>
          </Dropdown>
        ) : (
          <Link to="/sign-in">
            <Button gradientDuoTone="purpleToBlue" outline>
              Sign In
            </Button>
          </Link>
        )}

        <Navbar.Toggle />
      </div>

      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as={"div"}>
          <Link to="/">Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={"div"}>
          <Link to="/about">About</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/projects"} as={"div"}>
          <Link to="/projects">Projects</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;
