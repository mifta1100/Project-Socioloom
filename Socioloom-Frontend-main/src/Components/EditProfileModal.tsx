import "./EditProfileModal.css";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { FieldValues, useForm } from "react-hook-form";
import userPlaceholder from "../assets/user.jpg";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";

interface Props {
  setOpenModal: (arg: boolean) => void;
  displayName: string;
  bio: string;
  coverPhoto: string;
  profilePhoto: string;
}

function Modal({
  setOpenModal,
  displayName,
  bio,
  coverPhoto,
  profilePhoto,
}: Props) {
  useEffect(() => {
    let defaultValues = {
      displayName: displayName,
      bio: bio,
    };
    reset({ ...defaultValues });
  }, []);
  const [currentProfileImage, setCurrentProfileImage] = useState<File>();
  const [currentProfilePreviewImage, setProfilePreviewImage] =
    useState<string>("");
  const profileImageInputRef = useRef<HTMLInputElement | null>(null);
  const [currentCoverImage, setCurrentCoverImage] = useState<File>();
  const [currentCoverPreviewImage, setCoverPreviewImage] = useState<string>("");
  const coverImageInputRef = useRef<HTMLInputElement | null>(null);
  const [isValid, setIsValid] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const coverPreview = coverPhoto ? (
    <img
      className="editProfileModal__coverphoto"
      src={`data:image/png;base64,${coverPhoto}`}
      alt=""
    />
  ) : (
    <div className="editProfileModal__coverphoto__placeholder"></div>
  );

  const profilePreview = profilePhoto ? (
    <img
      className="editProfileModal__profilephoto"
      src={`data:image/png;base64,${profilePhoto}`}
      alt=""
    />
  ) : (
    <img
      className="editProfileModal__profilephoto"
      src={userPlaceholder}
      alt=""
    />
  );

  const selectProfileImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files as FileList;
    setCurrentProfileImage(selectedFiles?.[0]);
    setProfilePreviewImage(URL.createObjectURL(selectedFiles?.[0]));
  };

  const selectCoverImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files as FileList;
    setCurrentCoverImage(selectedFiles?.[0]);
    setCoverPreviewImage(URL.createObjectURL(selectedFiles?.[0]));
  };
  const navigate = useNavigate();
  const refreshPage = () => {
    navigate(0);
  };

  const submitForm = (data: FieldValues) => {
    setIsSubmitting(true);
    // console.log("Before append", data);
    // console.log("Current image", currentImage);
    // console.log("PostText", data.PostText);
    const token = localStorage.getItem("token");
    const formData = new FormData();

    formData.append("profilePicture", currentProfileImage as File);
    formData.append("coverPicture", currentCoverImage as File);
    formData.append("displayName", data.displayName);
    formData.append("bio", data.bio);
    for (let pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }
    axios
      .put("http://localhost:3000/api/user", formData, {
        headers: {
          "x-auth-token": token,
        },
        params: {
          PostType: "Personal",
        },
      })
      .then((res) => {
        console.log(res);
        setCurrentProfileImage(undefined);
        setProfilePreviewImage("");
        setCurrentCoverImage(undefined);
        setCoverPreviewImage("");
        setIsSubmitting(false);
        setOpenModal(false);
        refreshPage();
      });
  };

  return (
    <div className="editProfileModalBackground">
      <form onSubmit={handleSubmit(submitForm)}>
        <div className="editProfileModalContainer">
          <div className="editProfileModal__header">
            <div
              onClick={() => setOpenModal(false)}
              className="editProfileModalCloseIcon"
            >
              <CloseIcon fontSize="small" />
            </div>
            <div>Edit Profile</div>
            <button
              type="submit"
              disabled={isSubmitting || !isValid}
              className="editProfileModal__savebtn"
            >
              Save
            </button>
          </div>
          <div className="editProfileModal__body">
            <div className="editProfileModal__coverPhoto__conatiner">
              {currentCoverPreviewImage ? (
                <img
                  className="editProfileModal__coverphoto"
                  src={currentCoverPreviewImage}
                  alt=""
                />
              ) : (
                coverPreview
              )}
              {!currentCoverPreviewImage && (
                <div
                  onClick={() => {
                    if (coverImageInputRef && coverImageInputRef.current) {
                      (coverImageInputRef.current as HTMLInputElement).click();
                    }
                  }}
                  className="editProfileModal__coverphoto__choose"
                >
                  <AddAPhotoIcon />
                  <input
                    ref={coverImageInputRef}
                    style={{ display: "none" }}
                    onChange={selectCoverImage}
                    type="file"
                    accept="image/*"
                  />
                </div>
              )}
            </div>
            <div className="editProfileModal__profilePhoto__conatiner">
              <div className="editProfileModal__profilePhoto__subconatiner">
                {currentProfilePreviewImage ? (
                  <img
                    className="editProfileModal__profilephoto"
                    src={currentProfilePreviewImage}
                    alt=""
                  />
                ) : (
                  profilePreview
                )}
                {!currentProfilePreviewImage && (
                  <div
                    onClick={() => {
                      if (
                        profileImageInputRef &&
                        profileImageInputRef.current
                      ) {
                        (
                          profileImageInputRef.current as HTMLInputElement
                        ).click();
                      }
                    }}
                    className="editProfileModal__profilephoto__choose"
                  >
                    <AddAPhotoIcon />
                    <input
                      ref={profileImageInputRef}
                      style={{ display: "none" }}
                      onChange={selectProfileImage}
                      type="file"
                      accept="image/*"
                    />
                  </div>
                )}
              </div>
            </div>
            <label htmlFor="name">Display Name</label>
            <input
              {...register("displayName")}
              className="editProfileModal__input"
              // id="name"
              type="text"
              placeholder="Name"
              onChange={(data) => {
                if (
                  data.target.value.length > 0 &&
                  data.target.value.length <= 30
                ) {
                  setIsValid(true);
                } else {
                  setIsValid(false);
                }
              }}
            />
            <label htmlFor="bio">Bio</label>
            <textarea
              {...register("bio")}
              className="editProfileModal__input"
              // id="bio"
              rows={2}
              placeholder="Bio"
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default Modal;
