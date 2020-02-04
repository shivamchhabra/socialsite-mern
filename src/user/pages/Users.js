import React from "react";
import MM from "../pages/mm.jpg";

import UsersList from "../components/UsersList";

const Users = () => {
  const USERS = [
    {
      id: "u1",
      name: "Shivam Chhabra",
      image: { MM },
      places: 1
    }
  ];

  return <UsersList items={USERS} />;
};

export default Users;
