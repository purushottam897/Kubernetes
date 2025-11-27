import React, { useEffect, useState } from "react";
import "./dstyle.css"; // Import your CSS styles
import SideBar from "./SideBar";
import Navbar from "./Navbar";

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // If you are using JWT, get token from localStorage
        // const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:8082/api/users", {
          // headers: {
          //   "Content-Type": "application/json",
          //   Authorization: token ? `Bearer ${token}` : undefined,
          // },
        });

        if (!res.ok) {
          console.error("Failed to fetch users:", res.status);
          return;
        }

        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  console.log(users);

  return (
    <div style={{ backgroundColor: "#eee" }}>
      <SideBar current={"user"} />
      <section id="content">
        <Navbar />
        <main>
          <div className="table-data" style={{ marginTop: "-10px" }}>
            <div className="order">
              <div className="head">
                <h3>Users Info</h3>
              </div>
              <table
                id="user"
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginTop: "20px",
                }}
              >
                <thead>
                  <tr style={{ borderBottom: "1px solid #ddd" }}>
                    <th
                      style={{
                        padding: "10px",
                        textAlign: "start",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      Username
                    </th>
                    <th
                      style={{
                        padding: "10px",
                        textAlign: "center",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      Email
                    </th>
                    <th
                      style={{
                        padding: "10px",
                        textAlign: "center",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      Phone Number
                    </th>
                    <th
                      style={{
                        padding: "10px",
                        textAlign: "center",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      Profession
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr
                      key={index}
                      style={{ borderBottom: "1px solid #ddd" }}
                    >
                      <td
                        style={{
                          padding: "10px",
                          textAlign: "start",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        {user.username}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          textAlign: "center",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        {user.email}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          textAlign: "center",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        {user.phno}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          textAlign: "center",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        {user.profession}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </section>
    </div>
  );
}

export default Users;
