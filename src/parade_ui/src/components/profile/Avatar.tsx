import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { Avatar, Box, IconButton } from "@mui/material";
import imageCompression from "browser-image-compression";
import React, { useEffect, useState } from "react";
import { useGetUser } from "../../hooks/user/useGetUser";
import { useSetUserAvatar } from "../../hooks/user/useSetUserInfo";
import { UserAvatar as UserAvatarType } from "../../types/user";

const encodeImageToUint8Array = (image: string) => {
  const base64String = image.split(",")[1] ?? "";
  const bytes = Buffer.from(base64String, "base64");
  return new Uint8Array(bytes);
};

const decodeUint8ArrayToImage = (avatar?: UserAvatarType) => {
  if (!avatar || !avatar.data) {
    return undefined;
  }
  const base64String = Buffer.from(avatar.data).toString("base64");
  const res = `data:${avatar.avatarMime};base64,${base64String}`;
  return res;
};

interface UserAvatarProps {
  size?: number;
  canChange?: boolean;
  userId: string;
}

export const UserAvatar = ({
  size = 100,
  canChange = false,
  userId,
}: UserAvatarProps) => {
  const userInfo = useGetUser(userId);
  const [newImage, setNewImage] = useState("");
  const [newImageType, setNewImageType] = useState("");
  const [imageUploaded, setImageUploaded] = useState(false);

  const existingImage = decodeUint8ArrayToImage(userInfo.data?.avatar);

  const setUserAvatarMutation = useSetUserAvatar(
    // only update avatar, so don't need to set other fields
    userId,
    encodeImageToUint8Array(newImage),
    newImageType
  );

  useEffect(() => {
    if (newImage !== "" && imageUploaded) {
      setUserAvatarMutation.mutate();
    }
  }, [newImage, imageUploaded]);

  // Compress the image and store to backend
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const imageFile = e.target.files[0];
      if (imageFile.size / 1024 / 1024 > 1.0) {
        alert("Image size must be less than 1MB");
        return;
      }

      const options = {
        maxSizeMB: 0.1, // (100KB in MB)
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: imageFile.type,
      };

      try {
        const compressedFile = await imageCompression(imageFile, options);

        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            setNewImage(reader.result.toString());
            setNewImageType(compressedFile.type);
            setImageUploaded(true);
          }
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Box sx={{ position: "relative", width: size, height: size }}>
      <Avatar
        sx={{ width: size, height: size }}
        alt="Anonymous"
        src={imageUploaded ? newImage : existingImage}
      >
        A
      </Avatar>
      <input
        accept="image/png, image/jpeg"
        style={{ display: "none" }}
        id="avatar-button-file"
        type="file"
        onChange={handleImageUpload}
      />

      <label htmlFor="avatar-button-file" hidden={!canChange}>
        <IconButton
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            backgroundColor: "white",
            padding: "5px",
          }}
          component="span"
        >
          <CameraAltIcon />
        </IconButton>
      </label>
    </Box>
  );
};
