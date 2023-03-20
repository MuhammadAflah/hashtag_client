import {
  ManageAccountsOutlined,
  EditOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
  Chat,
} from "@mui/icons-material";
import { Box, Typography, Divider, useTheme, Button } from "@mui/material";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDataAPI, patchDataAPI } from "utils/fetchData";
import { setIsEditing } from "state/authSlice";
import axios from "axios";

const UserWidget = ({
  userId,
  picturePath,
  isEditUser,
  isFriendData,
  isProfile = false,
}) => {
  const { palette } = useTheme();
  const navigate = useNavigate();
  const [friendData, setFriendData] = useState({});
  const [followers, setFollowers] = useState({});
  const token = useSelector((state) => state?.token);
  const user = useSelector((state) => state?.user);
  const dark = palette?.neutral?.dark;
  const medium = palette?.neutral?.medium;
  const main = palette?.neutral?.main;
  const dispatch = useDispatch();
  const {userId:friendId} = useParams()
  
  const followings = useSelector((state) => state?.user?.followings);
  const [isFriend,setIsFriend] = useState(followings?.find((friend) => friend?._id === friendId))
  // console.log(friendId,'kk');

  const patchFriend = async () => {
    try {
      console.log(friendId,'inside');
      const { data } = await patchDataAPI(
        `/users/${user?._id}/${friendId}`,
        {},
        token
      );
      // dispatch(setFriends({ friends: data }));
      setIsFriend(!isFriend)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getDataAPI(`/users/${userId}`, token);
        setFriendData(data);

        const { data: followersData } = await getDataAPI(
          `/users/${userId}/followers`,
          token
        );
        setFollowers(followersData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  let handleEditClick = () => {
    dispatch(setIsEditing({ isEditing: true }));
  };

  if (!user) {
    return null;
  }
  const {
    firstName,
    lastName,
    location,
    occupation,
  } = user;
  return (
    <WidgetWrapper
    >
      {/* FIRST ROW */}
      <FlexBetween
        gap="0.5rem"
        pb="0.5rem"
        onClick={() => navigate(`/profile/${userId}`)}
      >
        <FlexBetween gap="0.5rem">
          <UserImage
            image={isFriendData ? friendData?.user?.picturePath : picturePath}
            isProfile={!isFriendData && isProfile}
          />
          <Box mb="1rem">
            <Typography
              variant="h4"
              color={dark}
              fontWeight="500"
              sx={{
                "&:hover": {
                  color: palette?.primary?.light,
                  cursor: "pointer",
                },
              }}
            >
              {isFriendData ? friendData?.user?.firstName : firstName}{" "}
              {isFriendData ? friendData?.user?.lastName : lastName}
            </Typography>
            {isFriendData && (
              <Box >
                {isFriend ? <Button onClick={() => patchFriend()}>Unfollow</Button> : <Button onClick={() => patchFriend()}>Follow</Button>}
              </Box>
            )}
          </Box>
        </FlexBetween>
        {isEditUser && (
          <ManageAccountsOutlined
            style={{ cursor: "pointer" }}
            onClick={handleEditClick}
          />
        )}
      {/* {friendData ? <Chat sx={{ margin: "1rem" }} onClick={() => createConverStation(userId)} variant='contained' size='small' >Message</Chat> : ''} */}
      </FlexBetween>
      <Divider />
      {/* SECOND ROW */}
      <Box p="1rem 0">
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <LocationOnOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>
            {isFriendData ? friendData?.user?.location : location}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap="1rem">
          <WorkOutlineOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>
            {isFriendData ? friendData?.user?.occupation : occupation}
          </Typography>
        </Box>
      </Box>
      <Divider />

      {/* THIRD ROW */}
      <Box p="1rem 0">
        <FlexBetween mb="0.5rem">
          <Typography color={medium}>Following</Typography>
          <Typography color={main} fontWeight="500">
            {isFriendData
              ? friendData?.followingCount
              : followers?.followingCount}
          </Typography>
        </FlexBetween>
        <FlexBetween>
          <Typography color={medium}>Followers</Typography>
          <Typography color={main} fontWeight="500">
            {isFriendData
              ? friendData?.followersCount
              : followers?.followersCount}
          </Typography>
        </FlexBetween>
      </Box>

      <Divider />

      {/* FOURTH ROW */}
    </WidgetWrapper>
  );
};
export default UserWidget;