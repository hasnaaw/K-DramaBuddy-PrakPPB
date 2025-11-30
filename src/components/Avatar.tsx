import React from "react";
import md5 from "md5";

interface AvatarProps {
  email?: string;
  size?: number;
}

const Avatar: React.FC<AvatarProps> = ({ email, size = 80 }) => {
  const defaultAvatar = `https://ui-avatars.com/api/?name=User&background=0A1A3F&color=fff&size=${size}`;

  if (!email) return <img src={defaultAvatar} className="rounded-full" width={size} height={size} />;

  const hash = md5(email.trim().toLowerCase());
  const gravatarUrl = `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;

  return (
    <img
      src={gravatarUrl}
      alt="Avatar"
      className="rounded-full shadow"
      width={size}
      height={size}
    />
  );
};

export default Avatar;
