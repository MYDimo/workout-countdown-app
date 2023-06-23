import React from "react";
import "../../styles/avatarStyles.css";
import { UserAuth } from "../../context/AuthContext";

const Avatar = ({ toggleProfile }) => {
	const { user } = UserAuth();
  
	return (
		<div className="avatarWrapper" onClick={toggleProfile}>
			<h2>{user && Object.keys(user).length ? `${user.email[0]}` : '?'}</h2>
		</div>
	);
};

export default Avatar;
