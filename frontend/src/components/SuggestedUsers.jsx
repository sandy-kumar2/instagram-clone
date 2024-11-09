import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { followingUpdate } from "../redux/authSlice";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "./ui/button";

const SuggestedUsers = () => {
  const dispatch = useDispatch();
  const { suggestedUsers, user } = useSelector((store) => store.auth);

  const followAndUnfollowHandler = async (targetUserId) => {
    try {
      axios.defaults.withCredentials = true;
      const res = await axios.post(
        `http://localhost:8000/api/v1/user/followorunfollow/${targetUserId}`,
        { id: user?._id }
      );

      dispatch(followingUpdate(targetUserId));  
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="my-10">
      <div className="flex items-center justify-between text-sm">
        <h1 className="font-semibold text-gray-600">Suggested for you</h1>
        <span className="font-medium cursor-pointer">See All</span>
      </div>
      {suggestedUsers.map((suggestedUser) => {
        const isFollowing = user?.following.includes(suggestedUser._id);

        return (
          <div
            key={suggestedUser._id}
            className="flex items-center justify-between my-5"
          >
            <div className="flex items-center gap-2">
              <Link to={`/profile/${suggestedUser?._id}`}>
                <Avatar>
                  <AvatarImage
                    src={suggestedUser?.profilePicture}
                    alt="profile_image"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <h1 className="font-semibold text-sm">
                  <Link to={`/profile/${suggestedUser?._id}`}>
                    {suggestedUser?.username}
                  </Link>
                </h1>
                <span className="text-gray-600 text-sm">
                  {suggestedUser?.bio || "Bio here..."}
                </span>
              </div>
            </div>
           
            {isFollowing ? (
              <Button
                onClick={() => followAndUnfollowHandler(suggestedUser._id)}
                variant="secondary"
                className="h-8"
              >
                Unfollow
              </Button>
            ) : (
              <Button
                onClick={() => followAndUnfollowHandler(suggestedUser._id)}
                className="bg-[#0095F6] hover:bg-[#3192d2] h-8"
              >
                Follow
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SuggestedUsers;
