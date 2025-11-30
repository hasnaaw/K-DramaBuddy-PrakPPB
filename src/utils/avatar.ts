import md5 from "md5";

export const getAvatarFromEmail = (email?: string) => {
  if (!email) return "/default-profile.png"; // jika tamu

  const hash = md5(email.trim().toLowerCase());
  return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
};
