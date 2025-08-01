import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/userContext.jsx";
import axios from "axios";
import "./cssFiles/group.css";
const Group = () => {

    const { user } = useContext(UserContext);
    const isAdmin = user.role === "admin";
    const [groups, setGroups] = useState([]);
    const [name, setName] = useState('');
    const [groupName, setGroupName] = useState("");
    useEffect(() => {
        async function fetchGroupData() {
            try {
                const response = await axios.get("http://localhost:3000/api/v1/group/mygroups", {
                    withCredentials: true,
                });
                const user = response.data;
                setName(user.name);
                setGroups(user.groups || []);
            } catch (error) {
                console.error("Error fetching group data:", error);
            }
        }

        fetchGroupData();
    }, []);

    return (
        <div className="group-container">
            <header className="group-header">
                <h1>Welcome, {name}</h1>
                <h2>Your Groups</h2>
            </header>
            {isAdmin && (
                <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        try {
                            const res = await axios.post(
                                "http://localhost:3000/api/v1/group/create",
                                { name: groupName },
                                { withCredentials: true }
                            );
                            setGroups((prev) => [...prev, res.data.group]); // append new group
                            setGroupName("");
                        } catch (err) {
                            console.error("Error creating group:", err);
                        }
                    }}
                    className="admin-create-form"
                >
                    <input
                        type="text"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        placeholder="Enter group name"
                        required
                    />
                    <button type="submit" className="group-btn-create">Create Group</button>
                </form>
            )}
            <section className="group-section">
                {groups.length === 0 ? (
                    <p className="no-group-text">OOPS! Seems like you haven't joined any group 😔</p>
                ) : (
                    <div className="group-grid">
                        {groups.map((group) => (
                            <GroupCard
                                key={group._id}
                                id={group._id}
                                name={group.name}
                                createdBy={group.createdBy.name}
                                membersCount={group.members.length}
                                filesCount={group.files.length}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

const GroupCard = (props) => {
    const navigate = useNavigate();
    return (
        <div className="group-card">
            <h3>{props.name}</h3>
            <p><strong>Created By:</strong> {props.createdBy}</p>
            <p><strong>Members:</strong> {props.membersCount}</p>
            <p><strong>Files:</strong> {props.filesCount}</p>
            <button className="group-btn-view" onClick={() => navigate(`/usergroups/${props.id}`)}>View Group</button>
            <button clasName="group-btn-upload">Upload File</button>
        </div>
    );
};

export default Group;